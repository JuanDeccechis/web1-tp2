document.addEventListener("DOMContentLoaded", function(){

	"use-strict";
	let seguirActualizando = true;
	let arregloJsons= [];
	let tiempoRecarga = 0;
	let url = "http://web-unicen.herokuapp.com/api/groups/deccechis/prueba/";
	let contenido = { 
		"id": "",
		"nombre": "",
		"link": ""
	}
	let objeto ={
		"thing": contenido
	}


	function loadHome(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h2>Cargando...</h2>";
		fetch("home.html").then(
			function(response){
		      		response.text().then(t  => 
						container.innerHTML = t)
					.catch(error => console.log("Error en loadHome, text(): "+error))
					})
			.catch(error => console.log("Error en loadHome: "+error))
	}

	function loadCatedrasAdmin(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h2>Cargando...</h2>";
		fetch("catedrasAdmin.html").then(
			function(response){
	      		response.text().then(t  => {
				container.innerHTML = t;
				container.querySelector("#timer").addEventListener("click", comenzarActualizaciones);
				container.querySelector("#stopTimer").addEventListener("click", detenerActualizaciones);
				container.querySelector("#js-getId").addEventListener("click", eventGetOne);
				container.querySelector("#js-get").addEventListener("click", eventGet);
				container.querySelector("#js-delete-all").addEventListener("click", eventDeleteAll);
				container.querySelector("#name").addEventListener("keyup", filtrarPorNombre);
				container.querySelector("#js-create").addEventListener("click", eventCreate);
				container.querySelector("#js-create-n").addEventListener("click", eventCreateCount);

				get();
				})
				.catch(error => console.log("Error en loadCatedrasAdmin, text(): "+error))
			})
		.catch(error => console.log("Error en loadCatedrasAdmin: "+error))
	}

	function loadCatedras(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h2>Cargando...</h2>";
		fetch("catedras.html").then(
			function(response){
		      		response.text().then(t  => {
						container.innerHTML = t;
						})
					.catch(error => console.log("Error en loadCatedras, text(): "+error))
				})
		.catch(error => console.log("Error en loadCatedras: "+error))
	}

	function loadCalendario(event){
	event.preventDefault();
	let container = document.querySelector(".cuerpo");
	container.innerHTML = "<h2>Cargando...</h2>";
	fetch("calendario.html").then(
		function(response){
	      		response.text().then(t  => 
					container.innerHTML = t)
				.catch(error => console.log("Error en loadCalendario, text(): "+error))
				})
	.catch(error => console.log("Error en loadCalendario: "+error))
	}

	function comenzarActualizaciones(event){
		event.preventDefault();
		document.querySelector("#timer").classList.toggle('oculto');
		document.querySelector("#stopTimer").classList.toggle('oculto');
		seguirActualizando = true;
		tiempoRecarga = parseInt(document.querySelector("#time-refresh").value)*1000;
		console.log(tiempoRecarga);
		setInterval(function() {
			if (seguirActualizando)
				get();
		}, tiempoRecarga);	/*consultar*/
	}

	function detenerActualizaciones(event){
		event.preventDefault();
		document.querySelector("#timer").classList.toggle('oculto');
		document.querySelector("#stopTimer").classList.toggle('oculto');
		seguirActualizando = false;
	}



	window.onload = loadHome;
	

	let jshome = document.querySelectorAll(".js-home");
	jshome.forEach(e=> e.addEventListener("click", loadHome));
	let jscatedrasAdmin = document.querySelectorAll(".js-catedras-admin");
	jscatedrasAdmin.forEach(e=> e.addEventListener("click", loadCatedrasAdmin));
	let jscalendario = document.querySelectorAll(".js-calendario");
	jscalendario.forEach(e=> e.addEventListener("click", loadCalendario));
	let jscatedras = document.querySelectorAll(".js-catedras");
	jscatedras.forEach(e=> e.addEventListener("click", loadCatedras));


	function eventGetOne(e){
		e.preventDefault();
		getOne();
	}
	function eventGet(e){
		e.preventDefault();
		get();
	}
	function eventCreate(e){
		e.preventDefault();
		let id = document.querySelector("#id").value;
		let nombre = document.querySelector("#name").value;
		let link = document.querySelector("#link").value;
		if (id && nombre && link){
			create(id, nombre, link);
			/*get();*/
		}
		else
			console.log("faltan argumentos para crear una fila completa");
	}
	function eventCreateCount(e){
		e.preventDefault();
		let id = document.querySelector("#id").value;
		let nombre = document.querySelector("#name").value;
		let link = document.querySelector("#link").value;
		let cantidad = document.querySelector("#count").value;
		if (id && nombre && link){
			for (let i = 0; i < cantidad; i++)
				create(id, nombre, link);
			/*get();*/
		}
		else
			console.log("faltan argumentos para crear "+ n + " filas completas");
	}
	function eventUpdate(e){
		e.preventDefault();
		let id = document.querySelector("#id").value;
		let nombre = document.querySelector("#name").value;
		let link = document.querySelector("#link").value;
		if (id && nombre && link){
			update(this, id, nombre, link);
			/*get();*/
		}
		else
			console.log("faltan argumentos para actualizar la fila completa");
	}
	function eventDelete(e){
		e.preventDefault();
		del(this);
		/*get();*/
	}
	function eventDeleteAll(e){
		e.preventDefault();
		let  filas = document.querySelectorAll(".btn-delete");
		for (let i = 0; i < filas.length; i++) {
			del(filas[i]);
		}
		/*get();*/
	}

	/*** HTTP ***/

	function get(){
		let container = document.querySelector("tbody");
		container.innerHTML = "Cargando";
		fetch(url).then(function(r){ 
			console.log("GET status: " + r.status);
			r.json()
				.then(function(json){
					container.innerHTML = mostrar(container, json, "prueba");
					let deletes = container.querySelectorAll(".btn-delete");
					let updates = container.querySelectorAll(".btn-update");
					for (let i = 0; i < deletes.length; i++) {
						deletes[i].addEventListener("click", eventDelete);
						updates[i].addEventListener("click", eventUpdate);
					}
				})
				.catch(function(error){
					error => container.innerHTML = "Error";
					console.log("Error en GET, json(): " + error);
				})
		})
		.catch(function(error){
			error => container.innerHTML = "Error";
			console.log("Error en GET: " + error);
		})
	}		
	
	function getOne(){
		let container = document.querySelector("tbody");
		let idCatedra = document.querySelector("#id").value;
		let id = "";
		for (var i = 0; i < arregloJsons.length; i++) {
			if(arregloJsons[i].thing.id === idCatedra)
				id = arregloJsons[i]._id;
		}
		if(id === "")
			console.log("Error en GET one, el ID no corresponde con ningún elemento");
		else{
			let urlCompleta = url + id;
			fetch(urlCompleta).then(function(r){ 
				console.log("GET status: " + r.status);
				r.json()
					.then(function(json){
						container.innerHTML = mostrar(container, json, "information");
						let deletes = container.querySelectorAll(".btn-delete");
						let updates = container.querySelectorAll(".btn-update");
						for (let i = 0; i < deletes.length; i++) {
							deletes[i].addEventListener("click", eventDelete);
							updates[i].addEventListener("click", eventUpdate);
						}
					})
					.catch(function(error){
						error => container.innerHTML = "Error";
						console.log("Error en GET one, json(): " + error);
					})
			})
			.catch(function(error){
				error => container.innerHTML = "Error";
				console.log("Error en GET one: " + error);
			})
		}
	}

	function filtrarPorNombre(){
		let container = document.querySelector("tbody");
		let nombreCatedra = document.querySelector("#name").value;
		let filtrados = [];
		let count = 0;
		for (let i = 0; i < arregloJsons.length; i++) {
			if(arregloJsons[i].thing.nombre.includes(nombreCatedra)){
				filtrados[count] = arregloJsons[i];
				count++;
			}
		}
		if(count !== 0){
			container.innerHTML = mostrar(container, filtrados, "filtro")
		}
	}

	function mostrar(container, json, stringContenedor){
		let resultado = "";
		if (stringContenedor === "prueba"){

			for (let i = 0; i < json.prueba.length; i++) {
				if (json.prueba[i].thing.nombre.includes("web"))
					//las filas resaltadas son las que incluyen "web"
					resultado = resultado +"<tr class='filaResaltada'>";
				else
					resultado = resultado +"<tr>";
				arregloJsons[i] = json.prueba[i];
				resultado = resultado + "<td> " + json.prueba[i].thing.id + " </td>";
				resultado = resultado + "<td> " + json.prueba[i].thing.nombre + " </td>";
				resultado = resultado + "<td> " + "<a href='" + json.prueba[i].thing.link + "'><img src='images/icon-link.png' alt='Link'> </a>" + " </td>";
				resultado = resultado + "<td><button id='"+json.prueba[i]._id+"' class='btn btn-warning btn-update'> modificar</button> <button id='"+ json.prueba[i]._id +"' class='btn btn-danger btn-delete'> borrar</button> </td>" + "</tr>"
			}
		}
		else{
			if (stringContenedor === "information") {
				if (json.information.thing.nombre.includes("web"))
					//las filas resaltadas son las que incluyen "web"
					resultado = resultado +"<tr class='filaResaltada'>";
				else
					resultado = resultado +"<tr>";
				resultado = resultado + "<td> " + json.information.thing.id + " </td>";
				resultado = resultado + "<td> " + json.information.thing.nombre + " </td>";
				resultado = resultado + "<td> " + "<a href='" + json.information.thing.link + "'><img src='images/icon-link.png' alt='Link'> </a>" + " </td>";
				resultado = resultado + "<td><button id='"+json.information._id+"' class='btn btn-warning btn-update'> modificar</button> <button id='"+ json.information._id +"' class='btn btn-danger btn-delete'> borrar</button> </td>" + "</tr>"
			}	
			else{
				for (let i = 0; i < json.length; i++) {
					if (json[i].thing.nombre.includes("web"))
					//las filas resaltadas son las que incluyen "web"
						resultado = resultado +"<tr class='filaResaltada'>";
					else
						resultado = resultado +"<tr>";
					resultado = resultado + "<td> " + json[i].thing.id + " </td>";
					resultado = resultado + "<td> " + json[i].thing.nombre + " </td>";
					resultado = resultado + "<td> " + "<a href='" + json[i].thing.link + "'><img src='images/icon-link.png' alt='Link'> </a>" + " </td>";
					resultado = resultado + "<td><button id='"+json[i]._id+"' class='btn btn-warning btn-update'> modificar</button> <button id='"+ json[i]._id +"' class='btn btn-danger btn-delete'> borrar</button> </td>" + "</tr>"
				}
			}
		}
		return resultado;
	}

	function create(propiedad, nombre, link){
		contenido.id = propiedad;
		contenido.nombre = nombre;
		contenido.link = link;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";
		fetch(url, {
	        "method": 'POST',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	        "body": JSON.stringify(objeto)
	    })
		    .then(function(r){
		    	console.log("POST status: " + r.status);
		    	container.innerHTML = "";
		    	get();
		    })
	    .catch(function(error){
			console.log("Error en CREATE: " + error);
		})
	}


	function del(btn){
		console.log(btn);
		let urlCompleta = url + btn.id;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";
		fetch(urlCompleta, {
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
	    .catch(function(error){
			console.log("Error en DELETE: " + error);
		})
	}

	function update(btn, propiedad, nombre, link){
		let urlCompleta = url + btn.id;
		let container = document.querySelector("#resultado");
		container.innerHTML = "Cargando";

		contenido.id = propiedad;
		contenido.nombre = nombre;
		contenido.link = link;
		fetch(urlCompleta, {
	        "method": 'PUT',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	        "body": JSON.stringify(objeto)
	    })
	    .then(function(r){
	    	console.log("PUT status: " + r.status);
	    	container.innerHTML = "";
	    	get();
	    })
	    .catch(function(error){
			console.log("Error en UPDATE: " + error);
		})
	}

})