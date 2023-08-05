let listaTrakingsCaja = {};
let detalles = {};

function openModalMatriz(id, nombre, tipo) {

    if (tipo == 1) {
        getTrackingsCajaMatriz(id, nombre);
    } else {
        getTrackingsVueloMatriz(id, nombre);
    }

    getFechasEntidad(nombre)

    detalles = {
        'nombre': nombre,
        'id': id,
        'tipo': tipo
    };

    $('#modalMatriz').modal('show');
}

function closeModalMatriz() {
    $('#modalMatriz').modal('hide');
}

function getFechasEntidad(nombre) {
    datos = {
        'nombre': nombre
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Movimiento/obtenerFechasLugaresEntidad.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            $('#inputMiamiDate').val(obj[0].fechaMovimiento),
                $('#inputAsuncionDate').val(obj[1].fechaMovimiento),
                $('#inputCIPDate').val(obj[2].fechaMovimiento),
                $('#inputIPDate').val(obj[9].fechaMovimiento),
                $('#inputFronteraDate').val(obj[3].fechaMovimiento),
                $('#inputArgentinaDate').val(obj[4].fechaMovimiento),
                $('#inputCBSDate').val(obj[5].fechaMovimiento),
                $('#inputBSDate').val(obj[6].fechaMovimiento),
                $('#inputCIDate').val(obj[7].fechaMovimiento),
                $('#inputIADate').val(obj[8].fechaMovimiento)
        }
    });
}

function getTrackingsCajaMatriz(id, nombre) {

    datos = {
        'idCaja': id,
        'nombre': nombre
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Caja/obtenerTrackingsMovimientos.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            listaTrakingsCaja = obj;
            var body = createMatrizLugaresCajas(nombre, listaTrakingsCaja);
            $('#matrizModalBody').html('');
            $('#matrizModalBody').append(body);
        }
    });

}

function getTrackingsVueloMatriz(id, nombre) {

    datos = {
        'idVuelo': id,
        'nombre': nombre
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Vuelo/obtenerTrackingsMovimientos.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            listaTrakingsCaja = obj;
            var body = createMatrizLugaresCajas(nombre, listaTrakingsCaja);
            $('#matrizModalBody').html('');
            $('#matrizModalBody').append(body);
        }
    });
}

function saveMatrix() {

    openLoader();

    let fechasLugares = {
        'miami': $('#inputMiamiDate').val(),
        'asuncion': $('#inputAsuncionDate').val(),
        'caminoInteriorParaguay': $('#inputCIPDate').val(),
        'interiorParaguay': $('#inputIPDate').val(),
        'frontera': $('#inputFronteraDate').val(),
        'argentina': $('#inputArgentinaDate').val(),
        'caminoBS': $('#inputCBSDate').val(),
        'BS': $('#inputBSDate').val(),
        'caminoInterior': $('#inputCIDate').val(),
        'interiorArgentina': $('#inputIADate').val(),
    }

    let detallePaquetesLugares = [];

    listaTrakingsCaja.forEach(element => {

        let lugaresPaqueteAux = {
            'id': element.caja.id,
            'tracking': element.caja.tracking,
            'miami': $('#inputMiami' + element.caja.id).is(':checked'),
            'asuncion': $('#inputAsuncion' + element.caja.id).is(':checked'),
            'caminoInteriorParaguay': $('#inputCIP' + element.caja.id).is(':checked'),
            'interiorParaguay': $('#inputIP' + element.caja.id).is(':checked'),
            'frontera': $('#inputFrontera' + element.caja.id).is(':checked'),
            'argentina': $('#inputArgentina' + element.caja.id).is(':checked'),
            'caminoBS': $('#inputCBS' + element.caja.id).is(':checked'),
            'BS': $('#inputBS' + element.caja.id).is(':checked'),
            'caminoInterior': $('#inputCI' + element.caja.id).is(':checked'),
            'interiorArgentina': $('#inputIA' + element.caja.id).is(':checked'),
        }

        detallePaquetesLugares.push(lugaresPaqueteAux);
    });

    let datos = {
        'fechasLugares': fechasLugares,
        'detallePaquetesLugares': detallePaquetesLugares,
        'detallesEntdiad': detalles
    }

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Movimiento/movimientoMasivo.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            closeLodaer();

            if (obj.estado === 1) {

                closeModalMatriz();
                Swal.fire({
                    icon: 'success',
                    title: obj.mensaje,
                    timer: 1500,
                    timerProgressBar: true,
                    showCloseButton: false
                });


            } else {

                Swal.fire({
                    icon: 'error',
                    title: obj.mensaje,
                    timer: 1500,
                    timerProgressBar: true,
                    showCloseButton: false
                });

            }
        }
    });

}