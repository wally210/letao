$(function(){
    var currentPage = 1;
    var pageSize = 5;
    
    sender();
    // 1渲染二级分类页面
    function sender(){
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("secondTpl", info);
                $(".lt-content tbody").html(htmlStr);
            }
        })
    }
});