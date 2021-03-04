import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

let firebaseConfig = {
  apiKey: "AIzaSyBRD-qUE5wU2ZrJGLjPXAkq5kA2mUCw-wQ",
  authDomain: "react-redux-graphql-84a21.firebaseapp.com",
  projectId: "react-redux-graphql-84a21",
  storageBucket: "react-redux-graphql-84a21.appspot.com",
  messagingSenderId: "739189019384",
  appId: "1:739189019384:web:bb7e59b44a85e9f38ee10d",
  measurementId: "G-RMLMZ8SR5V",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore().collection("favs");

export function getFavs(uid) {
  return db
    .doc(uid)
    .get()
    .then((snap) => {
      return snap.data().array;
    });
}

export function updateDB(array, uid) {
  return db.doc(uid).set({ array });
}

export function signOutGoogle() {
  firebase.auth().signOut();
}

export function loginWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((snapshot) => snapshot.user);
}
