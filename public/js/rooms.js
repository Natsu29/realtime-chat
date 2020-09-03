// Your web app's Firebase configuration
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

let createroom = document.getElementById("croom");
let ul_container = document.getElementById("ulcontainer");

firebase
  .database()
  .ref("/rooms")
  .on("value", function (snapshot) {
    ul_container.innerHTML = "";
    snapshot.forEach(function (cval) {
      let ckey = cval.key;
      let cdata = cval.val();
      let link = document.createElement("a");
      link.id = cdata.room_id;
      link.innerText = cdata.room_name;
      link.href = "/chat/" + cdata.room_id;
      link.classList.add("list-item");
      ul_container.append(link);
    });
  });

createroom.addEventListener("click", function () {
  let room_name = prompt("Entre the room name");
  let obj = {
    room_id: "",
    room_name: room_name,
  };
  let key = firebase.database().ref("/rooms").push().key;
  obj.room_id = key;
  firebase.database().ref("/rooms").child(key).set(obj);
});
