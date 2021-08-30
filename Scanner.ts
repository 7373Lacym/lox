import {Token} from "./Token";
import {TokenType} from "./types/Token"
import {error} from "./index";

type Scanner = {
  __Type: "Scanner",
  tokens ?:  Token[]
  source : string
  start: number
  current : number
  line : number
}

export const Scanner = ( source: string) : Scanner => {
  return {
    current: 0,
    line: 1,
    start: 0,
    __Type: "Scanner",
    source
  }
}

const isAtEnd = (scanner : Scanner) => {
  return scanner.current >= scanner.source.length;
}

export const scanTokens = (scanner : Scanner) => {
  while(!isAtEnd(scanner)) {
    scanner.start = scanner.current;
    scanToken(scanner)
  }
  scanner.tokens.push(Token(TokenType.EOF, "", null, scanner.line))
  return scanner.tokens
}

export const addToken = (type : TokenType, literal : {}, scanner : Scanner) => {
  const text = scanner.source.substring(scanner.start, scanner.current)
  scanner.tokens.push(Token(type,text,literal, scanner.line))
}

const string = (scanner: Scanner) => {
 while(peek(scanner) != '"' && !isAtEnd(scanner)) {
   if(peek(scanner) == "\n") scanner.line++
   advance(scanner)
 }
 if(isAtEnd(scanner)) {
   error(scanner.line, "Unterminated string")
   return
 }
 advance(scanner)
  const value = scanner.source.substring(scanner.start + 1, scanner.current - 1)
  addToken(TokenType.STRING, value, scanner)
}

const scanToken = (scanner : Scanner) => {
  const c : string = advance( scanner);
  switch (c) {
    case '"': string(scanner); break;
    case '(': addToken(TokenType.LEFT_PAREN, {}, scanner); break;
    case ')': addToken(TokenType.RIGHT_PAREN, {}, scanner); break;
    case '{': addToken(TokenType.LEFT_BRACE, {}, scanner); break;
    case '}': addToken(TokenType.RIGHT_BRACE, {}, scanner); break;
    case ',': addToken(TokenType.COMMA, {}, scanner); break;
    case '.': addToken(TokenType.DOT, {}, scanner); break;
    case '-': addToken(TokenType.MINUS, {}, scanner); break;
    case '+': addToken(TokenType.PLUS, {}, scanner); break;
    case ';': addToken(TokenType.SEMICOLON, {}, scanner); break;
    case '*': addToken(TokenType.STAR, {}, scanner); break;

    case '!':
      addToken(match('=', scanner) ? TokenType.BANG_EQUAL : TokenType.BANG, {}, scanner)
      break;
    case '=':
      addToken(match('=', scanner) ? TokenType.EQUAL_EQUAL: TokenType.EQUAL, {}, scanner)
      break;
    case '<':
      addToken(match('=', scanner) ? TokenType.LESS_EQUAL: TokenType.LESS, {}, scanner)
      break;
    case '>':
      addToken(match('=', scanner) ? TokenType.GREATER_EQUAL: TokenType.GREATER, {}, scanner)
      break;
    case '/':
      if(match('/', scanner)) {
        while(peek(scanner) != '\n' && !isAtEnd(scanner)) advance(scanner)
      } else {
        addToken(TokenType.SLASH, {}, scanner)
      }
      break;
    case ' ':
    case '\r':
    case '\t':
      // Ignore whitespace.
      break;
    case '\n':
      scanner.line++;
      break;
    default :
      if(isDigit(c)) {
        number(scanner)
      } else {
        error(scanner.line, "Unexpected Character")
      }
  }
}

const isDigit = (c : string) => {
 return c >= "0" && c <= '9'
}

const number = (scanner : Scanner) => {
  while(isDigit(peek(scanner))) advance(scanner)
  if(peek(scanner) == '.' && isDigit(peekNext(scanner))) {
    advance(scanner)
    while(isDigit(peek(scanner))) advance(scanner)
  }
  addToken(TokenType.NUMBER, scanner.source.substring(scanner.start, scanner.current), scanner)
}

const peekNext = (scanner : Scanner) => {
  if(scanner.current +1 >= scanner.source.length) return '\0'
  return scanner.source.charAt(scanner.current + 1)
}

const peek = (scanner) : string => {
  if(isAtEnd(scanner)) return '\0'
  return scanner.source.charAt(scanner.current)

}

const match = (expected : string, scanner: Scanner) : boolean => {
  if(isAtEnd(scanner)) return false
  if(scanner.source.charAt(scanner.current) != expected) return false
  scanner.current++
  return true
}

const advance = (scanner : Scanner) : string => {
  return scanner.source.charAt(scanner.current++)
}
