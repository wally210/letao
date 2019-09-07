$(function(){
    
    // 1.一级分类页面渲染
    render();
    function render(){
        //当前页
        var currentPage = 1;
        // 每页条数
        var pageSize = 5;
    
        // ajax请求
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("firstTpl", info);
                $("tbody").html(htmlStr);
            }
        })
    }
});