var swiper = new Swiper(".mySlider", {
  slidesPerView: 2.25,
  centeredSlides: true,
  spaceBetween: 10,
  loop: true,
  breakpoints: {
    1440: {
      slidesPerView: 2.25,
    },
    360: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
