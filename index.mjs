import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import { exit } from "process";

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
	".git",
	".idea",
	".vscode",
	".vscode-test",
	"__tests__",
	"__mocks__",
	"__snapshots__",
	"__test__",
	"__testdata__",
	"__testfixtures__",
];

const extention_to_exclude = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"svg",
	"webp",
];

function getFileName(filepath) {
	return path.basename(filepath);
}

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
	.then((webp_files) => {
		webp_files.forEach((webp_file) => {
			// console.log(FgGreen, file.sourcePath, Reset);
			// console.log(getFileName(file.sourcePath));
			// console.log(getFileName(file.destinationPath));
			// console.log("===========================");
			// get all files in the directory
			for (let i = 0; i < allDirectories.length; i++) {
				// console.log(allDirectories[i]);
				// get all files of directory allDirectories[i]
				fs.readdirSync(allDirectories[i]).forEach((file) => {

					// exclude files with extension
					if (!fs.statSync(`${allDirectories[i]}/${file}`).isDirectory()) {
						const file_extension = file.split(".").pop();
						for (let i = 0; i < extention_to_exclude.length; i++) {
							// console.log(file_extension);
							if (file_extension && file_extension === extention_to_exclude[i]) {
								return;
							}
						}

						// console.log(`${allDirectories[i]}/${file}`);
						// start change the content of the file to webp
						const content_file = fs.readFileSync(`${allDirectories[i]}/${file}`, "utf8", (err, data) => {
							if (err)
								console.log(`Error =======> [${err}]`);

						});
						const regex = "\\b" + getFileName(webp_file.sourcePath) + "\\b";
						console.log(`${allDirectories[i]}/${file}`, regex, getFileName(webp_file.destinationPath));
						const result = content_file.replace(new RegExp(regex, 'g'), getFileName(webp_file.destinationPath));
						fs.writeFileSync(`${allDirectories[i]}/${file}`, result, "utf8", (err) => {
							if (err)
								console.log(`Error =======> [${err}]`);

							// console.log("success");
						}
						);
						// end change the content of the file to webp

					}
				});
			}
			// exit(0) ;
			// const spaces = " ".repeat(50 - file.sourcePath.length);
			// console.log(`${BOLD_FG_GREEN}[Converting to webp]${RESET_BOLD_FG_GREEN}  ${file.sourcePath} ${spaces} ${BOLD_FG_GREEN}Success ✅${RESET_BOLD_FG_GREEN}`);
		});
	})
}
