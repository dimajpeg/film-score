// header-auth.js (рабочая версия)

// document.addEventListener('DOMContentLoaded', function () {
//   const navSignInLink = document.getElementById('nav-signin-link');
//   const navUserLoggedIn = document.getElementById('nav-user-loggedin');
//   const userAvatarButton = document.getElementById('user-avatar-button');
//   const userDropdownMenu = document.getElementById('user-dropdown-menu');
//   const logoutButtonHeader = document.getElementById('logout-button-header');
//   const dropdownUsername = document.getElementById('dropdown-username');

//   const ME_URL_HEADER = '/auth/me'; // Твой эндпоинт для получения данных о текущем пользователе

//   // Функция для получения перевода
//   function getHeaderText(key, params = {}, fallbackText = '') {
//       if (window.i18n && typeof window.i18n.getTranslation === 'function') {
//           return window.i18n.getTranslation(key, params);
//       }
//       if (fallbackText) {
//           for (const paramKey in params) {
//               fallbackText = fallbackText.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
//           }
//           return fallbackText;
//       }
//       return key;
//   }

//   async function updateHeaderBasedOnAuth() {
//       const token = localStorage.getItem('authToken');

//       if (token) {
//           // Пользователь потенциально авторизован
//           if (navSignInLink) navSignInLink.style.display = 'none';
//           if (navUserLoggedIn) navUserLoggedIn.style.display = 'flex';

//           try {
//               const response = await fetch(ME_URL_HEADER, {
//                   method: 'GET',
//                   headers: {
//                       'Authorization': `Bearer ${token}`,
//                       'Content-Type': 'application/json'
//                   }
//               });

//               if (response.ok) {
//                   const userData = await response.json();
//                   // Предполагаем, что бэкенд возвращает объект с полем 'name' или 'username'
//                   const userName = userData.name || userData.username || "User"; 
//                   if (dropdownUsername) {
//                       dropdownUsername.textContent = getHeaderText('userMenu.greetingUser', { userName: userName }, `Hello, ${userName}!`);
//                   }
//               } else {
//                   // Токен невалиден (например, 401) или другая ошибка сервера
//                   console.warn(`Failed to fetch user data: ${response.status}. Logging out.`);
//                   localStorage.removeItem('authToken'); // Очищаем невалидный токен
//                   performLogoutUIUpdate(); // Обновляем UI до состояния "не залогинен"
//               }
//           } catch (error) {
//               console.error('Network error fetching user data for header:', error);
//               // Если ошибка сети, но токен есть, можно либо показать "загрузка...", 
//               // либо оставить дефолтное приветствие, либо сразу разлогинить.
//               // Пока оставим дефолтное приветствие, чтобы меню было доступно, если токен еще валиден.
//               if (dropdownUsername) {
//                   dropdownUsername.textContent = getHeaderText('userMenu.greeting', {}, 'Hello, User!');
//               }
//               // Для более строгого поведения можно было бы вызвать performLogoutUIUpdate()
//               // localStorage.removeItem('authToken');
//               // performLogoutUIUpdate();
//           }
//       } else {
//           // Пользователь не авторизован
//           performLogoutUIUpdate();
//       }
//   }

//   function performLogoutUIUpdate() {
//       if (navSignInLink) navSignInLink.style.display = 'flex';
//       if (navUserLoggedIn) navUserLoggedIn.style.display = 'none';
//       if (userDropdownMenu) {
//           userDropdownMenu.style.display = 'none';
//           userDropdownMenu.classList.remove('open');
//       }
//       if (userAvatarButton) userAvatarButton.setAttribute('aria-expanded', 'false');
//       if (dropdownUsername) dropdownUsername.textContent = getHeaderText('userMenu.greeting', {}, 'Hello, Guest!');
//   }

//   // Показать/скрыть выпадающее меню
//   if (userAvatarButton && userDropdownMenu) {
//       userAvatarButton.addEventListener('click', function (event) {
//           event.stopPropagation();
//           const isCurrentlyOpen = userDropdownMenu.style.display === 'block';
//           userDropdownMenu.style.display = isCurrentlyOpen ? 'none' : 'block';
//           userAvatarButton.setAttribute('aria-expanded', String(!isCurrentlyOpen));
//           if (!isCurrentlyOpen) {
//               userDropdownMenu.classList.add('open');
//           } else {
//               userDropdownMenu.classList.remove('open');
//           }
//       });
//   }

//   // Закрыть меню при клике вне его
//   document.addEventListener('click', function (event) {
//       if (userDropdownMenu && userDropdownMenu.style.display === 'block' &&
//           userAvatarButton && !userAvatarButton.contains(event.target) &&
//           !userDropdownMenu.contains(event.target)) {
//           userDropdownMenu.style.display = 'none';
//           userDropdownMenu.classList.remove('open');
//           userAvatarButton.setAttribute('aria-expanded', 'false');
//       }
//   });
  
//   // Закрыть меню при нажатии Escape
//   document.addEventListener('keydown', function(event) {
//       if (event.key === 'Escape' && userDropdownMenu && userDropdownMenu.style.display === 'block') {
//           userDropdownMenu.style.display = 'none';
//           userDropdownMenu.classList.remove('open');
//           if (userAvatarButton) userAvatarButton.setAttribute('aria-expanded', 'false');
//       }
//   });

//   // Обработка выхода пользователя из хедера
//   if (logoutButtonHeader) {
//       logoutButtonHeader.addEventListener('click', function () {
//           localStorage.removeItem('authToken');
//           performLogoutUIUpdate();
//           document.dispatchEvent(new CustomEvent('userLoggedOutGlobal'));
//           // Опционально: редирект на главную или страницу входа
//           // window.location.href = 'index.html';
//       });
//   }

//   // Первоначальное обновление хедера при загрузке страницы
//   updateHeaderBasedOnAuth();

//   // Слушаем кастомные события для обновления хедера
//   document.addEventListener('userLoggedInGlobal', function(event) {
//       // event.detail может содержать данные пользователя
//       console.log("Event 'userLoggedInGlobal' received by header-auth.js");
//       updateHeaderBasedOnAuth(); // Перепроверяем состояние и обновляем UI
//   });
  
//   // Это событие уже обрабатывается кликом на кнопку "Logout" выше,
//   // но если выход может инициироваться из другого места, это полезно.
//   document.addEventListener('userLoggedOutGlobal', function() {
//       console.log("Event 'userLoggedOutGlobal' received by header-auth.js (potentially redundant if from header logout)");
//       // performLogoutUIUpdate(); // updateHeaderBasedOnAuth() вызывается после удаления токена, он сделает то же самое
//   });
// });

// header-auth.js (версия для тестирования UI)

document.addEventListener('DOMContentLoaded', function () {
  const navSignInLink = document.getElementById('nav-signin-link');
  const navUserLoggedIn = document.getElementById('nav-user-loggedin');
  const userAvatarButton = document.getElementById('user-avatar-button');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  const logoutButtonHeader = document.getElementById('logout-button-header');
  const dropdownUsername = document.getElementById('dropdown-username');

  let isLoggedInForTesting = false; // Флаг для симуляции состояния

  // Функция для получения перевода
  function getHeaderText(key, params = {}, fallbackText = '') {
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
          return window.i18n.getTranslation(key, params);
      }
      if (fallbackText) {
          for (const paramKey in params) {
              fallbackText = fallbackText.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
          }
          return fallbackText;
      }
      return key;
  }

  function updateHeaderUI() {
      if (isLoggedInForTesting) {
          // Пользователь "вошел" (симуляция)
          if (navSignInLink) navSignInLink.style.display = 'none';
          if (navUserLoggedIn) navUserLoggedIn.style.display = 'flex';

          if (dropdownUsername) {
              const fakeUserName = "Test User"; // Можешь менять
              dropdownUsername.textContent = getHeaderText('userMenu.greetingUser', { userName: fakeUserName }, `Hello, ${fakeUserName}!`);
          }
      } else {
          // Пользователь "не вошел" (симуляция)
          if (navSignInLink) navSignInLink.style.display = 'flex';
          if (navUserLoggedIn) navUserLoggedIn.style.display = 'none';
          if (userDropdownMenu) { // Скрываем меню при выходе
              userDropdownMenu.style.display = 'none';
              userDropdownMenu.classList.remove('open');
          }
          if (userAvatarButton) userAvatarButton.setAttribute('aria-expanded', 'false');
          if (dropdownUsername) dropdownUsername.textContent = getHeaderText('userMenu.greeting', {}, 'Hello, Guest!');
      }
  }

  // Показать/скрыть выпадающее меню
  if (userAvatarButton && userDropdownMenu) {
      userAvatarButton.addEventListener('click', function (event) {
          event.stopPropagation();
          const isCurrentlyOpen = userDropdownMenu.style.display === 'block';
          userDropdownMenu.style.display = isCurrentlyOpen ? 'none' : 'block';
          userAvatarButton.setAttribute('aria-expanded', String(!isCurrentlyOpen));
          if (!isCurrentlyOpen) {
              userDropdownMenu.classList.add('open');
          } else {
              userDropdownMenu.classList.remove('open');
          }
      });
  }

  // Закрыть меню при клике вне его
  document.addEventListener('click', function (event) {
      if (userDropdownMenu && userDropdownMenu.style.display === 'block' &&
          userAvatarButton && !userAvatarButton.contains(event.target) &&
          !userDropdownMenu.contains(event.target)) {
          userDropdownMenu.style.display = 'none';
          userDropdownMenu.classList.remove('open');
          userAvatarButton.setAttribute('aria-expanded', 'false');
      }
  });

  // Закрыть меню при нажатии Escape
  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && userDropdownMenu && userDropdownMenu.style.display === 'block') {
          userDropdownMenu.style.display = 'none';
          userDropdownMenu.classList.remove('open');
          if (userAvatarButton) userAvatarButton.setAttribute('aria-expanded', 'false');
      }
  });

  // "Выход" из меню (только для UI в этой тестовой версии)
  if (logoutButtonHeader) {
      logoutButtonHeader.addEventListener('click', function () {
          console.log("Simulating logout from header menu...");
          isLoggedInForTesting = false;
          updateHeaderUI();
          // В реальной версии здесь будет localStorage.removeItem('authToken');
          // и возможно document.dispatchEvent(new CustomEvent('userLoggedOutGlobal'));
      });
  }

  // --- Функции для тестирования из консоли ---
  window.simulateLogin = function() {
      console.log("Simulating login...");
      isLoggedInForTesting = true;
      updateHeaderUI();
  }

  window.simulateLogout = function() {
      console.log("Simulating logout...");
      isLoggedInForTesting = false;
      updateHeaderUI();
  }
  // --- Конец функций для тестирования ---

  // Первоначальное обновление хедера (по умолчанию "не вошел")
  updateHeaderUI();

  // Слушаем кастомные события (пока не будут вызываться без реального auth.js)
  document.addEventListener('userLoggedInGlobal', function() {
      console.log("Event 'userLoggedInGlobal' caught, simulating login state.");
      isLoggedInForTesting = true;
      updateHeaderUI();
  });
  document.addEventListener('userLoggedOutGlobal', function() {
      console.log("Event 'userLoggedOutGlobal' caught, simulating logout state.");
      isLoggedInForTesting = false;
      updateHeaderUI();
  });

});