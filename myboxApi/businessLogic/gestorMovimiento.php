<?php
require_once '../../dataAccess/dalMovimiento.php';


function guardarMovimiento($datos)
{

    $id = guardarMovimientoServicio($datos->lugar, $datos->paquete);

    if ($id != 0) {
        return ["estado" => 1, "mensaje" => "Movimiento creado correctamente"];
    } else {
        return ["estado" => 0, "mensaje" => "El movimiento no pudo ser creado"];
    }
}

function actualizarMovimiento($datos)
{
    $fechaAux = date('Y-m-d H:i:s', strtotime($datos->fecha));

    $id = actualizarMovimientoServicio($datos->idMovimiento, $fechaAux, $datos->idPaquete, convertirNombreAId($datos->lugar));

    if ($id != 0) {
        return ["estado" => 1, "mensaje" => "Movimiento actualizado correctamente"];
    } else {
        return ["estado" => 0, "mensaje" => "El movimiento no pudo ser actualizado"];
    }
}

function consultarMovimientosPorPaquete($datos)
{

    return consultarMovimientosPaqueteServicio($datos->idPaquete);
}


function convertirNombreAId($nombre)
{

    return convertirNombreAIdServicio($nombre);
}

function actualizarMovimientoMasivo($datos)
{

    $fechaLugares = $datos->fechasLugares;
    $detallesPaquetes = $datos->detallePaquetesLugares;
    $detallesEntdiad = $datos->detallesEntdiad;

    try {
        foreach ($detallesPaquetes as $paquete) {

            if ($paquete->miami && $fechaLugares->miami != "") {
                actualizarMovimientoMasivoServicio(1, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->miami)), 'Miami');
            }

            if ($paquete->asuncion && $fechaLugares->asuncion != "") {
                actualizarMovimientoMasivoServicio(2, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->asuncion)), 'Asuncion');
            }

            if ($paquete->caminoInteriorParaguay && $fechaLugares->caminoInteriorParaguay != "") {
                actualizarMovimientoMasivoServicio(3, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->caminoInteriorParaguay)), 'Camino interior Paraguay');
            }

            if ($paquete->interiorParaguay && $fechaLugares->interiorParaguay != "") {
                actualizarMovimientoMasivoServicio(10, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->interiorParaguay)), 'Camino interior Paraguay');
            }

            if ($paquete->frontera && $fechaLugares->frontera != "") {
                actualizarMovimientoMasivoServicio(4, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->frontera)), 'Frontera');
            }

            if ($paquete->argentina && $fechaLugares->argentina != "") {
                actualizarMovimientoMasivoServicio(5, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->argentina)), 'Argentina');
            }

            if ($paquete->caminoBS && $fechaLugares->caminoBS != "") {
                actualizarMovimientoMasivoServicio(6, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->caminoBS)), 'Camino a Buenos Aires');
            }

            if ($paquete->BS && $fechaLugares->BS != "") {
                actualizarMovimientoMasivoServicio(7, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->BS)), 'Buenos Aires');
            }

            if ($paquete->caminoInterior && $fechaLugares->caminoInterior != "") {
                actualizarMovimientoMasivoServicio(8, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->caminoInterior)), 'Camino al interior');
            }

            if ($paquete->interiorArgentina && $fechaLugares->interiorArgentina != "") {
                actualizarMovimientoMasivoServicio(9, $paquete->id, date('Y-m-d H:i:s', strtotime($fechaLugares->interiorArgentina)), 'Interior Argentina');
            }
        }
    } catch (\Throwable $th) {
        return ["estado" => 0, "mensaje" =>  $th];
    }

    actualizarCajaMovimiento($detallesEntdiad, $fechaLugares);

    return ["estado" => 1, "mensaje" => "Movimiento actualizado correctamente"];
}

function actualizarCajaMovimiento($detallesEntdiad, $fechaLugares)
{
    eliminarMovimientoCajaServicio($detallesEntdiad->nombre);

    $fechaLugares->miami != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 1, date('Y-m-d H:i:s', strtotime($fechaLugares->miami))) : '';
    $fechaLugares->asuncion != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 2, date('Y-m-d H:i:s', strtotime($fechaLugares->asuncion))) : '';
    $fechaLugares->caminoInteriorParaguay != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 3, date('Y-m-d H:i:s', strtotime($fechaLugares->caminoInteriorParaguay))) : '';
    $fechaLugares->interiorParaguay != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 10, date('Y-m-d H:i:s', strtotime($fechaLugares->interiorParaguay))) : '';
    $fechaLugares->frontera != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 4, date('Y-m-d H:i:s', strtotime($fechaLugares->frontera))) : '';
    $fechaLugares->argentina != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 5, date('Y-m-d H:i:s', strtotime($fechaLugares->argentina))) : '';
    $fechaLugares->caminoBS != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 6, date('Y-m-d H:i:s', strtotime($fechaLugares->caminoBS))) : '';
    $fechaLugares->BS != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 7, date('Y-m-d H:i:s', strtotime($fechaLugares->BS))) : '';
    $fechaLugares->caminoInterior != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 8, date('Y-m-d H:i:s', strtotime($fechaLugares->caminoInterior))) : '';
    $fechaLugares->interiorArgentina != "" ? guardarMovimientoCajaServicio($detallesEntdiad->nombre, 9, date('Y-m-d H:i:s', strtotime($fechaLugares->interiorArgentina))) : '';
}

function consultarEntidadMovimiento($datos)
{
    return consultarMovimientosEntidadServicio($datos->nombre);
}
