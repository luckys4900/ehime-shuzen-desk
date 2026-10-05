/* 愛媛修繕デスク — UI scripts */
(function () {
  'use strict';

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
  if (location.hash && location.hash.length > 1 && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      var t = document.getElementById(location.hash.slice(1));
      if (t) t.scrollIntoView({ block: 'start' });
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
  var hideTargets = document.querySelectorAll('.cta, .site-footer, .hero__actions, .phero .btn-row, .inline-cta, #entry');
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

  /* 送信処理は本番接続前のため分離しています。
     本番では ENDPOINT に送信先（フォームサービス等）を設定し、submitInquiry を実装してください。 */
  // （検証用に window.EHIME_FORM_ENDPOINT で上書きできる）
  var ENDPOINT = window.EHIME_FORM_ENDPOINT || null;
  function submitInquiry(formData) {
    if (!ENDPOINT) return Promise.resolve({ ok: false, reason: 'not_connected' });
    return fetch(ENDPOINT, { method: 'POST', body: formData })
      .then(function (r) { return { ok: r.ok, reason: r.ok ? '' : 'server' }; })
      .catch(function () { return { ok: false, reason: 'network' }; });
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
      // 電話番号は半角数字とハイフンに正規化して送る
      form.querySelectorAll('[data-type="tel"]').forEach(function (el) { fd.set(el.name, toHalfWidth(el.value).replace(/[\s()]/g, '')); });
      var input = form.querySelector('input[type="file"]');
      if (input && input._files) { fd.delete(input.name); input._files.forEach(function (f) { fd.append(input.name, f); }); }
      var btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      submitInquiry(fd).then(function (res) {
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

  /* ---------- preset segment from ?type= ---------- */
  var type = new URLSearchParams(location.search).get('type');
  function presetSegment() {
    if (!type) return;
    var radio = document.querySelector('#contact-form input[name="segment"][value="' + type.replace(/[^a-z]/g, '') + '"]');
    if (radio) radio.checked = true;
  }
  presetSegment();
  // 送信完了後のリセットでも、ページを開いたときの区分を保つ
  var contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('form:cleared', presetSegment);
})();
