async function request(url, data = {}, authorization = 0) {
	let method = Object.keys(data).length > 0 ? "POST" : "GET";
	let result;
	if (method == "POST")
		result = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: authorization,
			},
			body: JSON.stringify(data),
		});
	else result = await fetch(url);
	let finalResult = await result.json();
	finalResult = { ...finalResult, status: result.status };
	return finalResult;
}

const shortenText = (text, len) => {
	if (text.length > len) {
		return text.substring(0, len) + "...";
	}
	return text;
};

const fileExtension = (file) => {
	let arr = file.split(".");
	return arr.pop();
};

const shuffleStr = (word) => {
	var shuffledWord = "";
	word = word.toString();
	word = word.split("");
	while (word.length > 0) {
		shuffledWord += word.splice((word.length * Math.random()) << 0, 1);
	}
	return shuffledWord;
};

const formatPhoneNum = (str) => {
	let no = str.slice(-10);
	let ext = str.replace(no, "");
	let no1 = no.slice(0, 3);
	let no2 = no.slice(3, 6);
	let no3 = no.slice(6, 10);
	return ext + " " + "(" + no1 + ")" + " " + no2 + "-" + no3;
};

const strToUrl = (str) => {
	str = str.toLowerCase();
	return str.replace(/(\s|_|&|;|\.)/g, "-").replace(/\-+/g, "-");
};

const generateOtp = (len) => {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < len; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};

module.exports = { request, shortenText, fileExtension, shuffleStr, formatPhoneNum, strToUrl, sanitizeDbData, generateOtp };
