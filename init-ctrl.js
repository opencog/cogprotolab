var init = {
    "font-size": "12",
    "background-color": "gray",
    "ctrl-color": "rgb(48,48,48)",
    "text-color": "white",
    "shadow-radius": "0",
    "shadow-color": "rgba(255, 255, 255, 0.5)",
    "host": "127.0.0.1",
    "port": "17001",
    "cmd-delay": "125000",
    "vis-cmd": {
        "all atoms": "(cog-prt-atomspace)",
        "find pets": "(cog-execute!\n  (Get\n    (Inheritance\n      (Variable \"$p\")\n      (Concept \"Pet\"))))"
    }
};

