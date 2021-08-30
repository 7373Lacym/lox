"use strict";
exports.__esModule = true;
exports.error = void 0;
var fs = require("fs");
var readline = require("readline");
var reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var hadError = false;
function run(file) {
    console.log(file);
}
function runFile(file) {
    if (hadError)
        return (65);
    run(fs.readFileSync(file, 'utf8'));
}
function runPrompt() {
    reader.question("> ", function (line) {
        run(line);
        hadError = false;
        runPrompt();
    });
}
var error = function (line, message) {
    report(line, "", message);
};
exports.error = error;
function report(line, where, message) {
    console.error("Line " + line + " + Error " + where + ": " + message);
    hadError = true;
}
function main() {
    if (process.argv.length > 2) {
        console.log(process.argv);
        console.log("Usage: jlox [script]");
        return 64;
    }
    else if (process.argv.length == 2) {
        runFile(process.argv[1]);
    }
    else {
        runPrompt();
    }
}
main();
