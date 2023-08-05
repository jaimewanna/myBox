<?php
require_once '../../dataAccess/dalPaquete.php';
require_once '../../dataAccess/dalMovimiento.php';
require_once '../../dataAccess/dalAlias.php';
require_once '../../dataAccess/dalDeuda.php';
require_once '../../businessLogic/gestorPago.php';

date_default_timezone_set('America/Lima');

function obtenerTotalPaquetes()
{

    return obtenerPaquetesTotalServicio();
}

function obtenerDisplayPaquetes()
{

    return obtenerPaquetesDisplayServicio();
}

function obtenerTotalPaquetesResumen()
{

    return obtenerPaquetesCompletoResumenServicio();
}

function obtenerDisplayPaquetesResumen()
{

    return obtenerPaquetesDisplayResumenServicio();
}

function obtenerEspecificoPaquete($datos)
{

    return obtenerPaqueteEspecificoServicio($datos->id);
}

function getRuta($id)
{

    $ruta = null;

    switch ($id) {
        case '2':
            $ruta = [1, 2];
            break;

        case '10':
            $ruta = [1, 2, 3, 10];
            break;

        case '7':
            $ruta = [1, 2, 4, 5, 6, 7];
            break;

        case '9':
            $ruta = [1, 2, 4, 5, 6, 7, 8, 9];
            break;

        default:
            $ruta = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            break;
    }

    return $ruta;
}

function actualizarPaquete($datos)
{

    $fecha = new DateTime();
    $fechaAux = $fecha->format('Y-m-d H:i:s');

    /*if ($datos->lugarModo == "new") {
        $idsRutas = getRuta($datos->destino);
        for ($i = 0; $i < count($idsRutas); $i++) {
            guardarMovimientoServicio($idsRutas[$i], $datos->idPaquete);
        }
    } else if ($datos->lugarModo == "update" && $datos->destino != $datos->destinoOriginal) {
        eliminarMovimientoDestinoServicio($datos->idPaquete);
        $idsRutas = getRuta($datos->destino);
        for ($i = 0; $i < count($idsRutas); $i++) {
            guardarMovimientoServicio($idsRutas[$i], $datos->idPaquete);
        }
    }*/

    $registro = actualizarPaquetesServicio(
        $datos->trackingPaquete,
        $datos->clientePaquete,
        $datos->desPaquete,
        $datos->vueloPaquete,
        $datos->cajaPaquete,
        $datos->pesoPaquete,
        $datos->subtotalPaquete,
        $datos->movilidadPaquete,
        $datos->otrosPaquete,
        $datos->totalPaquete,
        $datos->margenPaquete,
        $datos->utlidadPaquete,
        $datos->cambioPaquete,
        $datos->idPaquete,
        $datos->destino,
        $datos->precioKilo
    );

    $deuda = recalcularDeudaCliente($datos->clientePaquete);

    if ($registro === 0) {
        return ["estado" => 0, "mensaje" => "No se pudo actualizar el paquete"];
    } else {
        return ["estado" => 1, "mensaje" => "Se actualizo correctamente el paquete", "sumas" => $deuda];
    }
}

function busquedaPersonalizadaPaqueteGestor($datos)
{

    $valor = $datos->valor;
    $campo = $datos->campo;

    $proc = "SELECT DISTINCT p.id,p.tracking,e.nombreEmpresa,a.aliasNombre AS 'nombreCliente',(SELECT l.lugarNombre FROM registromovimiento rm JOIN lugar l ON rm.idLugar = l.lugarId WHERE rm.idPaquete = p.id ORDER BY rm.fechaMovimiento ASC LIMIT 1) as 'lugar', v.nombre, p.total, p.peso, a.aliasId FROM paquete p LEFT JOIN alias a ON p.clienteId = a.aliasId LEFT JOIN cliente c ON a.clienteId = c.id JOIN vuelo v ON p.vueloId = v.id LEFT JOIN empresa e ON c.empresaId = e.id LEFT JOIN registromovimiento rm ON rm.idPaquete = p.id LEFT JOIN caja ca ON p.cajaId = ca.id WHERE " . $campo . " LIKE '%" . $valor . "%' ";

    $resultado = busquedaPersonalizadaPaquete($proc);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function paginacionPaqueteGestor($datos)
{

    $page = $datos->pagina;
    $items = 20;
    $offset = ($page - 1) * $items;

    $query = "SELECT DISTINCT p.id,p.tracking,e.nombreEmpresa,a.aliasNombre AS 'nombreCliente',(SELECT l.lugarNombre FROM registromovimiento rm JOIN lugar l ON rm.idLugar = l.lugarId WHERE rm.idPaquete = p.id ORDER BY rm.fechaMovimiento ASC LIMIT 1) as 'lugar', v.nombre, p.total, p.peso, a.aliasId FROM paquete p LEFT JOIN alias a ON p.clienteId = a.aliasId LEFT JOIN cliente c ON a.clienteId = c.id JOIN vuelo v ON p.vueloId = v.id LEFT JOIN empresa e ON c.empresaId = e.id LEFT JOIN registromovimiento rm ON rm.idPaquete = p.id ORDER BY v.id DESC,p.id ASC,a.aliasNombre DESC LIMIT " . $offset . "," . $items;

    $resultado = busquedaPersonalizadaPaquete($query);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function eliminarPaqueteGestor($datos)
{

    $id = eliminarPaqueteServicio($datos->id);

    return ["estado" => 1, "mensaje" => "Paquete eliminado exitosamente"];
}

function guradarKilosHistoricos($datos)
{

    $fechaAux = date('Y-m-d H:i:s', strtotime($datos->fecha));
    $clienteAlias = consutlarAliasPorIdServicio($datos->cliente);
    $cliente = $clienteAlias[0]->id;
    $id = guardarKilosHistoricosServicio($cliente, $datos->peso, $datos->estado, $datos->historico, $fechaAux);

    if ($id > 0) {
        $respuesta = ["estado" => 1, "mensaje" => "Operacion guardada exitosamente"];
    } else {
        $respuesta = ["estado" => 0, "mensaje" => "No se pudo guardar la operacion correctamente"];
    }

    return $respuesta;
}

function guardarPaqueteHistorico($datos)
{

    $historico = $datos->pagado == true ? 1 : 0;
    $clienteAlias = consutlarAliasPorIdServicio($datos->cliente);
    $cliente = $clienteAlias[0]->id;

    $id = guardarPaqueteHistoricoServicio($datos->tracking, $cliente, $datos->descripcion, $datos->peso, $datos->subtotal, $datos->movilidad, $datos->otros, $datos->total, $datos->margen, $datos->utilidad, $datos->tipoCambio, $datos->fechaRegistro, $datos->pagado, $historico);

    if ($id > 0) {
        $respuesta = ["estado" => 1, "mensaje" => "Operacion guardada exitosamente"];
    } else {
        $respuesta = ["estado" => 0, "mensaje" => "No se pudo guardar la operacion correctamente"];
    }

    return $respuesta;
}

function consultarPaquetesFranquicia($datos)
{
    return obtenerPaquetesFranquiciaServicio($datos->empresa);
}

function PaquetesReportePorEmpresa($datos)
{
    return getPaquetesReportePorEmpresaServicio($datos->empresaId);
}


function getEmpresasCombo($datos)
{
    return getEmpresas($datos->empresa);
}
