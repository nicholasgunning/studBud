// DICTIONARY
const dictionaryInput = document.querySelector('.dictionarySearchInput')
const dictionaryBtn = document.querySelector('#dictionarySearchButton')
const dictionaryCard = document.querySelector('.dictionaryCard')

//The Dictionary code has some small parts of code taken from Harry 2019, Further information can be found within the references page

//Fetching API
dictionary_api('love')
async function dictionary_api(word) {
    const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(resp => resp.json())

    return resp[0]
}


//in addition to pressing the search button users can press the enter key
let keypress = document.querySelector("#dictionarySearchInput");
keypress.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        // event.preventDefault();
        add_dictionary_info(event);
    }
});

// By pressing the search button it runs the search result's
dictionaryBtn.addEventListener('click', add_dictionary_info)

//Function for filling in various information
async function add_dictionary_info() {
    //needs to retrive the value from the API
    const data = await dictionary_api(dictionaryInput.value)
    //log the data/definition
    console.log(data);
    //Only one meaning
    let partOfSpeech_arr = []
    for (let i = 0; i <= data.meanings.length - 1; i++) {
        partOfSpeech_arr.push(data.meanings[i].partOfSpeech)
    }

    //InnerHTML is used to display the result and edit the spans used to show the definition 
    //Variables throughout the innerHTML refer to the API
    dictionaryCard.innerHTML = `
        <div class="single">
            <span>Word:</span>
            <span>${data.word}</span>
        </div>
        <div class="single">
            <span>Audio:</span>
            <span>
                <audio controls src="${data.phonetics[0].audio}"></audio>
            </span>
        </div>
        <div class="single">
            <span>Definition:</span>
            <span>${data.meanings[0].definitions[0].definition}</span>
        </div>
        <div class="single">
            <span>Example:</span>
            <span>${data.meanings[1].definitions[0].example}</span>
        </div>
        <div class="single">
            <span>Parts Of Speech:</span>
            <span>${partOfSpeech_arr.map(e => e).join(', ')}</span>
        </div>
    `
}


//FOR STOPWATCH////////
//The stopwatch code has some parts of it that is from Developer, F. (2021). Further information can be found within the References page in the readme.

// global variables for stopwatch

const time_el = document.querySelector('.watch .time');
const start_btn = document.getElementById('start');
const stop_btn = document.getElementById('stop');
const reset_btn = document.getElementById('reset');
// const watch =  document.getElementById('watchArea');


let seconds = 0;
//what ticks the timer every second
let intervalStopwatch = null;


//event listners
start_btn.addEventListener('click', start);
stop_btn.addEventListener('click', stop);
reset_btn.addEventListener('click', reset);


//timer function
//need timer that every second ticks up and displays the correct time 
//update the time

function timer() {
    //everytime its callex it increases by one
    seconds++;
    //format stopwatch time
    //math.floor flattens the number 
    //could also be 60*60 which = 3600
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60);
    //seconds/60 = mins
    //allows for 60sec intervals
    let secs = seconds % 60;
    // in order for the numbers to have a 0 infront of them like a proper stopwatch
    if (secs < 10) secs = '0' + secs;
    if (mins < 10) mins = '0' + mins;
    if (hrs < 10) hrs = '0' + hrs;
    time_el.innerText = `${hrs}:${mins}:${secs}`
}


// start function


function start() {
    // if its already running we dont need to start again

    // if its not running it can start
    // every 1000 ms it will call timer function
    intervalStopwatch = setInterval(timer, 1000)

}

function stop() {
    clearInterval(intervalStopwatch);
    intervalStopwatch = null;

}

function reset() {
    stop();
    seconds = 0;
    time_el.innerText = '00:00:00';
}


// declaring time for different categories
// change these to be adapted later

const pomMode = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
};

let interval;


// Getting js button by ID and adding event listner for click so that when the click happens the start timer will actually be called.

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    const {
        action
    } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    }


});

//listener for when any of the buttons are clicked 

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);


// handle which one is being clicked


//End time getting passed in from start timer, we take the difference end time minus current time the difference will be used to calculate the total.
function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

// before we can start timer we need to exact time in the future when the timer will end. We retrieve the end time through date.parse

function startTimer() {
    let {
        total
    } = pomMode.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    // in order for the timer to automatically move on
    if (pomMode.mode === 'pomodoro') pomMode.sessions++;


    //interval variable set to remaining time
    interval = setInterval(function() {
        pomMode.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = pomMode.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);


            // automatically go to next session
            switch (pomMode.mode) {
                case 'pomodoro':
                    if (pomMode.sessions % pomMode.longBreakInterval === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }

            startTimer();
        }
    }, 1000);
}


//padStart pads them with 0s where necessary so as the number always has an equilivant of 2 if the number is 3 it will be 03 however if the number is 16 the pomodoro timer will read it as 16

//similar to stopwatch function

function updateClock() {
    const {
        remainingTime
    } = pomMode;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
}


//making a function for switchMode 

// Switch Mode functions adds two new properties to the TIMER object. The first mode is a property which is set to the current mode which is the different breaks and next is the remaining time which is set to the timer which contains the three different properties (total, minutes and seconds.) 

function switchMode(mode) {
    pomMode.mode = mode;
    pomMode.remainingTime = {
        total: pomMode[mode] * 60,
        minutes: pomMode[mode],
        seconds: 0,
    };

    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.getElementById("pomodoro1").style.backgroundImage = `var(--${mode})`;


    updateClock();
}


function handleMode(event) {
    const {
        mode
    } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);

}


document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});


// Hiding the button using JQUERY
// Button disapears once it is clicked
$(document).ready(function() {
    $(".main-button").click(function() {
        $(".main-button").hide()
    });
    $(".main-button").click(function() {});
});


//Notes is saved with local storage
document.addEventListener('DOMContentLoaded', function() {
    var allNotes = document.getElementsByClassName("allNotes");

    var i;
    for (i = 0; i < allNotes.length; i++) {
        var notes = localStorage.getItem("notesApp" + allNotes[i].id); //Fetching value from local storage

        if (notes != null) {
            document.getElementById(allNotes[i].id).value = notes;
        }

        allNotes[i].onkeyup = function(event) {
            var storedData = event.target.value;
            localStorage.setItem("notesApp" + event.target.id, storedData); // Storing value to local storage
        }
    }
});


// Todo function
(function() {
    var taskCardInput = document.querySelector("#taskCardInput"),
        taskCard = document.querySelector(".taskCard"),
        list = document.querySelector("#list");

    // once submit button is pressed new list is created
    taskCard.addEventListener("submit", function(ev) {
        list.innerHTML += "<li>" + taskCardInput.value + "</li>";
        ev.preventDefault();
    }, false);

    // First click modifies the text while the second click removes it.
    list.addEventListener("click", function(ev) {
        var t = ev.target,
            classList = t.classList;
        if (classList.contains("checked")) {
            t.parentNode.removeChild(t);
        } else {
            {
                classList.add("checked");
            }
        }
        ev.preventDefault();
    }, false);
})();