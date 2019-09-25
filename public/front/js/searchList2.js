$(function(){
    // 页面渲染
    var currentPage = 1;
    var pageSize = 2;
    function render(callback){
        // $(".lt-product").html('<div class="loading"></div>');
        // 3个必须参数
        var params = {};
        
        params.proName = $(".searchInp").val();
        params.page = currentPage;
        params.pageSize = pageSize;

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
                    console.log(222);
                    console.log(info);
                    // 真正拿到数据后执行的操作, 通过callback函数传递进来了
                    callback && callback(info);
                }
            });
        },500);
    }
    
    // 功能1: 获取地址栏参数赋值给 input
    var key = getSearch("key");
    $(".searchInp").val(key);
    // 页面渲染
    // render();    

    // 配置下拉刷新和上拉加载注意点:
    // 下拉刷新是对原有数据的覆盖, 执行的是 html 方法
    // 上拉加载时在原有结构的基础上进行追加, 追加到后面, 执行的是 append 方法
    mui.init({
        pullRefresh : {
            //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            container:".mui-scroll-wrapper",
            down : {
                //可选,默认false.首次加载自动下拉刷新一次
                auto: true,
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback : function(){
                    console.log(111)
                    currentPage = 1;
                    render(function(info){
                        console.log(333);
                        var htmlStr = template("slTpl", info);
                        $(".lt-product").html(htmlStr);
                        // ajax 回来之后, 需要结束下拉刷新, 让内容回滚顶部
                        // 注意: api 做了更新, mui文档上还没更新上(小坑)
                        //      要使用原型上的 endPulldownToRefresh 方法来结束 下拉刷新
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
    
                        // 第一页数据被重新加载之后, 又有数据可以进行上拉加载了, 需要启用上拉加载
                        mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
                    });
                } 
            },
            up : {
                callback :function(){ 
                    currentPage++;
                    render(function(info){
                        var htmlStr = template("slTpl", info);
                        $(".lt-product").append(htmlStr);
                        // 当数据回来之后, 需要结束上拉加载
                        // endPullupToRefresh(boolean) 结束上拉加载
                        // 1. 如果传 true, 没有更多数据, 会显示提示语句, 会自动禁用上拉加载, 防止发送无效的ajax
                        // 2. 如果传 false, 还有更多数据
                        if(info.data.length === 0){
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }else{
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }
                    });
                }
            }
        }
    });

    // 功能2：点击搜索按钮，实现搜索功能
    $(".btn-search").click(function(){
        // 获取搜索input框输入的值
        var key = $(".searchInp").val();
        // 去空
        if(key.trim() === ""){
            mui.toast('请输入搜索内容',{ duration:'2000', type:'div' });
            return; 
        }
        // 主动触发上拉下拉加载pulldownLoading() pullupLoading()
        // 点击搜索主动触发下拉加载
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

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

    // mui 认为在下拉刷新和上拉加载容器中, 使用 click 会有 300ms延迟的话, 性能方面不足
    // 禁用了默认的 a 标签的 click 事件, 需要绑定 tap 事件
    // http://ask.dcloud.net.cn/question/8646 文档说明地址
    $(".nav-search a[data-type]").on("tap",function(){
        if($(this).hasClass("current")){
            // 有就切换箭头方向
            $(this).find("i").toggleClass("fa fa-angle-down").toggleClass("fa fa-angle-up");
        }else{
            // 没有加上类current，并排除兄弟
            $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        }
        // 主动触发下拉加载
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });

    // 功能4: 点击每个商品实现页面跳转, 注册点击事件, 通过事件委托注册, 注册 tap 事件
    $(".lt-product").on("tap", "a", function(){
        var id = $(this).data("id");
        location.href = "product.html?productId=" + id;
    })

});