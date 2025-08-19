
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
    document.querySelectorAll('.yeardigit').forEach((digit, index) => {
      digit.textContent = "2026"[index];
    });
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
