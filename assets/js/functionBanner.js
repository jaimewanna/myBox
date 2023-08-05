function loadMisc() {
    isExpanded();
    $("#contenido").load("miscelaneo.html", function () {
        getEmpresasComboMisc(userLogged.empresaId)
    });
}

function getEmpresasComboMisc(empresaId) {

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
                $('#comboEmpresasBanner').html("");
                $('#comboEmpresasBanner').html(cards);
            }

            closeLodaer();

        }
    });
}

function saveBanner() {

    datos = {
        'url': $('#urlImagenBanner').val(),
        'idEmpresa': $('#comboEmpresasBanner').val()
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Banner/guardarBanner.php',
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
                saveAdminLog('se guardo un banner', 'Una nueva imagen con url ' + $('#urlImagenBanner').val() + " fue guardada")

            } else {

                Swal.fire({
                    icon: 'error',
                    title: obj.mensaje,
                    timer: 1500,
                    timerProgressBar: true,
                    showCloseButton: false
                });

            }

            $('#urlImagenBanner').val("")
        }
    });
}