let db;
let currentRoomId;
let myId = 0;

document.getElementById('sendMessage').onchange(ev => {
    const roomRef = db.collection('rooms').doc(`${currentRoomId}`);
    console.log(ev.target.value);
    roomRef.update({
      [myId]: ev.target.value
    });
})

const createChannel = async () => {
  const roomRef = await db.collection('rooms').add({
    0: ''
  });
  connection.setLocalDescription(offer)
  console.log('step 1: offer created and updated');

  const roomId = roomRef.id;
  currentRoomId = roomId;
  document.getElementById('link').innerText = window.location.href + `?roomId=${roomId}`;

  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    console.log(data);
  });
}

const joinChannel =  async () => {
  const roomId = window.location.search.split('=')[1];
  currentRoomId = roomId;
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  if (roomSnapshot.exists) {
    const data = roomSnapshot.data();
    console.log(data);
    myId = Object.keys(data).length;
  }
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    console.log(data);
  });
}


const initDbConnection = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyDdzhAHhMQeAo4egpTbj3K-JiuV_InAFkU",
    authDomain: "fir-rtc-8e4b2.firebaseapp.com",
    databaseURL: "https://fir-rtc-8e4b2.firebaseio.com",
    projectId: "fir-rtc-8e4b2",
    storageBucket: "fir-rtc-8e4b2.appspot.com",
    messagingSenderId: "159303557727",
    appId: "1:159303557727:web:2ae59edac452b77736b1ea",
    measurementId: "G-FWJYK5VF1B"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  db = firebase.firestore();
}

(function () {
  createConnection();
  initDbConnection();
  window.location.search.split('=')[1] && joinChannel();
})();