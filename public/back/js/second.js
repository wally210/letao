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
                // console.log(info);
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

    // 2.点击添加分类按钮弹出模态框
    // 获取一级分类数据
    $("#addBtn").on("click", function(){
        // 重置表单
        $("#form").data("bootstrapValidator").resetForm(true);
        // 下拉按钮的文本, 图片不是表单元素, 需要手动重置
        $("#dropdownText").text("请选择一级分类");
        // 图片不是表单元素，需要手动重置
        $("#imgBox img").attr("src","./images/none.png");
        
        // 显示模态框
        $("#add-modal").modal("show");
        // 获取一级分类数据
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 10
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("firstTpl", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    });

    // 3.绑定下拉列表的a标签（事件委托）
    $(".dropdown-menu").on("click", "a", function(){
        // 获取a标签的值
        var txt = $(this).text();
        // 赋值给一级分类下拉标签
        $("#dropdownText").text(txt);

        // 获取a标签的一级分类id
        var id = $(this).data("id");
        // 赋值给input隐藏域表单元素name='categoryId'
        $("[name='categoryId']").val(id);

        // 更新校验状态为 校验通过状态
        // updateStatus(字段名称, 校验状态, 校验规则(可以配置提示信息) )
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    // 4.配置文件上传插件，进行文件上传初始化
    $("#fileupload").fileupload({
        dataType: "json",
        done: function(e, data){
            // 获取图片地址
            var imgUrl = data.result.picAddr;
            // 图片地址赋值给img标签
            $("#imgBox img").attr("src",imgUrl);
            // 将地址赋值给name="brandLogo"的input隐藏域
            $("[name='brandLogo']").val(imgUrl);

            // 更新校验状态
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    });

    // 5.进行表单校验
    $("#form").bootstrapValidator({
        // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // 默认插件不对隐藏域进行校验, 现在需要对隐藏域进行校验
        // 重置排除项
        excluded: [],


        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',  // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 字段列表
        fields: {
            // 字段名
            categoryId: {
                // 校验规则
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    });

    // 表单提交ajax
    $("#form").on("success.form.bv", function(e){
        // 阻止表单事件
        e.preventDefault();

        $.ajax({
            url: "/category/addSecondCategory",
            type: "post",
            data: $("#form").serialize(),
            dataType: "json",
            success: function(info){
                console.log(info);
                if(info.success){
                    // 关闭模态框
                    $("#add-modal").modal("hide");
                    // 重新第一页
                    currentPage = 1;
                    render();
                    // 重置表单
                    $("#form").data("bootstrapValidator").resetForm(true);

                    // 下拉按钮的文本, 图片不是表单元素, 需要手动重置
                    $("#dropdownText").text("请选择一级分类");
                    // 图片不是表单元素，需要手动重置
                    $("#imgBox img").attr("src","./images/none.png");
                }
            }
        })
    })

});