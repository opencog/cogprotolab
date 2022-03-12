
Experiment public
=================


Loading and running the word-pairs and also disjuncts:
```
guile -l cogserver.scm

(define pair-obj (make-any-link-api))
(define pair-stars (add-pair-stars pair-obj))
(pair-obj 'fetch-pairs)
(print-matrix-summary-report pair-stars)

(define cset-obj (make-pseudo-cset-api))
(cset-obj 'fetch-pairs)
(define cset-stars cset-obj)
(print-matrix-summary-report cset-stars)
```

* `run-1-marg-tranche-123.rdb` -- Requires 59GB to load word-pairs,
    60 GB to be usable, so not eligible.

* `run-1-t12-tsup-1-1-1.rdb` -- 6.4 GB to load word pairs and
   also disjuncts.  9 minutes to load everything.

========
