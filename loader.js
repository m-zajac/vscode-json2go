/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

var load;

/**
 * @param  { import("vscode").ExtensionContext} context
 */
function loadJ2G(context) {
    if (!load) {
        load = new Promise((resolve, reject) => {
            require('./wasm/wasm_exec');
        
            const go = new Go();
            let inst;
        
            const wasmPath = path.join(context.extensionPath, 'wasm', 'json2go.wasm');
            WebAssembly.instantiate(
                fs.readFileSync(wasmPath), 
                go.importObject
            ).then((result) => {
                inst = result.instance;
                go.run(inst);
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    return load;
}

module.exports = {
	loadJ2G,
};
