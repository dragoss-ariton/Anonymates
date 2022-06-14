//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------Message--------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/next.js/react necessárias para este código
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase.js"
import moment from "moment"

//---------------------------------------------------------------------------------------------------------------------

//a função message recebe o utilizador e a mensagem 
function Message({ user, message }) {

	//obtem o utilizador que está a utilizar a aplicação
	const [userLoggedIn] = useAuthState(auth)

	return (

		<div className="flex mb-4">
			
			{/* Se o utilizador recebido por parametro for igual ao que está a usar a aplicação */}
			{user === userLoggedIn.email ? (

				//então as mensagens enviadas por ele irão ser exibidas no lado direito com o fundo azul
				<div className="ml-auto bg-blue-500 rounded-full text-white">

				<div className="flex items-center space-x-2 w-fit py-1 px-3">
					
					{/* Mensagem do utilizador */}
					<span className="text-sm">{message.text}</span>
					
					<span className="text-xs">
						
						{/* hora em que a mensagem foi enviada */}
						{message.timestamp

							//informa a altura
							? moment(message.timestamp).format("LT")
								
							//se o utilizador enviou na mesma altura que o recptor está 
							//a vizualizar a mensagem então irá ser informado que foi 
							//naquele momento 	
							: "Agora mesmo"}
					
					</span>
				
				</div>
			
			</div>
			
			) : (
				
				//se as mensagens forem do outro utilizador então irão ser exibidas no lado 
				//esquerdo com o fundo branco
				<div className="bg-white rounded-full text-gray-900 text-left">
					
					<div className="flex items-center space-x-2 w-fit py-1 px-3">
					
						{/* Mensagem do utilizador */}
						<span className="text-sm">{message.text}</span>
						
						<span className="text-xs">
							
							{/* hora em que a mensagem foi enviada */}
							{message.timestamp
								
								//informa a altura
								? moment(message.timestamp).format("LT")
								
								//se o utilizador enviou na mesma altura que o recptor está 
								//a vizualizar a mensagem então irá ser informado que foi 
								//naquele momento 
								: "Agora mesmo"}
						
						</span>
					
					</div>
				
				</div>
			
			)}
		
		</div>
	
	)

}

//exportação da função
export default Message