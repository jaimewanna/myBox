function loadVuelos() {
    isExpanded();
    $("#contenido").load("vuelos.html", function () {
        openLoader();
        createSearchListenerFlyes();
        clearInterval(intervalId);
        userLogged.empresaId != 0 ? getFliesFranquicia(userLogged.empresaId) : getFliesDisplay();
        sessionStorage.setItem("page", 1);
    });
}

function createSearchListenerFlyes() {

    var typingTimer;
    var doneTypingInterval = 1000;

    $('#inputSearchVuelos').on('keyup', function (e) {
        clearTimeout(typingTimer);
        if ($('#inputSearchVuelos').val()) {
            typingTimer = setTimeout(searchParamFlyes, doneTypingInterval);
        } else {
            getFliesDisplay();
        }

    });

}

function searchParamFlyes() {

    openLoader();

    var valorBusqueda = $('#inputSearchVuelos').val();
    var campoBusqueda = $('#comboSearchVuelos').val();

    datos = {
        'valor': valorBusqueda,
        'campo': campoBusqueda
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Vuelo/buscadorPersonalizado.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {

            var obj = JSON.parse(data);
            var cards = buildFliesTable(obj);
            $('#tableBody').html("");
            $('#tableBody').html(cards);
            closeLodaer();

        }
    });
}

function openModalAgregarVuelo() {

    $('#modalAgregarVuelo').modal('show');

}

function openModalEditarVuelo(nombre, tracking, numero, id, fechaSalida) {

    var fechaFormateada = transformDateToInputFromat(fechaSalida);
    sessionStorage.setItem('idVuelo', id);

    $('#nombreEditarVuelo').val(nombre);
    $('#trackingEditarVuelo').val(tracking);
    $('#numeroPaquetesEditarVuelo').val(numero);
    $('#fechaSalidaEditarVuelo').val(fechaFormateada);
    getTrackingFly(id);
    $('#modalEditarVuelo').modal('show');

}

function getFliesDisplay() {
    $.ajax({
        url: getBaseUrl() + 'Vuelo/obtenerVuelosDisplay.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                var cards = buildFliesTable(obj);
                $('#tableBody').html("");
                $('#tableBody').html(cards);
            }
            closeLodaer();

        }
    });
}

function getFliesFranquicia(empresaId) {

    datos = { 'empresaId': empresaId };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Vuelo/obtenerVuelosFranquicia.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data" && obj != "No se pudo traer la data" && obj.length > 0) {
                var cards = buildFliesTable(obj);
                $('#tableBody').html("");
                $('#tableBody').html(cards);
                $('#loadMoreFliesButton').css('display', 'none');
            }

            closeLodaer();

        }
    });
}

function loadMoreFlies() {

    newPage = parseInt(sessionStorage.getItem('page')) + 1;

    datos = { 'pagina': newPage };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Vuelo/paginacionVuelo.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.length == 0) {
                closeLodaer();
                $('#loadMoreFliesButton').css('display', 'none');
                Toast.fire({
                    icon: 'warning',
                    title: 'Ya se cargaron todos los registros'
                })
            } else {
                var cards = buildFliesTable(obj);
                $('#tableBody').append(cards);
                sessionStorage.setItem('page', newPage);
                closeLodaer();
            }
        }
    });
}

function getListPackagesDetailedVuelo(id) {

    openLoader();
    datos = { 'idVuelo': id };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Vuelo/consultarPaquetesVueloDetalle.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var cards = buildPackagesListDetail(obj);
            $('#listaPaquetesDetalladosBody').html('');
            $('#listaPaquetesDetalladosBody').append(cards);
            closeLodaer();
            openListDetailPackages();
        }
    });
}


function getTrackingFly(id) {

    datos = { 'idVuelo': id };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Vuelo/obtenerTrackingsVuelo.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var trackingLista = "";
            for (let i = 0; i < obj.length; i++) {
                if (i + 1 == obj.length) {
                    trackingLista += obj[i]['tracking']
                } else {
                    trackingLista += obj[i]['tracking'] + ",";
                }
            }
            $('#listTrackingsEditarVuelo').val('');
            $('#listTrackingsEditarVuelo').val(trackingLista);
        }
    });
}

function saveFly() {

    var empresaId = userLogged.empresaId;
    var nombreVuelo = $('#nombreVuelo').val();
    var fechaSalida = $('#fechaSalida').val();
    var trackings = $('#listTrackingsVuelo').val();
    var trackingVuelo = $('#trackingVuelo').val();

    datos = {
        'empresaUserId': empresaId,
        'nombreVuelo': nombreVuelo,
        'fechaSalida': fechaSalida,
        'trackingVuelo': trackingVuelo,
        'trackings': trackings
    };

    Swal.fire({
        title: '¿Desea guardar este vuelo?',
        text: "Los datos se podran editar posteriormente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            openLoader();
            $.ajax({
                method: "POST",
                url: getBaseUrl() + 'Vuelo/guardarVuelo.php',
                async: true,
                data: JSON.stringify(datos),
                success: function (data) {
                    var obj = JSON.parse(data);
                    closeLodaer();
                    if (obj.estado === 1) {

                        Swal.fire({
                            icon: 'success',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        saveAdminLog('Guardar Vuelo', 'Se guardo un vuelo nuevo')
                        $('#modalAgregarVuelo').modal('hide');
                        cleanCreate();
                        userLogged.empresaId != 0 ? getFliesFranquicia(userLogged.empresaId) : getFliesDisplay();

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        $('#modalAgregarVuelo').modal('hide');

                    }
                }
            });

        }
    })

}

function updateFly() {

    var nombre = $('#nombreEditarVuelo').val();
    var tracking = $('#trackingEditarVuelo').val();
    var numero = $('#numeroPaquetesEditarVuelo').val();
    var fechaSalida = $('#fechaSalidaEditarVuelo').val();
    var trackingsLista = $('#listTrackingsAdicionalesEditarVuelo').val();

    datos = {
        'nombre': nombre,
        'tracking': tracking,
        'nVuelo': numero,
        'fechaVuelo': fechaSalida,
        'idVuelo': sessionStorage.getItem('idVuelo'),
        'listaNuevosTracking': trackingsLista,
        'empresaUserId': userLogged.empresaId
    };

    Swal.fire({
        title: '¿Desea editar este vuelo?',
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
                url: getBaseUrl() + 'Vuelo/actualizarVuelo.php',
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

                        saveAdminLog('Editar Vuelo', 'Se guardo un vuelo con datos editados')
                        $('#modalEditarVuelo').modal('hide');
                        cleanUpdate();
                        userLogged.empresaId != 0 ? getFliesFranquicia(userLogged.empresaId) : getFliesDisplay();

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        $('#modalEditarVuelo').modal('hide');

                    }
                }
            });

        }
    })

}

function cleanCreate() {
    $('#comboLetravuelo').val('');
    $('#fechaSalida').val('');
    $('#listTrackingsVuelo').val('');
    $('#trackingVuelo').val('');
}

function cleanUpdate() {
    $('#nombreEditarVuelo').val('');
    $('#trackingEditarVuelo').val('');
    $('#numeroPaquetesEditarVuelo').val('');
    $('#fechaSalidaEditarVuelo').val('');
    $('#listTrackingsAdicionalesEditarVuelo').val('');
}

function eliminarVuelo(id, nombre) {
    datos = {
        'id': id
    };

    Swal.fire({
        title: '¿Desea eliminar este vuelo?',
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
                url: getBaseUrl() + 'Vuelo/eliminarVuelo.php',
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
                        saveAdminLog('Eliminar Vuelo', 'Se elimino un vuelo con nombre ' + nombre)
                        getFliesDisplay();
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