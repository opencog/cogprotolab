

(use-modules (srfi srfi-1))

; General terminology:
; The "stars" are the edges, the duals are the other vertex.
; So, given a vertex, the left-stars are a list of all edges
; pointing at the vertex.  The right-stars are all the edges
; pointing away from the vertex.  The left-duals are all the
; vertexes that have edges pointing at the target. The right-duals
; are all the vertexes that have edges pointing away from the target.
;
; The MI is the mutual information of an edge. Get it by saying
; `(pair-freq 'pair-fmi edge-atom)`
; -----------------------------------------

; Create a simple object with some methods on it ...
(define (make-navigator STARS-OBJ FWD-METHOD BACK-METHOD
                         RANK-OBJ RANK-METHOD NUM-TO-SHOW)
"
  make-navigator -- Generic graph navigation object
  See examples for more info.
"
	; Make a short list in sorted order.
	(define (short-list FWD TARGET-VERTEX)

		; Depending on whether FWD is #t or #f,
		; get the edge pointing towards or away from the target.
		(define (get-edge OTHER-VERTEX)
			(if FWD
				(STARS-OBJ 'get-pair TARGET-VERTEX OTHER-VERTEX)
				(STARS-OBJ 'get-pair OTHER-VERTEX TARGET-VERTEX)))

		; Define a compare function that compares two
		; vertexes... assuming both have the target-vertex
		; in common.
		(define (more-fun VTX-A VTX-B)
			(define pair-a (get-edge VTX-A))
			(define pair-b (get-edge VTX-B))
   		(> (RANK-OBJ RANK-METHOD pair-a)
	   		(RANK-OBJ RANK-METHOD pair-b)))

		; Get the list of all vertexes that are joined
		; by some edge to the target vertex.
		(define tail-verts
			(if FWD
				(STARS-OBJ FWD-METHOD TARGET-VERTEX)
				(STARS-OBJ BACK-METHOD TARGET-VERTEX)))

		; Sort the list above, and then return the
		; first NUM-TO-SHOW of that list.
		(take (sort tail-verts more-fun) NUM-TO-SHOW))

	; Return an edge-score for the given edge.
	; This is a trivial wrapper.
	(define (escore LEFT-VTX RIGHT-VTX)
		(define edge (STARS-OBJ 'get-pair LEFT-VTX RIGHT-VTX))
   	(RANK-OBJ RANK-METHOD edge))

	; Call the various methods on the object.
	(lambda (message . args)
		(case message
			((forward) (short-list #t args))
			((backward) (short-list #f args))
			((edge-score)  (apply escore args))
			(else "Ooops! unknown method!")
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
