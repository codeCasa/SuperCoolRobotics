/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const environment = process.argv[2];
const envFileContent = require(`../envs/${environment}.json`);
fs.writeFileSync("./src/env.json", JSON.stringify(envFileContent, undefined, 2));
