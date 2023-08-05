$(document).ready(function () {

    if (localStorage.getItem('user')) {
        window.location = "adminDash.html"
    }

    if (localStorage.getItem('token')) {
        if (localStorage.getItem('empresa') == 3) {
            window.location = "trackingBabox.html?clientId=" + localStorage.getItem('key');
        } else {
            window.location = "tracking.html?clientId=" + localStorage.getItem('key');
        }
    }

});

function getBaseUrl() {
    var url = window.location.host;

    if (url == 'localhost') {
        return "https://localhost/myboxapi/controllers/";
    } else {
        return "https://tracking.myboxpy.com/myboxApi/controllers/";
    }

}

function iniciarSesion() {
    var usu = $('#userName').val();
    var pass = $('#password').val();

    console.log(usu + " " + pass);

    datos = { usuario: usu, password: pass };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Usuario/iniciarSesion.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.usuario != null) {
                localStorage.removeItem('empresa');
                localStorage.removeItem('token');
                localStorage.removeItem('expiracion');
                localStorage.removeItem('key');
                localStorage.setItem('user', JSON.stringify(obj));
                window.location = "adminDash.html"
            } else {
                iniciarSesionCliente();
            }
        }
    });

}

function iniciarSesionCliente() {

    var usu = $('#userName').val();
    var pass = $('#password').val();

    console.log(usu + " " + pass);

    datos = { usuario: usu, password: pass };

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Usuario/iniciarSesionCliente.php',
        async: true,
        data: JSON.stringify(datos),
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.clienteId != null) {
                console.log(obj);
                localStorage.setItem('empresa', obj.empresa);
                localStorage.setItem('token', obj.token);
                localStorage.setItem('expiracion', obj.caducidad);
                localStorage.setItem('key', obj.clienteId);
                saveLog(obj.clienteId, 'Inicio Sesion', getState(), getCountry())

                if (obj.empresa == 3) {
                    window.location = "trackingBabox.html?clientId=" + obj.clienteId;
                } else {
                    window.location = "tracking.html?clientId=" + obj.clienteId;
                }

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario o contraseña incorrectos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    });
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
            console.log(obj);

        }
    });
}