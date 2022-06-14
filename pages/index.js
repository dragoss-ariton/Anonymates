//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------index.js---------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação de uma função do next.js necessária para este código
import Head from "next/head";

//importação do menu principal
import Sidebar from "../components/Sidebar";

//--------------------------------------------------------------------------------------------------------------------------------

//exportação e criação da função
export default function Home() {
	
	//"View"
  	return (
  		
		  <div>
			
			{/* Identificação do separador */}
  			<Head>

				{/* Nome da aplicação que vai aparecer no separador */}
  				<title>Anonymates</title>

				{/* Icone do separador */}
  				<link rel="icon" href="/favicon.ico" />

  			</Head>
			 
			{/* Chamada da função para mostrar a pagina principal */}
  			<Sidebar /> 
			
  		</div>
  	);
	  
  }