let ipInfo;
let id;
let idEmpresa = localStorage.getItem('empresa');
let saldoAFavor = 0
let deuda = 0

$(document).ready(function () {

    if (!localStorage.getItem('token') && !localStorage.getItem('user')) {
        window.location = "index.html";
    }

    var url_string = window.location.href;
    var url = new URL(url_string);
    id = url.searchParams.get("clientId");

    openLoader();
    if (!localStorage.getItem('user')) {
        checkToken(id);
    }
    getBanner();
    getDeuda(id);
    getClientData(id);
    getClientPaymentsDashboard(id);
    getMonthlyKilos(id);
    getFliesTablesAndPackages(id);

    if (idEmpresa != 1) {
        getClientBoxes(id);
        getPackagesLocationData(id);
    } else {
        hideMyBoxSections();
    }

    try {
        saveLog(id, 'Cargo Dashboard', getState(), getCountry());
    } catch (error) {
        saveLog(id, error, 'Tokio', 'Japon');
    }
    closeLodaer();

    window.setInterval(logOutCheck, 300000);
});

window.addEventListener('beforeunload', function (e) {
    saveLog(id, 'Cerro pestaña', getState(), getCountry())
});

function hideMyBoxSections() {
    $('#cajasAndPaquetesDiv').css("display", "none");
    $('#labelPagoDolares').text("Pago en dolares: ");
}

function logOutCheck() {
    if (!localStorage.getItem('user')) {
        logOut();
    }
}

function logOut() {

    localStorage.removeItem('token');
    localStorage.removeItem('expiracion');
    localStorage.removeItem('key');
    saveLog(id, 'Cerro Sesion Dashboard', getState(), getCountry())
    window.location = "index.html";

}

function getCountry() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timezone === "" || !timezone) {
        return null;
    }

    const _country = timezones[timezone].c[0];
    const country = countries[_country];
    return country;
}

function getState() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timezone === "" || !timezone) {
        return null;
    }

    const state = timezone.split("/")[1].replace("_", " ")

    return state

}

function saveLog(id, accion, region, pais) {

    datos = {
        'cliente': id,
        'accion': accion,
        'region': region,
        'pais': pais,
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Log/guardarLog.php',
        data: JSON.stringify(datos),
        async: true,
        success: function (data) {

            var obj = JSON.parse(data);

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
            saldoAFavor = obj.aFavor
            var aux = obj.saldo - obj.aFavor;
            var deudaPayPal = aux * 1.056 * 1.05;
            deuda = aux;

            $('#deudaDashboardCliente').text('$' + aux.toFixed(2));
            $('#deudaPaypalDashboardCliente').text('$' + deudaPayPal.toFixed(2));

            if (aux < 0) {
                $('#tituloMontoPagar').html("Saldo a favor");
                $('#deudaPaypalDashboardCliente').text('--');
            }

            getHistorialDeudaPagos(id);

        }
    });

}



function getHistorialDeudaPagos(id) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerHistorialDeudaPagos.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            console.log(obj)

            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {


                obj.sort(function compare(a, b) {
                    var dateA = new Date(a.fecha);
                    var dateB = new Date(b.fecha);

                    return dateB - dateA;
                });

                var cards = buildBalanceHistoryDashboardTable(obj, deuda);
                $('#tablaBalanceDeuda').html("");
                $('#tablaBalanceDeuda').html(cards);

            }
        }

    });
}

function getBanner() {
    datos = {
        'idEmpresa': idEmpresa
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Banner/consultarBanner.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {

            var obj = JSON.parse(data);

            if (obj.url == null) {
                $('#floatingDivAdd').css("display", "none");
            } else {
                document.getElementById("floatingDivAddImg").src = obj.url;
            }

        }
    });

}

function hideBanner() {
    $('#floatingDivAdd').css({ "display": "none" });
}

function checkToken(id) {
    datos = {
        'id': id
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'ConfiguracionCliente/consultarConfiguracion.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj.token != localStorage.getItem('token')) {
                window.location = "index.html";
            }
        }
    });
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

function getBaseUrl() {
    var url = window.location.host;

    if (url == 'developer.myboxpy.com') {
        return "https://developer.myboxpy.com/myboxApi/controllers/";
    } else {
        return "https://tracking.myboxpy.com/myboxApi/controllers/";
    }

}

function openLoader() {
    Swal.fire({
        title: 'Cargando Data',
        html: 'Por favor Espere',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        }
    });
}

function closeLodaer() {
    Swal.close();
}

function getPackagesLocationData(id) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerDatosUbicacionesPaquetes.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                $('#paquetesLocationTable').html("");
                var tabla = buildPackagesLocationTable(obj.vuelos, obj.lugares);
                $('#paquetesLocationTable').html(tabla);
                processDataPackagesLocation(obj.paquetes)
            }
        }

    });
}

function processDataPackagesLocation(paquetes) {
    for (let i = 0; i < paquetes.length; i++) {

        totalXVuelo = parseInt($('#v' + paquetes[i].idVuelo + 'Total').text()) + 1;
        totaly = parseInt($('#vl' + paquetes[i].idLugar + 'total').text()) + 1;
        subtotalVuelo = parseInt($('#v' + paquetes[i].idVuelo + 'l' + paquetes[i].idLugar).text()) + 1;

        $('#v' + paquetes[i].idVuelo + 'Total').text(totalXVuelo);
        $('#vl' + paquetes[i].idLugar + 'total').text(totaly);
        $('#v' + paquetes[i].idVuelo + 'l' + paquetes[i].idLugar).text(subtotalVuelo);
    }
}

function getClientBoxes(id) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerCajasCliente.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                var cards = buildBoxesDashboardTable(obj, id);
                $('#cajasDashboardTable').html("");
                $('#cajasDashboardTable').html(cards);
            }
            if (obj.length < 7) {
                $('#cajasDashboardButton').css('display', 'none');
            }
        }

    });
}

function getPackagesBoxDetail(caja, cliente) {
    datos = { 'caja': caja, 'cliente': cliente };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerPaquetesDetallePorCaja.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                var tabla = createFliesPackageTable(obj);
                $('#modalDetallePaquetesCajaBody').html("");
                $('#modalDetallePaquetesCajaBody').html(tabla);
                $('#modalDetallePaquetesCaja').modal('show');
            }
        }

    });
}

function getFliesTablesAndPackages(id) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerListaVuelosCliente.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                var tabla = createFliesPackageTable(obj);
                $('#fliesTablesDiv').html("");
                $('#fliesTablesDiv').html(tabla);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }

    });
}

function getMonthlyKilos(id) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerKilosMensuales.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            var xValues = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            var yValues = getKilosArray(obj);
            var barColors = [];

            console.log(yValues);

            if (localStorage.getItem('empresa') == 3) {
                barColors = ["#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE", "#F494CE"];
            } else if (localStorage.getItem('empresa') == 7) {
                barColors = ["#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6", "#CB6BE6"];
            } else {
                barColors = ["#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232", "#F1C232"];
            }

            new Chart("myChart", {
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                        backgroundColor: barColors,
                        data: yValues,
                        label: 'Kilos'
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: "",
                        color: "#666"
                    }
                }
            });
        }
    });
}

function getKilosArray(obj) {

    console.log(obj)
    var response = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < obj.length; i++) {
        mes = parseInt(obj[i].mes) - 1;
        response[mes] = parseFloat(obj[i].monto);
    }

    return response;
}

function getClientPaymentsDashboard(id) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerPagosCliente.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                var cards = buildPaymentDashboardTable(obj);
                $('#pagosDashboardCliente').html("");
                $('#pagosDashboardCliente').html(cards);
            }

            $('#pagosDashboardButton').css('display', 'none');

        }

    });
}

function getPackagePaymentsDetail(id, nombre) {
    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerPagosPaquete.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (typeof obj === 'string' || obj instanceof String) {
                return;
            } else {
                var cards = buildPaymentDashboardTable(obj);
                $('#modalPagosPaqueteDashboardTitle').html("");
                $('#modalPagosPaqueteDashboardTitle').html(nombre);
                $('#modalPagosPaqueteDashboardBody').html("");
                $('#modalPagosPaqueteDashboardBody').html(cards);
                $('#modalPagosPaqueteDashboard').modal('show');
            }
        }

    });
}

function getClientData(id) {

    datos = { 'id': id };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Dashboard/obtenerDatosCliente.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#nombreCliente").text(obj[0].nombre);
            obj[0].documentoIdentidad != '' ? $("#documentoCliente").text(obj[0].documentoIdentidad) : $("#documentoCliente").text("--");
            $("#emailCliente").text(obj[0].email);
            obj[0].telefono != '' ? $("#telefonoCliente").text(obj[0].telefono) : $("#telefonoCliente").text("--");
            obj[0].direccionEntrega != null ? $("#direccionCliente").text(obj[0].direccionEntrega) : $("#direccionCliente").text("--");
            obj[0].empresaEntrega != null ? $("#empresaEntrega").text(obj[0].empresaEntrega) : $("#empresaEntrega").text("--");
            $("#empresaCliente").text(obj[0].empresaId);

        }

    });

}

function exportarXLSX(tablaid, nombreArchivo) {
    // Acquire Data (reference to the HTML table)
    var table_elt = document.getElementById(tablaid);

    // Extract Data (create a workbook object from the table)
    var workbook = XLSX.utils.table_to_book(table_elt);

    // Process Data (add a new row)
    var ws = workbook.Sheets["Sheet1"];
    XLSX.utils.sheet_add_aoa(ws, [
        ["Created " + new Date().toISOString()]
    ], { origin: -1 });

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, nombreArchivo + ".xlsx");
}

paypal.Buttons({
    style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'pill',
        label: 'paypal',
        tagline: false
    },
    createOrder: function (data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: $('#inputMontoPayPal').val()
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
            // This function shows a transaction success message to your buyer.

            savePayment()
            Swal.fire({
                icon: 'success',
                title: 'Su pago por ' + details.purchase_units[0].amount.value + ' ' + details.purchase_units[0].amount.currency_code + ' se registro correctamente',
                timer: 5000,
                timerProgressBar: true,
                showCloseButton: true
            });
            getDeuda(id);
        });
    }
}).render('#paypal-button-container');
// This function displays Smart Payment Buttons on your web page..

function openPayPalModal() {
    $('#modalPagoPayPal').modal('show');
}

function savePayment() {

    var montoPagoReal = ($('#inputMontoPayPal').val() / 1.1088) + parseFloat(saldoAFavor);
    var empresaPago = 1;

    datos = {
        'clienteId': id,
        'montoPago': montoPagoReal,
        'empresaPago': empresaPago
    };

    $.ajax({

        method: "POST",
        url: getBaseUrl() + 'Pago/guardarPago.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            $('#inputMontoPayPal').val(0);
            $('#modalPagoPayPal').modal('hide');
        }

    });

}

