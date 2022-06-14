//------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------[id].js--------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/react necessárias para este código
import { db, auth } from "../../firebase.js"
import { doc, getDoc, collection, orderBy, getDocs } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"

//importação de funções criadas
import Head from "next/head"
import ChatBoxID from "../../components/ChatBoxID"

//------------------------------------------------------------------------------------------------------------------

//função chat que recebe o chat e as mensagens
function Chat({ chat, messages }) {

	//guarda a autenticação do utilizdor
	const [user] = useAuthState(auth)

	return (
		<>
			{/* titulo do separador */}
			<Head>		
						
				<title>

					Conversar com...
				
				</title>
			
			</Head>

			{/* executa a função chatboxID mandando por parametro o chat e as mensagens*/}
			<ChatBoxID chat={chat} messages={messages} />
		</>
	)
}
//exportação da função
export default Chat

//função para exportar as mensagens para o lado servidor
export async function getServerSideProps(context) {

	//variável para guardar o id do chat
	const chatRef = doc(db, "AN-chats", context.query.id)

	//põe as mensagens por ordem ascendente
	const chatDoc = await getDoc(chatRef, orderBy("timestamp", "asc"))

	//obtem o id e o email
	const chat = {
		id: chatDoc?.id,
		...chatDoc?.data(),
	}

	//guarda as mensagens do chat que tem o id do chatRef
	const querySnapshot = await getDocs(collection(chatRef, "AN-messages"))

	//cria a variável mensagens vazia
	const messages = []

	//Extração de todas as mensagens da base de dados para a variavel menssages
	querySnapshot.forEach((doc) => {

		messages.push({
		
			id: doc.id,
		
			timestamp: doc.data().timestamp?.toDate().getTime(),
		
			...doc.data(),
		
		})
	
	})

	//retorna o props que contém o chat e as mensagens
	return {

		props: {
			
			chat: JSON.stringify(chat),
			
			messages: JSON.stringify(messages),
		
		},
	}
}
