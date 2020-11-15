/* eslint-disable no-undef */

const { loadJ2G } = require('./loader');

/**
 * @param  { import("vscode").ExtensionContext} context
 * @param { string } text
 */
function js2go(context, text) {
	return loadJ2G(context).then(() => {
		const opts = {
			extractCommonTypes: true,
			stringPointersWhenKeyMissing: true,
			skipEmptyKeys: false,
			useMaps: true,
			useMapsMinAttrs: 10,
			timeAsStr: false,
		};
		return json2go(text, opts);
	});
}

module.exports = {
	js2go,
};
