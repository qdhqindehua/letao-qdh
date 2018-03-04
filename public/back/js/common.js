$(function () {
  //禁用进度环
  NProgress.configure({
    showSpinner: false
  });

  //进度条在ajax请求开始的时候开启
  $(document).ajaxStart(function () {
    //进度条开启
    NProgress.start();
  });
  $(document).ajaxStop(function () {
    // NProgress.done();
    setTimeout(function () {
      //结束
      NProgress.done();
     }, 500);
  });

})