//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Chat-------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação dos pacotes necessários para este código
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "../firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, where, query } from "firebase/firestore"
import { useRouter } from "next/router"
import getRecipientEmail from "./utils/getRecipientEmail"

//--------------------------------------------------------------------------------------------------------------------------------

//Função do chat privado 
//Recebe o id e os utilizadores da base de dados para mostrar todos os utilizadores
function Chat({ id, users }) {

	//...
	const router = useRouter()

	//Cria a variavel q, para guardar os dados de uma consulta à base de dados na coleção users
	const q = query
	(
		//Nessa consulta, vão ser retirados os emails que já fizeram login pelo menos uma vez
		collection(db, "users"),

		//useAuthState retorna um array de 3, o primeiro é o utilizador, o segundo é o loading e o terceiro é o erro
		//no nosso caso como queremos guardar os emails vamos por o 0 no useAuthState
		where("email", "==", getRecipientEmail(users, useAuthState(auth)[0]))
	)
	
	//Guarda os utilizadores para as proximas instruções
	const [recipientsSnapshot] = useCollection(q)

	//Aqui irão ser guardados os emails dos utilizadores
	//useAuthState retorna um array de 3, o primeiro é o utilizador, o segundo é o loading e o terceiro é o erro
	const recipientEmail = getRecipientEmail(users, useAuthState(auth)[0])

	//Aqui irão ser guardados os dados dos outros utilizadores, por exemplo o id
	const recipient = recipientsSnapshot?.docs?.[0]?.data()
	
	//Esta classe permite ao utilizador (A) abrir a conversa para falar com o utilizador(B)
	const enterChat = () => {

		//Recorremos ao useRouter para usar o router do next.js
		//Aqui o router.push permite como o próprio nome diz, puxar a conversa, indicando o chat e o id 
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
				<div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center justify-center font-bold">
					
					{/*entre as chavetas encontramos um 0 pois é considerado o primeiro numero */}
					<span>{recipientEmail[0]}</span>
				
				</div>

			)}

			{/* Por fim mas não menos importante, temos o email dos utilizadores (B) que vai aparecer ao lado da moldura circular*/}
			<span>{recipientEmail}</span>

		</div>
	)
}

//exportação da função
export default Chat