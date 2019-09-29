$(function(){

    $("#loginBtn").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
    
        // 用户名不能为空
        if(username === ""){
            mui.toast("用户名不能为空");
            return;
        }
        // 密码不能为空
        if(password === ""){
            mui.toast("密码不能为空");
            return;
        }

        $.ajax({
            url: "/user/login",
            type: "post",
            data: {
                username: username,
                password: password
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                if(info.error === 403){
                    mui.toast("用户名或者密码错误");
                    return;
                }
                // 登录成功
                // 1. 如果是从其他页面拦截过来的, 跳回去
                // 2. 如果是直接访问 login.html, 跳转到个人中心页
                if(location.href.indexOf("setURL") > -1){
                    var setURL = location.search.replace("?setURL=", "");
                    location.href = setURL;
                }else{
                    location.href = "user.html";
                }
            }
        })
    })

})