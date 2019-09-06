$(function(){

    var currentPage = 1;
    var pageSize = 5;

    // 一进来就渲染页面
    render();
    function render(){
        // user页面渲染
        $.ajax({
            url: "/user/queryUser",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                // 参数1：template模板id，参数2：数据对象
                var htmlStr = template("tpl", info);
                $(".lt-content tbody").html(htmlStr);

                // bootstrapPaginator分布插件功能
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion: 3, // 默认2，版本3要加上
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked:function(event, originalEvent, type,page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        console.log(page);
                        // 当前页为点击页码，
                        currentPage = page;
                        // 重新渲染页面
                        render();
                    }
                })
            }
        })
    }

    // 当前id
    var currentId;
    // 当前状态 0:禁用 1：启用
    var isDelete;
    // 启用或禁用功能，事件委托
    $("tbody").on("click", ".btn", function(){
        // 模态框显示: modal("show")
        $("#user-modal").modal("show");
        // 通过自定义属性, 获取td中存的用户id, 并保存在全局变量中
        currentId = $(this).parent().data("id");
        // 1 启用, 0 禁用
        // 通过判断类名, 决定需要传递给后台 isDelete,
        // 如果是禁用按钮, 想要禁用该用户, 就是将该用户状态, 变成 0, 传 0
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    });

    // 点击模态框的确定按钮, 实现启用禁用切换
    $("#btn-user").on("click", function(){
        $.ajax({
            url: "/user/updateUser",
            type: "post",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                if(info.success){
                    // 修改状态成功
                    // 关闭模态框 显示show, 关闭hide
                    $("#user-modal").modal("hide");
                    // 重新渲染页面
                    render();
                }
            }
        })
    })
});