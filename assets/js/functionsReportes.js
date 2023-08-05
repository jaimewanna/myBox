function loadReportes() {
    isExpanded();
    $("#contenido").load("reportes.html", function () {
        getEmpresasCombo(userLogged.empresaId);
    });
}

function getEmpresasCombo(empresaId) {

    datos = { 'empresa': empresaId };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Paquete/obtenerEmpresasCombo.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data" && obj != "No se pudo traer la data" && obj.length > 0) {
                var cards = buildCompanyCombo(obj);
                $('#comboEmpresaReporte').html("");
                $('#comboEmpresaReporte').html(cards);
            }

            closeLodaer();

        }
    });
}

function crearReporteEmpresa() {

    datos = { 'empresaId': $('#comboEmpresaReporte').val() };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Paquete/reportePorFranquicia.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            console.log(obj);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                var tabla = createTablaReporteEmpresa(obj);
                $('#tablaReportePorEmpresa').html("");
                $('#tablaReportePorEmpresa').html(tabla);
                exportarXLSX('tablaReporteEmpresa', 'Reporte Empresa')
            }
        }

    });
}