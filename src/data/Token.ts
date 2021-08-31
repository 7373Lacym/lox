import {TokenType} from "../types/Token";

export const Token = (type : TokenType, lexeme : string, literal: {}, line: number) => {
  return {
    __Type: 'Token',
    type,
    lexeme,
    literal,
    line
  }
}
