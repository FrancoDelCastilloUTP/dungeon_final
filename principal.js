var juego = new Phaser.Game(370, 550, Phaser.CANVAS, "bloque_juego");
var persona;
var persona_ataques;
var enemigo;
var llave;
var colisiones;
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;
var ultimaDireccion;
var contador;
var keyAttack;
var attacking = false;
var ataqueDetectado = false;
var contador = 0;
var textoIntro;
var textoVictoria;
var txtPuntos;
var llaveRecogida = false;
var pantallaPresentacion;
var tiempoPresentacion;

function updateMouseCoordinates(pointer, x, y) {
  console.log("Coords: x " + Math.floor(x) + ", y " + Math.floor(y));
}

function recogerLlave(persona, llave) {
  llave.destroy();
  console.log("¡Llave recogida!");
  mostrarPantallaVictoria(persona);
  juego.time.events.add(Phaser.Timer.SECOND * 2, reiniciarJuego, this);
}

function mostrarPantallaVictoria() {
  textoVictoria.visible = true;
}

function reiniciarJuego() {
  juego.state.restart();
}

function iniciarAudio() {
  var musicaFondo = juego.add.audio("musicaFondo");
  musicaFondo.volume = 0.1;
  musicaFondo.loop = true; // Repetir en bucle
  musicaFondo.play();
}

var estadoPantallaPresentacion = {
  preload: function () {
    juego.load.audio("musicaFondo", "audio/music.mp3");
    juego.load.image("pantallaPresentacion", "img/intro.png");
    juego.load.image("boton", "img/btn.png");
  },
  create: function () {
    juego.add.sprite(0, 0, "pantallaPresentacion");
    juego.add.button(135, 357, "boton", this.iniciarJuego, this);

    // Agregar el texto "Trabajo Final"
    juego.add
      .text(
        juego.world.centerX,
        juego.world.centerY - 60, // Ajusta la posición vertical
        "Trabajo Final",
        { font: "40px Arial", fill: "#ffffff" }
      )
      .anchor.setTo(0.5, 0.5);

    // Agregar el texto "Nombres"
    juego.add
      .text(
        juego.world.centerX,
        juego.world.centerY, // Ajusta la posición vertical
        "Franco Del Castillo",
        { font: "30px Arial", fill: "#ffffff" }
      )
      .anchor.setTo(0.5, 0.5);

    // Agregar el texto "DNI"
    juego.add
      .text(
        juego.world.centerX,
        juego.world.centerY + 40, // Ajusta la posición vertical
        "U19211467",
        { font: "30px Arial", fill: "#ffffff" }
      )
      .anchor.setTo(0.5, 0.5);
    
    

  },
  iniciarJuego: function () {
    iniciarAudio();
    juego.state.start("principal");
  },
};

var estadoPrincipal = {
  preload: function () {
    juego.load.image("fondo", "img/walls_dungeon.png");
    juego.load.spritesheet("personaje", "img/player_sprites.png", 40, 50);
    juego.load.spritesheet(
      "personaje_ataques",
      "img/player_attacks.png",
      68,
      50
    );
    juego.load.spritesheet("enemigo", "img/enemy_sprites.png", 40, 36);
    juego.load.spritesheet("llave", "img/key.png", 22, 16);
  },
  create: function () {
    juego.physics.startSystem(Phaser.Physics.ARCADE);

    juego.add.tileSprite(0, 0, 370, 550, "fondo");

    llave = juego.add.sprite(185, 110, "llave");
    llave.anchor.setTo(0.5, 0.5);
    juego.physics.arcade.enable(llave);
    llave.body.setSize(4, 4, 0, 0);
    llave.body.immovable = true;

    // Animaciones de Enemigo
    llave.animations.add("llaveFinal", [0, 1, 2, 3], 5, true);

    enemigo = juego.add.sprite(180, 210, "enemigo");
    enemigo.anchor.setTo(0.5, 0.5);
    juego.physics.arcade.enable(enemigo);
    enemigo.body.setSize(30, 30, 5, 4);
    enemigo.body.immovable = true;

    // Animaciones de Enemigo
    enemigo.animations.add("idleEnemy", [0, 1, 2, 3, 4, 5], 10, true);
    enemigo.animations.add("damageEnemy", [6, 7, 8], 10, false);

    persona = juego.add.sprite(60, 280, "personaje");
    persona.anchor.setTo(0.5, 0.5);
    juego.physics.arcade.enable(persona);
    persona.body.setSize(36, 40, 2, 2);

    // Animaciones de Player
    persona.animations.add("idle", [0, 1, 2, 3, 4, 5], 10, true);
    persona.animations.add("idleRight", [6, 7, 8, 9, 10, 11], 10, true);
    persona.animations.add("idleBack", [12, 13, 14, 15, 16, 17], 10, true);

    persona.animations.add("moveAbajo", [18, 19, 20, 21, 22, 23], 10, true);
    persona.animations.add("moveDerecha", [24, 25, 26, 27, 28, 29], 10, true);
    persona.animations.add("moveArriba", [30, 31, 32, 33, 34, 35], 10, true);

    persona_ataques = juego.add.sprite(60, 360, "personaje_ataques");
    persona_ataques.anchor.setTo(0.5, 0.5);
    juego.physics.arcade.enable(persona_ataques);
    persona_ataques.body.setSize(40, 40, 0, 0);

    persona_ataques.animations.add("attack", [0, 1, 2, 3], 10, false);
    persona_ataques.animations.add("attackRight", [4, 5, 6, 7], 10, false);
    persona_ataques.animations.add("attackBack", [8, 9, 10, 11], 10, false);

    persona_ataques.visible = false;

    // TECLA MOVIMIENTOS
    teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    teclaArriba = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    teclaAbajo = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    // TECLA ATAQUE
    keyAttack = juego.input.keyboard.addKey(Phaser.Keyboard.A);

    // ANIMACIONES POR DEFECTO
    persona.animations.play("idle");
    enemigo.animations.play("idleEnemy");
    llave.animations.play("llaveFinal");

    // COLISIONES ESCENARIO
    colisiones = juego.add.group();
    colisiones.enableBody = true;
    colisiones.physicsBodyType = Phaser.Physics.ARCADE;

    // COLISIONES ESCENARIO - ZONA SUPERIOR
    var colisionSuperior = colisiones.create(0, 0, null);
    colisionSuperior.body.setSize(370, 50);
    colisionSuperior.body.immovable = true;

    var colisionIzquierdaSuperior = colisiones.create(0, 68, null);
    colisionIzquierdaSuperior.body.setSize(70, 90);
    colisionIzquierdaSuperior.body.immovable = true;

    var colisionDerechaSuperior = colisiones.create(298, 68, null);
    colisionDerechaSuperior.body.setSize(74, 90);
    colisionDerechaSuperior.body.immovable = true;

    // COLISIONES ESCENARIO - ZONA MEDIO
    var colisionMedioIzquierda = colisiones.create(0, 166, null);
    colisionMedioIzquierda.body.setSize(140, 60);
    colisionMedioIzquierda.body.immovable = true;

    var colisionMedioDerecha = colisiones.create(225, 166, null);
    colisionMedioDerecha.body.setSize(140, 60);
    colisionMedioDerecha.body.immovable = true;

    // COLISIONES ESCENARIO - ZONA INFERIOR
    var colisionInferior = colisiones.create(0, 465, null);
    colisionInferior.body.setSize(370, 50);
    colisionInferior.body.immovable = true;

    var colisionIzquierdaInferior = colisiones.create(0, 248, null);
    colisionIzquierdaInferior.body.setSize(20, 220);
    colisionIzquierdaInferior.body.immovable = true;

    var colisionDerechaInferior = colisiones.create(344, 248, null);
    colisionDerechaInferior.body.setSize(20, 220);
    colisionDerechaInferior.body.immovable = true;

    contador = 0;

    // juego.input.addMoveCallback(updateMouseCoordinates, this);

    //TEXTO INTRO
    textoIntro = juego.add.text(
      juego.world.centerX,
      juego.world.centerY,
      "Trabajo Final",
      { font: "40px Arial", fill: "#ffffff" }
    );
    textoIntro.anchor.setTo(0.5, 0.5);
    textoIntro.visible = false;

    // TEXTO FINAL VICTORIA
    textoVictoria = juego.add.text(
      juego.world.centerX,
      juego.world.centerY,
      "YOU WON!",
      { font: "40px Arial", fill: "#ffffff" }
    );
    textoVictoria.anchor.setTo(0.5, 0.5);
    textoVictoria.visible = false;

    //puntaje en pantalla
    puntos = 0;
    juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#FFF" });
    txtPuntos = juego.add.text(80, 20, "", {
      font: "14px Arial",
      fill: "#FFF",
    });
  },
  update: function () {
    var moviendo = false;

    // Verificar colisiones entre el personaje y las zonas de colisión
    juego.physics.arcade.collide(persona, colisiones);
    juego.physics.arcade.collide(enemigo, colisiones);
    juego.physics.arcade.collide(persona, llave, recogerLlave, null, this);

    persona.body.velocity.x = 0;
    persona.body.velocity.y = 0;

    if (llave.visible === false && llaveRecogida === false) {
      console.log("llave recogida");
      persona_ataques.visible = false;
      persona.visible = false;
      puntos += 1000;
      txtPuntos.text = puntos;
      llaveRecogida = true;
    }

    if (attacking == false) {
      persona_ataques.visible = false;
      persona.visible = true;
    }

    if (teclaDerecha.isDown) {
      persona.body.velocity.x = 10;
      persona.position.x += 2;
      persona.scale.x = 1;
      persona.animations.play("moveDerecha");
      moviendo = true;
      attacking = false;
      ultimaDireccion = "derecha";
    } else if (teclaIzquierda.isDown) {
      persona.position.x -= 2;
      persona.body.velocity.x = -10;
      persona.scale.x = -1;
      persona.animations.play("moveDerecha");
      moviendo = true;
      attacking = false;
      ultimaDireccion = "izquierda";
    } else if (teclaArriba.isDown) {
      persona.position.y -= 2;
      persona.body.velocity.y = -10;
      persona.animations.play("moveArriba");
      moviendo = true;
      attacking = false;
      ultimaDireccion = "arriba";
    } else if (teclaAbajo.isDown) {
      persona.body.velocity.y = 10;
      persona.position.y += 2;
      persona.animations.play("moveAbajo");
      moviendo = true;
      attacking = false;
      ultimaDireccion = "abajo";
    }

    if (!moviendo && !attacking) {
      if (ultimaDireccion === "arriba") {
        persona.animations.play("idleBack");
      } else if (ultimaDireccion === "derecha") {
        persona.animations.play("idleRight");
      } else if (ultimaDireccion === "izquierda") {
        persona.scale.x = -1;
        persona.animations.play("idleRight");
      } else if (ultimaDireccion === "abajo") {
        persona.animations.play("idle");
      }
    }

    if (keyAttack.isDown) {
      attacking = true;
    }

    if (attacking && !moviendo) {
      switch (ultimaDireccion) {
        case "arriba":
          persona_ataques.position.x = persona.position.x;
          persona_ataques.position.y = persona.position.y;
          persona_ataques.visible = true;
          persona.visible = false;
          persona_ataques.animations
            .play("attackBack")
            .onComplete.add(function () {
              persona.animations.play("idleBack");
              attacking = false;
            });
          break;
        case "abajo":
          persona_ataques.position.x = persona.position.x;
          persona_ataques.position.y = persona.position.y;
          persona_ataques.visible = true;
          persona.visible = false;
          persona_ataques.animations.play("attack").onComplete.add(function () {
            persona.animations.play("idle");
            attacking = false;
          });
          break;
        case "derecha":
          persona_ataques.position.x = persona.position.x;
          persona_ataques.position.y = persona.position.y;
          persona_ataques.visible = true;
          persona.visible = false;
          persona_ataques.scale.x = 1;
          persona_ataques.animations
            .play("attackRight")
            .onComplete.add(function () {
              persona.animations.play("idleRight");
              attacking = false;
            });
          break;
        case "izquierda":
          persona_ataques.position.x = persona.position.x;
          persona_ataques.position.y = persona.position.y;
          persona_ataques.visible = true;
          persona.visible = false;
          persona_ataques.scale.x = -1;

          persona_ataques.animations
            .play("attackRight")
            .onComplete.add(function () {
              persona.animations.play("idleRight");
              attacking = false;
            });
          break;
        default:
          persona_ataques.position.x = persona.position.x;
          persona_ataques.position.y = persona.position.y;
          persona_ataques.visible = true;
          persona.visible = false;
          persona_ataques.animations.play("attack").onComplete.add(function () {
            persona.animations.play("idle");
            attacking = false;
          });
          break;
      }
    }

    // Detectar colisiones entre el personaje y el enemigo
    juego.physics.arcade.collide(persona, enemigo);

    if (
      persona.x >= enemigo.x - enemigo.width / 2 &&
      persona.x <= enemigo.x + enemigo.width / 2 &&
      persona.y >= enemigo.y &&
      persona.y <= enemigo.y + persona.y / 2
    ) {
      if (keyAttack.isDown) {
        // Verificar si la tecla A está presionada
        if (
          persona.y > enemigo.y &&
          persona.animations.getAnimation("idleBack").isPlaying
        ) {
          if (!ataqueDetectado) {
            enemigo.animations.play("damageEnemy").onComplete.add(function () {
              enemigo.animations.play("idleEnemy");
            });
            // Solo incrementar el contador una vez por pulsación
            console.log("¡Enemigo atacado!");
            contador++;
            console.log("Contador de ataques:", contador);
            ataqueDetectado = true; // Marcar que el ataque ha sido detectado

            if (contador === 3) {
              enemigo.kill();
              puntos += 100;
              txtPuntos.text = puntos;
            }
          }
        }
      } else {
        ataqueDetectado = false; // Resetear la detección de ataque cuando se suelta la tecla
      }
    }
  },

  // render: function () {
  //   juego.debug.body(persona, "rgba(0, 255, 0, 0.2)");
  //   juego.debug.body(enemigo, "rgba(255, 0, 0, 0.2)");
  // },
};

juego.state.add("pantallaPresentacion", estadoPantallaPresentacion);
juego.state.add("principal", estadoPrincipal);
juego.state.start("pantallaPresentacion");
