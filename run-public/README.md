
Experiment public
=================


Loading and running the pairs tranche-123 file:
```
guile -l cogserver.scm

(define pair-obj (make-any-link-api))
(define star-obj (add-pair-stars pair-obj))
(pair-obj 'fetch-pairs)
(print-matrix-summary-report star-obj)
```

========
