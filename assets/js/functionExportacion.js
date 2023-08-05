function exportacionMasiva() {
    openLoader();
    $.ajax({
        url: getBaseUrl() + 'Exportador/dataExportacionMasiva.php',
        async: true,
        success: function(data) {

            var date = new Date();
            var mes = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
            var fechaFormateada = date.getFullYear() + "-" + mes + "-" + date.getDate();

            var obj = JSON.parse(data);

            var worksheet = XLSX.utils.json_to_sheet(obj);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

            XLSX.utils.sheet_add_aoa(worksheet, [
                ["Fecha Registro",
                    "MYB",
                    "Nombre Cliente",
                    "Tracking Paquete",
                    "Precio Kilo",
                    "Peso",
                    "SubTotal",
                    "Movilidad",
                    "Otros",
                    "Valor Cambio",
                    "Nombre Empresa",
                    "Lugar",
                    "Nombre Caja",
                    "Tracking Caja",
                    "Llegada Miami",
                    "llegada Asunsion",
                    "Llegada Frontera",
                    "Llegada Argentina",
                    "Camino al Interior",
                    "Llegada Buenos Aires",
                    "Camino Buenos Aires",
                    "Pagado"
                ]
            ], { origin: "A1" });

            const max_width = obj.reduce((w, r) => Math.max(w, r.fechaRegistro.length), 10);
            worksheet["cols"] = [{ wch: max_width }];
            closeLodaer();

            XLSX.writeFile(workbook, "Reporte Masivo " + fechaFormateada + ".xlsx");
        }
    });

}