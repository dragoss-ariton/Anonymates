//------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------loginPage.js--------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//importação de funções do firebase necessárias para este código
import { auth, provider } from "../firebase"
import { signInWithRedirect } from "firebase/auth"

//------------------------------------------------------------------------------------------------------------------

//Função do login com o google
function LoginPage() {

	const signIn = () => {
		
		//redireciona para a página da escolha do email do google
		signInWithRedirect(auth, provider)
			//se der certo então irá deixar o utilizador prosseguir
			.then((result) => {})
			
			//senão irá ver os erros
			.catch((error) => {

				//Guarda os erros aqui.
				const errorCode = error.code

				//guarda a mensagem de erro
				const errorMessage = error.message

				// O email da conta do utilizador utilizada.
				const email = error.email
			})
	}

	return (
		
		<div className="max-w-7xl mx-auto">
		
			<div className="grid">
				
				<div className="flex items-center justify-between p-5">
					
					<h1 className="text-xl font-semibold">Anonymates</h1>
					
					{/* botão de login */}
					<button
						
						//ao ser clicado ira executar a função signIn
						onClick={signIn}

						//edição do botão
						className="bg-white w-[100px] h-[100px] rounded-full flex justify-center 
						items-center font-bold text-gray-900 cursor-pointer"
					
					>
						Login

					</button>
				
				</div>
				
				{/* edições da imagem de fundo */}
				<div className="flex justify-center items-center p-3">
					
					{/* Imagem de fundo */}
					<img src="/login.svg" alt="" />
				
				</div>

			</div>

		</div>

	)

}

//exportação da função
export default LoginPage