var firebaseConfig = {
  apiKey: "AIzaSyDyD62apXjkfB7bzxleKKRnqz0S20X1wVk",
  authDomain: "fir-968e0.firebaseapp.com",
  databaseURL: "https://fir-968e0.firebaseio.com",
  projectId: "fir-968e0",
  storageBucket: "fir-968e0.appspot.com",
  messagingSenderId: "1050711825301",
  appId: "1:1050711825301:web:a587a689f44355156a749c",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let socket = io();
let tm = document.querySelector(".messages");
socket.emit("join-room", roomid, "Unknown");
socket.on("user-connected", (user) => {
  console.log("user name is " + user);
});

firebase
  .database()
  .ref(`/rooms/${roomid}/`)
  .once("value", function (snapshot) {
    tm.innerHTML = "";
    snapshot.forEach(function (message) {
      message.forEach(function (m) {
        let mbody = document.createElement("div");
        mbody.classList.add("message");
        mbody.innerHTML = `<strong>${m.val().username}:</strong> ${
          m.val().message
        }`;
        tm.append(mbody);
        tm.scrollTop = tm.scrollHeight;
      });
    });
  });

let send = document.querySelector("#send");
let delr = document.querySelector("#delr");
send.addEventListener("click", () => {
  if (roomid === "bot") {
    let messages = document.querySelector(".messages");
    let msg = document.querySelector("#msg");
    let username = document.querySelector("#username");
    let message = document.createElement("div");

    message.innerHTML = `<div class="message"><strong>${username.value}:</strong> ${msg.value}</div>`;
    messages.append(message);
    // socket.emit("message-sent", msg.value, username.value);
    messages.scrollTop = messages.scrollHeight;
    async function getData() {
      let resp = await fetch("http://localhost:5000/", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hello: msg.value }),
      });

      return resp;
    }
    let resp = getData();
    resp.then(function (response) {
      return response.text().then(function (text) {
        console.log(text);
        msg.value = "";
        let bm = document.createElement("div");
        bm.innerHTML = `<div class="message"><strong>[Bot]:</strong> ${text}</div>`;
        messages.append(bm);
        messages.scrollTop = messages.scrollHeight;
      });
    });
  } else {
    let messages = document.querySelector(".messages");
    let msg = document.querySelector("#msg");
    let username = document.querySelector("#username");
    let message = document.createElement("div");

    message.innerHTML = `<div class="message"><strong>${username.value}:</strong> ${msg.value}</div>`;
    messages.append(message);
    socket.emit("message-sent", msg.value, username.value);
    msg.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
});

socket.on("message-received", (msg, user) => {
  let messages = document.querySelector(".messages");
  let message = document.createElement("div");
  message.innerHTML = `<div class="message"><strong>${user}:</strong> ${msg}</div>`;
  messages.append(message);
  msg.value = "";
  messages.scrollTop = messages.scrollHeight;
});

delr.addEventListener("click", (e) => {
  firebase.database().ref("/rooms").child(roomid).remove();
  setTimeout(() => {
    location.href = "/rooms";
  }, 1000);
});
