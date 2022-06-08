//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Message----------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação dos pacotes necessários para este código
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase.js"
import moment from "moment"

//--------------------------------------------------------------------------------------------------------------------------------

function Message({ user, message }) {
	const [userLoggedIn] = useAuthState(auth)

	return (
		<div className="flex mb-4">
			
			{user === userLoggedIn.email ? (
				<div className="ml-auto bg-blue-500 rounded-full text-white">
				<div className="flex items-center space-x-2 w-fit py-1 px-3">
					<span className="text-sm">{message.text}</span>
					<span className="text-xs">
						{message.timestamp
							? moment(message.timestamp).format("LT")
							: "Agora mesmo"}
					</span>
				</div>
			</div>
			) : (
				<div className="bg-white rounded-full text-gray-900 text-left">
					<div className="flex items-center space-x-2 w-fit py-1 px-3">
						<span className="text-sm">{message.text}</span>
						{/* <span className="text-xs">{timestamp}</span> */}
						<span className="text-xs">
							{message.timestamp
								? moment(message.timestamp).format("LT")
								: "Agora mesmo"}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default Message
