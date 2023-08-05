<?php
require_once '../../dataAccess/dalCaja.php';

function obtenerTotalCajas()
{

    return obtenerCajasCompletoServicio();
}

function obtenerDisplayCajas()
{

    return obtenerCajasDisplayServicio();
}

function guardarCajaNueva($datos)
{

    if (buscarNombreRepetido($datos->nombreCaja) == 0) {

        $listaTrackings = explode(",", $datos->trackings);

        $id_caja = guardarCajaServicio($datos->nombreCaja, $datos->trackingCaja, count($listaTrackings), $datos->destino, $datos->entrega, $datos->viaje);

        if ($id_caja != 0) {

            $trackingsInvalidos = null;

            for ($i = 0; $i < count($listaTrackings); $i++) {

                $idPaquete = actualizarCajaPaqueteServicio($listaTrackings[$i], $id_caja);

                if ($idPaquete == 0) {

                    $trackingsInvalidos = $trackingsInvalidos . " " . $listaTrackings[$i];
                }
            }

            if ($trackingsInvalidos == null) {
                return ["estado" => 1, "mensaje" => "Caja creada y paquetes actualizados correctamente"];
            } else {
                return ["estado" => 0, "mensaje" => "Se creo la caja pero no se encontraron los siguientes trackings:" . $trackingsInvalidos];
            }
        } else {

            return ["estado" => 0, "mensaje" => "Hubo un problema al crear la caja"];
        }

        return ["estado" => 0, "mensaje" => "Hubo un problema al crear la caja"];
    } else {
        return ["estado" => 0, "mensaje" => "El nombre de la caja ya existe, por favor ingrese otro"];
    }
}

function consultarTrackingCaja($datos)
{

    return consultarTrackingsCajaServicio($datos->idCaja);
}

function actualizarCaja($datos)
{
    $listaTrackings = explode(",", $datos->listaNuevosTracking);
    $numeroPaquetes = count($listaTrackings) + $datos->nPaquetes;
    $registro = actualizarCajaServicio($datos->nombre, $datos->tracking, $numeroPaquetes, $datos->idCaja, $datos->entrega, $datos->viaje);

    if ($datos->listaNuevosTracking != "") {

        $trackingsInvalidos = null;

        for ($i = 0; $i < count($listaTrackings); $i++) {

            $idPaquete = actualizarCajaPaqueteServicio($listaTrackings[$i], $datos->idCaja);

            if ($idPaquete == 0) {
                $trackingsInvalidos = $trackingsInvalidos . " " . $listaTrackings[$i];
            }
        }

        if ($trackingsInvalidos == null) {
            return ["estado" => 1, "mensaje" => "Caja y paquetes actualizados correctamente"];
        } else {
            return ["estado" => 0, "mensaje" => "Se creo la caja pero no se encontraron los siguientes trackings:" . $listaTrackings[$i]];
        }
    }

    if ($registro === 0) {
        return ["estado" => 0, "mensaje" => "No se pudo actualizar la caja"];
    } else {
        return ["estado" => 1, "mensaje" => "Se actualizo correctamente la caja"];
    }
}

function consultarPaquetesDetalleCaja($datos)
{

    return consultarPaquetesDetallePorCaja($datos->idCaja);
}

function eliminarCajaGestor($datos)
{

    $id = eliminarCajaServicio($datos->id);


    return ["estado" => 1, "mensaje" => "Caja eliminado exitosamente"];
}

function busquedaPersonalizadaCajaGestor($datos)
{

    $valor = $datos->valor;
    $campo = $datos->campo;

    $proc = "SELECT c.id,c.nombre,c.tracking,c.nPaquetes,DATE_FORMAT(c.fechaRegistro, '%d-%m-%Y') as 'Fecha Registro',c.fechaModificacion,c.estado,(SELECT SUM(p.peso) from paquete p WHERE p.cajaId = c.id) as 'pesoCaja',(SELECT SUM(p.total) from paquete p WHERE p.cajaId = c.id) as 'valorCaja',DATE_FORMAT(c.fechaEntrega, '%d-%m-%Y') as 'Fecha Entrega', DATE_FORMAT(c.fechaViaje, '%d-%m-%Y') as 'Fecha Viaje' from caja c WHERE " . $campo . " LIKE '%" . $valor . "%' and estado = 1 ORDER BY c.nombre DESC, fechaRegistro DESC";

    $resultado = busquedaPersonalizadaCaja($proc);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function paginacionCajaGestor($datos)
{

    $page = $datos->pagina;
    $items = 15;
    $offset = ($page - 1) * $items;

    $proc = "SELECT c.id,c.nombre,c.tracking,c.nPaquetes,DATE_FORMAT(c.fechaRegistro, '%d-%m-%Y') as 'Fecha Registro',c.fechaModificacion,c.estado,(SELECT SUM(p.peso) from paquete p WHERE p.cajaId = c.id) as 'pesoCaja',(SELECT SUM(p.total) from paquete p WHERE p.cajaId = c.id) as 'valorCaja',DATE_FORMAT(c.fechaEntrega, '%d-%m-%Y') as 'Fecha Entrega', DATE_FORMAT(c.fechaViaje, '%d-%m-%Y') as 'Fecha Viaje' from caja c WHERE estado = 1 ORDER BY c.nombre DESC, fechaRegistro DESC LIMIT " . $offset . "," . $items;

    $resultado = busquedaPersonalizadaCaja($proc);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}
