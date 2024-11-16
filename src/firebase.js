import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDt3FxzF1AJwPOi8G5nOl9DgILtkqyQMYU",
  authDomain: "book--cart.firebaseapp.com",
  projectId: "book--cart",
  storageBucket: "book--cart.appspot.com",
  messagingSenderId: "1011235815575",
  appId: "1:1011235815575:web:34fc3c830a2e3338c7e9d2",
  measurementId: "G-PQVMKEHZ0R",
};



// new firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCmVt5YrrfWViuDP_7JiuUZ4bV6okTD2tA",
//   authDomain: "bookstore-be145.firebaseapp.com",
//   projectId: "bookstore-be145",
//   storageBucket: "bookstore-be145.firebasestorage.app",
//   messagingSenderId: "44364341413",
//   appId: "1:44364341413:web:2adedb91e7c51061e46d4c",
//   measurementId: "G-M37P0516HW"
// };


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);
const storage = getStorage(app);

const signInWithGoogle = () => {
  console.log("signInWithGoogle");
  return signInWithPopup(auth, provider);
};

const logOut = () => {
  return signOut(auth);
};

export { auth, signInWithGoogle, logOut, db, storage };






