(function mobileMenu() {
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}());

(function contactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var successEl = document.getElementById('form-success');

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  }

  function setError(fieldId, show) {
    var wrap = document.getElementById(fieldId);
    if (!wrap) return;
    wrap.classList.toggle('error', show);
  }

  function clearError(input) {
    var wrap = input.closest('.form-field');
    if (wrap) wrap.classList.remove('error');
  }

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () { clearError(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = form.querySelector('#name');
    var email   = form.querySelector('#email');
    var message = form.querySelector('#message');
    var submit  = form.querySelector('button[type="submit"]');
    var valid   = true;

    var nameErr    = !name.value.trim();
    var emailErr   = !isValidEmail(email.value);
    var messageErr = !message.value.trim();

    setError('field-name',    nameErr);
    setError('field-email',   emailErr);
    setError('field-message', messageErr);

    if (nameErr || emailErr || messageErr) return;

    submit.disabled    = true;
    submit.textContent = 'שולח…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.reset();
          if (successEl) successEl.classList.add('show');
          submit.textContent = 'שלח הודעה';
        } else {
          alert('שגיאה בשליחה. נסו שוב.');
          submit.textContent = 'שלח הודעה';
        }
        submit.disabled = false;
      })
      .catch(function () {
        alert('שגיאת תקשורת. בדקו את החיבור ונסו שוב.');
        submit.disabled    = false;
        submit.textContent = 'שלח הודעה';
      });
  });
}());

(function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id     = anchor.getAttribute('href');
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}());
