// movies-page.js

document.addEventListener('DOMContentLoaded', () => {
  const moviesGridContainer = document.getElementById('all-movies-grid');
  const genreFilterOptionsContainer = document.getElementById('genre-filter-options');
  const sortSelect = document.getElementById('sort-movies');
  const resetBtn = document.getElementById('reset-filters-btn');
  const paginationArea = document.getElementById('pagination-area');

  let currentMoviesToDisplay = []; // Фильмы для текущего отображения (после фильтров и сортировки)
  let originalAllMovies = [];   // Неизменная копия всех фильмов из movies-data.js

  const MOVIES_PER_PAGE = 20;
  let currentPage = 1;

  // Функция для получения текста (с использованием i18n.js)
  function getText(key, fallbackTextIfKeyNotFound = '') {
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
          const translation = window.i18n.getTranslation(key);
          if (translation !== key) return translation; // Перевод найден
          // Если перевод не найден, используем fallback или "чистую" часть ключа
          return fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      // Фоллбэк, если i18n вообще недоступен
      return fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Функция для создания HTML одной карточки фильма
  function createMovieCardHTML(movie) {
      if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
          console.warn('Skipping movie card (movies-page) due to missing data:', movie && movie.id ? movie.id : 'Unknown');
          return '';
      }
      const title = getText(movie.titleKey, movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      const year = movie.year;
      const rating = movie.rating;
      const poster = movie.posterUrl;
      const movieUrl = `movie-details.html?id=${movie.id}`;
      const genresHTML = movie.genreKeys.map(genreKey => {
          const defaultGenreName = genreKey.split('.').pop();
          const genreName = getText(genreKey, defaultGenreName.charAt(0).toUpperCase() + defaultGenreName.slice(1));
          return `<span>${genreName}</span>`;
      }).join(', ');

      return `
          <article class="movie-card">
            <a href="${movieUrl}" class="movie-poster-link">
              <img src="${poster}" alt="${title} Poster">
            </a>
            <div class="movie-info">
              <h3><a href="${movieUrl}">${title}</a></h3>
              <div class="movie-meta">
                <span class="movie-year">${year}</span>
                <span class="movie-genres">${genresHTML || getText('genre.unknown', 'N/A')}</span>
              </div>
              <div class="movie-rating">
                <svg class="icon icon-star"><use xlink:href="#icon-star-path"/></svg>
                <span>${rating}</span>
              </div>
            </div>
          </article>
      `;
  }

  // Функция для рендеринга текущей страницы фильмов
  function renderCurrentPageMovies() {
      if (!moviesGridContainer) return;

      const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
      const endIndex = startIndex + MOVIES_PER_PAGE;
      const paginatedMovies = currentMoviesToDisplay.slice(startIndex, endIndex);

      if (!paginatedMovies || paginatedMovies.length === 0) {
          moviesGridContainer.innerHTML = `<p>${getText('messages.noMoviesMatchFilters', 'No movies match your current filters.')}</p>`;
          return;
      }
      moviesGridContainer.innerHTML = paginatedMovies.map(movie => createMovieCardHTML(movie)).join('');
  }

  // Функция для настройки пагинации
  function setupPagination() {
      if (!paginationArea) return;
      paginationArea.innerHTML = ''; 

      const totalPages = Math.ceil(currentMoviesToDisplay.length / MOVIES_PER_PAGE);
      if (totalPages <= 1) return; 

      for (let i = 1; i <= totalPages; i++) {
          const pageButton = document.createElement('button');
          pageButton.classList.add('btn', 'btn-pagination');
          if (i === currentPage) {
              pageButton.classList.add('active');
          }
          pageButton.textContent = i;
          pageButton.addEventListener('click', () => {
              currentPage = i;
              renderCurrentPageMovies(); // Рендерим новую страницу
              
              const currentActive = paginationArea.querySelector('.btn-pagination.active');
              if (currentActive) currentActive.classList.remove('active');
              pageButton.classList.add('active');

              window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          paginationArea.appendChild(pageButton);
      }
  }

  // Главная функция для обновления отображаемых фильмов (фильтрация, сортировка, пагинация)
  function updateDisplayedMovies() {
      let moviesToShow = [...originalAllMovies]; // Начинаем с полной копии всех фильмов

      // 1. Применяем фильтр по жанрам
      if (genreFilterOptionsContainer) {
          const selectedGenreCheckboxes = genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked');
          const selectedGenreKeys = Array.from(selectedGenreCheckboxes).map(cb => cb.value);

          if (selectedGenreKeys.length > 0) {
              moviesToShow = moviesToShow.filter(movie => {
                  // Фильм должен содержать ХОТЯ БЫ ОДИН из выбранных жанров (логика "ИЛИ")
                  // Если нужна логика "И" (все выбранные жанры), используй .every()
                  return selectedGenreKeys.some(selGenreKey => movie.genreKeys.includes(selGenreKey));
              });
          }
      }

      // 2. Применяем сортировку
      const sortBy = sortSelect ? sortSelect.value : 'default';
      switch (sortBy) {
          case 'rating_desc':
              moviesToShow.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
              break;
          case 'rating_asc':
              moviesToShow.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
              break;
          case 'year_desc':
              moviesToShow.sort((a, b) => b.year - a.year);
              break;
          case 'year_asc':
              moviesToShow.sort((a, b) => a.year - b.year);
              break;
          case 'title_asc':
              moviesToShow.sort((a, b) => getText(a.titleKey).localeCompare(getText(b.titleKey)));
              break;
          case 'title_desc':
              moviesToShow.sort((a, b) => getText(b.titleKey).localeCompare(getText(a.titleKey)));
              break;
      }

      currentMoviesToDisplay = moviesToShow; // Обновляем глобальный массив для пагинации
      currentPage = 1; // Сбрасываем на первую страницу после фильтрации/сортировки
      renderCurrentPageMovies(); // Рендерим первую страницу отфильтрованных/отсортированных
      setupPagination();       // Обновляем пагинацию
  }


  // Функция для генерации чекбоксов жанров
  function populateGenreFilters(selectedKeysBeforeReload = []) {
      if (!genreFilterOptionsContainer) return;
      genreFilterOptionsContainer.innerHTML = ''; // Очищаем предыдущие

      const predefinedGenreKeys = [ // Твои 10 утвержденных жанров (ключи)
          "genre.action", "genre.adventure", "genre.comedy", "genre.drama",
          "genre.fantasy", "genre.horror", "genre.scifi", "genre.thriller",
          "genre.animation", "genre.family"
      ];

      predefinedGenreKeys.forEach(genreKey => {
          const genreName = getText(genreKey, genreKey.split('.').pop());
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'genre';
          checkbox.value = genreKey;

          // Восстанавливаем состояние, если было (например, после смены языка)
          if (selectedKeysBeforeReload.includes(genreKey)) {
              checkbox.checked = true;
              label.classList.add('active');
          }

          checkbox.addEventListener('change', (event) => {
              if (event.target.checked) {
                  label.classList.add('active');
              } else {
                  label.classList.remove('active');
              }
              updateDisplayedMovies(); // Применяем фильтры и сортировку
          });

          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(" " + genreName));
          genreFilterOptionsContainer.appendChild(label);
      });
  }

  // Функция сброса всех фильтров
  function resetAllFilters() {
      if (sortSelect) sortSelect.value = 'default';
      if (genreFilterOptionsContainer) {
          const genreCheckboxes = genreFilterOptionsContainer.querySelectorAll('input[name="genre"]');
          genreCheckboxes.forEach(cb => {
              cb.checked = false;
              if (cb.parentElement && cb.parentElement.tagName === 'LABEL') {
                  cb.parentElement.classList.remove('active');
              }
          });
      }
      updateDisplayedMovies(); // Применяем (т.е. сбрасываем к исходному состоянию)
  }

  // --- Инициализация при загрузке страницы ---
  function initializePage() {
      if (typeof allMoviesData !== 'undefined' && allMoviesData.length > 0) {
          originalAllMovies = [...allMoviesData]; // Сохраняем копию
          currentMoviesToDisplay = [...originalAllMovies]; // Изначально показываем все
          
          populateGenreFilters(); // Заполняем фильтры жанров
          updateDisplayedMovies(); // Первичный рендер (применит сортировку по умолчанию и покажет 1-ю страницу)

          if (sortSelect) {
              sortSelect.addEventListener('change', updateDisplayedMovies);
          }
          if (resetBtn) {
              resetBtn.addEventListener('click', resetAllFilters);
          }
      } else {
          console.error('`allMoviesData` is not defined or empty. Cannot display movies.');
          if (moviesGridContainer) moviesGridContainer.innerHTML = `<p>${getText('messages.dataError', 'Error loading movie data.')}</p>`;
      }
  }

  initializePage(); // Вызов инициализации

  // Обновление при смене языка
  document.addEventListener('languageChanged', () => {
      // Сохраняем текущие выбранные жанры (по ключам)
      const selectedGenreKeys = genreFilterOptionsContainer 
          ? Array.from(genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value)
          : [];

      populateGenreFilters(selectedGenreKeys); // Перерисовываем чекбоксы с новыми переводами и сохраненным состоянием
      updateDisplayedMovies(); // Перерисовываем фильмы с новыми переводами и текущими фильтрами/сортировкой
  });
});