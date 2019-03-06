const fs = require('fs');
const path = require('path');
const tar = require('tar');
const { promisify } = require('util');
const fsExistsAsync = promisify(fs.exists);
const fsMkdirAsync = promisify(fs.mkdir);
const fse = require('fs-extra');

const src = process.argv[2];
const dst = process.argv[3];

const s = path.resolve(__dirname, 'test-data');
const d = path.resolve(__dirname, 'output-data', 'static.tar.gz');

async function addToTar(src, dst) {
	try {
		const dstDirsPath = path.parse(dst).dir;
		const srcTargetDir = path.parse(src).base;

		const exist = await fsExistsAsync(dstDirsPath);
		if (exist) {
			await fse.remove(dstDirsPath);
		}
		await fsMkdirAsync(dstDirsPath);
		
		const tarCreateAsync = promisify(tar.c);
		await tarCreateAsync(
			{
				gzip: true,
				file: path.resolve(dst),
				cwd: path.resolve(dstDirsPath, '..'),
			},
			[srcTargetDir]
		)
	} catch (err) {
		console.error(`ERROR | ${err}`);
	}
}

addToTar(s,d);
