const request = async (url, data = {}, authorization = 0) => {
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
};

const nextRequest = async (req, res, methods, jwtkey,) => {
	let reqData = { action: "", user_uid: 0 };
	if (req.method == "POST") {
		reqData = { ...reqData, ...req.body };
		let authorization = req.headers.authorization || 0;
		if (authorization != 0) {
			const jwt = require("jsonwebtoken")
			var decoded = jwt.verify(req.headers.authorization, jwtkey);
			if (decoded) {
				Object.keys(decoded).map(key => {
					reqData = { ...reqData, [key]: decoded[key] }
				})
				// reqData.user_uid = decoded.user_uid;
			}
		}
	} else if (req.method == "GET") {
		reqData = { ...reqData, ...req.query };
		reqData.action = req.query.request;
	}
	reqData.db_date = mysqlDate();
	reqData.local_date = mysqlDate(false);

	let data = "Invalid request", status = 200;
	if (reqData.action != undefined && reqData.action != "") {
		try {
			data = await methods[reqData.action](reqData)
		} catch (error) {
			status = 400;
			data = "Internal server error"
			console.log(error)
		}
	} else {
		status = 400;
	}
	res.status(status).json({ data });
};

const userPermissions = async (api, token = 0, data = {}) => {
	token = token || 0
	if (token) {
		let result = await request(`${api}`, { action: "userPermissions", ...data }, token);
		if (Object.keys(result.data).length == 0) {
			return { status: 400, data: result.data };
		} else {
			return { status: 200, data: result.data };
		}
	} else {
		return { status: 400, data: {} };
	}
}

const randomNumber = (len) => {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < len; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};

const checkSMTP = async ({ host = "", port = 587, user = "", pass = "", secure = false }) => {
	const nodemailer = require("nodemailer");
	let transporter = nodemailer.createTransport({
		host,
		port,
		secure, // true for 465, false for other ports
		auth: {
			user,
			pass
		},
	});

	let result = await new Promise((resolve, reject) => {
		transporter.verify(function (error, success) {
			if (error) {
				resolve(false)
			} else {
				resolve(true)
			}
		});
	})
	return result
}

const mail = async (smtp = ['', 587, '', ''], from = ['', ''], to = ['', ''], info = ['', ''], reply = ['', '']) => {
	const nodemailer = require("nodemailer");
	let transporter = nodemailer.createTransport({
		host: smtp[0],
		port: parseInt(smtp[1]),
		secure: smtp[1] == 465 ? true : false,
		auth: {
			user: smtp[2],
			pass: smtp[3]
		},
	});
	let status = 0;
	let message = 'Sent'
	try {
		if (reply[0] != '' && reply[1] != '') {
			await transporter.sendMail({
				from: '"' + from[0] + '" <' + from[1] + '>',
				to: '"' + to[0] + '" <' + to[1] + '>',
				replyTo: '"' + reply[0] + '" <' + reply[1] + '>',
				subject: info[0],
				text: "Please enable HTML to view this message",
				html: info[1]
			});
		} else {
			await transporter.sendMail({
				from: '"' + from[0] + '" <' + from[1] + '>',
				to: '"' + to[0] + '" <' + to[1] + '>',
				subject: info[0],
				text: "Please enable HTML to view this message",
				html: info[1]
			});
		}
		status = 1
	} catch (error) {
		message = 'Failure: ' + error.response
	}
	return { status, message }
};

const localDateTime = (dateTime, dtFormat = 'DD MMM YYYY hh:mm A') => {
	let result = ''
	if (dateTime != '' && dateTime != undefined && dateTime != null) {
		const date = require("date-and-time");
		let dt = date.format(new Date(dateTime), 'YYYY-MM-DDTHH:mm:ss.000');
		dt = dt.replace(/\+.*/, '') + 'Z';
		let newDt = new Date(dt);
		result = date.format(newDt, dtFormat)
	}
	return result;
}

/************************************************************************************************
 * FILE HANDELING
 * DATE: 29/Sept/2021
 * BY: Ashis Kumar Behera
 ************************************************************************************************/
const fileExtension = (file) => {
	let arr = file.split(".");
	return arr.pop();
};

const fileUpload = async (apiUrl, dirName, file, options = {}) => {
	apiUrl = apiUrl.replace(/\/$/gi, "");
	let formData = new FormData();
	formData.append("dir", dirName);
	formData.append("options", JSON.stringify(options));
	formData.append("file", file, file.name);
	let res1 = await fetch(apiUrl + "/upload-file", {
		method: "POST",
		body: formData,
	});
	let res2 = await res1.json();
	return res2.responseCode == 200 ? res2.file : "";
};

const fileDelete = async (apiUrl, file) => {
	apiUrl = apiUrl.replace(/\/$/gi, "");
	await fetch(apiUrl + "/delete-file", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ file }),
	});
	return true;
};

const fileBytesConvert = (bytes, unit = "mb") => {
	let result = 0;
	unit = unit.toLowerCase();
	if (unit == "kb") result = bytes / Math.pow(1024, 1);
	else if (unit == "mb") result = bytes / Math.pow(1024, 2);
	else if (unit == "gb") result = bytes / Math.pow(1024, 3);
	result = result.toFixed(2);
	return result;
};

/************************************************************************************************
 * STRING
 * DATE: 29/Sept/2021
 * BY: Ashis Kumar Behera
 ************************************************************************************************/
const strShorten = (text, len) => {
	if (text.length > len) {
		return text.substring(0, len) + "...";
	}
	return text;
};

const strShuffle = (word) => {
	var shuffledWord = "";
	word = word.toString();
	word = word.split("");
	while (word.length > 0) {
		shuffledWord += word.splice((word.length * Math.random()) << 0, 1);
	}
	return shuffledWord;
};

const strUrl = (str) => {
	str = str.toLowerCase();
	return str.replace(/(\s|_|&|;|\.)/g, "-").replace(/\-+/g, "-");
};

const strPhone = (str) => {
	str = str.toString()
	str = str.replace(/[^\d]*/gi, '')
	if (str.length < 10) {
		return ''
	}
	let no = str.slice(-10);
	let ext = str.replace(no, "");
	let no1 = no.slice(0, 3);
	let no2 = no.slice(3, 6);
	let no3 = no.slice(6, 10);
	let result = ext + " " + "(" + no1 + ")" + " " + no2 + "-" + no3;
	if (str.length > 10) result = '+' + result
	return result.trim()
};

/************************************************************************************************
 * MYSQL
 * DATE: 29/Sept/2021
 * BY: Ashis Kumar Behera
 ************************************************************************************************/

const mysqlSanitizeData = (data) => {
	try {
		data = JSON.stringify(data);
		data = JSON.parse(data);
		data = data.map((item) => {
			Object.keys(item).map((itm) => {
				if (item[itm] == null) item[itm] = "";
				try {
					item[itm] = JSON.parse(item[itm]);
				} catch (error) { }
			});
			return item;
		});
	} catch (error) { }
	return data;
};

const mysqlQuery = async (query, { host, user, password, database, port = 3306 }) => {
	const mysql = require("serverless-mysql");
	const db = mysql({
		config: { host, port, database, user, password },
	});
	try {
		let results = await db.query(query);
		results = mysqlSanitizeData(results);
		await db.end();
		return results;
	} catch (error) {
		console.log(error);
		return { error };
	}
};

const mysqlProcedure = async (procName, procAction, data = {}, { host, user, password, database, port = 3306 }, debug = false) => {
	let params = "";
	if (Object.keys(data).length > 0) {
		let arrkeys = Object.keys(data);
		arrkeys.forEach((el) => {
			if (typeof data[el] == 'object') {
				try {
					data[el] = JSON.stringify(data[el])
				} catch (error) { }
			} else {
				data[el] = data[el].toString();
			}
			params += "@p_" + el + "='" + data[el].trim().replace(/'/g, "''").replace(/\\/g, "\\\\\\\\").replace(/\"/g, '\\"') + "',";
		});
		params += "@p_debug=1";
	} else {
		params = "@p_empty='1'";
	}
	let sql = `CALL ${procName}('${procAction}', "${params}")`;
	let result = await mysqlQuery(sql, { host, user, password, database, port });
	result = mysqlSanitizeData(result[0]);
	return debug ? sql : result;
};

const mysqlTableData = async (reqData, procName, procAction, { host, user, password, database, port = 3306 }) => {
	let start_rec = (reqData.page - 1) * reqData.limit;
	let filters = {}
	if (Object.keys(reqData).length > 0)
		Object.keys(reqData).map((item) => {
			if (/^filter_.*/gi.test(item)) {
				filters[item] = reqData[item].trim()
			}
		})
	let total_rec = await mysqlProcedure(
		procName,
		procAction + '_TOTAL',
		{
			start_rec,
			limit_rec: reqData.limit, ...filters
		}, { host, user, password, database, port }
	);
	total_rec = total_rec[0].total;
	let sqlData = await mysqlProcedure(
		procName,
		procAction,
		{
			start_rec,
			limit_rec: reqData.limit, ...filters
		}, { host, user, password, database, port }
	);
	return { data: sqlData, total: total_rec }
}

const mysqlDate = (utc = true) => {
	const date = require("date-and-time");
	const now = new Date();
	return date.format(now, "YYYY-MM-DD HH:mm:ss", utc);
};

/************************************************************************************************
 * ENCRYPTION
 * DATE: 29/Sept/2021
 * BY: Ashis Kumar Behera
 ************************************************************************************************/
const encrypt = async (text, key) => {
	const crypto = require("crypto");
	/* const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 15, 25, 35, 45, 55, 65, 75];
	let iv = new Int8Array(16);
	for (let i = 0; i < iv.length; i++) iv[i] = arr[i]; */
	let iv = Buffer.alloc(16);
	try {
		text = JSON.stringify(text);
	} catch (error) { }
	const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return encrypted.toString("hex");
};

const decrypt = async (hash, key) => {
	const crypto = require("crypto");
	/* const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 15, 25, 35, 45, 55, 65, 75];
	let iv = new Int8Array(16);
	for (let i = 0; i < iv.length; i++) iv[i] = arr[i]; */
	let iv = Buffer.alloc(16);
	const decipher = crypto.createDecipheriv("aes-256-ctr", key, Buffer.from(iv.toString("hex"), "hex"));
	const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, "hex")), decipher.final()]);
	let result = decrpyted.toString();
	try {
		result = JSON.parse(result);
	} catch (error) { }
	return result;
};

module.exports = { request, nextRequest, userPermissions, mysqlQuery, mysqlProcedure, mysqlTableData, mysqlSanitizeData, mysqlDate, encrypt, decrypt, strShorten, strShuffle, strUrl, strPhone, fileExtension, fileUpload, fileDelete, fileBytesConvert, randomNumber, mail, checkSMTP, localDateTime };
