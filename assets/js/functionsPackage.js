
$("#inputPeso").change(function () {
    calculateTotal();
    calcularUtility();
});

$("#inputPrecioKilo").change(function () {
    calculateTotal();
    calcularUtility();
});

$("#inputOtrosGastos").change(function () {
    calculateTotal();
    calcularUtility();
});

$("#inputMovilidad").change(function () {
    calculateTotal();
    calcularUtility();
});

$("#inputMargen").change(function () {
    calcularUtility();
});

$('#modalEditarLugar').on('hidden.bs.modal', function (e) {
    openModalPaquete("editar", sessionStorage.getItem('idClienteHold'), sessionStorage.getItem('idPaqueteHold'));
})

$('#comboMyb').on('change', function () {

    var data = JSON.parse(sessionStorage.getItem('clientsArray'));
    var idCliente = $('#comboMyb').val();

    for (i = 0; i < data.length; i++) {
        if (idCliente == data[i]['id']) {
            $('#nombreInputPaqueteModal').val(data[i]['nombre']);
            $('#emailInputPaqueteModal').val(data[i]['email']);
            $('#empresaInputPaqueteModal').val(data[i]['empresaId']);
        }
    }

});

$('#comboDestinoPaquete').on('change', function () {

    var data = JSON.parse(sessionStorage.getItem('paqueteBuscado'));
    var destino = $('#comboDestinoPaquete').val();

    console.log(destino + " " + data[0].destino);

    if (destino != data[0].destino) {
        $('#editLugarButtom').css("display", "none");
    } else {
        $('#editLugarButtom').css("display", "block");
    }

});

function loadPackages() {
    isExpanded();
    $("#contenido").load("packages.html", function () {
        openLoader();
        createSearchListenerPackages();
        userLogged.empresaId != 0 ? getPackagesFranquicia(userLogged.empresaId) : getPackagesDisplay();
        sessionStorage.setItem("page", 1);
        clearInterval(intervalId);
    });
}

function createSearchListenerPackages() {

    var typingTimer;
    var doneTypingInterval = 1000;

    $('#inputSearchPaquetes').on('keyup', function (e) {
        clearTimeout(typingTimer);
        if ($('#inputSearchPaquetes').val()) {
            typingTimer = setTimeout(searchParamPackages, doneTypingInterval);
        } else {
            userLogged.empresaId != 0 ? getPackagesFranquicia(userLogged.empresaId) : getPackagesDisplay();
        }

    });

}

function searchParamPackages() {

    openLoader();

    var valorBusqueda = $('#inputSearchPaquetes').val();
    var campoBusqueda = $('#comboSearchPaquetes').val();

    datos = {
        'valor': valorBusqueda,
        'campo': campoBusqueda
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Paquete/buscadorPersonalizado.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {

            var obj = JSON.parse(data);
            var cards = buildPaquetesResumen(obj);
            $('#packagesTableBody').html("");
            $('#packagesTableBody').html(cards);
            closeLodaer();

        }
    });
}


function openModalPaquete(modo, idcliente, id) {
    cleanInputs();
    fillClientsCombo(idcliente);

    if (modo == 'nuevo') {

        $('#modalAgregarPaquete').modal('show');

    } else {

        sessionStorage.setItem("idPaqueteHold", id);
        sessionStorage.setItem("idClienteHold", idcliente);
        fillPackagesInputs(id);
        $("#guardarPaqueteBoton").attr("onclick", "updatePackage()");
        $('#modalAgregarPaquete').modal('show');
    }

}

function fillPackagesInputs(id) {

    datos = { 'id': id };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Paquete/obtenerPaqueteEspecifico.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {
            sessionStorage.setItem('paqueteBuscado', data);
            var obj = JSON.parse(data);
            console.log(obj);
            checkDestiny(obj[0]['destino'], obj[0]['id']);
            fillFliesCombo(obj[0]['vueloId']);
            fillBoxesCombo(obj[0]['cajaId']);
            $('#trackingInputPaqueteModal').val(obj[0]['tracking']);
            $('#descripcionInputPaqueteModal').val(obj[0]['descripcion']);
            obj[0]['peso'] == null ? $('#inputPeso').val(0) : $('#inputPeso').val(obj[0]['peso']);
            obj[0]['subtotal'] == null ? $('#inputSubtotal').val(0) : $('#inputSubtotal').val(obj[0]['subtotal']);
            obj[0]['movilidad'] == null ? $('#inputMovilidad').val(0) : $('#inputMovilidad').val(obj[0]['movilidad']);
            obj[0]['otros'] == null ? $('#inputOtrosGastos').val(0) : $('#inputOtrosGastos').val(obj[0]['otros']);
            obj[0]['margen'] == null ? $('#inputMargen').val(0) : $('#inputMargen').val(obj[0]['margen']);
            obj[0]['utilidad'] == null ? $('#inputUtilidad').val(0) : $('#inputUtilidad').val(obj[0]['utilidad']);
            obj[0]['tipoCambio'] == null ? $('#inputTipoCambio').val(0) : $('#inputTipoCambio').val(obj[0]['tipoCambio']);
            if (obj[0]['subtotal'] != null && obj[0]['subtotal'] != 0 && (obj[0]['precioKilo'] == null || obj[0]['precioKilo'] == 1)) {
                var precioKiloCalculado = obj[0]['subtotal'] / obj[0]['peso'];
                $('#inputPrecioKilo').val(precioKiloCalculado);
            } else {
                $('#inputPrecioKilo').val(obj[0]['precioKilo']);
            }
            obj[0]['total'] == 0 ? $('#inputTotal').val(obj[0]['subtotal'] + obj[0]['movilidad'] + obj[0]['otros']) : $('#inputTotal').val(obj[0]['total']);
        }
    });
}

function checkDestiny(destino, idPaquete) {

    if (destino == null || destino == 0) {
        $('#editLugarButtom').css("display", "none");
        sessionStorage.setItem("lugarModo", "new");
    } else {
        $('#editLugarButtom').css("display", "block");
        $("#editLugarButtom").attr("onclick", "showPlaces(" + idPaquete + ")");
        $('#comboDestinoPaquete').prop('disabled', false);
        sessionStorage.setItem("lugarModo", "update");
    }

}

function showPlaces(id) {

    datos = {
        'idPaquete': id
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Movimiento/obtenerLugarPorPaquete.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                var cards = buildLugarListEditar(obj, id);
                $('#editLugarBody').html("");
                $('#editLugarBody').html(cards);
                $('#modalAgregarPaquete').modal('hide');
                $('#modalEditarLugar').modal('show');

            }

            closeLodaer();

        }
    });

}

function editarLugar(id, idpaquete, lugar) {

    datos = {
        'idMovimiento': id,
        'fecha': $('#inputFechaMovimientoEditar' + id).val(),
        'idPaquete': idpaquete,
        'lugar': lugar
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Movimiento/actualizarLugar.php',
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
                userLogged.empresaId != 0 ? getPackagesFranquicia(userLogged.empresaId) : getPackagesDisplay();
                saveAdminLog('Editar Lugar', 'Se edito la fecha de un lugar')

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

function fillClientsCombo(id) {

    datos = {
        'empresaId': userLogged.empresaId
    };

    $.ajax({
        method: "POST",
        data: JSON.stringify(datos),
        url: getBaseUrl() + 'Cliente/obtenerClientesAliasTotal.php',
        async: true,
        success: function (data) {
            sessionStorage.setItem('clientsArray', data);
            var obj = JSON.parse(data);
            var cards = buildMybCombo(obj);
            console.log(id);
            $('#comboMyb').html("");
            $('#comboMyb').html(cards);
            $('#comboMyb').val(id);
            $('#comboMyb').trigger('change');
        }
    });
}

function fillFliesCombo(id) {
    $.ajax({
        url: getBaseUrl() + 'Vuelo/obtenerVuelosTotal.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var cards = buildFliesCombo(obj);
            $('#comboFlies').html("");
            $('#comboFlies').html(cards);
            $('#comboFlies').val(id);
            $('#comboFlies').trigger('change');
        }
    });
}

function fillBoxesCombo(id) {
    $.ajax({
        url: getBaseUrl() + 'Caja/obtenerCajasTotal.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var cards = buildFliesCombo(obj);
            $('#comboBoxes').html("");
            $('#comboBoxes').html(cards);
            $('#comboBoxes').val(id);
            $('#comboBoxes').trigger('change');
        }
    });
}

function canBeUpdated(datos) {

    var able = true;

    if (datos.clientePaquete == null) {
        Toast.fire({
            icon: 'warning',
            title: 'No se selecciono ningun cliente, por favor vuelva a seleccionar'
        })
        able = false;
    }

    if (datos.lugarModo == "new" && datos.destino == null) {
        Toast.fire({
            icon: 'warning',
            title: 'No se selecciono ningun destino, por favor vuelva a seleccionar'
        })
        able = false;
    }

    return able;
}

function updatePackage() {

    var paqueteRecuperado = JSON.parse(sessionStorage.getItem('paqueteBuscado'));

    datos = {
        'trackingPaquete': $('#trackingInputPaqueteModal').val(),
        'clientePaquete': $('#comboMyb').val() == null ? paqueteRecuperado[0]['clienteId'] : $('#comboMyb').val(),
        'lugarPaquete': $('#comboLugarPaquete').find('option:selected').text(),
        'desPaquete': $('#descripcionInputPaqueteModal').val(),
        'vueloPaquete': $('#comboFlies').val(),
        'cajaPaquete': $('#comboBoxes').val(),
        'pesoPaquete': $('#inputPeso').val(),
        'subtotalPaquete': $('#inputSubtotal').val(),
        'movilidadPaquete': $('#inputMovilidad').val(),
        'otrosPaquete': $('#inputOtrosGastos').val(),
        'totalPaquete': $('#inputTotal').val() == 0 ? $('#inputSubtotal').val() + $('#inputMovilidad').val() + $('#inputOtrosGastos').val() : $('#inputTotal').val(),
        'margenPaquete': $('#inputMargen').val(),
        'utlidadPaquete': $('#inputUtilidad').val(),
        'cambioPaquete': $('#inputTipoCambio').val(),
        'empresaPagoPaquete': paqueteRecuperado[0]['empresaPagoId'],
        'idPaquete': paqueteRecuperado[0]['id'],
        'destino': $('#comboDestinoPaquete').val(),
        'destinoOriginal': paqueteRecuperado[0]['destino'],
        'lugarModo': sessionStorage.getItem("lugarModo"),
        'precioKilo': $('#inputPrecioKilo').val()

    };

    if (canBeUpdated(datos)) {
        Swal.fire({
            title: '¿Desea actualizar este paquete?',
            text: "Los datos se podran editar nuevamente posteriormente",
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
                    url: getBaseUrl() + 'Paquete/actualizarPaquete.php',
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
                            saveAdminLog('Editar Paquete', 'El paquete ' + datos.trackingPaquete + 'fue actualizado')
                            $('#modalAgregarPaquete').modal('hide');
                            cleanInputs();
                            userLogged.empresaId != 0 ? getPackagesFranquicia(userLogged.empresaId) : getPackagesDisplay();
                        } else {

                            Swal.fire({
                                icon: 'error',
                                title: obj.mensaje,
                                timer: 1500,
                                timerProgressBar: true,
                                showCloseButton: false
                            });

                            $('#modalAgregarPaquete').modal('hide');


                        }
                    }
                });

            }
        })
    }


}

function calculateTotal() {

    calculateSubTotal();
    var total = parseFloat($('#inputMovilidad').val()) + parseFloat($('#inputOtrosGastos').val()) + parseFloat($('#inputSubtotal').val());

    $('#inputTotal').val(total);
}

function calculateSubTotal() {

    var subtotal = parseFloat($('#inputPeso').val()) * parseFloat($('#inputPrecioKilo').val());

    $('#inputSubtotal').val(subtotal);

}

function calcularUtility() {

    var utilidad = (parseFloat($('#inputMargen').val()) * parseFloat($('#inputPrecioKilo').val())) + parseFloat($('#inputMovilidad').val()) + parseFloat($('#inputOtrosGastos').val());

    $('#inputUtilidad').val(utilidad);

}

function cleanInputs() {
    $('#trackingInputPaqueteModal').val('');
    $('#descripcionInputPaqueteModal').val('');
    $('#inputPeso').val('');
    $('#inputSubtotal').val('');
    $('#inputMovilidad').val('');
    $('#inputOtrosGastos').val('');
    $('#inputTotal').val('');
    $('#inputMargen').val('');
    $('#inputUtilidad').val('');
    $('#inputTipoCambio').val('');
    $('#inputPrecioKilo').val('')
    $('#editLugarButtom').css("display", "none");
}

function getPackagesDisplay() {
    $.ajax({
        url: getBaseUrl() + 'Paquete/obtenerPaquetesDisplayResumen.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                var obj = JSON.parse(data);
                var cards = buildPaquetesResumen(obj);
                $('#packagesTableBody').html("");
                $('#packagesTableBody').html(cards);
            }

            closeLodaer();
        }

    });
}

function getPackagesFranquicia(empresaId) {

    datos = { 'empresa': empresaId };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Paquete/consulltarPaquetesFranquicia.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data" && obj != "No se pudo traer la data" && obj.length > 0) {
                var obj = JSON.parse(data);
                var cards = buildPaquetesResumen(obj);
                $('#packagesTableBody').html("");
                $('#packagesTableBody').html(cards);
                $('#loadMorePackesButton').css('display', 'none');
            }

            closeLodaer();
        }

    });
}

function loadMorePackages() {

    newPage = parseInt(sessionStorage.getItem('page')) + 1;

    datos = { 'pagina': newPage };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Paquete/paginacionPaquete.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.length == 0) {
                closeLodaer();
                $('#loadMorePackesButton').css('display', 'none');
                Toast.fire({
                    icon: 'warning',
                    title: 'Ya se cargaron todos los registros'
                })
            } else {
                var cards = buildPaquetesResumen(obj);
                $('#packagesTableBody').append(cards);
                sessionStorage.setItem('page', newPage);
                closeLodaer();
            }
        }

    });
}

function savePackage() {

    Swal.fire({
        title: '¿Desea guardar este paquete?',
        text: "Los datos se podran editar posteriormente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Paquete guardado',
                timer: 1500,
                timerProgressBar: true,
                showCloseButton: false
            })
            $('#modalAgregarPaquete').modal('hide');
        }
    })

}

function openListDetailPackages() {
    $('#modalListaPaquetes').modal('show');
}

function eliminarPaquete(id, nombre) {
    datos = {
        'id': id
    };

    Swal.fire({
        title: '¿Desea eliminar este paquete?',
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
                url: getBaseUrl() + 'Paquete/eliminarPaquete.php',
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
                        saveAdminLog('Eliminar Paquete', 'Se elimino el paquete con tracking ' + nombre)
                        cleanInputs();
                        userLogged.empresaId != 0 ? getPackagesFranquicia(userLogged.empresaId) : getPackagesDisplay();

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