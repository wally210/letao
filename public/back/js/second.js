$(function(){
    var currentPage = 1;
    var pageSize = 5;
    
    render();
    // 1渲染二级分类页面
    function render(){
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

                // 分页插件bootstrapPaginator(需要ul标签)
                $("#paginator").bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total/info.size),
                    // 页码点击事件
                    onPageClicked: function(a, b, c, page){
                        currentPage = page,
                        render();
                    }
                })
            }
        })
    }
});