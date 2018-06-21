document.addEventListener("DOMContentLoaded", function(){

	"use-strict";
	let seguirActualizando = true;
	let arregloJsons= [];
	let tiempoRecarga = 0;
	let url = "http://web-unicen.herokuapp.com/api/groups/03DeccechisGuido/catedra/";
	let contenido = { 
		"id": "",
		"nombre": "",
		"link": ""
	}
	let objeto ={
		"thing": contenido
	}
	/***			PARTIAL RENDER!!!			***/
	/*	Esta función realiza el PARTIAL RENDER que carga en la sección "cuerpo" del index, el home de la página.	*/
	function loadHome(event){
		event.preventDefault();
		if (seguirActualizando)
			seguirActualizando = false;
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

	/*	Esta función realiza el PARTIAL RENDER que carga en la sección "cuerpo" del index, el administrador de cátedras
		(tabla REST) de la página. Agrega los Event Listener de los botones.	*/
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
				container.querySelector("#js-create").addEventListener("click", eventInsertOne);
				container.querySelector("#js-create-n").addEventListener("click", eventInsertCount);

				get();
				})
				.catch(error => console.log("Error en loadCatedrasAdmin, text(): "+error))
			})
		.catch(error => console.log("Error en loadCatedrasAdmin: "+error))
	}

	/*	Esta función realiza el PARTIAL RENDER que carga en la sección "cuerpo" del index, la tabla de cátedras de la página.	*/
	function loadCatedras(event){
		event.preventDefault();
		if (seguirActualizando)
			seguirActualizando = false;
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

	/*	Esta función realiza el PARTIAL RENDER que carga en la sección "cuerpo" del index, el calendario de la página.	*/
	function loadCalendario(event){
	event.preventDefault();
	if (seguirActualizando)
		seguirActualizando = false;
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

	/***			AUTO ACTUALIZAR!!! (opcional 2)			***/
	/*	Esta función cada cierto tiempo (ingresado por el usuario), actualiza la tabla REST para dejarla consistente con la base.	*/
	function comenzarActualizaciones(event){
		event.preventDefault();
		document.querySelector("#timer").classList.toggle('oculto');
		document.querySelector("#stopTimer").classList.toggle('oculto');
		seguirActualizando = true;
		tiempoRecarga = parseInt(document.querySelector("#time-refresh").value)*1000;
		console.log(tiempoRecarga);
		let timer = setInterval(function() {
			if (seguirActualizando)
				get();
			else{
				setTimeout(function() {
				clearInterval(timer);
				}, 0);
			}

		}, tiempoRecarga);
	}

	/*	Esta función detiene el AUTO-ACTUALIZAR de la tabla.	*/
	function detenerActualizaciones(event){
		event.preventDefault();
		document.querySelector("#timer").classList.toggle('oculto');
		document.querySelector("#stopTimer").classList.toggle('oculto');
		seguirActualizando = false;
	}


	/*	Carga inicial del HOME de la página.	*/
	window.onload = loadHome;
	
	/*	Event Listeners de la botonera principal.	*/
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

	/*	Llama a crear fila si todos los campos necesarios tienen datos.	*/
	function eventInsertOne(e){
		e.preventDefault();
		let container = document.querySelector("tbody"); 
		let colTr = insertarFilaVacia(null, 0, 1);
		container.appendChild(colTr);
	}

	function eventInsertCount(e){
		e.preventDefault();
		let container = document.querySelector("tbody"); 
		let colTr = insertarFilaVacia(null, 0, 2);
		container.appendChild(colTr);
	}

	function eventCreate(e){
		e.preventDefault();
		let id = document.querySelectorAll(".nuevaFilaId")[0].value;
		let nombre = document.querySelectorAll(".nuevaFilaNombre")[0].value;
		let link = document.querySelectorAll(".nuevaFilaLink")[0].value;
		if (id && nombre && link){
			create(id, nombre, link);
		//	get();
		}
		else
			console.log("faltan argumentos para crear una fila completa"); 
	}

	/*	Llama varias veces a crear fila si todos los campos necesarios tienen datos.	*/
	function eventCreateCount(e){
		e.preventDefault();
		let id = document.querySelectorAll(".nuevaFilaId")[0].value;
		let nombre = document.querySelectorAll(".nuevaFilaNombre")[0].value;
		let link = document.querySelectorAll(".nuevaFilaLink")[0].value;
		let cantidad = document.querySelector("#count").value;
		if (id && nombre && link){
			for (let i = 0; i < cantidad; i++)
				create(id, nombre, link);
			/*get();*/
		}
		else
			console.log("faltan argumentos para crear "+ cantidad + " filas completas");
	}

	/*	Llama a actualizar fila si todos los campos necesarios tienen datos.	*/
	function eventUpdate(e){
		e.preventDefault();
		let id = document.querySelectorAll(".nuevaFilaId")[0].value;
		let nombre = document.querySelectorAll(".nuevaFilaNombre")[0].value;
		let link = document.querySelectorAll(".nuevaFilaLink")[0].value;
		if (id && nombre && link){
			update(this, id, nombre, link);
			/*get();*/
		}
		else
			console.log("faltan argumentos para actualizar la fila completa");
	}

	function eventPreUpdate(e){
		let container = document.querySelector("tbody");
		let numFila = this.getAttribute("data-numeroFila");
		let colTr = insertarFilaVacia(arregloJsons, numFila, 3);
		container.removeChild(container.childNodes[numFila]);
		container.appendChild(colTr);
	}

	function eventDelete(e){
		e.preventDefault();
		del(this);
		/*get();*/
	}

	/*	Elimina todas las filas de la tabla.	*/
	function eventDeleteAll(e){
		e.preventDefault();
		let  filas = document.querySelectorAll(".btn-delete");
		for (let i = 0; i < filas.length; i++) {
			del(filas[i]);
		}
		/*get();*/
	}

	/***			HTTP!!!			***/
	/*	Esta función realiza el GET HTTP de la tabla completa, utilizando la función mostrar.	*/
	function get(){
		let container = document.querySelector("tbody");
		fetch(url).then(function(r){ 
			console.log("GET status: " + r.status);
			r.json()
				.then(function(json){
					let cantHijos = container.childNodes.length;
					for (let i = 0; i < cantHijos; i++) 
						container.removeChild(container.firstChild);
					mostrar(container, json, "prueba");
					let deletes = container.querySelectorAll(".btn-delete");
					let updates = container.querySelectorAll(".btn-update");
					for (let i = 0; i < deletes.length; i++) {
						deletes[i].addEventListener("click", eventDelete);
						updates[i].addEventListener("click", eventPreUpdate);
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
	
	/*	Esta función realiza el GET HTTP de una fila de la tabla, utilizando la función mostrar.	*/
	function getOne(){
		let container = document.querySelector("tbody");
		let idCatedra = document.querySelector("#id").value;
		let id = "";
		for (var i = 0; i < arregloJsons.length; i++) {
			if(arregloJsons[i].thing.id === idCatedra){
				id = arregloJsons[i]._id;
			}
		}
		if(id === "")
			console.log("Error en GET one, el ID no corresponde con ningún elemento");
		else{
			let urlCompleta = url + id;
			fetch(urlCompleta).then(function(r){ 
				console.log("GET status: " + r.status);
				r.json()
					.then(function(json){
						let cantHijos = container.childNodes.length;
						for (let i = 0; i < cantHijos; i++) 
							container.removeChild(container.firstChild);
						mostrar(container, json, "information");
						let deletes = container.querySelectorAll(".btn-delete");
						let updates = container.querySelectorAll(".btn-update");
						for (let i = 0; i < deletes.length; i++) {
							deletes[i].addEventListener("click", eventDelete);
							updates[i].addEventListener("click", eventPreUpdate);
						}
					})
					.catch(function(error){
						console.log("Error en GET one, json(): " + error);
					})
			})
			.catch(function(error){
				console.log("Error en GET one: " + error);
			})
		}
	}

	/*	Esta función realiza el GET HTTP de las filas de la tabla que cumplen con el FILTRO por nombre, utilizando la función mostrar.	*/
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
			let cantHijos = container.childNodes.length;
			for (let i = 0; i < cantHijos; i++) 
				container.removeChild(container.firstChild);
			mostrar(container, filtrados, "filtro");
		}
	}

	/*	Esta función permite visualizar de manera correcta las filas a mostrar en cada caso, de la tabla
	 de la página.*/
	function mostrar(container, json, stringContenedor){
		let resultado = "";
		let numFila = 0;
		if (stringContenedor === "prueba")
			for (let i = 0; i < json.catedra.length; i++) {
				arregloJsons[i] = json.catedra[i];
				let colTr = crearFila(json.catedra[i], numFila);
				container.appendChild(colTr);
				numFila++;
			}
		else{
			if (stringContenedor === "information") {
				let colTr = crearFila(json.information, numFila);
				container.appendChild(colTr);
				numFila++;
			}	
			else
				for (let i = 0; i < json.length; i++) {
					let colTr = crearFila(json[i], numFila);
					container.appendChild(colTr);
					numFila++;
				}
		}
		return resultado;
	}

	/* Esta función incluye el HTML necesario para la creación de filas de la tabla. */
	function crearFila(json, numFila){
		let colTr = document.createElement("tr");
		if (json.thing.nombre.includes("web")){
			//las filas resaltadas son las que incluyen "web"
			colTr.classList.add("filaResaltada");
		}
		let colId = document.createElement("td");
		let contenidoId = document.createTextNode(json.thing.id);
		colId.appendChild(contenidoId);

		let colNombre = document.createElement("td");
		let contenidoNombre = document.createTextNode(json.thing.nombre);
		colNombre.appendChild(contenidoNombre);

		let colLink = document.createElement("td");
		let link = document.createElement("a");
		let imagen = document.createElement("img");
		imagen.setAttribute("src","images/icon-link.png");
		imagen.setAttribute("alt","link");
		link.setAttribute("href", json.thing.link);
		link.appendChild(imagen);
		colLink.appendChild(link);

		let colBotones = document.createElement("td");
		let botonUpdate = document.createElement("button");
		botonUpdate.setAttribute("data-fila", json._id);
		botonUpdate.setAttribute("data-numeroFila", numFila);
		botonUpdate.classList.add("btn", "btn-warning", "btn-update");
		let contenidoUpdate = document.createTextNode("Modificar");
		botonUpdate.appendChild(contenidoUpdate);
		let botonDelete = document.createElement("button");
		botonDelete.setAttribute("data-fila", json._id);
		botonDelete.classList.add("btn", "btn-danger", "btn-delete");
		let contenidoDelete = document.createTextNode("Eliminar");
		botonDelete.appendChild(contenidoDelete);
		colBotones.appendChild(botonUpdate);
		colBotones.appendChild(botonDelete);

		colTr.appendChild(colId);
		colTr.appendChild(colNombre);
		colTr.appendChild(colLink);
		colTr.appendChild(colBotones);
		return colTr;
	}

	function insertarFilaVacia(json,numFila, cantidad){
		let colBoton = document.createElement("td");
		let contenidoBoton = document.createElement("button");
		contenidoBoton.classList.add("btn", "btn-primary", "btn-guardar");
		let textoBoton = document.createTextNode("Guardar");
		contenidoBoton.appendChild(textoBoton);
		let placeholderId = "id...";
		let placeholderNombre = "nombre...";
		let placeholderLink = "link...";
		if (cantidad === 1)
			contenidoBoton.addEventListener("click", eventCreate);
		if (cantidad === 2)
			contenidoBoton.addEventListener("click", eventCreateCount);
		if (cantidad === 3){
			contenidoBoton.addEventListener("click", eventUpdate);
			contenidoBoton.setAttribute("data-fila", json[numFila]._id);
			placeholderId = json[numFila].thing.id;
			placeholderNombre = json[numFila].thing.nombre;
			placeholderLink = json[numFila].thing.link;
		}

		let colTr = document.createElement("tr");
		let colId = document.createElement("td");
		let contenidoId = document.createElement("input");
		contenidoId.setAttribute("placeholder", placeholderId);
		contenidoId.classList.add("nuevaFilaId");
		colId.appendChild(contenidoId);
		colTr.appendChild(colId);

		let colNombre = document.createElement("td");
		let contenidoNombre = document.createElement("input");
		contenidoNombre.setAttribute("placeholder", placeholderNombre);
		contenidoNombre.classList.add("nuevaFilaNombre");
		colNombre.appendChild(contenidoNombre);
		colTr.appendChild(colNombre);

		let colLink = document.createElement("td");
		let contenidoLink = document.createElement("input");
		contenidoLink.setAttribute("placeholder", placeholderLink);
		contenidoLink.classList.add("nuevaFilaLink");
		colLink.appendChild(contenidoLink);
		colTr.appendChild(colLink);

		colBoton.appendChild(contenidoBoton);
		colTr.appendChild(colBoton);
		
		return colTr;
	}

	/*	Esta función realiza el POST HTTP con el contenido de los inputs de la página.	*/
	function create(propiedad, nombre, link){
		contenido.id = propiedad;
		contenido.nombre = nombre;
		contenido.link = link;
		let container = document.querySelector("#resultado");
		let cantHijos = container.childNodes.length;
		let count = 0;
		if (!cantHijos){
			count++;
			let parrafo = document.createElement("p");
			let texto = document.createTextNode("Cargando...");
			parrafo.appendChild(texto);
			container.appendChild(parrafo);
		}

		fetch(url, {
	        "method": 'POST',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	        "body": JSON.stringify(objeto)
	    })
		    .then(function(r){
		    	console.log("POST status: " + r.status);
		    	if (count){
		    		count--;
		    		container.removeChild(container.firstChild);
		    	}
		    	get();
		    })
	    .catch(function(error){
			console.log("Error en CREATE: " + error);
		})
	}

	/*	Esta función realiza el DELETE HTTP de la fila de la página.	*/
	function del(btn){
		let urlCompleta = url + btn.getAttribute("data-fila");
		let container = document.querySelector("#resultado");
		let cantHijos = container.childNodes.length;
		let count = 0;
		if (!cantHijos){
			count++;
			let parrafo = document.createElement("p");
			let texto = document.createTextNode("Cargando...");
			parrafo.appendChild(texto);
			container.appendChild(parrafo);
		}

		fetch(urlCompleta, {
	        "method": 'DELETE',
	        "headers": {
	            'Content-Type': 'application/json'
	        },
	    })
	    .then(function(r){
	    	console.log("DELETE status: " + r.status);
	    	if (count){
	    		count--;
	    		container.removeChild(container.firstChild);
	    	}
	    	get();
	    })
	    .catch(function(error){
			console.log("Error en DELETE: " + error);
		})
	}

	/*	Esta función realiza el UPDATE HTTP de la fila, con el contenido de los inputs de la página.	*/
	function update(btn, propiedad, nombre, link){
		let urlCompleta = url + btn.getAttribute("data-fila");
		let container = document.querySelector("#resultado");
		let cantHijos = container.childNodes.length;
		let count = 0;
		if (!cantHijos){
			count++;
			let parrafo = document.createElement("p");
			let texto = document.createTextNode("Cargando...");
			parrafo.appendChild(texto);
			container.appendChild(parrafo);
		}

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
	    	if (count){
	    		count--;
	    		container.removeChild(container.firstChild);
	    	}
	    	get();
	    })
	    .catch(function(error){
			console.log("Error en UPDATE: " + error);
		})
	}

})