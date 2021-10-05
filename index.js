/* import mysql from "serverless-mysql";
import date from "date-and-time";
import crypto from "crypto"; */

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

const nextRequest = async (req, res, jwtkey) => {
	let reqData = { action: "", user_uid: 0, user_type: "" };
	if (req.method == "POST") {
		reqData = { ...reqData, ...req.body };
		let authorization = req.headers.authorization || 0;
		if (authorization != 0) {
			var decoded = jwt.verify(req.headers.authorization, jwtkey);
			if (decoded) {
				reqData.user_uid = decoded.user_uid;
				reqData.user_type = decoded.user_type;
			}
		}
	} else if (req.method == "GET") {
		reqData = { ...reqData, ...req.query };
		reqData.action = req.query.request;
	}
	reqData.db_date = mysqlDate();

	let data = "Invalid request", status = 200;
	// reqData.action = ""
	if (reqData.action != undefined && reqData.action != "") {
		try {
			let jscode = reqData.action + '(' + JSON.stringify(reqData) + ')'
			data = await eval(jscode);
		} catch (error) {
			status = 400;
			console.log(error)
		}
	} else {
		status = 400;
	}
	res.status(status).json({ data });
};

const generateRandomNumber = (len) => {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < len; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};

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
 * MYSQL
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
	let no = str.slice(-10);
	let ext = str.replace(no, "");
	let no1 = no.slice(0, 3);
	let no2 = no.slice(3, 6);
	let no3 = no.slice(6, 10);
	return ext + " " + "(" + no1 + ")" + " " + no2 + "-" + no3;
};

/************************************************************************************************
 * MYSQL
 * DATE: 29/Sept/2021
 * BY: Ashis Kumar Behera
 ************************************************************************************************/
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

const mysqlSanitizeData = (data) => {
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
	return data;
};

const mysqlProcedure = async (procName, procAction, data = {}, { host, user, password, database, port = 3306 }, debug = false) => {
	let params = "";
	if (Object.keys(data).length > 0) {
		let arrkeys = Object.keys(data);
		arrkeys.forEach((el) => {
			data[el] = data[el].toString();
			params += "@p_" + el + "='" + data[el].trim().replace(/'/g, "''").replace(/\\/g, "\\\\\\\\").replace(/\"/g, '\\"') + "',";
		});
		params += "@p_debug=1";
	} else {
		params = "@p_empty='1'";
	}
	let sql = `CALL ${procName}('${procAction}', "${params}")`;
	let result = await mysqlQuery(sql, { host, user, password, database, port: 3306 });
	result = mysqlSanitizeData(result[0]);
	return debug ? sql : result;
};

const mysqlDate = () => {
	const date = require("date-and-time");
	const now = new Date();
	return date.format(now, "YYYY-MM-DD HH:mm:ss", true);
};

/************************************************************************************************
 * ENCRYPTION
 * DATE: 29/Sept/2021
 * BY: Ashis Kumar Behera
 ************************************************************************************************/
const encrypt = async (text, key) => {
	const crypto = require("crypto");
	const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 15, 25, 35, 45, 55, 65, 75];
	let iv = new Int8Array(16);
	for (let i = 0; i < iv.length; i++) iv[i] = arr[i];
	try {
		text = JSON.stringify(text);
	} catch (error) { }
	const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return encrypted.toString("hex");
};

const decrypt = async (hash, key) => {
	const crypto = require("crypto");
	const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 15, 25, 35, 45, 55, 65, 75];
	let iv = new Int8Array(16);
	for (let i = 0; i < iv.length; i++) iv[i] = arr[i];
	const decipher = crypto.createDecipheriv("aes-256-ctr", key, Buffer.from(iv.toString("hex"), "hex"));
	const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, "hex")), decipher.final()]);
	let result = decrpyted.toString();
	try {
		result = JSON.parse(result);
	} catch (error) { }
	return result;
};

module.exports = { request, nextRequest, mysqlQuery, mysqlProcedure, mysqlSanitizeData, mysqlDate, encrypt, decrypt, strShorten, strShuffle, strUrl, strPhone, fileExtension, fileUpload, fileDelete, fileBytesConvert, generateRandomNumber };
