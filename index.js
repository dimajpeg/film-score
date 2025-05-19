import './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  loadTranslations();

  const langSelect = document.querySelector('select[name="language"]');
  if (langSelect) {
    langSelect.value = localStorage.getItem('lang') || 'ru';
    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      loadTranslations(newLang);
    });
  }
});
