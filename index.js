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
		await encrypt(flags);
	} else if (flags.decrypt) {
		await decrypt(flags);
	}

	// footer to show when the program is finished

	const chalk = (await import(`chalk`)).default;

	// print Give it a star on github: https://github.com/theninza/imcrypt with chalk and bgMagenta
	console.log(
		chalk.bgMagenta(` Give it a star on github: `) +
			chalk.bold(` https://github.com/theninza/imcrypt `)
	);
})();
