;
; similarity.scm
;
; Quick-n-dirty API for word similarity.
; Assumes that objects have been defines as described in README.md
; and that data has been loaded.
;

(define (get-sim-vec WA WB)
"
  get-sim-vec WA WB -- get a vector of scores for two words.

  Example usage:
     (get-sim-vec (Word \"end\") (Word \"well\"))
"
	(define word-pair (sim-stars 'get-pair WA WB))
	(sim-obj 'pair-similarity word-pair))

(define (get-sim-fmi WA WB)
"
  get-sim-fmi WA WB -- Get the fractional MI between two words
"
	(cog-value-ref (get-sim-vec WA WB) 0))

(define (get-sim-vmi WA WB)
"
  get-sim-vmi WA WB -- Get the variational MI between two words
"
	(cog-value-ref (get-sim-vec WA WB) 1))

(define (get-similar-words COMPARE-FUN NUM-TO-TAKE WORD)
"
  get-similar-words COMPARE-FUN NUM-TO-TAKE WORD

  Return the top NUM-TO-TAKE words that are the most similar to WORD,
  using COMPARE-FUN to provide a similarity score.

  Example usage:
     (get-similar-words get-sim-vmi 10 (Word \"end\"))
"
	; Compare the two words to WORD.
	(define (greater-than WA WB)
		(> (COMPARE-FUN WORD WA) (COMPARE-FUN WORD WB)))

	; Get a list of all similar words.
	(define all-sim-words (sim-stars 'right-duals WORD))

	(take (sort all-sim-words greater-than) NUM-TO-TAKE)
)

;;=============================================
;; Examples
;;
;   (sim-stars 'left-basis-size)
;   (sim-stars 'right-duals (Word "end"))
;   (sim-obj 'describe)
;   (sim-obj 'pair-similarity (sim-stars 'get-pair (Word "end") (Word "well")))
;
; ----------------------------
