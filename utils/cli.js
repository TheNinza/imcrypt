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
	outputImageFileName: {
		type: `string`,
		desc: `The output image file name`,
		alias: `i`
	},
	outputKeyFileName: {
		type: `string`,
		desc: `The output key file name`,
		alias: `p`
	},
	key: {
		type: `string`,
		desc: `The key file to use for decryption`,
		alias: `k`
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
