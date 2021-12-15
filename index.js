#!/usr/bin/env node

/**
 * imcrypt
 * An image encryption node-js cli
 *
 * @author theninza <https://theninza.me>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const encrypt = require('./utils/encrypt');
const decrypt = require('./utils/decrypt');

const input = cli.input;
const flags = cli.flags;
const { clear } = flags;

(async () => {
	init({ clear });

	input.includes(`help`) && cli.showHelp(0);
	// check if encrypt is present in flags object
	if (flags.encrypt) {
		encrypt(flags);
	} else if (flags.decrypt) {
		decrypt(flags);
	}
})();
