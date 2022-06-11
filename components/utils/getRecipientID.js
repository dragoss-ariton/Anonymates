//recebe os utilizadores da base de dados e o utilizador que está a usar a aplicação
const getRecipientID = (users, userLoggedIn) =>

	//procura pelo ID do utilizador receptor
	users.filter((ID) => ID !== userLoggedIn.ID)[0]

//exporta a função
export default getRecipientID
