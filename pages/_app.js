import { useEffect } from "react"
import "../styles/globals.scss"
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "../firebase"
import Login from "./loginPage"
import Loading from "../components/Loading"
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore"

function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth)

	useEffect(() => {
		if (user) {
			const c = collection(db, "users")

			setDoc(
				doc(c, user.uid),
				{
					ID: user.uid,
					email: user.email,
					lastSeen: serverTimestamp(),
					photoURL: user.photoURL,
				},
				{ merge: true } // update fields if exists
			)
		}
	}, [user])

	if (loading) return <Loading />
	if (!user) return <Login />
	return <Component {...pageProps} />
}

export default MyApp
