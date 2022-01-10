<?php
    $dir = urldecode($_GET['dir']);

    if ($dir == "vis") {
        $dirstr = "../dir-visuals";
    
    } else if ($dir == "scr"){
        $dirstr = "../dir-scripts";
    }

    echo "{";
    $arr = scandir($dirstr);
    for ($i = 0; $i < count($arr); $i++) {
        if ($arr[$i] != "." && $arr[$i] != "..") {
            $file = file_get_contents($dirstr."/".$arr[$i]);
            $file = substr($file, 0, -1);
            $file = str_replace("\"", "\\\"", $file);
            $file = str_replace("\n", "\\n", $file);
            
            echo "\"".$arr[$i]."\":\"".$file."\"";
            
            if ($i < count($arr) - 1)
                echo ",";
        }
    }
    echo "}"
?>
