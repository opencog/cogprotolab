;Jane attends college
(Evaluation
  (Predicate "Attends college")
  (Concept "Jane"))

;trigger graph rewriting
(cog-execute!
  (Bind
    ;if X attends school or X attends college
    (Or
      (Evaluation
        (Predicate "Attends school")
        (Variable "$X"))

      (Evaluation
        (Predicate "Attends college")
        (Variable "$X")))

    ;then X is a student
    (Evaluation
      (Predicate "Is a student")
      (Variable "$X"))))