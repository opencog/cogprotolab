<?php
    error_reporting(0);
    
    $host = urldecode($_POST['host']);
    $port = urldecode((int)$_POST['port']);
    $cmd = urldecode($_POST['cmd']);
    $prompt = str_replace("\\x1b", "", urldecode($_POST['prompt']));
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "telnet connection error: $errno $errstr";

    } else {
        //stream_set_blocking($fp, false);
        stream_set_timeout($fp, 0, 0);
        
        send($fp, $delay, "scm\n", $prompt);
        echo send($fp, $delay, "$cmd", $prompt);

        fclose($fp);
    }

    function send ($fp, $delay, $command, $prompt) {
        //write to socket
        if (fwrite($fp, $command) == false) {
            return "telnet command send error";
        }

        $response = "";
        //read socket
        while (true) {
            usleep(5000);
            while (($ret = fgets($fp)) != false) {
                if ($ret == $prompt) {
                    $response = substr($response, 0, -1);
                    return $response;
                }
                
                $response .= $ret;
            }
        }
    }
?>
