//require express for express operation
const express = require("express");
const app = express();
const url = require("url");

//require firebase app for firebase operation
const firebase = require("firebase/app");
require("firebase/database");

//set PORT for default server porting
let PORT = process.env.PORT || 3000;


//use public as static dir for accessing the files.
app.use(express.static(__dirname + "/public"));

//used for handling json body
app.use(express.json());



//=============================================//

//requiring http for socket.io use purposes
const http = require("http").createServer(app);

//requiring the actual socket.io lib
const io = require("socket.io")(http);


//requiring ejs lib for rendering ejs fils
const ejs = require("ejs");


//firebase config info that connect to firebase.
var firebaseConfig = {
  apiKey: "AIzaSyDyD62apXjkfB7bzxleKKRnqz0S20X1wVk",
  authDomain: "fir-968e0.firebaseapp.com",
  databaseURL: "https://fir-968e0.firebaseio.com",
  projectId: "fir-968e0",
  storageBucket: "fir-968e0.appspot.com",
  messagingSenderId: "1050711825301",
  appId: "1:1050711825301:web:a587a689f44355156a749c",
};

//init firebase app
firebase.initializeApp(firebaseConfig);

//setting app render or view engine to ejs
app.set("view engine", "ejs");

//=============================================//

//render index.ejs page on the home route.
app.get("/", (request, response) => {
  response.render("pages/index");
});

//render rooms.ejs page to rooms route
app.get("/rooms", (request, response) => {
  response.render("pages/rooms");
});


//render chat.ejs page to chat/roomid route
app.get("/chat/:room", (request, response) => {
  response.render("pages/chat", { roomID: request.params.room });
});

app.post("/chat", (request, response) => {
  
  response.redirect(301, "/chat/:room");
});


//manages socket.io connection from the server.
io.on("connection", (socket) => {
  console.log("user connetec in connection");
  socket.on("join-room", (room_id, user_id) => {
    socket.join(room_id);
    console.log("joined room :" + room_id);
    socket.to(room_id).broadcast.emit("user-connected", user_id);
    socket.on("message-sent", (msg, user) => {
      let fbdb = firebase.database().ref(`/rooms/${room_id}/messages/`);
      let key = fbdb.push().key;
      let m = { username: user, message: msg };
      fbdb.child(key).set(m);
      socket.to(room_id).broadcast.emit("message-received", msg, user);
    });
  });
});

http.listen(PORT, () => console.log("Server started at port " + PORT));
