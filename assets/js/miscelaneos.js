$(document).ready(function () {

    if (!localStorage.getItem('user')) {
        window.location = "index.html"
    } else {
        var user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.empresaId != 0) {
            $(".side-nav-menu.scrollable").find("li").not(".franquicia").css("display", "none");
        } else {
            $(".side-nav-menu.scrollable").find("li").css("display", "block");
        }
    }

});

$.fn.modal.Constructor.prototype._enforceFocus = function () { };

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

function isExpanded() {
    if ($(".app").hasClass("is-expand")) {
        $(".app").removeClass("is-expand");
    } else {
        $(".app").addClass("is-expand");
    }
}

function logOut() {

    localStorage.removeItem('user');
    window.location = "index.html"

}

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

function transformDateToInputFromat(fecha) {

    if (fecha != null) {
        partesFecha = fecha.split("-");
        return partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];
    }

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

function calculateNumberOfDays(dates) {
    console.log(dates);
    var date1 = new Date(transformDateToInputFromat(dates[0]));
    var date2;

    for (let i = 1; i < dates.length; i++) {
        if (dates[i] != null) {
            date2 = new Date(transformDateToInputFromat(dates[i]));
            break;
        } else {
            date2 = new Date();
        }

    }

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return parseInt(Difference_In_Days - 1);
}