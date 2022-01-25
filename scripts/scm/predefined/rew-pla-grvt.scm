;Graph rewriting declarations
(define rewrite-gravity
  (Bind
    ;Declare the variables [optional]
    (Variable "$object")
    
    ;Declare the pattern used to ground
    ;the variables
    (MemberLink
      (Variable "$object")
      (Concept "Has mass"))
      
      ;If a match is found for the pattern
      ;then we want to add the following
      ;hypergraph at the Atomspace
      (MemberLink
        (Variable "$object")
        (Concept "Has gravity"))))

;Trigger graph rewriting
(cog-execute! rewrite-gravity)