import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"

function LoginPage() {
	const signIn = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				// const credential = GoogleAuthProvider.credentialFromResult(result);
				// const token = credential.accessToken;
				// The signed-in user info.
				// const user = result.user;
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code
				const errorMessage = error.message
				// The email of the user's account used.
				const email = error.email
				// The AuthCredential type that was used.
				// const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			})
	}

	return (
		<div className="max-w-7xl mx-auto">
			<div className="grid">
				<div className="flex items-center justify-between p-5">
					<h1 className="text-xl font-semibold">Anonymates</h1>
					<button
						onClick={signIn}
						className="bg-white w-[100px] h-[100px] rounded-full flex justify-center items-center font-bold text-gray-900 cursor-pointer"
					>
						Login
					</button>
				</div>
				<div className="flex justify-center items-center p-3">
					<img src="/login.svg" alt="" />
				</div>
			</div>
		</div>
	)
}

export default LoginPage
