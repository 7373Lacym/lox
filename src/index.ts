import * as fs from 'fs';
import * as readline  from 'readline';

import {scanTokens, scanner} from './data/Scanner'

const reader = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let hadError = false

function run(file: string) {
	const scannerImpl = scanner(file);
	const tokens = scanTokens(scannerImpl);
	tokens.map(token => {
		console.log(token)
	})
	return 0
}

function runFile(file: string){
	if (hadError) return(65);
	run(fs.readFileSync(file,'utf8'))
}

function runPrompt(){
		 	reader.question("> ", (line) =>{
			 run(line);
			 hadError = false
			 runPrompt()
		 });
}

export const error = (line: number, message : string) => {
	report(line, "", message)
}

function report(line: number, where: string, message: string) {
	console.error(`Line ${line} + Error ${where}: ${message}`)
	hadError = true
}

function main() {
	if(process.argv.length > 2){
		console.log(process.argv)
		console.log("Usage: jlox [script]")
		return 64
	} else if (process.argv.length == 2) {
		runFile(process.argv[1])
		process.exit(0)
		return 1
	} else {
		return runPrompt();
	}
}

main()
