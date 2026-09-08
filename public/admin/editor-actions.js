(function () {
  var FOLDER_COLLECTIONS = {
    blog: 'post',
    events: 'event',
    book: 'book item',
    publications: 'publication',
  };

  function parseRoute() {
    var hash = location.hash || '';
    var editor = hash.match(/^#\/collections\/([^/]+)\/(new|entries\/.+)/);
    if (!editor) return null;
    return {
      collection: editor[1],
      isNew: editor[2] === 'new',
      canDuplicate: Boolean(FOLDER_COLLECTIONS[editor[1]]),
    };
  }

  function cmsButtons() {
    var root = document.querySelector('#nc-root');
    return root ? Array.prototype.slice.call(root.querySelectorAll('button')) : [];
  }

  function clickText(labels) {
    var wanted = labels.map(function (label) {
      return label.toLowerCase();
    });
    var match = cmsButtons().find(function (button) {
      if (button.closest('.editor-actions')) return false;
      var text = (button.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      return wanted.some(function (label) {
        return text === label || text.indexOf(label) !== -1;
      });
    });
    if (match) {
      match.click();
      return true;
    }
    return false;
  }

  function clickDropdownItem(openLabels, itemLabels) {
    if (!clickText(openLabels)) return false;
    window.setTimeout(function () {
      clickText(itemLabels);
    }, 80);
    return true;
  }

  function bar() {
    var existing = document.querySelector('.editor-actions');
    if (existing) return existing;
    var el = document.createElement('div');
    el.className = 'editor-actions';
    el.innerHTML =
      '<button type="button" data-action="update">Update</button>' +
      '<button type="button" data-action="new">New</button>' +
      '<button type="button" data-action="duplicate">Duplicate</button>' +
      '<button type="button" data-action="delete" class="is-danger">Delete</button>';
    el.addEventListener('click', function (event) {
      var action = event.target.getAttribute('data-action');
      if (!action) return;
      var route = parseRoute();
      if (!route) return;
      if (action === 'new') {
        location.hash = '#/collections/' + route.collection + '/new';
        return;
      }
      if (action === 'update') {
        if (clickText(['save'])) return;
        clickDropdownItem(['publish'], ['publish now']);
        return;
      }
      if (action === 'duplicate') {
        if (clickText(['duplicate'])) return;
        clickDropdownItem(['published', 'publish'], ['duplicate', 'publish and duplicate']);
        return;
      }
      if (action === 'delete') {
        if (window.confirm('Delete this ' + (FOLDER_COLLECTIONS[route.collection] || 'item') + '? This cannot be undone.')) {
          clickText(['delete entry', 'delete published entry', 'delete unpublished entry', 'delete']);
        }
      }
    });
    document.body.appendChild(el);
    return el;
  }

  function render() {
    var route = parseRoute();
    var actions = bar();
    if (!route) {
      actions.classList.remove('is-open');
      document.body.classList.remove('has-editor-actions');
      return;
    }
    actions.classList.add('is-open');
    document.body.classList.add('has-editor-actions');
    var canMakeNew = Boolean(FOLDER_COLLECTIONS[route.collection]);
    actions.querySelector('[data-action="new"]').hidden = !canMakeNew;
    actions.querySelector('[data-action="duplicate"]').hidden = !canMakeNew || route.isNew;
    actions.querySelector('[data-action="delete"]').hidden = !canMakeNew || route.isNew;
  }

  window.addEventListener('hashchange', render);
  window.setInterval(render, 800);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
