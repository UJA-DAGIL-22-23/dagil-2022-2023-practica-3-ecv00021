/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}

/// Nombre de los campos del formulario para editar una persona
Plantilla.form = {
    nombre: "form-persona-nombre",
    apellidos: "form-persona-apellidos",
    fechaNacimiento: "form-persona-fecha",
    pais: "form-persona-pais",
    aniosCompeticion: "form-persona-anios",
    numero_campeonatos_ganados: "form-persona-campeonatos",
    nombre_equipo: "form-persona-equipo",
    categoria: "form-persona-categoria",
    altura: "form-persona-altura",
}


/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}


/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}

/**
 * Función que recupera un jugador por su id. 
 * Posteriormente, llama a la función callBackFn para trabajar con los datos recuperados.
 * @param {String} idJugador Identificador de la persona a mostrar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.recuperaJugador = async function (idJugador, callBackFn) {
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getPorId/" + idJugador
        const response = await fetch(url);
        if (response) {
            const persona = await response.json()
            callBackFn(persona)
        }
    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
    }
}

/**
 * Función para mostrar en pantalla los detalles de un juagador que se ha recuperado de la BBDD por su id
 * @param {Plantilla} jugador Datos del jugador a mostrar
 */

Plantilla.imprimeJugador = function (jugador) {
    // console.log(persona) // Para comprobar lo que hay en vector
    //let msj = Personas.personaComoFormulario(persona);
    jugador=jugador.data
    let msj = `<div> 
    <p> Nombre del jugador: ${jugador.nombre} </p>
    <p> Apellidos del jugador: ${jugador.apellidos} </p>
    <p> Fecha de nacimiento del jugador: ${jugador.fechaNacimiento.dia}/${jugador.fechaNacimiento.mes}/${jugador.fechaNacimiento.anio} </p>
    <p> País del jugador: ${jugador.pais} </p>
    <p> Años competición del jugador: ${jugador.aniosCompeticion} </p>
    <p> Número de campeonatos ganados del jugador: ${jugador.numero_campeonatos_ganados} </p>
    <p> Nombre del equipo del jugador: ${jugador.nombre_equipo} </p>
    <p> Categoría del jugador: ${jugador.categoria} </p>
    <p> Altura del jugador: ${jugador.altura} </p>
    </div>`;

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Mostrar datos del jugador", msj)
}

/**
 * Función principal para mostrar los datos de un jugador desde el MS y, posteriormente, imprimirla.
 * @param {String} idJugador Identificador dej jugador a mostrar
 */
Plantilla.mostrarJugador = function (idJugador) {
    this.recuperaJugador(idJugador, this.imprimeJugador);
}



