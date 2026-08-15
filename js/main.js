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
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var content = document.getElementById('lightbox-content');
    var closeBtn = document.getElementById('lightbox-close');
    if (!lightbox || !content || !closeBtn) return;

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        content.textContent = item.getAttribute('data-label');
        content.className = 'lightbox-content ' + item.className.replace('gallery-item', '').trim();
        lightbox.hidden = false;
      });
    });

    function close() {
      lightbox.hidden = true;
    }
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initVideoCards() {
    var cards = document.querySelectorAll('.video-card');
    var note = document.getElementById('video-note');
    if (!note) return;
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        note.textContent = '"' + card.getAttribute('data-label') + '" 샘플 영상입니다. 실제 영상 파일로 교체될 예정입니다.';
        note.hidden = false;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSnow();
    renderDday();
    initLightbox();
    initVideoCards();
  });
})();
