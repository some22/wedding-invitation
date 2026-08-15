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

  document.addEventListener('DOMContentLoaded', function () {
    initSnow();
    renderDday();
  });
})();
