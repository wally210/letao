$(function(){
    // 功能1: 获取地址栏参数赋值给 input
    var key = getSearch("key");
    $(".searchInp").val(key);
    // 页面渲染
    render();

    // 功能2：点击搜索按钮，实现搜索功能
    $(".btn-search").click(function(){
        // 获取搜索input框输入的值
        var key = $(".searchInp").val();
        // 去空
        if(key.trim() === ""){
            mui.toast('请输入搜索内容',{ duration:'2000', type:'div' });
            return; 
        }
        render();
        // 有搜索内容, 需要添加到本地存储localStorage
        var history = localStorage.getItem("search_list") || "[]";//jsonStr
        // 转成数组
        var arr = JSON.parse(history);

        // 要求：1 不能重复
        var index = arr.indexOf(key);
        if(index != -1){
            // 删除重复
            arr.splice(index, 1);            
        }
        // 2 不能超过10
        if(arr.length >= 10){
            // 删除最后一项
            arr.pop();
        }
        // 往数组前面添加
        arr.unshift(key);
        // 转化成jsonStr,存储到本地存储
        localStorage.setItem("search_list", JSON.stringify(arr));
    });

    // 功能3：添加排序功能
    // (1) 自己有current, 切换箭头方向
    // (2) 自己没有current, 给自己加上, 让其他的移除 current
    $(".nav-search a[data-type]").click(function(){
        if($(this).hasClass("current")){
            // 有就切换箭头方向
            $(this).find("i").toggleClass("fa fa-angle-down").toggleClass("fa fa-angle-up");
        }else{
            // 没有加上类current，并排除兄弟
            $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        }
        render();
    })

    // 页面渲染
    function render(){
        $(".lt-product").html('<div class="loading"></div>');
        // 3个必须参数
        var params = {};
        
        params.proName = $(".searchInp").val();
        params.page = 1;
        params.pageSize = 100;

        // 2. 两个可传可不传的参数price num
        //    (1) 通过判断有没有高亮元素, 决定是否需要排序
        //    (2) 通过箭头方向判断, 升序还是降序  1升序，2降序
        var $current = $(".nav-search a.current");
        if($current.length > 0){
            // 有高亮需要进行排序
            var sortName = $current.data("type");
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[sortName] = sortValue;
        }
        
        setTimeout(function(){
            $.ajax({
                url: "/product/queryProduct",
                type: "get",
                data: params,
                dataType: "json",
                success: function(info){
                    console.log(info);
                    var htmlStr = template("slTpl", info);
                    $(".lt-product").html(htmlStr);
                }
            });
        },500);
    }
});