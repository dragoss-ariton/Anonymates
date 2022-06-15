//------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Sidebar--------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/react/node necessárias para este código
import React, { useState, useEffect, Component } from "react";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth } from "../firebase";
import { collection, addDoc, where, query, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";
import moment from "moment";

//importação de funções criadas
import Chat from "./Chat";
import ChatID from "./ChatID";

//importação dos ícones utilizados
import { BsChatLeftTextFill} from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { CgMoreO } from "react-icons/cg"
import { BiDoorOpen } from "react-icons/bi"

//------------------------------------------------------------------------------------------------------------------

//Função responsável pela apresentação do menu
function Sidebar() {
  
  //Preenche a variavel user com os dados da base de dados
  const [user] = useAuthState(auth);

  //realização de uma consulta para obter as conversas do utilizador
  const q = query(
    
    //entra na coleção chats
    collection(db, "chats"),

    //e de seguida procura pelo email do utilizador na coleção
    where("users", "array-contains", user.email)

  );
  
  //os chats do utilizador são guardados na variável chatsSnapshot
  const [chatsSnapshot] = useCollection(q);
  
  //criação de um chat através do email
  const createChat = () => {
    
    //é pedido ao utilizador para inserir o email com que deseja inciar uma conversa
    const input = prompt(

      //mensagem que vai parecer para o utilizador
      "Por favor insira um email de um utilizador com que deseja falar: "
    
    );

    //se o input não for preenchido então a função não retorna nada
    if (!input) return null;

    //validações necessárias para criar um novo chat
    if (

      //Se o email não se encontrar na base de dados e se o email for verdadeiro, então o chat vai ser criado
      EmailValidator.validate(input) &&

      //não pode haver outro chat com o mesmo utilizador
      !chatAlreadyExists(input) &&

      //o email não pode ser o seu proprio
      input !== user.email
    
      ) {

      //se a coleção chats não for encontrada então irá ser criada uma nova
      const c = collection(db, "chats");

      //O addDoc permite a Cloud Firestore generar um ID automaticamente
      addDoc(c, {

        //O email é guardado
        users: [user.email, input],

      });

      //mensagem de chat criado com sucesso
      alert("Novo chat criado!");

    } else {

      //caso as validações não tenham dado conforme o requerido aparecerá uma mensagem de email inválido
      alert("Email inválido");

    }

  };

  //função que verifica se o chat já tinha sido criado através do email
  const chatAlreadyExists = (recipientEmail) =>

  // retorna verdadeiro ou falso caso encontre ou não o chat com outro email
  !!chatsSnapshot?.docs.find((chat) =>
    chat.data().users.find((user) => user === recipientEmail)
  
);

  //realização de uma consulta para obter os chats do utilizador
  const c = query(

    //entra na coleção AN-chats
    collection(db, "AN-chats"),

    //e de seguida procura pelo id do utilizador na coleção
    where("users", "array-contains", user.uid)

  );

  //os chats do utilizador são guardados numa variável
  const [ANchats] = useCollection(c);

    //criação de um chat através do ID
    const createChatID = () => {

      //é pedido ao utilizador para inserir o email com que deseja inciar uma conversa
      const input = prompt(

        //mensagem que vai parecer para o utilizador
        "Por favor insira um id de um utilizador com que deseja falar: "

      );

      //se o input não for preenchido então a função não retorna nada
      if (!input) return null;

      //validações necessárias para criar um novo chat
      if (

        //não pode haver outro chat com o mesmo utilizador
        !chatAlreadyExistsID(input) &&

        //o ID não pode ser o seu proprio
        input !== user.uid

        ) {

        //se a coleção AN-chats não for encontrada então irá ser criada uma nova
        const d = collection(db, "AN-chats");
  
        //O addDoc permite a Cloud Firestore generar um ID automaticamente
        addDoc(d, {

          //O ID é guardado
          users: [user.uid, input], // sender and recepient

        });
        
        //mensagem de chat criado com sucesso
        alert("Novo chat criado!");

      } else {

        //caso as validações não tenham dado conforme o requerido aparecerá uma mensagem de id inválido
        alert("ID inválido");
      
      }

    };

    //função que verifica se o chat já tinha sido criado através do ID
    const chatAlreadyExistsID = (recipientID) =>

      // retorna verdadeiro ou falso caso encontre ou não o chat com outro ID
      !!ANchats?.docs.find((chat) =>
        chat.data().users.find((user) => user === recipientID)
      
    );
  
    //função responsável pelo botão que mostra/esconde elementos
    class ChatRoom extends Component{

      //O construtor serve para criar e inicializar o objeto criado a partir da classe.
      constructor(){
      
      //o super terá de ser atribuido antes do this para não ocorrer um erro de referência
      super()
      
      //o valor começa como falso para não exibir o chat publico
      //quando o utilizador acessar a página principal
      this.state={
        showMe: false
      }

    }

    //esta função permite mudar o valor para verdadeiro ou falso
    //dependendo do valor atual
    operation()
    
    {
      
      //Atualização do valor 
      this.setState({
        
        //para o contrário do que está no momento
        showMe:!this.state.showMe
      })
    
    }

    //renderiza os elementos
    render(){
      
      return(
        
        <div>

          {/* ao clicar nesta divisão ira executar a função para alterar o valor do this */}
          <div className="flex space-x-2" onClick={()=>this.operation()}>
          
          {/* icone e respetivas edições */}
          <CgMoreO className=" cursor-pointer w-10 h-10 space-y-2"/>
          
          {/* Botão chat publico */}
          <button> Chat público </button></div>
          
          <div>⠀</div>
          
          {/* Se o valor for verdadeiro */}
          { this.state.showMe ? (
            
            <div className="space-y-2">
              
              {/* Então irá executar a função do chat publico */}
              <PublicChat />

              <div>⠀</div>
          
            </div>
          
          // senão fica vazio
          ) : (null)

          }

        </div>
      
      )
    
    }

  }

  //Função responsável por esconder/mostrar texto
  class UserId2 extends Component{

    //O construtor serve para criar e inicializar o objeto criado a partir da classe
    constructor(){
    
      //o super terá de ser atribuido antes do this para não ocorrer um erro de referência
      super()
      
      //o valor começa como falso para não exibir o id do utilizador
      //quando o utilizador acessar a página principal
      this.state={
        showMe: false
      }
    
    }
    
    //esta função permite mudar o valor para verdadeiro ou falso
    //dependendo do valor atual
    operation()
    
    {
      
      //Atualização do valor 
      this.setState({

        //para o contrário do que está no momento
        showMe:!this.state.showMe
      })

    }

    //renderiza os elementos
    render(){

      return(
        
        <div>

          <div className="flex space-x-2" >

            {/* ao clicar nesta divisão ira executar a função para alterar o valor do this */}
            <button onClick={()=>this.operation()} >ID:</button>
            
            {/* Se o valor for verdadeiro */}
            {this.state.showMe?( 
              
              <div>

                {/* Então irá executar a função do chat publico */}
                {user.uid}⠀⠀
              
              </div>

            ):(

              // senão mostra o olho para a revelação do id
              <div className="cursor-pointer" onClick={()=>this.operation()}>👁</div>
              
            )

            }

          </div>

        </div>
      
      )
    
    }
  
  }

  return (

    //css editado com o tailwind css
    <div className="h-screen min-w-fit max-w-screen-2xl">
      
      {/* Edição do cabeçalho */}
      <header className="flex items-center sticky top-0 z-10 h-20 p-5 bg-blue-800 ">
        
        {/* Edição da posição da moldura */}
        <div className="flex items-center space-x-2">
          
          <img
            
            //exibe a imagem do utilizador
            src={user.photoURL}
            
            //edita a imagem para aparecer numa moldura circular
            className="rounded-full bg-white w-10 h-10 object-contain"
          
          />
          
          {/* Exibição do email, e do id através da função */}
          <div>Eu⠀({user.email})⠀⠀⠀⠀⠀⠀⠀⠀⠀<UserId2/></div>
        
        </div>
        
        {/* edição da posição dos botões */}
        <div className="flex items-center justify-end  relative flex-1 ">
          
          {/* Novo chat através do email*/}  
          <div
            
            className="flex items-center space-x-1 cursor-pointer w-fit p-5"
            
            //ao clicar irá ser executada a função createChat
            onClick={createChat}
          
          >
            
            {/* Icone usado para o botão */}
            <AiOutlineUsergroupAdd className="w-8 h-8" />
            
            <button className="text-sm">(Email)</button>
          
          </div>
          
          {/* Novo chat atraves do ID*/}
          <div
            
            className="flex items-center space-x-1 cursor-pointer w-fit p-5"
            
            //ao clicar irá ser executada a função createChatID
            onClick={createChatID}
          
          >
           
            {/* Icone usado para o botão */}
            <AiOutlineUsergroupAdd className="w-8 h-8" />
           
            <button className="text-sm">(ID)</button>
          
          </div>
          
          {/* Sair da conta */}
          <div 

            className="flex items-center space-x-1 cursor-pointer w-fit p-5" 
            
            //ao clicar irá ser executada a função de signOut
            onClick={() => auth.signOut()}
          
          >
            {/* Exibição do ícone */}
            <BiDoorOpen className="w-8 h-8"/>

            <button className="text-sm cursor-pointer">Sair</button>
          
          </div>
        
        </div>
        
        {/* Fim do cabeçalho */}
      </header>

      {/* Lista dos utilizadores */}
      <div className="flex flex-col p-5">

        {/* Execução da função ChatRoom */}
        <ChatRoom />

        {/* Divisão dos conhecidos */}
        <div>Conhecidos:
        
        {/* Criação de um div para ajustar mellhor o texto*/}
        <div>⠀</div>

        {/* Procura pelos chats privados com conhecidos do utilizador */}
        {chatsSnapshot?.docs.map((chat) => 
        
        {

          //Listagem dos chats com conhecidos
          return <Chat key={chat.id} id={chat.id} users={chat.data().users}/>;
        
        })}

        </div>

        <div>⠀</div>

        {/* Divisão dos desconhecidos */}
        <div>Desconhecidos:

        {/* Criação de um div para ajustar mellhor o texto*/}
        <div>⠀</div>

        {/* Procura pelos chats privados com desconhecidos do utilizador */}
        {ANchats?.docs.map((ANchat) => 
        
        {
          
          //Listagem dos chats com desconhecidos
          return <ChatID key={ANchat.id} id={ANchat.id} users={ANchat.data().users} />;
        
        })}
        
        </div>
        
        <div>⠀</div>

      </div>

    </div>

  );

}

//Função do chat público
function PublicChat() {

  //criação da variavel data
  const [data, setData] = useState([]);
  
  //cria a variável user para guardar a autenticação
  const [user] = useAuthState(auth);
  
  //usa-se o useeffect pois pode não retornar nada
  useEffect(() => {
    
    //guarda-se na variavel q a altura em que as mensagens foram enviadas
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    
    //criação da variável unsub para atualizar a data 
    const unsub = onSnapshot(q, (snapshot) => {

      //ou seja cada vez que o conteudo é alterado o onSnapShot é executado de novo
      setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
    });
    
    //retorna a variável unsub
    return unsub;
  
  }, []);

  //criação da variável formValue
  const [formValue, setFormValue] = useState("");

  //cria a variavel para mandar mensagem
  const sendMessage = async (e) => {

    //Cancela o evento se for der para cancelar, sem parar a propagação do mesmo
    e.preventDefault();
    
    //obtem dados do utilizador
    
    
    //tenta adicionar os dados necessários na base de dados
    try {
      
      await addDoc(collection(db, "messages"), {
        text: formValue,
        uid: user.uid,
        timestamp: serverTimestamp(),
      });

      //limpa o input
      setFormValue("");
      
      // caso não dê certo irá aparecer uma mensagem de erro na consola
    } catch (err) {
      
      console.log("Connection db faild", err);
    
    }

  };

  return (

    <div className="grid ">

      {/* Cabeçalho do chat publico */}
      <header className="p-5 rounded-3xl flex justify-between bg-blue-800">

        <div className="flex items-center space-x-2">

        {/* Criação de um ícone */}
        <BsChatLeftTextFill className="w-6 h-6"/>

          {/* Identificação da divisão */}
          <h1 className="text-sm font-semibold">Chat público</h1>

        </div>

      {/* Fim do cabeçalho */}
      </header>

      {/* Divisão onde irão aparecer as mensagens */}
      <div className="overflow-y-scroll flex flex-col p-5">

        {/* para isso irá ser feita uma consulta à base de dados */}
        {data.map((msg) => (

          //E irá executar a função chat message com os dados das mensagens
          <ChatMessage

            //das quais o id da mensagem
            key={msg.id}

            //e o texto
            message={{
              ...msg,
              timestamp: msg.timestamp?.toDate().getTime(),
              
            }}
            
            //e irá guardar o utilizador
            user={msg.email}

          />

        ))}

      </div>
      
      {/* Para mandar mensagem*/}
      <div className="flex items-center rounded-3xl justify-around gap-4 p-5 bg-blue-800">
        
        {/* para isso foi criado um formulário */}
        <form

          //que ao submeter irá ser executada a função sendmessage
          onSubmit={sendMessage}
          
          //respetivas edições desta divisão
          className="flex items-center w-full space-x-4"

        >

          {/* Input da mensagem */}
          <input

            //este input vai ser do tipo de texto
            type="text"
            
            //vai guardar o texto do utilizador
            value={formValue}

            //antes do utilizador escrever a mensagem irá aparecer no input 
            //para o utilizador escrever uma mensagem
            placeholder="Escreva uma mensagem..."

            //ao enviar a mensagem o input volta a estar vazio 
            onChange={(e) => setFormValue(e.target.value)}

            //Edição do input
            className="outline-0 border-0 rounded-3xl p-3 text-gray-900 w-full"

          />
          
          {/* botão para mandar a mensagem */}
          <button 
            
            //este botão é do tipo submit
            type="submit" 
            
            //e fica destivado até o utilizador escrever algo
            disabled={!formValue}>

            {/* Icone do botão */}
            <IoMdSend className="w-8 h-8" />

          </button>

        </form>

      </div>

    </div>

  );

}

//Função chatMessage
function ChatMessage(props) {

  //atribui os valores às variáveis criadas com o parametro recebido
  const { id, text, timestamp, email} = props.message;

  //guarda a autenticação do utilizador
  const [userLoggedIn] = useAuthState(auth);

  //Função responsável por esconder/mostrar texto
  class UserId extends Component{
    
    //O construtor serve para criar e inicializar o objeto criado a partir da classe
    constructor(){
      
      //o super terá de ser atribuido antes do this para não ocorrer um erro de referência
      super()

      //o valor começa como falso para não exibir o id do utilizador
      //quando o utilizador acessar a página principal
      this.state={
        showMe: false
      }

    }

    //esta função permite mudar o valor para verdadeiro ou falso
    //dependendo do valor atual
    operation()
    {

      //Atualização do valor
      this.setState({

        //para o contrário do que está no momento
        showMe:!this.state.showMe
      })

    }

    //renderiza os elementos
    render(){

      return(

        <div>

          <div className="flex space-x-2">

            {/* ao clicar nesta divisão ira executar a função para alterar o valor do this */}
            <button onClick={()=>this.operation()}>⠀⠀Utilizador:</button>

            {/* Se o valor for verdadeiro */}
            {this.state.showMe?(

              // Então irá executar a função do chat publico 
              <div >
                {props.message.uid}⠀⠀
              </div>

            ):(

              // senão mostra o olho para a revelação do id
              <div className="cursor-pointer" onClick={()=>this.operation()}>⠀👁⠀</div>
              
            )
            
            }
            <div>⠀</div>

          </div>

        </div>

      )

    }

  }

  return (

    <div className="flex mb-4">
      
      {email === userLoggedIn.email ? (

        <div className="ml-auto bg-blue-500 rounded-full text-white">

          <div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center justify-center font-bold">
					
          <span>Eu</span>
				
        </div>
        
        <div className="flex items-center space-x-2 w-fit py-1 px-3">
          
          <span className="text-sm">⠀{text}</span>
          
          <span className="text-xs">
            
            {timestamp ? moment(timestamp).format("LT") : "Agora mesmo"}⠀
          
          </span>
        
        </div>
        
        <div>⠀</div>
      
      </div>
      
      ) : (
        
        <div className="bg-white rounded-full text-gray-900 text-left" key={id}>
            
            ⠀<UserId/>
          
          <div className="flex items-center justify-center space-x-2 w-fit py-1 px-3">
            
            <span className="text-sm">⠀{text}</span>
            
            <span className="text-xs">
              
              {timestamp ? moment(timestamp).format("LT") : "Agora mesmo"}⠀
            
            </span>
          
          </div>
          
          <div>⠀</div>
        
        </div>
        
      )}

    </div>

  );
  
}

//exportação da função
export default Sidebar;