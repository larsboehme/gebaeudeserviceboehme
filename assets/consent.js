/* Gebäudeservice Böhme – Cookie-Einwilligung und Google-Ads-Conversion-Tracking.
   Der Google-Tag wird erst nach ausdrücklicher Einwilligung geladen.
   Ohne Einwilligung werden keine Daten an Google übertragen. */
(function () {
  'use strict';

  var TAG_ID = 'AW-18122453881';
  var CONVERSION_FORM = TAG_ID + '/zTEICNzesKMcEPnmusFD';   // Lead-Formular senden
  var CONVERSION_PHONE = TAG_ID + '/6kAMCN67vr8dEPnmusFD';  // Klick auf Telefonnummer (Website)
  var STORAGE_KEY = 'gsb-consent-v1';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  function readChoice() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignorieren */ }
  }

  var tagLoaded = false;
  function loadTag() {
    if (tagLoaded) { return; }
    tagLoaded = true;
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });
    gtag('js', new Date());
    gtag('config', TAG_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(TAG_ID);
    document.head.appendChild(s);
  }

  function hasConsent() { return readChoice() === 'granted'; }

  function trackConversion(sendTo) {
    if (!hasConsent()) { return; }
    gtag('event', 'conversion', { send_to: sendTo, transport_type: 'beacon' });
  }

  // Banner
  var banner = null;
  function closeBanner() {
    if (banner) { banner.remove(); banner = null; }
  }
  function showBanner() {
    if (banner) { return; }
    banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML =
      '<div class="consent-inner">' +
        '<p class="consent-text"><strong>Cookies für Google Ads</strong><br>' +
        'Mit Ihrer Einwilligung nutzen wir Google Ads Conversion-Tracking, um zu messen, ob Anfragen über unsere Anzeigen zustande kommen. ' +
        'Dabei werden Cookies gesetzt und Daten an Google übertragen, auch in die USA. ' +
        'Sie können Ihre Einwilligung jederzeit über „Cookie-Einstellungen“ im Seitenfuß widerrufen. ' +
        '<a href="/datenschutz/#google-ads">Mehr in der Datenschutzerklärung</a></p>' +
        '<div class="consent-actions">' +
          '<button type="button" class="btn btn-outline" data-consent="denied">Ablehnen</button>' +
          '<button type="button" class="btn btn-primary" data-consent="granted">Akzeptieren</button>' +
        '</div>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) { return; }
      var choice = btn.getAttribute('data-consent');
      var before = readChoice();
      saveChoice(choice);
      closeBanner();
      if (choice === 'granted') {
        loadTag();
      } else if (before === 'granted') {
        // Widerruf: Seite neu laden, damit der Google-Tag nicht weiterläuft.
        window.location.reload();
      }
    });
    document.body.appendChild(banner);
  }

  function addSettingsLink() {
    var target = document.querySelector('.footer-bottom') || document.querySelector('footer');
    if (!target) { return; }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'consent-settings-link';
    btn.textContent = 'Cookie-Einstellungen';
    btn.addEventListener('click', showBanner);
    target.appendChild(btn);
  }

  function init() {
    var choice = readChoice();
    if (choice === 'granted') { loadTag(); }
    else if (choice !== 'denied') { showBanner(); }
    addSettingsLink();

    // Klick auf eine Telefonnummer
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[href^="tel:"]');
      if (link) { trackConversion(CONVERSION_PHONE); }
    });

    // Gültig abgeschicktes Kontaktformular
    document.querySelectorAll('form[data-kontakt]').forEach(function (form) {
      form.addEventListener('submit', function () {
        if (form.checkValidity()) { trackConversion(CONVERSION_FORM); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
