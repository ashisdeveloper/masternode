export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};

export const request = async (url: string, data: {} = {}, authorization: any = 0) => {
  let method = Object.keys(data).length > 0 ? 'POST' : 'GET';
  let result;
  if (method == 'POST')
    result = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify(data),
    });
  else result = await fetch(url);
  let finalResult = await result.json();
  finalResult = { ...finalResult, status: result.status };
  return finalResult;
};

export const nextRequest = async (req: any, res: any, methods: any, jwtkey: string) => {
  let reqData = { action: "", user_uid: 0, db_date: '', local_date: '' };
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

export const userPermissions = async (api: string, token: any = 0, data: {} = {}) => {
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

export const randomNumber = (len: number) => {
  var text = "";
  var possible = "123456789";
  for (var i = 0; i < len; i++) {
    var sup = Math.floor(Math.random() * possible.length);
    text += i > 0 && sup == i ? "0" : possible.charAt(sup);
  }
  return Number(text);
};

export const checkSMTP = async ({ host = "", port = 587, user = "", pass = "", secure = false }) => {
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

  let result = await new Promise((resolve) => {
    transporter.verify(function (error: any) {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    });
  })
  return result
}

export const mail = async (smtp: any = ['', 587, '', ''], from: any = ['', ''], to: any = ['', ''], info: any = ['', ''], reply: any = ['', '']) => {
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
    let err: any = error
    message = 'Failure: ' + err.response
  }
  return { status, message }
};

export const fileExtension = (file: string) => {
  let arr = file.split(".");
  return arr.pop();
};

export const fileUpload = async (apiUrl: string, dirName: string, file: any, options: {} = {}) => {
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

export const fileDelete = async (apiUrl: string, file: string) => {
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

export const fileBytesConvert = (bytes: number, unit = "mb") => {
  let result: any = 0;
  unit = unit.toLowerCase();
  if (unit == "kb") result = bytes / Math.pow(1024, 1);
  else if (unit == "mb") result = bytes / Math.pow(1024, 2);
  else if (unit == "gb") result = bytes / Math.pow(1024, 3);
  result = result.toFixed(2);
  return result;
};

export const strShorten = (text: string, len: number) => {
  if (text.length > len) {
    return text.substring(0, len) + "...";
  }
  return text;
};

export const strShuffle = (word: any) => {
  var shuffledWord = "";
  word = word.toString();
  word = word.split("");
  while (word.length > 0) {
    shuffledWord += word.splice((word.length * Math.random()) << 0, 1);
  }
  return shuffledWord;
};

export const strUrl = (str: string) => {
  str = str.toLowerCase();
  return str.replace(/(\s|\||\?|\#|_|&|;|\.)/g, "-").replace(/\-+/g, "-").replace(/(^-)+/, '').replace(/-+$/, '')
};

export const strPhone = (str: string) => {
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

export const mysqlSanitizeData = (data: any) => {
  try {
    data = JSON.stringify(data);
    data = JSON.parse(data);
    data = data.map((item: any) => {
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

export const mysqlQuery = async (query: string, { host, user, password, database, port = 3306 }: any) => {
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

export const mysqlProcedure = async (procName: string, procAction: string, data: any = {}, { host, user, password, database, port = 3306 }: any, debug: boolean = false) => {
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

export const mysqlTableData = async (reqData: any, procName: string, procAction: string, { host, user, password, database, port = 3306 }: any) => {
  let start_rec = (reqData.page - 1) * reqData.limit;
  let filters: any = {}
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

export const mysqlDate = (utc: boolean = true) => {
  const date = require("date-and-time");
  const now = new Date();
  return date.format(now, "YYYY-MM-DD HH:mm:ss", utc);
};

export const utcToLocal = (dateTime: any, dtFormat: string = 'DD MMM YYYY hh:mmA') => {
  const date = require("date-and-time");
  if (dateTime != '' && dateTime != null && dateTime != undefined) {
    let dt = date.format(new Date(dateTime), 'YYYY/MM/DD HH:mm:ss')
    let hr = date.format(new Date(dateTime), 'HH')
    let tmp_hr = hr
    hr = hr > 12 ? hr - 12 : hr
    dt = dt + ' ' + (tmp_hr >= 12 ? 'PM' : 'AM') + ' UTC'
    let arr = dt.split(' ')
    let newArr = arr[1].split(':')
    newArr[0] = hr
    arr[1] = newArr.join(':')
    dt = arr.join(' ')
    dt = new Date(dt)
    dt = date.format(new Date(dt), dtFormat);
    return dt
  } else {
    return ''
  }
}

export const encrypt = async (text: string, key: string) => {
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

export const decrypt = async (hash: string, key: string) => {
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