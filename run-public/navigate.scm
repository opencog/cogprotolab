

(use-modules (srfi srfi-1))

(define (make-navigator STARS-OBJ FWD-METHOD BACK-METHOD
                         RANK-OBJ RANK-METHOD NUM-TO-SHOW)
"
  make-navigator -- Generic graph navigation object
  See examples for more info.
"
	; Make a short list in sorted order.
	(define (short-list FWD HEAD-VERTEX)

		; Get the edge whose head is HEAD and tail is TAIL
		(define (get-edge TAIL-VERTEX)
			(if FWD
				(STARS-OBJ 'get-pair HEAD-VERTEX TAIL-VERTEX)
				(STARS-OBJ 'get-pair TAIL-VERTEX HEAD-VERTEX)))

		; Define a compare function
		(define (more-fun VTX-A VTX-B)
			(define pair-a (get-edge VTX-A))
			(define pair-b (get-edge VTX-B))
   		(> (RANK-OBJ RANK-METHOD pair-a)
	   		(RANK-OBJ RANK-METHOD pair-b)))

		; Get the list of everything displayable
		(define tail-verts
			(if FWD
				(STARS-OBJ FWD-METHOD HEAD-VERTEX)
				(STARS-OBJ BACK-METHOD HEAD-VERTEX)))

		; Return a sorted list
		(take (sort tail-verts more-fun) NUM-TO-SHOW))

	(define (escore HEAD-VTX TAIL-VTX)
		(define edge (STARS-OBJ 'get-pair HEAD-VTX TAIL-VTX))
   	(RANK-OBJ RANK-METHOD edge))

	(lambda (message . args)
		(case message
			((forward) (short-list #t args))
			((backward) (short-list #f args))
			((edge-score)  (apply escore args))
		))
)


; Create a navigator for the given matrix and ranking objects
; In this case, pair-stars and pair-freq ...
; All of these arguments should be taken from a config file.
(define curr-nav
	(make-navigator
		pair-stars 'right-duals 'left-duals
		pair-freq 'pair-fmi 10))

; Examples
(curr-nav 'forward (Word "end"))
(curr-nav 'backward (Word "end"))

; Scores, from the forwards-list
(curr-nav 'edge-score (Word "end") (Word "chapter"))
(curr-nav 'edge-score (Word "end") (Word "notes"))
(curr-nav 'edge-score (Word "end") (Word "badly"))

; From the backwards list
(curr-nav 'edge-score (Word "rear") (Word "end"))
(curr-nav 'edge-score (Word "far") (Word "end"))
