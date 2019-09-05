
/**
 * 进度条：nprogress
 * 在ajax开始时触发，结束后关闭
 */
// NProgress.start();
// setTimeout(function(){
//     NProgress.done();
// }, 4000)

// ajax 全局事件
// 1. ajaxComplete 当每个 ajax 请求完成的时候, 调用 (不管成功还是失败都调用)
// 2. ajaxError    当 ajax 请求失败的时候, 调用
// 3. ajaxSuccess  当 ajax 请求成功的时候, 调用
// 4. ajaxSend     在每个 ajax 请求发送前, 调用
// 5. ajaxStart    在第一个 ajax 发送时, 调用
// 6. ajaxStop     在所有的 ajax 请求完成时, 调用
$(document).ajaxStart(function(){
    // 开户进度条
    NProgress.start();
});
$(document).ajaxStop(function(){
    // 模拟网络延迟
    setTimeout(function(){
        // 关闭进度条
        NProgress.done();
    }, 500);
});