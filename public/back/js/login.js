$(function(){
      /*
        * 1. 进行表单校验配置
        *    校验要求:
        *        (1) 用户名不能为空, 长度为2-8位
        *        (2) 密码不能为空, 长度为6-20位
        * */
    // 配置的字段和 input 框中指定的 name 关联, 所以必须要给 input 加上 name
    $("#form").bootstrapValidator({
        /*input状态样式图片*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        fields: {
            username: {
                validators: {
                    //非空验证：提示消息
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    // 长度校验
                    stringLength: {
                        min: 2,
                        max: 8,
                        message: '用户名长度必须在2到8之间'
                    },
                    // 专门用于配置回调提示的规则
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    // 非空校验
                    notEmpty: {
                        message : "密码不能为空"
                    },
                    // 长度校验
                    stringLength: {
                        min: 6,
                        max: 20,
                        message: "密码长度必须在6到20之间"
                    },
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        }
    });

      /*
        * 2. 登陆功能
        *    表单校验插件会在提交表单时进行校验
        *    (1) 校验成功, 默认就提交表单, 会发生页面跳转,
        *        我们需要注册表单校验成功事件, 阻止默认的提交, 通过ajax进行发送请求
        *    (2) 校验失败, 不会提交表单, 配置插件提示用户即可
        * */
    $("#form").on("success.form.bv", function(e){
        // 阻止默认表单提交
        e.preventDefault();
        // 通过ajax进行提交
        $.ajax({
            url: "/employee/employeeLogin",
            type: "post",
            data: $("#form").serialize(),
            dataType: "json",
            success: function(info){
                console.log(info);
                // success: true
                if(info.success){
                    // 登陆成功，跳转到首页
                    location.href = "index.html";
                }
                if(info.error === 1000){
                    // updateStatus 更新校验状态 - VALIDATING：校验中的 - INVALID ：校验失败的 - VALID：校验成功的。
                    // error: 1000, message: "用户名不存在! "
                    $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                 // error: 1001, message: "密码错误！"
                if(info.error === 1001){
                    $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        })
    });

    /**
     *  3.重置功能
     */
    $("[type='reset']").on("click", function(){
        // resetForm(false) 重置图标 resetForm();重置表单和图标
        $("#form").data("bootstrapValidator").resetForm();
    });
});