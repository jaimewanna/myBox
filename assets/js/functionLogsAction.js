function loadAdminLog() {
    isExpanded();
    $("#contenido").load("adminLog.html", function () {
        getAdminLogs();
        clearInterval(intervalId);
    });
}

function saveAdminLog(accion, detalle) {

    datos = {
        'detalle': detalle,
        'accion': accion
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Log/guardarAdminLog.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {

            var obj = JSON.parse(data);
            console.log(obj);

        }
    });
}

function getAdminLogs() {
    $.ajax({
        url: getBaseUrl() + 'Log/consultarAdminLogResumen.php',
        async: true,
        success: function (data) {

            var obj = JSON.parse(data);
            var cards = buildAdminLogsTable(obj);
            $('#logsTableBody').html("");
            $('#logsTableBody').html(cards);

        }
    });
}


function getLogsPagos() {

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Log/consultarAdminLogPagos.php',
        async: true,
        success: function (data) {

            var obj = JSON.parse(data);
            var cards = buildAdminLogsTable(obj);
            $('#logsPagosTableBody').html("");
            $('#logsPagosTableBody').html(cards);

            exportarXLSX('tablaAdminLogsPagos', 'Reporte Logs Pagos Clientes')

        }
    });
}