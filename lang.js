/* 中英切换：优先 ?lang=，其次上次选择，最后按浏览器语言 */
(function () {
  var KEY = 'pg-lang';
  var root = document.documentElement;

  function norm(v) {
    if (!v) return null;
    v = String(v).toLowerCase();
    if (v.indexOf('zh') === 0) return 'zh';
    if (v.indexOf('en') === 0) return 'en';
    return null;
  }

  var q = norm(new URLSearchParams(location.search).get('lang'));
  var saved = null;
  try { saved = norm(localStorage.getItem(KEY)); } catch (e) {}
  var lang = q || saved || norm(navigator.language) || 'zh';

  function apply(l) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'zh' ? 'zh-Hans' : 'en');
    var b = document.getElementById('langBtn');
    if (b) {
      b.textContent = l === 'zh' ? 'EN' : '中文';
      b.setAttribute('aria-label', l === 'zh' ? 'Switch to English' : '切换到中文');
    }
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }

  apply(lang);

  document.addEventListener('DOMContentLoaded', function () {
    apply(lang); // 按钮可能晚于脚本存在
    var b = document.getElementById('langBtn');
    if (!b) return;
    b.addEventListener('click', function () {
      lang = root.getAttribute('data-lang') === 'zh' ? 'en' : 'zh';
      apply(lang);
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    });
  });
})();
