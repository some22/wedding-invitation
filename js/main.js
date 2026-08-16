(function () {
  function initSnow() {
    var hosts = document.querySelectorAll('.snow');
    hosts.forEach(function (host) {
      var n = 24;
      for (var i = 0; i < n; i++) {
        var f = document.createElement('div');
        f.className = 'flake';
        f.style.left = (Math.random() * 100) + '%';
        f.style.animationDelay = (Math.random() * 11) + 's';
        f.style.animationDuration = (9 + Math.random() * 6) + 's';
        f.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
        host.appendChild(f);
      }
    });
  }

  function renderDday() {
    var el = document.getElementById('dday-count');
    if (!el) return;
    if (typeof window.daysUntil !== 'function') return;
    var days = window.daysUntil('2026-12-13', new Date());
    if (days > 0) {
      el.textContent = 'D-' + days;
    } else if (days === 0) {
      el.textContent = 'D-DAY';
    } else {
      el.textContent = 'D+' + Math.abs(days);
    }
  }

  function initLightbox() {
    var galleryItems = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var content = document.getElementById('lightbox-content');
    var closeBtn = document.getElementById('lightbox-close');
    if (!lightbox || !content || !closeBtn) return;

    function open(mediaEl) {
      content.innerHTML = '';
      content.appendChild(mediaEl);
      lightbox.hidden = false;
    }

    function close() {
      lightbox.hidden = true;
      content.innerHTML = '';
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var index = item.getAttribute('data-index');
        var label = item.getAttribute('data-label') || '';
        var img = document.createElement('img');
        img.src = 'images/' + index + '.jpg';
        img.alt = label;
        open(img);
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    var mapImg = document.querySelector('.map-illustration-img');
    if (mapImg) {
      mapImg.addEventListener('click', function () {
        var img = document.createElement('img');
        img.src = mapImg.getAttribute('src');
        img.alt = mapImg.getAttribute('alt') || '';
        open(img);
      });
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function initCopyButtons() {
    var buttons = document.querySelectorAll('.copy-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        copyToClipboard(text);
        var feedback = btn.parentElement.querySelector('[data-copy-feedback]');
        if (feedback) {
          feedback.hidden = false;
          setTimeout(function () { feedback.hidden = true; }, 1800);
        }
      });
    });
  }

  function initAccordion() {
    var items = document.querySelectorAll('.info-item');
    items.forEach(function (item) {
      var question = item.querySelector('.info-question');
      if (!question) return;
      question.addEventListener('click', function () {
        item.classList.toggle('is-open');
      });
    });
  }

  function initAccountToggle() {
    var btn = document.getElementById('account-toggle-btn');
    var list = document.getElementById('account-list');
    if (!btn || !list) return;
    btn.addEventListener('click', function () {
      var isHidden = list.hidden;
      list.hidden = !isHidden;
      btn.textContent = isHidden ? '계좌번호 닫기' : '계좌번호 보기';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSnow();
    renderDday();
    initLightbox();
    initCopyButtons();
    initAccordion();
    initAccountToggle();
  });
})();
