// i18n.js
document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    en: {},
    ru: {},
    ua: {},
  };

  let currentLanguage = localStorage.getItem("language") || "en"; // Устанавливаем язык по умолчанию или из localStorage

  async function loadTranslations(lang) {
    try {
      // Проверяем, не загружены ли уже переводы для этого языка
      if (Object.keys(translations[lang]).length > 0) {
        applyTranslations(lang);
        return;
      }
      const response = await fetch(`./lang/${lang}.json?v=${new Date().getTime()}`); // Добавляем кэш-бастинг
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${lang}.json`);
      }
      translations[lang] = await response.json();
      applyTranslations(lang);
    } catch (error) {
      console.error(`Error loading translation for language ${lang}:`, error);
      // Можно загрузить язык по умолчанию в случае ошибки
      if (lang !== "en" && Object.keys(translations.en).length === 0) {
          console.log("Attempting to load default 'en' translations.");
          await loadTranslations("en");
      } else if (lang !== "en") {
          applyTranslations("en"); // Применяем уже загруженный английский
      }
    }
  }

  function getTranslation(lang, key, params = {}) {
    let translation = translations[lang]?.[key] || translations['en']?.[key] || key; // Фоллбэк на английский, затем на сам ключ
    if (typeof translation === 'string') {
        for (const paramKey in params) {
            translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
        }
    }
    return translation;
  }

  function applyTranslations(lang) {
    document.documentElement.lang = lang; // Устанавливаем атрибут lang для <html>

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      // Используем getTranslation для получения текста (без параметров здесь, т.к. параметры обычно динамические)
      const translatedText = getTranslation(lang, key);

      if (translatedText !== key) { // Применяем, только если перевод найден
        if (el.tagName === "INPUT" && el.placeholder !== undefined) { // Проверяем наличие placeholder
          el.placeholder = translatedText;
        } else if (el.tagName === "TITLE") {
            document.title = translatedText;
        }
        else {
          el.textContent = translatedText;
        }
      }
    });

    // Триггерим кастомное событие, чтобы другие скрипты могли отреагировать на смену языка
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
  }

  const langSelect = document.getElementById("language-switcher");
  if (langSelect) {
    langSelect.value = currentLanguage; // Устанавливаем текущее значение селекта

    langSelect.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem("language", selectedLang);
      currentLanguage = selectedLang;
      loadTranslations(selectedLang); // Загружаем и применяем новый язык
    });
  }

  // Первоначальная загрузка переводов
  loadTranslations(currentLanguage);

  // Экспортируем функцию для использования в других скриптах (если нужно)
  // Можно сделать через window или создать более сложную систему модулей, если проект большой
  window.i18n = {
    getTranslation: (key, params = {}) => getTranslation(currentLanguage, key, params),
    getCurrentLanguage: () => currentLanguage
  };
});