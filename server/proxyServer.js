const http = require('http')

let islogin = false

http.createServer(function(req,res) {
	// 跨域设置
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("X-Powered-By",' 3.2.1')
	res.setHeader("Content-Type", "application/json;charset=utf-8");

	// 列表接口
	if(req.url === '/ssr/api/news.json?secret=abcd' && req.method ==='GET') {
		let result = [
			{ "id": 1, "title": "this is first data","hash":"R59cdr"},
			{ "id": 2, "title": "this is second data","hash":"re58dr"},
			{ "id": 3, "title": "this is third data","hash":"OVk8rR"},
			{ "id": 4, "title": "this is fourth data","hash":"04C84R"},
			{ "id": 5, "title": "this is fifth data","hash":"Mkr90f"}
		]
		res.end(JSON.stringify(result))
	}

	// 判断是否登录
	if(req.url === '/ssr/api/isLogin.json?secret=abcd'&& req.method ==='GET') {
		res.end(JSON.stringify(
			{
				"success": true,
				"data": {
					"login":islogin
				}
			}
		))
	}
	// 登录
	if(req.url === '/ssr/api/login.json?secret=abcd'&& req.method ==='GET') {
		islogin = true
		res.end(JSON.stringify(
			{
				"success": true,
				"data": {
					"login": true
				}
			}
		))
	}
	// 退出登录
	if(req.url === '/ssr/api/logout.json?secret=abcd'&& req.method ==='GET') {
		islogin = false
		res.end(JSON.stringify(
			{
				"success": true,
				"data": {
					"logout": true
				}
			}
		))
	}

	// 翻译列表
	if(req.url === '/ssr/api/translations.json?secret=abcd'&& req.method ==='GET') {
		if(islogin === false) {
			res.end(JSON.stringify({"success":false}))
		} else {
			res.end(JSON.stringify(
				{
					"success": true,
					"data": [
						{ "id":1, "title":"男孩落入洛杉矶污水系统后获救" },
						{ "id":2, "title":"独立厨师交流点子" },
						{ "id":3, "title":"移民者关注墨西哥边境政策" },
						{ "id":4, "title":"成千上万的美国教师罢工要求加薪" },
						{ "id":5, "title":"五年前，马丁-路德遇刺身亡" },
					]
				}
			))
		}
	}
}).listen(4000)
console.log("server is running on 4000")