
import fs from 'fs';

function dd() {
	return "maryo.png";
}


const file_content = fs.readFileSync(`/home/kirwa/Desktop/imgToWebp/src/components/Line.js`, "utf8", (err, data) => {
	if (err) {
		console.log(err);
	}
	// // console.log(data);
	// const regex = "\\b" + "test.webp" + "\\b";
	// const result = data.replace(new RegExp(regex, 'g'), "protont.webp");
	// fs.writeFile(`/home/kirwa/Desktop/imgToWebp/src/components/Line.js`, result, "utf8", (err) => {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	console.log("success");
	// }
	// );
});

const result = file_content.replace(/test.webp/g, "protont.webp");

console.log(result);

fs.writeFileSync(`/home/kirwa/Desktop/imgToWebp/src/components/Line.js`, result, "utf8", (err) => {
	if (err) {
		console.log(err);
	}
	console.log("success");
}
);
