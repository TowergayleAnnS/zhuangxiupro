var express = require('express');
var http = require("http")
var router = express.Router();

// 引入svg-captcha
var svg = require("svg-captcha")

// 验证码接口
router.get("/captcha", function(req, res){
	// svg.create() 创建验证码对象,noise 验证码位数  background背景颜色
	let cap = svg.create({
		noise:4,
		background:"#74b535"
	})
	// 将正确的验证码值，通过session对象保存起来
	req.session.captcha = cap.text
	
	res.type("svg")
	
	res.end(cap.data)
})


/* 邮件代理接口 */
router.post('/email', function(req, res) {
	

  // 用户提交的验证码
  let cap = req.body.captcha
  // 验证码是否正确
  if (req.session.captcha.toLowerCase() != cap.toLowerCase()){
	  
	  res.json({
		  code:101,
		  msg:"验证码错误！"
	  })
	  
	  return
  }

  let options = {
	  hostname:"www.zhongzi-oa.com",
	  path:"/person/",
	  port:89,
	  method:"POST"
  }
  
  let request = http.request(options, function(response){
	  
	  let data = Buffer.alloc(0)
	  response.on("data", function(d){
		  
		  data += d
	  })
	  response.on("end", function(){
		 
		   res.json(JSON.parse(data))
	  })
  })
  
  request.write(JSON.stringify(req.body))
  
  request.end()
});








module.exports = router;
