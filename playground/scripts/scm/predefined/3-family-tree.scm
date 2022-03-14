;John is a parent of Jane
(Evaluation
  (Predicate "Parent")
  (List
    (Concept "John")
    (Concept "Jane")))

;John is a parent of Jill
(Evaluation
  (Predicate "Parent")
  (List
    (Concept "John")
    (Concept "Jill")))

;Jane is a parent of Jess
(Evaluation
  (Predicate "Parent")
  (List
    (Concept "Jane")
    (Concept "Jess")))

;Jill is a parent of Jeff
(Evaluation
  (Predicate "Parent")
  (List
    (Concept "Jill")
    (Concept "Jeff")))

;graph rewriting
(cog-execute!
  (Bind
    ;if X is a parent of Y and Y is a parent of Z
    (And
      (Evaluation
        (Predicate "Parent")
        (List
          (Variable "$X")
          (Variable "$Y")))

      (Evaluation
        (Predicate "Parent")
        (List
          (Variable "$Y")
          (Variable "$Z"))))

    ;then X is a grandparent of Z
    (Evaluation
      (Predicate "Grandparent")
      (List
        (Variable "$X")
        (Variable "$Z")))));trigger graph rewriting

(cog-execute!
  (Bind
    ;if X is a parent of Y and X is a parent of Z
    ;and Y is not Z
    (And
      (Evaluation
        (Predicate "Grandparent")
        (List
          (Variable "$X")
          (Variable "$Y")))

      (Evaluation
        (Predicate "Grandparent")
        (List
          (Variable "$X")
          (Variable "$Z")))

      (Not
        (Equal
          (Variable "$Y")
          (Variable "$Z"))))

    ;then Y is a relative of Z
    (Evaluation
      (Predicate "Relative")
      (List
        (Variable "$Y")
        (Variable "$Z")))))