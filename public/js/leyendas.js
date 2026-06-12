window.onload = function() {
  
  const swiper = new Swiper('.swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 2.5,
      slideShadows: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
   
    preventClicks: false,
    preventClicksPropagation: false,
  });

 
  document.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.addEventListener('click', function() {
     
      if (this.classList.contains('swiper-slide-active')) {
        const url = this.getAttribute('data-url');
        if (url) {
          window.location.href = url;
        } else {
          console.error("Te falta poner el data-url en el HTML de esta carta");
        }
      }
    });
  });
};