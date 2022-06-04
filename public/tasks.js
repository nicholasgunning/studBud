// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button"); // Complex CSS query
const tasklist = document.getElementById("tasklist");
const taskInput = document.getElementById("taskInput");

// Event listener for Button click
// This could also be form.addEventListener("submit", function() {...} )
button.addEventListener("click", function(event) {
    event.preventDefault(); // Not as necessary for button, but needed for form submit

    let taskDescription = form.elements.task.value; // could be swapped out for line below
    //let task = taskInput.value;

    let dueDate = form.elements.dueDate.value;

    let priorityRating = form.elements.priority.value;

    let completionTime = form.elements.completionTime.value;

    let estimatedTime = form.elements.estimatedTime.value;


    // Call the addTask() function using
    addTask(taskDescription, dueDate, completionTime, estimatedTime, priorityRating);

    // Log out the newly populated taskList everytime the button has been pressed
    console.log(taskList);
})

// Create an empty array to store our tasks
var taskList = [];


function addTask(taskDescription, dueDate, completionTime, estimatedTime, priorityRating) {
    let task = {
        taskDescription,
        dueDate,
        completionTime,
        estimatedTime,
        priorityRating,
    };

    // Add the task to our array of tasks
    taskList.push(task);

    // Separate the DOM manipulation from the object creation logic
    renderTask(task);
}



// Function to display the item on the page
function renderTask(task) {
    let outerItem = document.createElement("div")
    let item = document.createElement("li");
    item.innerHTML = task.taskDescription + "<br>" + task.dueDate + "<br>" + task.completionTime + "<br>" + task.estimatedTime + "<br>" + task.priorityRating + "<br>";
    tasklist.appendChild(item);
    tasklist.appendChild(outerItem);

    // Setup delete button DOM elements
    let delButton = document.createElement("button");
    let delButtonText = document.createTextNode("Delete");
    delButton.appendChild(delButtonText);
    item.appendChild(delButton); // Adds a delete button to every task

    // Listen for when the 
    delButton.addEventListener("click", function(event) {
        item.remove(); // Remove the task item from the page when button clicked
        // Because we used 'let' to define the item, this will always delete the right element
    })

    // Clear the value of the input once the task has been added to the page
    tasklist.appendChild(outerItem);
    form.reset();
}


//CODE FOR KANBAN


var movingCard = null;


//once the item is picked up from the task div the content needs to be removed from the original div
function startDragging(e) {
    this.classList.add('dragging');
    movingCard = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

//Once the item is dragged into the div it wants to be
function dragInto(e) {
    if (movingCard.parentNode.parentNode !== this) {
        this.classList.add('over');
    }
}


function dragWithin(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

//Removing the item from the Div once it has been picked up
function dragOut(e) {
    this.classList.remove('over');
}


//Once the function is dropped onto the div
function drop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (movingCard.parentNode.parentNode !== this) {
        this.getElementsByClassName('card-list')[0].appendChild(movingCard);
    }

    return false;
}

function stopDragging(e) {
    [].forEach.call(columns, function(column) {
        column.classList.remove('over');
    });
    movingCard.classList.remove('dragging');
    movingCard = null;
}

var cards = document.querySelectorAll('#board .card');
[].forEach.call(cards, function(card) {
    card.addEventListener('dragstart', startDragging, false);
    card.addEventListener('dragend', stopDragging, false);

});

//declaring all the drag variables 
var columns = document.querySelectorAll('#board .column');
[].forEach.call(columns, function(column) {
    column.addEventListener('dragenter', dragInto, false);
    column.addEventListener('dragover', dragWithin, false);
    column.addEventListener('dragleave', dragOut, false);
    column.addEventListener('drop', drop, false);
});