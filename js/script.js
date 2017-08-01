
//alertifyjs.com/
var ventana = {
    alto: 0,
    ancho: 0,
    mobile: true,
    anchoMobile: 1000,
    posicion: 0
}



$(document).ready(function () {

    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    $('.carousel.carousel-slider').carousel({ fullWidth: true });
    ventana.posicion = $(window).scrollTop();

    dimensiones();
    mobileDetect();
    calcularPrincipal();
    calcularAparienciaNav();
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
    console.log("hola")
    alert("posicion")
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
        var seccion1 = $(".seccion1").height();
        $(".principalParallax").height(ventana.alto - seccion1);
        $(".portada").attr("src", "img/Dormitorio2.jpg");
    }
}


function calcularAparienciaNav() {
    var posicion_seccion1 = $(".seccion1").offset().top;
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