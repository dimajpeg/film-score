document.addEventListener('DOMContentLoaded', function () {
  const showSignInBtn = document.getElementById('show-signin-btn');
  const showSignUpBtn = document.getElementById('show-signup-btn');

  const signInFormContainer = document.getElementById('signin-form-container');
  const signUpFormContainer = document.getElementById('signup-form-container');

  // Проверяем, существуют ли все необходимые элементы
  if (!showSignInBtn || !showSignUpBtn || !signInFormContainer || !signUpFormContainer) {
      console.error('Auth form elements not found. Check your HTML IDs.');
      return; // Прекращаем выполнение, если что-то не найдено
  }

  function switchToForm(formToActivate) {
      // Скрываем обе формы
      signInFormContainer.style.display = 'none';
      signUpFormContainer.style.display = 'none';

      // Убираем класс 'active' у обеих кнопок
      showSignInBtn.classList.remove('active');
      showSignUpBtn.classList.remove('active');

      // Показываем нужную форму и делаем активной соответствующую кнопку
      if (formToActivate === 'signin') {
          signInFormContainer.style.display = 'block';
          showSignInBtn.classList.add('active');
      } else if (formToActivate === 'signup') {
          signUpFormContainer.style.display = 'block';
          showSignUpBtn.classList.add('active');
      }
  }

  // Обработчик для кнопки "Sign In"
  showSignInBtn.addEventListener('click', function (event) {
      event.preventDefault(); // Предотвращаем стандартное поведение кнопки, если она внутри <form>
      switchToForm('signin');
  });

  // Обработчик для кнопки "Sign Up"
  showSignUpBtn.addEventListener('click', function (event) {
      event.preventDefault(); // Предотвращаем стандартное поведение кнопки
      switchToForm('signup');
  });

  // Начальное состояние:
  // Форма входа уже видима по умолчанию из-за отсутствия `style="display: none;"` в HTML
  // и кнопка "Sign In" имеет класс 'active' в HTML.
  // Этот вызов здесь для явного управления, если бы HTML не задавал начальное состояние.
  // Если ты уберешь `style="display: none;"` у `signup-form-container` в HTML
  // и класс `active` у `show-signin-btn`, то следующая строка установит начальное состояние:
  // switchToForm('signin');
});