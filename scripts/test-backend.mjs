// backend/google-apps-script/Code.gs を、Google のサービスを模したオブジェクトの上で実行して検証する。
// 実際の Google 環境での動作確認（デプロイ後）は backend/google-apps-script/README.md の手順で行う。
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function makeEnv() {
  const props = { SHEET_ID: 'sheet1', PHOTO_FOLDER_ID: 'folder1', CASE_PREFIX: 'MAT', NOTIFY_EMAIL: 'desk@example.com' };
  const rows = { 案件: [], 協力事業者: [] };
  const files = [];
  const mails = [];
  let locked = false;
  const env = {
    console: { error: () => {}, log: console.log },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock: () => { assert.equal(locked, false); locked = true; }, releaseLock: () => { locked = false; } }) },
    Utilities: {
      formatDate: (d, tz, f) => {
        const j = new Date(d.getTime() + 9 * 3600e3);
        const p = (n) => String(n).padStart(2, '0');
        return f.replace('yyyy', j.getUTCFullYear()).replace('MM', p(j.getUTCMonth() + 1)).replace('dd', p(j.getUTCDate())).replace('HH', p(j.getUTCHours())).replace('mm', p(j.getUTCMinutes())).replace('ss', p(j.getUTCSeconds()));
      },
      base64Decode: (b) => Buffer.from(b, 'base64'),
      newBlob: (bytes, type, name) => ({ bytes, type, name }),
    },
    SpreadsheetApp: { openById: (id) => { assert.equal(id, 'sheet1'); return { getSheetByName: (n) => ({ appendRow: (r) => rows[n].push(r) }) }; } },
    DriveApp: { getFolderById: (id) => ({ createFolder: (name) => ({ createFile: (blob) => files.push({ folder: name, ...blob }), getUrl: () => 'https://drive.example/' + name }) }) },
    MailApp: { sendEmail: (m) => mails.push(m) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ text: t, setMimeType() { return this; } }) },
  };
  vm.createContext(env);
  vm.runInContext(readFileSync(new URL('../backend/google-apps-script/Code.gs', import.meta.url), 'utf8'), env);
  const post = (obj) => JSON.parse(env.doPost({ postData: { contents: JSON.stringify(obj) } }).text);
  return { env, post, rows, files, mails, props };
}

const png = 'data:image/jpeg;base64,' + Buffer.from('fake-jpeg-bytes').toString('base64');
const base = { formType: 'case', company: '松山不動産', name: '山田', tel: '0899123456', email: '', area: '松山市', services: ['残置物・片付け', '空室清掃'], note: '相続物件', page: 'https://example/#form' };
let passed = 0;
const t = (name, fn) => { fn(); passed++; console.log('ok -', name); };

const { post, rows, files, mails, props } = makeEnv();
t('valid case returns sequential case number', () => {
  const r1 = post({ ...base, photos: [{ name: 'a.jpg', dataUrl: png }, { name: 'b.jpg', dataUrl: png }] });
  assert.equal(r1.ok, true);
  assert.match(r1.caseId, /^MAT-\d{8}-001$/);
  const r2 = post({ ...base, tel: '', email: 'info@example.co.jp' });
  assert.match(r2.caseId, /^MAT-\d{8}-002$/);
});
t('case row is saved with all fields', () => {
  assert.equal(rows['案件'].length, 2);
  const r = rows['案件'][0];
  assert.equal(r[2], '松山不動産'); assert.equal(r[6], '松山市'); assert.equal(r[11], '残置物・片付け、空室清掃'); assert.equal(r[13], 2); assert.equal(r[16], '未対応');
});
t('photos are stored in a per-case folder', () => {
  assert.equal(files.length, 2);
  assert.match(files[0].folder, /^MAT-\d{8}-001$/);
  assert.equal(files[0].type, 'image/jpeg');
});
t('notification email is sent with the case number', () => {
  assert.equal(mails.length, 2);
  assert.equal(mails[0].to, 'desk@example.com');
  assert.match(mails[0].subject, /MAT-\d{8}-001/);
  assert.match(mails[0].body, /相談内容：残置物・片付け、空室清掃/);
});
t('missing contact (no tel and no email) is rejected', () => {
  const r = post({ ...base, tel: '', email: '' });
  assert.equal(r.ok, false); assert.deepEqual(r.fields, ['contact']);
  assert.equal(rows['案件'].length, 2);
});
t('missing services / area are rejected', () => {
  const r = post({ ...base, services: [], area: '' });
  assert.equal(r.ok, false); assert.ok(r.fields.includes('services') && r.fields.includes('area'));
});
t('honeypot submissions are dropped silently', () => {
  const r = post({ ...base, website: 'spam' });
  assert.equal(r.ok, true); assert.equal(r.caseId, undefined); assert.equal(rows['案件'].length, 2);
});
t('more than 10 photos is rejected', () => {
  const r = post({ ...base, photos: Array.from({ length: 11 }, (_, i) => ({ name: i + '.jpg', dataUrl: png })) });
  assert.equal(r.ok, false);
});
t('partner registration is stored in its own sheet', () => {
  const r = post({ formType: 'partner', p_company: '草刈り屋', p_name: '佐藤', p_tel: '0899000000', p_email: 'a@b.jp', p_trades: ['草刈り・外回り'], p_city: '松山市' });
  assert.equal(r.ok, true); assert.match(r.caseId, /^PTN-\d{8}-001$/);
  assert.equal(rows['協力事業者'].length, 1);
});
t('sequence counter is stored per day', () => {
  assert.ok(Object.keys(props).some((k) => /^SEQ_MAT_\d{8}$/.test(k) && props[k] === '2'));
});
t('broken JSON returns an error, not an exception', () => {
  const { env } = makeEnv();
  const r = JSON.parse(env.doPost({ postData: { contents: '{bad' } }).text);
  assert.equal(r.ok, false);
});
console.log(`backend tests passed: ${passed}`);
