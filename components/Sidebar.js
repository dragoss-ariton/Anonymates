//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Sidebar----------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/react/node necessários para este código
import React, { useState, useEffect, Component } from "react";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth } from "../firebase";
import { collection, addDoc, where, query, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";
import moment from "moment";

//importação das funções utilizadas
import Chat from "./Chat";
import ChatID from "./ChatID";

//importação dos ícones utilizados
import { BsChatLeftTextFill} from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { CgMoreO } from "react-icons/cg"
import { BiDoorOpen } from "react-icons/bi"

//--------------------------------------------------------------------------------------------------------------------------------

//Função responsável pela maioria do visual da aplicação
function Sidebar() {
  
  //Preenche a variavel user com os dados do Auth
  //o auth contem os dados da base de dados
  const [user] = useAuthState(auth);

  //realização de uma consulta para obter os chats do utilizador
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
        alert("Email inválido");
      
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

      
      constructor(){
      
      
      super()
      
      
      this.state={
        showMe: false
      }

    }

    operation()
    {
          
      this.setState({
        showMe:!this.state.showMe
      })
    
    }

    render(){
      
      return(
        
        <div>

          <div className="flex space-x-2" onClick={()=>this.operation()}>
          
          <CgMoreO className=" cursor-pointer w-10 h-10 space-y-2"/><button> Chat Publico </button></div>
          
          <div>⠀</div>
          
          {
            this.state.showMe?
            
            <div className="space-y-2">
              
              {/* Chamada do chat publico */}
              <PublicChat />

              <div>⠀</div>
          
          </div>

          :null

          }

        </div>
      
      )
    
    }

  }

  //Função responsável por esconder/mostrar texro
  class UserId2 extends Component{

    constructor(){
    
      super()
    
      this.state={
        showMe: false
      }
    
    }
    
    operation()
    
    {
      
      this.setState({
        showMe:!this.state.showMe
      })

    }

    render(){

      return(
        
        <div>

          <div className="flex space-x-2" >
          
            <button onClick={()=>this.operation()} >⠀ID:👁</button>
            {
              
              this.state.showMe?
              
              <div>
                {user.uid}⠀⠀
              </div>

              :null

            }

          </div>

        </div>
      
      )
    
    }
  
  }

  return (

    <div className="h-screen">
      
      <header className="flex items-center sticky top-0 z-10 h-20 p-5 bg-blue-900">
        
        <div className="flex items-center space-x-2">
        {user ? (

          <img
                      
              src={user.photoURL}
                      
              className="rounded-full bg-white w-10 h-10 object-contain"
                    
          />

        ) : (

          //caso não sejam encontrados os dados irá aparecer uma moldura com a inicial do email
          <div className="rounded-full bg-white w-10 h-10 text-gray-900 flex items-center justify-center font-bold">
            
            {/*entre as chavetas encontramos um 0 pois é considerado o primeiro numero */}
            <span>{user.email[0]}</span>

        </div>

        )}  
          
          
          <div className="flex items-center space-x-2">Eu ({user.email})<UserId2/></div>
        
        </div>
        
        <div className="flex items-center justify-end  relative flex-1 ">
          
          {/* Novo chat através do email*/}  
          <div
            
            className="flex items-center space-x-1 cursor-pointer w-fit p-5"
            
            onClick={createChat}
          
          >
            
            <AiOutlineUsergroupAdd className="w-8 h-8" />
            
            <button className="text-sm">Novo Chat(Email)</button>
          
          </div>
          
          {/* Novo chat atraves do ID*/}
          <div
            
            className="flex items-center space-x-1 cursor-pointer w-fit p-5"
            
            onClick={createChatID}
          
          >
           
            <AiOutlineUsergroupAdd className="w-8 h-8" />
           
            <button className="text-sm">Novo Chat (ID)</button>
          
          </div>
          
          {/* Sair da conta */}
          <div 
          
            className="flex items-center space-x-1 cursor-pointer w-fit p-5" 
          
            onClick={() => auth.signOut()}
          
          >
            
            <BiDoorOpen className="w-8 h-8"/>
            
            <button className="text-sm cursor-pointer">Sair</button>
          
          </div>
        
        </div>
      
      </header>

      {/* Lista dos utilizadores */}
      <div className="flex flex-col p-5">

        <ChatRoom />

        <div className="">Conhecidos:</div>
        
        <div>⠀</div>

        {chatsSnapshot?.docs.map((chat) => 
        {
          
          return <Chat key={chat.id} id={chat.id} users={chat.data().users} UID={user.uid}/>;
        
        })}
        
        <div>⠀</div>

        <div className="">Desconhecidos:</div>

        <div>⠀</div>

        {ANchats?.docs.map((ANchat) => 
        {
          
          return <ChatID key={ANchat.id} id={ANchat.id} users={ANchat.data().users} />;
        
        })}

        <div>⠀</div>

      </div>

    </div>

  );

}

function PublicChat() {

  const [data, setData] = useState([]);
  
  const [user] = useAuthState(auth);
  
  useEffect(() => {
    
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    
    const unsub = onSnapshot(q, (snapshot) => {
      
      setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
    });
    
    return unsub;
  
  }, []);

  
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    
    e.preventDefault();
    
    const {photoURL, email} = auth.currentUser;
    
    
    try {
      
      await addDoc(collection(db, "messages"), {
        text: formValue,
        uid: user.uid,
        photoURL,
        email,
        timestamp: serverTimestamp(),
      });

      setFormValue("");

    } catch (err) {
      
      console.log("Connection db faild", err);
    
    }

  };

  return (

    <div className="grid">

      <header className="p-5 flex justify-between bg-blue-900">

        <div className="flex items-center space-x-2">

        <BsChatLeftTextFill className="w-6 h-6"/>
          <h1 className="text-sm font-semibold">Chat Publico</h1>

        </div>

        <div className="flex items-center space-x-4">

          <div className="flex items-center space-x-2">

          </div>

        </div>

      </header>

      {/* msg container */}
      <div className="overflow-y-scroll flex flex-col p-5">

        {data.map((msg) => (

          <ChatMessage
            key={msg.id}
            message={{
              ...msg,
              timestamp: msg.timestamp?.toDate().getTime(),
              
            }}

            user={msg.email}

          />

        ))}

      </div>

      <div className="flex items-center justify-around gap-4 p-5 bg-blue-900">
        
        {/* form box */}
        <form

          onSubmit={sendMessage}

          className="flex items-center w-full space-x-4"

        >
          <input

            type="text"

            value={formValue}

            placeholder="Escreva uma mensagem..."

            onChange={(e) => setFormValue(e.target.value)}

            className="outline-0 border-0 rounded-3xl p-3 text-gray-900 w-full"

          />
          
          <button type="submit" disabled={!formValue}>

            <IoMdSend className="w-8 h-8" />

          </button>

        </form>

      </div>

    </div>

  );

}

function ChatMessage(props) {

  const { id, text, timestamp, email} = props.message;

  const [userLoggedIn] = useAuthState(auth);

  class UserId extends Component{

    constructor(){

      super()

      this.state={
        showMe: false
      }

    }

    operation()
    {

      this.setState({
        showMe:!this.state.showMe
      })

    }

    render(){

      return(

        <div>

          <div className="flex space-x-2">

            <button onClick={()=>this.operation()}>⠀⠀User:👁</button>

            {

              this.state.showMe?

              <div>
                {props.message.uid}⠀⠀
              </div>

              :null

            }

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

export default Sidebar;