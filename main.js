if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Stopwatch/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
        alert('A new update is available. Please refresh the page.');
        if (confirm('A new update is available. Would you like to refresh now?')) {
    window.location.reload();
  }
      });
    }, error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

let startTime;
let updatedTime;
let difference;
let tInterval;
let running = false;
let prevLapTime = 0;
let num = 1;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const laps = document.getElementById('laps');
let lapscroll = document.querySelector("#lapscroll");
var buttons = document.querySelector(".buttons")
function updateButtonPosition() {
    startStopBtn.style.left = (buttons.clientWidth / 2) - (startStopBtn.clientWidth / 2) + "px";
}
let lastClickTime = 0;
const debounceDelay = 100; // Reduce debounce delay for faster clicking
function startStop() {
      const currentTime = new Date().getTime();
      if (currentTime - lastClickTime < debounceDelay) {
        return; // Ignore the click if it's within the debounce delay
      }
    lastClickTime = currentTime;
  
    if (!running) {
        startTime = new Date().getTime() - (difference || 0);
        tInterval = setInterval(updateTime, 10); // Update every 10 milliseconds

        startStopBtn.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 136 174" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="51" height="174" rx="16" fill="white"/>
<rect x="84" width="52" height="174" rx="16" fill="white"/>
</svg>
        `;
      
      lapBtn.style.animation = "flyInRight 0.2s";
      resetBtn.style.animation = "flyInLeft 0.2s";
      lapBtn.style.display = "block";
      resetBtn.style.display = "block";
      running = true;
      display.classList.remove('blink');
    
 if (running && lapBtn.style.display == "none") {
  lapBtn.style.display = "block";
}
      
    } else {
        clearInterval(tInterval);
        startStopBtn.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 126 157" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M119.361 67.6197C127.208 72.7509 127.208 84.249 119.361 89.3803L20.3647 154.114C11.7184 159.768 0.249986 153.565 0.249986 143.234V13.7658C0.249986 3.435 11.7184 -2.76841 20.3647 2.88546L119.361 67.6197Z" fill="white"/>
</svg>
        `;

      lapBtn.style.animation = "flyOutRight 0.2s";
      resetBtn.style.animation = "flyInLeft 0.2s";
      setTimeout(function() {
      lapBtn.style.display = "none";
      }, 150);
      
      resetBtn.style.display = "block";
        running = false;
        display.classList.add('blink');
    }
  
if (running && lapBtn.style.display == "none") {
  lapBtn.style.display = "block";
}


}

function reset() {
    clearInterval(tInterval);
    difference = 0;
    running = false;
    updateDisplay('00:00:00.00');
    startStopBtn.style.width = "90px";
  
    startStopBtn.innerHTML = `
            <svg width="30" height="30" viewBox="0 0 126 157" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M119.361 67.6197C127.208 72.7509 127.208 84.249 119.361 89.3803L20.3647 154.114C11.7184 159.768 0.249986 153.565 0.249986 143.234V13.7658C0.249986 3.435 11.7184 -2.76841 20.3647 2.88546L119.361 67.6197Z" fill="white"/>`;
//    lapBtn.disabled = true;
  //  resetBtn.disabled = true;
    lapBtn.style.animation = "flyOutRight 0.4s";
    resetBtn.style.animation = "flyOutLeft 0.4s";
  setTimeout(function() {
    lapBtn.style.display = "none";
    resetBtn.style.display = "none";
  }, 350);
    lapscroll.innerHTML = '';
    display.classList.remove('blink');
    prevLapTime = 0; // Reset the previous lap time
  num = 1;
  updateButtonPosition();
}
      

function lap() {
  if (running) {
    const lapTime = document.createElement('div');
    lapTime.classList.add('lap');

    const lapTimeString = formatTime(difference);
    const currentLapDiff = difference - prevLapTime; // Calculate difference between current and previous lap
    const lapgap = formatTime(currentLapDiff);
    
    lapTime.innerHTML = `<span>${num})</span> ${lapTimeString}    <span class="lapgap">${lapgap}</span>`;
    lapscroll.appendChild(lapTime);

    // Update scrollHeight after appending
        lapscroll.scrollTo({
    top: lapscroll.scrollHeight,
    behavior: 'smooth'
  });

    prevLapTime = difference; // Update the previous lap time to the current difference
    num++;
  }
}

function updateDisplay(timeString) {
    const timeDigits = timeString.replace(/:/g, '').replace(/\./g, '').split('');
    const spans = display.querySelectorAll('.digit span');
    timeDigits.forEach((digit, index) => {
        if (spans[index].textContent !== digit) {
            spans[index].textContent = digit;
        }
    });
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const centiseconds = Math.floor((difference % 1000) / 10);

    const time = `${(hours < 10) ? "0" + hours : hours}:${(minutes < 10) ? "0" + minutes : minutes}:${(seconds < 10) ? "0" + seconds : seconds}.${(centiseconds < 10) ? "0" + centiseconds : centiseconds}`;
    updateDisplay(time);
}

function formatTime(difference) {
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const centiseconds = Math.floor((difference % 1000) / 10);
    return `${(hours < 10) ? "0" + hours : hours}:${(minutes < 10) ? "0" + minutes : minutes}:${(seconds < 10) ? "0" + seconds : seconds}.${(centiseconds < 10) ? "0" + centiseconds : centiseconds}`;
}
      
      function setSize() {
        if (window.innerHeight < 519) {
          laps.style.height = "36%";
        }
        else {
          laps.style.height = "50%";
        }
        
        if (window.innerWidth - window.innerHeight < -50) {
          buttons.style.width = "75%";
        }
        else {
          buttons.style.width = "304px";
        }
        updateButtonPosition()
      }

startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);
  // Execute the function on page load
  window.addEventListener('load', setSize);

  // Execute the function on window resize
  window.addEventListener('resize', setSize);
      updateButtonPosition();
