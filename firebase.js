//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Firebase.js-------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase necessárias para este código
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

//---------------------------------------------------------------------------------------------------------------------

//Configuração do firebase na aplicação web
const firebaseConfig = {
	apiKey: "AIzaSyA17d5_oWcRtYxlggyae6AinQr_kYtAbe8",
	authDomain: "chat-app-1cd2d.firebaseapp.com",
	projectId: "chat-app-1cd2d",
	storageBucket: "chat-app-1cd2d.appspot.com",
	messagingSenderId: "29954922602",
	appId: "1:29954922602:web:34da8ef94237d1f6205213"
  };

// Inicia o Firebase
const app = initializeApp(firebaseConfig)

//base de dados vai ser o firestore do firebase
const db = getFirestore(app)

//obtem a autenticação
const auth = getAuth()

//utilização do provider da google para o login
const provider = new GoogleAuthProvider()

//exporta a base de dados, a autenticação e o provider
export { db, auth, provider }