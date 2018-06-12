document.addEventListener("DOMContentLoaded", function(){

	"use-strict";

	function loadHome(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h2>Loading...</h2>";
		fetch("home.html").then(
			function(response){
		      		response.text().then(t  => 
					container.innerHTML = t)
					});
	}

	function loadCatedras(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h2>Loading...</h2>";
		fetch("catedras.html").then(
			function(response){
		      		response.text().then(t  => {
					container.innerHTML = t;
					container.querySelector("#js-get").addEventListener("click", get);
					container.querySelector("#js-create").addEventListener("click", create);
					container.querySelector("#js-delete").addEventListener("click", delet);
					container.querySelector("#js-update").addEventListener("click", update);
					})
				});
	}

	function loadCalendario(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h2>Loading...</h2>";
		fetch("calendario.html").then(
			function(response){
		      		response.text().then(t  => 
					container.innerHTML = t)
					});
	}
	window.onload = loadHome;
	let jshome = document.querySelectorAll(".js-home");
	jshome.forEach(e=> e.addEventListener("click", loadHome));
	let jscatedras = document.querySelectorAll(".js-catedras");
	jscatedras.forEach(e=> e.addEventListener("click", loadCatedras));
	let jscalendario = document.querySelectorAll(".js-calendario");
	jscalendario.forEach(e=> e.addEventListener("click", loadCalendario));

	/*** HTTP ***/

	function get(e){
		e.preventDefault();
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/";
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";
		fetch(url).then(r => r.json() )
			.then(json => container.innerHTML = mostrar(container, json))
			.catch(error => container.innerHTML = "Error")
	}		
	
	function mostrar(container, json){
		let resultado = "<ul>";
		for (let i = 0; i < json.prueba.length; i++) {
			resultado = resultado + "<li>" + json.prueba[i].thing.nombre + "	-	id: " + json.prueba[i]._id + "</li>"
		}
		resultado = resultado + "</ul>"
		return resultado;
	}

	function create(e){
		e.preventDefault();
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/";
		let valor = 2;
		let nombre = "pepe";
		let objeto = { 
			"propiedad": valor,
			"nombre": nombre
		}
		let equipo ={
			"thing": objeto
		}
		
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";
		fetch(url, {
	        "method": 'POST',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	        "body": JSON.stringify(equipo)
	    })
	    .then(r => console.log(r))
	    .catch(error => console.log(error))
	}

	function delet(e){
		e.preventDefault();
		let id = document.querySelector("#js-id").value;
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/" + id;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";
		fetch(url, {
	        "method": 'DELETE',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	    })
	    .then(r => console.log(r))
	    .catch(error => console.log(error))
	}

	function update(e){
		e.preventDefault();
		let id = document.querySelector("#js-id").value;
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/" + id;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";

		let valor = 5;
		let nombre = "cambiado";
		let objeto = { 
			"propiedad": valor,
			"nombre": nombre
		}
		let equipo ={
			"thing": objeto
		}

		fetch(url, {
	        "method": 'PUT',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	        "body": JSON.stringify(equipo)
	    })
	    .then(r => console.log(r))
	    .catch(error => console.log(error))
	}

})