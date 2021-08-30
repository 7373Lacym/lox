"use strict";
exports.__esModule = true;
exports.Token = void 0;
var Token = function (type, lexeme, literal, line) {
    return {
        __Type: 'Token',
        type: type,
        lexeme: lexeme,
        literal: literal,
        line: line
    };
};
exports.Token = Token;
