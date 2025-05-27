// movie-details.js (Объединенный и доработанный)

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

    // Элементы для пользовательской оценки
    const userRatingWidget = document.querySelector('.user-rating-widget');
    const starsInteractiveContainer = document.querySelector('.stars-interactive');
    const currentRatingDisplay = document.getElementById('current-rating-display');
    const userRatingValueInput = document.getElementById('user-movie-rating-value');
    const submitRatingBtn = document.getElementById('submit-user-rating-btn');
    const ratingLoginPromptContainer = document.getElementById('rating-login-prompt');
    const ratingLoginPromptParagraph = ratingLoginPromptContainer ? ratingLoginPromptContainer.querySelector('p') : null;
    const userRatingMessage = document.getElementById('user-rating-message');

    // Элементы для комментариев
    const addCommentForm = document.getElementById('add-comment-form');
    const commentLoginPromptPageContainer = document.getElementById('comment-login-prompt-page'); // Ты назвал его так в HTML
    const commentLoginPromptParagraph = commentLoginPromptPageContainer ? commentLoginPromptPageContainer.querySelector('p') : null;
    const existingCommentsList = document.getElementById('existing-comments-list');
    const commentTextInput = document.getElementById('comment-text-input');
    const commentFormMessage = document.getElementById('comment-form-message');

    // Элементы для похожих фильмов
    const relatedMoviesGrid = document.getElementById('related-movies-grid');

    let currentMovieData = null;
    let selectedUserRating = 0;
    let potentialUserRating = 0;

    // Функция для получения текста (с параметрами)
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

    // Функция для отображения сообщений под виджетом оценки
    function showRatingMessage(messageText, type = 'error') {
        if (!userRatingMessage) return;
        userRatingMessage.textContent = messageText;
        userRatingMessage.className = 'form-message';
        userRatingMessage.classList.add(type);
        userRatingMessage.style.display = 'block';
    }
    function clearRatingMessage() {
        if (userRatingMessage) userRatingMessage.style.display = 'none';
    }

    // Функция для отображения данных фильма
    function displayMovieDetails(movie) {
        if (!movie) {
            document.body.innerHTML = `<div class="container" style="padding-top: 50px; text-align: center;"><h1>${getText('error.movieNotFound', 'Movie not found')}</h1><a href="index.html">${getText('error.backToHome', 'Back to Home')}</a></div>`;
            return;
        }
        currentMovieData = movie;

        const movieTitleForPage = getText(movie.titleKey, movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        if (pageTitleElement) pageTitleElement.textContent = `${movieTitleForPage} - FilmScore`;
        else document.title = `${movieTitleForPage} - FilmScore`;

        if (backdropImageElement) {
            if (movie.bannerUrl) {
                backdropImageElement.src = movie.bannerUrl;
                backdropImageElement.alt = `${movieTitleForPage} Backdrop`;
                backdropImageElement.style.display = 'block';
            } else if (movie.posterUrl) {
                backdropImageElement.src = movie.posterUrl;
                backdropImageElement.alt = `${movieTitleForPage} Backdrop`;
                backdropImageElement.style.display = 'block';
            } else {
                backdropImageElement.style.display = 'none';
            }
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

        if (descriptionElement) {
            descriptionElement.textContent = movie.descriptionKey
                ? getText(movie.descriptionKey, getText('movie.placeholder.description'))
                : getText('movie.placeholder.description');
        }

        if (directorElement) {
            directorElement.textContent = movie.directorKey
                ? getText(movie.directorKey, getText('director.placeholder'))
                : getText('director.placeholder');
        }
        if (actorsElement) {
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
                p.setAttribute('data-i18n', 'page.movieDetails.trailerNotAvailable');
                p.textContent = getText('page.movieDetails.trailerNotAvailable', 'Trailer not available.');
                if (!trailerEmbedContainer.contains(p)) {
                    trailerEmbedContainer.appendChild(p);
                }
                p.style.display = 'block';
            }
        }

        checkUserAuthForInteractiveElements();
        displayRelatedMovies(movie.genreKeys, movie.id);
    }

    // --- Логика для виджета пользовательской оценки ---
    function applyStarRatingUI(rating, isHoverEvent = false) {
        if (!starsInteractiveContainer) return;
        const stars = starsInteractiveContainer.querySelectorAll('.star-icon.interactive');

        stars.forEach((star, index) => {
            const starFullValue = index + 1; // 1, 2, 3, 4, 5
            star.classList.remove('selected', 'half-selected', 'hover', 'half-hover');

            if (isHoverEvent) {
                if (rating >= starFullValue) {
                    star.classList.add('hover'); // Полная звезда для ховера
                } else if (rating >= starFullValue - 0.5) {
                    star.classList.add('half-hover'); // Половина для ховера
                }
            } else { // Для выбранной оценки
                if (rating >= starFullValue) {
                    star.classList.add('selected'); // Полная выбранная
                } else if (rating === (starFullValue - 0.5)) {
                    star.classList.add('half-selected'); // Половина выбранная
                }
            }
        });
    }

    if (starsInteractiveContainer) {
        const stars = Array.from(starsInteractiveContainer.querySelectorAll('.star-icon.interactive'));
        stars.forEach((star, index) => {
            const starRatingBase = index + 1;

            star.addEventListener('mousemove', function (event) {
                if (!localStorage.getItem('authToken')) return;
                const rect = star.getBoundingClientRect();
                const hoverPositionRatio = (event.clientX - rect.left) / rect.width;
                potentialUserRating = hoverPositionRatio <= 0.5 ? starRatingBase - 0.5 : starRatingBase;
                if (potentialUserRating < 0.5) potentialUserRating = 0.5;
                applyStarRatingUI(potentialUserRating, true);
                if (currentRatingDisplay) currentRatingDisplay.textContent = `${potentialUserRating.toFixed(1)} / 5.0`;
            });

            star.addEventListener('click', function () {
                if (!localStorage.getItem('authToken')) return;
                selectedUserRating = potentialUserRating;
                if (userRatingValueInput) userRatingValueInput.value = selectedUserRating;
                applyStarRatingUI(selectedUserRating, false); // Отображаем выбранные (не ховер)
                if (currentRatingDisplay) currentRatingDisplay.textContent = `${selectedUserRating.toFixed(1)} / 5.0`;
                if (submitRatingBtn) submitRatingBtn.style.display = 'inline-block';
                if (userRatingMessage) userRatingMessage.style.display = 'none';
            });
        });

        starsInteractiveContainer.addEventListener('mouseleave', function () {
            if (!localStorage.getItem('authToken')) return;
            applyStarRatingUI(selectedUserRating, false); // Показываем выбранные, не ховер
            if (currentRatingDisplay) {
                currentRatingDisplay.textContent = selectedUserRating > 0
                    ? `${selectedUserRating.toFixed(1)} / 5.0`
                    : getText('page.movieDetails.rateThisMovie', "Rate this movie");
            }
        });
    }

    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', function () {
            const ratingValue = userRatingValueInput ? userRatingValueInput.value : "0";
            const movieId = currentMovieData ? currentMovieData.id : null;

            if (movieId && ratingValue && parseFloat(ratingValue) >= 0.5) {
                const token = localStorage.getItem('authToken');
                if (!token) { /* ... обработка ошибки ... */ return; }

                console.log(`SIMULATING RATING SUBMISSION: Movie ID: ${movieId}, User Rating: ${ratingValue}, Token: ${token}`);

                // --- НОВОЕ: Сохраняем оценку в localStorage ---
                let userRatings = JSON.parse(localStorage.getItem('userMovieRatings')) || {};
                userRatings[movieId] = { // Теперь сохраняем объект
                    rating: parseFloat(ratingValue),
                    timestamp: new Date().toISOString() // Добавляем временную метку
                };
                localStorage.setItem('userMovieRatings', JSON.stringify(userRatings));
                // --- КОНЕЦ НОВОГО ---

                if (userRatingMessage) showRatingMessage(getText('message.ratingSubmitted', `Your rating of ${ratingValue} has been submitted!`, { ratingValue: ratingValue }), 'success');
                // submitRatingBtn.disabled = true; 
                // submitRatingBtn.style.display = 'none'; // Можно скрыть кнопку после оценки
            } else { /* ... обработка ошибки ... */ }
        });
    }

    // Показ/скрытие элементов в зависимости от авторизации
    function checkUserAuthForInteractiveElements() {
        const token = localStorage.getItem('authToken'); // Или используй твою тестовую переменную, если нужно
        const initialRatingText = getText('page.movieDetails.rateThisMovie', "Rate this movie");

        // Получаем элементы параграфов для сообщений о логине
        // Убедись, что ratingLoginPromptContainer и commentLoginPromptPageContainer - это div'ы, а мы получаем <p> внутри них
        const ratingLoginPromptActualParagraph = ratingLoginPromptContainer ? ratingLoginPromptContainer.querySelector('p') : null;
        const commentLoginPromptActualParagraph = commentLoginPromptPageContainer ? commentLoginPromptPageContainer.querySelector('p') : null;

        // Формируем HTML для переведенных ссылок
        const loginLinkText = getText('page.movieDetails.loginLink', 'login');
        const registerLinkText = getText('page.movieDetails.registerLink', 'register');
        const loginLinkHTML = `<a href="sign-up.html?form=signin">${loginLinkText}</a>`;
        const registerLinkHTML = `<a href="sign-up.html?form=signup">${registerLinkText}</a>`;

        if (token && currentMovieData) { // Добавил проверку currentMovieData, т.к. от него может зависеть загрузка оценки
            // Пользователь "залогинен"
            if (userRatingWidget) userRatingWidget.style.display = 'block';
            if (ratingLoginPromptContainer) ratingLoginPromptContainer.style.display = 'none';

            if (currentRatingDisplay) currentRatingDisplay.textContent = initialRatingText; // По умолчанию
            // TODO: Загрузить и отобразить сохраненную оценку пользователя для ЭТОГО фильма
            const userRatingsString = localStorage.getItem('userMovieRatings');
            const userRatings = userRatingsString ? JSON.parse(userRatingsString) : {};
            const storedRatingData = userRatings[currentMovieData.id];

            if (storedRatingData && storedRatingData.rating) {
                selectedUserRating = parseFloat(storedRatingData.rating);
                if (userRatingValueInput) userRatingValueInput.value = selectedUserRating;
                applyStarRatingUI(selectedUserRating, false); // Отображаем сохраненную оценку
                if (currentRatingDisplay) currentRatingDisplay.textContent = `${selectedUserRating.toFixed(1)} / 5.0`;
                if (submitRatingBtn) submitRatingBtn.style.display = 'inline-block';
            } else {
                selectedUserRating = 0; // Сбрасываем, если нет сохраненной
                if (userRatingValueInput) userRatingValueInput.value = '';
                applyStarRatingUI(0, false); // Показываем пустые звезды
                if (currentRatingDisplay) currentRatingDisplay.textContent = initialRatingText;
                if (submitRatingBtn) submitRatingBtn.style.display = 'none'; // Скрываем, если оценки нет
            }

            if (addCommentForm) addCommentForm.style.display = 'block';
            if (commentLoginPromptPageContainer) commentLoginPromptPageContainer.style.display = 'none';

        } else {
            // Пользователь "не залогинен"
            if (userRatingWidget) userRatingWidget.style.display = 'none';
            if (ratingLoginPromptContainer) ratingLoginPromptContainer.style.display = 'block';
            if (ratingLoginPromptActualParagraph) { // Используем селектор для <p>
                ratingLoginPromptActualParagraph.innerHTML = getText(
                    'page.movieDetails.loginToRatePrompt', // Ключ строки-шаблона
                    'Please {loginLink} or {registerLink} to rate this movie.', // Фоллбэк-шаблон
                    { loginLink: loginLinkHTML, registerLink: registerLinkHTML } // Параметры
                );
            }

            if (addCommentForm) addCommentForm.style.display = 'none';
            if (commentLoginPromptPageContainer) commentLoginPromptPageContainer.style.display = 'block';
            if (commentLoginPromptActualParagraph) { // Используем селектор для <p>
                commentLoginPromptActualParagraph.innerHTML = getText(
                    'page.movieDetails.loginToCommentPrompt',
                    'Please {loginLink} or {registerLink} to leave a comment.',
                    { loginLink: loginLinkHTML, registerLink: registerLinkHTML }
                );
            }
        }
    }

    // Функция createMovieCardHTML (для Related Movies)
    function createMovieCardHTML(movie) {
        if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
            console.warn('Skipping related movie card due to missing data:', movie && movie.id ? movie.id : 'Unknown');
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
            if (relatedMoviesGrid) relatedMoviesGrid.innerHTML = `<p>${getText('page.movieDetails.noRelatedMovies', 'No similar movies found.')}</p>`;
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

    function createMovieCardHTML(movie) {
        if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
            console.warn('Skipping related movie card in movie-details.js due to missing data:', movie && movie.id ? movie.id : 'Unknown');
            return '';
        }
        const fallbackTitle = movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const title = getText(movie.titleKey, fallbackTitle); // getText уже определена выше
        const year = movie.year;
        const rating = movie.rating;
        const poster = movie.posterUrl;
        const movieUrl = `movie-details.html?id=${movie.id}`; // Ссылка на саму себя, но с другим ID
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
        if (!relatedMoviesGrid || typeof allMoviesData === 'undefined' || !Array.isArray(currentMovieGenreKeys) || !currentMovieId) {
            if (relatedMoviesGrid) relatedMoviesGrid.innerHTML = `<p>${getText('page.movieDetails.noRelatedMovies', 'No similar movies found.')}</p>`;
            console.warn("Could not display related movies. Missing data or elements.",
                { relatedMoviesGrid, allMoviesDataDefined: typeof allMoviesData !== 'undefined', currentMovieGenreKeys, currentMovieId });
            return;
        }

        let similarMovies = allMoviesData.filter(movie => {
            if (movie.id === currentMovieId) return false; // Не показывать текущий фильм
            if (!movie.genreKeys || !Array.isArray(movie.genreKeys)) return false; // Пропускаем фильмы без жанров
            return movie.genreKeys.some(genreKey => currentMovieGenreKeys.includes(genreKey));
        });

        // Перемешиваем и берем первые 5
        similarMovies.sort(() => 0.5 - Math.random());
        const relatedToDisplay = similarMovies.slice(0, 5);

        if (relatedToDisplay.length > 0) {
            relatedMoviesGrid.innerHTML = relatedToDisplay.map(movie => createMovieCardHTML(movie)).join('');
        } else {
            relatedMoviesGrid.innerHTML = `<p>${getText('page.movieDetails.noRelatedMovies', 'No similar movies found.')}</p>`;
        }
    }
    // --- Инициализация страницы ---
    function initializeMovieDetailsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        if (!movieId) {
            document.body.innerHTML = `<div class="container" style="padding-top: 50px; text-align: center;"><h1>${getText('error.missingMovieId', 'Movie ID is missing.')}</h1><a href="index.html">${getText('error.backToHome', 'Back to Home')}</a></div>`;
            return;
        }
        if (typeof allMoviesData !== 'undefined') {
            const movie = allMoviesData.find(m => m.id === movieId);
            displayMovieDetails(movie);
        } else {
            console.error('`allMoviesData` is not defined. Make sure movies-data.js is loaded before movie-details.js.');
        }
    }

    // Инициализация после загрузки переводов
    function initPageAfterTranslations() {
        initializeMovieDetailsPage();
        if (submitRatingBtn) { // Устанавливаем текст кнопки оценки
            submitRatingBtn.textContent = getText('page.movieDetails.submitRatingBtn', 'Submit');
        }
        const commentTextArea = document.getElementById('comment-text-input');
        if (commentTextArea) { // Устанавливаем плейсхолдер для комментариев
            commentTextArea.placeholder = getText('page.movieDetails.commentPlaceholder', 'Write your comment here...');
        }
        const submitCommentBtn = document.querySelector('#add-comment-form button[type="submit"]');
        if (submitCommentBtn) { // Устанавливаем текст кнопки отправки комментария
            submitCommentBtn.textContent = getText('page.movieDetails.submitCommentButton', 'Submit Comment');
        }
    }

    // Слушатели событий
    document.addEventListener('translationsReady', function (event) {
        console.log(`[movie-details.js] Event 'translationsReady' received for lang: ${event.detail.lang}.`);
        initPageAfterTranslations();
    });
    document.addEventListener('languageChanged', function (event) {
        console.log(`[movie-details.js] Event 'languageChanged' received for lang: ${event.detail.lang}.`);
        initPageAfterTranslations();
    });
    document.addEventListener('userLoggedInGlobal', checkUserAuthForInteractiveElements);
    document.addEventListener('userLoggedOutGlobal', checkUserAuthForInteractiveElements);

    // Попытка ранней инициализации, если все уже готово
    if (window.i18n && window.i18n.getCurrentLanguage() && typeof allMoviesData !== 'undefined' && document.readyState === 'complete') {
        // Этот блок может быть полезен, если 'translationsReady' уже сработало до добавления этого слушателя
        // Но в целом, лучше полагаться на 'translationsReady'. Можно его убрать, если все и так работает.
        console.log('[movie-details.js] DOM, i18n and movie data seem ready on initial load, attempting early initialization.');
        // initPageAfterTranslations(); // Вызываем только если translationsReady еще не вызвало
    } else if (window.i18n && window.i18n.getCurrentLanguage() && typeof allMoviesData !== 'undefined' && !document.querySelector('title').dataset.i18n) {
        // Если title не имеет data-i18n, значит applyTranslations уже мог пройти
        // Это очень грубая проверка, лучше на нее не полагаться
    }


    // --- Логика для комментариев (добавление) ---
    function showCommentFormMessage(messageText, type = 'error') {
        if (!commentFormMessage) return;
        commentFormMessage.textContent = messageText;
        commentFormMessage.className = 'form-message';
        commentFormMessage.classList.add(type);
        commentFormMessage.style.display = 'block';
    }

    function createCommentHTMLForDisplay(comment) { // Переименовал, чтобы не конфликтовать с createMovieCardHTML
        const authorName = comment.author || getText('comment.anonymous', 'Anonymous');
        // Форматирование даты (простой вариант)
        const dateString = comment.date ? new Date(comment.date).toLocaleDateString(window.i18n.getCurrentLanguage() || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();

        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('comment-author');
        authorDiv.textContent = authorName;
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('comment-date');
        dateDiv.textContent = dateString;
        const textP = document.createElement('p');
        textP.classList.add('comment-text');
        textP.textContent = comment.text; // Текст комментария не должен переводиться
        commentItem.appendChild(authorDiv);
        commentItem.appendChild(dateDiv);
        commentItem.appendChild(textP);
        return commentItem;
    }

    if (addCommentForm) {
        addCommentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!commentTextInput) return;
            const commentText = commentTextInput.value.trim();
            const movieId = currentMovieData ? currentMovieData.id : null;

            if (!movieId) {
                showCommentFormMessage(getText('error.generic', 'An error occurred.'), 'error');
                return;
            }
            if (commentText) {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    showCommentFormMessage(getText('error.notLoggedInToComment', 'You must be logged in to comment.'), 'error');
                    return;
                }
                console.log(`SIMULATING COMMENT SUBMISSION: Movie ID: ${movieId}, Comment: ${commentText}, Token: ${token}`);
                const newCommentData = {
                    // В реальном приложении имя пользователя (или ID) будет браться из данных /auth/me или из токена
                    author: getText('comment.currentUser', 'You'),
                    date: new Date().toISOString(), // Сохраняем дату в ISO формате для будущей сортировки/отображения
                    text: commentText
                };
                const newCommentElement = createCommentHTMLForDisplay(newCommentData);
                if (existingCommentsList) {
                    // Удаляем примеры комментариев, если они еще там
                    const sampleComments = existingCommentsList.querySelectorAll('.comment-item[data-i18n]');
                    sampleComments.forEach(sc => sc.remove());
                    existingCommentsList.prepend(newCommentElement);
                }
                commentTextInput.value = '';
                if (commentFormMessage) commentFormMessage.style.display = 'none';
                showCommentFormMessage(getText('message.commentSubmitted', 'Comment submitted (simulated)!'), 'success');
            } else {
                showCommentFormMessage(getText('message.commentNotEmpty', 'Comment cannot be empty.'), 'error');
            }
        });
    }
});