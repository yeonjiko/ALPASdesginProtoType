import { readFile } from 'node:fs/promises';
const css=await readFile('src/styles.css','utf8');
const lines=css.split(/\r?\n/).length;
const rules=(css.match(/\{[^{}]*\}/g)||[]).length;
const muiClassReferences=(css.match(/\.Mui[A-Za-z-]+/g)||[]).length;
const dockviewClassReferences=(css.match(/\.dv-[A-Za-z-]+/g)||[]).length;
const dockviewThemeVariables=(css.match(/--dv-[A-Za-z-]+:/g)||[]).length;
console.log(JSON.stringify({file:'src/styles.css',lines,cssRules:rules,muiClassReferences,dockviewClassReferences,dockviewThemeVariables,measurement:'static selector count; library source files are unchanged'},null,2));
