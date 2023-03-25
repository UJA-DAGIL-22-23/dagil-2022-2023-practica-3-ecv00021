/**
 * @file server-spec.js
 * @description Fichero con la especificación de las pruebas TDD para server.js del MS MS Plantilla
 *              Este fichero DEBE llamarse server-spec.js
 *              Este fichero DEBE ubicarse en el subdirectorio spec/
 * @author Víctor M. Rivas Santos <vrivas@ujaen.es>
 * @date 03-Feb-2023
 */


const supertest = require('supertest');
const assert = require('assert')
const app = require('../server');

/**
 * Test para las rutas "estáticas": / y /acerdade
 */
describe('Servidor PLANTILLA:', () => {
  describe('Rutas / y /acercade', () => {
    it('Devuelve MS Plantilla Home Page', (done) => {
      supertest(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: home");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
    it('Devuelve MS Plantilla Acerca De', (done) => {
      supertest(app)
        .get('/acercade')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( "BODY ACERCA DE ", res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: acerca de");
          
        })
        .end((error) => { error ? done.fail(error) : done() })
    });
  })

  /**
   * Tests para acceso a la BBDD
   */
  describe('Acceso a BBDD:', () => {
    it('Devuelve ¿¿¿ VALOR ESPERADO ??? al consultar mediante test_db', (done) => {
      supertest(app)
        .get('/test_db')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.nombre === "Elena");

        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  it('Devuelve Fernando al recuperar los datos de la Persona con id 358542021274632397 mediante getPorId', (done) => {
    supertest(app)
      .get('/getPorId/358542021274632397')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
        assert(res.body.data.hasOwnProperty('nombre'));
        assert(res.body.data.nombre === "Fernando");
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });

  it('Devuelve un vector de tamaño 10 al consultar mediante getTodas', (done) => {
    supertest(app)
      .get('/getTodas')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        // console.log( res.body ); // Para comprobar qué contiene exactamente res.body
        assert(res.body.data.length === 10);
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });

  it('Devuelve el nombre cambiado al recuperar los datos de la Persona con id 358542586888061132 mediante setTodo', (done) => {
    const NOMBRE_TEST= 'Pablo'
    const persona = {
      id_persona: '358542586888061132',
      nombre_persona: NOMBRE_TEST,
      apellidos_persona: "Apellidos",
      fecha_persona: {
        "dia": 6,
        "mes": 10,
        "anio": 2002
      },
      pais_persona: "pais",
      anios_competicion_persona: [
        2017,
        2018,
        2020,
        2022
      ],
      num_campeonatos_persona: 1,
      nombre_equipo_persona: "nombre equipo",
      categoria_persona: "categoria",
      altura_persona: 1.85
    };
    supertest(app)
      .post('/setTodo')
      .send(persona)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        //console.log( "Server-spec , /setTodo res.body", res.body ); // Para comprobar qué contiene exactamente res.body
        assert(res.body.data.hasOwnProperty('nombre'));
        assert(res.body.data.nombre === NOMBRE_TEST);
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });


});


