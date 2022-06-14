//------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------_app.js--------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase/react necessárias para este código
import { useEffect} from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "../firebase"
import { collection, setDoc, doc, serverTimestamp} from "firebase/firestore"

//importação de funções componentes necessários para este código
import Login from "./loginPage"
import Loading from "../components/Loading"

//importação do style em css
import "../styles/globals.scss"

//------------------------------------------------------------------------------------------------------------------

//função MyApp 
function MyApp({ Component, pageProps }) {

	//criação da variavel user para guardar a autenticação
	const [user, loading] = useAuthState(auth)

	//utilização do useeffect pois a função pode vir vazia
	useEffect(() => {

		//se o utilizador for encontrado
		if (user) {

			//dentro da coleção users
			const c = collection(db, "users")

			//se for p primeiro login então ira ser criado o utilizador 
			//com os respetivos campos na base de dados
			setDoc(
				
				//se forem encontrados os dados então irá 
				//atualizar caso tenha sido efetuada alguma alteração
				doc(c, user.uid),
				{
					ID: user.uid,
					email: user.email,
					lastSeen: serverTimestamp(),
					photoURL: user.photoURL,
				},
			)
		}
	}, [user])

	//se o loading não estiver vazio irá executar a função loading
	if (loading) return <Loading />
	
	//se o utilizador não for encontrado será redirecionado para a página de login
	if (!user) return <Login />
	
	//retorna o componente em que o utilizador está inserido
	return <Component {...pageProps} />
}

//exporta a função
export default MyApp
