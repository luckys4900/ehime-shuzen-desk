/**
 * 愛媛修繕デスク／売却前おまかせデスク — 案件受付（Google Apps Script ウェブアプリ・2サイト共通）
 *
 * 2つのサイトのフォームから届いた案件を、どちらのサイトから来たか（business_line）を付けて
 *   1) 案件番号（例：MAT-20261005-001）を発番し
 *   2) スプレッドシートの「案件」シートに1行追加し
 *   3) 写真を Google ドライブの案件ごとのフォルダに保存し
 *   4) 通知メールを送り
 *   5) 案件番号をサイトへ返す
 * 最小構成です。設定手順は同じフォルダの README.md を参照してください。
 */

var TZ = 'Asia/Tokyo';
var MAX_PHOTOS = 10;
var MAX_PHOTO_BYTES = 8 * 1024 * 1024;
// 案件台帳の列。前半はフォームから自動で入り、「対応状況」以降は営業比較のために人が記入する
var CASE_HEADERS = [
  '受付日時', '案件番号', 'サービス', 'サービス区分', '会社名', 'ご担当者名', '電話番号', 'メールアドレス', '業種',
  '物件エリア', '物件住所', '物件・建物種別', '使用状況', '売却工程', '物件の状況', '緊急度', '普段の施工会社で対応できない理由',
  '希望時期', '相談内容', '補足説明', '写真枚数', '写真フォルダ', '流入元', '送信元ページ',
  '対応状況', '見積日', '見積金額', '成約', '成約金額', '粗利', '再依頼', 'メモ'
];
// サイトから届く business_line と、台帳に表示するサービス名
var BUSINESS_LINES = { repair_desk: '愛媛修繕デスク', sale_support: '売却前おまかせデスク' };
var PARTNER_HEADERS = ['受付日時', '受付番号', '会社名・屋号', 'ご担当者名', '電話番号', 'メールアドレス', '所在地', '対応できる作業', '保有している許可・資格', '対応可能なエリア', 'その他', '送信元ページ'];

function props_() { return PropertiesService.getScriptProperties(); }
function prop_(k, dflt) { var v = props_().getProperty(k); return v === null || v === undefined || v === '' ? dflt : v; }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function str_(v, max) { v = v === undefined || v === null ? '' : String(v); return v.slice(0, max || 2000); }
function list_(v) { return Array.isArray(v) ? v.map(function (x) { return str_(x, 100); }) : (v ? [str_(v, 100)] : []); }

/** 初回のみ実行：台帳スプレッドシートと写真フォルダを作成し、設定を保存する */
function setup() {
  var p = props_();
  if (!p.getProperty('SHEET_ID')) {
    var ss = SpreadsheetApp.create('愛媛修繕デスク・売却前おまかせデスク 案件台帳');
    var cases = ss.getSheets()[0];
    cases.setName('案件');
    cases.appendRow(CASE_HEADERS);
    cases.setFrozenRows(1);
    var partners = ss.insertSheet('協力事業者');
    partners.appendRow(PARTNER_HEADERS);
    partners.setFrozenRows(1);
    p.setProperty('SHEET_ID', ss.getId());
  }
  if (!p.getProperty('PHOTO_FOLDER_ID')) {
    p.setProperty('PHOTO_FOLDER_ID', DriveApp.createFolder('愛媛修繕デスク・売却前おまかせデスク 案件写真').getId());
  }
  if (!p.getProperty('CASE_PREFIX')) p.setProperty('CASE_PREFIX', 'MAT');
  return { sheetId: p.getProperty('SHEET_ID'), photoFolderId: p.getProperty('PHOTO_FOLDER_ID') };
}

/** 日ごとの連番で受付番号を発番する（同時送信に備えてロックする） */
function nextId_(prefix, now) {
  var day = Utilities.formatDate(now, TZ, 'yyyyMMdd');
  var key = 'SEQ_' + prefix + '_' + day;
  var n = Number(prop_(key, '0')) + 1;
  props_().setProperty(key, String(n));
  var seq = String(n);
  while (seq.length < 3) seq = '0' + seq;
  return prefix + '-' + day + '-' + seq;
}

function validateCase_(d) {
  var errors = [];
  if (!str_(d.company).trim()) errors.push('company');
  if (!str_(d.name).trim()) errors.push('name');
  if (!str_(d.tel).trim() && !str_(d.email).trim()) errors.push('contact');
  if (!str_(d.area).trim()) errors.push('area');
  if (!list_(d.services).length) errors.push('services');
  if (Array.isArray(d.photos) && d.photos.length > MAX_PHOTOS) errors.push('photos');
  return errors;
}

function savePhotos_(caseId, photos) {
  if (!Array.isArray(photos) || !photos.length) return { count: 0, url: '' };
  var root = DriveApp.getFolderById(prop_('PHOTO_FOLDER_ID'));
  var folder = root.createFolder(caseId);
  var count = 0;
  photos.slice(0, MAX_PHOTOS).forEach(function (p, i) {
    var m = /^data:([\w\/+.-]+);base64,(.+)$/.exec(str_(p && p.dataUrl, 30 * 1024 * 1024));
    if (!m) return;
    var bytes = Utilities.base64Decode(m[2]);
    if (bytes.length > MAX_PHOTO_BYTES) return;
    var ext = m[1] === 'image/jpeg' ? '.jpg' : '';
    var name = String(i + 1).padStart ? String(i + 1).padStart(2, '0') : ('0' + (i + 1)).slice(-2);
    folder.createFile(Utilities.newBlob(bytes, m[1], name + '_' + str_(p.name, 80).replace(/[\\\/:*?"<>|]/g, '_') + (ext && !/\.jpe?g$/i.test(p.name || '') ? ext : '')));
    count++;
  });
  return { count: count, url: folder.getUrl() };
}

function notify_(subject, lines) {
  var to = prop_('NOTIFY_EMAIL', '');
  if (!to) return false;
  MailApp.sendEmail({ to: to, subject: subject, body: lines.join('\n') });
  return true;
}

function handleCase_(d, now) {
  var errors = validateCase_(d);
  if (errors.length) return { ok: false, error: 'invalid', fields: errors };
  var line = BUSINESS_LINES[d.business_line] ? d.business_line : 'unknown';
  var lineName = BUSINESS_LINES[line] || '不明';
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var caseId;
  try { caseId = nextId_(prop_('CASE_PREFIX', 'MAT'), now); } finally { lock.releaseLock(); }
  var photos = savePhotos_(caseId, d.photos);
  var services = list_(d.services).join('、');
  var v = {
    '受付日時': Utilities.formatDate(now, TZ, 'yyyy/MM/dd HH:mm:ss'), '案件番号': caseId, 'サービス': lineName, 'サービス区分': line,
    '会社名': str_(d.company, 200), 'ご担当者名': str_(d.name, 100), '電話番号': str_(d.tel, 30), 'メールアドレス': str_(d.email, 200), '業種': str_(d.segment, 50),
    '物件エリア': str_(d.area, 50), '物件住所': str_(d.address, 300), '物件・建物種別': str_(d.ptype, 30), '使用状況': str_(d.occupancy, 30),
    '売却工程': str_(d.status, 30), '物件の状況': list_(d.features).join('、'), '緊急度': str_(d.urgency, 50), '普段の施工会社で対応できない理由': list_(d.reason).join('、'),
    '希望時期': str_(d.timing, 30), '相談内容': services, '補足説明': str_(d.note, 3000), '写真枚数': photos.count, '写真フォルダ': photos.url,
    '流入元': str_(d.entry, 500), '送信元ページ': str_(d.page, 300), '対応状況': '未対応'
  };
  var row = CASE_HEADERS.map(function (h) { return v[h] === undefined ? '' : v[h]; });
  SpreadsheetApp.openById(prop_('SHEET_ID')).getSheetByName('案件').appendRow(row);
  var lines = ['【' + lineName + '】に案件相談が届きました。', ''];
  // 入力のあった項目だけを載せる（サービスごとに質問が異なるため）
  CASE_HEADERS.slice(0, 24).forEach(function (h) { if (['受付日時', 'サービス区分', '写真フォルダ'].indexOf(h) < 0 && v[h] !== '' && v[h] !== undefined) lines.push(h + '：' + v[h]); });
  lines.push('写真フォルダ：' + (photos.url || '－'), '', '台帳：https://docs.google.com/spreadsheets/d/' + prop_('SHEET_ID') + '/edit');
  notify_('【案件相談｜' + lineName + '】' + caseId + '｜' + str_(d.company, 60) + '｜' + services, lines);
  return { ok: true, caseId: caseId };
}

function handlePartner_(d, now) {
  if (!str_(d.p_company).trim() || !str_(d.p_name).trim() || !str_(d.p_tel).trim() || !str_(d.p_email).trim() || !list_(d.p_trades).length) return { ok: false, error: 'invalid' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var id;
  try { id = nextId_('PTN', now); } finally { lock.releaseLock(); }
  var row = [Utilities.formatDate(now, TZ, 'yyyy/MM/dd HH:mm:ss'), id, str_(d.p_company, 200), str_(d.p_name, 100), str_(d.p_tel, 30), str_(d.p_email, 200), str_(d.p_city, 100), list_(d.p_trades).join('、'), str_(d.p_license, 2000), list_(d.p_area).join('、'), str_(d.p_note, 2000), str_(d.page, 300)];
  SpreadsheetApp.openById(prop_('SHEET_ID')).getSheetByName('協力事業者').appendRow(row);
  notify_('【協力事業者の登録相談】' + id + '｜' + row[2], ['協力事業者の登録相談が届きました。', '', '受付番号：' + id, '会社名・屋号：' + row[2], 'ご担当者名：' + row[3], '電話番号：' + row[4], 'メールアドレス：' + row[5], '対応できる作業：' + row[7], '保有している許可・資格：' + (row[8] || '－')]);
  return { ok: true, caseId: id };
}

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ ok: true });              // スパム対策：人には見えない欄が入力されていたら黙って破棄
    var now = new Date();
    if (d.formType === 'case') return json_(handleCase_(d, now));
    if (d.formType === 'partner') return json_(handlePartner_(d, now));
    return json_({ ok: false, error: 'unknown_form' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

/** ブラウザで URL を開いたときの動作確認用 */
function doGet() { return json_({ ok: true, service: '愛媛修繕デスク・売却前おまかせデスク 案件受付' }); }
