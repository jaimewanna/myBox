$('#modalEditarAlias').on('hidden.bs.modal', function (e) {
    openModalAgregarCliente("editar", sessionStorage.getItem('clientId'));
})

function openAliasModal() {
    $('#modalAgregarcliente').modal('hide');
    openLoader();
    $('#modalEditarAlias').modal('show');
    getAliasClientEdit();
}

function getAliasClientEdit() {

    datos = {
        'clienteId': sessionStorage.getItem('clientId')
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Alias/consutlarAliasCliente.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            var obj = JSON.parse(data);

            if (obj != "No se pudo obtener la data") {
                var cards = buildAliasListEditar(obj);
                $('#editAliasBody').html("");
                $('#editAliasBody').html(cards);
            }
            closeLodaer();



        }
    });
}

function eliminarAlias(id, nombre) {
    datos = {
        'id': id,
        'clienteId': sessionStorage.getItem('clientId')
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Alias/eliminarAlias.php',
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
                saveAdminLog('Alias Eliminado', 'Se elimino el alias ' + nombre)
                getAliasClientEdit();

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


function editarAlias(id) {

    datos = {
        'id': id,
        'nombre': $('#inputNombreAliasEditar' + id).val(),
        'myb': $('#inputMybAliasEditar' + id).val()
    };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Alias/editarAlias.php',
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

function addNewAlias() {
    Swal.fire({
        title: 'Escriba los nuevos alias',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        showLoaderOnConfirm: true,
        preConfirm: (alias) => {

            idCliente = sessionStorage.getItem('clientId');

            datos = {
                'listaAlias': alias,
                'idCliente': idCliente
            };

            $.ajax({
                method: "POST",
                url: getBaseUrl() + 'Alias/guardarAliasNnuevo.php',
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
                        findClientAlias(idCliente);

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