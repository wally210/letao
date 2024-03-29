$(function(){
    // 注意: 要进行本地存储localStorage的操作, 进行历史记录管理,
    //       需要约定一个键名,  search_list
    //       将来通过 search_list 进行读取或者设置操作

    // 准备假数据: 将下面三行代码, 在控制台执行, 可以添加假数据
    // var arr = [ "华为", "vivo", "oppo", "小米", "荣耀" ];
    // var jsonStr = JSON.stringify( arr );
    // localStorage.setItem( "search_list", jsonStr );

    render();
    // 功能1: 列表渲染功能
    // (1) 从本地存储中读取历史记录, 读取的是 jsonStr
    // (2) 转换成数组
    // (3) 通过模板引擎动态渲染

    // 从本地存储中读取历史记录, 以数组的形式返回
    function getHistory(){
        // 当没有历史数据时，要给个空数组
        var history = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse(history);
        return arr;
    }

    // 读取数组, 进行页面渲染
    function render(){
        var arr = getHistory();
        // 模板进行渲染数据
        var htmlStr = template("historyTpl", {arr: arr});
        $(".lt-history").html(htmlStr);
    }

    // 功能2：清空记录
    // 注册事件，通过事件委托注册
    // 清空历史记录，removeItem()
    // 页面重新渲染
    $(".lt-history").on("click", ".btn-empty", function(){
        mui.confirm("确认要全部清空记录？", "温馨提醒",["取消","确认"],function(e){
            if(e.index === 1){
                localStorage.removeItem("search_list");
                render();
            }
        })
    });

    // 功能3：删除单条历史记录
    // 注册事件：事件委托
    // 将下标存在删除按钮上，获取存储的下标
    // 从本地存储中读取数据
    // 通过下标删除对应项 splice
    // 将修改后的数组转换成jsonStr,再存储到localStorage
    // 页面重新加载
    $(".lt-history").on("click", ".btn-del", function(){

        var that = $(this);

        // confirm确认框
        mui.confirm("你确定删除该条记录吗?", "温馨提示", ["取消", "确定"], function(e){
            console.log(e);
            if(e.index === 1){
                var index = that.data("index");
                var jsonStr = localStorage.getItem("search_list");
                var arr = JSON.parse(jsonStr); //json字符串转换成数组
                // 删除对应index坐标的数据
                // splice( 从哪开始，删除几项，添加的项1，添加的项2，...);
                arr.splice(index, 1);
                // 转换成json字符串再存储
                localStorage.setItem("search_list",JSON.stringify(arr));
                // 重新渲染页面
                render();
            }
        })
    });

    // 功能4：点击搜索按键，搜索相关商品信息
    $(".btn-search").on("click", function(){
        var key = $(".lt-search input").val().trim();

        // 获取本地搜索记录
        var arr = getHistory();
        // 如果有重复值，先删除原来的再把新的在最前面保存
        var index = arr.indexOf(key);
        if(index > -1){
            // console.log(index);
            arr.splice(index, 1);
        }
        if(arr.length >= 10){
            arr.pop();
        }

        // 在数组前面添加搜索值
        arr.unshift(key);

        // 数组转成json字符串，保存
        localStorage.setItem("search_list", JSON.stringify(arr));
        // 清空搜索框内容
        $(".lt-search input").val("");

        // 搜索完成, 跳转到搜索列表, 并将搜索关键字传递过去
        location.href = "searchList.html?key=" + key;
        
    });


})