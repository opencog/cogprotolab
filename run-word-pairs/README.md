
Experiment public
=================


Loading and running the word-pairs and also disjuncts:
```
guile -l cogserver.scm

(define pair-obj (make-any-link-api))
(pair-obj 'fetch-pairs)
(define pair-stars (add-pair-stars pair-obj))
(print-matrix-summary-report pair-stars)
(define pair-freq (add-pair-freq-api pair-stars))

(define cset-obj (make-pseudo-cset-api))
(cset-obj 'fetch-pairs)
(define cset-stars (add-pair-stars cset-obj))
(print-matrix-summary-report cset-stars)
(define cset-freq (add-pair-freq-api cset-stars))


(define (do-add-similarity-api LLOBJ)
   (define SIM-ID "shape-mi")
   (add-similarity-api LLOBJ #f SIM-ID))

(define sim-obj (do-add-similarity-api cset-obj))
(sim-obj 'fetch-pairs)
(define sim-stars (add-pair-stars sim-obj))

(cog-close storage-node)
;;; (cog-atomspace-ro!)
;;; (cog-push-atomspace)
```

* `run-1-marg-tranche-123.rdb` -- Requires 59GB to load word-pairs,
    60 GB to be usable, so not eligible.

* `run-1-t12-tsup-1-1-1.rdb` -- 6.4 GB to load word pairs and
   also disjuncts.  9 minutes to load everything.
   7 GB after computing (w,d) MI

* r13-one-sim200.rdb -- 8.2GB to load word-pairs, word-disjunct
   pairs and similarities.


TODO:
-----
```
(batch-all-pair-mi cset-stars)
;;; (cog-atomspace-ro!)  ;; No this fails somehow.
```

Curr stats:
-----------
```
((PredicateNode . 17) (ListLink . 3504317) (AnyNode . 4) (Connector . 6800) (ConnectorDir . 2) (ConnectorSeq . 65792) (Section . 269822) (EvaluationLink . 3431412) (TypeNode . 3) (SchemaNode . 1) (RocksStorageNode . 1) (WordNode . 7111) (LgLinkNode . 1))
```


User Instructions
=================
User should do this:

```
ssh -f -N -p 224 atomspace@gnucash.org -L 17014:10.0.3.90:19014
rlwrap telnet localhost 17014
scm
(format #t "Hello world\n")
```

There are two types of data in this dataset: word-word pairs and
word-disjunct pairs.  The first example is for word-word pairs,
showing how to find related words.

Many words are NOT in the dataset, so random experimentation
may result in no replies.

To get a list of all word-word pairs, with a given word on the right:
```
(pair-stars 'left-stars (WordNode "end"))
```

This will return a long list, the last part of which is:
```
 (EvaluationLink (ctv 1 0 19)
  (LgLinkNode "ANY")
  (ListLink (WordNode "cold") (WordNode "end")))
 (EvaluationLink (ctv 1 0 10)
  (LgLinkNode "ANY")
  (ListLink (WordNode "seen") (WordNode "end")))
 (EvaluationLink (ctv 1 0 34)
  (LgLinkNode "ANY")
  (ListLink (WordNode "quick") (WordNode "end")))
 (EvaluationLink (ctv 1 0 18)
  (LgLinkNode "ANY")
  (ListLink (WordNode "horrible") (WordNode "end")))
```
Ignore the `ctv` (this is an observation count)

These "pairs" are "edges", the name of the edge is "ANY",
and there's a bunch of numerical data hanging off each edge.

The "relatedness" of a word-pair can be obtained by looking
at it's mutual information (MI). View this as follows:
```
(pair-freq 'pair-fmi
   (Evaluation (LgLink "ANY") (List (Word "horrible") (Word "end"))))
```
The above returns a single floating point number, in the range of
about -20 to about +20, indicating the MI of the pair. The higher,
the better.

Pairs, with the word on the left:
```
(pair-stars 'right-stars (Word "end"))
```

The "other end" of a given word. (the other vertex at the
end of an edge).
```
(pair-stars 'right-duals (Word "end"))
(pair-stars 'left-duals (Word "end"))
```

Word-disjunct pairs
-------------------
A lot like the above, except:
```
(cset-stars 'right-stars (WordNode "end"))
```

Similarity examples
-------------------
```
(sim-stars 'left-basis-size)
(sim-stars 'right-duals (Word "end"))
(sim-obj 'describe)
(sim-obj 'pair-similarity (sim-stars 'get-pair (Word "end") (Word "well")))
```
The above is nasty in it's native form, so ... use the wrapper in `navigate.scm`
like so:

```
(define (sim-fmi EDGE) (cog-value-ref (sim-obj 'pair-similarity EDGE) 0))

(define sim-fmi-nav (make-nav sim-stars 'right-duals 'left-duals sim-fmi 10))
```
and use it like so:
```
(sim-fmi-nav 'forward (Word "end"))
(sim-fmi-nav 'edge-score (Word "end")  (WordNode "out"))
```

Also interesting is the variational MI:
```
(define (sim-vmi EDGE) (cog-value-ref (sim-obj 'pair-similarity EDGE) 1))
```


Documentation
=============
```
(pair-freq 'help)
(pair-freq 'describe)
(pair-stars 'help)
(pair-stars 'describe)
```

========
