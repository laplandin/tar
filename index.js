const path = require('path');
const tar = require('tar');
const { promisify } = require('util');
const fse = require('fs-extra');

const src = process.argv[2];
const dst = process.argv[3];

const s = path.resolve(__dirname, 'test-data');
const d = path.resolve(__dirname, 'output-data', 'static.tar.gz');

async function addToTar(src, dst) {
	try {
		const dstDirsPath = path.parse(dst).dir;
		const srcTargetDir = path.parse(src).base;

		const exist = await fse.pathExists(dstDirsPath);
		if (exist) {
			await fse.remove(dstDirsPath);
		}
		await fse.mkdir(dstDirsPath);
		
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
