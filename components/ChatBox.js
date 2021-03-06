//------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------ChatBox-------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/next.js/react necessárias para este código
import { useState, useRef } from "react"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"
import TimeAgo from "timeago-react"
import {query, addDoc, setDoc, doc, where, collection, orderBy, serverTimestamp, } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

//importação de funções necessárias para este código
import getRecipientEmail from "../components/utils/getRecipientEmail" 
import Message from "./Message"

//importação de um icone
import { IoIosArrowBack, IoMdSend } from "react-icons/io"
//------------------------------------------------------------------------------------------------------------------

//Função ChatBox qu recebe por parametro o chat e as mensagens
const ChatBox = ({ chat, messages }) => {

	//Utiliza-se o useRef(null) porque a referência não é definida até que a função retorne e 
	//o conteúdo seja renderizado.
	const endOfMessagesRef = useRef(null)

	//O Router do react é a biblioteca de roteamento do React.js que mantém a interface do utilizador sicronizado 
	//com o valor do URL
	const router = useRouter()

	//Criação da variavel input e deixamos vazia com o useState
	const [input, setInput] = useState()

	//Criação da varivel user para guardar
	const [user] = useAuthState(auth)
	
	//Criação da variavel sendMessage  
	const sendMessage = (e) => {

		//Cancela o evento se for der para cancelar, sem parar a propagação do mesmo.
		e.preventDefault()

		//guarda os utilizadores que estão na base de dados
		const userCollection = collection(db, "users")

		//Atualiza a ultima vez visto na base de dados
		setDoc(

			//obtem os dados do utilizador
			doc(userCollection, user.uid),
			{

				//altura que o utilizador esteve presente
				lastSeen: serverTimestamp(),
			
			},

			// atualiza o ficheiro se existir
			{ merge: true } 

		)
		
		//Obtem as mensagens da conversa na base de dados
		const messageCollection = collection(
			db,
			"chats",
			router.query.id,
			"messages"
		)

		//adiciona a nova mensagem à base de dados
		addDoc(messageCollection, {
			
			//vai atualizar o email, como é o mesmo não vai haver alteração
			user: user.email,

			//vai atualizar o tempo
			timestamp: serverTimestamp(),

			//vai inserir a mensagem na base de dados
			text: input,

			//vai guardar a foto
			photoURL: user.photoURL,
		})

		//volta a por a caixa de texto vazia
		setInput("")

		//chamada da função scrollToBottom
		scrollToBottom()
	}

	//guarda o chat correto
	const chatRef = doc(db, "chats", router.query.id)

	//guarda as mensagens numa variavel por ordem ascendente
	const [messagesSnapshot] = useCollection(
		
		query(collection(chatRef, "messages"), orderBy("timestamp", "asc"))
	)

	//guarda o email do utilizador receptor
	const [recipientSnapshot] = useCollection(

		//para isso é feita uma consulta à coleção users
		query(
			
			collection(db, "users"),
			
			//onde o email do utilizador receptor no chat é guardado
			where(
				"email",
				"==",
				getRecipientEmail(JSON.parse(chat).users, user)
			)
		)
	)

	//Esta função permite dar scroll automaticamente até à mensagem mais recente
	const scrollToBottom = () => {
		endOfMessagesRef?.current?.scrollIntoView({
			behaviour: "smooth",
			block: "start",
		})
	}

	//função que mostra as mensagens 
	const showMessages = () => {
		
		//se as mensagens forem encontradas
		if (messagesSnapshot) {
			
			//a função irá retornar as mensagens desse chat
			return messagesSnapshot.docs.map((msg) => (
				
				//chamada do message
				<Message

					//atribui o id para a busca
					key={msg.id}

					//o utilizador
					user={msg.data().user}

					//e a mensagem
					message={{
	
						...msg.data(),
	
						timestamp: msg.data().timestamp?.toDate().getTime(),
	
					}}
		
				/>
			
			))
		
		//se atraves da variável messagesSnapshot não der certo então 
		} else {

			//converte a mensagem de json para string e recolhe todas as mensagens
			return JSON.parse(messages).map((msg) => (
				
				//apos ter encontrado a mensagem correta irão ser atribuidos os respetivos valores
				<Message key={msg.id} user={msg.user} message={{ ...msg }} />

			))
		}
	}

	//guarda as informações do utilizador receptor
	const recipient = recipientSnapshot?.docs?.[0]?.data()

	//guarda o email do utilizador receptor
	const recipientEmail = getRecipientEmail(JSON.parse(chat).users, user)


	return (

		//edição do grid no globals.css
		<div className="grid">

			{/* edição do cabeçalho */}
			<header className="flex items-center sticky bg-blue-800 top-0 z-10 justify-between 
			h-20 p-5">

				{/* botão para voltar para o menu principal */}
				<div onClick={() => router.push("/")}>

					{/* IoIosArrowBack é a imagem da seta */}
					<IoIosArrowBack className="w-8 h-8 cursor-pointer" />

				</div>

				{/* no cabeçalho é exibida a foto do receptor isto para que o utilizador saiba
				para quem está a mandar a mensagem*/}

				{/* aqui temos umacondição de if/ else (? e :)*/}
				<div className="flex items-center space-x-4">
					
					{/* se os dados do email receptor forem encontrados */}
					{recipient ? (

						//então irá ser retornada a imagem do utilizador
						<img

							//edição da moldura da imagem para ficar circular
							className="rounded-full bg-white w-10 h-10 object-contain"
							
							//exibição da foto da conta Google do utilizador
							src={recipient?.photoURL}

						/>

					//Caso os dados não sejam encontrados
					) : (
						
						//irá ser criada uma moldura circular com a inicial do email do receptor
						<div className="rounded-full bg-white w-10 h-10 text-gray-900 flex 
						items-center justify-center font-bold">

							{/* utiliza-se o 0 pois é considerado o primeiro caracter */}
							{recipientEmail[0]}

						</div>

					)}

					{/* Aqui irá ser exibida a ultima vez que o utilizador foi visto online */}
					<div className="flex flex-col">

						{/* exibição do email do utilizador */}
						<span className="text-sm">{recipientEmail}</span>

						{/* aqui temos umacondição de if/ else (? e :) */}
						{recipientSnapshot ? (

							//caso o email do utilizador receptor tenha sido encontrado
							<span className="text-xs">

								{/* irá dizer quando esteve ativo pela ultima vez */}
								Visto pela última vez:{" "}

								{/* para isso irá ser feita uma consulta na ultima vez ativo do utilizador*/}
								{recipient?.lastSeen?.toDate() ? (

									//Usamos a função do react e exibimos a altura
									<TimeAgo
										datetime={recipient?.lastSeen?.toDate()}
									/>

								//Caso o email do receptor não seja encontrado irá informar que está indisponível
								) : (

									"Indisponivel"
								)}

							</span>

						//Caso ainda esteja a procurar então irá informar ao utilizador que está a carregar
						) : (

							<p className="text-xs">A carregar visto pela última vez...</p>
						
						)}

					</div>

				</div>
				
				{/* Divisão criada para que o que estivesse no cabeçalho ficasse no meio */}
				<div className="flex items-center space-x-4">
					
				</div>
			
			{/* Fim do cabeçalho */}
			</header>
			

			{/* caixa das mensagens*/}
			<div className=" overflow-y-scroll flex flex-col p-5">
				
				{/* mostra as mensagens */}
				{showMessages()}

				{/* vai até ao as mensagens mais recentes */}
				<div className="mb-1" ref={endOfMessagesRef}>
					
					{/* usando a função scrollToBottom */}
					{scrollToBottom()}
				
				</div>
				
			</div>
				
			{/* Escrita da mensagem */}
			<div className="flex items-center justify-around gap-4 p-3 bg-blue-800">
				
				{/* Para isto foi criado um formulário */}
				<form className="flex items-center w-full space-x-4">
					
					{/* Input para escrever a mensagem */}
					<input

						//é identificado o tipo do input
						type="text"
						
						//é guardado o valor do input na variavel value
						value={input}

						//só permite o utilizador mandar a mensagem caso o input tenha um caracter
						onChange={(e) => setInput(e.target.value)}

						//no input está a dizer ao utilizador para escrever uma mensagem
						placeholder="Escreva uma mensagem..."
						
						//edições do input
						className="outline-0 border-0 rounded-3xl p-3 text-gray-900 w-full"
					/>
					
					{/* Botão para mandar a mensagem */}
					<button

						//o botão fica desativado caso o input seja null
						disabled={!input}

						//tipo de botão
						type="submit"

						//ao clicar irá executar a função para mandar a mensagem
						onClick={(e) => sendMessage(e)}
					>
						
						{/* ícone do botão */}
						<IoMdSend className="w-5 h-5" />
					
					</button>
					
				{/* fim do formulário */}
				</form>
				
				{/* Criação de um div para o botão e o input ficarem com um melhor pocisionamento */}
				<div className="flex items-center space-x-2">
					
				</div>

			</div>

		</div>

	)

}

//exportação da função
export default ChatBox
