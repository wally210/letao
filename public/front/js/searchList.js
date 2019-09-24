
$(function(){

    // 功能1 ：input搜索框有搜索数据
    var value = getSearch("key");
    $(".lt-search input").val(value);

    // 功能2：搜索产品模块页面渲染
    render();
    function render(){
        $.ajax({
            url: "/product/queryProduct",
            type: "get",
            data: {
                proName: $(".lt-search input").val(),
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("slTpl", info);
                $(".lt-product").html(htmlStr);
            }
        })
    }
});
