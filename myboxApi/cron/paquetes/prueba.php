<?php

require_once '../../utilitarios/notificaciones/enviarNotificacion.php';

$date = Date('Y/m/d h:i:s');

sendWppMessageMybox($date, '+51941425618');
