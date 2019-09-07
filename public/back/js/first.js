$(function(){
    
    //当前页
    var currentPage = 1;
    // 每页条数
    var pageSize = 5;
    
    // 一进页面就渲染
    render();
    // 1.一级分类页面渲染
    function render(){
    
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
                // bootstrapPaginator分页 ul
                $("#paginator").bootstrapPaginator({
                    // 指定当前版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 给页码添加点击事件
                    onPageClicked: function(a, b, c, page){
                        // 更新当前页重新渲染
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    // 2.点击添加分类按钮，弹出添加模态框
    $(".btn-add").on("click", function(){
        // 显示模态框
        $("#cate-modal").modal("show");
    });

    // 3.添加表单校验功能
    $("#form").bootstrapValidator({
        // 图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功图标
            invalid: 'glyphicon glyphicon-remove', // 校验失败图标
            validating: 'glyphicon glyphicon-refresh' // 校验中图标
        },
        // 字段列表
        fields: {
            // 字段名称input name属性
            categoryName: {
                // 校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    });

    // 4. 添加表单校验成功事件, 阻止默认的表单提交, 通过ajax进行提交
    $("#form").on("success.form.bv", function(e){
        // 阻止表单事件
        e.preventDefault();
        // 通过ajax提交
        $.ajax({
            url: "/category/addTopCategory",
            type: "post",
            data: $("#form").serialize(),
            dataType: "json",
            success: function(info){
                console.log(info);
                if(info.success){
                    // 关闭模态框
                    $("#cate-modal").modal("hide");
                    // 重新渲染第一页
                    currentPage = 1;
                    render();
                    // 清空表单内容
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }
        })

    })

  
});