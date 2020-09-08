const express = require("express");
const app = express();
const url = require("url");
const firebase = require("firebase/app");
require("firebase/database");
let PORT = 3000 || process.env.PORT;
app.use(express.static(__dirname + "/public"));
app.use(express.json());
//=============================================//
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ejs = require("ejs");
var firebaseConfig = {
  apiKey: "AIzaSyDyD62apXjkfB7bzxleKKRnqz0S20X1wVk",
  authDomain: "fir-968e0.firebaseapp.com",
  databaseURL: "https://fir-968e0.firebaseio.com",
  projectId: "fir-968e0",
  storageBucket: "fir-968e0.appspot.com",
  messagingSenderId: "1050711825301",
  appId: "1:1050711825301:web:a587a689f44355156a749c",
};
firebase.initializeApp(firebaseConfig);
app.set("view engine", "ejs");

//=============================================//
app.get("/", (request, response) => {
  response.render("pages/index");
});

app.get("/rooms", (request, response) => {
  response.render("pages/rooms");
});

app.get("/chat/:room", (request, response) => {
  response.render("pages/chat", { roomID: request.params.room });
});

app.post("/chat", (request, response) => {
  response.redirect(301, "/chat/:room");
});

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
