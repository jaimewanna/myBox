
function loadBundles() {
    isExpanded();
    $("#contenido").load("cajas.html", function () {
        openLoader();
        userLogged.empresaId != 0 ? getBoxesFranquicia(userLogged.empresaId) : getBoxesDisplay();

        createSearchListenerBoxes();
        clearInterval(intervalId);
        sessionStorage.setItem("page", 1);
    });
}

function createSearchListenerBoxes() {

    var typingTimer;
    var doneTypingInterval = 1000;

    $('#inputSearchCajas').on('keyup', function (e) {
        clearTimeout(typingTimer);
        if ($('#inputSearchCajas').val()) {
            typingTimer = setTimeout(searchParamBoxes, doneTypingInterval);
        } else {
            userLogged.empresaId != 0 ? getBoxesFranquicia(userLogged.empresaId) : getBoxesDisplay();
        }

    });

}

function searchParamBoxes() {

    openLoader();

    var valorBusqueda = $('#inputSearchCajas').val();
    var campoBusqueda = $('#comboSearchCajas').val();

    datos = {
        'valor': valorBusqueda,
        'campo': campoBusqueda
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Caja/buscadorPersonalizado.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {

            var obj = JSON.parse(data);
            var cards = buildBoxesTable(obj);
            $('#boxesTableBody').html("");
            $('#boxesTableBody').html(cards);
            $('#loadMoreBoxesButton').css('display', 'none');
            closeLodaer();

        }
    });
}

function loadMoreBoxes() {

    newPage = parseInt(sessionStorage.getItem('page')) + 1;

    datos = { 'pagina': newPage };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Caja/paginacionCaja.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj.length == 0) {
                closeLodaer();
                $('#loadMoreBoxesButton').css('display', 'none');
                Toast.fire({
                    icon: 'warning',
                    title: 'Ya se cargaron todos los registros'
                })
            } else {
                console.log(obj);
                var cards = buildBoxesTable(obj);
                $('#boxesTableBody').append(cards);
                sessionStorage.setItem('page', newPage);
                closeLodaer();
            }
        }
    });
}

function openModalCaja() {
    $('#modalAgregarCaja').modal('show');
    $('#destinoCaja').val('Buenos Aires').trigger('change');

}


function getBoxesDisplay() {
    $.ajax({
        url: getBaseUrl() + 'Caja/obtenerCajasDisplay.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {

                var cards = buildBoxesTable(obj);
                $('#boxesTableBody').html("");
                $('#boxesTableBody').html(cards);
                $('#loadMoreBoxesButton').css('display', 'block');

            }
            closeLodaer();

        }
    });
}

function getBoxesFranquicia(empresaId) {

    datos = { 'empresaId': empresaId };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Caja/consultarCajasFranquicia.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data" && obj != "No se pudo traer la data" && obj.length > 0) {

                var cards = buildBoxesTable(obj);
                $('#boxesTableBody').html("");
                $('#boxesTableBody').html(cards);
                $('#loadMoreBoxesButton').css('display', 'none');

            }
            closeLodaer();

        }
    });
}

function cleanCreateBox() {
    $('#trackingCaja').val('');
    $('#nombreCaja').val('');
    $('#listTrackingsCaja').val('');
}

function cleanUpdateBox() {
    $('#nombreEditarCaja').val('');
    $('#trackingEditarCaja').val('');
    $('#numeroPaquetesEditarCaja').val('');
    $('#listTrackingsAdicionalesEditarCaja').val('');
}

function saveBox() {

    var trackingCaja = $('#trackingCaja').val();
    var nombreCaja = $('#nombreCaja').val();
    var trackings = $('#listTrackingsCaja').val();
    var destino = $('#destinoCaja').val();
    var fechaEntrega = $('#fechaEntregaCaja').val();
    var fechaViaje = $('#fechaViajeCaja').val();

    datos = {
        'trackingCaja': trackingCaja,
        'nombreCaja': nombreCaja,
        'trackings': trackings,
        'destino': destino,
        'entrega': fechaEntrega,
        'viaje': fechaViaje,
        'empresaUserId': userLogged.empresaId
    };

    Swal.fire({
        title: '¿Desea guardar esta caja?',
        text: "Los datos se podran editar posteriormente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                method: "POST",
                url: getBaseUrl() + 'Caja/guardarCaja.php',
                async: true,
                data: JSON.stringify(datos),
                success: function (data) {
                    var obj = JSON.parse(data);

                    if (obj.estado === 1) {

                        Swal.fire({
                            icon: 'success',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        saveAdminLog('Guardar Caja', 'Se guardo la caja ' + datos.nombreCaja)
                        $('#modalAgregarCaja').modal('hide');
                        cleanCreateBox();
                        userLogged.empresaId != 0 ? getBoxesFranquicia(userLogged.empresaId) : getBoxesDisplay();

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        $('#modalAgregarCaja').modal('hide');

                    }
                }
            });

        }
    })

}

function openModalEditarCaja(nombre, tracking, numero, id, entrega, viaje) {

    sessionStorage.setItem('idCaja', id);
    var fechaEntregaFormateada = transformDateToInputFromat(entrega);
    var fechaViajeFormateada = transformDateToInputFromat(viaje);

    $('#nombreEditarCaja').val(nombre);
    $('#trackingEditarCaja').val(tracking);
    $('#numeroPaquetesEditarCaja').val(numero);
    getTrackingBox(id);
    $('#fechaEntregaEditarCaja').val(fechaEntregaFormateada);
    $('#fechaViajeEditarCaja').val(fechaViajeFormateada);
    $('#modalEditarCaja').modal('show');

}

function getTrackingBox(id) {

    datos = { 'idCaja': id };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Caja/obtenerTrackingsCaja.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            listaTrakingsCaja = obj;
            var trackingLista = "";
            for (let i = 0; i < obj.length; i++) {
                if (i + 1 == obj.length) {
                    trackingLista += obj[i]['tracking']
                } else {
                    trackingLista += obj[i]['tracking'] + ",";
                }
            }
            $('#listTrackingsEditarCaja').val('');
            $('#listTrackingsEditarCaja').val(trackingLista);
        }
    });
}

function getListPackagesDetailedBox(id) {

    openLoader();
    datos = { 'idCaja': id };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Caja/consultarPaquetesDetalleCaja.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var cards = buildPackagesListDetailBoxes(obj);
            $('#listaPaquetesDetalladosBody').html('');
            $('#listaPaquetesDetalladosBody').append(cards);
            closeLodaer();
            openListDetailPackages();
        }
    });
}

function updateBox() {

    var nombre = $('#nombreEditarCaja').val();
    var tracking = $('#trackingEditarCaja').val();
    var numero = $('#numeroPaquetesEditarCaja').val();
    var trackingsLista = $('#listTrackingsAdicionalesEditarCaja').val();
    var fechaEntrega = $('#fechaEntregaEditarCaja').val();
    var fechaViaje = $('#fechaViajeEditarCaja').val();

    datos = {
        'entrega': fechaEntrega,
        'viaje': fechaViaje,
        'nombre': nombre,
        'tracking': tracking,
        'nPaquetes': numero,
        'idCaja': sessionStorage.getItem('idCaja'),
        'listaNuevosTracking': trackingsLista,
        'empresaUserId': userLogged.empresaId
    };

    Swal.fire({
        title: '¿Desea editar esta Caja?',
        text: "Los datos se podran editar posteriormente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                method: "POST",
                url: getBaseUrl() + 'Caja/actualizarCaja.php',
                async: true,
                data: JSON.stringify(datos),
                success: function (data) {
                    var obj = JSON.parse(data);

                    if (obj.estado === 1) {

                        Swal.fire({
                            icon: 'success',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });
                        saveAdminLog('Actualizar Caja', 'Se actualizo la caja ' + datos.nombre)
                        $('#modalEditarCaja').modal('hide');
                        cleanUpdateBox();
                        userLogged.empresaId != 0 ? getBoxesFranquicia(userLogged.empresaId) : getBoxesDisplay();

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        $('#modalEditarCaja').modal('hide');

                    }
                }
            });

        }
    })

}

function eliminarCaja(id, nombre) {
    datos = {
        'id': id
    };

    Swal.fire({
        title: '¿Desea eliminar esta caja?',
        text: "Esta acción no se podra revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                method: "POST",
                url: getBaseUrl() + 'Caja/eliminarCaja.php',
                async: true,
                data: JSON.stringify(datos),
                success: function (data) {
                    var obj = JSON.parse(data);

                    if (obj.estado === 1) {

                        Swal.fire({
                            icon: 'success',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });
                        saveAdminLog('Eliinar Caja', 'Se elimino una caja con nombre ' + nombre)

                        userLogged.empresaId != 0 ? getBoxesFranquicia(userLogged.empresaId) : getBoxesDisplay();

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
    })

}