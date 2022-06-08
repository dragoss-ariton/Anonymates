import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
	apiKey: "AIzaSyA17d5_oWcRtYxlggyae6AinQr_kYtAbe8",
	authDomain: "chat-app-1cd2d.firebaseapp.com",
	projectId: "chat-app-1cd2d",
	storageBucket: "chat-app-1cd2d.appspot.com",
	messagingSenderId: "29954922602",
	appId: "1:29954922602:web:34da8ef94237d1f6205213",
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth()
const provider = new GoogleAuthProvider()

export { db, auth, provider }
