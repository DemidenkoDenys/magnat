<?
if(isset($_POST['mail']) && $_POST['mail'] != "")
{
    if($_POST['action'] == "subscribe")
        $subject = 'Оформлена подписка';
    else if($_POST['action'] == "order")
        $subject = 'Оформлен заказ';
        $to = "demydenkodenys@gmail.com";

        $message = '
            <html>
                <head>
                    <title>'.$subject.'</title>
                </head>
                <body>';

    if($_POST['name'] != '' && $_POST['phone'] != '' && isset($_POST['name']) && isset($_POST['phone']))
        $message .= '<p>Имя: '.$_POST['name'].'</p><p>Телефон: '.$_POST['phone'].'</p><p>Почта: '.$_POST['mail'].'</p></body></html>';
    else
        $message .= '<p>'.$_POST['mail'].'</p></body></html>';

    $headers  = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: Отправитель <magnathifi@gmail.com>\r\n";
    mail($to, $subject, $message, $headers);
}
?>
