import {TokenType} from "./types/Token";

export type Token = {
  type : TokenType
  lexeme: string
  literal : {}
  line : number
}

export const Token = (type : TokenType, lexeme : string, literal: {}, line: number) => {
  return {
    __Type: 'Token',
    type,
    lexeme,
    literal,
    line
  }
}
