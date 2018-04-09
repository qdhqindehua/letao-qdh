/**
 * Created by HUCC on 2018/3/7.
 */
$(function () {


  //功能一：渲染商品数据
  //1. 获取到地址栏中productId
  //2. 发送ajax请求，获取到商品的详细信息
  //3. 结合模版引擎渲染出来
  var productId = getSearch("productId");

  $.ajax({
    type:'get',
    url:'/product/queryProductDetail',
    data: {
      id: productId
    },
    success:function (info) {
      //给info添加一个数组
      /*var tempArr = info.size.split("-");
      var arr = [];
      for(var i = +tempArr[0]; i <= tempArr[1]; i++){
        arr.push(i);
      }
      info.sizeArray = arr;*/



      console.log(info);
      $(".mui-scroll").html( template("tpl", info) );

      //重新初始化轮播图
      mui(".mui-slider").slider();

      //重新初始化numbox
      mui(".mui-numbox").numbox();

      //可以选择尺码
      $(".size span").on("click", function () {
        $(this).addClass("now").siblings().removeClass("now");
      });


    }
  });



  //功能二：加入购物车
  //1. 给按钮注册点击事件
  //2. 获取productId, num, size ,发送ajax请求
  $(".btn_add_cart").on("click", function () {

    var size = $(".size span.now").text();
    var num = $(".mui-numbox-input").val();

    if(!size){
      mui.toast("请选择尺码");
      return;
    }

    $.ajax({
      type:'post',
      url:"/cart/addCart",
      data: {
        productId: productId,
        num:num,
        size:size
      },
      success:function (info) {
        //加入购物车需要登录
        if(info.error) {
          //跳转到登录页面， ,并且把当前页给传递过去。
          location.href = "login.html?retUrl="+location.href;
        }

        if(info.success) {
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
            if(e.index == 0){
              location.href = "cart.html";
            }
          })
        }
      }
    });


  });


});