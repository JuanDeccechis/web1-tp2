document.addEventListener("DOMContentLoaded", function(){

	"use-strict";

	function loadHome(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h1>Loading...</h1>";
		fetch("home.html").then(
			function(response){
		      		response.text().then(t  => 
					container.innerHTML = t)
					});
	}

	function loadCatedras(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h1>Loading...</h1>";
		fetch("catedras.html").then(
			function(response){
		      		response.text().then(t  => 
					container.innerHTML = t)
					});
	}

	function loadCalendario(event){
		event.preventDefault();
		let container = document.querySelector(".cuerpo");
		container.innerHTML = "<h1>Loading...</h1>";
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
})