formule_grammar = '''
?start: statement

// statements produce effects
?statement: if_statement
     | expression

?if_statement: "si" expression "alors" statement ["sinon" statement]

// expressions produce values
?expression: literal
      | unary
      | binary
      | call

?literal: 
      | CNAME              -> string
      | "VRAI"             -> true
      | "FAUX"             -> false

// embed functions in the langage
?call: "identite" "(" identifier "," literal ")" -> identite
      | "reponse" "(" identifier "," literal ")" -> reponse_comparison
      | "reponse" "(" identifier ")" -> reponse_value
      | "min" "(" number "," number ")" -> min
      | "max" "(" number "," number ")" -> max

?unary:  ( "-" | "!" ) expression 

?binary: sum

?sum: product
    | sum "+" product   -> add
    | sum "-" product   -> sub

?product: number 
    | product "*" number  -> mul
    | product "/" number  -> div
    | "(" [expression] ")"

arguments: expression [ "," expression]
identifier: CNAME -> identifier
number: SIGNED_NUMBER


%import common.WORD
%import common.ESCAPED_STRING
%import common.SIGNED_NUMBER
%import common.CNAME
%import common.WS

%ignore WS
'''
