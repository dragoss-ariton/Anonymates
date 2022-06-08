//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------ChatBox----------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação dos pacotes necessários para este código
import { useState, useRef } from "react"
import { IoIosArrowBack, IoMdSend } from "react-icons/io"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"
import {
	query,
	addDoc,
	setDoc,
	doc,
	where,
	collection,
	orderBy,
	serverTimestamp,
} from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import getRecipientEmail from "../components/utils/getRecipientEmail"
import TimeAgo from "timeago-react"
import MessageID from "./MessageID"
import {BsFillPersonFill} from "react-icons/bs"

//--------------------------------------------------------------------------------------------------------------------------------

const ChatBoxID = ({ chat, messages }) => {
	const endOfMessagesRef = useRef(null)

	const router = useRouter()
	const [input, setInput] = useState()
	const [user] = useAuthState(auth)

	const sendMessage = (e) => {
		e.preventDefault()

		const userCollection = collection(db, "users")

		// update last seen
		setDoc(
			doc(userCollection, user.uid),
			{
				lastSeen: serverTimestamp(),
			},
			{ merge: true } // update fields if exists
		)
		const messageCollection = collection(
			db,
			"AN-chats",
			router.query.id,
			"AN-messages"
		)
		addDoc(messageCollection, {
			user: user.email,
			timestamp: serverTimestamp(),
			text: input,
			photoURL: user.photoURL,
		})

		setInput("")
		scrollToBottom()
	}

	const chatRef = doc(db, "AN-chats", router.query.id)
	// returns something even if no data is found
	const [messagesSnapshot] = useCollection(
		query(collection(chatRef, "AN-messages"), orderBy("timestamp", "asc"))
	)
	const [recipientSnapshot] = useCollection(
		query(
			collection(db, "users"),
			where(
				"email",
				"==",
				getRecipientEmail(JSON.parse(chat).users, user)
			)
		)
	)

	const scrollToBottom = () => {
		endOfMessagesRef?.current?.scrollIntoView({
			behaviour: "smooth",
			block: "start",
		})
	}

	const showMessages = () => {
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((msg) => (
				<MessageID
					key={msg.id}
					user={msg.data().user}
					message={{
						...msg.data(),
						timestamp: msg.data().timestamp?.toDate().getTime(),
					}}
				/>
			))
		} else {
			// server-side rendered
			return JSON.parse(messages).map((msg) => (
				<MessageID key={msg.id} user={msg.user} message={{ ...msg }} />
			))
		}
	}

	// chat is in json format
	// console.log(JSON.parse(chat).users)

	const recipient = recipientSnapshot?.docs?.[0]?.data()
	const recipientEmail = getRecipientEmail(JSON.parse(chat).users, user)

	return (
		<div className="grid">
			<header className="flex items-center sticky bg-blue-900 top-0 z-10 justify-between h-20 p-5">
				<div onClick={() => router.push("/")}>
					<IoIosArrowBack className="w-8 h-8 cursor-pointer" />
				</div>
				<div className="flex items-center space-x-4">

                <div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center justify-center font-bold object-contain">
					
					<BsFillPersonFill/>
				
				</div>

					<div className="flex flex-col">
						<span className="text-sm">{user.user}</span>
						{recipientSnapshot ? (
							<span className="text-xs">
								Visto pela última vez:{" "}
								{recipient?.lastSeen?.toDate() ? (
									<TimeAgo
										datetime={recipient?.lastSeen?.toDate()}
									/>
								) : (
									"Indisponivel ;)"
								)}
							</span>
						) : (
							<p className="text-xs">Carregando visto pela última vez...</p>
						)}
					</div>
				</div>
				<div className="flex items-center space-x-4">
					
				</div>
			</header>

			{/* msg container */}
			<div className=" overflow-y-scroll flex flex-col p-5">
			
				{showMessages()}
				{/* scrolls to bottom trick*/}
				<div className="mb-1" ref={endOfMessagesRef}>
					{scrollToBottom()}
				</div>
				
			</div>

			{/* input container */}
			<div className="flex items-center justify-around gap-4 p-3 bg-blue-900">
			

				<form className="flex items-center w-full space-x-4">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Escreva uma mensagem..."
						className="outline-0 border-0 rounded-3xl p-3 text-gray-900 w-full"
					/>
					<button
						disabled={!input}
						type="submit"
						onClick={(e) => sendMessage(e)}
					>
						<IoMdSend className="w-5 h-5" />
					</button>
				</form>

				<div className="flex items-center space-x-2">
					
				</div>
			</div>
		</div>
	)
}

export default ChatBoxID
