let socket = io();

socket.emit("join-room", roomid, "Unknown");
socket.on("user-connected", (user) => {
  console.log("user name is " + user);
});

let send = document.querySelector("#send");
send.addEventListener("click", () => {
  let messages = document.querySelector(".messages");
  let msg = document.querySelector("#msg");
  let message = document.createElement("div");
  message.innerHTML = `<div class="message">${msg.value}</div>`;
  messages.append(message);
  socket.emit("message-sent", msg.value, "User1");
  msg.value = "";
});

socket.on("message-received", (msg, user) => {
  let messages = document.querySelector(".messages");
  let message = document.createElement("div");
  message.innerHTML = `<div class="message">${msg}</div>`;
  messages.append(message);
  msg.value = "";
});
