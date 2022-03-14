<?php
    //error_reporting(0);
    
    $host = urldecode($_POST['host']);
    $port = urldecode((int)$_POST['port']);
    $cmd = urldecode($_POST['cmd']);
    $prompt = str_replace("\\x1b", "", urldecode($_POST['prompt']));
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "telnet connection error: $errno $errstr";

    } else {
        stream_set_blocking($fp, false);
        
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

/*
    //error_reporting(0);
    
    $host = urldecode($_GET['host']);
    $port = (int)urldecode($_GET['port']);
    $cmd = urldecode($_GET['cmd']);
    $prompt = str_replace("\\x1b", "", urldecode($_GET['prompt']));
    
    //$fp = fsockopen("$host:$port");
    $fp = fsockopen($host, $port, $errno, $errstr, 5);
echo $host;
echo $port;
    if(!$fp){
        echo "telnet connection error: $errstr";

    } else {
        stream_set_blocking($fp, false);
        
        send($fp, "scm\n", $prompt);
        echo send($fp, "$cmd", $prompt);

        fclose($fp);
    }

    function send ($fp, $command, $prompt) {
        //write to socket
        if (fwrite($fp, $command) == false) {
            return "telnet command send error";
        }

        //read socket
        while (true) {
            usleep(25000);
            $response = "";
            while (($ret = fgets($fp)) != false) {
                if ($ret == $prompt) {
                    $response = substr($response, 0, -1);
                    return $response;
                }
                
                $response .= $ret;
            }
        }
    }
*/
?>
