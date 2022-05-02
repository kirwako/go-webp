import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const RESET_BOLD = "\u001b[22m"
const BOLD = "\u001b[1m"
const FG_GREEN = "\x1b[32m";
const RESET_COLOR = "\x1b[0m";
const FG_RED = "\x1b[31m";

const BOLD_FG_GREEN = `${BOLD}${FG_GREEN}`;
const RESET_BOLD_FG_GREEN = `${RESET_BOLD}${RESET_COLOR}`;
const BOLD_FG_RED = `${BOLD}${FG_RED}`;
const RESET_BOLD_FG_RED = `${RESET_BOLD}${RESET_COLOR}`;

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

var allDirectories = getDirectoriesRecursive(".");

for (let i = 0;i < allDirectories.length; i++) {
	imagemin([allDirectories[i] + "/*.{jpg,png,jpeg}"], {
		destination: allDirectories[i],
		plugins: [
			imageminWebp({}),
		],
	})
	.then((webp_files) => {
		webp_files.forEach((webp_file) => {
			const spaces = " ".repeat(50 - webp_file.sourcePath.length);
			console.log(`${BOLD_FG_GREEN}[Converting  to webp]${RESET_BOLD_FG_GREEN}  ${webp_file.sourcePath} ${spaces} ${BOLD_FG_GREEN}Success ✅${RESET_BOLD_FG_GREEN}`);
			
			// remove the old image file
			fs.unlinkSync(webp_file.sourcePath);
			console.log(`${BOLD_FG_RED}[removing old format]${RESET_BOLD_FG_RED}  ${webp_file.sourcePath} ${spaces} ${BOLD_FG_RED}Delete ❌${RESET_BOLD_FG_RED}`);

			// get all files in the directory
			for (let i = 0; i < allDirectories.length; i++) {
				// get all files of directory allDirectories[i]
				fs.readdirSync(allDirectories[i]).forEach((file) => {

					// first we check if the file is not a directory
					// exclude files with extension
					if (fs.statSync(`${allDirectories[i]}/${file}`).isDirectory() === true)
						return ;
					
					if (isAllowdedFileExtention(file) === false) {
						return ;
					}

					// change the image name in file to webp
					const content_file = fs.readFileSync(`${allDirectories[i]}/${file}`, "utf8", (err, data) => { if (err) console.log(`Error =======> [${err}]`); });
					const changed_content = content_file.replace(new RegExp("\\b" + getFileName(webp_file.sourcePath) + "\\b", 'g'), getFileName(webp_file.destinationPath));
					fs.writeFileSync(`${allDirectories[i]}/${file}`, changed_content, "utf8", (err) => { if (err) console.log(`Error =======> [${err}]`); } );
				});
			}
		});
	})
}

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

function isAllowdedFileExtention(file) {
	const file_extension = file.split(".").pop();
	for (let i = 0; i < extention_to_exclude.length; i++) {
		if (file_extension && file_extension === extention_to_exclude[i]) {
			return false;
		}
	}
	return true;
}