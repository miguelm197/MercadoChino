
//alertifyjs.com/

$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    $('.carousel.carousel-slider').carousel({ fullWidth: true });



    var ventana_ancho = $(window).width();
    var ventana_alto = $(window).height();
    // alert(ventana_ancho);
    // alert(ventana_alto);
});

function slideSiguiente() {
    $('.carousel').carousel('next', 1); // Move next n times.
}

function slideAnterior() {
    $('.carousel').carousel('prev', 1); // Move next n times.
}

setInterval(function () { slideSiguiente() }, 3000000);

// $(window).resize(function () {
//     var ventana_ancho = $(window).width();
//     var ventana_alto = $(window).height();
//     alert(ventana_ancho);
//     alert(ventana_alto);
// });