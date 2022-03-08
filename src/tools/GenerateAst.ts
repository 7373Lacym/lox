const main = () => {
  generateAst()
}
const template = (baseName, fields) => `
export type ${baseName} = {
  ${fields.map(field => {
    const trimmed = field.trim()
    return `${trimmed} : ${trimmed} \n` 
    }).join("")
  }
}
`

const generateAst = () => {
  //Create a new type via command line
  const args = process.argv.slice(2);
  if(args.length > 3) {
    console.error("Usage: generate_ast <output directory>")
    process.exit(64)
  }
  const outputDir : string = args[0]
  const type : string = args[1]
  const fields = args[2]
  defineAst(outputDir, type, fields)
}

const defineAst = (outputDir: string, type: string, fields : string) => {
  console.log(template(type, fields.split(',')))

}

main()
