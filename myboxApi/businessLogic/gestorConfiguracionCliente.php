<?php
require_once '../../dataAccess/dalConfiguracionCliente.php';
require_once '../../utilitarios/email/sendEmailGeneric.php';

function crearPasswordTokenPanelCliente($datos)
{

    $password = generarStringRandom(8);
    $token = generarStringRandom(15);

    $id = guardarpasswordClienteServicio($password, $token, $datos->clienteId);
    buildNewAccountEmail($datos->nombreCliente, $datos->emailCliente, $password);

    if ($id == 0) {
        return ["estado" => 0, "mensaje" => "No se pudo crear la clave del cliente exitosamente"];
    } else {
        return ["estado" => 1, "mensaje" => "Se pudo crear la clave del cliente exitosamente"];
    }
}

function eliminarPasswordTokenPanelCliente($datos)
{

    $id = eliminarpasswordClienteServicio($datos->clienteId);

    if ($id == 0) {
        return ["estado" => 0, "mensaje" => "No se pudo desactivar el panel del cliente exitosamente"];
    } else {
        return ["estado" => 1, "mensaje" => "Se pudo desactivar el panel del cliente exitosamente"];
    }
}

function consultarconfiguracionrCliente($datos)
{

    return consultarconfiguracionrClienteServicio($datos->id);
}

function generarStringRandom($largo)
{
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array(); //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < $largo; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}
