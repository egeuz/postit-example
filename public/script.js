//import socket.io into this file as well
const socket = io() 

/*** SELECTING HTML ELEMENTS ***/
//the input for post-it text
const postItInput = document.getElementById("postit-input")
//the button to submit post-it
const postItSubmitButton = document.getElementById("postit-submit-button")
//the div where post-its will be shown
const postItContainer = document.getElementById("postit-container")

/*** UI EVENTS ***/
//when a user clicks the submit button...
postItSubmitButton.addEventListener("click", function() {
  const randomID = `p-${randomInteger(10000, 99999)}` //create a random ID for the post-it
  const postItText = postItInput.value //get the text to place into post-it
  addPostIt(postItText, randomID) //place a post-it element on the SUBMITTER's UI
  socket.emit("new post-it", postItText, randomID) //send the post-it text to the server
})

/*** SOCKET EVENTS ***/
//when ANY connected user creates a new post-it...
socket.on("new post-it", function(postItText, postItID) {
  //place the post-it on the UI
  addPostIt(postItText, postItID)
})

socket.on("edit post-it", function(postItText, postItID) {
  //place the post-it on the UI
  editPostIt(postItText, postItID)
})

function editPostIt(postItText, postItID) {
  const text = document.querySelector(`#${postItID} p`)
  const input = document.querySelector(`#${postItID} input`)
  text.innerHTML = postItText
  input.value = postItText
}

/*** HELPER FUNCTIONS ***/
function addPostIt(postItText, postItID) {
  
  /** CREATE THE POST-IT CONTAINER (DIV) **/
  const postItElement = document.createElement("div") //create the div
  postItElement.classList.add("post-it") //give the div "post-it" class
  postItElement.id = postItID

  /* CREATE POST-IT TEXT (P) */
  const text = document.createElement("p") //create the paragraph
  text.innerHTML = postItText; //add the post-it text received to the paragraph
  postItElement.appendChild(text) //add the paragraph into the post-it div
  /* CREATE EDIT POST-IT BUTTON (BUTTON) */
  const editButton = document.createElement("button") //create the button
  editButton.innerHTML = "edit" //name the button
  editButton.onclick = function() { //FUNCTIONALITY for edit button
    editInput.style.display = "block"
    finishEditButton.style.display = "block"
    editButton.style.display = "none"
    text.style.display = "none"
  }
  postItElement.appendChild(editButton) //add the button into the post-it div

  //create the editing input
  const editInput = document.createElement("input")
  editInput.type = "text"
  editInput.name = "edit-input"
  editInput.value = postItText;
  editInput.style.display = "none";
  postItElement.appendChild(editInput)

  //create the finish editing button
  const finishEditButton = document.createElement("button")
  finishEditButton.innerHTML = "finish editing"
  finishEditButton.style.display = "none";
  //add functionality to the finish edit button
  finishEditButton.onclick = function() {
    editInput.style.display = "none"
    finishEditButton.style.display = "none"
    editButton.style.display = "block"
    text.style.display = "block"
    //carry the edited text back over to the actual post-it text

    const newPostItText = editInput.value;
    text.innerHTML = newPostItText;
    
    //ADD SOME SOCKET STUFF HERE
    socket.emit("edit post-it", newPostItText, postItID)
  }
  postItElement.appendChild(finishEditButton)

  //add the post-it element to the post-it container
  postItContainer.appendChild(postItElement)


  //WARNING: creating elements in HTML like this is EXTREMELY UNSAFE!!! don't use this function in the actual app
}

//HELPER METHODS
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}