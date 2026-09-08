(function () {
  function stamp() {
    return new Date().toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isSiteLink(link) {
    if (link.classList.contains('admin-welcome-link')) return true;
    if (link.closest('.editor-actions') || link.closest('.account-overlay')) return false;
    var text = (link.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    return (
      text.indexOf('netlify.app') !== -1 ||
      text === 'www.milikatembo.com' ||
      text === 'milikatembo.com' ||
      /^https?:\/\/(www\.)?milikatembo/.test(text)
    );
  }

  function decorate(link) {
    if (link.dataset.welcome === '1') {
      var time = link.querySelector('.admin-welcome-time');
      if (time) time.textContent = stamp();
      return;
    }
    link.dataset.welcome = '1';
    link.classList.add('admin-welcome-link');
    link.setAttribute('aria-label', 'Welcome back, Milika Tembo');
    link.innerHTML =
      '<span class="admin-welcome-name">Welcome back, Milika Tembo</span>' +
      '<span class="admin-welcome-time">' + stamp() + '</span>';
  }

  function render() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      if (isSiteLink(link) || link.classList.contains('admin-welcome-link')) {
        decorate(link);
      }
    });
  }

  window.setInterval(render, 1000);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
