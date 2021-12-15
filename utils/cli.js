const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	encrypt: {
		typs: `string`,
		desc: `The image to encrypt`,
		alias: `e`
	},
	decrypt: {
		typs: `string`,
		desc: `The image to decrypt`,
		alias: `d`
	},
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: true,
		desc: `Don't clear the console`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	key: {
		type: `string`,
		desc: `The key to use for decryption`,
		alias: `k`
	},
	outputImageFileName: {
		type: `string`,
		desc: `The output image`,
		alias: `i`
	},
	outputKeyFileName: {
		type: `string`,
		desc: `The output key`,
		alias: `p`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `imcrypt`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

const cli = meow(helpText, options);

// adding commands
cli.commands = commands;

module.exports = cli;
