function wrapGalleryIndex(current, delta, total) {
  return ((current - 1 + delta) % total + total) % total + 1;
}
window.wrapGalleryIndex = wrapGalleryIndex;

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
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');
    if (!lightbox || !content || !closeBtn) return;

    var currentIndex = null;
    var touchStartX = 0;
    var touchStartY = 0;
    var touchActive = false;

    function updateNavButtons() {
      var show = currentIndex !== null;
      if (prevBtn) prevBtn.hidden = !show;
      if (nextBtn) nextBtn.hidden = !show;
    }

    function openMedia(mediaEl, index) {
      content.innerHTML = '';
      content.appendChild(mediaEl);
      lightbox.hidden = false;
      currentIndex = (typeof index === 'number') ? index : null;
      updateNavButtons();
    }

    function close() {
      lightbox.hidden = true;
      content.innerHTML = '';
      currentIndex = null;
      updateNavButtons();
    }

    function showAt(index) {
      var item = galleryItems[index - 1];
      var label = item ? (item.getAttribute('data-label') || '') : '';
      var img = document.createElement('img');
      img.src = 'images/' + index + '.jpg';
      img.alt = label;
      openMedia(img, index);
    }

    function navigate(delta) {
      if (currentIndex === null || galleryItems.length === 0) return;
      var next = window.wrapGalleryIndex(currentIndex, delta, galleryItems.length);
      showAt(next);
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var index = parseInt(item.getAttribute('data-index'), 10);
        showAt(index);
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowLeft') { navigate(-1); return; }
      if (e.key === 'ArrowRight') { navigate(1); return; }
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigate(1); });

    content.addEventListener('touchstart', function (e) {
      if (currentIndex === null || e.touches.length !== 1) { touchActive = false; return; }
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchActive = true;
    });

    content.addEventListener('touchcancel', function () {
      touchActive = false;
    });

    content.addEventListener('touchend', function (e) {
      if (!touchActive) return;
      touchActive = false;
      var touch = e.changedTouches[0];
      var dx = touch.clientX - touchStartX;
      var dy = touch.clientY - touchStartY;
      if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
      navigate(dx < 0 ? 1 : -1);
    });

    var mapImg = document.querySelector('.map-illustration-img');
    if (mapImg) {
      mapImg.addEventListener('click', function () {
        var img = document.createElement('img');
        img.src = mapImg.getAttribute('src');
        img.alt = mapImg.getAttribute('alt') || '';
        openMedia(img, null);
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
