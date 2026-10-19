/* Gebäudeservice Böhme – Navigation und Kontaktformular. Keine Abhängigkeiten, kein Tracking. */
(function () {
  'use strict';

  // Mobile Navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hauptnavigation');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menü öffnen');
        toggle.focus();
      }
    });
  }

  // Kontaktformular ohne Backend: öffnet das E-Mail-Programm mit vorbereiteter Nachricht.
  document.querySelectorAll('form[data-kontakt]').forEach(function (form) {
    var labels = {
      name: 'Name', firma: 'Firma / Objekt', email: 'E-Mail', telefon: 'Telefon',
      leistung: 'Leistung', aufgaben: 'Gewünschte Hausmeisterarbeiten', nachricht: 'Nachricht'
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var lines = [];
      Object.keys(labels).forEach(function (key) {
        var values = data.getAll(key).filter(function (v) { return v; });
        if (values.length) { lines.push(labels[key] + ': ' + values.join(', ')); }
      });
      lines.push('', 'Gesendet über das Kontaktformular auf gebaeudeserviceboehme.de');
      var leistungen = data.getAll('leistung').filter(function (v) { return v; });
      var subject = 'Anfrage über die Website' + (leistungen.length ? ': ' + leistungen.join(', ') : '');
      var href = 'mailto:' + form.getAttribute('data-kontakt') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
      var ok = form.querySelector('.form-success');
      if (ok) { ok.hidden = false; }
    });
  });
})();
