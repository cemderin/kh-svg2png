#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const svg2png = require("..");
const packageJSON = require("../package.json");

const argv = yargs
    .usage(`${packageJSON.description}\n\n${packageJSON.name} input.svg ` +
           `[--output=output.png] [--width=300] [--height=150]`)
    .option("o", {
        alias: "output",
        type: "string",
        describe: "The output filename; if not provided, will be inferred"
    })
    .option("w", {
        alias: "width",
        type: "string",
        describe: "The output file width, in pixels"
    })
    .option("h", {
        alias: "height",
        type: "string",
        describe: "The output file height, in pixels"
    })
    .option("v", {
        alias: "viewbox",
        type: "boolean",
        describe: "Use viewbox dimensions"
    })
    .option("r", {
        alias: "retina",
        type: "boolean",
        describe: "Export retina version"
    })
    .demand(1)
    .help(false)
    .version()
    .argv;

// TODO if anyone asks for it: support stdin/stdout when run that way

var input,
    output,
    outputFilename;

input = fs.readFileSync(argv._[0]);
output = svg2png.sync(input, { width: argv.width, height: argv.height, filename: argv._[0], viewbox: argv.viewbox, retina: argv.retina });

if(argv.retina) {
    outputFilename = argv.output || path.basename(argv._[0], ".svg") + "@2x.png";
} else {
    outputFilename = argv.output || path.basename(argv._[0], ".svg") + ".png";
}
fs.writeFileSync(outputFilename, output, { flag: "wx" });

if(argv.retina == true) {
    input = fs.readFileSync(argv._[0]);
    output = svg2png.sync(input, { width: argv.width, height: argv.height, filename: argv._[0], viewbox: argv.viewbox, retina: false });

    outputFilename = argv.output || path.basename(argv._[0], ".svg") + ".png";
    fs.writeFileSync(outputFilename, output, { flag: "wx" });
}
