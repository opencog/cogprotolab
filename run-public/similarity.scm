;
; similarity.scm
;
; Quick-n-dirty API for word similarity.
; Assumes that objects have been defines as described in README.md
; and that data has been loaded.
;

(define (get-sim-vec WA WB)
	(define word-pair (sim-stars 'get-pair WA WB))
	(sim-obj 'pair-similarity word-pair))

(define (get-sim-fmi WA WB)
	(cog-value-ref (get-sim-vec WA WB) 0))

(define (get-sim-vmi WA WB)
	(cog-value-ref (get-sim-vec WA WB) 1))

;;=============================================
; Examples
(sim-stars 'left-basis-size)
(sim-stars 'right-duals (Word "end"))
(sim-obj 'describe) 
(sim-obj 'pair-similarity (sim-stars 'get-pair (Word "end") (Word "well")))

