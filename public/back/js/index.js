$(function(){
    // 基于准备好的dom，初始化echarts实例
    var echarts1 = echarts.init(document.querySelector('.echarts-1'));

    // 指定图表的配置项和数据
    var option1 = {
        // 图表标题
        title: {
            text: '2018年注册人数'
        },
        // 提示框组件
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['人数']
        },
        // x轴显示数据
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6 月"]
        },
        // y轴的刻度, 一般不设置, 根据数据动态生成
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar', //bar 柱形 pie饼形 line线形
            data: [800, 2000, 1200, 1700, 500, 1000]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts1.setOption(option1);


    // 基于准备好的dom，初始化echarts实例
    var echarts2 = echarts.init(document.querySelector('.echarts-2'));

    // 指定图表的配置项和数据
    var option2 = {
        // 标题
        title : {
            text: '热门品牌销售',
            subtext: '2008年',
            x:'center' // 标题位置
        },
        tooltip : {
            trigger: 'item', // 坐标轴触发
            // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            // horizontal 可以让图例水平显示
            orient: 'vertical',
            left: 'left',
            data: ['荣耀','vivo','小米','OPPO','华为']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',// 指定圆的大小, 直径所占比例
                center: ['50%', '60%'], // 圆心坐标
                data:[
                    {value:335, name:'荣耀'},
                    {value:310, name:'vivo'},
                    {value:234, name:'小米'},
                    {value:135, name:'OPPO'},
                    {value:1548, name:'华为'}
                ],
                // 阴影效果
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts2.setOption(option2);
});