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
					container.querySelector("#js-get").addEventListener("click", eventGet);
					container.querySelector("#js-create").addEventListener("click", eventCreate);
					get();					
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

	function eventGet(e){
		e.preventDefault();
		get();
	}
	function eventCreate(e){
		e.preventDefault();
		let propiedad = document.querySelector("#js-property").value;
		let nombre = document.querySelector("#js-name").value;
		if (propiedad && nombre)
			create(propiedad, nombre);
		else
			console.log("faltan argumentos");
	}
	function eventUpdate(e){
		e.preventDefault();
		let propiedad = document.querySelector("#js-property").value;
		let nombre = document.querySelector("#js-name").value;
		if (propiedad && nombre)
			update(this, propiedad, nombre);
		else
			console.log("faltan argumentos");
	}
	function eventDelete(e){
		e.preventDefault();
		del(this);
	}

	/*** HTTP ***/

	function get(){
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/";
		let container = document.querySelector("tbody");
		container.innerHTML = "Cargando";
		fetch(url).then(function(r){ 
			console.log("GET status: " + r.status);
			r.json()
				.then(function(json){
					container.innerHTML = mostrar(container, json);
					let deletes = container.querySelectorAll(".btn-delete");
					let updates = container.querySelectorAll(".btn-update");
					for (let i = 0; i < deletes.length; i++) {
						deletes[i].addEventListener("click", eventDelete);
						updates[i].addEventListener("click", eventUpdate);
					}
				})
				.catch(error => container.innerHTML = "Error")
		})
	}		
	
	function mostrar(container, json){
		let resultado = "<tr>";
		for (let i = 0; i < json.prueba.length; i++) {
			resultado = resultado + "<td>" + json.prueba[i].thing.nombre + "	-	id: " + json.prueba[i]._id + "</td>"
			resultado = resultado + "<td> 1 </td> <td> </td> <td class='nuevo'><button id='"+json.prueba[i]._id+"' class='btn btn-warning btn-update'> modificar</button> <button id='"+ json.prueba[i]._id +"' class='btn btn-danger btn-delete'> borrar</button> </td>" + "</tr>"
		}
		return resultado;
	}

	function create(propiedad, nombre){
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/";
		let objeto = { 
			"propiedad": propiedad,
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
	    .then(function(r){
	    	console.log("POST status: " + r.status);
	    	container.innerHTML = "";
	    	get();
	    })
	    .catch(error => console.log(error))
	}


	function del(btn){
		console.log(btn);
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/" + btn.id;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";
		fetch(url, {
	        "method": 'DELETE',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	    })
	    .then(function(r){
	    	console.log("DELETE status: " + r.status);
	    	container.innerHTML = "";
	    	get();
	    })
	    .catch(error => console.log(error))
	}

	function update(btn, propiedad, nombre){
		let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/" + btn.id;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";

		let objeto = { 
			"propiedad": propiedad,
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
	    .then(function(r){
	    	console.log("PUT status: " + r.status);
	    	container.innerHTML = "";
	    	get();
	    })
	    .catch(error => console.log(error))
	}

})