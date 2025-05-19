document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    en: {},
    ru: {},
    ua: {},
  };

  let currentLanguage = localStorage.getItem("language") || "en";

  async function loadTranslations(lang) {
    try {
      const res = await fetch(`./lang/${lang}.json`);
      translations[lang] = await res.json();
      applyTranslations(lang);
    } catch (error) {
      console.error(`Ошибка загрузки перевода для языка ${lang}:`, error);
    }
  }

  function applyTranslations(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = translations[lang][key];
      if (translation) {
        if (el.tagName === "INPUT" && el.placeholder) {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
  }

  const langSelect = document.getElementById("language-switcher");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem("language", selectedLang);
      currentLanguage = selectedLang;

      if (Object.keys(translations[selectedLang]).length === 0) {
        loadTranslations(selectedLang);
      } else {
        applyTranslations(selectedLang);
      }
    });

    langSelect.value = currentLanguage;
  }

  loadTranslations(currentLanguage);
});
