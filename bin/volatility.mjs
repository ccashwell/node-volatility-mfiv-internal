#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import chalk from 'chalk'
import emoji from 'node-emoji'
import yargs from 'yargs'
import { loadExample, loadFile, loadIPFS } from "../dist/src/utils.js"
import { VolatilityCheck } from "../dist/src/volatilitycheck.js"
let argv = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .command('check', 'Verify result of volatility calculation')
    .example(chalk.green('$0 check -e eth-mfiv-14s-2021-10-01T07:02:00.000Z'), 'check example calculations')
    .alias('e', 'example')
    .nargs('e', 1)
    .string('e')
    .describe(['e'], 'Load an example from the examples directory')
    .alias('f', 'file')
    .nargs('f', 1)
    .string('f')
    .describe(['f'], 'Load file path')
    .example(chalk.green('$0 check -f ./example/eth-mfiv-14d-2021-10-01T07:02:00.000Z.json'), 'check file calculations')
    .alias('s', 'hash')
    .nargs('s', 1)
    .string('s')
    .describe(['s'], 'Load IPFS hash')
    .example(chalk.green('$0 check -s bafybeiflgk3dzigdwwoq2cwove76332rv3mrj3tqwjh4g2pmcolptokhxa'), 'check IPFS hash calculations')
    .conflicts("f", ["s", "e"])
    .check((argv) => {
      if (!argv.s && !argv.f && !argv.e) throw new Error(chalk.red('You must provide either -e or -s or -f'))
      return true
    })
    .describe('v', 'show verbose output of check')
    .alias('v', 'verbose')
    .help('h')
    .alias('h', 'help')
    .epilog('For more information, visit https://github.com/VolatilityGroup/node-volatility-mfiv')
    .wrap(null)
    .argv;

process
  .on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at Promise", reason, p)
  })
  .on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown", err)
    process.exit(1)
  })

let example, uri

if (argv.e) {
  uri = argv.e
  example = loadExample(uri)
} else if (argv.f) {
  uri = argv.f
  example = loadFile(uri)
} else if (argv.s) {
  uri = argv.s
  example = await loadIPFS(uri)
}

console.info(emoji.get("rocket"), `check ${uri}`)

const isVerbose = argv.v
const result = VolatilityCheck.check(example)

if (isVerbose) {
  console.info("%j", {
    version: example.version,
    context: example.context,
    params: example.params,
    result: result.result
  })
}

if (result.isSuccess) {
  console.info(emoji.get("white_check_mark"), chalk.greenBright("File valid."))
} else {
  console.error(emoji.get("skull_and_crossbones"), chalk.redBright("File validation failed."))
}
