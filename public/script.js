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
  const postItText = postItInput.value //get the text to place into post-it
  addPostIt(postItText) //place a post-it element on the SUBMITTER's UI
  socket.emit("new post-it", postItText) //send the post-it text to the server
})

/*** SOCKET EVENTS ***/
//when ANY connected user creates a new post-it...
socket.on("new post-it", function(postItText) {
  //place the post-it on the UI
  addPostIt(postItText)
})

/*** HELPER FUNCTIONS ***/
function addPostIt(postItText) {
  //create a post-it element: using template literal strings: 
  //see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  const postItElement = `<div class="post-it">${postItText}</div>` 
  //add the new post-it element into the post-it container
  postItContainer.innerHTML += postItElement
  //WARNING: creating elements in HTML like this is EXTREMELY UNSAFE!!! don't use this function in the actual app
}