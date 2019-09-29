$(function(){
    
    // 功能1: 获取地址栏的productId, 发送ajax请求, 进行商品渲染
    var productId = getSearch("productId");

    $.ajax({
        url: "/product/queryProductDetail",
        type: "get",
        data: {
            id: productId
        },
        dataType: "json",
        success: function(info){
            console.log(info);
            var htmlStr = template("productTpl", info);
            $(".lt-main .mui-scroll").html(htmlStr);

            // 手动初始化轮播图
            //获得slider插件对象
            var gallery = mui('.mui-slider');
                gallery.slider({
                    interval:2000 //自动轮播周期，若为0则不自动播放，默认为0；
            });

            // 手动初始化 数字框
            mui(".mui-numbox").numbox()
        }
    });

    // 功能2: 让尺码可以选中 (通过事件委托注册)
    $(".lt-main .mui-scroll").on("click", ".lt-size span", function(){
        var size = $(this).text();
        // 选中高亮
        $(this).addClass("current").siblings().removeClass("current");
    });

    // 3: 加入购物车功能
    // （1）添加点击事件
    // （2）需要的参数：productId num size
    $("#cartBtn").click(function(){
        
        var size = $(".lt-size span.current").text();
        var num = $(".mui-numbox-input").val();
        // 尺码不能为空
        if(!size){
            mui.toast("请选择尺码");
            return;
        }

        $.ajax({
            url: "/cart/addCart",
            type: "post",
            data: {
                productId: productId,
                num: num,
                size: size
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                // 1 未登陆
                if(info.error === 400){
                    // 跳转到登陆页
                    location.href = "login.html?setURL=" + location.href;
                }
                // 2 已登陆跳转到个人中心
                if(info.success){
                    mui.confirm("添加成功", "温馨提示", ["去购物车","继续浏览"], function(e){
                        if(e.index === 0){
                            location.href = "cart.html";
                        }
                    })
                }
            }
        });
    });

})