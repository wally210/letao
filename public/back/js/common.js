
/**
 * 进度条：nprogress
 * 在ajax开始时触发，结束后关闭
 */
// NProgress.start();
// setTimeout(function(){
//     NProgress.done();
// }, 4000)

// ajax 全局事件
// 1. ajaxComplete 当每个 ajax 请求完成的时候, 调用 (不管成功还是失败都调用)
// 2. ajaxError    当 ajax 请求失败的时候, 调用
// 3. ajaxSuccess  当 ajax 请求成功的时候, 调用
// 4. ajaxSend     在每个 ajax 请求发送前, 调用
// 5. ajaxStart    在第一个 ajax 发送时, 调用
// 6. ajaxStop     在所有的 ajax 请求完成时, 调用
$(document).ajaxStart(function(){
    // 开户进度条
    NProgress.start();
});
$(document).ajaxStop(function(){
    // 模拟网络延迟
    setTimeout(function(){
        // 关闭进度条
        NProgress.done();
    }, 500);
});

// 登录拦截功能, 登录页面不需要校验, 不用登录就能访问
// 前后分离了, 前端是不知道该用户是否登录了, 但是后台知道,
// 发送 ajax请求, 查询用户状态即可
// (1) 用户已登录, 啥都不用做, 让用户继续访问
// (2) 用户未登录, 拦截到登录页
if(location.href.indexOf("login.html") === -1){
    $.ajax({
        url: "/employee/checkRootLogin",
        type: "get",
        dataType: "json",
        success: function(info){
            console.log(info);
            if(info.success){
                // 已登陆，继续访问
            }
            if(info.error === 400){
                // 未登陆，跳转到登陆页login.html
                location.href = "login.html";
            }
        }
    })
}


$(function(){
    // 1.分类管理切换功能
    $(".nav .category").on("click", function(){
        console.log(111)
        // 切换child的显示隐藏
        $(".nav .child").stop().slideToggle();
    });

    // 2.左侧边栏切换功能
    $(".icon-menu").on("click", function(){
        $(".lt-aside").toggleClass("hidemenu");
        $(".lt-main").toggleClass("hidemenu");
    });

    // 3.点击topbar退出按钮，弹出模态框
    $(".icon-logout").on("click", function(){
        // 显示模态框, 显示模态框 modal("show");
        $("#logout-modal").modal("show");
    });

    // 4.点击模态框退出按钮，实现退出功能
    $("#btn-logout").on("click",function(){
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType: "json",
            success: function(info){
                console.log(info);//{success: true}
                if(info.success){
                    // 退出成功，跳转到登陆页面
                    location.href = "login.html";
                }
            }
        })
    })
})

