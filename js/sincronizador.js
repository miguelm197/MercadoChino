function Producto(id, nombre, descripcion, precio, precioViejo, descuento, imagen, activo) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.precioViejo = precioViejo;
    this.descuento = descuento;
    this.imagen = imagen;
    this.activo = activo;
}

function Sector(id, seccion) {
    this.id = id;
    this.seccion = seccion;
}

function Tipo(id, seccion, tipo) {
    this.id = id;
    this.seccion = seccion;
    this.tipo = tipo;
}




var imagenes = "./img/productos/";
var urlArchivo = "./datos/";
var archivoProductos = urlArchivo + "productos.csv";
var archivoSecciones = urlArchivo + "secciones.csv";
var archivoTipos = urlArchivo + "tipos.csv";


var productos = [];
var tipos = [];
var secciones = [];

var cargarProductos = function (lista) {
    for (var i = 0; i < lista.length; i++) {
        var valores = Object.values(lista[i]);
        var prod = new Producto(...valores);
        productos.push(prod);
    }
}

var cargarSecciones = function (lista) {
    for (var i = 0; i < lista.length; i++) {
        var valores = Object.values(lista[i]);
        var sec = new Sector(...valores);
        secciones.push(sec);
    }
}

var cargarTipos = function (lista) {
    for (var i = 0; i < lista.length; i++) {
        var idLocal = lista[i].seccion;
        for (var s = 0; s < secciones.length; s++) {
            var idExterior = secciones[s].id;
            if (idLocal == idExterior) {
                var sector = secciones[s];
                var valores = Object.values(lista[i]);
                valores[1] = sector;
                var tip = new Tipo(...valores);
                tipos.push(tip);
            }
        }
    }
}

$(document).ready(function () {
    leer(archivoProductos, ",", cargarProductos);
    leer(archivoSecciones, ";", cargarSecciones);
    leer(archivoTipos, ";", cargarTipos);

    setTimeout(function cargarTipo() {
        cargarTablaProductos(productos)
        cargarTablaMenu();
    }, 1000)
});



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


function cargarTablaProductos(lista) {

    var cont = 0;
    var articulos = "";
    var renglonActual = 0;

    for (var i = 0; i < lista.length; i++) {

        var id = lista[i].id;
        var nombre = lista[i].nombre;
        var descripcion = lista[i].descripcion;
        var precio = lista[i].precio;
        var precioViejo = lista[i].precioViejo;
        var descuento = lista[i].descuento;
        var imagen = imagenes + lista[i].imagen;

        var item = "";

        var parte1 = `
        <div class="articulo col s12 m10 offset-m1 l3">
            <div class="row arriba">
                <div class="izquierda col s4 m6 l6">
                    <div class="antes">
                        <div class="anterior">ANTES</div>
                        <div class="moneda">$</div>
                        <div class="monto">`+ precioViejo + `</div>
                    </div>`
        var descuentoHtml = `
                    <div class="descuento">
                        <div class="monto inline">`+ descuento + `</div>
                        <div class="porcentaje inline">%</div>
                        <div class="off">OFF</div>
                    </div>`
        var parte2 = `
                    <div class="ahora">
                        <div class="ahorita">AHORA</div>
                            <div class="moneda inline b">$</div>
                            <div class="monto inline b">`+ precio + `</div>
                        </div>
                        <div class="vermas">Ver más</div>
                    </div>
                    <div class="derecha col s8 m6 l6">
                        <div class='imagen' style='background-image: url("`+ imagen + `");'></div>
                    </div>
                </div>
                <div class="row abajo">
                    <span>`+ nombre + `</span>
                </div>
            </div>
        </div>`


        item = item + parte1;
        if (descuento > 0) {
            item = item + descuentoHtml;
        }
        item = item + parte2;


        articulos = articulos + item;

    }
    articulos = articulos
    $(".contenedor-articulos").append(articulos);
}


function cargarTablaMenu() {
    var menu = "";
    for (var s = 0; s < secciones.length; s++) {
        var seccionT = secciones[s].seccion;
        var sector = secciones[s].id;
        menu = menu + `<li>\n<div class="collapsible-header">` + seccionT + `</div>\n`
        for (var t = 0; t < tipos.length; t++) {
            var seccion = tipos[t].seccion.id;
            if (seccion == sector) {
                var tipo = tipos[t].tipo;
                menu = menu + `<div class="collapsible-body"><a><span>-  ` + tipo + `</span></a></div></div>\n`
            }
        }
        menu = menu + "</li>\n"
    }
    $(".sectorizado").append(menu);
}