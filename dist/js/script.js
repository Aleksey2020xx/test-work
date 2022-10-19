document.addEventListener('DOMContentLoaded', () => {
  let modalSwiper = document.querySelector('.swiper')

  let swiper = new Swiper (modalSwiper, {

    loop: true,
    speed: 600,
    centeredSlides: true,
    centeredSlidesBounds: true,
    slidesPerView: "auto",
    

    breakpoints: {
      561: {
        slidesPerView: "auto",
        
      },
    },
  })

  const burgerBtn = document.querySelector('.header__burger')
  const burgerList = document.querySelector('.header__list')

  burgerBtn.addEventListener('click', (e) => {
    e.preventDefault()

    burgerList.classList.toggle('active')
  })

  const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
  animationTime = 1000,
  framesCount = 30;

  anchors.forEach(function(item) {
    // каждому якорю присваиваем обработчик события
    item.addEventListener('click', function(e) {
      // убираем стандартное поведение
      e.preventDefault();
      
      // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
      let coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
      
      // запускаем интервал, в котором
      let scroller = setInterval(function() {
        // считаем на сколько скроллить за 1 такт
        let scrollBy = coordY / framesCount;
        
        // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
        // и дно страницы не достигнуто
        if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
          // то скроллим на к-во пикселей, которое соответствует одному такту
          window.scrollBy(0, scrollBy);
        } else {
          // иначе добираемся до элемента и выходим из интервала
          window.scrollTo(0, coordY);
          clearInterval(scroller);
        }
      // время интервала равняется частному от времени анимации и к-ва кадров
      }, animationTime / framesCount);
    });
  });

  function onEntry(entry) {
    entry.forEach(change => {
      if (change.isIntersecting) {
        change.target.classList.add('element-show');
      } else {
        change.target.classList.remove('element-show');
      }
    });
  }
  let options = { threshold: [0.5] };
  let observer = new IntersectionObserver(onEntry, options);
  let elements = document.querySelectorAll('.element-animation');
  for (let elm of elements) {
    observer.observe(elm);
  }
})