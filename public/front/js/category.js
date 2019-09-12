$(function(){

    // 一进页面加载一级分类
    render()
    function render(){
        $.ajax({
            type: "get",
            url: "/category/queryTopCategory",
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("categoryTpl", info);
                $(".lt-category-left ul").html(htmlStr);
                // 一进页面渲染二级分类
                renderSecondById(info.rows[0].id);
            }
        });
    }

    // 点击切换一级分类，渲染相应的二级分类(委托事件)
    $(".lt-category-left").on("click", "a", function(){
        // 选中的加上.current，其它的去掉current
        $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        // 渲染相应的二级分类
        var id = $(this).data("id");
        renderSecondById(id);        
    });


    // 根据一级分类id，渲染二级分类
    function renderSecondById( id ){
        $.ajax({
            type: "get",
            url: "/category/querySecondCategory",
            data: {
                id: id
            },
            dataType: "json",
            success: function(info){
                console.log(info);
                var htmlStr = template("secondTpl", info);
                $(".lt-category-right ul").html(htmlStr);
            }
        });
    }
})