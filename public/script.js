(function() {
   // To do box allows for simple tasks to be appended into the div
   var taskCardInput = document.querySelector("#taskCardInput"),
       taskCard = document.querySelector(".taskCard"),
       list = document.querySelector("#list");
   
   // when submit button is pressed new list is created
   taskCard.addEventListener("submit", function(ev) {
     list.innerHTML += "<li>" + taskCardInput.value + "</li>";
     ev.preventDefault();
   }, false);
 
   // when task is clicked it changes apperance and if it is clicked again it gets removed
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


//Variables for the PDF viewer
var __PDF_DOC;
var __CURRENT_PAGE;
var __TOTAL_PAGES;
var __PAGE_RENDERING_IN_PROGRESS = 0;
var __CANVAS = $('#pdf-canvas').get(0);
var __CANVAS_CTX = __CANVAS.getContext('2d');



// RESIZING CANVAS
// Resize the canvas/pdfViewer as the window size changes
var aWrapper = document.getElementById("aWrapper");
var canvas = document.getElementById("pdf-canvas");


function resizeCanvas() {
   //Gets the devicePixelRatio
   var pixelRatio = setCanvasScalingFactor();

   //The viewport is in portrait mode, so var width should be based off viewport WIDTH
   if (window.innerHeight > window.innerWidth) {
      //Makes the canvas 100% of the viewport width
      var width = Math.round(1.0 * window.innerWidth);
   }
   //The viewport is in landscape mode, so var width should be based off viewport HEIGHT
   else {
      //Makes the canvas 100% of the viewport height
      var width = Math.round(1.0 * window.innerHeight);
   }

   //This is done in order to maintain the 1:1 aspect ratio, adjust as needed
   var height = width;

   //This will be used to downscale the canvas element when devicePixelRatio > 1
   aWrapper.style.width = width + "px";
   aWrapper.style.height = height + "px";

   canvas.width = width * pixelRatio;
   canvas.height = height * pixelRatio;
}


// Initialize and load the PDF
function showPDF(pdf_url) {
   // Show the pdf loader
   $("#pdf-loader").show();

   PDFJS.getDocument({
      url: pdf_url
   }).then(function (pdf_doc) {
      __PDF_DOC = pdf_doc;
      __TOTAL_PAGES = __PDF_DOC.numPages;

      // Hide the pdf loader and show pdf container in HTML
      $("#pdf-loader").hide();
      $("#pdf-contents").show();
      $("#pdf-total-pages").text(__TOTAL_PAGES);

      // Show the first page
      showPage(1);
   }).catch(function (error) {
      // If error re-show the upload button
      $("#pdf-loader").hide();
      $("#upload-button").show();

      alert(error.message);
   });;
}


// Load and render a specific page of the PDF
function showPage(page_no) {
   __PAGE_RENDERING_IN_PROGRESS = 1;
   __CURRENT_PAGE = page_no;

   // Disable Prev & Next buttons while page is being loaded
   $("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

   // While page is being rendered hide the canvas and show a loading message
   $("#pdf-canvas").hide();
   $("#page-loader").show();

   // Update current page in HTML
   $("#pdf-current-page").text(page_no);

   // Fetch the page
   __PDF_DOC.getPage(page_no).then(function (page) {
      // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
      var scale_required = __CANVAS.width / page.getViewport(1).width;

      // Get viewport of the page at required scale
      var viewport = page.getViewport(scale_required);

      // Set canvas height
      __CANVAS.height = viewport.height;

      var renderContext = {
         canvasContext: __CANVAS_CTX,
         viewport: viewport
      };

      // Render the page contents in the canvas
      page.render(renderContext).then(function () {
         __PAGE_RENDERING_IN_PROGRESS = 0;

         // Re-enable Prev & Next buttons
         $("#pdf-next, #pdf-prev").removeAttr('disabled');

         // Show the canvas and hide the page loader
         $("#pdf-canvas").show();
         $("#page-loader").hide();
      });
   });
}

// Upon click this should should trigger click on the <input type="file" /> element
// This is better than showing the ugly looking file input element
$("#upload-button").on('click', function () {
   $("#file-to-upload").trigger('click');
});

// When user chooses a PDF file
$("#file-to-upload").on('change', function () {
   $("#upload-button").hide();

   // Send the object url of the pdf
   showPDF(URL.createObjectURL($("#file-to-upload").get(0).files[0]));
});

// Previous page of the PDF
$("#pdf-prev").on('click', function () {
   if (__CURRENT_PAGE != 1)
      showPage(--__CURRENT_PAGE);
});

// Next page of the PDF
$("#pdf-next").on('click', function () {
   if (__CURRENT_PAGE != __TOTAL_PAGES)
      showPage(++__CURRENT_PAGE);
});


//FOR STOPWATCH////////


// global variables for stopwatch

const time_el = document.querySelector('.watch .time');
const start_btn = document.getElementById('start');
const stop_btn = document.getElementById('stop');
const reset_btn = document.getElementById('reset');
// const watch =  document.getElementById('watchArea');


let seconds = 0;
//what ticks the timer every second
let intervalStopwatch = null;


//event listeners
start_btn.addEventListener('click', start);
stop_btn.addEventListener('click', stop);
reset_btn.addEventListener('click', reset);


//timer function
//need timer that every second ticks up and displays the correct time 
//update the time

function timer() {
   //overtime its called it increases by one
   seconds++;
   //format stopwatch time
   //math.floor flattens the number 
   //could also be 60*60 which = 3600
   let hrs = Math.floor(seconds / 3600);
   let mins = Math.floor((seconds - (hrs * 3600)) / 60);
   //seconds/60 = mins
   //allows for 60sec intervals
   let secs = seconds % 60;
   // in order for the numbers to have a 0 in front of them like a proper stopwatch
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
   //stop function by clearing interval
   clearInterval(intervalStopwatch);
   intervalStopwatch = null;

}

function reset() {
   stop();
   seconds = 0;
   time_el.innerText = '00:00:00';
}





//POMODORO


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


// Getting js button by ID and adding event listener for click so that when the click happens the start timer will actually be called.

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
   interval = setInterval(function () {
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
//once the button is pressed it disapears 
$(document).ready(function () {
   $(".main-button").click(function () {
      $(".main-button").hide()
   });
   $(".main-button").click(function () {});
});



document.addEventListener('DOMContentLoaded', function() {
	var allNotes = document.getElementsByClassName("allNotes");
	
	var i;
	for (i = 0; i < allNotes.length; i++) {
  var notes = localStorage.getItem("notesApp" + allNotes[i].id); // FETCHING VALUE FROM LOCAL STORAGE
		
  if(notes != null) {
    document.getElementById(allNotes[i].id).value = notes;
  	}
	
allNotes[i].onkeyup = function(event) {
  var storedData = event.target.value;  localStorage.setItem("notesApp" + event.target.id, storedData); //  STORING VALUE TO LOCAL STORAGE
 	 }
	}
});






