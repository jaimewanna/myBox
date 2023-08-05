function isOdd(num) {
    return num % 2;
}

function buildLogsTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].id + `</th>`;
        response += `<td>` + data[i].cliente + `</td>`;
        response += `<td>` + data[i].accion + `</td>`;
        response += `<td>` + data[i].region + `</td>`;
        response += `<td>` + data[i].pais + `</td>`;
        response += `<td>` + data[i].fecha + `</td>`;

    }

    return response;
}


function buildPreviewImport(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].nombreCliente + `</th>`;
        response += `<td>` + data[i].Tracking + `</td>`;
        response += `<td>` + data[i].Vuelo + `</td>`;
        response += `<td>` + data[i].Caja + `</td>`;
        response += `<td>` + data[i].Subtotal + `</td>`;
        response += `<td>` + data[i].Movilidad + `</td>`;
        response += `<td>` + data[i].Otros + `</td>`;
        response += `<td>` + data[i].Total + `</td>`;
        response += `<td>` + data[i].Miami + `</td>`;

    }

    return response;

}

function buildAdminLogsTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].id + `</th>`;
        response += `<td>` + data[i].accion + `</td>`;
        response += `<td>` + data[i].detalle + `</td>`;
        response += `<td>` + data[i].fecha + `</td>`;

    }

    return response;
}

function buildFliesTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].nombre + `</th>`;
        response += `<td>` + data[i].nPaquetes + `</td>`;
        response += `<td>` + data[i].fechaSalida + `</td>`;
        response += data[i].peso == null ? `<td>---</td>` : `<td>` + parseFloat(data[i].peso).toFixed(2) + `</td>`;
        response += data[i].valor == null ? `<td>---</td>` : `<td>` + parseFloat(data[i].valor).toFixed(2) + `</td>`;
        response += `<td>`
        response += `<i class="anticon anticon-search" onclick="getListPackagesDetailedVuelo(` + data[i].id + `)" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `<i class="anticon anticon-edit" onclick="openModalEditarVuelo('` + data[i].nombre + `','` + data[i].tracking + `',` + data[i].nPaquetes + `,` + data[i].id + `,'` + data[i].fechaSalida + `')" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `<i class="anticon anticon-table" onclick="openModalMatriz(` + data[i].id + `,'` + data[i].nombre + `', 2)" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `<i class="anticon anticon-delete" onclick="eliminarVuelo(` + data[i].id + `,'` + data[i].nombre + `')" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `</td>`;
        response += `</tr>`;

    }

    return response;
}

function buildPaymentHistorialTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        timestampSalida = Date.parse(data[i].fechaPago);
        var date = new Date(timestampSalida);
        var mes = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var fechaFormateada = date.getFullYear() + "-" + mes + "-" + date.getDate();

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].id + `</th>`;
        response += Number.isInteger(data[i].cliente) ? `<td>---</td>` : `<td>` + data[i].cliente + `</td>`;
        response += `<td>$` + data[i].monto + `</td>`;
        response += data[i].idEmpresaPago == null ? `<td>---</td>` : `<td>` + data[i].idEmpresaPago + `</td>`;
        response += `<td>` + fechaFormateada + `</td>`;
        response += `</tr>`;

    }

    return response;
}

function buildPaymentDashboardTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else if (localStorage.getItem('empresa') == 3) {
            response += `<tr style="background-color: #F494CE;">`;
        } else if (localStorage.getItem('empresa') == 7) {
            response += `<tr style="background-color: #8766F2;">`;
        }
        else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].idEmpresaPago + `</th>`;
        response += `<td>` + data[i].fechaPago + `</td>`;
        response += `<td>$` + data[i].monto + `</td>`;
        response += `</tr>`;

    }

    return response;
}

function buildHistoryDashboardTable(data) {

    response = "";

    for (i = 0; i < 15; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else if (localStorage.getItem('empresa') == 3) {
            response += `<tr style="background-color: #F494CE;">`;
        } else if (localStorage.getItem('empresa') == 7) {
            response += `<tr style="background-color: #8766F2;">`;
        }
        else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].nombre + `</th>`;
        response += `<td>` + data[i].fecha + `</td>`;
        response += `<td>$` + data[i].monto + `</td>`;
        response += `</tr>`;

    }

    return response;
}

function hasNumber(myString) {
    return /\d/.test(myString);
  }

function buildBalanceHistoryDashboardTable(data, deuda) {
    

    response = "";
    deuda = parseFloat(deuda).toFixed(2);

    var longuitud = data.length > 15 ? 15 : data.length

    for (i = 0; i < longuitud; i++) {
        console.log(data[i])
        data[i].monto = parseFloat(data[i].monto).toFixed(2);

        if (isOdd(i)) {
            response += `<tr>`;
        } else if (localStorage.getItem('empresa') == 3) {
            response += `<tr style="background-color: #F494CE;">`;
        } else if (localStorage.getItem('empresa') == 7) {
            response += `<tr style="background-color: #8766F2;">`;
        }
        else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].nombre + `</th>`;
        response += `<td>` + data[i].fecha + `</td>`;
        response += `<td>` + data[i].peso + `</td>`;
        response += `<td class="columnaNumerica">` + data[i].subtotal + `</td>`;
        response += `<td class="columnaNumerica">` + data[i].movilidad + `</td>`;
        response += `<td class="columnaNumerica">` + data[i].otros + `</td>`;

        if (hasNumber(data[i].nombre)) {

            response += `<td class="columnaNumerica"><a style="color: #00ff00;font-weight: bold;">$` + data[i].monto + `<a/></td>`;
            //response += `<td class="columnaNumerica">$` + parseFloat(deuda).toFixed(2) + `</td>`;
            deuda = deuda - data[i].monto;        

        }else{

            response += `<td class="columnaNumerica"><a style="color: red;font-weight: bold;">$` + data[i].monto + `<a/></td>`;
            //response += `<td class="columnaNumerica">$` + parseFloat(deuda).toFixed(2) + `</td>`;
            deuda = (parseFloat(deuda) + parseFloat(data[i].monto));

        }
        response += `</tr>`;

    }

    return response;
}

function buildBoxesDashboardTable(data, idcliente) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else if (localStorage.getItem('empresa') == 3) {
            response += `<tr style="background-color: #F494CE;">`;
        } else if (localStorage.getItem('empresa') == 7) {
            response += `<tr style="background-color: #8766F2;">`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }

        response += `<th scope="row">` + data[i].nombre + `</th>`;
        response += `<td>` + data[i].tracking + `</td>`;
        response += `<td>` + data[i].destino + `</td>`;
        response += `<td style="text-align: center;">` + data[i].nPaquetes;
        response += `<i class="anticon anticon-search" onclick="getPackagesBoxDetail(` + data[i].id + `,'` + idcliente + `')" style="font-size: 20px;margin-left: 10px;cursor: pointer;"></i></td>`;
        response += `<td style="text-align: center;">` + data[i].peso.toFixed(2) + `</td>`;
        response += data[i].fechaEntrega == null ? `<td>---</td>` : `<td>` + data[i].fechaEntrega + `</td>`;
        response += data[i].fechaViaje == null ? `<td>---</td>` : `<td>` + data[i].fechaViaje + `</td>`;
        response += data[i].fechaLlegada == null ? `<td>---</td>` : `<td>` + data[i].fechaLlegada + `</td>`;
        response += `</tr>`;

    }

    return response;
}

function buildBoxesTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }
        response += `<th scope="row">` + data[i].nombre + `</th>`;
        response += `<td>` + data[i].tracking + `</td>`;
        response += `<td>` + data[i].nPaquetes + `</td>`;
        response += `<td>` + data[i].fechaRegistro + `</td>`;
        response += data[i].peso == null ? `<td>---</td>` : `<td>` + parseFloat(data[i].peso).toFixed(2) + `</td>`;
        response += data[i].valor == null ? `<td>---</td>` : `<td>` + parseFloat(data[i].valor).toFixed(2) + `</td>`;
        response += `<td>`
        response += `<i class="anticon anticon-search" onclick="getListPackagesDetailedBox(` + data[i].id + `)" style="font-size: 30px;margin-right: 15px;"></i>`
        response += `<i onclick="openModalEditarCaja('` + data[i].nombre + `', '` + data[i].tracking + `', '` + data[i].nPaquetes + `', '` + data[i].id + `','` + data[i].fechaEntrega + `','` + data[i].fechaViaje + `')" class="anticon anticon-edit" style="font-size: 30px;margin-right: 15px;"></i>`
        response += `<i class="anticon anticon-table" onclick="openModalMatriz(` + data[i].id + `,'` + data[i].nombre + `', 1)" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `<i class="anticon anticon-delete" onclick="eliminarCaja(` + data[i].id + `,'` + data[i].nombre + `')" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `</td>`;
        response += `</tr>`;

    }

    return response;
}

function convertNameToEmpresaId(nombreEmpresa) {

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

    return idEmpresa;

}

function buildClientesTableV2(data, i) {
    const card = document.createElement('tr')

    if (!isOdd(i)) {
        card.style.backgroundColor = '#3e3b43';
    }

    var newEmail = data.email.length > 15 ? data.email.substr(0, 15) + '...' : data.email;

    card.innerHTML += `<th scope="row">` + data.nombre + ` ` + data.paterno + `</th>`;
    card.innerHTML += `<td>` + data.precioKilo + `</td>`;
    card.innerHTML += `<td>` + newEmail + `</td>`;
    card.innerHTML += `<td>` + data.empresaId + `</td>`;
    card.innerHTML += `<td>` + data.documentoIdentidad + `</td>`;
    card.innerHTML += `<td>` + data.telefono + `</td>`;
    card.innerHTML += `<td>    
                            <i class="anticon anticon-area-chart panel-button" style="font-size: 30px;"></i>
                            <i class="anticon anticon-edit edit-button" style="font-size: 30px;"></i>
                            <i class="anticon anticon-delete delete-button" style="font-size: 30px;"></i>
                       </td>`;

    card.querySelector('.edit-button').addEventListener('click', function (event) {
        openModalAgregarClienteV2('edit', data);
    })

    card.querySelector('.panel-button').addEventListener('click', function (event) {

        localStorage.setItem('empresa', convertNameToEmpresaId(data.empresaId));

        if (data.empresaId == 'babox') {
            window.open("trackingBabox.html?clientId=" + data.id, '_blank');
        } else if (data.empresaId == '4women.box') {
            window.open("tracking4women.html?clientId=" + data.id, '_blank');
        } else {
            window.open("tracking.html?clientId=" + data.id, '_blank');
        }

    })

    card.querySelector('.delete-button').addEventListener('click', function (event) {
        eliminarCliente(data.id, data.nombre + ` ` + data[i].paterno)
    })

    return card;
}

function buildClientesTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }
        response += `<td scope="row">` + data[i].nombre + ` ` + data[i].paterno + `</td>`;
        response += `<td>` + data[i].precioKilo + `</td>`;
        response += `<td>` + data[i].email + `</td>`;
        response += `<td>` + data[i].empresaId + `</td>`;
        response += `<td>` + data[i].documentoIdentidad + `</td>`;
        response += `<td>` + data[i].telefono + `</td>`;
        response += `<td>`;
        response += `<i class="anticon anticon-edit" onclick="openModalAgregarCliente('edit',` + data[i].id + `)" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `<i class="anticon anticon-delete" onclick="eliminarCliente(` + data[i].id + `,'` + data[i].nombre + ` ` + data[i].paterno + `')" style="font-size: 30px;margin-right: 15px;"></i></td>`;
        response += `</tr>`;

    }

    return response;

}

function buildPaquetesResumen(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        if (isOdd(i)) {
            response += `<tr>`;
        } else {
            response += `<tr style="background-color: #3e3b43;">`;
        }
        response += `<th scope="row">` + data[i].vueloId + `</th>`;
        response += `<td>` + data[i].tracking + `</td>`;
        response += data[i].empresa == null ? `<td>---</td>` : `<td>` + data[i].empresa + `</td>`;
        response += data[i].clienteNombre == null ? `<td>---</td>` : `<td>` + data[i].clienteNombre + `</td>`;
        response += data[i].lugar == null ? `<td>---</td>` : `<td>` + data[i].lugar + `</td>`;
        response += data[i].peso == null ? `<td>---</td>` : `<td>` + data[i].peso + `</td>`;
        response += data[i].total == 0 ? `<td>---</td>` : `<td>` + data[i].total + `</td>`;
        response += `<td>`
        response += `<i class="anticon anticon-edit" onclick="openModalPaquete('editar','` + data[i].clienteId + `','` + data[i].id + `')" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `<i class="anticon anticon-delete" onclick="eliminarPaquete(` + data[i].id + `,'` + data[i].tracking + `')" style="font-size: 30px;margin-right: 15px;"></i>`;
        response += `</td>`;
        response += `</tr>`;

    }

    return response;

}

function buildMybCombo(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        response += `<option value="` + data[i].id + `">` + data[i].myb + ` - ` + data[i].nombre + `</option>`;

    }

    return response;

}

function buildPaymentsClientsCombo(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        response += `<option value="` + data[i].id + `">` + data[i].nombre + ` ` + data[i].paterno + `</option>`;

    }

    return response;

}

function buildFliesCombo(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        response += `<option value="` + data[i].id + `">` + data[i].nombre + `</option>`;

    }

    return response;

}

function buildCompanyCombo(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        response += `<option value="` + data[i].id + `">` + data[i].nombre + `</option>`;

    }

    return response;

}

function buildPackagesListDetail(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        var estado = data[i].pagado == 0 ? "Pendiente" : "Pagado";
        var arrayLugares = [data[i].llegadaMiami, data[i].llegadaAsuncion, data[i].llegadaFrontera, data[i].llegadaArgentina, data[i].caminoInterior, data[i].llegadaBs, data[i].caminoBs];
        var numeroDías = calculateNumberOfDays(arrayLugares);

        response += `<div class="row">
            <div class="card" style="width: 100%;background-color: #1f1b24;color:#F1C232"">
                <div class="card-header">
                    <h4 class="card-title" style="color:#F1C232">` + data[i].tracking + ` - ` + data[i].lugar + ` - ` + numeroDías + ` días transcurridos</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <span>Cliente</span>`;
        response += data[i].clienteId == null ? `<h6 style="color:white"> No asignada <h6>` : `<h6 style="color:white">` + data[i].clienteId + ` </h6>`;
        response += `               </div>
                        <div class="col-3">
                            <span>Vuelo</span>
                            <h6 style="color:white">` + data[i].vueloId + `</h6>
                        </div>
                        <div class="col-3">
                            <span>Caja</span>`;
        response += data[i].cajaId == null ? `<h6 style="color:white"> No asignada <h6>` : `<h6 style="color:white">` + data[i].cajaId + ` </h6>`;
        response += `</div>
                    </div>
                    <hr>
                        <div class="row">
                            <div class="col-3">
                                <span>Peso</span>`;
        response += data[i].peso == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].peso + ` Kg</h6>`;
        response += ` </div>
                            <div class="col-3">
                                <span>Subtotal</span>`;
        response += data[i].subtotal == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].subtotal + ` </h6>`;
        response += `                    </div>
                            <div class="col-3">
                                <span>Movilidad</span>`;
        response += data[i].movilidad == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].movilidad + ` </h6>`;
        response += `                    </div >
                            <div class="col-3">
                                <span>Otros</span>`;
        response += data[i].otros == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].otros + ` </h6>`;
        response += `                     </div >
                            <div class="col-3">
                                <span>Total</span>`;
        response += data[i].total == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].total + ` </h6>`;
        response += `                    </div >
            <div class="col-3">
                <span>Tipo Cambio</span>`;
        response += data[i].tipoCambio == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].tipoCambio + ` </h6>`;
        response += `    </div >
                        </div >
            <hr>
                <div class="row">
                    <div class="col-3">
                        <span>Margen</span>`;
        response += data[i].margen == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].margen + ` </h6>`;
        response += `            </div >
            <div class="col-3">
                <span>Utilidad</span>`;
        response += data[i].utilidad == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">$` + data[i].utilidad + ` </h6>`;
        response += `    </div>
                </div >
            <hr>
                <div class="row">
                    <div class="col-3">
                        <span>Miami</span>`;
        response += data[i].llegadaMiami == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].llegadaMiami + ` </h6>`;
        response += `           </div >
                    <div class="col-3">
                        <span>Asuncion</span>`;
        response += data[i].llegadaAsuncion == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].llegadaAsuncion + ` </h6>`;
        response += `            </div>
                    <div class="col-3">
                        <span>Frontera</span>`;
        response += data[i].llegadaFrontera == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].llegadaFrontera + ` </h6>`;
        response += `            </div>
                    <div class="col-3">
                        <span>Argentina</span>`;
        response += data[i].llegadaArgentina == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].llegadaArgentina + ` </h6>`;
        response += `            </div >
                    <div class="col-3">
                        <span>Camino Interior</span>`;
        response += data[i].caminoInterior == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].caminoInterior + ` </h6>`;
        response += `            </div >
                    <div class="col-3">
                        <span>Llegada Buenos Aires</span>`;
        response += data[i].llegadaBs == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].llegadaBs + ` </h6>`;
        response += `            </div >
            <div class="col-3">
                <span>Camino Buenos Aires</span>`;
        response += data[i].caminoBs == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].caminoBs + ` </h6>`;
        response += `    </div>
                </div >
            <hr>
                <div class="row">
                    <div class="col-4">
                        <span>Pago</span>
                        <h6 style="color:white">` + estado + `</h6>
                    </div>
                </div>
            </div>
            </div >
            </div > `;

    }

    return response;

}


function buildPackagesListDetailBoxes(data) {

    response = "";

    for (let i = 0; i < data.length; i++) {

        var arrayLugares = [data[i].llegadaMiami, data[i].llegadaAsuncion, data[i].llegadaFrontera, data[i].llegadaArgentina, data[i].caminoInterior, data[i].llegadaBs, data[i].caminoBs];
        var numeroDías = calculateNumberOfDays(arrayLugares);

        response += `<div class="row"><div class="card" style="width: 100%;background-color: #1f1b24;color:#F1C232"><div class="card-header">`
        response += `<h4 class="card-title" style="color:#F1C232">` + data[i].tracking + ` - ` + data[i].lugar + ` - ` + numeroDías + ` días transcurridos</h4>`
        response += `</div><div class="card-body"><div class="row"><div class="col-4"><span>Cliente</span>`
        response += data[i].clienteId == null ? `<h6 style="color:white" > No asignada <h6>` : `<h6 style="color:white">` + data[i].clienteId + ` </h6>`;
        response += `</div><div class="col-4"><span>Tracking</span>`
        response += `<h6 style="color:white">` + data[i].tracking + `</h6>`
        response += `</div><div class="col-4"><span>Peso</span>`
        response += data[i].peso == null ? `<h6 style="color:white"> No asignado <h6>` : `<h6 style="color:white">` + data[i].peso + ` Kg</h6>`;
        response += `</div></div></div></div></div>`

    }

    return response;

}

function buildAliasListEditar(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        response += `<div class="row"><div class="col-3">`
        response += `<input type="text" id="inputMybAliasEditar` + data[i].id + `" value="` + data[i].myb + `" class="form-control" placeholder="MYB"></div>`
        response += `<div class="col"><input type="text" value="` + data[i].nombre + `" id="inputNombreAliasEditar` + data[i].id + `" class="form-control" placeholder="Nombre">`
        response += `</div><div class="col-2">`
        response += `<button type="button" class="btn btn-primary" onclick="editarAlias(` + data[i].id + `)">Guardar</button>`
        response += `</div>`
        response += `<div class="col-2"><button type="button" class="btn btn-danger" onclick="eliminarAlias(` + data[i].id + `,'` + data[i].nombre + `')">Eliminar</button>`
        response += `</div>`
        response += `</div><hr>`

    }

    return response;

}

function buildLugarListEditar(data, idPaquete) {

    response = "";

    for (i = 0; i < data.length; i++) {

        fechaInput = data[i].fechaMovimiento != null ? transformDateToInputFromat(data[i].fechaMovimiento) : null;

        response += `<div class="row"><div class="col-6">`
        response += `<input type="text" id="nombreEditarCaja" value="` + data[i].lugar + `" class="form-control" placeholder="MYB" disabled></div>`
        response += `<div class="col-3"><input type="date" value="` + fechaInput + `" id="inputFechaMovimientoEditar` + data[i].id + `" class="form-control" placeholder="Nombre">`
        response += `</div><div class="col-3">`
        response += `<button type="button" class="btn btn-primary" onclick="editarLugar(` + data[i].id + `,` + idPaquete + `,'` + data[i].lugar + `')">Guardar</button>`
        response += `</div></div><hr>`

    }

    return response;

}

function buildPackagesLocationTable(vuelos, lugares) {

    response = "";

    response += `<thead><tr><th scope="col"></th>`;
    response += `<th scope="col">` + vuelos[0].nombre + `</th>`;
    if (vuelos.length > 1) {
        response += `<th scope="col">` + vuelos[1].nombre + `</th>`;
    }
    response += `<th scope="col">Total</th></tr></thead>`;
    response += `<tbody>`;

    for (let i = 0; i < lugares.length; i++) {

        response += `<tr><th scope="row">` + lugares[i].nombre + `</th>`;
        response += `<td id="v` + vuelos[0].id + `l` + lugares[i].id + `">0</td>`;
        if (vuelos.length > 1) {
            response += `<td id="v` + vuelos[1].id + `l` + lugares[i].id + `">0</td>`;
        }
        response += `<td id="vl` + lugares[i].id + `total">0</td>`;
        response += `</tr>`;

    }

    response += `<tr><th scope="row"></th>`;
    response += `<td id="v` + vuelos[0].id + `Total">0</td>`;
    if (vuelos.length > 1) {
        response += `<td id="v` + vuelos[1].id + `Total">0</td>`;
    }
    response += `<td>0</td>`;
    response += `</tr>`;

    response += `</tbody>`;
    return response;

}

function createFliesPackageTable(data) {

    response = "";

    for (i = 0; i < data.length; i++) {

        var subtotal = 0;
        var movilidadtotal = 0;
        var costoTotal = 0;
        var pagos = 0;
        var otros = 0;
        var pesoTotal = 0;

        response += `<div class="row">`;
        response += `    <div class="col-12">`;
        if (localStorage.getItem('empresa') == 3) {
            response += `       <div style="padding: 1%;background-color: #0F0D11;border-radius: 15px;margin: 5px;">`;
            response += `           <h2 style="color: #42dfd6;font-weight: bold;text-align: left;">` + data[i].vuelo.nombre + ` <i class="anticon anticon-download" style="cursor: pointer;" onclick="exportarXLSX('tablaVuelo` + data[i].vuelo.nombre + `', 'Detalles vuelo ` + data[i].vuelo.nombre + `')"></i></h2>`;
        } else if (localStorage.getItem('empresa') == 7) {
            response += `       <div style="padding: 1%;background-color: #0F0D11;border-radius: 15px;margin: 5px;">`;
            response += `           <h2 style="color: #CB6BE6;font-weight: bold;text-align: left;">` + data[i].vuelo.nombre + ` <i class="anticon anticon-download" style="cursor: pointer;" onclick="exportarXLSX('tablaVuelo` + data[i].vuelo.nombre + `', 'Detalles vuelo ` + data[i].vuelo.nombre + `')"></i></h2>`;
        } else {
            response += `       <div style="padding: 1%;background-color: #1f1b24;border-radius: 15px;margin: 5px;">`;
            response += `           <h2 style="color: #F1C232;font-weight: bold;text-align: left;">` + data[i].vuelo.nombre + ` <i class="anticon anticon-download" style="cursor: pointer;" onclick="exportarXLSX('tablaVuelo` + data[i].vuelo.nombre + `', 'Detalles vuelo ` + data[i].vuelo.nombre + `')"></i></h2>`;
        }
        response += `           <div class="table-responsive">`;
        response += `               <table class="table table-sm" id="tablaVuelo` + data[i].vuelo.nombre + `">`;
        response += `                   <thead>`;
        response += `                       <tr class="d-flex">`;
        response += `                           <th class="col-1">Cliente</th>`;
        response += `                           <th class="col-2">N° Tracking</th>`;
        response += `                           <th class="col-1">Caja</th>`;
        response += `                           <th class="col-1">Ubicacion</th>`;
        response += `                           <th class="col-1">Costo por Kilo ($)</th>`;
        response += `                           <th class="col-1 columnaNumerica">Peso (Kg)</th>`;
        response += `                           <th class="col-1 columnaNumerica">Sub Total ($)</th>`;
        response += `                           <th class="col-1 columnaNumerica">Movilidad</th>`;
        response += `                           <th class="col-1 columnaNumerica">Otros</th>`;
        response += `                           <th class="col-2 columnaNumerica">Costo Total ($)</th>`;
        //response += `                           <th class="col-1 columnaNumerica">Pagos ($)</th>`;
        response += `                       </tr>`;
        response += `                  </thead>`;
        response += `                   <tbody>`;

        for (let j = 0; j < data[i].paquetes.length; j++) {

            if (isOdd(j)) {
                response += `<tr class="d-flex">`;
            } else {
                response += `<tr class="d-flex" style="background-color: #3e3b43;">`;
            }

            response += createFliesPackagesRow(data[i].paquetes[j]);
            subtotal += parseFloat(data[i].paquetes[j].subtotal);
            movilidadtotal += parseFloat(data[i].paquetes[j].movilidad);
            //pagos += data[i].paquetes[j].pagos;
            otros += parseFloat(data[i].paquetes[j].otros);
            pesoTotal += parseFloat(data[i].paquetes[j].peso);
        }

        costoTotal = parseFloat(subtotal) + parseFloat(movilidadtotal) + parseFloat(otros);

        response += `<tr style="background-color: #292930;" class="d-flex">`;
        response += `<th scope="row" class="col-1"></th>`
        response += `<td class="col-1"></td>`
        response += `<td class="col-1"></td>`
        response += `<td class="col-2"></td>`;
        response += `<td class="col-1"></td>`
        response += `<td class="columnaNumerica col-1">` + pesoTotal.toFixed(2) + `</td>`
        response += `<td class="columnaNumerica col-1">` + subtotal.toFixed(2) + `</td>`
        response += `<td class="columnaNumerica col-1">` + movilidadtotal.toFixed(2) + `</td>`
        response += `<td class="columnaNumerica col-1">` + otros.toFixed(2) + `</td>`
        response += `<td class="columnaNumerica col-2">` + costoTotal.toFixed(2) + `</td>`
        //response += `<td class="columnaNumerica col-1">` + pagos.toFixed(2) + `</td>`
        response += `</tr>`
        response += `                   </tbody>`;
        response += `              </table>`;
        response += `          </div>`;
        response += `       </div>`;
        response += `  </div>`;
        response += `</div>`;

    }

    return response;

}

function createTablaReporteEmpresa(data) {

    response = "";

    var subtotal = 0;
    var movilidadtotal = 0;
    var costoTotal = 0;
    var pagos = 0;
    var otros = 0;
    var pesoTotal = 0;


    response += `               <table class="table table-sm" id="tablaReporteEmpresa">`;
    response += `                   <thead>`;
    response += `                       <tr class="d-flex">`;
    response += `                           <th class="col-1">Cliente</th>`;
    response += `                           <th class="col-2">N° Tracking</th>`;
    response += `                           <th class="col-1">Caja</th>`;
    response += `                           <th class="col-1">Ubicacion</th>`;
    response += `                           <th class="col-1">Costo por Kilo ($)</th>`;
    response += `                           <th class="col-1 columnaNumerica">Peso (Kg)</th>`;
    response += `                           <th class="col-1 columnaNumerica">Sub Total ($)</th>`;
    response += `                           <th class="col-1 columnaNumerica">Movilidad</th>`;
    response += `                           <th class="col-1 columnaNumerica">Otros</th>`;
    response += `                           <th class="col-2 columnaNumerica">Costo Total ($)</th>`;
    //response += `                           <th class="col-1 columnaNumerica">Pagos ($)</th>`;
    response += `                       </tr>`;
    response += `                  </thead>`;
    response += `                   <tbody>`;

    for (let i = 0; i < data.length; i++) {

        response += `<tr class="d-flex">`;

        response += createFliesPackagesRow(data[0]);
        subtotal += parseFloat(data[i].subtotal);
        movilidadtotal += parseFloat(data[i].movilidad);
        pagos += data[i].pagos;
        otros += parseFloat(data[i].otros);
        pesoTotal += parseFloat(data[i].peso);
    }

    costoTotal = parseFloat(subtotal) + parseFloat(movilidadtotal) + parseFloat(otros);

    response += `<tr style="background-color: #292930;" class="d-flex">`;
    response += `<th scope="row" class="col-1"></th>`
    response += `<td class="col-1"></td>`
    response += `<td class="col-1"></td>`
    response += `<td class="col-2"></td>`;
    response += `<td class="col-1"></td>`
    response += `<td class="columnaNumerica col-1">` + pesoTotal.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-1">` + subtotal.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-1">` + movilidadtotal.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-1">` + otros.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-2">` + costoTotal.toFixed(2) + `</td>`
    //response += `<td class="columnaNumerica col-1">` + pagos.toFixed(2) + `</td>`
    response += `</tr>`
    response += `                   </tbody>`;
    response += `              </table>`;



    return response;

}

function createFliesPackagesRow(data) {

    response = "";


    response += `<th scope="row" class="col-1">` + data.clienteNombre + `</th>`
    response += `<td class="col-2" style= "word-wrap: break-word;width: 150px;">'` + data.tracking + `'</td>`
    response += data.cajaId == null ? `<td class="col-1" style= "word-wrap: break-word;width: 100px;"> Sin Asignar </td>` : `<td class="col-1" style= "word-wrap: break-word;width: 100px;">` + data.cajaId + `</td>`;
    response += data.lugar == null ? `<td class="col-1" style= "word-wrap: break-word;width: 100px;"> Sin Asignar </td>` : `<td class="col-1" style= "word-wrap: break-word;width: 100px;">` + data.lugar + `</td>`;
    response += `<td class="col-1">` + data.precioKilo + `</td>`
    response += `<td class="columnaNumerica col-1">` + data.peso.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-1">` + data.subtotal.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-1">` + data.movilidad.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-1">` + data.otros.toFixed(2) + `</td>`
    response += `<td class="columnaNumerica col-2"> ` + (data.subtotal + data.movilidad + data.otros).toFixed(2) + `</td>`
    //response += data.pagos == null ? `<td class="columnaNumerica col-1"> 0 </td>` : `<td class="columnaNumerica col-1">` + data.pagos.toFixed(2);
    //response += data.pagos == null ? '' : `<i class="anticon anticon-search" onclick="getPackagePaymentsDetail(` + data.id + `,'` + data.clienteNombre + `')" style="font-size: 20px;margin-left: 10px;cursor: pointer;"></i>`;
    response += `</td>`;
    response += `</tr>`

    return response;

}

function createMatrizLugaresCajas(nombre, data) {

    response = "";

    response += `<tr class="table-row-matrix">`
    response += `<th scope="row" class="headcol th-matriz">` + nombre + `</th>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputMiamiDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputAsuncionDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputCIPDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputIPDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputFronteraDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputArgentinaDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputCBSDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputBSDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputCIDate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `<td class="table-row-matrix td-matriz"><input id="inputIADate" type="date" value="null" class="form-control input-data-matrix"></td>`
    response += `</tr>`

    for (let i = 0; i < data.length; i++) {
        response += `<tr class="table-row-matrix">`
        response += `<th scope="row" class="headcol th-matriz">(` + data[i].caja.cliente + `) ` + data[i].caja.tracking + `</th>`
        response += `<td class="td-matriz"><input id="inputMiami` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.Miami?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputAsuncion` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.Asuncion?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputCIP` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.CaminointeriorParaguay?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputIP` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.InteriorParaguay?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputFrontera` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.Frontera?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputArgentina` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.Argentina?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputCBS` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.CaminoaBuenosAires?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputBS` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.BuenosAires?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputCI` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.Caminoalinterior?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `<td class="td-matriz"><input id="inputIA` + data[i].caja.id + `" class="check-matrix" type="checkbox" ${data[i].movimientos.InteriorArgentina?.fechaMovimiento != null ? 'checked=""' : ''}></td>`
        response += `</tr>`
    }

    return response;

}