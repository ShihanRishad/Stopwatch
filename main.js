if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Stopwatch/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
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
      var buttons = document.querySelector(".buttons");
      var theme = document.querySelector(".theme");
      var stopwatch = document.querySelector(".stopwatch");
  let devicetheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';

              // Check if a theme preference is stored in localStorage
        var storedTheme = localStorage.getItem("stopwatchtheme");

        // Apply the stored theme or default to the device theme
        if (storedTheme) {
            applyTheme(storedTheme);
        } else {
            applyTheme(devicetheme);
        }
      
       
        function applyTheme(theme) {
            if (theme === "dark-theme") {
               // Dark theme changes...
                document.body.style.backgroundColor = "rgb(0 15 28)";
                document.body.style.color = "white";
                stopwatch.style.backgroundColor = "black";
                stopwatch.style.boxShadow = "0 10px 30px rgb(255 255 255 / 10%)";
                laps.style.boxShadow = "0 0 11px 0 #ffffff73";
                startStopBtn.style.backgroundColor = "#006723";
                lapBtn.style.backgroundColor = "#2b009f";
                resetBtn.style.backgroundColor = "#2b009f";
                devicetheme = "dark-theme";
                if (lap) {
                  // Change lap theme if they existed
                    updateLapTheme("dark-theme"); 
                }

            } else {
              // Light theme changes
                document.body.style.backgroundColor = "#f0f0f0";
                document.body.style.color = "black";
                stopwatch.style.backgroundColor = "white";
                stopwatch.style.boxShadow = "0 10px 30px rgb(0 0 0 / 10%)";
                laps.style.boxShadow = "0 0 11px 0 #00000073";
                lapBtn.style.backgroundColor = "#0067c5";
                resetBtn.style.backgroundColor = "#0067c5";
                startStopBtn.style.backgroundColor = "#009d00";
                devicetheme = "light-theme";

                if (lap) {
                  // Change lap theme if they existed
                    updateLapTheme("light-theme");
                }
            }
        }
      
        function updateLapTheme(theme) {
            const lapElements = document.querySelectorAll('.lap');
            lapElements.forEach(lap => {
                if (theme === "dark-theme") {
                    lap.style.backgroundColor = "#303030";
                    lap.style.color = "white";
                } else {
                    lap.style.backgroundColor = "#f9f9f9";
                    lap.style.color = "black";
                }
            });
        }

      
        var isDragging = false;
        var wasDragged = false;

        // Function to update the position of the reset button
        function moveButton(event) {
            var newX = event.clientX || event.touches[0].clientX;
            var newY = event.clientY || event.touches[0].clientY;
            theme.style.left = newX - theme.offsetWidth / 2 + 'px';
            theme.style.top = newY - theme.offsetHeight / 2 + 'px';
        }

        // Mouse Events
        theme.addEventListener('mousedown', function(event) {
            isDragging = true;
            wasDragged = false;
        }, false);

        document.addEventListener('mousemove', function(event) {
            if (isDragging) {
                moveButton(event);
                wasDragged = true;
            }
        }, false);

        document.addEventListener('mouseup', function(event) {
            if (isDragging) {
                isDragging = false;
            }
        }, false);

        theme.addEventListener('click', function(event) {
            if (!wasDragged) {
            let newTheme;
              let currentTheme = localStorage.getItem("stopwatchtheme");

               newTheme = currentTheme === "dark-theme" ? "light-theme" : "dark-theme";
               // Update the theme preference in localStorage
               localStorage.setItem("stopwatchtheme", newTheme); 
               // Apply the new theme
               applyTheme(newTheme);
              
            }
        }, false);

        // Touch Events
        theme.addEventListener('touchstart', function(event) {
            isDragging = true;
            wasDragged = false;
        }, false);

        theme.addEventListener('touchmove', function(event) {
            if (isDragging) {
                moveButton(event);
                wasDragged = true;
                event.preventDefault(); // Prevent scrolling when touch is used
            }
        }, false);

        theme.addEventListener('touchend', function(event) {
            if (isDragging) {
                isDragging = false;
            }
    /*        if (!wasDragged) {
            let newTheme;
              let currentTheme = localStorage.getItem("stopwatchtheme");

               newTheme = currentTheme === "dark-theme" ? "light-theme" : "dark-theme";
               // Update the theme preference in localStorage
               localStorage.setItem("stopwatchtheme", newTheme); 
               // Apply the new theme
               applyTheme(newTheme);
              
            } */
        }, false);
      
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
     
         // Apply the current theme to the new lap
         const nowTheme = localStorage.getItem("stopwatchtheme");
         if (nowTheme === "dark-theme") {
             lapTime.style.backgroundColor = "#303030";
             lapTime.style.color = "white";
         } else {
             lapTime.style.backgroundColor = "#f9f9f9";
             lapTime.style.color = "black";
         }
         
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
