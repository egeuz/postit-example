//"serve" the front-end
const express = require("express");
const app = express();

//facilitate multiple users interacting at once
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//serve the files in the public folder as a front-end to this server
//rather, serve the index.html inside public, which loads in your css & js
app.use(express.static('public'));

/*** SETTING UP SOCKET.IO ***/
io.on("connection", function(socket) {

  //when any user submits a new post-it...
  socket.on("new post-it", function (postItText) {
    //take the post-it text received and broadcast it everywhere else
    socket.broadcast.emit("new post-it", postItText)
    //other things you could do here:
    //validate/sanitize the text
    //associate it with a username
    //the world's your oyster
  })
})