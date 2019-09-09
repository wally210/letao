$(function(){
    var currentPage = 1;
    var pageSize = 2;

    // 商品管理页面渲染
    render();
    function render(){
        $.ajax({
            url: "/product/queryProductDetailList",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("productTpl", info);
                $(".lt-content tbody").html(htmlStr);
                // 分页bootstrapPagination
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage : info.page,
                    totalPages : Math.ceil(info.total / info.size),
                    // 分页点击事件
                    onPageClicked: function(a, b, c, page){
                        currentPage = page;
                        render();
                    }
                });
            }
        })
    }
});