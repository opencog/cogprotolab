var init = {
    "host": "localhost",
    "port": "17014",
    "font-size": "50",
    "background-color": "gray",
    "oval-color": "rgb(208,208,208)",
    "text-color": "rgb(48,48,48)",
    "power-consumption-optimisation": "80%",
    "ui-scale": "100%",
    "database": {
        "top-node": "end",
        "num-to-show": 10,
        "show-query": 0,
        "queries": [
            {
                "description1": "query pair-stars, ranking by pair-fmi",
                "description2": "forward direction",
                "query": "(pair-nav 'forward (Word \"$word\"))",
                "ranking": "(pair-nav 'edge-score (Word \"$word1\") (Word \"$word2\"))",
            },
            {
                "description": "query sim-stars 0, ranking by sim-fmi",
                "description2": "forward direction",
                "query": "(sim-fmi-nav 'forward (Word \"$word\"))",
                "ranking": "(sim-fmi-nav 'edge-score (Word \"$word1\") (Word \"$word2\"))"
            },
            {
                "description": "query sim-stars 1, ranking by sim-vmi",
                "description2": "forward direction",
                "query": "(sim-vmi-nav 'forward (Word \"$word\"))",
                "ranking": "(sim-vmi-nav 'edge-score (Word \"$word1\") (Word \"$word2\"))"
            }
            /*
            {
                "description1": "query pair-stars, ranking by pair-fmi",
                "description2": "forward direction",
                "query": "(define (pair-score EDGE) (pair-freq 'pair-fmi EDGE)) " + 
                         "(define pair-nav (make-nav pair-stars 'right-duals 'left-duals pair-score $num-to-show)) " + 
                         "(pair-nav 'forward (Word \"$word\"))",
                "ranking": "(pair-nav 'edge-score (Word \"$word1\") (Word \"$word2\"))",
            },
            {
                "description": "query sim-stars 0, ranking by sim-fmi",
                "description2": "forward direction",
                "query": "(define (sim-fmi EDGE) (cog-value-ref (sim-obj 'pair-similarity EDGE) 0)) " +
                         "(define sim-fmi-nav (make-nav sim-stars 'right-duals 'left-duals sim-fmi $num-to-show)) " +
                         "(sim-fmi-nav 'forward (Word \"$word\"))",
                "ranking": "(sim-fmi-nav 'edge-score (Word \"$word1\") (Word \"$word2\"))"
            },
            {
                "description": "query sim-stars 1, ranking by sim-vmi",
                "description2": "forward direction",
                "query": "(define (sim-vmi EDGE) (cog-value-ref (sim-obj 'pair-similarity EDGE) 1)) " +
                "(define sim-vmi-nav (make-nav sim-stars 'right-duals 'left-duals sim-vmi $num-to-show)) " +
                "(sim-vmi-nav 'forward (Word \"$word\"))",
                "ranking": "(sim-vmi-nav 'edge-score (Word \"$word1\") (Word \"$word2\"))"
            }
            */
        ]
    }
};
