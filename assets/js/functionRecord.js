function loadHistorico() {
    isExpanded();
    $("#contenido").load("historico.html", function() {
        fillClientsComboKilosRecord();
        $('#saveFlyRecordButtom').prop('disabled', true);
        $('#saveBoxRecordButtom').prop('disabled', true);
    });
}

function openModalKilosRecord() {
    $('#modalKilosHistoricos').modal('show');
}

function closeModalKilosRecord() {
    $('#modalKilosHistoricos').modal('hide');
    $('#inputPesoKilosHistoricos').val(0);
    $('#inputFechaKilosHistorico').val(null);
}

function openModalRecordPackage() {
    $('#modalPagoHistorico').modal('show');
}

function closeModalRecordPackage() {
    $('#modalPagoHistorico').modal('hide');
    $('#inputMontoPagoHistorico').val(0);
}

function fillClientsComboKilosRecord() {
    $.ajax({
        url: getBaseUrl() + 'Cliente/obtenerClientesTotal.php',
        async: true,
        success: function(data) {
            sessionStorage.setItem('clientsArray', data);
            var obj = JSON.parse(data);
            var cards = buildPaymentsClientsCombo(obj);
            $('#comboclientesKilosHistoricos').html("");
            $('#comboclientesKilosHistoricos').html(cards);

            createComboListener();

        }
    });
}

function fillClientsComboPaymentRecord() {
    $.ajax({
        url: getBaseUrl() + 'Cliente/obtenerClientesTotal.php',
        async: true,
        success: function(data) {
            sessionStorage.setItem('clientsArray', data);
            var obj = JSON.parse(data);
            var cards = buildPaymentsClientsCombo(obj);
            $('#comboclientesPagosHistoricosconFecha').html("");
            $('#comboclientesPagosHistoricosconFecha').html(cards);

        }
    });
}

function guardarKilosHistorico() {

    datos = {

        'cliente': $('#comboclientesKilosHistoricos').val(),
        'peso': $('#inputPesoKilosHistoricos').val(),
        'fecha': $('#inputFechaKilosHistorico').val(),
        'estado': 1,
        'historico': 1
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Paquete/guardarKilosHistorico.php',
        data: JSON.stringify(datos),
        async: true,
        success: function(data) {

            var obj = JSON.parse(data);

            if (obj.estado === 1) {

                Swal.fire({
                    icon: 'success',
                    title: obj.mensaje,
                    timer: 1500,
                    timerProgressBar: true,
                    showCloseButton: false
                });

                closeModalKilosRecord();

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

function openModalPaymentRecord() {
    fillClientsComboPaymentRecord();
    $('#modalPagosHistoricoConFecha').modal('show');
}

function closeModalPaymentRecord() {
    $('#modalPagosHistoricoConFecha').modal('hide');
    $('#inputMontoPagosHistoricosconFecha').val('');
    $('#inputFechaPagosHistoricosconFecha').val('');
}

function guardarPagoHistoricoConFecha() {
    datos = {
        'clienteId': $('#comboclientesPagosHistoricosconFecha').val(),
        'historico': 1,
        'monto': $('#inputMontoPagosHistoricosconFecha').val(),
        'fecha': $('#inputFechaPagosHistoricosconFecha').val(),
        'empresaPago': $('#comboEmpresasPagosHistoricosconFecha').val()
    };

    console.log(datos);


    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Pago/guardarPagoHistoricoConFecha.php',
        async: true,
        data: JSON.stringify(datos),
        success: function(data) {
            var obj = JSON.parse(data);

            if (obj.estado === 1) {

                Swal.fire({
                    icon: 'success',
                    title: obj.mensaje,
                    timer: 1500,
                    timerProgressBar: true,
                    showCloseButton: false
                });

                closeModalPaymentRecord();

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