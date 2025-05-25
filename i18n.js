// i18n.js
document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    en: {},
    ru: {},
    ua: {},
  };

  let currentLanguage = localStorage.getItem("language") || "en"; 

  async function loadTranslations(lang) {
    try {
      if (Object.keys(translations[lang]).length > 0 && lang !== currentLanguage) { // Загружаем только если это новый язык или еще не загружен
         // Если переключаемся на уже загруженный язык, просто применяем
         applyTranslations(lang);
         document.dispatchEvent(new CustomEvent('translationsReady', { detail: { lang: lang } })); // Сообщаем, что переводы для языка готовы
         return;
      }
      // Если кэш пуст для этого языка или это первоначальная загрузка
      if (Object.keys(translations[lang]).length === 0 || lang === currentLanguage && Object.keys(translations[lang]).length === 0 ) {
        const response = await fetch(`./lang/${lang}.json?v=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${lang}.json`);
        }
        translations[lang] = await response.json();
      }
      applyTranslations(lang);
      console.log(`[i18n] Translations loaded and applied for: ${lang}`);
      document.dispatchEvent(new CustomEvent('translationsReady', { detail: { lang: lang } })); // Сообщаем, что переводы для языка готовы
    } catch (error) {
      console.error(`Error loading translation for language ${lang}:`, error);
      if (lang !== "en") { // Если ошибка не с английским, пытаемся загрузить/применить английский
          if (Object.keys(translations.en).length === 0) {
            console.log("Attempting to load default 'en' translations due to error.");
            await loadTranslations("en"); // Загружаем 'en'
          } else {
            console.log("Applying 'en' translations due to error with current language.");
            applyTranslations("en"); // Применяем уже загруженный 'en'
            document.dispatchEvent(new CustomEvent('translationsReady', { detail: { lang: "en" } }));
          }
      }
    }
  }

  // ИСПРАВЛЕННАЯ getTranslation: НЕ ДЕЛАЕТ ФОЛЛБЭК НА 'en' САМА
  function getTranslation(lang, key, params = {}) {
    let translation = translations[lang]?.[key] || key; // Если нет в текущем языке, возвращает сам ключ
    
    // Применяем параметры только если перевод найден (translation !== key) и есть параметры
    if (typeof translation === 'string' && translation !== key && params && Object.keys(params).length > 0) {
        for (const paramKey in params) {
            translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
        }
    }
    return translation;
  }

  function applyTranslations(lang) {
    document.documentElement.lang = lang;

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translatedText = getTranslation(lang, key); // Используем текущий язык

      // Применяем перевод, только если он найден (т.е. translatedText отличается от key)
      // ИЛИ если это первый рендер и текст элемента отличается от ключа (на случай если там уже был фоллбэк)
      if (translatedText !== key || (el.textContent === key && translatedText !== key) ) { 
        if (el.tagName === "INPUT" && el.placeholder !== undefined) {
          el.placeholder = translatedText;
        } else if (el.tagName === "TITLE") {
            document.title = translatedText;
        }
        else {
          el.textContent = translatedText;
        }
      } else if (el.dataset.i18nFallback) { // Если есть атрибут для фоллбэка
          el.textContent = el.dataset.i18nFallback;
      }
      // Если translatedText === key, то текст элемента с data-i18n не меняется,
      // он остается таким, каким был в HTML, или JS должен его обновить отдельно.
    });

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
  }

  const langSelect = document.getElementById("language-switcher");
  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem("language", selectedLang);
      currentLanguage = selectedLang; // Обновляем currentLanguage ПЕРЕД вызовом loadTranslations
      loadTranslations(selectedLang);
    });
  }

  loadTranslations(currentLanguage); // Первоначальная загрузка

  window.i18n = {
    getTranslation: (key, params = {}) => getTranslation(currentLanguage, key, params),
    getCurrentLanguage: () => currentLanguage
  };
});