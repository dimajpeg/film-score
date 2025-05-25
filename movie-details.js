// js/movie-details.js

document.addEventListener('DOMContentLoaded', function () {
  // --- Элементы для страницы деталей фильма ---
  // (Здесь будет код для заполнения заголовка, постера, описания и т.д. из movies-data.js,
  // который мы напишем позже, когда у тебя будут данные)

  // --- Логика для виджета пользовательской оценки ---
  const userRatingWidget = document.querySelector('.user-rating-widget');
  const starsInteractiveContainer = document.querySelector('.stars-interactive');
  const currentRatingDisplay = document.getElementById('current-rating-display');
  const userRatingValueInput = document.getElementById('user-movie-rating-value');
  const submitRatingBtn = document.getElementById('submit-user-rating-btn');
  const ratingLoginPrompt = document.getElementById('rating-login-prompt');
  const userRatingMessage = document.getElementById('user-rating-message'); // Для сообщений

  let selectedRating = 0; // Текущая выбранная пользователем оценка
  let potentialRating = 0; // Оценка при наведении мыши

  // Функция для получения перевода (убедись, что i18n.js загружен и window.i18n доступно)
  function getDetailsText(key, params = {}, fallbackText = '') {
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
          return window.i18n.getTranslation(key, params);
      }
      // Простой фоллбэк
      if (fallbackText) { /* ... (как в header-auth.js) ... */ }
      return key;
  }
  
  function showRatingMessage(messageText, type = 'error') {
      if (!userRatingMessage) return;
      userRatingMessage.textContent = messageText;
      userRatingMessage.className = 'form-message'; // Reset classes
      userRatingMessage.classList.add(type);
      userRatingMessage.style.display = 'block';
  }
  function clearRatingMessage() {
      if (!userRatingMessage) return;
      userRatingMessage.style.display = 'none';
      userRatingMessage.textContent = '';
  }


  function updateStarsDisplay(ratingToDisplay) {
      if (!starsInteractiveContainer) return;
      const stars = starsInteractiveContainer.querySelectorAll('.star-icon.interactive');
      stars.forEach((star, index) => {
          const starValue = parseFloat(star.dataset.ratingValue); // 1, 2, 3, 4, 5
          star.classList.remove('selected', 'half-selected', 'hover'); // Сначала сбрасываем все

          if (ratingToDisplay >= starValue) {
              star.classList.add('selected'); // Целая звезда
          } else if (ratingToDisplay >= starValue - 0.5) {
              // Для "half-selected" нам нужен более сложный CSS или модификация SVG
              // Пока что просто сделаем ее 'selected' если больше или равно X.5,
              // или 'hover' если это только подсветка.
              // Простой вариант: если 3.5, то 3 звезды selected, 4-я не selected.
              // Или: если 3.5, то 3 звезды selected, а 4-я звезда получает спец. класс для половинки.
              // Для простоты пока будем округлять вниз для 'selected'
              // star.classList.add('half-selected'); // Это потребует CSS для .half-selected
          }
          // Логика для hover будет отдельной, чтобы не конфликтовать с selected
      });
  }
  
  function updateHoverStarsDisplay(hoverRating) {
      if (!starsInteractiveContainer) return;
      const stars = starsInteractiveContainer.querySelectorAll('.star-icon.interactive');
      stars.forEach(star => {
          const starValue = parseFloat(star.dataset.ratingValue);
          star.classList.remove('hover'); // Убираем hover со всех
          if (hoverRating >= starValue - 0.5) { // Подсвечиваем, если hoverRating покрывает хотя бы левую половину
               if (hoverRating < starValue && hoverRating >= starValue - 0.5) {
                  // Здесь логика для подсветки левой половины звезды, если CSS это поддерживает
                  // Пока просто подсветим всю звезду, если курсор на ней или левее
                  star.classList.add('hover');
               } else if (hoverRating >= starValue) {
                  star.classList.add('hover');
               }
          }
      });
  }


  if (starsInteractiveContainer) {
      const stars = Array.from(starsInteractiveContainer.querySelectorAll('.star-icon.interactive'));

      stars.forEach(star => {
          star.addEventListener('mousemove', function(event) {
              const rect = star.getBoundingClientRect();
              const hoverPosition = event.clientX - rect.left; // Позиция мыши внутри звезды
              const starValue = parseFloat(star.dataset.ratingValue);
              
              if (hoverPosition < rect.width / 2) {
                  potentialRating = starValue - 0.5; // Левая половина
              } else {
                  potentialRating = starValue; // Правая половина (целая звезда)
              }
              updateHoverStarsDisplay(potentialRating);
              if (currentRatingDisplay) currentRatingDisplay.textContent = `${potentialRating.toFixed(1)} / 5.0`;
          });

          star.addEventListener('mouseleave', function() {
              updateHoverStarsDisplay(selectedRating); // Возвращаем подсветку к выбранной оценке
              if (currentRatingDisplay) {
                  currentRatingDisplay.textContent = selectedRating > 0 ? `${selectedRating.toFixed(1)} / 5.0` : "";
              }
          });

          star.addEventListener('click', function() {
              selectedRating = potentialRating; // Фиксируем оценку, которая была при наведении
              userRatingValueInput.value = selectedRating;
              updateStarsDisplay(selectedRating); // Обновляем "закрашенные" звезды
               if (currentRatingDisplay) currentRatingDisplay.textContent = `${selectedRating.toFixed(1)} / 5.0`;
              if (submitRatingBtn) submitRatingBtn.style.display = 'inline-block';
              clearRatingMessage();
          });
      });
  }

  if (submitRatingBtn) {
      submitRatingBtn.addEventListener('click', function() {
          const ratingValue = userRatingValueInput.value;
          if (ratingValue && parseFloat(ratingValue) > 0) {
              // Здесь будет логика отправки на бэкенд
              console.log(`Submitting rating: ${ratingValue} for movie ID: [MOVIE_ID_HERE]`);
              showRatingMessage(getDetailsText('message.ratingSubmitted', {}, `Rating ${ratingValue} submitted (simulated)!`), 'success');
              // submitRatingBtn.style.display = 'none'; // Можно скрыть после отправки
          } else {
              showRatingMessage(getDetailsText('message.selectRatingFirst', {}, 'Please select a rating first.'), 'error');
          }
      });
  }

  function checkUserAuthForRating() {
      const token = localStorage.getItem('authToken');
      if (token) {
          if (userRatingWidget) userRatingWidget.style.display = 'block';
          if (ratingLoginPrompt) ratingLoginPrompt.style.display = 'none';
          // TODO: Загрузить и отобразить ранее сохраненную оценку пользователя для этого фильма
          // let userPreviousRating = ... ; // получить с бэка
          // selectedRating = userPreviousRating;
          // userRatingValueInput.value = selectedRating;
          // updateStarsDisplay(selectedRating);
          // if (currentRatingDisplay && selectedRating > 0) currentRatingDisplay.textContent = `${selectedRating.toFixed(1)} / 5.0`;
      } else {
          if (userRatingWidget) userRatingWidget.style.display = 'none';
          if (ratingLoginPrompt) ratingLoginPrompt.style.display = 'block';
      }
  }

  // Инициализация при загрузке
  checkUserAuthForRating();

  // Слушаем события логина/логаута из header-auth.js
  document.addEventListener('userLoggedInGlobal', checkUserAuthForRating);
  document.addEventListener('userLoggedOutGlobal', checkUserAuthForRating);

  // --- Конец логики для виджета пользовательской оценки ---


  // --- Логика ЗАПОЛНЕНИЯ СТРАНИЦЫ ДАННЫМИ ФИЛЬМА ---
  // (Это мы напишем в следующем шаге, когда у тебя будут данные в movies-data.js)
  function loadMovieDetails() {
      const urlParams = new URLSearchParams(window.location.search);
      const movieId = urlParams.get('id');

      if (!movieId) {
          console.error('Movie ID not found in URL');
          // TODO: Показать сообщение об ошибке на странице
          return;
      }

      // Предполагаем, что allMoviesData доступен (из movies-data.js)
      if (typeof allMoviesData !== 'undefined') {
          const movie = allMoviesData.find(m => m.id === movieId);

          if (movie) {
              // Заполняем страницу
              document.title = getDetailsText(movie.titleKey, {}, movie.id); // Название фильма в title страницы
              
              const titleEl = document.getElementById('movie-details-title');
              const yearEl = document.getElementById('movie-details-year');
              // ... и так далее для всех элементов
              // titleEl.textContent = getDetailsText(movie.titleKey, {}, movie.id);
              // yearEl.textContent = movie.year;
              // ...

              // Заполняем иконку User Rating
              // checkUserAuthForRating(); // Вызывается при DOMContentLoaded, но может потребоваться обновить после загрузки фильма

              console.log("Movie data for JS rendering:", movie); // Для отладки
          } else {
              console.error(`Movie with ID ${movieId} not found.`);
              // TODO: Показать сообщение "Фильм не найден"
          }
      } else {
          console.warn('moviesData is not defined. Make sure movies-data.js is loaded.');
      }
  }

  // loadMovieDetails(); // Вызовем это, когда movies-data.js будет готов и заполнен
  // --- Конец логики ЗАПОЛНЕНИЯ СТРАНИЦЫ ---

});