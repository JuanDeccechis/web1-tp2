'use strict';
// Variables de acceso al HTML
let botonera = document.getElementById('botonera');
let btnComenzar = document.getElementById('btn-comenzar');
let btnReset = document.getElementById('btn-reset');
let seleccionar = document.getElementById('seleccionar');
let tablero = document.getElementById('tablero');
let resultados = document.getElementById("cuerpo-tabla");

//Inicialización de variables globales
let cantCasilleros = 8;
let arrCasilleros = [];
let visitado = [];
let cantMarcas = 0;
let aciertos = 0;
let aciertosTotales = 0;
let errores = 0;
let erroresTotales = 0;
let ganadas = 0;
let tiempo = 3; // 3 segundos por defecto
let probMarca = 0.5; // 50% por defecto
let filaActual = 0;

// Funciones internas

/*	Muestra el tiempo disponible antes de dar vuelta (dejar "boca abajo") las cartas para que inicie el juego.
	Luego las oculta y prepara la página para que el usuario pueda jugar.	*/
function empezarJuego() {
    crearTablero();
    visible(tablero);
    let pTiempo = document.getElementById('tiempo');
    let regresivo = tiempo;
    pTiempo.innerHTML = regresivo;
    let timer = setInterval(function() {
        regresivo--;
        pTiempo.innerHTML = regresivo;
    }, 1000);
    setTimeout(function() {
        clearInterval(timer);
        pTiempo.innerHTML = '';
        ocultarMarcas();
        visible(btnReset);
        visible(seleccionar);
        if (!arrCasilleros.includes('images/marcada.jpg')) {
            finalizar();
        }
    }, tiempo * 1000);
}

/*	Genera el random para saber que cartas están marcadas, cambia la imagen correspondiente (las "da vuelta") y guarda los índices de las cartas marcadas.	*/
function crearTablero() {
    cantMarcas = 0;
    for (let i = 1; i <= cantCasilleros; i++) {
        let rutaImagen = 'images/';
        if (i === 1 || Math.random() < probMarca) {
            rutaImagen += 'marcada.jpg';
            cantMarcas++;
        } else {
            rutaImagen += 'sin-marcar.jpg';
        }
        document.getElementById('casillero' + i).src = rutaImagen;
        arrCasilleros[i-1] = rutaImagen;
        visitado[i-1] = false;
    }
}

/*	Deja "boca abajo" las cartas, para que comience a jugar el usuario.	*/
function ocultarMarcas() {
    for (let img of document.querySelectorAll('img')) {
        img.src = 'images/dada-vuelta.jpg';
    }
}

/*	Oculta (vuelve invisible) el elemento pasado por parámetro.	*/
function ocultar(elem) {
    elem.classList.add('oculto');
}

/*	Deja de ocultar (vuelve visible) el elemento pasado por parámetro.	*/
function visible(elem) {
    elem.classList.remove('oculto');
}

/*	Muestra (deja "boca arriba") la carta seleccionada por el usuario(solo en caso que esa carta no haya sido previamente seleccionada.	*/
function darVuelta(selected) {
    if (!visitado[selected-1]) {
        if (arrCasilleros[selected-1] === 'images/marcada.jpg') {
            document.getElementById('casillero' + selected).src = 'images/marcada.jpg';
            aciertos++;
            aciertosTotales++;
        } else {
            document.getElementById('casillero' + selected).src = 'images/sin-marcar.jpg';
            errores++;
            erroresTotales++;
        }
        visitado[selected-1] = true;
    }
}

/*	Disparador de funciones, que realiza la lógica de mostrar la carta seleccionada por el usuario, actualizar resultados y felicitarlo en caso de haber terminado el juego.	*/
function elegir(selected) {
    darVuelta(selected);
    actualizarResultados();
    if (aciertos === cantMarcas) {
        finalizar();
    }
}

/*	Actualiza la tabla de aciertos y fallas (actuales y totales).	*/
function actualizarResultados() {
    resultados.rows[filaActual].cells[1].innerText = aciertos;
    resultados.rows[filaActual].cells[2].innerText = errores;
    document.getElementById('cant-aciertos-totales').innerHTML = aciertosTotales;
    document.getElementById('cant-errores-totales').innerHTML = erroresTotales;
}

/*	Inserta una nueva fila de aciertos y fallas actuales.	*/
function crearFilaTabla() {
    filaActual ++;
    let fila = resultados.insertRow(filaActual);
	let numPartida = filaActual + 1;
    fila.insertCell(0).innerHTML = "Partida " + numPartida;
	fila.insertCell(1).innerHTML = 0;
	fila.insertCell(2).innerHTML = 0;
}

/*	Actualiza la cantidad de partidas finalizadas, y felicita al usuario cada 3 partidas concecutivas.	Al ganar muestra los casilleros en blanco*/
function finalizar() {
    ganadas++;
    ocultar(seleccionar);
    setTimeout(function() {
        alert('Ganaste');
        if (ganadas % 3 === 0) {
            alert('Felicitaciones! Llevas ganado ' + ganadas + ' veces');
        }
		for (let i = 1; i <= visitado.length; i++) {
			if (!visitado[i-1]) {
				document.getElementById('casillero' + i).src = arrCasilleros[i-1];
			}
		}
	}, 500);
}

/* 	Al volver a jugar, reinicia las variables que se utilizan. */
function resetVariables() {
    aciertos = 0;
    errores = 0;
    seleccionar.selectedIndex = 0;
}



// Eventos
/*	Funcion que ejecuta ante el evento: presionar el boton "Comenzar"	*/
btnComenzar.addEventListener('click', function() {
    let inputTiempo = document.getElementById('input-tiempo').value;
    if (inputTiempo.length !== 0) {
        tiempo = inputTiempo;
    }
    let inputProbabilibdad = document.getElementById('input-probabilidad').value;
    if (inputProbabilibdad.length !== 0) {
        probMarca = inputProbabilibdad / 100;
    }
    if (probMarca >= 0 && probMarca <= 1) {
        ocultar(botonera);
        empezarJuego();
    } else {
        alert('Ingrese una probabilidad entre 1 y 100');
        probMarca = 0.5;
    }
});

/*	Funcion que ejecuta ante el evento: cambio de selección del usuario	*/
seleccionar.addEventListener('change', function() {
    let selected = seleccionar.selectedIndex;
    if (selected !== 0) {
        elegir(selected);
    }
});

/*	Funcion que ejecuta ante el evento: presionar el boton "Partida Nueva"	*/
btnReset.addEventListener('click', function() {
    ocultar(this);
    ocultar(tablero);
    ocultar(seleccionar);
    visible(botonera);
    resetVariables();
    crearFilaTabla();
});
