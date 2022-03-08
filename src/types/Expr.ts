import type { Token } from './Token'

export type Expr = {
  left : Expr
  right : Expr
  operator : Token
}

export type Binary = Expr & {}
const binary = (left : Expr, right : Expr, operator : Token) : Binary => {
  return {
    left,
    right,
    operator
  }
}
