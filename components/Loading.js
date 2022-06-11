//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Loading----------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação do css necessário para este código
import styles from "../styles/Loading.module.scss"

//--------------------------------------------------------------------------------------------------------------------------------

//Aqui vemos a função do loading
function Loading() {

	return (

		//Se passarmos o rato por cima mostra como seria escrito no css normal
		<div className="flex justify-center w-full h-full fixed">
			
			{/* Para o loading ja foi criado um ficheiro css pois ja era algum codigo*/}
			<div className={styles.spinner}>

				{/* Aqui temos os 5 retangulos que aparecem nos momentos de carregamento*/}
				<div className={styles.rect1}></div>

				<div className={styles.rect2}></div>

				<div className={styles.rect3}></div>

				<div className={styles.rect3}></div>

				<div className={styles.rect4}></div>

			</div>

		</div>
	)
}

//exportação da função
export default Loading