const fs = require('fs');
const path = require('path');
const tar = require('tar');
const rimraf = require('rimraf');
const { promisify } = require('util');
const fsExistsAsync = promisify(fs.exists);
const fsMkdirAsync = promisify(fs.mkdir);
const rimrafAsync = promisify(rimraf);

const src = process.argv[2];
const dst = process.argv[3];

const s = path.resolve(__dirname, 'test-data');
const d = path.resolve(__dirname, 'output-data');

async function addToTar(src, dst) {
	try {
		const exist = await fsExistsAsync(dst);
		console.log('exist', exist);
		if (exist) {
			console.log('exist');
			await rimrafAsync(dst);
		}
		await fsMkdirAsync(dst);
		
		const tarCreateAsync = promisify(tar.c);
		await tarCreateAsync(
			{
				gzip: true,
				file: path.resolve(dst, 'static.tgz'),
				cwd: path.resolve(__dirname),
			},
			['test-data']
		)
	} catch (err) {
		if (err.code === 'ENOENT') {
			await fsMkdirAsync(dst);
		} else {
			console.error(`ERROR | ${err}`);
		}
	}
}

addToTar(s,d);
