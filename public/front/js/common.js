mui('.mui-scroll-wrapper').scroll({
    // scrollY: false, // 是否竖向滚动 是：true
    // bounce: true, // 是否弹回
    indicators: true, //是否显示滚动条
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

// 配置轮播图自动轮播
//获得slider插件对象
var gallery = mui('.mui-slider');
    gallery.slider({
        interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
});

// 地址栏参数解析
function getSearch(k){
    var search = location.search; //"?key=%E6%9D%8E%E6%9E%97"
    // 解码成为中文
    search = decodeURI(search); // "?name=李林&age=5"
    // 去年?号
    search = search.slice(1); // "name=李林&age=5"
    // split()分割成数组
    var arr = search.split("&"); //  ["name=李林", "age=5"]
    // 创建一个对象
    var obj = {};
    // 循环
    arr.forEach(function(v, i){
        var key = v.split("=")[0]; // name，age
        var value = v.split("=")[1]; // 李林,5
        obj[key] = value;
    });
    return obj[k];
}