//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------Index------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//importação dos pacotes necessários para este código
import Head from "next/head";
import Sidebar from "../components/Sidebar";

//--------------------------------------------------------------------------------------------------------------------------------

//exportação e criação da função
export default function Home() {
	
	//"View"
  	return (
  		
		  <div>
			
			{/* Cabeçalho do separador */}
  			<Head>

				{/* Nome da aplicação que vai aparecer no separador */}
  				<title>Anonymates</title>

				{/* Icone do separador */}
  				<link rel="icon" href="/favicon.ico" />

  			</Head>
			 
			{/* Chamada da função para mostrar a pagina inicial */}
  			<Sidebar /> 
			
  		</div>
  	);
	  
  }