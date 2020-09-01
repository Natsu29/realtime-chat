const express = require("express");
const app = express();
const url = require("url");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
//=============================================//
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ejs = require("ejs");
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
      socket.to(room_id).broadcast.emit("message-received", msg, user);
    });
  });
});

http.listen(4200, () => console.log("Server started at port 3000."));
