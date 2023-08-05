<?php
require_once '../../dataAccess/dalImportador.php';
require_once '../../dataAccess/dalPaquete.php';
require_once '../../utilitarios/email/sendEmailGeneric.php';
require_once '../../dataAccess/dalMovimiento.php';

function importarPaquetesMasivo($data)
{
    $fechaActual = date('Y-m-d');
    $ruta = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $trackingsError = '';

    try {

        foreach ($data as $index => $paquete) {
            $idCliente = buscarClientePorNombre($paquete->nombreCliente);
            $existeTracking = revisarTrackingServicio($paquete->Tracking);
            $descripcion = isset($paquete->Descripcion) ? $paquete->Descripcion : '';
            $destino = isset($paquete->Destino) ? getDestino($paquete->Destino) : null;
            $vuelo = isset($paquete->Vuelo) ? buscarVueloPorNombre($paquete->Vuelo) : null;
            $caja = isset($paquete->Caja) ? buscarCajaPorNombre($paquete->Caja) : null;
            $insertValido = validarInsert($paquete, $existeTracking, $vuelo, $caja);
            $margen = isset($paquete->Margen) ? $paquete->Margen : 0;
            $utilidad = isset($paquete->Utilidad) ? $paquete->Utilidad : 0;

            if ($insertValido == 1) {

                $idPaqueteNuevo = guardarPaqueteImportacion($paquete->Tracking, $idCliente, $descripcion, $paquete->Peso, $paquete->Subtotal, $paquete->Movilidad, $paquete->Otros, $paquete->Total, $margen, $utilidad, 0, $fechaActual, 0, 0, $destino, $vuelo, $caja, $paquete->precioKilo);

                if ($idPaqueteNuevo == 0) {
                    $trackingsError .= $paquete->Tracking . ',';
                } else {
                    for ($j = 0; $j < count($ruta); $j++) {
                        guardarMovimientoServicio($ruta[$j], $idPaqueteNuevo);
                    }
                }

                if (isset($paquete->Miami)) {
                    actualizarMovimientoMasivoServicio(1, $idPaqueteNuevo, $paquete->Miami, 'Miami');
                }
            } else {

                $trackingsError .= "-El paquete con tracking " . $paquete->Tracking . " no pudo ser importado porque " . getErrorReason($insertValido) . " <br>";
            }
        }
    } catch (\Throwable $th) {
        $trackingsError .= $th->getMessage() . "\n";
        $trackingsError .= "En el archivo: " . $th->getFile() . "\n";
        $trackingsError .= "En la línea: " . $th->getLine() . "\n";
    }

    if ($trackingsError == '') {
        return ["estado" => 1, "mensaje" => "Importacion terminada correctamente"];
    } else {
        $destinatario = array("name" => "Administrador", "email" => "mrjaimewanna@gmail.com");
        $remitente = array("name" => "Errores en la importacion", "email" => "contacto@mybox.com");

        $destinatarioArrays = array();
        array_push($destinatarioArrays, $destinatario);

        sendInBlue($remitente, $destinatarioArrays, "Errores en la importacion " . $fechaActual, $trackingsError);

        return ["estado" => 0, "mensaje" => $trackingsError];
    }
}

function validarInsert($paquete, $existeTracking, $vuelo, $caja)
{

    $valid = 1;

    if ($existeTracking != 0) {
        $valid = 2;
    }

    if (isset($paquete->Vuelo) && $vuelo == 0) {
        $valid = 3;
    }

    if (isset($paquete->Caja) && $caja == 0) {
        $valid = 4;
    }

    return $valid;
}

function getErrorReason($id)
{
    $razon = '';

    switch ($id) {
        case 2:
            $razon = "ya existe un paquete con ese tracking registrado";
            break;

        case 3:
            $razon = "el nombre del vuelo ingresado no existe o no pudo ser encontrado";
            break;

        case 4:
            $razon = "el nombre de la caja ingresada no existe o no pudo ser encontrada";
            break;

        default:
            $razon = "hubo un error";
            break;
    }

    return $razon;
}

function getDestino($destino)
{
    $idLugar = '';

    switch ($destino) {
        case 'Asuncion':
            $idLugar = 2;
            break;

        case 'Interior Paraguay':
            $idLugar = 10;
            break;

        case 'Buenos Aires':
            $idLugar = 7;
            break;

        case 'Interior Argentina':
            $idLugar = 9;
            break;

        default:
            $idLugar = 0;
            break;
    }

    return $idLugar;
}
