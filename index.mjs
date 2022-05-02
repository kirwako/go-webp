import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const RESET_BOLD = "\u001b[22m"
const BOLD = "\u001b[1m"
const FG_GREEN = "\x1b[32m";
const RESET_COLOR = "\x1b[0m";

const BOLD_FG_GREEN = `${BOLD}${FG_GREEN}`;
const RESET_BOLD_FG_GREEN = `${RESET_BOLD}${RESET_COLOR}`;

const folders_to_excld = [
	"node_modules",
	"dist",
	"build",
	"lib",
	"libs",
];

function flatten(lists) {
	return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {

	// exclude folders folder
	for (let i = 0; i < folders_to_excld.length; i++) {
		if (srcpath.includes(folders_to_excld[i])) {
			return [];
		}
	}

	return fs
		.readdirSync(srcpath)
		.map((file) => path.join(srcpath, file))
		.filter((path) => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
	// exclude folders folder
	for (let i = 0; i < folders_to_excld.length; i++) {
		if (srcpath.includes(folders_to_excld[i])) {
			return [];
		}
	}
	return [
		srcpath,
		...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
	];
}

var allDirectories = getDirectoriesRecursive(".");


for (let i = 0;i < allDirectories.length; i++) {
	imagemin([allDirectories[i] + "/*.{jpg,png,jpeg}"], {
		destination: allDirectories[i],
		plugins: [
			imageminWebp({
				//   quality: 90
				//   ,
				//   resize: {
				//     width: 1000,
				//     height: 0
				//   }
			}),
		],
	})
	.then((files) => {
		files.forEach((file) => {
			// console.log(FgGreen, file.sourcePath, Reset);
			const spaces = " ".repeat(50 - file.sourcePath.length);
			console.log(`${BOLD_FG_GREEN}[Converting to webp]${RESET_BOLD_FG_GREEN}  ${file.sourcePath} ${spaces} ${BOLD_FG_GREEN}Success ✅${RESET_BOLD_FG_GREEN}`);
		});
	})
}
