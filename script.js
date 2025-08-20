document.addEventListener("DOMContentLoaded", function () {
  initFireWorks();
  initCountDown();
  initSwiper();
  initVideoEvents();
});

function initFireWorks() {
  const containers = document.querySelectorAll('.fireworks-container');
  containers.forEach((container, index) => {
    index += 1;
    const fireworks = new Fireworks.default(container, {
      hue: { min: 0, max: 360 },
      delay: { min: 100, max: 800 },
      brightness: { min: 80, max: 100 },
      rocketsPoint: { min: 50, max: 50 },
      opacity: 1,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 3.5,
      particles: 50,         // ít hạt hơn
      traceLength: 2,        // ngắn hơn
      explosion: 30,         // vụ nổ nhỏ hơn
      autoresize: true
    });
    fireworks.start();
  });
}

function initCountDown() {
  const countdown = setInterval(() => {
    const targetDate = new Date("2026-02-15T23:59:59");
    const diff = countDownDate(targetDate);

    Object.keys(diff).forEach(key => {
      const el = document.querySelector("." + key);
      if (el) el.textContent = diff[key];
    });

    document.querySelector('.countdown-date').textContent = "15-02-2026";
  }, 1000);
}

function countDownDate(date_future) {
  const date_now = new Date();
  let seconds = Math.floor((date_future - date_now) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - (days * 24);
  minutes = minutes - (days * 24 * 60) - (hours * 60);
  seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

  return { days, hours, minutes, seconds };
}

function initSwiper() {
  const sliderSelector = ".swiper-container";
  const options = {
    init: false,
    loop: true,
    speed: 800,
    slidesPerView: 3,
    centeredSlides: true,
    effect: "coverflow",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    },
    grabCursor: true,
    parallax: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false
    },
    breakpoints: {
      1023: {
        slidesPerView: 1,
        spaceBetween: 0
      }
    },
    on: {
      imagesReady: function () {
        this.el.classList.remove("loading");
      },
      slideChange: function () {
        videoStop();
      }
    }
  };

  const mySwiper = new Swiper(sliderSelector, options);
  mySwiper.init();
}

function initVideoEvents() {
  $(document).on("click", ".js-videoPoster", function (ev) {
    ev.preventDefault();
    videoStop();
    const $poster = $(this);
    const $wrapper = $poster.closest(".js-videoWrapper");
    videoPlay($wrapper);
  });
}

function videoPlay($wrapper) {
  const $iframe = $wrapper.find(".js-videoIframe");
  const src = $iframe.data("src");
  $wrapper.addClass("videoWrapperActive");
  $iframe.attr("src", src);
}

function videoStop($wrapper) {
  if (!$wrapper) {
    $wrapper = $(".js-videoWrapper");
    $iframe = $(".js-videoIframe");
  } else {
    $iframe = $wrapper.find(".js-videoIframe");
  }
  $wrapper.removeClass("videoWrapperActive");
  $iframe.attr("src", "");
}
