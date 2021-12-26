let db;
let currentRoomId;
let myId = 0;
const createRow = (id, msg) => {
  return `
    <tr>
      <td>${id}</td>
      <td>${msg}</td>
    </tr>
  `;
};
const updateMessageBody = (data) => {
  document.getElementById('msgBody').innerHTML = '';
  const reducer = (previousValue, id) => previousValue + createRow(id, data[id]);
  document.getElementById('msgBody').innerHTML = Object.keys(data).reduce(reducer, '')

};
const handleChange = (ev) => {
  const roomRef = db.collection('rooms').doc(`${currentRoomId}`);
  const msg = document.getElementById('sendMessage').value;
  roomRef.update({
    [myId]: msg
  });
};
const copyToClipboard = () => {
  navigator.clipboard.writeText(document.location.href);
};
const createChannel = async () => {
  const roomRef = await db.collection('rooms').add({
    0: ''
  });
  console.log('step 1: offer created and updated');

  const roomId = roomRef.id;
  currentRoomId = roomId;
  const shareUrl = window.location.href + `?roomId=${roomId}`;
  window.history.replaceState(null, null, `?roomId=${roomId}`);
  document.getElementById('link').innerHTML = `
    ${shareUrl}
    <button onclick="copyToClipboard()">Copy</button>
  `;
  document.getElementById('createChannel').style.display = 'none';
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    updateMessageBody(data);
  });
}

const joinChannel =  async () => {
  const roomId = window.location.search.split('=')[1];
  currentRoomId = roomId;
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  if (roomSnapshot.exists) {
    const data = roomSnapshot.data();
    updateMessageBody(data);
    myId = Object.keys(data).length;
  }
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    updateMessageBody(data);
  });
}


const initDbConnection = () => {
  var firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "fir-rtc-8e4b2.firebaseapp.com",
    databaseURL: "https://fir-rtc-8e4b2.firebaseio.com",
    projectId: "fir-rtc-8e4b2",
    storageBucket: "fir-rtc-8e4b2.appspot.com",
    messagingSenderId: "messageSenderId",
    appId: "appId",
    measurementId: "mesID"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  db = firebase.firestore();
}

(function () {
  initDbConnection();
  window.location.search.split('=')[1] && joinChannel();
})();

window.onload = function(){
  window.location.search.split('=')[1] && (document.getElementById('createChannel').style.display = 'none');
};
