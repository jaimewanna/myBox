let intervalId

function loadLog() {
    isExpanded();
    $("#contenido").load("logs.html", function () {
        getLogs(userLogged.empresaId);
        intervalId = window.setInterval(getLogs, 10000);
    });
}

function getLogs(empresaId) {

    datos = { 'idEmpresa': empresaId };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Log/consultarLogResumen.php',
        async: true,
        success: function (data) {

            var obj = JSON.parse(data);
            var cards = buildLogsTable(obj);
            $('#logsTableBody').html("");
            $('#logsTableBody').html(cards);

        }
    });
}
