// index.js

// Убедись, что i18n.js подключен в HTML ПЕРЕД index.js:
// <script src="js/i18n.js" defer></script>
// <script src="js/index.js" defer></script>
// В этом случае 'import' не нужен, если i18n.js не является ES-модулем, экспортирующим что-либо.

document.addEventListener('DOMContentLoaded', () => {
  // --- Hero Banner Slider Logic ---
  const slidesContainer = document.querySelector('.hero-slides-container');
  if (slidesContainer) {
      const slides = Array.from(slidesContainer.children).filter(child => child.classList.contains('hero-slide'));
      const nextButton = document.querySelector('.slider-control.next');
      const prevButton = document.querySelector('.slider-control.prev');
      const dotsContainer = document.querySelector('.slider-dots');
      let currentSlideIndex = 0;
      let slideInterval;

      function showSlide(index) {
          // Убедимся, что индекс находится в допустимых пределах
          if (index < 0 || index >= slides.length) {
              console.warn(`Attempted to show slide with invalid index: ${index}`);
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
          let newIndex = currentSlideIndex + 1;
          if (newIndex >= slides.length) {
              newIndex = 0;
          }
          showSlide(newIndex);
      }

      function prevSlide() {
          let newIndex = currentSlideIndex - 1;
          if (newIndex < 0) {
              newIndex = slides.length - 1;
          }
          showSlide(newIndex);
      }

      function startSlideShow() {
          stopSlideShow(); // Останавливаем предыдущий интервал
          slideInterval = setInterval(nextSlide, 7000); // Меняем слайд каждые 7 секунд
      }

      function stopSlideShow() {
          clearInterval(slideInterval);
      }

      if (slides.length > 0) {
          // Инициализация слайдера
          showSlide(currentSlideIndex); // Показываем первый слайд
          startSlideShow(); // Запускаем автопрокрутку

          // Кнопки навигации
          if (nextButton) {
              nextButton.addEventListener('click', () => {
                  nextSlide();
                  stopSlideShow(); // Останавливаем автопрокрутку при ручном взаимодействии
                  startSlideShow(); // и перезапускаем ее
              });
          }

          if (prevButton) {
              prevButton.addEventListener('click', () => {
                  prevSlide();
                  stopSlideShow();
                  startSlideShow();
              });
          }

          // Точки навигации
          if (dotsContainer) {
              // Генерируем точки, если их нет в HTML
              const existingDots = Array.from(dotsContainer.children).filter(child => child.classList.contains('dot'));
              if (existingDots.length === 0 && slides.length > 0) {
                  slides.forEach((_, index) => {
                      const dot = document.createElement('span');
                      dot.classList.add('dot');
                      dot.dataset.slideTo = index;
                      // showSlide() сам установит класс 'active'
                      dotsContainer.appendChild(dot);
                  });
              }

              // Добавляем обработчики событий на все точки (существующие или только что созданные)
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

          // Пауза/возобновление автопрокрутки при наведении
          const sliderElement = document.querySelector('.hero-banner-slider');
          if (sliderElement) {
              sliderElement.addEventListener('mouseenter', stopSlideShow);
              sliderElement.addEventListener('mouseleave', startSlideShow);
          }
      }
  }
  // --- End Hero Banner Slider Logic ---

  // Здесь может быть другая JS-логика, специфичная для главной страницы,
  // например, для динамического рендеринга карточек фильмов или обработки авторизации.
});