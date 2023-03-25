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
 * @param {String} idJugador Identificador del jugador a mostrar
 */
Plantilla.mostrarJugador = function (idJugador) {
    this.recuperaJugador(idJugador, this.imprimeJugador);
}

/**
 * Función que recuperar todas las personas llamando al MS Personas
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio personas
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getTodas"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todas las persoans que se han descargado
    let vectorPersonas = null
    if (response) {
        vectorPersonas = await response.json()
        callBackFn(vectorPersonas.data)
    }
}

/**
 * Función principal para mostrar los nombres de todos los jugadores desde el MS y, posteriormente, imprimirla.
 */
Plantilla.mostrarNombresJugadores = function () {
    Plantilla.recupera(Plantilla.imprimeNombres);
}

/**
 * Función para mostrar en pantalla los nombres de todos los jugadores que se han recuperado de la BBDD.
 * @param {Vector_de_personas} vector Vector con los datos de las personas a mostrar
 */

Plantilla.imprimeNombres = function (vector) {
    // console.log(vector) // Para comprobar lo que hay en vector

    let msj = `<div>`
    vector.forEach(e => msj += `<p> ${e.data.nombre} </p>`)
    msj += `</div>`

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Nombres jugadores:", msj)
}

/**
 * Función principal para mostrar los nombres de todos los jugadores odenados alfabéticamente desde el MS y, posteriormente, imprimirla.
 */
Plantilla.mostrarNombresOrdenados = function () {
    Plantilla.recupera(Plantilla.imprimeNombresOrdenados);
}

/**
 * Función para mostrar en pantalla los nombres de todos los jugadores ordenados alfabéticamente que se han recuperado de la BBDD.
 * @param {Vector_de_personas} vector Vector con los datos de las personas a mostrar
 */

Plantilla.imprimeNombresOrdenados = function (vector) {
    // console.log(vector) // Para comprobar lo que hay en vector

    vector.sort((a, b) => a.data.nombre.localeCompare(b.data.nombre)); 

    let msj = `<div>`
    vector.forEach(e => msj += `<p> ${e.data.nombre} </p>`)
    msj += `</div>`

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Nombres jugadores ordenados alfabéticamente:", msj)
}

/**
 * Función principal para mostrar los datos de todos los jugadores desde el MS y, posteriormente, imprimirla.
 */
Plantilla.mostrarDatosJugadores = function () {
    Plantilla.recupera(Plantilla.imprimeDatos);
}

/**
 * Función para mostrar en pantalla los datos de todos los jugadores que se han recuperado de la BBDD.
 * @param {Vector_de_personas} vector Vector con los datos de las personas a mostrar
 */

Plantilla.imprimeDatos = function (vector) {
    // console.log(vector) // Para comprobar lo que hay en vector
 
    let msj = `<div>`
    vector.forEach(e => msj += ` <h1> Jugador </h1>
        <p> Nombre del jugador: ${e.data.nombre} </p>
        <p> Apellidos del jugador: ${e.data.apellidos} </p>
        <p> Fecha de nacimiento del jugador: ${e.data.fechaNacimiento.dia}/${e.data.fechaNacimiento.mes}/${e.data.fechaNacimiento.anio} </p>
        <p> País del jugador: ${e.data.pais} </p>
        <p> Años competición del jugador: ${e.data.aniosCompeticion} </p>
        <p> Número de campeonatos ganados del jugador: ${e.data.numero_campeonatos_ganados} </p>
        <p> Nombre del equipo del jugador: ${e.data.nombre_equipo} </p>
        <p> Categoría del jugador: ${e.data.categoria} </p>
        <p> Altura del jugador: ${e.data.altura} </p> `)
    msj += `</div>`

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Datos jugadores:", msj)
}

/**
 * Función principal para mostrar los datos de un jugador, además del siguiente o anterior.
 * @param {String} idJugador Identificador del jugador a mostrar
 */
Plantilla.siguienteAnterior = function (idJugador) {
    this.recuperaJugador(idJugador, this.imprimeJugadorSigAnt);
}

/**
 * Función para mostrar en pantalla los detalles de un juagador, además del siguiente o anterior.
 * @param {Plantilla} jugador Datos del jugador a mostrar
 */

Plantilla.imprimeJugadorSigAnt = function (jugador) {
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
    <a href="javascript:Plantilla.mostrarJugador('358542277269782732')" class="opcion-principal"
        title="Muestra todos los datos de un jugador">Jugador anterior</a>
    <a href="javascript:Plantilla.mostrarJugador('358542397918937292')" class="opcion-principal"
        title="Muestra todos los datos de un jugador">Jugador siguiente</a>
    </div>`;

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Mostrar datos del jugador", msj)
}


/**
 * Función para mostrar los datos de todos los jugadores cuyo nombre contenga el texto introducido
 * @param {Vector_de_personas} vector Vector con los datos de las personas a mostrar
 */

Plantilla.incluyeNombre = function (vector) {
    var texto = document.getElementById("id_texto").value;
    let msj = "";

    for(var i=0; i < vector.length; i++){
        let jugador=vector[i].data;
        var nom = jugador.nombre;
        if(nom.includes(texto)){
            msj += `<div> 
            <h1> Jugador </h1>
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
        }
    }

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Jugadores cuyo nombre contiene '" + texto + "'", msj)

}

/**
 * Función para introducir el texto coorespondiente para buscar los jugadores cuyo nombre contienen dicho texto.
 */

Plantilla.buscarNombre = function () {
    let msj = `<div>
    <p> Buscar jugadores cuyo nombre incluye: </p>
    <input type="text" id="id_texto">
    <button onclick="javascript:Plantilla.recupera(Plantilla.incluyeNombre);">Buscar</button>
    </div>`;

    Frontend.Article.actualizar("Buscar jugadores por nombre", msj)
}

/**
 * Función principal para modificar el nombre de un jugador
 * @param {String} idJugador Identificador del jugador a modificar
 */
Plantilla.modificarNombreJugador = function (idJugador) {
    this.recuperaJugador(idJugador, this.modificarNombre);
}

/**
 * Función principal para modificar el nombre de un jugador
 * @param {Plantilla} jugador Datos del jugador a modificar
 */
Plantilla.modificarNombre = function (jugador) {
    let msj = `<div> 
    <label for="nombre">Nombre del jugador:</label>
    <input type="text" id="id_nombre" placeholder=${jugador.data.nombre}>
    <p> Apellidos del jugador: ${jugador.data.apellidos} </p>
    <p> Fecha de nacimiento del jugador: ${jugador.data.fechaNacimiento.dia}/${jugador.data.fechaNacimiento.mes}/${jugador.data.fechaNacimiento.anio} </p>
    <p> País del jugador: ${jugador.data.pais} </p>
    <p> Años competición del jugador: ${jugador.data.aniosCompeticion} </p>
    <p> Número de campeonatos ganados del jugador: ${jugador.data.numero_campeonatos_ganados} </p>
    <p> Nombre del equipo del jugador: ${jugador.data.nombre_equipo} </p>
    <p> Categoría del jugador: ${jugador.data.categoria} </p>
    <p> Altura del jugador: ${jugador.data.altura} </p>
    <button onclick="javascript:Plantilla.recuperaJugador('358542586888061132', Plantilla.guardar);">Guardar</button>
    </div>`;

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Modificar nombre jugador", msj)
}

/**
 * Función para guardar los nuevos datos de una persona
 * @param {Plantilla} jugador Datos del jugador a guardar
 */
Plantilla.guardar = async function (jugador) {
    try {
        let url = Frontend.API_GATEWAY + "/plantilla/setTodo/"
        let id_persona = '358542586888061132'
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify({
                "id_persona": id_persona,
                "nombre_persona": jugador.nombre,
                "apellidos_persona": jugador.apellidos,
                "fecha_persona": jugador.fechaNacimiento,
                "pais_persona": jugador.pais,
                "anios_competicion_persona": jugador.aniosCompeticion,
                "num_campeonatos_persona": jugador.numero_campeonatos_ganados,
                "nombre_equipo_persona": jugador.nombre_equipo,
                "categoria_persona": jugador.categoria,
                "altura_persona": jugador.altura
            }), // body data type must match "Content-Type" header
        })
        /*
        Error: No procesa bien la respuesta devuelta
        if (response) {
            const persona = await response.json()
            alert(persona)
        }
        */
        Plantilla.mostrarJugador(id_persona)
    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway " + error)
        //console.error(error)
    }
}
