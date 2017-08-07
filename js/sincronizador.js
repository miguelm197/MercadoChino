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
var carrito = [];

var idProdVistaPrevia = 0;
var vistaProductoActiva = true;



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
                        <div class="vermas" onclick="verProducto(`+ id + `)">Ver más</div>
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

function activarVistaProductos() {
    if (vistaProductoActiva) {
        vistaProductoActiva = false;
        $(".vistaArticulo").addClass("activo");
        $(".vistaArticulo").removeClass("inactivo");
    } else {
        vistaProductoActiva = true;
        $(".vistaArticulo").addClass("inactivo");
        $(".vistaArticulo").removeClass("activo");
    }
}

function verProducto(idProducto) {
    console.log(idProducto);
    idProdVistaPrevia = idProducto;

    var nombre;
    var descripcion;
    var precio;
    var precioViejo;
    var descuento;
    var imagen;

    for (var p = 0; p < productos.length; p++) {
        var id = productos[p].id;
        if (id == idProducto) {
            nombre = productos[p].nombre;
            descripcion = productos[p].descripcion;
            precio = productos[p].precio;
            precioViejo = productos[p].precioViejo;
            descuento = productos[p].descuento;
            imagen = productos[p].imagen;
            console.log("***************************************");
            console.log(nombre)
            console.log(descripcion)
            console.log(precio)
            console.log(descuento)
            console.log(imagen)
            console.log("***************************************");

            $("#nombreVP").html(nombre);
            $("#descripcionVP").html(descripcion);
            $("#precioViejoVP").html(precioViejo);
            $("#descuentoVP").html(descuento);
            $("#precioVP").html(precio);
            $("#imagenVP").css('background-image', 'url("./img/productos/' + imagen + '")');

            activarVistaProductos();
        }
    }
}



var Itm = function (key, cantidad) {
    this.key = key;
    this.cantidad = cantidad;
}


function agregarAlCarrito() {
    var cantidad = 1;
    var idProducto = idProdVistaPrevia;
    var obj = new Itm(idProducto, cantidad);

    if (existenciaProducto(idProducto)) {
        console.log("Ya existe el prod en el carrito");
        aumentarCantProducto(idProducto, 1);
    } else {
        carrito.push(obj);
    }
    console.log(carrito);
    actualizarCarrito()
}



function actualizarCarrito() {
    var lista = "";

    for (var c = 0; c < carrito.length; c++) {
        var id = carrito[c].key;
        var cantidad = carrito[c].cantidad;
        var nombre = consultarPropiedadProducto(id, "nombre");
        var precio = consultarPropiedadProducto(id, "precio");
        var imagen = consultarPropiedadProducto(id, "imagen");
        var total = precio * cantidad;

        var item = `
            <div class="tarjeta">
                <div class="arriba">
                    <div class="imagen" style='background-image:url("./img/productos/` + imagen + `")'></div>
                </div>
                <div class="abajo">
                    <div class="renglonUp">
                        <div class="nombre">`+ nombre + `</div>
                    </div>
                    <div class="renglonDown">
                        <div class="monedaU inline">$</div>
                        <div class="montoU inline">`+ precio + `</div>
                        <div class="cnatidad inline">`+ cantidad + `</div>
                        <div class="unidades inline">Unid.</div>
                        <div class="total inline">Total:</div>
                        <div class="monedaT inline">$</div>
                        <div class="montoT inline">`+ total + `</div>
                     </div>
                </div>
            </div>
        `
        lista = lista + item;
    }
    $(".contenedor-carrito").html(lista);
}






function existenciaProducto(id) {
    for (var p = 0; p < carrito.length; p++) {
        var idProdCarrito = carrito[p].key;
        if (id == idProdCarrito) {
            return true;
        }
    }
    return false;
}

function aumentarCantProducto(id, valor) {
    for (var p = 0; p < carrito.length; p++) {
        var idProdCarrito = carrito[p].key;
        if (id == idProdCarrito) {
            var cant = carrito[p].cantidad;
            carrito[p].cantidad = cant + valor;
        }
    }
}

function consultarPropiedadProducto(id, propiedad) {
    for (var p = 0; p < productos.length; p++) {
        idProd = productos[p].id;
        if (idProd == id) {
            var valor = productos[p][propiedad];
            return valor;
        }
    }
}

