/* 売却前おまかせデスク — UI scripts */
(function () {
  'use strict';

  /* ---------- 計測：GA4（gtag）や dataLayer があれば送り、なければ何もしない ----------
     計測ツールを後から入れても、ここを変えずにイベントが届くようにしている。
     すべてのイベントは document の 'osd:track' イベントとしても発行する（検証・他ツール接続用）。 */
  function track(name, params) {
    params = params || {};
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      else if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, params));
    } catch (e) { /* 計測の失敗で画面を止めない */ }
    document.dispatchEvent(new CustomEvent('osd:track', { detail: { name: name, params: params } }));
  }
  window.osdTrack = track;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a) return;
    var p = {};
    if (a.getAttribute('data-track-pos')) p.position = a.getAttribute('data-track-pos');
    track(a.getAttribute('data-track'), p);
  });

  /* ---------- mobile navigation ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var gnav = document.getElementById('gnav');
  if (menuBtn && gnav) {
    var setOpen = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('.menu-btn__label').textContent = open ? '閉じる' : 'メニュー';
      gnav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };
    menuBtn.addEventListener('click', function () { setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    gnav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setOpen(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 1241px)').addEventListener('change', function (mq) { if (mq.matches) setOpen(false); });
  }

  /* ---------- 別ページからのアンカー移動：Webフォント読み込み後に位置を合わせ直す ---------- */
  // 新しく開いたときだけ。再読み込み・戻る操作や、利用者がすでにスクロールした場合はブラウザの位置を優先する
  var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (location.hash && location.hash.length > 1 && document.fonts && document.fonts.ready && (!navEntry || navEntry.type === 'navigate')) {
    var userMoved = false;
    var stop = function () { userMoved = true; };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, stop, { once: true, passive: true }); });
    document.fonts.ready.then(function () {
      var t = document.getElementById(location.hash.slice(1));
      if (t && !userMoved) t.scrollIntoView({ block: 'start' });
    });
  }

  /* ---------- header over the home hero ---------- */
  var siteHeader = document.querySelector('.site-header');
  if (document.body.classList.contains('page-home') && siteHeader) {
    var onScroll = function () { siteHeader.classList.toggle('is-over', window.scrollY < 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- hide mobile CTA near the final CTA / footer ---------- */
  var mobileCta = document.querySelector('.mobile-cta');
  // 常に表示し、案件相談フォーム（または協力事業者の登録フォーム）が画面にある間だけ隠す（入力欄を覆わないため）
  var hideTargets = document.querySelectorAll('#form, #entry');
  if (mobileCta && 'IntersectionObserver' in window && hideTargets.length) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      mobileCta.classList.toggle('is-hidden', visible.size > 0);
    });
    hideTargets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- forms ---------- */
  var MAX_FILES = 10;
  var MAX_SIZE = 10 * 1024 * 1024;
  var FILE_TYPES = /^(image\/(jpeg|png|heic|heif|webp)|application\/pdf)$/;
  var FILE_EXT = /\.(jpe?g|png|heic|heif|webp|pdf)$/i;

  var MESSAGES = {
    required: 'この項目は必須です。',
    choose: '選択してください。',
    email: 'メールアドレスの形式で入力してください（例：name@example.co.jp）。',
    tel: '電話番号は数字10〜11桁で入力してください。',
    agree: '内容をご確認のうえ、チェックを入れてください。'
  };

  function toHalfWidth(s) {
    return s.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
      .replace(/[－ー―‐−–—ｰ]/g, '-')
      .replace(/（/g, '(').replace(/）/g, ')').replace(/　/g, ' ');
  }

  function fieldLabel(form, name) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (/agree$/.test(name)) return '個人情報の取扱いへの同意';
    var lab = wrap && wrap.querySelector('.field__label');
    return lab ? lab.textContent.replace(/必須|任意|推奨/g, '').trim() : name;
  }

  function setError(form, name, msg) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    var err = document.getElementById(name + '-err');
    if (wrap) wrap.classList.toggle('is-invalid', !!msg);
    if (err) err.textContent = msg || '';
    form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
      if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    });
  }

  function validateField(form, name) {
    var els = form.querySelectorAll('[name="' + name + '"]');
    if (!els.length) return '';
    var first = els[0];
    var msg = '';
    if (first.type === 'radio') {
      if (first.required && !form.querySelector('[name="' + name + '"]:checked')) msg = MESSAGES.choose;
    } else if (first.type === 'checkbox') {
      var wrap = form.querySelector('[data-field="' + name + '"]');
      var isReq = (wrap && wrap.querySelector('.req')) || first.required;
      var checked = form.querySelector('[name="' + name + '"]:checked');
      if (/agree$/.test(name) && !checked) msg = MESSAGES.agree;
      else if (isReq && !checked) msg = '1つ以上選択してください。';
    } else if (first.type === 'file') {
      return ''; /* 写真は任意。追加時のエラーは選択時に表示済み */
    } else {
      var v = first.value.trim();
      if (first.required && !v) msg = first.tagName === 'SELECT' ? MESSAGES.choose : MESSAGES.required;
      else if (v && first.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = MESSAGES.email;
      else if (v && first.dataset.type === 'tel') {
        var digits = toHalfWidth(v).replace(/[\s()-]/g, '');
        if (!/^0\d{9,10}$/.test(digits)) msg = MESSAGES.tel;
      }
    }
    setError(form, name, msg);
    return msg;
  }

  function fieldNames(form) {
    var names = [];
    form.querySelectorAll('[name]').forEach(function (el) { if (names.indexOf(el.name) < 0) names.push(el.name); });
    return names;
  }

  /* ---------- 送信先 ----------
     site.config.json の formEndpoint（ビルド時に window.OSD_CONFIG へ出力）に送る。
     未設定のときは送信せず「本番接続前」と表示する。検証時は window.EHIME_FORM_ENDPOINT で上書きできる。
     送信は JSON（Content-Type: text/plain）。Google Apps Script のウェブアプリでも CORS の事前確認なしで受け取れる形式。 */
  var CONFIG = window.OSD_CONFIG || {};
  var ENDPOINT = window.EHIME_FORM_ENDPOINT || CONFIG.formEndpoint || null;
  function postJSON(payload) {
    if (!ENDPOINT) return Promise.resolve({ ok: false, reason: 'not_connected' });
    return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function (r) {
        if (!r.ok) return { ok: false, reason: 'server' };
        return r.text().then(function (t) {
          var data = {};
          try { data = JSON.parse(t); } catch (e) { data = {}; }
          if (data && data.ok === false) return { ok: false, reason: 'server', data: data };
          return { ok: true, data: data };
        });
      })
      .catch(function () { return { ok: false, reason: 'network' }; });
  }
  function formDataToObject(fd) {
    var o = {};
    fd.forEach(function (v, k) {
      if (typeof v !== 'string') return;
      if (o[k] === undefined) o[k] = v; else o[k] = [].concat(o[k], v);
    });
    return o;
  }
  function submitInquiry(fd, kind) {
    var o = formDataToObject(fd);
    o.formType = kind || 'other';
    o.page = location.href;
    return postJSON(o);
  }

  /* エラー要約を、項目の再判定に合わせて更新する（フォーカスは動かさない） */
  function refreshSummary(form) {
    var box = document.querySelector('[data-status-for="' + form.id + '"]');
    // 送信後のエラー要約を表示している間（data-live）だけ更新する。送信完了の表示中は触らない
    if (!box || box.hidden || !box.hasAttribute('data-live')) return;
    var invalid = [];
    // 写真の追加エラーは送信を止めない注意なので、要約には含めない
    form.querySelectorAll('[data-field].is-invalid').forEach(function (w) { if (!w.querySelector('input[type="file"]')) invalid.push(w.getAttribute('data-field')); });
    // 入力中の更新は控えめに読み上げる（role=alert をやめ、aria-live=polite に切り替える）
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    var html;
    if (!invalid.length) {
      box.className = 'form-status';
      html = '<p>入力エラーはすべて解消されました。内容をご確認のうえ、送信してください。</p>';
    } else {
      box.className = 'form-status form-status--error';
      html = summaryHtml(form, invalid.map(function (n) {
        var err = document.getElementById(n + '-err');
        return { name: n, msg: err ? err.textContent : '' };
      }));
    }
    // 内容が変わったときだけ書き換える（同じ内容の再読み上げを防ぐ）
    if (box.getAttribute('data-summary') !== html) {
      box.setAttribute('data-summary', html);
      box.innerHTML = html;
    }
  }

  function summaryHtml(form, errors) {
    var list = errors.map(function (er) {
      var el = form.querySelector('[name="' + er.name + '"]');
      return '<li><a href="#' + (el && el.id ? el.id : '') + '" data-goto="' + er.name + '">' + fieldLabel(form, er.name) + '</a>：' + er.msg + '</li>';
    }).join('');
    return '<h3>入力内容をご確認ください（' + errors.length + '件）</h3><ul>' + list + '</ul>';
  }

  // live: 入力エラーの要約のときだけ true（入力に合わせて要約を更新する）
  function showStatus(form, type, html, live) {
    var box = document.querySelector('[data-status-for="' + form.id + '"]') || form.querySelector('.form-status');
    box.setAttribute('role', 'alert');
    box.removeAttribute('aria-live');
    box.setAttribute('data-summary', html);
    if (live) box.setAttribute('data-live', ''); else box.removeAttribute('data-live');
    if (type === 'done') box.setAttribute('data-done', ''); else box.removeAttribute('data-done');
    box.className = 'form-status' + (type ? ' form-status--' + type : '');
    box.innerHTML = html;
    box.hidden = false;
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-goto]');
    if (!a) return;
    e.preventDefault();
    var el = document.querySelector('[name="' + a.getAttribute('data-goto') + '"]');
    if (el) { el.focus({ preventScroll: true }); (el.closest('.field, .consent') || el).scrollIntoView({ block: 'center' }); }
  });

  document.querySelectorAll('.js-form').forEach(function (form) {
    var touched = {};
    form.addEventListener('blur', function (e) {
      var t = e.target;
      if (!t.name || t.type === 'file') return;
      touched[t.name] = true;
      validateField(form, t.name);
      refreshSummary(form);
    }, true);
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name && (t.type === 'radio' || t.type === 'checkbox' || t.tagName === 'SELECT')) { validateField(form, t.name); refreshSummary(form); }
    });
    form.addEventListener('input', function (e) {
      var t = e.target;
      var sbox = document.querySelector('[data-status-for="' + form.id + '"]');
      if (sbox && sbox.hasAttribute('data-done')) { sbox.hidden = true; sbox.removeAttribute('data-done'); }
      // エラー表示中の項目は入力のたびに再判定し、直った時点でメッセージを消す（離脱時のレイアウトのずれを防ぐ）
      var wrap = t.name && form.querySelector('[data-field="' + t.name + '"]');
      if (t.name && (touched[t.name] || (wrap && wrap.classList.contains('is-invalid')))) { validateField(form, t.name); refreshSummary(form); }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errors = [];
      fieldNames(form).forEach(function (n) {
        var m = validateField(form, n);
        if (m) errors.push({ name: n, msg: m });
      });
      if (errors.length) {
        showStatus(form, 'error', summaryHtml(form, errors), true);
        return;
      }
      var fd = new FormData(form);
      // 電話番号は半角数字のみ（例：0899123456）に正規化して送る
      form.querySelectorAll('[data-type="tel"]').forEach(function (el) { fd.set(el.name, toHalfWidth(el.value).replace(/\D/g, '')); });
      var input = form.querySelector('input[type="file"]');
      if (input && input._files) { fd.delete(input.name); input._files.forEach(function (f) { fd.append(input.name, f); }); }
      var btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      submitInquiry(fd, form.getAttribute('data-form')).then(function (res) {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        if (res.ok) {
          showStatus(form, 'done', '<h3>送信しました</h3><p>内容を確認のうえ、担当者からご連絡します。</p>');
          form.reset();
          // 次の相談に前回の写真や入力状態が残らないよう、写真の選択と判定状態も初期化する
          touched = {};
          form.dispatchEvent(new CustomEvent('form:cleared'));
        } else if (res.reason === 'not_connected') {
          showStatus(form, 'done', '<h3>入力内容の確認が完了しました</h3><p>本サイトは営業提案用のデモサイトのため、フォームは送信先に接続されていません（本番接続前）。実際の送信は行われていません。</p>');
        } else if (res.reason === 'network') {
          showStatus(form, 'error', '<h3>送信できませんでした</h3><p>通信に失敗しました。インターネット接続をご確認のうえ、もう一度お試しください。入力内容は保持されています。</p>');
        } else {
          showStatus(form, 'error', '<h3>送信できませんでした</h3><p>時間をおいて、もう一度お試しください。入力内容は保持されています。</p>');
        }
      });
    });

    /* ---------- photo upload ---------- */
    var upload = form.querySelector('.js-upload');
    if (!upload) return;
    var input = upload.querySelector('input[type="file"]');
    var thumbs = form.querySelector('.js-thumbs');
    input._files = [];

    function render() {
      thumbs.innerHTML = '';
      input._files.forEach(function (f, i) {
        var li = document.createElement('li');
        if (/^image\/(jpeg|png|webp)$/.test(f.type)) {
          var img = document.createElement('img');
          img.alt = '';
          img.src = URL.createObjectURL(f);
          img.onload = function () { URL.revokeObjectURL(img.src); };
          li.appendChild(img);
        } else {
          var ph = document.createElement('div');
          ph.className = 'thumbs__file';
          ph.textContent = /pdf$/i.test(f.name) ? 'PDF' : 'FILE';
          li.appendChild(ph);
        }
        var name = document.createElement('span');
        name.textContent = f.name;
        li.appendChild(name);
        var del = document.createElement('button');
        del.type = 'button';
        del.setAttribute('aria-label', f.name + ' を削除');
        del.textContent = '×';
        del.addEventListener('click', function () { input._files.splice(i, 1); input._fileError = ''; setError(form, input.name, ''); render(); input.focus(); });
        li.appendChild(del);
        thumbs.appendChild(li);
      });
      upload.querySelector('.upload__btn').textContent = input._files.length ? '写真・ファイルを追加する（' + input._files.length + '件選択中）' : '写真・ファイルを選ぶ';
    }

    function addFiles(list) {
      var rejected = [];
      Array.prototype.forEach.call(list, function (f) {
        if (!(FILE_TYPES.test(f.type) || FILE_EXT.test(f.name))) rejected.push(f.name + '（対応していない形式）');
        else if (f.size > MAX_SIZE) rejected.push(f.name + '（10MBを超えています）');
        else if (input._files.length >= MAX_FILES) rejected.push(f.name + '（上限の10件を超えています）');
        else input._files.push(f);
      });
      input._fileError = rejected.length ? '追加できなかったファイルがあります：' + rejected.join('、') : '';
      setError(form, input.name, input._fileError);
      render();
    }

    input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
    form.addEventListener('form:cleared', function () { input._files = []; input._fileError = ''; setError(form, input.name, ''); render(); });
    ['dragenter', 'dragover'].forEach(function (ev) { upload.addEventListener(ev, function (e) { e.preventDefault(); upload.classList.add('is-drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { upload.addEventListener(ev, function (e) { e.preventDefault(); upload.classList.remove('is-drag'); }); });
    upload.addEventListener('drop', function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });
  });

  /* =====================================================================
     案件相談フォーム（3ステップ・同一ページ）
     ===================================================================== */
  var caseForm = document.getElementById('case-form');
  if (caseForm) (function (form) {
    var DRAFT_KEY = 'osd-case-draft-v1';
    var PHOTO_MAX = 10;
    var PHOTO_RAW_MAX = 20 * 1024 * 1024;  // 元ファイルの上限（スマホ写真を想定）
    var PHOTO_EDGE = 1600;                 // 送信前に長辺1600pxへ縮小する
    var steps = form.querySelectorAll('.cstep');
    var indicators = document.querySelectorAll('[data-step-ind]');
    var statusBox = document.querySelector('[data-status-for="case-form"]');
    var done = document.getElementById('case-done');
    var current = 1;
    var started = false;
    var photos = [];   // { file, name, dataUrl(縮小後), w, h }

    function storage() { try { return window.localStorage; } catch (e) { return null; } }

    /* ---- 入力チェック ---- */
    function stepFields(n) {
      var names = [];
      steps[n - 1].querySelectorAll('[data-field]').forEach(function (w) { names.push(w.getAttribute('data-field')); });
      return names;
    }
    function check(name) {
      if (name === 'contact') {
        var tel = form.tel.value.trim(), mail = form.email.value.trim(), msg = '';
        if (!tel && !mail) msg = '電話番号かメールアドレスのどちらかを入力してください。';
        else if (tel && !/^0\d{9,10}$/.test(toHalfWidth(tel).replace(/[\s()-]/g, ''))) msg = MESSAGES.tel;
        else if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) msg = MESSAGES.email;
        var w = form.querySelector('[data-field="contact"]');
        w.classList.toggle('is-invalid', !!msg);
        document.getElementById('contact-err').textContent = msg;
        [form.tel, form.email].forEach(function (el) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); });
        return msg;
      }
      if (name === 'services') {
        var m = form.querySelector('[name="services"]:checked') ? '' : '相談したい作業を1つ以上選んでください。';
        setError(form, 'services', m);
        return m;
      }
      if (name === 'photos') return '';
      return validateField(form, name);
    }
    function checkStep(n) {
      var bad = [];
      stepFields(n).forEach(function (f) { if (check(f)) bad.push(f); });
      return bad;
    }
    function focusField(name) {
      var el = name === 'contact' ? form.tel : form.querySelector('[name="' + name + '"]');
      if (!el) return;
      el.focus({ preventScroll: true });
      (el.closest('.field') || el).scrollIntoView({ block: 'center' });
    }

    /* ---- ステップ切り替え ---- */
    function go(n, opts) {
      opts = opts || {};
      current = n;
      steps.forEach(function (fs) { fs.hidden = Number(fs.getAttribute('data-step')) !== n; });
      indicators.forEach(function (li) {
        var k = Number(li.getAttribute('data-step-ind'));
        li.classList.toggle('is-done', k < n);
        if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      if (statusBox) statusBox.hidden = true;
      saveDraft();
      if (!opts.silent) {
        var legend = steps[n - 1].querySelector('.cstep__legend');
        document.querySelector('.stepper').scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        legend.setAttribute('tabindex', '-1');
        legend.focus({ preventScroll: true });
      }
    }
    form.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]');
      var prev = e.target.closest('[data-prev]');
      if (next) {
        var bad = checkStep(current);
        if (bad.length) { focusField(bad[0]); return; }
        go(Number(next.getAttribute('data-next')));
      } else if (prev) {
        go(Number(prev.getAttribute('data-prev')));
      }
    });

    /* ---- 入力中の再判定・下書き保存・計測 ---- */
    function markStart() { if (!started) { started = true; track('form_start'); } }
    form.addEventListener('focusin', markStart);
    form.addEventListener('input', function (e) {
      markStart();
      var t = e.target;
      var group = t.getAttribute && t.getAttribute('data-group');
      var key = group || t.name;
      var w = key && form.querySelector('[data-field="' + key + '"]');
      if (w && w.classList.contains('is-invalid')) check(key);
      saveDraft();
    });
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'services') { check('services'); if (t.checked) track('service_select', { service: t.value }); }
      else if (t.name && t.type !== 'file') { var w = form.querySelector('[data-field="' + t.name + '"]'); if (w && w.classList.contains('is-invalid')) check(t.name); }
      saveDraft();
    });
    form.addEventListener('blur', function (e) {
      var t = e.target;
      if (!t.name || t.type === 'file' || t.type === 'checkbox' || t.type === 'radio') return;
      var key = t.getAttribute('data-group') || t.name;
      if (key === 'contact' && (!form.tel.value.trim() && !form.email.value.trim())) return; // 片方入力中は急かさない
      if (t.value.trim() || form.querySelector('[data-field="' + key + '"]').classList.contains('is-invalid')) check(key);
    }, true);

    function saveDraft() {
      var st = storage(); if (!st) return;
      var data = { step: current, v: {} };
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'file' || el.name === 'website') return;
        if (el.type === 'checkbox') { (data.v[el.name] = data.v[el.name] || []); if (el.checked) data.v[el.name].push(el.value); }
        else if (el.type === 'radio') { if (el.checked) data.v[el.name] = el.value; }
        else data.v[el.name] = el.value;
      });
      try { st.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* 保存できなくても入力は続けられる */ }
    }
    function restoreDraft() {
      var st = storage(); if (!st) return false;
      var raw; try { raw = st.getItem(DRAFT_KEY); } catch (e) { return false; }
      if (!raw) return false;
      var data; try { data = JSON.parse(raw); } catch (e) { return false; }
      var any = false;
      Object.keys(data.v || {}).forEach(function (k) {
        var val = data.v[k];
        form.querySelectorAll('[name="' + k + '"]').forEach(function (el) {
          if (el.type === 'checkbox') { el.checked = Array.isArray(val) && val.indexOf(el.value) >= 0; if (el.checked) any = true; }
          else if (el.type === 'radio') { el.checked = el.value === val; if (el.checked) any = true; }
          else { el.value = val || ''; if (val) any = true; }
        });
      });
      if (any && data.step >= 1 && data.step <= 3) go(data.step, { silent: true });
      return any;
    }
    function clearDraft() { var st = storage(); if (st) try { st.removeItem(DRAFT_KEY); } catch (e) { /* noop */ } }
    if (restoreDraft()) document.getElementById('draft-note').hidden = false;
    document.getElementById('draft-clear').addEventListener('click', function () {
      form.reset(); photos = []; renderPhotos(); clearDraft(); go(1, { silent: true });
      form.querySelectorAll('.is-invalid').forEach(function (w) { w.classList.remove('is-invalid'); });
      form.querySelectorAll('.field__err').forEach(function (p) { p.textContent = ''; });
      document.getElementById('draft-note').hidden = true;
    });

    /* ---- 写真：選択→縮小→プレビュー ---- */
    var input = document.getElementById('photos');
    var thumbs = form.querySelector('.js-thumbs');
    var upBtn = form.querySelector('.upload__btn');
    function shrink(file) {
      return new Promise(function (resolve) {
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () {
          var r = Math.min(1, PHOTO_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
          var c = document.createElement('canvas');
          c.width = Math.round(img.naturalWidth * r); c.height = Math.round(img.naturalHeight * r);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve({ dataUrl: c.toDataURL('image/jpeg', 0.82), w: c.width, h: c.height });
        };
        img.onerror = function () {
          // ブラウザが表示できない形式（Chrome の HEIC など）は、元のファイルのまま送る
          URL.revokeObjectURL(url);
          var fr = new FileReader();
          fr.onload = function () { resolve({ dataUrl: fr.result, w: 0, h: 0, raw: true }); };
          fr.onerror = function () { resolve(null); };
          fr.readAsDataURL(file);
        };
        img.src = url;
      });
    }
    function renderPhotos() {
      thumbs.innerHTML = '';
      photos.forEach(function (p, i) {
        var li = document.createElement('li');
        if (p.dataUrl && /^data:image\/(jpeg|png|webp|gif)/.test(p.dataUrl)) {
          var im = document.createElement('img'); im.alt = p.name; im.src = p.dataUrl; li.appendChild(im);
        } else {
          var ph = document.createElement('div'); ph.className = 'thumbs__file'; ph.textContent = (p.name.split('.').pop() || 'FILE').toUpperCase(); li.appendChild(ph);
        }
        var nm = document.createElement('span'); nm.textContent = p.name; li.appendChild(nm);
        var del = document.createElement('button'); del.type = 'button'; del.textContent = '×';
        del.setAttribute('aria-label', p.name + ' を削除');
        del.addEventListener('click', function () { photos.splice(i, 1); setError(form, 'photos', ''); renderPhotos(); input.focus(); });
        li.appendChild(del);
        thumbs.appendChild(li);
      });
      upBtn.textContent = photos.length ? '写真を追加する（' + photos.length + ' / ' + PHOTO_MAX + '枚）' : '写真を選ぶ・撮る';
    }
    function addPhotos(list) {
      markStart();
      var files = Array.prototype.slice.call(list);
      var rejected = [];
      var jobs = [];
      files.forEach(function (f) {
        var isImg = /^image\//.test(f.type) || /\.(jpe?g|png|heic|heif|webp)$/i.test(f.name);
        if (!isImg) { rejected.push(f.name + '（写真ではありません）'); return; }
        if (f.size > PHOTO_RAW_MAX) { rejected.push(f.name + '（20MBを超えています）'); return; }
        if (photos.length + jobs.length >= PHOTO_MAX) { rejected.push(f.name + '（上限の' + PHOTO_MAX + '枚を超えています）'); return; }
        jobs.push(shrink(f).then(function (r) { return r ? { file: f, name: f.name, dataUrl: r.dataUrl, w: r.w, h: r.h } : null; }));
      });
      upBtn.textContent = '写真を読み込んでいます…';
      Promise.all(jobs).then(function (list2) {
        var added = list2.filter(Boolean);
        photos = photos.concat(added);
        setError(form, 'photos', rejected.length ? '追加できなかった写真があります：' + rejected.join('、') : '');
        renderPhotos();
        if (added.length) track('photo_upload', { count: added.length, total: photos.length });
      });
    }
    input.addEventListener('change', function () { addPhotos(input.files); input.value = ''; });
    var up = form.querySelector('.js-upload');
    ['dragenter', 'dragover'].forEach(function (ev) { up.addEventListener(ev, function (e) { e.preventDefault(); up.classList.add('is-drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { up.addEventListener(ev, function (e) { e.preventDefault(); up.classList.remove('is-drag'); }); });
    up.addEventListener('drop', function (e) { if (e.dataTransfer) addPhotos(e.dataTransfer.files); });

    /* ---- 送信 ---- */
    function showError(html) {
      statusBox.className = 'form-status form-status--error';
      statusBox.innerHTML = html;
      statusBox.hidden = false;
      statusBox.focus({ preventScroll: true });
      statusBox.scrollIntoView({ block: 'center' });
    }
    function today() {
      var d = new Date();
      return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    }
    function showDone(caseId, demo) {
      form.hidden = true;
      document.querySelector('.stepper').hidden = true;
      statusBox.hidden = true;
      document.getElementById('draft-note').hidden = true;
      done.hidden = false;
      done.classList.toggle('is-demo', !!demo);
      document.getElementById('case-id').textContent = caseId || '担当者からお知らせします';
      document.getElementById('case-copy').hidden = !caseId || !!demo;
      document.getElementById('case-text').textContent = demo
        ? 'このサイトは営業提案用のデモで、送信先に接続していないため、実際には送信されていません。本番では、受付ごとに上の形式の案件番号を発行してお知らせします。'
        : '内容を確認し、担当者からご連絡します。お問い合わせの際は、案件番号をお伝えください。';
      done.querySelector('.case-done__label').textContent = demo ? '入力内容の確認まで完了しました（デモ）' : 'ご相談を受け付けました';
      done.querySelector('.case-done__id-label').textContent = demo ? '案件番号の表示例' : '案件番号';
      done.focus({ preventScroll: true });
      done.scrollIntoView({ block: 'center' });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      for (var n = 1; n <= 3; n++) {
        var bad = checkStep(n);
        if (bad.length) {
          if (n !== current) go(n, { silent: true });
          showError('<h3>入力内容をご確認ください</h3><p>' + (n < 3 ? 'STEP ' + n + ' に未入力の項目があります。' : '赤く表示された項目をご確認ください。') + '</p>');
          focusField(bad[0]);
          return;
        }
      }
      if (form.website.value) return; // スパム対策（人には見えない欄）
      var btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return;
      var fd = new FormData(form);
      var payload = formDataToObject(fd);
      payload.services = fd.getAll('services');
      payload.tel = toHalfWidth(form.tel.value).replace(/\D/g, '');
      payload.email = form.email.value.trim();
      payload.formType = 'case';
      payload.page = location.href;
      payload.photos = photos.map(function (p) { return { name: p.name, dataUrl: p.dataUrl }; });
      delete payload.website;
      if (!ENDPOINT) {
        track('form_submit', { mode: 'demo', services: payload.services.join(','), photos: photos.length });
        showDone((CONFIG.casePrefix || 'MAT') + '-' + today() + '-001', true);
        return;
      }
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = '送信しています…';
      postJSON(payload).then(function (res) {
        btn.disabled = false; btn.removeAttribute('aria-busy'); btn.textContent = 'この内容で相談を送る';
        if (res.ok) {
          var id = res.data && res.data.caseId;
          track('form_submit', { mode: 'live', services: payload.services.join(','), photos: photos.length, case_id: id || '' });
          clearDraft();
          showDone(id, false);
        } else if (res.reason === 'network') {
          showError('<h3>送信できませんでした</h3><p>通信に失敗しました。電波の良い場所で、もう一度お試しください。入力内容と写真は保持されています。</p>');
        } else {
          showError('<h3>送信できませんでした</h3><p>時間をおいて、もう一度お試しください。入力内容と写真は保持されています。</p>');
        }
      });
    });

    document.getElementById('case-copy').addEventListener('click', function () {
      var id = document.getElementById('case-id').textContent;
      var b = this;
      var ok = function () { b.textContent = 'コピーしました'; };
      if (navigator.clipboard) navigator.clipboard.writeText(id).then(ok, function () {}); 
    });
    document.getElementById('case-again').addEventListener('click', function () {
      form.reset(); photos = []; renderPhotos(); clearDraft();
      form.querySelectorAll('.is-invalid').forEach(function (w) { w.classList.remove('is-invalid'); });
      form.querySelectorAll('.field__err').forEach(function (p) { p.textContent = ''; });
      done.hidden = true; form.hidden = false; document.querySelector('.stepper').hidden = false;
      started = false;
      go(1);
    });
  })(caseForm);
})();
