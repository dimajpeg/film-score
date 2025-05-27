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
  
  let currentPage = 1;

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

  function createMovieCardHTML(movie) {
      if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
          console.warn('Skipping movie card (movies-page) due to missing data:', movie && movie.id ? movie.id : 'Unknown');
          return '';
      }
      const fallbackTitle = movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const title = getText(movie.titleKey, fallbackTitle);
      const year = movie.year;
      const rating = movie.rating;
      const poster = movie.posterUrl;
      const movieUrl = `movie-details.html?id=${movie.id}&page=${currentPage}`; // Сохраняем текущую страницу
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
          moviesGridContainer.innerHTML = `<p>${getText('messages.noMoviesMatchFilters', 'No movies match your current filters.')}</p>`;
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
              updateUrlWithCurrentState();
              renderCurrentPageMovies();
              const currentActive = paginationArea.querySelector('.btn-pagination.active');
              if (currentActive) currentActive.classList.remove('active');
              pageButton.classList.add('active');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          paginationArea.appendChild(pageButton);
      }
  }
  
  function updateUrlWithCurrentState() {
      const params = new URLSearchParams(window.location.search);
      params.set('page', currentPage.toString()); // currentPage должно быть строкой для set
      
      if (sortSelect && sortSelect.value !== 'default') {
          params.set('sort', sortSelect.value);
      } else {
          params.delete('sort'); // Удаляем, если значение по умолчанию
      }

      if (genreFilterOptionsContainer) {
          const selectedGenreCheckboxes = genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked');
          const selectedGenreKeys = Array.from(selectedGenreCheckboxes).map(cb => cb.value);
          if (selectedGenreKeys.length > 0) {
              params.set('genres', selectedGenreKeys.join(','));
          } else {
              params.delete('genres');
          }
      }
      
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      history.replaceState(null, '', newUrl);
  }

  function updateDisplayedMovies() {
      let moviesToShow = [...originalAllMovies];

      if (genreFilterOptionsContainer) {
          const selectedGenreCheckboxes = genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked');
          const selectedGenreKeys = Array.from(selectedGenreCheckboxes).map(cb => cb.value);
          if (selectedGenreKeys.length > 0) {
              moviesToShow = moviesToShow.filter(movie => 
                  selectedGenreKeys.some(selGenreKey => movie.genreKeys.includes(selGenreKey))
              );
          }
      }

      const sortBy = sortSelect ? sortSelect.value : 'default';
      // --- ВОССТАНОВЛЕНА ЛОГИКА СОРТИРОВКИ ---
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
              moviesToShow.sort((a, b) => getText(a.titleKey, a.id).localeCompare(getText(b.titleKey, b.id)));
              break;
          case 'title_desc':
              moviesToShow.sort((a, b) => getText(b.titleKey, b.id).localeCompare(getText(a.titleKey, a.id)));
              break;
          // default: // Можно не делать ничего или сортировать по ID/исходному порядку
          //   moviesToShow.sort((a,b) => originalAllMovies.indexOf(a) - originalAllMovies.indexOf(b));
          // break;
      }
      // --- КОНЕЦ ВОССТАНОВЛЕННОЙ ЛОГИКИ СОРТИРОВКИ ---

      currentMoviesToDisplay = moviesToShow;
      // currentPage = 1; // Сбрасываем на первую страницу ТОЛЬКО при изменении фильтров или сортировки
      renderCurrentPageMovies();
      setupPagination();
      updateUrlWithCurrentState();
  }

  function populateGenreFilters(selectedKeysFromUrl = []) {
      if (!genreFilterOptionsContainer) return;
      genreFilterOptionsContainer.innerHTML = '';
      const predefinedGenreKeys = [
          "genre.action", "genre.adventure", "genre.comedy", "genre.drama",
          "genre.fantasy", "genre.horror", "genre.scifi", "genre.thriller",
          "genre.animation", "genre.family", "genre.crime"
      ];

      predefinedGenreKeys.forEach(genreKey => {
          const genreName = getText(genreKey, genreKey.split('.').pop());
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'genre';
          checkbox.value = genreKey;
          if (selectedKeysFromUrl.includes(genreKey)) {
              checkbox.checked = true;
              label.classList.add('active');
          }
          checkbox.addEventListener('change', (event) => {
              if (event.target.checked) {
                  label.classList.add('active');
              } else {
                  label.classList.remove('active');
              }
              currentPage = 1; // Сброс на 1-ю страницу при смене фильтра
              updateDisplayedMovies();
          });
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(" " + genreName));
          genreFilterOptionsContainer.appendChild(label);
      });
  }

  function resetAllFilters() {
      if (sortSelect) sortSelect.value = 'default';
      
      const params = new URLSearchParams(); // Очищаем все параметры
      history.pushState(null, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
      
      populateGenreFilters(); // Перерисует чекбоксы без выбранных и без класса active
      currentPage = 1;
      updateDisplayedMovies();
  }

  function initializePage() {
      if (typeof allMoviesData === 'undefined' || !Array.isArray(allMoviesData) || allMoviesData.length === 0) {
          console.error('`allMoviesData` is not defined or empty. Cannot display movies.');
          if (moviesGridContainer) moviesGridContainer.innerHTML = `<p>${getText('messages.dataError', 'Error loading movie data.')}</p>`;
          return;
      }
      originalAllMovies = [...allMoviesData];
      
      const urlParams = new URLSearchParams(window.location.search);
      const pageFromUrl = parseInt(urlParams.get('page'));
      currentPage = (pageFromUrl && pageFromUrl > 0) ? pageFromUrl : 1;
      
      const sortFromUrl = urlParams.get('sort');
      if (sortSelect && sortFromUrl) {
          sortSelect.value = sortFromUrl;
      }
      
      const genresFromUrl = urlParams.get('genres')?.split(',') || [];
      
      populateGenreFilters(genresFromUrl);
      updateDisplayedMovies(); // Применит фильтры/сортировку из URL (если есть) и покажет нужную страницу

      if (sortSelect) {
          sortSelect.addEventListener('change', () => {
              currentPage = 1; 
              updateDisplayedMovies();
          });
      }
      if (resetBtn) {
          resetBtn.addEventListener('click', resetAllFilters);
      }
  }

  let pageInitialized = false;
  function runInitialization() {
      // Проверяем, что allMoviesData существует и не пуст
      if (!pageInitialized && window.i18n && typeof allMoviesData !== 'undefined' && allMoviesData.length > 0) {
          initializePage();
          pageInitialized = true;
      } else if (!pageInitialized && (typeof allMoviesData === 'undefined' || allMoviesData.length === 0) ) {
          // Если данные еще не загружены (маловероятно с defer, но на всякий случай)
          // Можно добавить таймер или другой механизм ожидания, но лучше убедиться в порядке загрузки скриптов
          console.warn("allMoviesData not ready for initialization, will retry or rely on events.");
      }
  }

  document.addEventListener('translationsReady', () => {
      console.log('[movies-page.js] Translations ready.');
      runInitialization();
  });

  document.addEventListener('languageChanged', () => {
      console.log('[movies-page.js] Language changed.');
      const selectedGenreKeys = genreFilterOptionsContainer 
          ? Array.from(genreFilterOptionsContainer.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value)
          : [];
      const currentSort = sortSelect ? sortSelect.value : 'default';

      populateGenreFilters(selectedGenreKeys); 
      if (sortSelect) { 
          Array.from(sortSelect.options).forEach(option => {
              const key = option.dataset.i18n || `page.movies.sort.${option.value}`; // Фоллбэк для ключа
              if(option.value === 'default' && !option.dataset.i18n) option.dataset.i18n = 'page.movies.sort.default'; // Устанавливаем для default
              if (option.dataset.i18n) option.textContent = getText(option.dataset.i18n, option.textContent);
          });
          sortSelect.value = currentSort; 
      }
      updateDisplayedMovies(); 
  });

  runInitialization(); // Попытка инициализации при DOMContentLoaded
});