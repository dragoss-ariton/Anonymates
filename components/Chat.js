//------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Chat-----------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/next.js/react necessárias para este código
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "../firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, where, query } from "firebase/firestore"
import { useRouter } from "next/router"

//importação de funções necessárias para este código
import getRecipientEmail from "./utils/getRecipientEmail"

//------------------------------------------------------------------------------------------------------------------

//Função do chat privado 
//Recebe o id e os utilizadores por parametro
function Chat({ id, users }) {

	//O Router do react é a biblioteca de roteamento do React.js que mantém a interface do utilizador sicronizado 
	//com o valor do URL
	const router = useRouter()

	//Cria a variavel q, para guardar os dados de uma consulta à base de dados na coleção users
	const q = query
	(
		//Nessa consulta, vão ser guardados os emails que já fizeram login pelo menos uma vez na aplicação
		collection(db, "users"),

		//Na função getRecipientEmail inserimos os utilizadores que obtivemos nos parametros e ainda o email
		//que temos na base de dados useAuthState retorna um array de 3, o primeiro é o utilizador, o segundo  
		//é o loading e o terceiro é o erro no nosso caso como queremos guardar o email vamos por 0 no useAuthState
		where("email", "==", getRecipientEmail(users, useAuthState(auth)[0]))
	)
	
	//Guarda os resultados da consulta em outra variável
	const [recipientsSnapshot] = useCollection(q)

	//Aqui irão ser guardados os emails dos utilizadores
	const recipientEmail = getRecipientEmail(users, useAuthState(auth)[0])

	//Aqui irão ser obtidos os dados do utilizador da base de dados
	const recipient = recipientsSnapshot?.docs?.[0]?.data()
	
	//Esta classe permite ao utilizador (A) abrir a conversa para falar com o utilizador(B)
	const enterChat = () => {

		//Recorremos ao useRouter para usar o router do next.js
		//Aqui o router.push permite como o próprio nome diz, empurrar a conversa, indicando a pasta chat e o id 
		router.push("/chat/" + id)
	}
	
	//O return é a "view" do projeto
	return (

		//Todo o css foi editado com o tailwind.css 
		<div
		
			//Se passarmos o rato por cima mostra como seria escrito no css normal
			className="flex items-center cursor-pointer break-words space-x-2 mb-2"
			
			//Ao clicar ira executar a função enterChat e abrirá o chat que o utilizador escolheu
			onClick={() => enterChat()}
		>

			{/*
			   -Aqui encontra-se um if e um else (? e :) que fazem com que a imagem caso não seja 
				encontrada vá aparecer a inicial do email num circulo
			   -Recepient são os dados dos utilizadores (B) 
			*/}
			{recipient ? (

				//Se forem encontrados então irá mostrar a imagem numa moldura cirular 
				<img

					//Recipiente.photoURL para ver a foto do email
					src={recipient?.photoURL}

					//Se passarmos o rato por cima mostra como seria escrito no css normal
					className="rounded-full bg-white w-10 h-10 object-contain"
				/>

			) : (

				//caso não sejam encontrados os dados irá aparecer uma moldura com a inicial do email
				<div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center 
				justify-center font-bold">
					
					{/*entre as chavetas encontramos um 0 pois é considerado o primeiro numero */}
					<span>{recipientEmail[0]}</span>
				
				</div>

			)}

			{/* Por fim mas não menos importante, temos o email dos utilizadores (B) que vão aparecer ao 
			lado da moldura circular*/}
			<span>{recipientEmail}</span>

		</div>
	)
}

//exportação da função
export default Chat