<?php
    $dir = urldecode($_GET['dir']);

    if ($dir == "vis") {
        $dirstr = "../scripts/scm/visualization";
    
    } else if ($dir == "pre"){
        $dirstr = "../scripts/scm/predefined";
    }

    echo "{";
    $arr = scandir($dirstr);
    for ($i = 0; $i < count($arr); $i++) {
        if (!is_dir($dirstr."/".$arr[$i])) {
            $file = file_get_contents($dirstr."/".$arr[$i]);
            $file = str_replace("\"", "\\\"", $file);
            $file = str_replace("\n", "\\n", $file);
            
            echo "\"".$arr[$i]."\":\"".$file."\"";
            
            if ($i < count($arr) - 1)
                echo ",";
        }
    }
    echo "}"
?>
