function loadPagos() {
    isExpanded();
    $("#contenido").load("pagos.html", function () {
        fillClientsComboPayments();
        $('#savepaymentButtom').prop('disabled', true);
        $('#createFreePaymentButtom').prop('disabled', true);
        $('#resetDebtButton').prop('disabled', true);
        getHistorialPagosTotales();
    });
}

function fillClientsComboPayments() {
    $.ajax({
        url: getBaseUrl() + 'Cliente/obtenerClientesTotal.php',
        async: true,
        success: function (data) {
            sessionStorage.setItem('clientsArray', data);
            var obj = JSON.parse(data);
            var cards = buildPaymentsClientsCombo(obj);
            $('#comboPagos').html("");
            $('#comboPagos').html(cards);

            createComboListener();

        }
    });
}

function createComboListener() {
    $('#comboPagos').change(function () {
        openLoader();
        var idCliente = $('#comboPagos').val();
        getHistorialPagos(idCliente);
        getDeuda(idCliente);
        $("#inputMontoPago").prop("disabled", false);
        $('#savepaymentButtom').prop('disabled', false);
        $('#createFreePaymentButtom').prop('disabled', false);
        $('#resetDebtButton').prop('disabled', false);
        closeLodaer();
    });
}


function getHistorialPagos(idCliente) {

    datos = { 'clienteId': idCliente }

    $.ajax({
        method: "POST",
        data: JSON.stringify(datos),
        url: getBaseUrl() + 'Pago/obtenerHistorialPagos.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var cards = buildPaymentHistorialTable(obj);
            $('#paymentHistorialTableBody').html("");
            $('#paymentHistorialTableBody').html(cards);
        }
    });
}

function getHistorialPagosTotales() {

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Pago/historialPagoClientesTotales.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            var cards = buildPaymentHistorialTable(obj);
            $('#paymentHistorialTableBody').html("");
            $('#paymentHistorialTableBody').html(cards);
        }
    });
}

function getDeuda(idCliente) {

    datos = { 'clienteId': idCliente };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Pago/calcularDeudaTotal.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {

            var obj = JSON.parse(data);
            var aux = obj.saldo - obj.aFavor;
            sessionStorage.setItem('datosDeuda', data);
            saveAdminLog('Consultar Deuda', 'Se consulto la deuda del cliente ' + $('#comboPagos option:selected').text() + ' con un saldo de $' + aux)


            $('#inputDeudaPagos').val(aux);


        }
    });

}

function pagoAutomatico(idCliente, monto, aux) {

    datos = {
        'clienteId': idCliente,
        'montoPago': monto
    };

    Swal.fire({
        title: 'El saldo del cliente es mayor a su deuda',
        text: "¿Desea usar el saldo para pagar la deuda?",
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
                url: getBaseUrl() + 'Pago/guardarPago.php',
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

                        getDeuda(datos.clienteId);
                        getHistorialPagos(datos.clienteId);
                        $('#inputMontoPago').val('');

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

        } else {
            $('#inputDeudaPagos').val(aux);
        }
    })
}

function savePayment() {

    var datosDeuda = JSON.parse(sessionStorage.getItem('datosDeuda'));
    var montoPagoReal = parseFloat($('#inputMontoPago').val()) + parseFloat(datosDeuda.aFavor);
    var empresaPago = $('#comboPagosEmpresa').val();
    var clienteNombre = $('#comboPagos option:selected').text()
    var empresaPagoNombre = $('#comboPagosEmpresa option:selected').text()
    let title = '';

    if (parseFloat($('#inputMontoPago').val()) == null || parseFloat($('#inputMontoPago').val()) == 0) {
        Toast.fire({
            icon: 'warning',
            title: 'El monto del pago a registrar esta vacío o es cero'
        });
        return;
    }

    if (parseFloat(datosDeuda.aFavor) > 0) {
        title = `¿Desea guardar este pago total de $${montoPagoReal} en ${empresaPagoNombre}? (Se ha encontrado $${datosDeuda.aFavor} de saldo a favor)`
    } else {
        title = `¿Desea guardar este pago de $${montoPagoReal} en ${empresaPagoNombre}?`
    }

    datos = {
        'clienteId': $('#comboPagos').val(),
        'montoPago': montoPagoReal,
        'empresaPago': empresaPago,
        'empresaPagoNombre': empresaPagoNombre,
        'nombreCliente': clienteNombre
    };

    Swal.fire({
        title: title,
        text: "Los datos se actualizaran inmediatamente",
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
                url: getBaseUrl() + 'Pago/guardarPago.php',
                async: true,
                data: JSON.stringify(datos),
                success: function (data) {
                    var obj = JSON.parse(data);

                    if (obj.estado === 1) {

                        Swal.fire({
                            icon: 'success',
                            title: obj.mensaje,
                            timer: 2000,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        getDeuda(datos.clienteId);
                        getHistorialPagos(datos.clienteId);
                        saveAdminLog('Pago Guardado', 'Se guardo un pago para ' + clienteNombre + ' de $ ' + montoPagoReal + ' en la empresa ' + empresaPagoNombre);

                        $('#inputMontoPago').val('');

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 2000,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                    }
                }
            });

        }
    })

}

function openModalPagoHistorico() {
    $('#modalPagoHistorico').modal('show');
}

function closeModalPagoHistorico() {
    $('#modalPagoHistorico').modal('hide');
    $('#inputMontoPagoHistorico').val(0);
}

function resetDebt() {

    let clienteId = $('#comboPagos').val();
    let datosDeuda = JSON.parse(sessionStorage.getItem('datosDeuda'));

    if (parseFloat(datosDeuda.saldo) == 0) {
        Toast.fire({
            icon: 'warning',
            title: 'La deuda ya es 0, no es posible reiniciarla'
        });
        return;
    }

    let datos = {
        "clienteId": clienteId,
        "saldo": datosDeuda.saldo
    }

    Swal.fire({
        title: "¿Seguro que desea volver la deuda 0?",
        text: "Los datos se actualizaran inmediatamente",
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
                url: getBaseUrl() + 'Pago/reiniciarDeuda.php',
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

                        getDeuda(datos.clienteId);
                        getHistorialPagos(datos.clienteId);

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

function guardarPagoHistorico() {
    var datosDeuda = JSON.parse(sessionStorage.getItem('datosDeuda'));

    datos = {
        'clienteId': $('#comboPagos').val(),
        'accion': $('#comboPagoHistorico').val(),
        'monto': $('#inputMontoPagoHistorico').val()
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Pago/generarPagoHistorioc.php',
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

                getDeuda(datos.clienteId);
                getHistorialPagos(datos.clienteId);
                closeModalPagoHistorico();

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