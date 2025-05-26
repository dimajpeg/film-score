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
    const trailerStatusElement = document.getElementById('trailer-status'); // Если ты его оставил в HTML

    // Элементы для пользовательской оценки
    const userRatingWidget = document.querySelector('.user-rating-widget');
    const starsInteractiveContainer = document.querySelector('.stars-interactive'); // Убедись, что этот класс есть в HTML звезд оценки
    const currentRatingDisplay = document.getElementById('current-rating-display');
    const userRatingValueInput = document.getElementById('user-movie-rating-value');
    const submitRatingBtn = document.getElementById('submit-user-rating-btn');
    const ratingLoginPrompt = document.getElementById('rating-login-prompt');
    const userRatingMessage = document.getElementById('user-rating-message');

    // Элементы для комментариев
    const addCommentForm = document.getElementById('add-comment-form');
    const commentLoginPromptPage = document.getElementById('comment-login-prompt'); // Переименовал, чтобы не путать с ratingLoginPrompt

    // Элементы для похожих фильмов
    const relatedMoviesGrid = document.getElementById('related-movies-grid');

    let currentMovieData = null; // Здесь будет храниться объект текущего фильма
    let selectedUserRating = 0;
    let potentialUserRating = 0;


    // Функция для получения текста (аналогична той, что в index.js/movies-page.js)
    function getText(key, fallbackTextIfKeyNotFound = '', params = {}) {
        if (window.i18n && typeof window.i18n.getTranslation === 'function') {
            const translation = window.i18n.getTranslation(key, params);
            if (translation !== key) return translation;
            const parts = key.split('.');
            return fallbackTextIfKeyNotFound || (parts.length > 1 ? parts.pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : key);
        }
        const parts = key.split('.');
        return fallbackTextIfKeyNotFound || (parts.length > 1 ? parts.pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : key);
    }

    // Функция для отображения данных фильма на странице
    function displayMovieDetails(movie) {
        if (!movie) {
            document.body.innerHTML = `<div class="container" style="padding-top: 50px; text-align: center;"><h1>${getText('error.movieNotFound', 'Movie not found')}</h1><a href="index.html">${getText('error.backToHome', 'Back to Home')}</a></div>`;
            return;
        }
        currentMovieData = movie; // Сохраняем данные текущего фильма

        // 1. Заголовок страницы
        const pageTitleText = getText(movie.titleKey, movie.id) + " - FilmScore";
        if (pageTitleElement) pageTitleElement.textContent = pageTitleText;
        else document.title = pageTitleText;


        // 2. Баннер и постер
        if (backdropImageElement && movie.bannerUrl) {
            backdropImageElement.src = movie.bannerUrl;
            backdropImageElement.alt = `${getText(movie.titleKey)} Backdrop`;
        } else if (backdropImageElement && movie.posterUrl) { // Фоллбэк на постер, если нет баннера
            backdropImageElement.src = movie.posterUrl;
            backdropImageElement.alt = `${getText(movie.titleKey)} Backdrop`;
        } else if (backdropImageElement) {
            backdropImageElement.style.display = 'none'; // Скрыть блок, если нет изображений
        }

        if (posterImageElement && movie.posterUrl) {
            posterImageElement.src = movie.posterUrl;
            posterImageElement.alt = `${getText(movie.titleKey)} Poster`;
        }

        // 3. Основная информация
        if (titleElement) titleElement.textContent = getText(movie.titleKey);
        if (yearElement) yearElement.textContent = movie.year;
        if (ratingElement) ratingElement.textContent = movie.rating;

        if (genresElement && movie.genreKeys) {
            genresElement.innerHTML = movie.genreKeys.map(gKey => {
                const genreName = getText(gKey, gKey.split('.').pop());
                // Можно сделать ссылки на movies.html?genre=...
                return `<a href="movies.html?genre=${gKey.split('.').pop().toLowerCase()}">${genreName}</a>`;
            }).join(', ');
        }

        if (descriptionElement && movie.descriptionKey) {
            descriptionElement.textContent = getText(movie.descriptionKey, "No description available.");
        }

        // 4. Режиссер и актеры
        if (directorElement && movie.directorKey) {
            directorElement.textContent = getText(movie.directorKey, "N/A");
        }
        if (actorsElement && movie.actorsKeys) {
            actorsElement.innerHTML = movie.actorsKeys.map(aKey => {
                const actorName = getText(aKey, "N/A");
                // Можно сделать ссылки на страницу актера в будущем
                return `<span>${actorName}</span>`;
            }).join(', ');
        }

        // 5. Трейлер
        if (trailerEmbedContainer) {
            if (movie.trailerUrl) {
                trailerEmbedContainer.innerHTML = `
                    <iframe 
                        src="${movie.trailerUrl}" 
                        title="YouTube video player for ${getText(movie.titleKey)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>`;
                if (trailerStatusElement) trailerStatusElement.style.display = 'none';
            } else {
                trailerEmbedContainer.innerHTML = ''; // Очищаем, если был iframe
                if (trailerStatusElement) {
                    trailerStatusElement.textContent = getText('page.movieDetails.trailerNotAvailable', 'Trailer not available.');
                    trailerStatusElement.style.display = 'block';
                } else { // Если элемента нет, создадим
                     const p = document.createElement('p');
                     p.textContent = getText('page.movieDetails.trailerNotAvailable', 'Trailer not available.');
                     trailerEmbedContainer.appendChild(p);
                }
            }
        }
        
        // 6. Инициализация виджета оценки и комментариев
        checkUserAuthForInteractiveElements();
        // 7. Загрузка и отображение похожих фильмов
        displayRelatedMovies(movie.genreKeys, movie.id);
    }

    // --- Логика для виджета пользовательской оценки (как мы обсуждали ранее) ---
    function updateStarsDisplay(ratingToDisplay) {
        if (!starsInteractiveContainer) return;
        const stars = starsInteractiveContainer.querySelectorAll('.star-icon.interactive');
        stars.forEach((star) => {
            const starValue = parseFloat(star.dataset.ratingValue);
            star.classList.remove('selected', 'half-selected-temp', 'hover'); // Сброс

            if (ratingToDisplay >= starValue) { // Полностью закрашенная звезда
                star.classList.add('selected');
            } else if (ratingToDisplay >= starValue - 0.5) { // Половина звезды
                // Для CSS-only половинчатой звезды, нужен более сложный CSS.
                // Пока что, если это выбранная оценка, показываем как целую меньшую,
                // а текст отобразит точное значение.
                // Для hover эффекта можно добавить класс для временной подсветки половинки.
                star.classList.add('half-selected-temp'); // Для hover эффекта половинки
            }
        });
    }

    function updateHoverStarsDisplay(hoverRating) {
        if (!starsInteractiveContainer) return;
        const stars = starsInteractiveContainer.querySelectorAll('.star-icon.interactive');
        stars.forEach(star => {
            const starValue = parseFloat(star.dataset.ratingValue);
            star.classList.remove('hover', 'half-selected-temp');
            if (hoverRating >= starValue - 0.5) {
                 if (hoverRating < starValue && hoverRating >= starValue - 0.5) { // Левая половина
                    star.classList.add('half-selected-temp'); // Временный класс для CSS
                 } else if (hoverRating >= starValue) { // Целая или правая половина
                    star.classList.add('hover');
                 }
            }
        });
    }
    
    if (starsInteractiveContainer) {
        const stars = Array.from(starsInteractiveContainer.querySelectorAll('.star-icon.interactive'));
        stars.forEach(star => {
            star.addEventListener('mousemove', function(event) {
                if (!localStorage.getItem('authToken')) return; // Не даем взаимодействовать, если не залогинен
                const rect = star.getBoundingClientRect();
                const hoverPosition = event.clientX - rect.left;
                const starValue = parseFloat(star.dataset.ratingValue);
                potentialUserRating = (hoverPosition < rect.width / 2) ? starValue - 0.5 : starValue;
                updateHoverStarsDisplay(potentialUserRating);
                if (currentRatingDisplay) currentRatingDisplay.textContent = `${potentialUserRating.toFixed(1)} / 5.0`;
            });
            star.addEventListener('mouseleave', function() {
                if (!localStorage.getItem('authToken')) return;
                updateStarsDisplay(selectedUserRating); // Показываем выбранные
                updateHoverStarsDisplay(selectedUserRating); // Убираем подсветку hover, оставляем selected
                if (currentRatingDisplay) currentRatingDisplay.textContent = selectedUserRating > 0 ? `${selectedUserRating.toFixed(1)} / 5.0` : getText('page.movieDetails.rateThisMovie', "Rate this movie");
            });
            star.addEventListener('click', function() {
                if (!localStorage.getItem('authToken')) return;
                selectedUserRating = potentialUserRating;
                if(userRatingValueInput) userRatingValueInput.value = selectedUserRating;
                updateStarsDisplay(selectedUserRating);
                updateHoverStarsDisplay(selectedUserRating); // Чтобы убрать hover, оставить selected
                if (currentRatingDisplay) currentRatingDisplay.textContent = `${selectedUserRating.toFixed(1)} / 5.0`;
                if (submitRatingBtn) submitRatingBtn.style.display = 'inline-block';
                if (userRatingMessage) userRatingMessage.style.display = 'none';
            });
        });
    }

    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', function() {
            const ratingValue = userRatingValueInput ? userRatingValueInput.value : "0";
            const movieId = currentMovieData ? currentMovieData.id : null;

            if (movieId && ratingValue && parseFloat(ratingValue) > 0) {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    if(userRatingMessage) showRatingMessage(getText('error.notLoggedInToRate', 'You must be logged in to rate.'), 'error');
                    return;
                }
                console.log(`Submitting rating: ${ratingValue} for movie ID: ${movieId} with token: ${token}`);
                // TODO: Реализовать fetch запрос на бэкенд для сохранения оценки
                // fetch(`/api/movies/${movieId}/rate`, { method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({ rating: parseFloat(ratingValue) }) })
                // .then(res => res.json()).then(data => { if(userRatingMessage) showRatingMessage(getText('message.ratingSaved', 'Rating saved!'), 'success'); })
                // .catch(err => { console.error(err); if(userRatingMessage) showRatingMessage(getText('error.ratingSaveFailed', 'Failed to save rating.'), 'error'); });
                if(userRatingMessage) showRatingMessage(getText('message.ratingSubmitted', 'Rating submitted (simulated)!'), 'success');
            } else {
                if(userRatingMessage) showRatingMessage(getText('message.selectRatingFirst', 'Please select a rating first.'), 'error');
            }
        });
    }

    // Показ/скрытие элементов в зависимости от авторизации
    function checkUserAuthForInteractiveElements() {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Пользователь залогинен
            if (userRatingWidget) userRatingWidget.style.display = 'block';
            if (ratingLoginPrompt) ratingLoginPrompt.style.display = 'none';
            if (addCommentForm) addCommentForm.style.display = 'block'; // или 'flex' если форма так стилизована
            if (commentLoginPromptPage) commentLoginPromptPage.style.display = 'none';

            // TODO: Загрузить и отобразить сохраненную оценку пользователя
            // Например: const userStoredRating = fetchUserRatingForMovie(currentMovieData.id, token);
            // selectedUserRating = userStoredRating || 0;
            // updateStarsDisplay(selectedUserRating);
            // if (currentRatingDisplay && selectedUserRating > 0) currentRatingDisplay.textContent = `${selectedUserRating.toFixed(1)} / 5.0`;
            // else if (currentRatingDisplay) currentRatingDisplay.textContent = getText('page.movieDetails.rateThisMovie', "Rate this movie");

        } else {
            // Пользователь не залогинен
            if (userRatingWidget) userRatingWidget.style.display = 'none';
            if (ratingLoginPrompt) ratingLoginPrompt.style.display = 'block';
            if (addCommentForm) addCommentForm.style.display = 'none';
            if (commentLoginPromptPage) commentLoginPromptPage.style.display = 'block'; // или 'flex'
        }
    }

    // Функция для отображения похожих фильмов
    function displayRelatedMovies(currentMovieGenreKeys, currentMovieId) {
        if (!relatedMoviesGrid || typeof allMoviesData === 'undefined' || !currentMovieGenreKeys) return;

        const related = allMoviesData.filter(movie => {
            if (movie.id === currentMovieId) return false; // Не показывать текущий фильм
            // Найти фильмы, у которых есть хотя бы один общий жанр
            return movie.genreKeys.some(genreKey => currentMovieGenreKeys.includes(genreKey));
        }).slice(0, 5); // Показать первые 5 похожих

        if (related.length > 0) {
            relatedMoviesGrid.innerHTML = related.map(movie => createMovieCardHTML(movie)).join('');
        } else {
            relatedMoviesGrid.innerHTML = `<p>${getText('page.movieDetails.noRelatedMovies', 'No similar movies found.')}</p>`;
        }
    }

    // --- Инициализация страницы ---
    function initializeMovieDetailsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        if (!movieId) {
            console.error('Movie ID not found in URL for details page.');
            document.body.innerHTML = `<div class="container" style="padding-top: 50px; text-align: center;"><h1>${getText('error.missingMovieId', 'Movie ID is missing.')}</h1><a href="index.html">${getText('error.backToHome', 'Back to Home')}</a></div>`;
            return;
        }

        if (typeof allMoviesData !== 'undefined') {
            const movie = allMoviesData.find(m => m.id === movieId);
            displayMovieDetails(movie);
        } else {
            console.error('`allMoviesData` is not defined. Make sure movies-data.js is loaded.');
            // Можно показать сообщение об ошибке загрузки данных
        }
    }

    // Ждем события готовности переводов, затем инициализируем страницу
    document.addEventListener('translationsReady', function(event) {
        console.log(`[movie-details.js] Event 'translationsReady' received for lang: ${event.detail.lang}. Initializing details page.`);
        initializeMovieDetailsPage();
    });

    // Также обновляем при смене языка
    document.addEventListener('languageChanged', function(event) {
        console.log(`[movie-details.js] Event 'languageChanged' received for lang: ${event.detail.lang}. Re-initializing details page.`);
        initializeMovieDetailsPage(); // Переинициализация заполнит все текстовые поля новыми переводами
    });
    
    // Если i18n.js загружается очень быстро, и 'translationsReady' могло уже произойти
    // Можно добавить проверку, загружен ли уже язык, и вызвать инициализацию,
    // но лучше полагаться на событие.
    // Если window.i18n уже есть и текущий язык загружен (можно добавить флаг в i18n.js)
    // if (window.i18n && window.i18n.areTranslationsReadyFor && window.i18n.areTranslationsReadyFor(window.i18n.getCurrentLanguage())) {
    //    initializeMovieDetailsPage();
    // }

});