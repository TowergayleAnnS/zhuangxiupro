
let p1 = $.get("/component/com-case.html")
let p2 = $.get("http://www.zhongzi-oa.com:89/cstyle/")
let p3 = $.get("http://www.zhongzi-oa.com:89/ctype/")
let p4 = $.get("http://www.zhongzi-oa.com:89/case/")
Promise.all([p1,p2,p3,p4])
.then(data=>{
	// 渲染数据
	let htmlStr = ejs.render(data[0], {
		cstyles:data[1].data,
		ctypes:data[2].data
	})
	
	$("#main").html(htmlStr)
	
	$.get("/component/com-case-box.html")
	.then(html=>{
		
		$("#case").html(ejs.render(html, {cases:data[3].data}))
	})
	
})
.catch(err=>{
	
})

// 变量 记录cstyle 和 ctype
var cstyle = ""
var ctype = ""

function ctypeClick(e){
	$(".ctype-item.search-active").removeClass("search-active")
	ctype = $(e.target).text()=="全部"?"":$(e.target).text()
	
	$(e.target).addClass("search-active")
	
	searchCase()
}

function cstyleClick(e){
	$(".cstyle-item.search-active").removeClass("search-active")
	cstyle = $(e.target).text()=="全部"?"":$(e.target).text()
	$(e.target).addClass("search-active")
	searchCase()
}

function searchCase(){
	
	
	let p1 = $.get("/component/com-case-box.html")
	let p2 = $.get(`http://www.zhongzi-oa.com:89/case/?cstyle=${cstyle}&ctype=${ctype}`)
	
	Promise.all([p1,p2])
	.then(data=>{
		
		$("#case").html(ejs.render(data[0], {cases:data[1].data}))
	})
}

// 事件委托
$("body").on("submit", $(".form-control"), function(e){
	
	e.preventDefault()
	
	var obj = {
		name:$("#name").val(),
		phone:$("#phone").val(),
		floor:$("#floor").val(),
		area:$("#area").val(),
		captcha:$("#captcha").val()
	}
	
	$.post("/email",obj)
	.then(data=>{
		
		if (data.code == 200){
			$("#name").val("")
			$("#phone").val("")
			$("#floor").val("")
			$("#area").val("")
			$("#captcha").val("")
			$("#captcha-img").attr("src", "/captcha?"+Math.random())
		}
		alert(data.msg)
	})
})

// 点击验证码图片切换验证码
function changeCaptcha(e){
	
	e.preventDefault()
	// 重新向验证码地址发起请求
	$("#captcha-img").attr("src", "/captcha?" + Math.random())
	
}



