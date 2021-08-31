"use strict";
exports.__esModule = true;
exports.addToken = exports.scanTokens = exports.scanner = void 0;
var Token_1 = require("../../Token");
var Token_2 = require("../types/Token");
var index_1 = require("../../index");
var scanner = function (source) {
    return {
        current: 0,
        line: 1,
        start: 0,
        __Type: "Scanner",
        source: source,
        tokens: []
    };
};
exports.scanner = scanner;
var isAtEnd = function (scanner) {
    return scanner.current >= scanner.source.length;
};
var scanTokens = function (scanner) {
    while (!isAtEnd(scanner)) {
        scanner.start = scanner.current;
        scanToken(scanner);
    }
    scanner.tokens.push((0, Token_1.Token)(Token_2.TokenType.EOF, "", null, scanner.line));
    return scanner.tokens;
};
exports.scanTokens = scanTokens;
var addToken = function (type, literal, scanner) {
    var text = scanner.source.substring(scanner.start, scanner.current);
    scanner.tokens.push((0, Token_1.Token)(type, text, literal, scanner.line));
};
exports.addToken = addToken;
var string = function (scanner) {
    while (peek(scanner) != '"' && !isAtEnd(scanner)) {
        if (peek(scanner) == "\n")
            scanner.line++;
        advance(scanner);
    }
    if (isAtEnd(scanner)) {
        (0, index_1.error)(scanner.line, "Unterminated string");
        return;
    }
    advance(scanner);
    var value = scanner.source.substring(scanner.start + 1, scanner.current - 1);
    (0, exports.addToken)(Token_2.TokenType.STRING, value, scanner);
};
var scanToken = function (scanner) {
    var c = advance(scanner);
    switch (c) {
        case '"':
            string(scanner);
            break;
        case '(':
            (0, exports.addToken)(Token_2.TokenType.LEFT_PAREN, {}, scanner);
            break;
        case ')':
            (0, exports.addToken)(Token_2.TokenType.RIGHT_PAREN, {}, scanner);
            break;
        case '{':
            (0, exports.addToken)(Token_2.TokenType.LEFT_BRACE, {}, scanner);
            break;
        case '}':
            (0, exports.addToken)(Token_2.TokenType.RIGHT_BRACE, {}, scanner);
            break;
        case ',':
            (0, exports.addToken)(Token_2.TokenType.COMMA, {}, scanner);
            break;
        case '.':
            (0, exports.addToken)(Token_2.TokenType.DOT, {}, scanner);
            break;
        case '-':
            (0, exports.addToken)(Token_2.TokenType.MINUS, {}, scanner);
            break;
        case '+':
            (0, exports.addToken)(Token_2.TokenType.PLUS, {}, scanner);
            break;
        case ';':
            (0, exports.addToken)(Token_2.TokenType.SEMICOLON, {}, scanner);
            break;
        case '*':
            (0, exports.addToken)(Token_2.TokenType.STAR, {}, scanner);
            break;
        case '!':
            (0, exports.addToken)(match('=', scanner) ? Token_2.TokenType.BANG_EQUAL : Token_2.TokenType.BANG, {}, scanner);
            break;
        case '=':
            (0, exports.addToken)(match('=', scanner) ? Token_2.TokenType.EQUAL_EQUAL : Token_2.TokenType.EQUAL, {}, scanner);
            break;
        case '<':
            (0, exports.addToken)(match('=', scanner) ? Token_2.TokenType.LESS_EQUAL : Token_2.TokenType.LESS, {}, scanner);
            break;
        case '>':
            (0, exports.addToken)(match('=', scanner) ? Token_2.TokenType.GREATER_EQUAL : Token_2.TokenType.GREATER, {}, scanner);
            break;
        case '/':
            if (match('/', scanner)) {
                while (peek(scanner) != '\n' && !isAtEnd(scanner))
                    advance(scanner);
            }
            else {
                (0, exports.addToken)(Token_2.TokenType.SLASH, {}, scanner);
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
        default:
            if (isDigit(c)) {
                number(scanner);
            }
            if (isAlpha(c)) {
                identifier(scanner);
            }
            else {
                (0, index_1.error)(scanner.line, "Unexpected Character");
            }
    }
};
var identifier = function (scanner) {
    while (isAlphaNumeric(peek(scanner)))
        advance(scanner);
    var text = scanner.source.substring(scanner.start, scanner.current);
    var tokenType = KEYWORDS.get(text);
    if (!tokenType)
        tokenType = Token_2.TokenType.IDENTIFIER;
    (0, exports.addToken)(tokenType, {}, scanner);
};
var KEYWORDS = new Map();
KEYWORDS.set("and", Token_2.TokenType.AND);
KEYWORDS.set("class", Token_2.TokenType.CLASS);
KEYWORDS.set("else", Token_2.TokenType.ELSE);
KEYWORDS.set("false", Token_2.TokenType.FALSE);
KEYWORDS.set("for", Token_2.TokenType.FOR);
KEYWORDS.set("fun", Token_2.TokenType.FUN);
KEYWORDS.set("if", Token_2.TokenType.IF);
KEYWORDS.set("nil", Token_2.TokenType.NIL);
KEYWORDS.set("or", Token_2.TokenType.OR);
KEYWORDS.set("print", Token_2.TokenType.PRINT);
KEYWORDS.set("return", Token_2.TokenType.RETURN);
KEYWORDS.set("super", Token_2.TokenType.SUPER);
KEYWORDS.set("this", Token_2.TokenType.THIS);
KEYWORDS.set("true", Token_2.TokenType.TRUE);
KEYWORDS.set("var", Token_2.TokenType.VAR);
KEYWORDS.set("while", Token_2.TokenType.WHILE);
var isAlpha = function (c) {
    return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c == '_';
};
var isAlphaNumeric = function (c) {
    return isAlpha(c) || isDigit(c);
};
var isDigit = function (c) {
    return c >= "0" && c <= '9';
};
var number = function (scanner) {
    while (isDigit(peek(scanner)))
        advance(scanner);
    if (peek(scanner) == '.' && isDigit(peekNext(scanner))) {
        advance(scanner);
        while (isDigit(peek(scanner)))
            advance(scanner);
    }
    (0, exports.addToken)(Token_2.TokenType.NUMBER, scanner.source.substring(scanner.start, scanner.current), scanner);
};
var peekNext = function (scanner) {
    if (scanner.current + 1 >= scanner.source.length)
        return '\0';
    return scanner.source.charAt(scanner.current + 1);
};
var peek = function (scanner) {
    if (isAtEnd(scanner))
        return '\0';
    return scanner.source.charAt(scanner.current);
};
var match = function (expected, scanner) {
    if (isAtEnd(scanner))
        return false;
    if (scanner.source.charAt(scanner.current) != expected)
        return false;
    scanner.current++;
    return true;
};
var advance = function (scanner) {
    return scanner.source.charAt(scanner.current++);
};
