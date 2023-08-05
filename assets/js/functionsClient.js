let userLogged = JSON.parse(localStorage.getItem("user"));

$('#modalAgregarcliente').on('hidden.bs.modal', function (e) {
    cleanModal();

})

$("#switchPanel").click(function () {
    if ($(this).is(':checked')) {
        enableClientPanel();
        switchStatus = $("#switchPanel").is(':checked');
        console.log(switchStatus);
    } else {
        disableClientPanel();
        switchStatus = $("#switchPanel").is(':checked');
        console.log(switchStatus); // To verify
    }
});

function loadClients() {
    isExpanded();
    $("#contenido").load("clientes.html", function () {
        openLoader();
        createSearchListenerClient();

        userLogged.empresaId != 0 ? getClientsFranquicia(userLogged.empresaId) : getClientsDisplayV2();

        clearInterval(intervalId);
        sessionStorage.setItem("page", 1);
    });
}

function createSearchListenerClient() {

    var typingTimer;
    var doneTypingInterval = 1000;
    var switchStatus = false;

    $('#inputSearchClientes').on('keyup', function (e) {
        clearTimeout(typingTimer);
        if ($('#inputSearchClientes').val()) {
            typingTimer = setTimeout(searchParam, doneTypingInterval);
        } else {
            getClientsDisplayV2();
        }

    });

}

function enableClientPanel() {

    var nombreCliente = $('#nombreCliente').val();
    var paternoCliente = $('#paternoCliente').val();
    var emailCliente = $('#emailCliente').val();
    var id = $('#idClienteSecretInput').val();

    datos = {
        'nombreCliente': nombreCliente + " " + paternoCliente,
        'emailCliente': emailCliente,
        'clienteId': id
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'ConfiguracionCliente/crearPasswordCliente.php',
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
                saveAdminLog('Panel Activado', 'Se activo un panel de cliente')

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

function disableClientPanel() {
    var id = $('#idClienteSecretInput').val();

    datos = {
        'clienteId': id
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'ConfiguracionCliente/desactivarPanelCliente.php',
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
                saveAdminLog('Panel Desactivado', 'Se desactivo el panel de un cliente')
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

function searchParam() {

    openLoader();

    var valorBusqueda = $('#inputSearchClientes').val();
    var campoBusqueda = $('#comboSearchClientes').val();

    datos = {
        'valor': valorBusqueda,
        'campo': campoBusqueda
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Cliente/buscadorPersonalizado.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {

            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                $('#clientTableBody').html("");

                for (i = 0; i < obj.length; i++) {
                    var card = buildClientesTableV2(obj[i], i);
                    $('#clientTableBody ').append(card)
                }
            }

            closeLodaer();

        }
    });
}

function openModalAgregarCliente(modo, id) {

    if (modo == 'nuevo') {
        $('#modalAgregarcliente').modal('show');
        $("#listAliasPersonaNueva").prop("disabled", false)
        $("#editAliasButtom").css("display", "none");
        $("#addAliasButtom").css("display", "none");
        $('#columnSwitchPanel').css("display", "none");
        $('#columnButtomPanel').css("display", "none");
        $("#clientModalButtom").attr("onclick", "saveClient()")
    } else {
        fillClientInputs(id);
        $("#clientModalButtom").attr("onclick", "updateClient()")
        $('#modalAgregarcliente').modal('show');
        $("#listAliasPersonaNueva").prop("disabled", true)
        $("#editAliasButtom").css("display", "block");
        $("#addAliasButtom").css("display", "block");
    }

}

function openModalAgregarClienteV2(modo, data) {

    if (modo == 'nuevo') {
        $('#modalAgregarcliente').modal('show');
        $("#listAliasPersonaNueva").prop("disabled", false)
        $("#editAliasButtom").css("display", "none");
        $("#addAliasButtom").css("display", "none");
        $('#columnSwitchPanel').css("display", "none");
        $('#columnButtomPanel').css("display", "none");
        $("#clientModalButtom").attr("onclick", "saveClient()")
    } else {
        fillClientInputsV2(data);
        $("#clientModalButtom").attr("onclick", "updateClient()")
        $('#modalAgregarcliente').modal('show');
        $("#listAliasPersonaNueva").prop("disabled", true)
        $("#editAliasButtom").css("display", "block");
        $("#addAliasButtom").css("display", "block");
    }

}

function fillClientInputsV2(data) {

    $('#nombreCliente').val(data.nombre);
    $('#paternoCliente').val(data.paterno);
    $('#maternoCliente').val(data.materno);
    $('#telefonoCliente').val(data.telefono);
    $('#emailCliente').val(data.email);
    $('#direccionEntregaCliente').val(data.direccionEntrega);
    $('#empresaEntregaCliente').val(data.empresaEntrega);
    findClientCompanyId(data.empresaId);
    findClientAlias(data.id);
    checkPanelAvailable(data.id);
    $('#precioKiloCliente').val(data.precioKilo);
    $('#direccionCliente').val(data.direccion);
    $('#documentoCliente').val(data.documentoIdentidad);
    $('#MYBCliente').val(data.myb);
    $('#idClienteSecretInput').val(data.id);

    if (data.email == null || data.email == "") {
        $('#columnSwitchPanel').css("display", "none");
        $('#columnButtomPanel').css("display", "none");
    } else {
        $('#columnSwitchPanel').css("display", "block");
        $('#columnButtomPanel').css("display", "block");
    }

}

function fillClientInputs(id) {

    data = JSON.parse(sessionStorage.getItem('clientsArray'));
    console.log(data);
    sessionStorage.setItem('clientId', id);

    for (let i = 0; i < data.length; i++) {

        if (data[i]['id'] == id) {
            console.log(data[i]);
            $('#nombreCliente').val(data[i]['nombre']);
            $('#paternoCliente').val(data[i]['paterno']);
            $('#maternoCliente').val(data[i]['materno']);
            $('#telefonoCliente').val(data[i]['telefono']);
            $('#emailCliente').val(data[i]['email']);
            $('#direccionEntregaCliente').val(data[i]['direccionEntrega']);
            $('#empresaEntregaCliente').val(data[i]['empresaEntrega']);
            findClientCompanyId(data[i]['empresaId']);
            findClientAlias(data[i]['id']);
            checkPanelAvailable(data[i]['id']);
            $('#precioKiloCliente').val(data[i]['precioKilo']);
            $('#direccionCliente').val(data[i]['direccion']);
            $('#documentoCliente').val(data[i]['documentoIdentidad']);
            $('#MYBCliente').val(data[i]['myb']);
            $('#idClienteSecretInput').val(data[i]['id']);

            if (data[i]['email'] == null || data[i]['email'] == "") {
                $('#columnSwitchPanel').css("display", "none");
                $('#columnButtomPanel').css("display", "none");
            } else {
                $('#columnSwitchPanel').css("display", "block");
                $('#columnButtomPanel').css("display", "block");
            }
        }

    }

}

function checkPanel() {
    var empresa = $('#comboEmpresaCliente').val();
    var id = $('#idClienteSecretInput').val();

    localStorage.setItem('empresa', empresa);

    if (empresa == 3) {
        window.open("trackingBabox.html?clientId=" + id, '_blank');
    } else if (empresa == 7) {
        window.open("tracking4women.html?clientId=" + id, '_blank');
    } else {
        window.open("tracking.html?clientId=" + id, '_blank');
    }
}

function checkPanelAvailable(id) {
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
            console.log(obj);

            if (obj.password != null && obj.password != "") {
                $("#switchPanel").prop("checked", true);
            } else {
                $("#switchPanel").prop("checked", false);
            }
        }
    });
}

function findClientAlias(id) {

    datos = {
        'clienteId': id
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Alias/consutlarAliasCliente.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            var obj = JSON.parse(data);

            var alias = "";

            for (let i = 0; i < obj.length; i++) {
                if (i + 1 == obj.length) {
                    alias += obj[i]['nombre'];
                } else {
                    alias += obj[i]['nombre'] + ",";
                }
            }

            $('#listAliasPersonaNueva').val(alias);



        }
    });
}

function updateClient() {

    var nombreCliente = $('#nombreCliente').val();
    var paternoCliente = $('#paternoCliente').val();
    var maternoCliente = $('#maternoCliente').val();
    var telefonoCliente = $('#telefonoCliente').val();
    var emailCliente = $('#emailCliente').val();
    var direccionEntrega = $('#direccionEntregaCliente').val();
    var empresaEntrega = $('#empresaEntregaCliente').val();
    var empresaIdCliente = $('#comboEmpresaCliente').val();
    var precioKiloCliente = $('#precioKiloCliente').val();
    var direccionCliente = $('#direccionCliente').val();
    var documentoCliente = $('#documentoCliente').val();
    var mybCliente = $('#MYBCliente').val();
    var id = $('#idClienteSecretInput').val();

    datos = {
        'direccionEntrega': direccionEntrega,
        'empresaEntrega': empresaEntrega,
        'nombreUpdate': nombreCliente,
        'paternoUpdate': paternoCliente,
        'maternoUpdate': maternoCliente,
        'emailUpdate': emailCliente,
        'empresaUpdate': empresaIdCliente,
        'kiloUpdate': precioKiloCliente,
        'telefonoUpdate': telefonoCliente,
        'direccionUpdate': direccionCliente,
        'documentoUpdate': documentoCliente,
        'mybUpdate': mybCliente,
        'idUpdate': id
    };

    Swal.fire({
        title: '¿Desea actualizar este cliente?',
        text: "Los datos se podran editar nuevamente posteriormente",
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
                url: getBaseUrl() + 'Cliente/actualizarCliente.php',
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
                        saveAdminLog('Cliente Actualizado', 'Se actualizo al cliente ' + nombreCliente + ' ' + paternoCliente)
                        $('#columnMYB').hide();
                        $('#modalAgregarcliente').modal('hide');
                        cleanModal();
                        userLogged.id == 3 ? getClientsFranquicia(userLogged.empresaId) : getClientsDisplay();
                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                        $('#modalAgregarcliente').modal('hide');


                    }
                }
            });

        }
    })

}

function findClientCompanyId(nombreEmpresa) {

    idEmpresa = 0;

    switch (nombreEmpresa) {
        case 'mybox':
            idEmpresa = 1;
            break;
        case 'yourbox':
            idEmpresa = 2;
            break;
        case 'babox':
            idEmpresa = 3;
            break;
        case 'mybox arg':
            idEmpresa = 4;
            break;
        case 'mybox bra':
            idEmpresa = 5;
            break;
        case 'productos':
            idEmpresa = 6;
            break;
        case '4women.box':
            idEmpresa = 7;
            break
        default:
            break;
    }

    $('#comboEmpresaCliente').val(idEmpresa);
    $('#comboEmpresaCliente').trigger('change');

    return idEmpresa;

}

function getClientsDisplay() {
    $.ajax({
        url: getBaseUrl() + 'Cliente/obtenerClientesDisplay.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                sessionStorage.setItem('clientsArray', data);
                var obj = JSON.parse(data);
                var cards = buildClientesTable(obj);
                $('#clientTableBody').html("");
                $('#clientTableBody').html(cards);
            }
            closeLodaer();
        }
    });
}

function getClientsDisplayV2() {
    $.ajax({
        url: getBaseUrl() + 'Cliente/obtenerClientesDisplay.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                $('#clientTableBody').html("");

                for (i = 0; i < obj.length; i++) {
                    var card = buildClientesTableV2(obj[i], i);
                    $('#clientTableBody ').append(card)
                }
            }

            closeLodaer();
        }
    });
}

function getClientsFranquicia(empresaId) {

    datos = { 'idEmpresa': empresaId };


    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Cliente/obtenerClientesFranquicia.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            $('#loadMoreClientsButton').css('display', 'none');
            $('#searchBarClients1').css('display', 'none');
            $('#searchBarClients2').css('display', 'none');

            if (obj != "No se pudo obtener la data" && obj != "No se pudo traer la data" && obj.length > 0) {
                sessionStorage.setItem('clientsArray', data);
                var obj = JSON.parse(data);
                var cards = buildClientesTable(obj);
                $('#clientTableBody').html("");
                $('#clientTableBody').html(cards);
            }
            closeLodaer();
        }
    });
}

function loadMoreClients() {

    newPage = parseInt(sessionStorage.getItem('page')) + 1;

    datos = { 'pagina': newPage };

    $.ajax({
        data: JSON.stringify(datos),
        method: "POST",
        url: getBaseUrl() + 'Cliente/paginacionCliente.php',
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.length == 0) {
                closeLodaer();
                $('#loadMoreClientsButton').css('display', 'none');
                Toast.fire({
                    icon: 'warning',
                    title: 'Ya se cargaron todos los registros'
                })
            } else {
                if (obj != "No se pudo obtener la data") {

                    sessionStorage.setItem('page', newPage);
                    for (i = 0; i < obj.length; i++) {
                        var card = buildClientesTableV2(obj[i], i);
                        $('#clientTableBody ').append(card)
                    }
                }

                closeLodaer();
            }
        }

    });
}

function cleanModal() {
    $('#nombreCliente').val('');
    $('#paternoCliente').val('');
    $('#maternoCliente').val('');
    $('#telefonoCliente').val('');
    $('#emailCliente').val('');
    $('#direccionEntregaCliente').val('');
    $('#empresaEntregaCliente').val('');
    $('#comboEmpresaCliente').val('');
    $('#precioKiloCliente').val('');
    $('#direccionCliente').val('');
    $('#documentoCliente').val('');
    $('#listAliasPersonaNueva').val('');
    $('#switchPanel').prop('checked', false);
}

function saveClient() {

    var nombreCliente = $('#nombreCliente').val();
    var paternoCliente = $('#paternoCliente').val();
    var maternoCliente = $('#maternoCliente').val();
    var telefonoCliente = $('#telefonoCliente').val();
    var emailCliente = $('#emailCliente').val();
    var direccionEntrega = $('#direccionEntregaCliente').val();
    var empresaEntrega = $('#empresaEntregaCliente').val();
    var empresaIdCliente = $('#comboEmpresaCliente').val();
    var precioKiloCliente = $('#precioKiloCliente').val();
    var direccionCliente = $('#direccionCliente').val();
    var documentoCliente = $('#documentoCliente').val();
    var aliasCliente = $('#listAliasPersonaNueva').val();

    datos = {
        'direccionEntrega': direccionEntrega,
        'empresaEntrega': empresaEntrega,
        'nombre': nombreCliente,
        'paterno': paternoCliente,
        'materno': maternoCliente,
        'email': emailCliente,
        'empresaId': empresaIdCliente,
        'precioKilo': precioKiloCliente,
        'telefono': telefonoCliente,
        'direccion': direccionCliente,
        'documento': documentoCliente,
        'listaAlias': aliasCliente
    };

    Swal.fire({
        title: '¿Desea guardar este cliente?',
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
                url: getBaseUrl() + 'Cliente/guardarCliente.php',
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
                        getClientsDisplay();
                        cleanModal();
                        saveAdminLog('Cliente Guardado', 'Se guardo al cliente ' + nombreCliente + ' ' + paternoCliente)


                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: obj.mensaje,
                            timer: 1500,
                            timerProgressBar: true,
                            showCloseButton: false
                        });

                    }

                    $('#modalAgregarcliente').modal('hide');
                }
            });

        }
    })

}

function eliminarCliente(id, nombre) {
    datos = {
        'id': id
    };

    Swal.fire({
        title: '¿Desea eliminar este cliente?',
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
                url: getBaseUrl() + 'Cliente/eliminarCliente.php',
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
                        saveAdminLog('Cliente Eliminado', 'Se elimino al cliente ' + nombre)
                        getClientsDisplay();
                        cleanModal();

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