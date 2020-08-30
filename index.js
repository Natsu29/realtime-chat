const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ejs = require("ejs");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("pages/index");
});

http.listen(3000, () => console.log("Server started at port 3000."));
