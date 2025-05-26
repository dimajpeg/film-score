// movie-details.js

document.addEventListener('DOMContentLoaded', () => {
    // Элементы на странице деталей фильма
    const pageTitleElement = document.querySelector('title');
    const backdropImageElement = document.getElementById('movie-backdrop-image');
    const posterImageElement = document.getElementById('movie-details-poster-img');
    const titleElement = document.getElementById('movie-details-title');
    const yearElement = document.getElementById('movie-details-year');
    const genresElement = document.getElementById('movie-details-genres');
    const ratingElement = document.getElementById('movie-details-rating');
    const descriptionElement = document.getElementById('movie-details-description');
    const directorElement = document.getElementById('movie-details-director');
    const actorsElement = document.getElementById('movie-details-actors');
    const trailerEmbedContainer = document.getElementById('movie-trailer-embed');
    const trailerStatusElement = document.getElementById('trailer-status');

    const userRatingWidget = document.querySelector('.user-rating-widget');
    const starsInteractiveContainer = document.querySelector('.stars-interactive');
    const currentRatingDisplay = document.getElementById('current-rating-display');
    const userRatingValueInput = document.getElementById('user-movie-rating-value');
    const submitRatingBtn = document.getElementById('submit-user-rating-btn');
    const ratingLoginPromptContainer = document.getElementById('rating-login-prompt'); // Контейнер div
    const ratingLoginPromptParagraph = ratingLoginPromptContainer ? ratingLoginPromptContainer.querySelector('p') : null; // Сам параграф

    const addCommentForm = document.getElementById('add-comment-form');
    const commentLoginPromptPageContainer = document.getElementById('comment-login-prompt-page'); // Контейнер div
    const commentLoginPromptParagraph = commentLoginPromptPageContainer ? commentLoginPromptPageContainer.querySelector('p') : null; // Сам параграф

    const relatedMoviesGrid = document.getElementById('related-movies-grid');
    const userRatingMessage = document.getElementById('user-rating-message');


    let currentMovieData = null;
    let selectedUserRating = 0;
    let potentialUserRating = 0;

    // ИСПРАВЛЕННАЯ Функция для получения текста, которая ПРАВИЛЬНО ПЕРЕДАЕТ PARAMS в i18n
    function getText(key, fallbackTextIfKeyNotFound = '', params = {}) {
        if (window.i18n && typeof window.i18n.getTranslation === 'function') {
            // Передаем params в window.i18n.getTranslation
            const translation = window.i18n.getTranslation(key, params); 
            
            // Если i18n.getTranslation вернул сам ключ (значит, перевод не найден в JSON),
            // тогда используем наш фоллбэк (если он есть), Иначе используем результат от i18n (даже если это ключ)
            if (translation === key) {
                let fallback = fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                // Применяем params и к фоллбэку, если они есть
                if (typeof fallback === 'string' && params && Object.keys(params).length > 0) {
                    for (const paramKey in params) {
                        fallback = fallback.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
                    }
                }
                return fallback;
            }
            return translation; // Перевод найден и параметры (если были) уже применены в i18n.js
        }
        // Фоллбэк, если i18n вообще недоступен
        let fallback = fallbackTextIfKeyNotFound || key.split('.').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (typeof fallback === 'string' && params && Object.keys(params).length > 0) {
             for (const paramKey in params) {
                fallback = fallback.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
            }
        }
        return fallback;
    }
    
    function showRatingMessage(messageText, type = 'error') {
        if (!userRatingMessage) return;
        userRatingMessage.textContent = messageText;
        userRatingMessage.className = 'form-message'; 
        userRatingMessage.classList.add(type);
        userRatingMessage.style.display = 'block';
    }

    function displayMovieDetails(movie) {
        if (!movie) {
            document.body.innerHTML = `<div class="container" style="padding-top: 50px; text-align: center;"><h1>${getText('error.movieNotFound', 'Movie not found')}</h1><a href="index.html">${getText('error.backToHome', 'Back to Home')}</a></div>`;
            return;
        }
        currentMovieData = movie;

        const movieTitleForPage = getText(movie.titleKey, movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        if (pageTitleElement) pageTitleElement.textContent = `${movieTitleForPage} - FilmScore`;
        else document.title = `${movieTitleForPage} - FilmScore`;

        if (backdropImageElement && movie.bannerUrl) {
            backdropImageElement.src = movie.bannerUrl;
            backdropImageElement.alt = `${movieTitleForPage} Backdrop`;
        } else if (backdropImageElement && movie.posterUrl) {
            backdropImageElement.src = movie.posterUrl;
            backdropImageElement.alt = `${movieTitleForPage} Backdrop`;
        } else if (backdropImageElement) {
            backdropImageElement.style.display = 'none';
        }

        if (posterImageElement && movie.posterUrl) {
            posterImageElement.src = movie.posterUrl;
            posterImageElement.alt = `${movieTitleForPage} Poster`;
        }

        if (titleElement) titleElement.textContent = movieTitleForPage;
        if (yearElement) yearElement.textContent = movie.year;
        if (ratingElement) ratingElement.textContent = movie.rating;

        if (genresElement && movie.genreKeys) {
            genresElement.innerHTML = movie.genreKeys.map(gKey => {
                const defaultGenreName = gKey.split('.').pop();
                const genreName = getText(gKey, defaultGenreName.charAt(0).toUpperCase() + defaultGenreName.slice(1));
                return `<a href="movies.html?genre=${gKey.split('.').pop().toLowerCase()}">${genreName}</a>`;
            }).join(', ');
        }

        if (descriptionElement) { // Проверка на существование descriptionKey
            descriptionElement.textContent = movie.descriptionKey 
                ? getText(movie.descriptionKey, getText('movie.placeholder.description')) 
                : getText('movie.placeholder.description');
        }


        if (directorElement) { // Проверка на существование directorKey
            directorElement.textContent = movie.directorKey 
                ? getText(movie.directorKey, getText('director.placeholder'))
                : getText('director.placeholder');
        }
        if (actorsElement) { // Проверка на существование actorsKeys
             if (movie.actorsKeys && movie.actorsKeys.length > 0) {
                actorsElement.innerHTML = movie.actorsKeys.map(aKey => {
                    const actorName = getText(aKey, getText('actor.placeholderSingle', 'Actor'));
                    return `<span>${actorName}</span>`;
                }).join(', ');
            } else {
                actorsElement.textContent = getText('actors.placeholder');
            }
        }


        if (trailerEmbedContainer) {
            if (movie.trailerUrl) {
                trailerEmbedContainer.innerHTML = `
                    <iframe src="${movie.trailerUrl}" 
                            title="YouTube video player for ${movieTitleForPage}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen></iframe>`;
                if (trailerStatusElement) trailerStatusElement.style.display = 'none';
            } else {
                trailerEmbedContainer.innerHTML = '';
                const p = trailerEmbedContainer.querySelector('p#trailer-status') || document.createElement('p');
                p.id = 'trailer-status';
                p.textContent = getText('page.movieDetails.trailerNotAvailable', 'Trailer not available.');
                if (!trailerEmbedContainer.querySelector('p#trailer-status')) {
                     trailerEmbedContainer.appendChild(p);
                }
                p.style.display = 'block';
            }
        }
        
        checkUserAuthForInteractiveElements();
        displayRelatedMovies(movie.genreKeys, movie.id);
    }

    // --- Логика звезд (остается без изменений, как в предыдущем ответе) ---
    function updateStarsDisplay(ratingToDisplay) { /* ... */ }
    function updateHoverStarsDisplay(hoverRating) { /* ... */ }
    if (starsInteractiveContainer) { /* ... обработчики для звезд ... */ }
    if (submitRatingBtn) { /* ... обработчик для кнопки submit ... */ }
    // Скопируй сюда полный код для звездной оценки из предыдущего моего ответа


    function checkUserAuthForInteractiveElements() {
        const token = localStorage.getItem('authToken');

        const loginLinkText = getText('page.movieDetails.loginLink', 'login');
        const registerLinkText = getText('page.movieDetails.registerLink', 'register');
        const loginLinkHTML = `<a href="sign-up.html?form=signin">${loginLinkText}</a>`;
        const registerLinkHTML = `<a href="sign-up.html?form=signup">${registerLinkText}</a>`;

        if (token) {
            if (userRatingWidget) userRatingWidget.style.display = 'block';
            if (ratingLoginPromptContainer) ratingLoginPromptContainer.style.display = 'none';
            if (addCommentForm) addCommentForm.style.display = 'block'; 
            if (commentLoginPromptPageContainer) commentLoginPromptPageContainer.style.display = 'none';
            // TODO: Загрузить сохраненную оценку
        } else {
            if (userRatingWidget) userRatingWidget.style.display = 'none';
            if (ratingLoginPromptContainer) ratingLoginPromptContainer.style.display = 'block';
            if (ratingLoginPromptParagraph) {
                ratingLoginPromptParagraph.innerHTML = getText(
                    'page.movieDetails.loginToRatePrompt',
                    'Please {loginLink} or {registerLink} to rate this movie.',
                    { loginLink: loginLinkHTML, registerLink: registerLinkHTML }
                );
            }

            if (addCommentForm) addCommentForm.style.display = 'none';
            if (commentLoginPromptPageContainer) commentLoginPromptPageContainer.style.display = 'block';
            if (commentLoginPromptParagraph) {
                commentLoginPromptParagraph.innerHTML = getText(
                    'page.movieDetails.loginToCommentPrompt', 
                    'Please {loginLink} or {registerLink} to leave a comment.',
                    { loginLink: loginLinkHTML, registerLink: registerLinkHTML }
                );
            }
        }
    }
    
    // Функция createMovieCardHTML (для Related Movies)
    function createMovieCardHTML(movie) { // Эта функция должна быть здесь
        if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
            return '';
        }
        const fallbackTitle = movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const title = getText(movie.titleKey, fallbackTitle);
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


    function displayRelatedMovies(currentMovieGenreKeys, currentMovieId) {
        if (!relatedMoviesGrid || typeof allMoviesData === 'undefined' || !currentMovieGenreKeys || !currentMovieId) {
            if(relatedMoviesGrid) relatedMoviesGrid.innerHTML = `<p>${getText('page.movieDetails.noRelatedMovies', 'No similar movies found.')}</p>`;
            return;
        }
        let similarMovies = allMoviesData.filter(movie => {
            if (movie.id === currentMovieId) return false;
            return movie.genreKeys.some(genreKey => currentMovieGenreKeys.includes(genreKey));
        });
        similarMovies.sort(() => 0.5 - Math.random());
        const relatedToDisplay = similarMovies.slice(0, 5);
        if (relatedToDisplay.length > 0) {
            relatedMoviesGrid.innerHTML = relatedToDisplay.map(movie => createMovieCardHTML(movie)).join('');
        } else {
            relatedMoviesGrid.innerHTML = `<p>${getText('page.movieDetails.noRelatedMovies', 'No similar movies found.')}</p>`;
        }
    }

    function initializeMovieDetailsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        if (!movieId) {
            document.body.innerHTML = `<div class="container" style="padding-top: 50px; text-align: center;"><h1>${getText('error.missingMovieId', 'Movie ID is missing.')}</h1><a href="index.html">${getText('error.backToHome', 'Back to Home')}</a></div>`;
            return;
        }
        if (typeof allMoviesData !== 'undefined') {
            const movie = allMoviesData.find(m => m.id === movieId);
            displayMovieDetails(movie); // Это вызовет и checkUserAuthForInteractiveElements
        } else {
            console.error('`allMoviesData` is not defined. Make sure movies-data.js is loaded.');
        }
    }

    // Инициализация после загрузки переводов
    function initPageAfterTranslations() {
        initializeMovieDetailsPage();
        // Убедимся, что и другие интерактивные элементы обновляются с переводами, если нужно
        // Например, текст кнопки "Submit Rating" и т.д., если он не через data-i18n
        if (submitRatingBtn) submitRatingBtn.textContent = getText('page.movieDetails.submitRatingBtn', 'Submit');
    }


    document.addEventListener('translationsReady', function(event) {
        console.log(`[movie-details.js] Event 'translationsReady' received for lang: ${event.detail.lang}.`);
        initPageAfterTranslations();
    });

    document.addEventListener('languageChanged', function(event) {
        console.log(`[movie-details.js] Event 'languageChanged' received for lang: ${event.detail.lang}.`);
        initPageAfterTranslations();
    });
    
    // Обработка событий логина/логаута
    document.addEventListener('userLoggedInGlobal', checkUserAuthForInteractiveElements);
    document.addEventListener('userLoggedOutGlobal', checkUserAuthForInteractiveElements);

    // Если i18n.js и movies-data.js уже загружены к моменту выполнения этого скрипта
    if (window.i18n && window.i18n.getCurrentLanguage() && typeof allMoviesData !== 'undefined') {
        // Проверяем, есть ли уже переводы для текущего языка в i18n (этот флаг нужно добавить в i18n.js)
        // if (window.i18n.areTranslationsLoadedFor && window.i18n.areTranslationsLoadedFor(window.i18n.getCurrentLanguage())) {
             console.log('[movie-details.js] i18n and movie data seem ready, attempting early initialization.');
             initPageAfterTranslations();
        // }
    }
});