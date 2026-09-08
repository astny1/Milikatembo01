(function () {
  var THEME_KEY = 'milika-admin-theme';

  function currentTheme() {
    return localStorage.getItem(THEME_KEY) === 'night' ? 'night' : 'day';
  }

  function applyTheme(theme) {
    var next = theme === 'night' ? 'night' : 'day';
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
    document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-choice') === next ? 'true' : 'false');
    });
    return next;
  }

  applyTheme(currentTheme());

  function user() {
    return window.netlifyIdentity ? window.netlifyIdentity.currentUser() : null;
  }

  function registerAccountPage() {
    if (!window.CMS || !window.createClass || !window.h) return false;

    var h = window.h;
    var AccountPage = window.createClass({
      getInitialState: function () {
        var current = user();
        return {
          currentEmail: current ? current.email : '',
          email: '',
          password: '',
          confirm: '',
          message: '',
          error: '',
          busy: false,
          theme: currentTheme(),
        };
      },
      setField: function (name) {
        var self = this;
        return function (event) {
          var next = {};
          next[name] = event.target.value;
          self.setState(next);
        };
      },
      note: function (message, error) {
        this.setState({
          message: error ? '' : message,
          error: error ? message : '',
          busy: false,
        });
      },
      updateUser: function (payload, success) {
        var current = user();
        if (!current) {
          this.note('Sign in on the live site to change your login details.', true);
          return;
        }
        var self = this;
        this.setState({ busy: true, message: '', error: '' });
        current
          .update(payload)
          .then(function () {
            var refreshed = user();
            self.setState({
              currentEmail: refreshed ? refreshed.email : self.state.email || self.state.currentEmail,
              email: '',
              password: '',
              confirm: '',
            });
            self.note(success);
          })
          .catch(function (err) {
            self.note((err && err.message) || 'The change could not be saved.', true);
          });
      },
      saveEmail: function (event) {
        event.preventDefault();
        var email = (this.state.email || '').trim();
        if (!email) {
          this.note('Enter a new login email.', true);
          return;
        }
        this.updateUser(
          { email: email },
          'Check the new inbox and confirm the address. That email will become the login.'
        );
      },
      savePassword: function (event) {
        event.preventDefault();
        if (!this.state.password || this.state.password.length < 8) {
          this.note('Use a password of at least 8 characters.', true);
          return;
        }
        if (this.state.password !== this.state.confirm) {
          this.note('The two passwords do not match.', true);
          return;
        }
        this.updateUser({ password: this.state.password }, 'Password updated. Use it the next time you sign in.');
      },
      openIdentity: function () {
        if (window.netlifyIdentity) window.netlifyIdentity.open();
      },
      setTheme: function (theme) {
        this.setState({ theme: applyTheme(theme) });
      },
      render: function () {
        var signedIn = Boolean(this.state.currentEmail);
        var self = this;
        return h('div', { className: 'account-panel' },
          h('h1', {}, 'Account'),
          h('p', { className: 'account-lead' },
            signedIn
              ? 'Signed in as ' + this.state.currentEmail + '.'
              : 'Sign in with Netlify Identity on the published site to change the login email or password.'
          ),
          this.state.message ? h('p', { className: 'account-ok' }, this.state.message) : null,
          this.state.error ? h('p', { className: 'account-error' }, this.state.error) : null,
          h('section', { className: 'account-card' },
            h('h2', {}, 'Appearance'),
            h('p', {}, 'Choose day or night for the admin panel. This is saved on this browser.'),
            h('div', { className: 'theme-switch' },
              h('button', {
                type: 'button',
                className: 'theme-choice',
                'data-theme-choice': 'day',
                'aria-pressed': this.state.theme === 'day' ? 'true' : 'false',
                onClick: function () { self.setTheme('day'); },
              }, 'Day'),
              h('button', {
                type: 'button',
                className: 'theme-choice',
                'data-theme-choice': 'night',
                'aria-pressed': this.state.theme === 'night' ? 'true' : 'false',
                onClick: function () { self.setTheme('night'); },
              }, 'Night')
            )
          ),
          h('section', { className: 'account-card' },
            h('h2', {}, 'Login email'),
            h('p', {}, 'This is the email used to open the admin panel.'),
            h('form', { onSubmit: this.saveEmail },
              h('label', {}, 'New email',
                h('input', {
                  type: 'email',
                  autoComplete: 'email',
                  value: this.state.email,
                  onChange: this.setField('email'),
                  required: true,
                })
              ),
              h('button', { type: 'submit', className: 'account-btn', disabled: this.state.busy }, 'Update email')
            )
          ),
          h('section', { className: 'account-card' },
            h('h2', {}, 'Password'),
            h('p', {}, 'Choose a new password for this login.'),
            h('form', { onSubmit: this.savePassword },
              h('label', {}, 'New password',
                h('input', {
                  type: 'password',
                  autoComplete: 'new-password',
                  value: this.state.password,
                  onChange: this.setField('password'),
                  required: true,
                  minLength: 8,
                })
              ),
              h('label', {}, 'Confirm password',
                h('input', {
                  type: 'password',
                  autoComplete: 'new-password',
                  value: this.state.confirm,
                  onChange: this.setField('confirm'),
                  required: true,
                  minLength: 8,
                })
              ),
              h('button', { type: 'submit', className: 'account-btn', disabled: this.state.busy }, 'Update password')
            )
          ),
          h('p', { className: 'account-alt' },
            h('button', { type: 'button', className: 'account-link', onClick: this.openIdentity },
              'Open login settings'
            )
          )
        );
      },
    });

    CMS.registerAdditionalLink({
      id: 'account',
      title: 'Account',
      data: AccountPage,
    });
    return true;
  }

  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', function (current) {
      if (!current) {
        window.netlifyIdentity.on('login', function () {
          document.location.href = '/admin/';
        });
      }
    });
  }

  function setNote(box, message, isError) {
    box.hidden = !message;
    box.className = isError ? 'account-error' : 'account-ok';
    box.textContent = message || '';
  }

  function wireForm(form, note, run) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var current = user();
      if (!current) {
        setNote(note, 'Sign in on the live site to change your login details.', true);
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      setNote(note, '');
      Promise.resolve(run(current, form))
        .then(function (message) {
          form.reset();
          setNote(note, message, false);
        })
        .catch(function (err) {
          setNote(note, (err && err.message) || 'The change could not be saved.', true);
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  }

  function addAccountButton() {
    if (document.querySelector('.account-launch')) return;

    var current = user();
    var overlay = document.createElement('div');
    overlay.className = 'account-overlay';
    overlay.innerHTML =
      '<div class="account-overlay-card">' +
        '<button type="button" class="account-close" aria-label="Close">&times;</button>' +
        '<h2>Account</h2>' +
        '<p class="account-lead" data-account-email></p>' +
        '<p hidden data-account-note></p>' +
        '<section class="account-card">' +
          '<h2>Appearance</h2>' +
          '<p>Choose day or night for the admin panel. This is saved on this browser.</p>' +
          '<div class="theme-switch">' +
            '<button type="button" class="theme-choice" data-theme-choice="day">Day</button>' +
            '<button type="button" class="theme-choice" data-theme-choice="night">Night</button>' +
          '</div>' +
        '</section>' +
        '<section class="account-card">' +
          '<h2>Login email</h2>' +
          '<p>This is the email used to open the admin panel.</p>' +
          '<form data-account-email-form>' +
            '<label>New email<input type="email" name="email" autocomplete="email" required></label>' +
            '<button type="submit" class="account-btn">Update email</button>' +
          '</form>' +
        '</section>' +
        '<section class="account-card">' +
          '<h2>Password</h2>' +
          '<p>Choose a new password for this login.</p>' +
          '<form data-account-password-form>' +
            '<label>New password<input type="password" name="password" autocomplete="new-password" required minlength="8"></label>' +
            '<label>Confirm password<input type="password" name="confirm" autocomplete="new-password" required minlength="8"></label>' +
            '<button type="submit" class="account-btn">Update password</button>' +
          '</form>' +
        '</section>' +
      '</div>';

    var launch = document.createElement('button');
    launch.type = 'button';
    launch.className = 'account-launch';
    launch.textContent = 'Account';

    var emailLine = overlay.querySelector('[data-account-email]');
    var note = overlay.querySelector('[data-account-note]');
    emailLine.textContent = current
      ? 'Signed in as ' + current.email + '.'
      : 'Sign in with Netlify Identity on the published site to change the login email or password.';

    launch.addEventListener('click', function () {
      overlay.classList.add('is-open');
    });
    overlay.querySelector('.account-close').addEventListener('click', function () {
      overlay.classList.remove('is-open');
    });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) overlay.classList.remove('is-open');
    });

    wireForm(overlay.querySelector('[data-account-email-form]'), note, function (currentUser, form) {
      var email = form.email.value.trim();
      return currentUser.update({ email: email }).then(function () {
        emailLine.textContent = 'Signed in as ' + email + '. Confirm the new inbox to finish the change.';
        return 'Check the new inbox and confirm the address. That email will become the login.';
      });
    });

    wireForm(overlay.querySelector('[data-account-password-form]'), note, function (currentUser, form) {
      if (form.password.value !== form.confirm.value) {
        return Promise.reject(new Error('The two passwords do not match.'));
      }
      if (form.password.value.length < 8) {
        return Promise.reject(new Error('Use a password of at least 8 characters.'));
      }
      return currentUser.update({ password: form.password.value }).then(function () {
        return 'Password updated. Use it the next time you sign in.';
      });
    });

    overlay.querySelectorAll('[data-theme-choice]').forEach(function (button) {
      button.addEventListener('click', function () {
        applyTheme(button.getAttribute('data-theme-choice'));
      });
    });
    applyTheme(currentTheme());

    document.body.appendChild(launch);
    document.body.appendChild(overlay);
  }

  if (!registerAccountPage()) {
    window.addEventListener('load', registerAccountPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAccountButton);
  } else {
    addAccountButton();
  }
})();
