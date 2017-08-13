
//alertifyjs.com/
var ventana = {
    alto: 0,
    ancho: 0,
    mobile: true,
    anchoMobile: 1000,
    posicion: 0,
    usuario: null
}

function Usuario(id, nombre, clave, correo) {
    this.id = id;
    this.nombre = nombre;
    this.clave = clave;
    this.correo = correo;
}
var urlArchivo = "./datos/";
var archivoUsuarios = urlArchivo + "usuarios.csv";

var usuarios = [];


var cargarUsuarios = function (lista) {
    for (var i = 0; i < lista.length; i++) {
        var valores = Object.values(lista[i]);
        var usr = new Usuario(...valores);
        usuarios.push(usr);
    }
}

function leer(urlArchivo, separador, funcion) {
    $.ajax({
        url: urlArchivo,
        dataType: "text",
        success: function (hola) {
            var filas = hola.split("\r\n");
            var coleccion = [];
            var cabezal = [];

            for (var i = 1; i < filas.length; i++) {
                var datos = filas[i].split(separador);
                var valor = "";
                var hayComillas = false;
                var valores = [];

                for (var d = 0; d < datos.length; d++) {
                    var texto = datos[d];
                    var comillas = texto.indexOf('"');

                    if (comillas != -1) {
                        valor = valor + texto;

                        if (hayComillas) {
                            hayComillas = false;
                        } else {
                            hayComillas = true;
                        }

                    } else {

                        if (hayComillas) {
                            valor = valor + separador + texto + separador;
                        } else {
                            valor = texto;
                        }
                    }
                    if (!hayComillas) {
                        valores.push(valor);
                        valor = "";
                    }
                }
                var cabezal = filas[0];
                var cab = cabezal.split(separador);
                var objprueba = new Object();

                for (var u = 0; u < cab.length; u++) {
                    var llave = cab[u];
                    var valor = valores[u];
                    objprueba[llave] = valor;
                }

                coleccion.push(objprueba);
            }
            funcion(coleccion);
        }
    });
}


$(document).ready(function () {

    $("header").load("./navbar.html");
    $(".modalLogin").load("./login.html");

    setTimeout(function cargarTipo() {
        $(".button-collapse").sideNav();
    }, 1000)


    $('.parallax').parallax();
    $('.carousel.carousel-slider').carousel({ fullWidth: true });
    ventana.posicion = $(window).scrollTop();

    $(document).ready(function () {
        $('.tooltipped').tooltip({ delay: 50 });
    });

    dimensiones();
    mobileDetect();
    calcularPrincipal();
    calcularAparienciaNav();

    $("html, body").animate({
        scrollTop: 1
    }, 1);

    leer(archivoUsuarios, ";", cargarUsuarios);


    $('.materialboxed').materialbox();

});


function mobileDetect() {
    console.log("\n\nancho de la ventana: " + ventana.ancho);
    if (ventana.ancho > ventana.anchoMobile) {
        ventana.mobile = false;
    } else {
        ventana.mobile = true;
    }
    console.log("propiedad mobile: " + ventana.mobile);
}

function dimensiones() {
    ventana.alto = $(window).height();
    ventana.ancho = $(window).width();
}

$(window).resize(function () {
    dimensiones();
    mobileDetect();
});

$(window).scroll(function () {
    ventana.posicion = $(window).scrollTop();
    calcularAparienciaNav();
});


function slideSiguiente() {
    $('.carousel').carousel('next', 1);
}

function slideAnterior() {
    $('.carousel').carousel('prev', 1);
}

setInterval(function () { slideSiguiente() }, 7000);


function irContacto() {
    var posicion = $("#contacto").offset().top - 100;
    $("html, body").animate({
        scrollTop: posicion
    }, 2000);
}

function irNosotros() {
    var posicion = $("#nosotros").offset().top - 100;
    $("html, body").animate({
        scrollTop: posicion
    }, 2000);
}

function irInicio() {
    $("html, body").animate({
        scrollTop: 0
    }, 2000);
}

function irSeccion1() {
    var posicion = $(".seccion1").offset().top;
    $("html, body").animate({
        scrollTop: posicion
    }, 2000);
}







function calcularPrincipal() {
    if (ventana.mobile) {
        console.log("\n\nSeteando imagen para mobile...")
        $(".principalParallax").height(ventana.alto);
        $(".portada").attr("src", "img/oferta1.jpg");
    } else {
        if (ventana.alto < 900) {
            $(".principalParallax").height(ventana.alto);
            $(".parallax-container").height(ventana.alto);
            $(".portada").attr("src", "img/Dormitorio3.jpg");
        } else {
            var seccion1 = $(".seccion1").height();
            $(".principalParallax").height(ventana.alto - seccion1);
            $(".portada").attr("src", "img/Dormitorio2.jpg");
        }
    }
}


function calcularAparienciaNav() {
    // var posicion_seccion1 = $(".seccion1").offset().top;
    var posicion_seccion1 = $(".portadaPrincipal").height();
    if (ventana.posicion < posicion_seccion1) {
        $(".nav-wrapper").addClass("navPrincipal");
        $("nav").addClass("navPrincipalSinShad");
        $(".menuArriba").addClass("navPrincipalMenu");

    } else {
        $(".nav-wrapper").removeClass("navPrincipal");
        $("nav").removeClass("navPrincipalSinShad");
        $(".menuArriba").removeClass("navPrincipalMenu");

    }
}

function ocultarModalLogin() {
    $(".contenedorLogin").animate({ top: "-100%" }, 500, function () {
        $(".fondoLogin").animate({ opacity: "0" }, 500, function () {
            $(".contenedorLogin").animate({ top: "150%" });
            $(".modalLogin").addClass("inactivo");
        });
    });
}
function abrirIniciarLogin() {
    $(".modalLogin").removeClass("inactivo");
    $(".iniciar").removeClass("inactivo");
    $(".registrar").addClass("inactivo");

    $(".fondoLogin").animate({ opacity: "0.8" }, 1000);
    $(".contenedorLogin").animate({ top: "50%" }, 500);

}
function abrirRegistrarLogin() {
    $(".modalLogin").removeClass("inactivo");
    $(".iniciar").addClass("inactivo");
    $(".registrar").removeClass("inactivo");

    $(".fondoLogin").animate({ opacity: "0.8" }, 1000);
    $(".contenedorLogin").animate({ top: "50%" }, 500);
}


function iniciarSesionU() {
    var correo = $("#inicioUsuario").val();
    var clave = $("#inicioClave").val();
    iniciarSesion(correo, clave);
}

function iniciarSesion(correo, clave) {
    if (correo != "") {



        if (existenciaUsuario(correo)) {
            if (validarClaveUsuario(correo, clave)) {
                var usuario = obtenerUsuario(correo);
                ventana.usuario = usuario;
                $(".login").addClass("inactivo");
                $(".usuario").removeClass("inactivo");
                $("#usurioVentana").text(ventana.usuario.nombre);
                ocultarModalLogin();
                Materialize.Toast.removeAll();
            } else {
                Materialize.toast('Correo o clave incorrecta', 4000);
            }
        } else {
            Materialize.toast('El correo no está registrado', 4000);
        }
    } else {
        Materialize.toast('No ha ingresado un correo', 4000);
    }
}

function validarClaveUsuario(correo, clave) {
    for (var u = 0; u < usuarios.length; u++) {
        var correoU = usuarios[u].correo;
        var claveU = usuarios[u].clave;

        if ((correoU == correo) && (claveU == clave)) {
            return true;
        }
    }
    return false;
}

function existenciaUsuario(correo) {
    for (var u = 0; u < usuarios.length; u++) {
        var correoU = usuarios[u].correo;
        if (correoU == correo) {
            return true;
        }
    }
    return false;
}

function obtenerUsuario(correo) {
    for (var u = 0; u < usuarios.length; u++) {
        var correoU = usuarios[u].correo;
        if (correoU == correo) {
            return usuarios[u];
        }
    }
}

function cerrarSesionLogin() {
    ventana.usuario = null;
    $(".login").removeClass("inactivo");
    $(".usuario").addClass("inactivo");
}


function registrarUsuario() {
    var nombre = $("#registrarNombre").val();
    var correo = $("#registrarCorreo").val();
    var claveUno = $("#registrarClaveUno").val();
    var claveDos = $("#registrarClaveDos").val();

    if (!existenciaUsuario(correo)) {
        if (claveUno == claveDos) {
            var id = usuarios.length;
            var clave = claveUno;

            var usr = new Usuario(id, nombre, clave, correo);
            usuarios.push(usr);

            iniciarSesion(correo, clave);
        } else {
            alert("Las contraseñas no son iguales");
        }
    } else {
        alert("El correo ya está registrado");
    }

}