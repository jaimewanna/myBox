<?php

function buildNewAccountEmail($nombreCliente, $emailCliente, $passwordCliente)
{
    try {
        $asuntoCorreo = "Confirmacion activacion panel tracking - mybox";
        $body = file_get_contents('../../utilitarios/email/templates/nuevaCuenta.html');

        $body = str_replace(":nombre:", $nombreCliente, $body);
        $body = str_replace(":email:", $emailCliente, $body);
        $body = str_replace(":password:", $passwordCliente, $body);

        //$aux = sendEmail($correoCliente,$asuntoCorreo,$body);

        $destinatario = array("name" => "Nuevo Cliente", "email" => $emailCliente);
        $remitente = array("name" => "Bienvenido", "email" => "contacto@mybox.com");

        $destinatarioArrays = array();
        array_push($destinatarioArrays, $destinatario);

        sendInBlue($remitente, $destinatarioArrays, $asuntoCorreo, $body);

        return true;
    } catch (Exception $e) {
        return false;
    }
}

function errorEnvioNotificacionesEmail($body)
{
    try {

        $fechaActual = date('Y-m-d');
        $jaime = array("name" => "Administrador", "email" => "mrjaimewanna@gmail.com");
        $jose = array("name" => "Administrador", "email" => "jose@myboxpy.page");
        $remitente = array("name" => "Errores en el envio de notificaciones", "email" => "contacto@mybox.com");

        $destinatarioArrays = array();
        array_push($destinatarioArrays, $jaime, $jose);

        sendInBlue($remitente, $destinatarioArrays, "Errores en el envio de notificaciones " . $fechaActual, $body);

        return true;
    } catch (Exception $e) {
        return false;
    }
}


function buildPasswordRecoverEmail($Codigo, $correoCliente)
{
    try {
        $asuntoCorreo = "Recuperaci��n de contrase�0�9a - Restaurante19";
        $body = file_get_contents('../../utilitarios/email/templates/recoverPassword.html');

        $body = str_replace("codeFlag", $Codigo, $body);

        $aux = sendEmail($correoCliente, $asuntoCorreo, $body);

        $destinatario = array("name" => "Nuevo Cliente", "email" => $correoCliente);
        $remitente = array("name" => "Recuperar Contrase�0�9a", "email" => "soporte@barrio24.com");

        $destinatarioArrays = array();
        array_push($destinatarioArrays, $destinatario);

        sendInBlue($remitente, $destinatarioArrays, $asuntoCorreo, $body);

        return $aux;
    } catch (Exception $e) {
        return false;
    }
}

function sendEmail($to, $asuntoCorreo, $body)
{

    $header = "Content-type: text/html\r\n";

    $aux = mail($to, $asuntoCorreo, $body, $header);

    if ($aux) {
        return true;
    } else {
        return false;
    }
}

function sendInBlue($arrayRemitente, $arrayDeArrayDestinatario, $asunto, $cuerpoCorreo)
{
    try {

        $url = 'https://api.sendinblue.com/v3/smtp/email';

        // Create a new cURL resource
        $ch = curl_init($url);

        // Setup request to send json via POST
        $data = array(
            'sender' => $arrayRemitente,
            'to' => $arrayDeArrayDestinatario,
            'subject' => $asunto,
            'htmlContent' => $cuerpoCorreo
        );

        $payload = json_encode($data);

        // Attach encoded JSON string to the POST fields
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        // Set the content type to application/json
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'api-key: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   '));

        // Return response instead of outputting
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute the POST request
        $result = curl_exec($ch);

        // Close cURL resource
        curl_close($ch);

        return $result;
    } catch (Exception $e) {

        return $e->getMessage();
    }
}

function emailDate()
{
    date_default_timezone_set('America/Lima');
    return date("d.m.y");
}

function emailHour()
{
    date_default_timezone_set('America/Lima');
    return date("h:i:s");
}
