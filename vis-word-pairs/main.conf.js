var init = {
    "host": "localhost",
    "port": "17002",
    "ctrl-font-size": "1.75",
    "font-size": "50",
    "background-color": "gray",
    "oval-color": "rgb(208,208,208)",
    "text-color": "rgb(48,48,48)",
    "power-consumption-optimisation": "80%",
    "ui-scale": "100%",
    "database": {
        "top-node": "the",
        "queries": [
            {
                "description-1": "query pair-nav, ranking by pair-fmi",
                "description-2": "forward direction",
                "query": "(pair-nav 'forward $word)",
                "ranking": "(pair-nav 'edge-score $word1 $word2)",
            },
            {
                "description-1": "query sim-fmi-nav, ranking by sim-fmi",
                "description-2": "backward direction",
                "query": "(sim-fmi-nav 'backward $word)",
                "ranking": "(sim-fmi-nav 'edge-score $word1 $word2)"
            },
            {
                "description-1": "query sim-vmi-nav, ranking by sim-vmi",
                "description-2": "forward direction",
                "query": "(sim-vmi-nav 'forward $word)",
                "ranking": "(sim-vmi-nav 'edge-score $word1 $word2)"
            }
        ],
        "stats": [
            {
                "left-wild-fmi": "(pair-freq 'left-wild-fmi $word)"
            },
            {
                "right-wild-fmi": "(pair-freq 'right-wild-fmi $word)"
            },
            {
                "left-wild-logli": "(pair-freq 'left-wild-logli $word)"
            },
            {
                "right-wild-logli": "(pair-freq 'right-wild-logli $word)"
            },
            {
                "right-wild-fentropy": "(pair-freq 'right-wild-fentropy $word)"
            },
            {
                "left-wild-fentropy": "(pair-freq 'left-wild-fentropy $word)"
            }
        ]
    }
};
