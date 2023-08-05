let dataImport;

function importacionMasiva() {
    isExpanded();
    $("#contenido").load("massiveImport.html", function () {
        console.log("Se cargo")
    });
}

async function dropHandler(e) {
    console.log('File(s) dropped');

    e.stopPropagation(); e.preventDefault();
    const f = e.dataTransfer.files[0];
    /* f is a File */
    const data = await f.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(data);

    var dataWorkBook = workbook.Sheets['Hoja1']
    dataImport = XLSX.utils.sheet_to_json(dataWorkBook);
    console.log(dataImport);
    createPreview(dataImport);
}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function createPreview(data) {

    openLoader();
    var cards = buildPreviewImport(data);
    $('#previewImportTable').html("");
    $('#previewImportTable').html(cards);
    closeLodaer();
}

function sendImportData() {

    openLoader();

    $.ajax({
        method: "POST",
        url: getBaseUrl() + 'Importador/importarPaquetesMasivo.php',
        data: JSON.stringify(dataImport),
        async: true,
        success: function (data) {
            var obj = JSON.parse(data);

            closeLodaer();

            if (obj.estado === 1) {

                Swal.fire({
                    icon: 'success',
                    title: obj.mensaje,
                    timer: 1500,
                    timerProgressBar: true,
                    showCloseButton: false
                });
                $('#previewImportTable').html("");

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