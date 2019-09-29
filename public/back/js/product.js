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
            // 后台如果在响应头中, 设置了响应头 Content-Type: application/json;
            // 前端可以省略  dataType: "json"
            dataType: "json",
            success: function(info){
                // console.log(info);
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

    // 2.点击添加商品，弹出模态框，同时发送ajax查询二级分类
    $("#addProduct").on("click", function(){
        // 清空表单数据
        $("#form").data("bootstrapValidator").resetForm(true);

        // 品牌id,图片不是表单元素，手动清除
        $("#dropdownText").text("请选择二级分类");
        $("#imgBox img").remove();

        // 显示模态框
        $("#product-modal").modal("show");

        // ajax查询二级分类
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("secondTpl", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    });

    // 3.给dropdown-menu下面的 a 注册点击事件(通过事件委托)
    $(".dropdown-menu").on("click", "a", function(){
        // a标签的文本值,赋值给dropdownText标签
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        // a标签的id 赋值给隐藏域
        var id = $(this).data("id");
        $("[name='brandId']").val(id);

        // 当选择品牌后改变校验结果
        $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");

    });

    // 定义变量，用来存储多文件上传的图片
    var picAddr = [];
    // 4.多文件上传
    //   多文件上传时, 插件会遍历选中的图片, 发送多次请求到服务器, 将来响应多次
    //   每次响应都会调用一次 done 方法
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function(e, data){
            // 往数组前面添加
            picAddr.unshift(data.result);
            // 往imgBox最前面添加图片
            $("#imgBox").prepend("<img src='"+ data.result.picAddr +"' width='100px' height='100px' alt=''>");

            // 只显示3张图片(删除数组最后面的图片)
            if(picAddr.length > 3 ){
                // 数组.pop()从后面删除
                picAddr.pop();
                // 删除最后面的图片标签img
                // $("#imgBox img").eq(-1).remove();
                $("#imgBox img:last-of-type").remove();
            }
            // 如果处理后, 图片数组的长度为 3, 那么就通过校验, 手动将picStatus置成VALID
            if(picAddr.length === 3){
                $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
            }
        }
    });

    // 5.表单校验
    $("#form").bootstrapValidator({

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
            brandId: {
                // 校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    // \d 表示数字 0-9
                    // + 表示出现一次或多次
                    // * 表示出现0次或多次
                    // ? 表示出现0次或1次
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            // 尺码, 还要求必须是 xx-xx 的格式, x为数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码必须是 xx-xx 的格式, 例如: 32-40'
                      }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });

    // 6.点击添加按钮，通过ajax提交表单
    $("#form").on("success.form.bv", function(e){
        // 阻止表单事件
        e.preventDefault();
        console.log($("#form").serialize());

        // 获取表单元素数据
        var paramsStr = $("#form").serialize();

        // 拼接图片的数据
        paramsStr += "&picName1="+ picAddr[0].picName +"&picAddr1="+ picAddr[0].picAddr;
        paramsStr += "&picName2="+ picAddr[1].picName +"&picAddr2="+ picAddr[1].picAddr;
        paramsStr += "&picName3="+ picAddr[2].picName +"&picAddr3="+ picAddr[2].picAddr;

        $.ajax({
            url: "/product/addProduct",
            type: "post",
            data: paramsStr,
            dataType: "json",
            success: function(info){
                console.log(info);
                if(info.success){
                    // 关闭模态框
                    $("#product-modal").modal("hide");
                    // 重新加载第一页
                    currentPage = 1;
                    render();
                    // 清空表单数据
                    $("#form").data("bootstrapValidator").resetForm(true);

                    // 品牌id,图片不是表单元素，手动清除
                    $("#dropdownText").text("请选择二级分类");
                    $("#imgBox img").remove();

                }
            }
        });
    });


});