document.addEventListener('DOMContentLoaded', function () {
  // --- Элементы для переключения форм ---
  const showSignInBtn = document.getElementById('show-signin-btn');
  const showSignUpBtn = document.getElementById('show-signup-btn');
  const signInFormContainer = document.getElementById('signin-form-container');
  const signUpFormContainer = document.getElementById('signup-form-container');

  // --- Элементы форм ---
  const signInForm = document.getElementById('signin-form');
  const signUpForm = document.getElementById('signup-form');

  // --- Элементы для вывода сообщений ---
  const signInMessage = document.getElementById('signin-message');
  const signUpMessage = document.getElementById('signup-message');

  // Проверка существования основных элементов
  if (!showSignInBtn || !showSignUpBtn || !signInFormContainer || !signUpFormContainer || !signInForm || !signUpForm || !signInMessage || !signUpMessage) {
      console.error('One or more essential auth elements not found. Check your HTML IDs.');
      return;
  }

  // --- Функция переключения форм ---
  function switchToForm(formToActivate) {
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
      // Очищаем сообщения при переключении
      clearMessages();
  }

  // --- Функция для отображения сообщений ---
  function showMessage(element, message, type = 'error') {
      element.textContent = message;
      element.className = 'form-message'; // Сброс классов
      element.classList.add(type); // Добавление класса error или success
      element.style.display = 'block';
  }

  // --- Функция для очистки сообщений ---
  function clearMessages() {
      signInMessage.style.display = 'none';
      signInMessage.textContent = '';
      signUpMessage.style.display = 'none';
      signUpMessage.textContent = '';
  }

  // --- Обработчики переключения форм ---
  showSignInBtn.addEventListener('click', function (event) {
      event.preventDefault();
      switchToForm('signin');
  });

  showSignUpBtn.addEventListener('click', function (event) {
      event.preventDefault();
      switchToForm('signup');
  });

  // --- Обработчик для формы регистрации (Sign Up) ---
  signUpForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Предотвращаем стандартную отправку формы
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

      // Предполагаем, что бэкенд ожидает username, email, password.
      // Тебе нужно будет адаптировать это под то, что реально ожидает твой бэкенд.
      // Например, если бэкенд хочет 'name' и 'surname' отдельно, то так и отправляй.
      // Если бэкенд хочет 'username' как комбинацию, то сформируй его здесь.
      // Пока для примера отправим 'name', 'surname', 'email', 'password'.
      const userData = {
          name: name, // или username: name + ' ' + surname, если бэк ждет username
          surname: surname,
          email: email,
          password: password
      };

      try {
          const response = await fetch('/auth/register', { // Твой эндпоинт для регистрации
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData)
          });

          const data = await response.json(); // Пытаемся распарсить JSON в любом случае

          if (response.ok) {
              showMessage(signUpMessage, data.message || 'Registration successful! Please sign in.', 'success');
              signUpForm.reset(); // Очищаем поля формы
              // Можно добавить задержку и переключить на форму входа:
              // setTimeout(() => switchToForm('signin'), 2000);
          } else {
              // Бэкенд должен возвращать ошибки в формате JSON, например { message: "Error details" }
              showMessage(signUpMessage, data.message || `Error: ${response.status} - ${response.statusText}`, 'error');
          }
      } catch (error) {
          console.error('Registration error:', error);
          showMessage(signUpMessage, 'An unexpected error occurred. Please try again.', 'error');
      }
  });

  // --- Обработчик для формы входа (Sign In) ---
  signInForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Предотвращаем стандартную отправку формы
      clearMessages();

      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;

      const credentials = {
          email: email, // или username, если бэк этого ожидает
          password: password
      };

      try {
          const response = await fetch('/auth/login', { // Твой эндпоинт для логина
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
          });

          const data = await response.json(); // Пытаемся распарсить JSON

          if (response.ok) {
              // Предполагаем, что бэкенд возвращает токен в поле 'token' или 'accessToken'
              if (data.token) {
                  localStorage.setItem('authToken', data.token);
                  showMessage(signInMessage, 'Login successful! Redirecting...', 'success');
                  signInForm.reset();
                  // Здесь будет логика перехода на основную страницу или обновление UI
                  // Например: window.location.href = '/dashboard.html'; // или другая страница
                  console.log('User logged in. Token:', data.token);
                  // Пока просто выведем сообщение. Реальный переход/обновление UI сделаем позже.
              } else {
                   showMessage(signInMessage, 'Login successful, but no token received.', 'error');
              }
          } else {
              showMessage(signInMessage, data.message || `Error: ${response.status} - ${response.statusText}`, 'error');
          }
      } catch (error) {
          console.error('Login error:', error);
          showMessage(signInMessage, 'An unexpected error occurred. Please try again.', 'error');
      }
  });


  // Начальное состояние (по умолчанию форма входа видима)
  // switchToForm('signin'); // Раскомментируй, если удалишь инлайн-стили и класс active из HTML
});