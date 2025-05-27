// js/profile-page.js

document.addEventListener('DOMContentLoaded', () => {
  const profileNameElement = document.getElementById('profile-name');
  const profileEmailElement = document.getElementById('profile-email');
  const logoutButtonProfile = document.getElementById('logout-button-profile');

  // Функция для получения текста (копируем из других файлов или выносим в общий)
  function getText(key, fallbackTextIfKeyNotFound = '', params = {}) {
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
          const translation = window.i18n.getTranslation(key, params);
          if (translation !== key) return translation;
          let fallback = fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          if (typeof fallback === 'string' && params && Object.keys(params).length > 0) {
              for (const paramKey in params) {
                  fallback = fallback.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
              }
          }
          return fallback;
      }
      let fallback = fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (typeof fallback === 'string' && params && Object.keys(params).length > 0) {
           for (const paramKey in params) {
              fallback = fallback.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
          }
      }
      return fallback;
  }

  function displayUserProfile() {
      const token = localStorage.getItem('authToken'); // Проверяем токен

      if (!token) {
          // Если пользователь не авторизован, по-хорошему, его не должно быть на этой странице.
          // Перенаправляем на страницу входа.
          console.warn("User not authenticated. Redirecting to sign-in page.");
          window.location.href = 'sign-up.html'; // Или index.html
          return;
      }

      // Пытаемся получить данные пользователя из localStorage (если header-auth.js их туда сохранил)
      // или делаем запрос к /auth/me (когда будет бэкенд)
      // Пока симулируем или используем данные из header-auth.js (если он их в window записал)

      // Пример: если header-auth.js записывал имя в элемент #dropdown-username
      const headerUsernameElement = document.getElementById('dropdown-username');
      let username = getText('user.placeholder.name', 'User'); // Фоллбэк по умолчанию

      if (headerUsernameElement && headerUsernameElement.textContent !== getText('userMenu.greeting', 'Hello, Guest!')) {
          // Пытаемся извлечь имя из приветствия в хедере, если оно там есть
          // Это не самый надежный способ, лучше получать с /auth/me
          const greetingText = headerUsernameElement.textContent; // e.g., "Hello, Dima!" or "Привет, Дима!"
          // Пытаемся извлечь имя после запятой и пробела
          const nameMatch = greetingText.match(/,\s*(.+)!$/);
          if (nameMatch && nameMatch[1]) {
              username = nameMatch[1];
          }
      }
      
      // В будущем здесь будет запрос к /api/auth/me для получения актуальных данных
      // const userData = await fetch('/api/auth/me', { headers: {'Authorization': `Bearer ${token}`}}).then(res => res.json());
      // if (profileNameElement) profileNameElement.textContent = userData.name || getText('user.placeholder.name');
      // if (profileEmailElement) profileEmailElement.textContent = userData.email || getText('user.placeholder.email');

      if (profileNameElement) profileNameElement.textContent = username; // Пока используем извлеченное/фейковое имя
      if (profileEmailElement) profileEmailElement.textContent = getText('user.placeholder.email', 'your.email@example.com'); // Email пока плейсхолдер
  }

  if (logoutButtonProfile) {
      logoutButtonProfile.addEventListener('click', () => {
          localStorage.removeItem('authToken');
          // Сообщаем header-auth.js, что нужно обновить хедер
          document.dispatchEvent(new CustomEvent('userLoggedOutGlobal')); 
          // Перенаправляем на главную или страницу входа
          window.location.href = 'index.html';
      });
  }

  // Инициализация и обновление при смене языка
  function initProfilePage() {
      displayUserProfile();
      // Обновить тексты кнопок и заголовков, если они не через data-i18n
      const editProfileBtn = document.querySelector('.profile-action-btn');
      if (editProfileBtn) editProfileBtn.textContent = getText('page.profile.editProfileBtn', 'Edit Profile');
      // ... и для других элементов, если нужно
  }

  document.addEventListener('translationsReady', initProfilePage);
  document.addEventListener('languageChanged', initProfilePage);
  // События userLoggedInGlobal/userLoggedOutGlobal уже обрабатываются header-auth.js для хедера,
  // но для контента страницы может понадобиться displayUserProfile при userLoggedInGlobal
  document.addEventListener('userLoggedInGlobal', displayUserProfile);


  // Попытка инициализации, если переводы уже готовы
  if (window.i18n && window.i18n.getCurrentLanguage()) {
      // Простая проверка, чтобы не вызывать дважды, если translationsReady еще не сработало
      // Лучше полагаться на событие.
      // initProfilePage();
  }
});