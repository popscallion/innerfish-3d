import firebase from 'firebase/app'
import 'firebase/functions';

const config = {
  apiKey: "AIzaSyCz9H68b_UWHDsOamyn1jT_NoQ1nmqXs-E",
  authDomain: "innerfish-3d.firebaseapp.com",
  projectId: "innerfish-3d",
  storageBucket: "innerfish-3d.appspot.com",
  messagingSenderId: "811152105312",
  appId: "1:811152105312:web:75c643e9a8ccb57b8c8805"
};

firebase.initializeApp(config)

export default firebase
