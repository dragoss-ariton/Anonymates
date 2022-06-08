import Head from "next/head"
import ChatBoxID from "../../components/ChatBoxID"
import { db, auth } from "../../firebase.js"
import { doc, getDoc, collection, orderBy, getDocs } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import getRecipientID from "../../components/utils/getRecipientID.js"

function Chat({ chat, messages }) {
	const [user] = useAuthState(auth)

	// console.log(chat, messages)

	return (
		<>
			<Head>				
				<title>
					Conversar com{" "}
					{chat.users && getRecipientID(chat.users, user)}
				</title>
			</Head>

			
			<ChatBoxID chat={chat} messages={messages} />
		</>
	)
}
export default Chat

export async function getServerSideProps(context) {
	const chatRef = doc(db, "AN-chats", context.query.id)

	// prepare the messages on the server
	const chatDoc = await getDoc(chatRef, orderBy("timestamp", "asc"))

	const chat = {
		id: chatDoc?.id,
		...chatDoc?.data(),
	}

	// console.log(chat)

	const querySnapshot = await getDocs(collection(chatRef, "AN-messages"))

	const messages = []

	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		// console.log(doc.id, " => ", doc.data());
		messages.push({
			id: doc.id,
			timestamp: doc.data().timestamp?.toDate().getTime(),
			...doc.data(),
		})
	})

	// console.log(messages);

	return {
		props: {
			chat: JSON.stringify(chat),
			messages: JSON.stringify(messages),
		},
	}
}
