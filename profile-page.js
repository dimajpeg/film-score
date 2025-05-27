// js/profile-page.js

document.addEventListener('DOMContentLoaded', () => {
  const profileNameElement = document.getElementById('profile-name');
  const profileEmailElement = document.getElementById('profile-email');
  const logoutButtonProfile = document.getElementById('logout-button-profile');
  const myRatedMoviesGrid = document.getElementById('my-rated-movies-grid');
  const sortRatedSelect = document.getElementById('sort-my-ratings'); // Получаем селект сортировки

  let currentRatedMovies = []; // Массив для хранения объектов фильмов с пользовательской оценкой и датой
  let originalAllMovies = []; // Будет заполнено из allMoviesData, если оно еще не там

  function getText(key, fallbackTextIfKeyNotFound = '', params = {}) {
    if (window.i18n && typeof window.i18n.getTranslation === 'function') {
      const translation = window.i18n.getTranslation(key, params);
      if (translation !== key) return translation;
      let fallback = fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (typeof fallback === 'string' && params && Object.keys(params).length > 0) { /* ... */ }
      return fallback;
    }
    let fallback = fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (typeof fallback === 'string' && params && Object.keys(params).length > 0) { /* ... */ }
    return fallback;
  }

  function createRatedMovieCardHTML(movieDataWithUserRating) {
    const movie = movieDataWithUserRating; 
    const userRatingDetails = movieDataWithUserRating.userRatingDetails;

    if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !userRatingDetails || !userRatingDetails.rating) {
        console.warn('[RatedCard] Skipping card due to missing data:', movie);
        return '';
    }

    const fallbackTitle = movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const title = getText(movie.titleKey, fallbackTitle);
    const year = movie.year || ''; 
    const poster = movie.posterUrl;
    const movieUrl = `movie-details.html?id=${movie.id}`; 
    
    const genresHTML = movie.genreKeys && movie.genreKeys.length > 0 
        ? movie.genreKeys.map(genreKey => {
            const defaultGenreName = genreKey.split('.').pop();
            const genreName = getText(genreKey, defaultGenreName.charAt(0).toUpperCase() + defaultGenreName.slice(1));
            return `<span>${genreName}</span>`;
          }).join(', ')
        : ''; 

    const userRatingValue = parseFloat(userRatingDetails.rating).toFixed(1);

    // УБИРАЕМ КОММЕНТАРИИ И ПЛЕЙСХОЛДЕРЫ ИЗ HTML-СТРОКИ
    return `
        <article class="movie-card rated-movie-card">
          <a href="${movieUrl}" class="movie-poster-link">
            <img src="${poster}" alt="${title} Poster">
          </a>
          <div class="movie-info">
            <h3><a href="${movieUrl}">${title}</a></h3>
            <div class="movie-meta">
              ${year ? `<span class="movie-year">${year}</span>` : ''}
              ${year && genresHTML ? '<span class="meta-separator">•</span>' : ''}
              ${genresHTML ? `<span class="movie-genres">${genresHTML}</span>` : ''}
            </div>
            
            <div class="movie-rating your-rating-profile">
              <svg class="icon icon-star"><use xlink:href="#icon-star-path"/></svg>
              <span>${userRatingValue}</span>
            </div>
          </div>
        </article>
    `;
}



  // Загружает данные, фильтрует оцененные и вызывает сортировку/рендеринг
  function loadAndPrepareUserRatedMovies() {
    if (typeof allMoviesData === 'undefined') {
      console.error("`allMoviesData` is not defined in profile-page.js. Make sure movies-data.js is loaded.");
      if (myRatedMoviesGrid) myRatedMoviesGrid.innerHTML = `<p>${getText('page.profile.noRatingsYet', "Error loading movie data.")}</p>`;
      return;
    }
    originalAllMovies = [...allMoviesData]; // Копируем, если нужно для других целей, но здесь не обязательно

    const userRatingsString = localStorage.getItem('userMovieRatings');
    const userRatingsData = userRatingsString ? JSON.parse(userRatingsString) : {};

    if (Object.keys(userRatingsData).length === 0) {
      if (myRatedMoviesGrid) myRatedMoviesGrid.innerHTML = `<p>${getText('page.profile.noRatingsYet', "You haven't rated any movies yet.")}</p>`;
      currentRatedMovies = []; // Очищаем, если нет оценок
      return;
    }

    currentRatedMovies = []; // Очищаем перед заполнением
    for (const movieId in userRatingsData) {
      if (userRatingsData.hasOwnProperty(movieId)) {
        const movieDataFromGlobal = originalAllMovies.find(m => m.id === movieId);
        if (movieDataFromGlobal) {
          currentRatedMovies.push({
            ...movieDataFromGlobal,
            userRatingDetails: userRatingsData[movieId]
          });
        } else {
          console.warn(`Movie data for rated movie ID "${movieId}" not found in allMoviesData.`);
        }
      }
    }
    sortAndRenderRatedMovies(); // Вызываем сортировку и рендеринг
  }

  function sortAndRenderRatedMovies() {
    if (!myRatedMoviesGrid) return;

    const sortBy = sortRatedSelect ? sortRatedSelect.value : 'date_desc';
    let moviesToRender = [...currentRatedMovies];

    switch (sortBy) {
      case 'rating_desc':
        moviesToRender.sort((a, b) => b.userRatingDetails.rating - a.userRatingDetails.rating);
        break;
      case 'rating_asc':
        moviesToRender.sort((a, b) => a.userRatingDetails.rating - b.userRatingDetails.rating);
        break;
      case 'date_desc':
        moviesToRender.sort((a, b) => new Date(b.userRatingDetails.timestamp) - new Date(a.userRatingDetails.timestamp));
        break;
      case 'date_asc':
        moviesToRender.sort((a, b) => new Date(a.userRatingDetails.timestamp) - new Date(b.userRatingDetails.timestamp));
        break;
    }

    if (moviesToRender.length > 0) {
      myRatedMoviesGrid.innerHTML = moviesToRender.map(movieWithRating =>
        createRatedMovieCardHTML(movieWithRating, movieWithRating.userRatingDetails) // Передаем весь объект movieWithRating и userRatingDetails
      ).join('');
    } else {
      // Это сообщение может быть не нужно здесь, если Object.keys(userRatingsData).length === 0 уже обработан
      myRatedMoviesGrid.innerHTML = `<p>${getText('page.profile.noRatingsYet', "You haven't rated any movies yet.")}</p>`;
    }
  }

  function displayUserProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = 'sign-up.html';
      return;
    }
    const headerUsernameElement = document.getElementById('dropdown-username');
    let username = getText('user.placeholder.name', 'User');
    if (headerUsernameElement && headerUsernameElement.textContent !== getText('userMenu.greeting', 'Hello, Guest!')) {
      const greetingText = headerUsernameElement.textContent;
      const nameMatch = greetingText.match(/,\s*(.+)!$/);
      if (nameMatch && nameMatch[1]) {
        username = nameMatch[1];
      }
    }
    if (profileNameElement) profileNameElement.textContent = username;
    if (profileEmailElement) profileEmailElement.textContent = getText('user.placeholder.email', 'your.email@example.com');
  }

  if (logoutButtonProfile) {
    logoutButtonProfile.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      document.dispatchEvent(new CustomEvent('userLoggedOutGlobal'));
      window.location.href = 'index.html';
    });
  }

  function initProfilePage() {
    displayUserProfile();
    loadAndPrepareUserRatedMovies(); // Загружаем и отображаем оцененные фильмы

    const editProfileBtn = document.querySelector('.profile-action-btn');
    if (editProfileBtn) editProfileBtn.textContent = getText('page.profile.editProfileBtn', 'Edit Profile');

    if (sortRatedSelect) {
      // Устанавливаем значение селекта из localStorage или по умолчанию
      const savedSort = localStorage.getItem('profileRatedSort') || 'date_desc';
      sortRatedSelect.value = savedSort;
      sortRatedSelect.addEventListener('change', () => {
        localStorage.setItem('profileRatedSort', sortRatedSelect.value); // Сохраняем выбор
        sortAndRenderRatedMovies();
      });
    }
  }

  document.addEventListener('translationsReady', initProfilePage);
  document.addEventListener('languageChanged', initProfilePage);
  document.addEventListener('userLoggedInGlobal', () => {
    displayUserProfile();
    loadAndPrepareUserRatedMovies();
  });
  document.addEventListener('userLoggedOutGlobal', displayUserProfile); // При логауте перенаправит

  if (window.i18n && window.i18n.getCurrentLanguage() && typeof allMoviesData !== 'undefined') {
    initProfilePage();
  }
});