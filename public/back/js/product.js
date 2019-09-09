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

                    // 配置按钮文本
                    // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值进行设置文本
                    // 参数1: type  取值: page  first  last  prev  next
                    // 参数2: page  指当前这个按钮所指向的页码
                    // 参数3: current 当前页
                    itemTexts: function(type, page, current){
                        switch (type){
                            case 'page':
                                return page;
                            case 'first':
                                return "首页";
                            case 'prev':
                                return "上一页";
                            case 'next':
                                return "下一页";
                            case 'last':
                                return "尾页";
                        }
                    },
                    // 配置 title 提示信息
                    // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值设置title文本
                    tooltipTitles: function( type, page, current ) {
                        switch ( type ) {
                        case "page":
                            return "前往第" + page + "页";
                        case "first":
                            return "首页";
                        case "last":
                            return "尾页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        }
                    },
                    // 使用 bootstrap 的提示框组件
                    useBootstrapTooltip: true,

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