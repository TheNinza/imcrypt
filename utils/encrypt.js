const alert = require('cli-alerts');
const fs = require('fs');
const jimp = require('jimp');
const path = require('path');
const readline = require('readline');


// helper functions
function askQuestion(query) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise(resolve =>
		rl.question(query, ans => {
			rl.close();
			resolve(ans);
		})
	);
}

const encrypt = async flags => {
	// check if flags contain decrypt flag
	if (flags.decrypt) {
		alert({
			type: `warning`,
			name: `Invalid combination of flags`,
			msg: `Cannot use both --encrypt and --decrypt flags together`
		});
		process.exit(1);
	}

	// find the value of the encrypt flag
	const filePath = flags.encrypt;

	// check if the filePath is a valid file path
	if (!filePath) {
		alert({
			type: `warning`,
			name: `Invalid file path`,
			msg: `Please provide a valid file path`
		});
		process.exit(1);
	}

	// get the current working directory
	const cwd = process.cwd();

	// join the filePath with the cwd
	const fullPath = path.join(cwd, filePath);

	// check if the filePath is a valid file path
	if (!fs.existsSync(fullPath)) {
		alert({
			type: `warning`,
			name: `Invalid file path`,
			msg: `Please provide a valid file path`
		});
		process.exit(1);
	}

	// read the image

	try {
		const ora = (await import('ora')).default;

		// get the base name of the file
		const fileName = path.basename(fullPath);

		// remove the extension from the file name
		const fileNameWithoutExtension = fileName.split('.')[0];

		const spinner = ora(`Reading Image...`).start();

		const image = await jimp.read(fullPath);

		// get the image extension using jimp
		const extension = image.getExtension();

		// ask question to proceed if the image is a jpeg/jpg
		if (extension === `jpeg` || extension === `jpg`) {
			spinner.stop();
			const proceed = await askQuestion(
				`The image you are trying to encrypt is a jpeg/jpg. Some information may be lost while encryption/decryption. Do you want to proceed? (y/n) \n`
			);

			if (proceed !== `y`) {
				process.exit(0);
			}
			spinner.start();
		}

		spinner.succeed(`Image read successfully`);

		// handle the outputImageFileName flag
		let outputImageFile = `${fileNameWithoutExtension}_encrypted.${extension}`;
		const spinner2 = ora(`Checking for output image file name`).start();
		if (flags.outputImageFileName) {
			outputImageFile = path.basename(flags.outputImageFileName);

			// show error if the outputImageFileName already exists

			// add the file extension to the outputImageFileName if not already present
			if (!outputImageFile.includes('.')) {
				outputImageFile = `${outputImageFile}.${extension}`;
			} else {
				outputImageFile =
					outputImageFile.split('.')[0] + `.${extension}`;
			}
		}

		if (fs.existsSync(outputImageFile)) {
			spinner2.fail(`Output image file already exists`);

			alert({
				type: `error`,
				name: `Invalid output image file name`,
				msg: `The output image file name already exists: ${outputImageFile}
				\nPlease provide a different output image file name with --outputImageFileName/-i flag`
			});
			process.exit(1);
		}

		spinner2.succeed(`Output image file name is valid`);

		// handle outputKeyFileName flag
		let outputKeyFile = `${fileNameWithoutExtension}_key.txt`;
		const spinner3 = ora(`Checking for output key file name`).start();

		if (flags.outputKeyFileName) {
			outputKeyFile = path.basename(flags.outputKeyFileName);
		}

		if (fs.existsSync(outputKeyFile)) {
			spinner3.fail(`Output key file already exists`);
			alert({
				type: `error`,
				name: `Invalid output key file name`,
				msg: `The output key file name already exists: ${outputKeyFile}
				\nPlease provide a different output key file name with --outputKeyFileName/-p flag`
			});
			process.exit(1);
		}

		spinner3.succeed(`Output key file name is valid`);

		// start encryption //
		const spinner4 = ora(`Encrypting image: Reading Image Data`).start();

		// get the rgba values of the image
		const rgba = image.bitmap.data;

		// get the length of the rgba array
		const length = rgba.length;

		spinner4.succeed(`Image data read successfully`);

		const spinner5 = ora(`Encrypting image: Generating key`).start();

		// generate random key for encryption for each pixel between 0 and 255
		const key = [];
		for (let i = 0; i < length; i++) {
			key.push(Math.floor(Math.random() * 256));
		}

		spinner5.succeed(`Key generated successfully`);

		const spinner6 = ora(`Encrypting image: Encrypting image`).start();

		// loop through the rgba array
		await new Promise(resolve => {
			for (let i = 0; i < length; i++) {
				const k = key[i];
				rgba[i] = rgba[i] ^ k;
			}

			// save the image with _encrypted appended to the file name, mimeType and the new extension
			image.bitmap.data = rgba;
			resolve();
		});

		spinner6.succeed(`Image encrypted successfully`);

		const spinner7 = ora(`Encrypting image: Saving image`).start();

		image.write(outputImageFile);

		spinner7.succeed(`Image saved successfully`);

		// save key to key.txt

		const spinner8 = ora(`Encrypting image: Saving key`).start();

		fs.writeFileSync(outputKeyFile, Buffer.from(key).toString('base64'));

		spinner8.succeed(`Key saved successfully`);

		alert({
			type: `success`,
			name: `Image encrypted successfully`,
			msg: `Image encrypted successfully:\n
			Encrypted Image: ${outputImageFile}\n
			Key: ${outputKeyFile}`
		});

		// print first 50 characters of key to console
	} catch (error) {
		alert({
			type: `error`,
			name: `Error`,
			msg: `${error || 'Unknown error'}`
		});
		process.exit(1);
	}
};

module.exports = encrypt;
