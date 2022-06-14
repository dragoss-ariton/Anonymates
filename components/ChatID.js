//------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------ChatID-------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/next.js/react necessárias para este código
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { useRouter } from "next/router"

//importação de um icone
import {BsFillPersonFill} from "react-icons/bs"

//------------------------------------------------------------------------------------------------------------------

//Função do chat privado 
//Recebe o id e os utilizadores da base de dados para mostrar todos os utilizadores
function Chat({ id, users}) {

	//Determina os dados do utilizador com a sessão ativa
	const [userLoggedIn] = useAuthState(auth)

	//O Router do react é a biblioteca de roteamento do React.js que mantém a interface do utilizador sicronizado 
	//com o valor do URL
	const router = useRouter()
	
	//Esta classe permite ao utilizador (A) abrir a conversa para falar com o utilizador(B)
	const enterChat = () => {

		//Aqui o router.push permite como o próprio nome diz, puxar a conversa para os chats(pasta) e o id 
		router.push("/chats/" + id)
	
	}
	
	//função para definir o utilizador para ser mostrado
	const DefineUser = () => {
	
	//verifica se o utilizador(A) for igual ao utilizador 1 na base de dados
	if(userLoggedIn.uid === users[1]) {

		//e irá retornar o utilizador receptor do chat
		return(   
		<span>Utilizador({users[0]})</span>)
	
	};

	//verifica se o utilizador(A) for igual ao utilizador 0 na base de dados 
	if(userLoggedIn.uid === users[0]){

		//irá retornar o utilizador receptor do chat
		return(
			<span>Utilizador({users[1]})</span>)};
			
	}

	//O return é a "view" do projeto
	return (

		//Todo o css foi editado com o tailwind.css 
		<div
			
			//Se passarmos o rato por cima mostra como seria escrito no css normal
			className="flex items-center cursor-pointer break-words space-x-2 mb-2"
			
			//Ao clicar ira executar a função enterChat e abrirá o chat que o utilizador escolheu na página 
			//principal
			onClick={() => enterChat()}
		>
				
				{/* Criação de uma moldura circular */}
				<div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center 
				justify-center font-bold">
					
					{/* icone de uma pessoa */}
					<BsFillPersonFill className="w-10 h10" />

				</div>

			{/* Por fim mas não menos importante, temos a chamada da função define user  que irá mostrar o id 
			do utilizador receptor*/}
			<DefineUser/>
		
		</div>

	)

}

//exportação da função
export default Chat