// movies-page.js
document.addEventListener('DOMContentLoaded', () => {
  const moviesGridContainer = document.getElementById('all-movies-grid');
  const genreFilterOptionsContainer = document.getElementById('genre-filter-options');
  const sortSelect = document.getElementById('sort-movies');
  const resetBtn = document.getElementById('reset-filters-btn');
  const paginationArea = document.getElementById('pagination-area');

  let currentMoviesToDisplay = [];
  let originalAllMovies = [];

  const MOVIES_PER_PAGE = 20;
  let currentPage = 1; // Будет обновляться из URL

  function getText(key, fallbackTextIfKeyNotFound = '') { /* ... (без изменений) ... */ }
  function createMovieCardHTML(movie) { /* ... (без изменений, но ссылка будет вести на movie-details) ... */
      // ВАЖНО: В ссылке на фильм теперь будем добавлять текущую страницу пагинации
      const movieUrl = `movie-details.html?id=${movie.id}&page=${currentPage}`; // Добавляем &page=...
      // ... остальной код createMovieCardHTML
      if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
          console.warn('Skipping movie card (movies-page) due to missing data:', movie && movie.id ? movie.id : 'Unknown');
          return '';
      }
      const fallbackTitle = movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const title = getText(movie.titleKey, fallbackTitle);
      const year = movie.year;
      const rating = movie.rating;
      const poster = movie.posterUrl;
      // const movieUrl = `movie-details.html?id=${movie.id}`; // Старая ссылка
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


  function renderCurrentPageMovies() {
      if (!moviesGridContainer) return;
      const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
      const endIndex = startIndex + MOVIES_PER_PAGE;
      const paginatedMovies = currentMoviesToDisplay.slice(startIndex, endIndex);

      if (!paginatedMovies || paginatedMovies.length === 0) {
          moviesGridContainer.innerHTML = `<p>${getText('messages.noMoviesMatchFilters', 'No movies match current filters.')}</p>`;
          return;
      }
      moviesGridContainer.innerHTML = paginatedMovies.map(movie => createMovieCardHTML(movie)).join('');
  }

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
              updateUrlWithCurrentState(); // Обновляем URL
              renderCurrentPageMovies();
              const currentActive = paginationArea.querySelector('.btn-pagination.active');
              if (currentActive) currentActive.classList.remove('active');
              pageButton.classList.add('active');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          paginationArea.appendChild(pageButton);
      }
  }
  
  // НОВАЯ ФУНКЦИЯ для обновления URL
  function updateUrlWithCurrentState() {
      const params = new URLSearchParams(window.location.search);
      params.set('page', currentPage);
      // В будущем сюда добавим параметры для сортировки и жанров
      // params.set('sort', sortSelect.value);
      // const selectedGenres = ...; params.set('genres', selectedGenres.join(','));
      
      // Обновляем URL без перезагрузки страницы
      // Используем replaceState, чтобы не засорять историю браузера при каждом клике на пагинацию
      // Если хочешь, чтобы каждый клик был в истории, используй pushState
      history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }


  function updateDisplayedMovies() {
      let moviesToShow = [...originalAllMovies];
      // ... (логика фильтрации по жанрам) ...
      if (genreFilterOptionsContainer) {
          const selectedGenreCheckboxes = genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked');
          const selectedGenreKeys = Array.from(selectedGenreCheckboxes).map(cb => cb.value);
          if (selectedGenreKeys.length > 0) {
              moviesToShow = moviesToShow.filter(movie => 
                  selectedGenreKeys.some(selGenreKey => movie.genreKeys.includes(selGenreKey))
              );
          }
      }

      // ... (логика сортировки) ...
      const sortBy = sortSelect ? sortSelect.value : 'default';
      switch (sortBy) { /* ... cases ... */ }


      currentMoviesToDisplay = moviesToShow;
      // currentPage = 1; // НЕ сбрасываем currentPage здесь, если это не полный сброс фильтров
      renderCurrentPageMovies();
      setupPagination();
      updateUrlWithCurrentState(); // Обновляем URL после применения фильтров/сортировки
  }

  function populateGenreFilters(selectedKeysFromUrl = []) { // Принимаем выбранные ключи из URL
      if (!genreFilterOptionsContainer) return;
      genreFilterOptionsContainer.innerHTML = '';
      const predefinedGenreKeys = [ /* ... твои жанры ... */ ];

      predefinedGenreKeys.forEach(genreKey => {
          const genreName = getText(genreKey, genreKey.split('.').pop());
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'genre';
          checkbox.value = genreKey;

          if (selectedKeysFromUrl.includes(genreKey)) { // Восстанавливаем из URL
              checkbox.checked = true;
              label.classList.add('active');
          }

          checkbox.addEventListener('change', (event) => {
              if (event.target.checked) {
                  label.classList.add('active');
              } else {
                  label.classList.remove('active');
              }
              currentPage = 1; // Сбрасываем на первую страницу при изменении фильтров
              updateDisplayedMovies();
          });
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(" " + genreName));
          genreFilterOptionsContainer.appendChild(label);
      });
  }

  function resetAllFilters() {
      if (sortSelect) sortSelect.value = 'default';
      // Сбрасываем URL-параметры
      const params = new URLSearchParams();
      // params.set('page', '1'); // Можно установить первую страницу или вообще убрать параметр page
      history.pushState(null, '', `${window.location.pathname}?${params.toString()}`); // Или replaceState
      
      // Сбрасываем состояние чекбоксов и вызываем обновление
      populateGenreFilters(); // Перерисует чекбоксы без выбранных
      currentPage = 1;
      updateDisplayedMovies();
  }

  function initializePage() {
      if (typeof allMoviesData !== 'undefined' && allMoviesData.length > 0) {
          originalAllMovies = [...allMoviesData];
          
          // Читаем параметры из URL при загрузке
          const urlParams = new URLSearchParams(window.location.search);
          const pageFromUrl = parseInt(urlParams.get('page'));
          if (pageFromUrl && pageFromUrl > 0) {
              currentPage = pageFromUrl;
          } else {
              currentPage = 1;
          }
          // TODO: Прочитать и применить сортировку и жанры из URL
          // const sortFromUrl = urlParams.get('sort');
          // if (sortSelect && sortFromUrl) sortSelect.value = sortFromUrl;
          // const genresFromUrl = urlParams.get('genres')?.split(',') || [];
          
          populateGenreFilters(/*genresFromUrl*/); // Передаем жанры из URL для установки чекбоксов
          updateDisplayedMovies(); // Применит фильтры/сортировку из URL и покажет нужную страницу

          if (sortSelect) {
              sortSelect.addEventListener('change', () => {
                  currentPage = 1; // Сбрасываем на первую страницу при смене сортировки
                  updateDisplayedMovies();
              });
          }
          if (resetBtn) {
              resetBtn.addEventListener('click', resetAllFilters);
          }
      } else { /* ... обработка ошибки ... */ }
  }

  // Инициализация и обработка смены языка
  let pageInitialized = false;
  function runInitialization() {
      if (!pageInitialized && window.i18n && typeof allMoviesData !== 'undefined') {
          initializePage();
          pageInitialized = true;
      }
  }

  document.addEventListener('translationsReady', () => {
      console.log('[movies-page.js] Translations ready.');
      runInitialization();
  });
  document.addEventListener('languageChanged', () => {
      console.log('[movies-page.js] Language changed.');
      // Сохраняем текущее состояние перед перерисовкой
      const selectedGenreKeys = genreFilterOptionsContainer 
          ? Array.from(genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value)
          : [];
      const currentSort = sortSelect ? sortSelect.value : 'default';

      populateGenreFilters(selectedGenreKeys); // Перерисовываем лейблы жанров
      if (sortSelect) { // Обновляем текст в опциях сортировки
          Array.from(sortSelect.options).forEach(option => {
              const key = option.dataset.i18n; // Если ты добавлял data-i18n к <option>
              if (key) option.textContent = getText(key, option.textContent);
          });
          sortSelect.value = currentSort; // Восстанавливаем выбор сортировки
      }
      updateDisplayedMovies(); // Перерисовываем фильмы
  });

  // Попытка ранней инициализации, если все уже загружено
  runInitialization();
});