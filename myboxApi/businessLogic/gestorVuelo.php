<?php
require_once '../../dataAccess/dalVuelo.php';
require_once '../../dataAccess/dalPaquete.php';
require_once '../../dataAccess/dalCliente.php';
require_once '../../dataAccess/dalMovimiento.php';

function guardarVuelo($datos)
{
    $trackingsRepetidos = '';
    $trackingsError = '';
    $fechaAux = date('Y-m-d H:i:s', strtotime($datos->fechaSalida));
    $ruta = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    $listaTrackings = explode(",", $datos->trackings);

    $id = guardarVueloServicio($datos->nombreVuelo, $datos->trackingVuelo, count($listaTrackings), $fechaAux, $datos->empresaUserId);

    if ($id != 0) {

        for ($i = 0; $i < count($listaTrackings); $i++) {

            if (revisarTrackingServicio($listaTrackings[$i]) == 0) {
                $idPaquete = guardarPaqueteVueloServicio($listaTrackings[$i], $id, $datos->empresaUserId);

                if ($idPaquete == 0) {
                    $trackingsError .= $listaTrackings[$i] . ',';
                } else {
                    for ($j = 0; $j < count($ruta); $j++) {
                        guardarMovimientoServicio($ruta[$j], $idPaquete);
                    }
                }
            } else {

                $trackingsRepetidos .= $listaTrackings[$i] . ',';
            }
        }

        if ($trackingsRepetidos != '' || $trackingsError != '') {

            return ["estado" => 0, "mensaje" => "Hubo un problema al crear paquetes con los siguientes trackings " . $trackingsRepetidos . ',' . $trackingsError];
        }

        return ["estado" => 1, "mensaje" => "Vuelo y paquetes creados correctamente"];
    } else {

        return ["estado" => 0, "mensaje" => "Hubo un problema al crear el vuelo"];
    }

    return ["estado" => 0, "mensaje" => "Hubo un problema al crear el vuelo"];
}

function obtenerTotalVuelos()
{

    return obtenerVuelosTotalServicio();
}

function consultarTrackingVueloDestinos($datos)
{
    $reponse = array();

    $listaTrackings = consultarTrackingsVueloServicio($datos->idVuelo);

    foreach ($listaTrackings as $paquete) {
        $movimientos = consultarMovimientosPaqueteServicioEspecial($paquete->id);

        $aux = [
            "caja" => [
                "id" => $paquete->id,
                "tracking" => $paquete->tracking,
                "cliente" => consultarClienteNombrePaqueteServicio($paquete->id)->nombre
            ],
            "movimientos" => $movimientos
        ];

        array_push($reponse, $aux);
    }

    return $reponse;
}

function obtenerDisplayVuelos()
{

    return obtenerVuelosDisplayServicio();
}

function actualizarVuelo($datos)
{

    $listaTrackings = explode(",", $datos->listaNuevosTracking);
    $numeroPaquetes = count($listaTrackings) + $datos->nVuelo;
    $registro = actualizarVueloServicio($datos->nombre, $datos->tracking, $numeroPaquetes, $datos->fechaVuelo, $datos->idVuelo);

    if ($datos->listaNuevosTracking != "") {


        for ($i = 0; $i < count($listaTrackings); $i++) {

            $idPaquete = guardarPaqueteVueloServicio($listaTrackings[$i], $datos->idVuelo, $datos->empresaUserId);

            if ($idPaquete == 0) {
                return ["estado" => 0, "mensaje" => "Hubo un problema al crear el paquete con el tracking" . $listaTrackings[$i]];
            }
        }
    }

    if ($registro === 0) {
        return ["estado" => 0, "mensaje" => "No se pudo actualizar el vuelo"];
    } else {
        return ["estado" => 1, "mensaje" => "Se actualizo correctamente el vuelo"];
    }
}

function consultarTrackingVuelo($datos)
{

    return consultarTrackingsVueloServicio($datos->idVuelo);
}

function consultarPaquetesDetalleVuelo($datos)
{

    return consultarPaquetesDetallePorVuelo($datos->idVuelo);
}

function busquedaPersonalizadaVueloGestor($datos)
{

    $valor = $datos->valor;
    $campo = $datos->campo;

    if ($datos->campo == "v.fechaSalida") {
        $campo = "DATE_FORMAT(v.fechaSalida, '%d-%m-%Y')";
    }

    $proc = "SELECT v.id,v.nombre,v.tracking,v.nPaquetes,DATE_FORMAT(v.fechaSalida, '%d-%m-%Y') as 'Fecha Salida',v.fechaRegistro,v.fechaModificacion,v.estado,(SELECT SUM(p.peso) from paquete p WHERE p.vueloId = v.id) as 'pesoVuelo',(SELECT SUM(p.total) from paquete p WHERE p.vueloId = v.id) as 'valorVuelo' FROM vuelo v WHERE " . $campo . " LIKE '%" . $valor . "%' ";

    $resultado = busquedaPersonalizadaVuelo($proc);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function paginacionVuelosGestor($datos)
{

    $page = $datos->pagina;
    $items = 15;
    $offset = ($page - 1) * $items;

    $query = "SELECT v.id,v.nombre,v.tracking,v.nPaquetes,DATE_FORMAT(v.fechaSalida, '%d-%m-%Y') as 'Fecha Salida',v.fechaRegistro,v.fechaModificacion,v.estado,(SELECT SUM(p.peso) from paquete p WHERE p.vueloId = v.id) as 'pesoVuelo',(SELECT SUM(p.total) from paquete p WHERE p.vueloId = v.id) as 'valorVuelo' FROM vuelo v WHERE v.estado = 1 ORDER BY v.nombre DESC,v.id DESC LIMIT " . $offset . "," . $items;

    $resultado = busquedaPersonalizadaVuelo($query);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function eliminarVueloGestor($datos)
{

    $id = eliminarVueloServicio($datos->id);


    return ["estado" => 1, "mensaje" => "Paquete eliminado exitosamente"];
}

function consultarVuelosFranquicia($datos)
{
    return obtenerVuelosFranquiciaServicio($datos->empresaId);
}
