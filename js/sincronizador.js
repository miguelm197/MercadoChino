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

function Relacion(id, sector, tipo) {
    this.id = id;
    this.sector = sector;
    this.tipo = tipo;
}


var imagenes = "./img/productos/";
var urlArchivo = "./datos/";
var archivoProductos = urlArchivo + "productos.csv";
var archivoSecciones = urlArchivo + "secciones.csv";
var archivoTipos = urlArchivo + "tipos.csv";
var archivoRelaciones = urlArchivo + "relaciones.csv";



var productos = [];
var tipos = [];
var secciones = [];
var carrito = [];
var relaciones = [];

var idProdVistaPrevia = 0;
var vistaProductoActiva = true;
var contVistas = 0;


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

var cargarRelaciones = function (lista) {
    var coleccion = [];

    console.log(lista);
    for (var l = 0; l < lista.length; l++) {
        var idProducto = lista[l].id;
        var idTipo = lista[l].tipo;

        var objProd = consultaProducto(idProducto);
        var objTipo = consultaTipo(idTipo);
        var objSecc = objTipo.seccion;

        var relacion = new Relacion(objProd, objSecc, objTipo);

        relaciones.push(relacion);
    }

}


// ===========================================================
// AGREGAR USUARIOS
// ALTAS 
// LINQUEAR ENLACES DE LOS MENUES
// ACOMODAR VISTA PREVIA
// ===========================================================




$(document).ready(function () {
    leer(archivoProductos, ",", cargarProductos);
    leer(archivoSecciones, ";", cargarSecciones);
    leer(archivoTipos, ";", cargarTipos);
    leer(archivoRelaciones, ";", cargarRelaciones);

    setTimeout(function cargarTipo() {
        cargarTablaProductos(productos)
        cargarTablaMenu();
    }, 1000);
});




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

        var visibilidad = "visible";

        if (descuento <= 0) {
            visibilidad = "invisible";
        }

        var item = `
        <div class="articulo col s12 m8 offset-m2 l3">
            <div class="row arriba">
                <div class="izquierda col s4 m6 l6">
                    <div class="antes">
                        <div class="anterior">ANTES</div>
                        <div class="moneda">$</div>
                        <div class="monto">`+ precioViejo + `</div>
                    </div>
                    <div class="descuento `+ visibilidad + `">
                        <div class="monto inline">`+ descuento + `</div>
                        <div class="porcentaje inline">%</div>
                        <div class="off">OFF</div>
                    </div>
                    <div class="ahora">
                        <div class="ahorita">AHORA</div>
                            <div class="moneda inline b">$</div>
                            <div class="monto inline b">`+ precio + `</div>
                        </div>
                        <div class="vermas" onclick="verProducto(`+ id + `)">Ver más</div>
                        <div class="btn agrAlCarrito" onclick="agregarItmAlCarrito(`+ id + `)">Agregar</div>
                    </div>
                    <div class="derecha col s8 m6 l6">
                        <div class='imagen' onclick="verProducto(`+ id + `)" style='background-image: url("` + imagen + `");'></div>
                    </div>
                </div>
                <div class="row abajo">
                    <span>`+ nombre + `</span>
                </div>
            </div>
        </div>`

        $(".contenedor-articulos").append(item);
    }


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
                var idTipo = tipos[t].id;
                menu = menu + `<div class="collapsible-body"><a onclick="consultarPorTipo(` + idTipo + `)"><span>-  ` + tipo + `</span></a></div></div>\n`
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

    if (contVistas == 0) {
        $('.tap-target').tapTarget('open');
        contVistas++;
    }
}

function verProducto(idProducto) {

    idProdVistaPrevia = idProducto;

    var nombre;
    var descripcion;
    var precio;
    var precioViejo;
    var descuento;
    var imagen;
    var cantidad;

    for (var p = 0; p < productos.length; p++) {
        var id = productos[p].id;
        if (id == idProducto) {
            nombre = productos[p].nombre;
            descripcion = productos[p].descripcion;
            precio = productos[p].precio;
            precioViejo = productos[p].precioViejo;
            descuento = productos[p].descuento;
            imagen = productos[p].imagen;
            cantidad = consultarCantProducto(id);

            // console.log("***************************************");
            // console.log(nombre)
            // console.log(descripcion)
            // console.log(precio)
            // console.log(descuento)
            // console.log(imagen)
            // console.log(cantidad)
            // console.log("***************************************");

            $("#nombreVP").html(nombre);
            $("#descripcionVP").html(descripcion);
            $("#precioViejoVP").html(precioViejo);
            $("#descuentoVP").html(descuento);
            $("#precioVP").html(precio);
            $("#cantidadArticulo").val(cantidad);
            $("#imagenVP").attr('src', 'img/productos/' + imagen);
            activarVistaProductos();

        }
    }
}



var Itm = function (key, cantidad) {
    this.key = key;
    this.cantidad = cantidad;
}

function agregarAlCarrito() {
    agregarItmAlCarrito(idProdVistaPrevia);
}

function agregarItmAlCarrito(id) {
    var cantidad = 1;
    var idProducto = id;
    var obj = new Itm(idProducto, cantidad);

    if (existenciaProducto(idProducto)) {
        console.log("Ya existe el prod en el carrito");
        aumentarCantProducto(idProducto, 1);
    } else {
        carrito.push(obj);
    }
    console.log(carrito);
    actualizarCarrito()


    cantidad = consultarCantProducto(id);
    $("#cantidadArticulo").val(cantidad);

}

function eliminarDelCarrito(id) {

    var pos = consultaIndiceItmCarrito(id);
    carrito.splice(pos, 1);

    actualizarCarrito();
}

function agregarCantidadProducto() {
    var id = idProdVistaPrevia;
    var cant = $("#cantidadArticulo").val();

    for (var p = 0; p < carrito.length; p++) {
        var idProdCarrito = carrito[p].key;
        if (id == idProdCarrito) {
            carrito[p].cantidad = cant;
        }
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    var lista = "";
    var totalCarrito = 0;

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
                        <a class="eliminar" onclick="eliminarDelCarrito(`+ id + `)">Eliminar</a>
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
        totalCarrito = totalCarrito + total;
    }
    $(".contenedor-carrito").html(lista);

    $("#totalCarrito").html("Total $" + totalCarrito);


    if (consultaCantidadProductosEnCarrito() == 0) {
        $("#totalCarrito").html("El carrito está vacío");

    }
}

function limpiarGondola() {
    $(".contenedor-articulos").html("");

}





function consultarPorTipo(tipo) {
    var consulta = [];
    for (var r = 0; r < relaciones.length; r++) {
        var idTipo = relaciones[r].tipo.id;

        if (idTipo == tipo) {
            var idProd = relaciones[r].id.id;
            var prod = consultaProducto(idProd);
            consulta.push(prod);
        }
    }
    limpiarGondola();
    cargarTablaProductos(consulta);
}
function consultarPorSeccion(seccion) {
    var consulta = [];
    for (var r = 0; r < relaciones.length; r++) {
        var idSeccion = relaciones[r].tipo.seccion.id

        if (idSeccion == seccion) {
            var idProd = relaciones[r].id.id;
            var prod = consultaProducto(idProd);
            consulta.push(prod);
        }
    }
    limpiarGondola();
    cargarTablaProductos(consulta);
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
            carrito[p].cantidad = parseInt(cant) + parseInt(valor);
        }
    }
}

function consultarCantProducto(id) {
    for (var p = 0; p < carrito.length; p++) {
        var idProdCarrito = carrito[p].key;
        if (id == idProdCarrito) {
            var cant = carrito[p].cantidad;
            return cant;
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

function consultaIndiceItmCarrito(id) {
    if (existenciaProducto(id)) {

        for (var p = 0; p < carrito.length; p++) {
            var idProdCarrito = carrito[p].key;
            if (id == idProdCarrito) {
                return p;
            }
        }

    }
}

function consultaCantidadProductosEnCarrito() {
    var cantidad = carrito.length;
    return cantidad;
}

function consultaProducto(id) {

    for (var p = 0; p < productos.length; p++) {
        idProd = productos[p].id;
        if (idProd == id) {
            return productos[p];
        }
    }
}

function consultaTipo(id) {
    for (var t = 0; t < tipos.length; t++) {
        idTipo = tipos[t].id;
        if (idTipo == id) {
            return tipos[t];
        }
    }
}

