;Some relationships
(Member
  (Concept "Sun") (Concept "Has mass"))
(Member
  (Concept "Moon") (Concept "Has mass"))
(Member
  (Concept "Earth") (Concept "Has mass"))

;Trigger graph rewriting
(cog-execute!
  (Bind
    ;Declare the variables [optional]
    (Variable "$object")
    
    ;if an object belongs to a set "Has mass"
    (Member
      (Variable "$object")
      (Concept "Has mass"))
      
    ;then the object belongs to a set "Has gravity"
    (Member
      (Variable "$object")
      (Concept "Has gravity"))))