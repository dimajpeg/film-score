// index.js

// Предполагаем, что i18n.js, header-auth.js и movies-data.js уже подключены в HTML перед этим файлом.
// Переменные allMoviesData, trendingNowMovieIds, holidayMoodMovieIds, recommendedMovieIds
// должны быть доступны глобально из movies-data.js.

document.addEventListener('DOMContentLoaded', () => {
    // --- Логика для слайдера (твой существующий код) ---
    const slidesContainer = document.querySelector('.hero-slides-container');
    if (slidesContainer) {
        const slides = Array.from(slidesContainer.children).filter(child => child.classList.contains('hero-slide'));
        const nextButton = document.querySelector('.slider-control.next');
        const prevButton = document.querySelector('.slider-control.prev');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentSlideIndex = 0;
        let slideInterval;

        function showSlide(index) {
            if (index < 0 || index >= slides.length || !slides[index]) {
                // console.warn(`Attempted to show slide with invalid index: ${index} or slides not fully loaded.`);
                return;
            }
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (dotsContainer && dotsContainer.children[i]) {
                    dotsContainer.children[i].classList.remove('active');
                }
            });
            slides[index].classList.add('active');
            if (dotsContainer && dotsContainer.children[index]) {
                dotsContainer.children[index].classList.add('active');
            }
            currentSlideIndex = index;
        }

        function nextSlide() {
            if (slides.length === 0) return;
            let newIndex = currentSlideIndex + 1;
            if (newIndex >= slides.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        }

        function prevSlide() {
            if (slides.length === 0) return;
            let newIndex = currentSlideIndex - 1;
            if (newIndex < 0) {
                newIndex = slides.length - 1;
            }
            showSlide(newIndex);
        }

        function startSlideShow() {
            stopSlideShow();
            if (slides.length > 1) {
                 slideInterval = setInterval(nextSlide, 7000);
            }
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        if (slides.length > 0) {
            if (dotsContainer) {
                const existingDots = Array.from(dotsContainer.children).filter(child => child.classList.contains('dot'));
                if (existingDots.length === 0) {
                    slides.forEach((_, index) => {
                        const dot = document.createElement('span');
                        dot.classList.add('dot');
                        dot.dataset.slideTo = index;
                        dotsContainer.appendChild(dot);
                    });
                }
                Array.from(dotsContainer.children).forEach(dot => {
                    if (dot.tagName === 'SPAN' && dot.classList.contains('dot')) {
                        dot.addEventListener('click', (e) => {
                            const slideIndex = parseInt(e.target.dataset.slideTo);
                            if (!isNaN(slideIndex)) {
                                showSlide(slideIndex);
                                stopSlideShow();
                                startSlideShow();
                            }
                        });
                    }
                });
            }
            
            showSlide(currentSlideIndex);
            startSlideShow();

            if (nextButton) { /* ... обработчик ... */ nextButton.addEventListener('click', () => { nextSlide(); stopSlideShow(); startSlideShow(); });}
            if (prevButton) { /* ... обработчик ... */ prevButton.addEventListener('click', () => { prevSlide(); stopSlideShow(); startSlideShow(); });}
            const sliderElement = document.querySelector('.hero-banner-slider');
            if (sliderElement) { /* ... обработчики ... */ sliderElement.addEventListener('mouseenter', stopSlideShow); sliderElement.addEventListener('mouseleave', startSlideShow); }
        }
    }
    // --- Конец логики для слайдера ---


    // --- НОВАЯ ЛОГИКА: Рендеринг карточек фильмов ---

    // ИСПРАВЛЕННАЯ Функция для получения текста
    function getText(key, fallbackTextIfKeyNotFound = '') {
        if (window.i18n && typeof window.i18n.getTranslation === 'function') {
            const translation = window.i18n.getTranslation(key);
            // i18n.getTranslation (из нашего i18n.js) вернет сам ключ, если перевод не найден.
            // Поэтому мы проверяем, отличается ли результат от ключа.
            if (translation !== key) {
                return translation; // Перевод найден
            }
            // Если перевод не найден (translation === key), используем fallbackTextIfKeyNotFound
            // Если fallbackTextIfKeyNotFound не предоставлен, то просто вернем "чистую" часть ключа
            return fallbackTextIfKeyNotFound || key.split('.').pop();
        }
        // Фоллбэк, если i18n вообще недоступен
        return fallbackTextIfKeyNotFound || key.split('.').pop();
    }

    // Функция для создания HTML одной карточки фильма
    function createMovieCardHTML(movie) {
        if (!movie || !movie.id || !movie.titleKey || !movie.posterUrl || !movie.year || !movie.genreKeys || !movie.rating) {
            console.warn('Skipping movie card rendering due to missing essential data:', movie && movie.id ? movie.id : 'Unknown movie');
            return '';
        }

        // Для title, если перевод не найден, используем ID фильма как fallback
        const title = getText(movie.titleKey, movie.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())); // movie.id с заглавными буквами
        const year = movie.year;
        const rating = movie.rating;
        const poster = movie.posterUrl;
        const movieUrl = `movie-details.html?id=${movie.id}`;

        const genresHTML = movie.genreKeys.map(genreKey => {
            // Для жанра, если перевод не найден, используем последнюю часть ключа с большой буквы
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-star"><use xlink:href="#icon-star-path"/></svg>
                  <span>${rating}</span>
                </div>
              </div>
            </article>
        `;
    }

    // Функция для рендеринга списка фильмов в указанный контейнер
    function renderMovies(movieIds, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Movie GFX Container with id "${containerId}" not found.`);
            return;
        }

        if (typeof allMoviesData === 'undefined' || !Array.isArray(allMoviesData)) {
            console.error('Error: `allMoviesData` is not defined or not an array. Make sure movies-data.js is loaded and correct.');
            container.innerHTML = `<p>${getText('messages.dataError', 'Error loading movie data.')}</p>`;
            return;
        }
        if (!Array.isArray(movieIds)) {
            console.error(`Error: \`movieIds\` for container "${containerId}" is not an array.`);
            container.innerHTML = `<p>${getText('messages.dataError', 'Error loading movie data.')}</p>`;
            return;
        }

        let moviesHTML = "";
        movieIds.forEach(id => {
            const movie = allMoviesData.find(m => m.id === id);
            if (movie) {
                moviesHTML += createMovieCardHTML(movie);
            } else {
                console.warn(`Movie with id "${id}" intended for "${containerId}" not found in allMoviesData.`);
            }
        });

        if (moviesHTML === "") {
            // Используем ключ messages.noMoviesFoundSect, который ты определил в JSON
            container.innerHTML = `<p>${getText('messages.noMoviesFoundSect', 'No movies here yet.')}</p>`;
        } else {
            container.innerHTML = moviesHTML;
        }
    }

    // Рендеринг секций фильмов
    const trendingGrid = document.getElementById('trending-now-grid');
    const holidayGrid = document.getElementById('holiday-mood-grid');
    const recommendedGrid = document.getElementById('recommended-movies-grid');

    if (typeof trendingNowMovieIds !== 'undefined' && trendingNowMovieIds.length > 0) {
        renderMovies(trendingNowMovieIds, 'trending-now-grid');
    } else {
        console.warn('`trendingNowMovieIds` is not defined or empty. Trending Now section will be empty.');
        if (trendingGrid) trendingGrid.innerHTML = `<p>${getText('messages.noMoviesFoundSect', 'No movies here yet.')}</p>`;
    }

    if (typeof holidayMoodMovieIds !== 'undefined' && holidayMoodMovieIds.length > 0) {
        renderMovies(holidayMoodMovieIds, 'holiday-mood-grid');
    } else {
        console.warn('`holidayMoodMovieIds` is not defined or empty. Holiday Mood section will be empty.');
        if (holidayGrid) holidayGrid.innerHTML = `<p>${getText('messages.noMoviesFoundSect', 'No movies here yet.')}</p>`;
    }

    if (typeof recommendedMovieIds !== 'undefined' && recommendedMovieIds.length > 0) {
        renderMovies(recommendedMovieIds, 'recommended-movies-grid');
    } else {
        console.warn('`recommendedMovieIds` is not defined or empty. Recommended section will be empty.');
        if (recommendedGrid) recommendedGrid.innerHTML = `<p>${getText('messages.noMoviesFoundSect', 'No movies here yet.')}</p>`;
    }
    // --- Конец НОВОЙ ЛОГИКИ ---

});