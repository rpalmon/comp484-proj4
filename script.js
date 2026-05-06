const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");


// Run an optimized minute/second/hundredths timer:
var timerCount = 0;
var interval;
var timerRunning = false;


function runTimer() {
    timerCount++;
    
    // Calculate minutes, seconds, and hundredths using modulo for efficiency
    const minutes = Math.floor(timerCount / 6000);
    const seconds = Math.floor((timerCount % 6000) / 100);
    const hundredths = timerCount % 100;
    
    // Use padStart for cleaner leading zero formatting
    const currentTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`;
    theTimer.innerHTML = currentTime;
}

// Match the text entered with the provided text on the page:


// Start the timer:
function timerStart() {
    if (testArea.value.length === 0) {
        theTimer.innerHTML = "00:00:00";
        // Start the timer
        interval = setInterval(runTimer, 10);
    }
}


// Reset everything:


// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", timerStart);
//on keypress, in the test area, start the timer

//as you type, if the text matches the origin text, the color changes green, if it doesnt match changes red
testArea.addEventListener("keyup", function() {
    const enteredText = testArea.value;
    if (enteredText === originText) {
        testWrapper.style.borderColor = "green";
        clearInterval(interval); // Stop the timer when the text matches
    } else if (originText.startsWith(enteredText)) {
        testWrapper.style.borderColor = "orange"; // Partial match
    } else {
        testWrapper.style.borderColor = "red"; // No match
    }

    // If the text matches, stop the timer
    if (enteredText === originText) {
        clearInterval(interval);
    }
});

resetButton.addEventListener("click", function() {
    clearInterval(interval); // Stop the timer
    timerCount = 0; // Reset timer count
    theTimer.innerHTML = "00:00:00"; // Reset timer display
    testArea.value = ""; // Clear the text area
    testWrapper.style.borderColor = "grey"; // Reset border color
    //stop the timer

});