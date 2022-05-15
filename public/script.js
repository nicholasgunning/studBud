var __PDF_DOC;
var __CURRENT_PAGE;
var __TOTAL_PAGES;
var __PAGE_RENDERING_IN_PROGRESS = 0;
var __CANVAS = $('#pdf-canvas').get(0);
var __CANVAS_CTX = __CANVAS.getContext('2d');



// RESIZING CANVAS

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

    PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
        __PDF_DOC = pdf_doc;
        __TOTAL_PAGES = __PDF_DOC.numPages;
        
        // Hide the pdf loader and show pdf container in HTML
        $("#pdf-loader").hide();
        $("#pdf-contents").show();
        $("#pdf-total-pages").text(__TOTAL_PAGES);

        // Show the first page
        showPage(1);
    }).catch(function(error) {
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
    __PDF_DOC.getPage(page_no).then(function(page) {
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
        page.render(renderContext).then(function() {
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
$("#upload-button").on('click', function() {
    $("#file-to-upload").trigger('click');
});

// When user chooses a PDF file
$("#file-to-upload").on('change', function() {
    $("#upload-button").hide();

    // Send the object url of the pdf
    showPDF(URL.createObjectURL($("#file-to-upload").get(0).files[0]));
});

// Previous page of the PDF
$("#pdf-prev").on('click', function() {
    if(__CURRENT_PAGE != 1)
        showPage(--__CURRENT_PAGE);
});

// Next page of the PDF
$("#pdf-next").on('click', function() {
    if(__CURRENT_PAGE != __TOTAL_PAGES)
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
let interval = null;


//event listners
start_btn.addEventListener('click', start);
stop_btn.addEventListener('click', stop);
reset_btn.addEventListener('click', reset);


//timer function
//need timer that every second ticks up and displays the correct time 
//update the time

function timer () {
  //everytime its callex it increases by one
seconds++;

  //format stopwatch time


  //math.floor flattens the number 

   //could also be 60*60 which = 3600
  let hrs = Math.floor(seconds/3600);

  let mins = Math.floor((seconds - (hrs * 3600))/60);
  //seconds/60 = mins

  
  //allows for 60sec intervals
  let secs = seconds % 60;

// in order for the numbers to have a 0 infront of them like a proper stopwatch
if (secs < 10) secs = '0' + secs;
if (mins < 10) mins = '0' + mins;
if (hrs < 10) hrs = '0' + hrs;


 time_el.innerText =  `${hrs}:${mins}:${secs}`
}



// start function


function start () {
// if its already running we dont need to start again

  // if its not running it can start
  // every 1000 ms it will call timer function
  interval = setInterval(timer, 1000)
  
  }

function stop () {

clearInterval(interval);
interval=null;

}

function reset () {
	stop();
	seconds = 0;
	time_el.innerText = '00:00:00';
}
