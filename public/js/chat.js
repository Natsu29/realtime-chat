//taking messages element refrences.
let tm = document.querySelector(".messages");
//
let username = document.querySelector("#username");

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

socket.emit("join-room", roomid, username.value);
socket.on("user-connected", (user) => {
  console.log("user name is " + user);
});



//loading pervious message when a room is open.
firebase
  .database()
  .ref(`/rooms/${roomid}/`)
  .once("value", function (snapshot) {
    tm.innerHTML = "";
    snapshot.forEach(function (messages) {
      messages.forEach(function (message) {
        let cdata = message.val();  
        tm.innerHTML += `<div class="message"> <strong>${cdata.username}</strong>: ${cdata.message}</div>`;
        tm.scrollTop = tm.scrollHeight;
      });
    });
  });


// send message with username to the server and then saves to database.
let send = document.querySelector("#send");

//accessign delR button in the code.
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
     messages.innerHTML += `<div class="message"><strong>${username.value}:</strong> ${msg.value}</div>`;

     //send message to the server.
    socket.emit("message-sent", msg.value, username.value);
    msg.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
});


// message recieved form server.
socket.on("message-received", (msg, user) => {
  let messages = document.querySelector(".messages");
  messages.innerHTML += `<div class="message"><strong>${user}:</strong> ${msg}</div>`;
  messages.scrollTop = messages.scrollHeight;
});



//delete room from database.
delr.addEventListener("click", (e) => {
  firebase.database().ref("/rooms").child(roomid).remove();
  setTimeout(() => {
    location.href = "/rooms";
  }, 1000);
});
