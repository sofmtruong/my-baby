
initFireWorks();
initCountDown();

function initFireWorks() {
  const containers = document.querySelectorAll('.fireworks-container');
  containers.forEach((container, index) => {
    index += 1;
    // Dùng Fireworks.default vì global export là default
    const fireworks = new Fireworks.default(container, {
      hue: { min: 0, max: 360 },
      delay: { min: 50 / index, max: 100 / index },
      brightness: { min: 80, max: 100 },
      rocketsPoint: { min: 50, max: 50 },
      opacity: 1,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 2,
      particles: 200 / index,
      traceLength: 4 / index,
      explosion: 40 / index,
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
      document.querySelector("." + key).textContent = diff[key];
    });

    // Nếu bạn vẫn muốn hiển thị năm 2025:
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

(function ($) {
    $.fn.sliderVideo = function (options) {
        options = $.extend({
            scrollerSelector: '.slider-video-scroll',
            itemSelector: '.slider-video-item',
            aspectSelect: '.slider-video-aspect',
            navLeftSelector: '.slider-video-left',
            navRightSelecto: '.slider-video-right',
            scrollTime: 500,
            animationTime: 300,
            visibleItems: 2,
            itemsGap: 10,
            aspectRation: 0.625
        }, options);

        var $slider = $(this);
        var $scroller = $slider.find(options.scrollerSelector);
        var $aspect = $slider.find(options.aspectSelect);
        var $items = $slider.find(options.itemSelector);
        var $navLeft = $slider.find(options.navLeftSelector);
        var $navRight = $slider.find(options.navRightSelecto);
        $items.bind('click', onItemClick);
        $navLeft.bind('click', onNavLeftClick);
        $navRight.bind('click', onNavRightClick);
        $slider.bind('scrollToIndex', function (event, index) {
            scrollToIndex(index);
        });

        initializeSize();
        initializeOrigin();
        initializeNavigation();

        function initializeSize() {
            $aspect.height($aspect.width() * options.aspectRation);
            $scroller.width((50 * $items.length) + '%');

            var itemWidth = $aspect.width() / options.visibleItems;
            var itemHeight = itemWidth * options.aspectRation;
            var positionTop = ($aspect.height() - itemHeight) / 2;
            $items.each(function (i) {
                $(this).css({
                    top: positionTop,
                    left: i * (itemWidth + options.itemsGap),
                    width: itemWidth - options.itemsGap + 'px',
                    height: itemHeight + 'px'
                })
            });
        }

        function initializeOrigin() {
            var aspectScrollLeft = $aspect.scrollLeft()
            $items.each(function (i) {
                var $item = $(this);
                if ($item.position().left > aspectScrollLeft) {
                    $item.css({
                        'transform-origin': '100% 50%'
                    });
                } else {
                    $item.css({
                        'transform-origin': '0 50%'
                    });
                }
            })
        }

        function initializeNavigation() {
            var visibleItems = getVisibleItems();

            $navLeft.toggle(visibleItems.first().prev().length > 0);
            $navRight.toggle(visibleItems.last().next().length > 0);
        }

        function onItemClick() {
            var $item = $(this);

            if ($item.is(".active")) {
                $item.removeClass('active');
                toggleVideo($item, false);
                initializeSize();

                $item.addClass('active-out');
                setTimeout(function () {
                    $item.removeClass('active-out');
                }, options.animationTime)
            }
            else {
                $item.css({
                    width: $aspect.width(),
                    height: $aspect.height(),
                    left: $aspect.scrollLeft(),
                    top: 0
                });
                $item.addClass('active');
                setTimeout(function () {
                    toggleVideo($item, true);
                }, 300)
            }
        }

        function onNavRightClick() {
            scrollTo(1);
        }

        function onNavLeftClick() {
            scrollTo(-1);
        }


        function toggleVideo($item, status) {
            $item.find('.slider-video-pic').toggle(!status);
            $item.find('.slider-video-play').toggle(status);
            var frame = $item.find('iframe')[0];
            frame.contentWindow.postMessage('{"event":"command","func":"' + (status ? 'playVideo' : 'pauseVideo') + '","args":""}', '*')
        }

        function scrollTo(direction) {

            if ($items.is('.active')) {
                var $active = $('.slider-video-item').filter('.active');
                var $next = direction > 0 ? $active.next() : $active.prev();
                if ($next.length) {
                    scrollToIndex($next.index());
                    $active.trigger('click');
                    setTimeout(function () {
                        $next.trigger('click');
                        initializeNavigation();
                    }, options.scrollTime)
                }
            } else {
                var visibleItems = getVisibleItems();

                if (direction > 0) {
                    scrollToIndex(visibleItems.last().next().index());
                } else {
                    scrollToIndex(visibleItems.first().prev().index());
                }
            }
        }

        function scrollToIndex(index) {
            var $item = $items.eq(index);
            if ($item.length) {
                var itemWidth = $aspect.width() / options.visibleItems;

                var itemLeft = $item.position().left;
                var targetPosition = null;

                if (itemLeft > $aspect.scrollLeft() + $aspect.width()) {
                    targetPosition = itemLeft - itemWidth - options.itemsGap;
                } else if (itemLeft < $aspect.scrollLeft()) {
                    targetPosition = itemLeft;
                }

                if (targetPosition != null) {
                    $aspect.animate({ scrollLeft: targetPosition + 'px' }, options.scrollTime, function () {
                        initializeOrigin();
                        initializeNavigation();
                    });
                }
            }
        }

        function getVisibleItems() {
            return $items.filter(function (i) {
                var posLeft = $(this).position().left;
                return posLeft >= $aspect.scrollLeft() && posLeft < $aspect.scrollLeft() + $aspect.width();
            });
        }

    };
})(jQuery);

$(function() {
  $('.slider-video').sliderVideo();
})