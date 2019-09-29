$(function(){
    // 进入页面渲染页面
    $.ajax({
        url: "/user/queryUserMessage",
        type: "get",
        success: function(info){
            console.log(info);
            if(info.error === 400){
                location.href = "login.html";
                return;
            }
            var htmlStr = template("userTpl", info);
            $("#userInfo").html(htmlStr);
        }
    });

    // 退出功能
    $(".logoutBtn").click(function(){
        $.ajax({
            url: "/user/logout",
            type: "get",
            success: function(info){
                console.log(info);
                if(info.success){
                    location.href = "login.html";
                }
            }
        })
    })
})