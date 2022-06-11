//recebe os utilizadores da base de dados e o utilizador que está a usar a aplicação
const getRecipientEmail = (users, userLoggedIn) =>

	//procura pelo utilizador receptor
	users.filter((user) => user !== userLoggedIn.email)[0]

//exporta a função
export default getRecipientEmail
