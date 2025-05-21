document.addEventListener('DOMContentLoaded', function () {
  // --- Элементы UI ---
  const authToggleContainer = document.querySelector('.auth-toggle'); // Контейнер с кнопками Sign In/Sign Up
  const showSignInBtn = document.getElementById('show-signin-btn');
  const showSignUpBtn = document.getElementById('show-signup-btn');
  const signInFormContainer = document.getElementById('signin-form-container');
  const signUpFormContainer = document.getElementById('signup-form-container');
  const userInfoContainer = document.getElementById('user-info-container');
  const welcomeMessageEl = document.getElementById('welcome-message');
  const logoutBtn = document.getElementById('logout-btn');

  const signInForm = document.getElementById('signin-form');
  const signUpForm = document.getElementById('signup-form');

  const signInMessage = document.getElementById('signin-message');
  const signUpMessage = document.getElementById('signup-message');

  // Проверка существования основных элементов
  if (!authToggleContainer || !showSignInBtn || !showSignUpBtn || !signInFormContainer || !signUpFormContainer || !userInfoContainer || !welcomeMessageEl || !logoutBtn || !signInForm || !signUpForm || !signInMessage || !signUpMessage) {
      console.error('One or more essential auth elements not found. Check your HTML IDs.');
      // return; // Можно раскомментировать, если критично
  }

  // --- API эндпоинты (можно вынести в константы) ---
  const API_BASE_URL = ''; // Если есть базовый URL для API, например /api/v1
  const REGISTER_URL = `${API_BASE_URL}/auth/register`;
  const LOGIN_URL = `${API_BASE_URL}/auth/login`;
  const ME_URL = `${API_BASE_URL}/auth/me`; // Эндпоинт для проверки текущего пользователя

  // --- Управление состоянием UI ---
  function showAuthForms() {
      if(authToggleContainer) authToggleContainer.style.display = 'flex';
      if(signInFormContainer) signInFormContainer.style.display = 'block'; // По умолчанию показываем вход
      if(showSignInBtn) showSignInBtn.classList.add('active');
      if(showSignUpBtn) showSignUpBtn.classList.remove('active');
      if(signUpFormContainer) signUpFormContainer.style.display = 'none';
      if(userInfoContainer) userInfoContainer.style.display = 'none';
      clearMessages();
  }

  function showUserInfo(userData) {
      if(authToggleContainer) authToggleContainer.style.display = 'none';
      if(signInFormContainer) signInFormContainer.style.display = 'none';
      if(signUpFormContainer) signUpFormContainer.style.display = 'none';
      if(userInfoContainer) userInfoContainer.style.display = 'block';

      if (welcomeMessageEl && userData && userData.name) { // Предполагаем, что /auth/me вернет объект с полем name
          welcomeMessageEl.textContent = `Welcome, ${userData.name}!`;
      } else if (welcomeMessageEl) {
          welcomeMessageEl.textContent = `Welcome!`;
      }
      clearMessages();
  }

  // --- Функция переключения форм (Sign In / Sign Up) ---
  function switchToForm(formToActivate) {
      if(!signInFormContainer || !signUpFormContainer || !showSignInBtn || !showSignUpBtn) return;

      signInFormContainer.style.display = 'none';
      signUpFormContainer.style.display = 'none';
      showSignInBtn.classList.remove('active');
      showSignUpBtn.classList.remove('active');

      if (formToActivate === 'signin') {
          signInFormContainer.style.display = 'block';
          showSignInBtn.classList.add('active');
      } else if (formToActivate === 'signup') {
          signUpFormContainer.style.display = 'block';
          showSignUpBtn.classList.add('active');
      }
      clearMessages();
  }

  function showMessage(element, message, type = 'error') {
      if(!element) return;
      element.textContent = message;
      element.className = 'form-message';
      element.classList.add(type);
      element.style.display = 'block';
  }

  function clearMessages() {
      if(signInMessage) {
          signInMessage.style.display = 'none';
          signInMessage.textContent = '';
      }
      if(signUpMessage) {
          signUpMessage.style.display = 'none';
          signUpMessage.textContent = '';
      }
  }

  // --- Логика аутентификации ---
  async function checkAuthStatus() {
      const token = localStorage.getItem('authToken');
      if (!token) {
          showAuthForms();
          return;
      }

      try {
          const response = await fetch(ME_URL, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`, // Стандартный способ передачи JWT
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
              const userData = await response.json();
              // userData может содержать { id, username, email, name, surname ... }
              showUserInfo(userData); // Показываем информацию о пользователе
          } else {
              localStorage.removeItem('authToken'); // Токен невалиден или истек
              showAuthForms();
              if (response.status === 401) {
                  // Можно показать специфичное сообщение, если токен невалиден
                  // showMessage(signInMessage, 'Your session has expired. Please log in again.', 'error');
              }
          }
      } catch (error) {
          console.error('Error checking auth status:', error);
          showAuthForms(); // В случае ошибки сети, показываем формы
      }
  }

  if(signUpForm) {
      signUpForm.addEventListener('submit', async function (event) {
          event.preventDefault();
          clearMessages();

          const name = document.getElementById('signup-name').value;
          const surname = document.getElementById('signup-surname').value;
          const email = document.getElementById('signup-email').value;
          const password = document.getElementById('signup-password').value;
          const confirmPassword = document.getElementById('signup-confirm-password').value;

          if (password !== confirmPassword) {
              showMessage(signUpMessage, 'Passwords do not match!', 'error');
              return;
          }

          const userData = {
              name: name,
              surname: surname,
              email: email,
              password: password
          };

          try {
              const response = await fetch(REGISTER_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
              });
              const data = await response.json();

              if (response.ok) {
                  showMessage(signUpMessage, data.message || 'Registration successful! Please sign in.', 'success');
                  signUpForm.reset();
                  setTimeout(() => switchToForm('signin'), 2000); // Переключаем на форму входа через 2 сек
              } else {
                  showMessage(signUpMessage, data.message || `Error: ${response.statusText}`, 'error');
              }
          } catch (error) {
              console.error('Registration error:', error);
              showMessage(signUpMessage, 'An unexpected error occurred during registration.', 'error');
          }
      });
  }

  if(signInForm) {
      signInForm.addEventListener('submit', async function (event) {
          event.preventDefault();
          clearMessages();

          const email = document.getElementById('signin-email').value;
          const password = document.getElementById('signin-password').value;
          const credentials = { email: email, password: password };

          try {
              const response = await fetch(LOGIN_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(credentials)
              });
              const data = await response.json();

              if (response.ok && data.token) {
                  localStorage.setItem('authToken', data.token);
                  // Вместо простого сообщения, теперь вызываем checkAuthStatus,
                  // который в свою очередь вызовет showUserInfo с данными пользователя
                  await checkAuthStatus(); // Проверить статус и обновить UI
                  // signInForm.reset(); // Можно оставить, если не мешает
              } else if (response.ok && !data.token) {
                   showMessage(signInMessage, 'Login successful, but no token received.', 'error');
              }
              else {
                  showMessage(signInMessage, data.message || `Error: ${response.statusText}`, 'error');
              }
          } catch (error) {
              console.error('Login error:', error);
              showMessage(signInMessage, 'An unexpected error occurred during login.', 'error');
          }
      });
  }

  if(logoutBtn) {
      logoutBtn.addEventListener('click', function () {
          localStorage.removeItem('authToken');
          showAuthForms(); // Показываем формы логина/регистрации
          // Можно добавить сообщение о выходе
          // showMessage(signInMessage, 'You have been logged out.', 'success');
      });
  }


  // --- Инициализация при загрузке страницы ---
  if(showSignInBtn && showSignUpBtn) { // Только если есть кнопки переключения
      showSignInBtn.addEventListener('click', (e) => { e.preventDefault(); switchToForm('signin'); });
      showSignUpBtn.addEventListener('click', (e) => { e.preventDefault(); switchToForm('signup'); });
  }

  checkAuthStatus(); // Проверяем, авторизован ли пользователь при загрузке
});