const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const submitButton = document.querySelector("#submit");


const Paragraphs = [
    "The quick brown fox jumps over the lazy dog.",
    "Fast typing tests can help improve your speed and accuracy.",
    "Practice makes perfect when it comes to typing.",
    "Typing is an essential skill in the digital age.",
    "Consistent practice can lead to significant improvements in typing speed."
]

// Function to display top 3 scores
function displayTopScores() {
    const storedScores = JSON.parse(localStorage.getItem("typingTestScores")) || [];
    const scoresContainer = document.getElementById("scores");
    
    // Sort scores by WPM in descending order (highest first)
    const sortedScores = storedScores.sort((a, b) => (b.wpm || 0) - (a.wpm || 0));
    
    // Clear existing scores
    scoresContainer.innerHTML = "";
    
    // Display only top 3 scores
    const topThree = sortedScores.slice(0, 3);
    topThree.forEach(score => {
        const newScore = document.createElement("ul");
        newScore.classList.add("scorelist");
        const wpmDisplay = score.wpm ? `<li>WPM: <span>${score.wpm}</span></li>` : "";
        newScore.innerHTML = `<li>Name: <span>${score.name}</span></li><li>Time: <span>${score.time}</span></li>${wpmDisplay}`;
        scoresContainer.appendChild(newScore);
    });
}

//load scores from localstorage on page load
window.onload = function() {
    displayTopScores();

    // Set a random paragraph from the array as the origin text
    const randomIndex = Math.floor(Math.random() * Paragraphs.length);
    document.querySelector("#origin-text p").innerHTML = Paragraphs[randomIndex];
};

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

// Helper function to convert timer format (MM:SS:HH) to total seconds
function timerToSeconds(timerString) {
    const parts = timerString.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    const hundredths = parseInt(parts[2], 10);
    return minutes * 60 + seconds + hundredths / 100;
}

// Calculate WPM using the standard formula: (Total Characters / 5) / (Total Seconds / 60)
function calculateWPM(totalCharacters, totalSeconds) {
    return Math.round((totalCharacters / 5) / (totalSeconds / 60));
}

//as you type, if the text matches the origin text, the color changes green, if it doesnt match changes red
testArea.addEventListener("keyup", function() {
    const enteredText = testArea.value;
    const originText = document.querySelector("#origin-text p").innerHTML;
    
    // Build character feedback display
    let feedbackHTML = "";
    for (let i = 0; i < originText.length; i++) {
        if (i < enteredText.length) {
            if (enteredText[i] === originText[i]) {
                feedbackHTML += `<span class="char-correct">${originText[i]}</span>`;
            } else {
                feedbackHTML += `<span class="char-incorrect">${originText[i]}</span>`;
            }
        } else {
            feedbackHTML += `<span class="char-untyped">${originText[i]}</span>`;
        }
    }
    document.getElementById("character-feedback").innerHTML = feedbackHTML;
    
    if (enteredText === originText) {
        testWrapper.style.borderColor = "green";
        clearInterval(interval); // Stop the timer when the text matches
        //show the submit score button
        submitButton.style.visibility = "visible";
    } else if (originText.startsWith(enteredText)) {
        testWrapper.style.borderColor = "blue"; // Partial match
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
    submitButton.style.visibility = "hidden"; // Hide submit button
    document.getElementById("character-feedback").innerHTML = ""; // Clear character feedback
    
    // Load a new random paragraph
    const randomIndex = Math.floor(Math.random() * Paragraphs.length);
    document.querySelector("#origin-text p").innerHTML = Paragraphs[randomIndex];
});

//once submit button is clicked, prompt for name, then add name and time to scoreboard
submitButton.addEventListener("click", function() {
    const playerName = prompt("Enter your name:");
    const finalTime = theTimer.innerHTML;
    const totalSeconds = timerToSeconds(finalTime);
    const wpm = calculateWPM(originText.length, totalSeconds);
    
    //save to localstorage
    const scoreData = { name: playerName, time: finalTime, wpm: wpm };
    let storedScores = JSON.parse(localStorage.getItem("typingTestScores")) || [];
    storedScores.push(scoreData);
    localStorage.setItem("typingTestScores", JSON.stringify(storedScores));

    // Display updated top 3 scores
    displayTopScores();
    
    // Hide the submit button after submission
    submitButton.style.visibility = "hidden";
});