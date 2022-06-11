//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Chat-------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/next.js/react necessários para este código
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "../firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, where, query } from "firebase/firestore"
import { useRouter } from "next/router"

//Importação de uma função
import getRecipientID from "./utils/getRecipientID"

//importação de um icone ícone 
import {BsFillPersonFill} from "react-icons/bs"

//--------------------------------------------------------------------------------------------------------------------------------

//Função do chat privado 
//Recebe o id e os utilizadores da base de dados para mostrar todos os utilizadores
function Chat({ id, users}) {

	const [userLoggedIn] = useAuthState(auth)

	//...
	const router = useRouter()
	
	//Esta classe permite ao utilizador (A) abrir a conversa para falar com o utilizador(B)
	const enterChat = () => {

		//Aqui o router.push permite como o próprio nome diz, puxar a conversa para os chats(pasta) e o id(ficheiro) 
		router.push("/chats/" + id)
	}
	const DefineUser = () => {
	if(userLoggedIn.uid === users[1]) {
		return(   
		<span>Utilizador({users[0]})</span>)};
		
	if(userLoggedIn.uid === users[0]){
		return(
			<span>Utilizador({users[1]})</span>)};
	}
	//O return é a "view" do projeto
	return (

		//Todo o css foi editado com o tailwind.css 
		<div
			//Se passarmos o rato por cima mostra como seria escrito no css normal
			className="flex items-center cursor-pointer break-words space-x-2 mb-2"
			
			//Ao clicar ira executar a função enterChat e abrirá o chat que o utilizador escolheu na página principal
			onClick={() => enterChat()}
		>
				<div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center justify-center font-bold">
					
					{/* icone do utilizador */}
					<BsFillPersonFill className="w-10 h10" />

				</div>
			{/* Por fim mas não menos importante, temos o ID do utilizador (B)*/}
			<DefineUser/>
		</div>
	)
}

//exportação da função
export default Chat