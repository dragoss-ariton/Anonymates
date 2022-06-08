const getRecipientID = (users, userLoggedIn) =>
	users.filter((ID) => ID !== userLoggedIn.ID)[0]

export default getRecipientID
