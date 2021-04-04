import * as firebase from 'firebase';


// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAHjEeND09lQd7TjLngzko_SKr72B67BD0',
  authDomain: 'fir-with-ios-50934.firebaseapp.com',
  databaseURL: 'https://fir-with-ios-50934.firebaseio.com',
  projectId: 'fir-with-ios-50934',
  storageBucket: 'fir-with-ios-50934.appspot.com',
  messagingSenderId: '413908352592',
  appId: '1:413908352592:web:6761b9c345512f8ac41b55',
};



export default Firebase = firebase.initializeApp(firebaseConfig);
