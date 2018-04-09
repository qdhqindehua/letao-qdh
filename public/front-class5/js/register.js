/**
 * Created by HUCC on 2018/3/8.
 */
$(function () {

  //获取验证
  //1. 给获取验证码注册点击事件（禁用默认行为）
  //2. 禁用掉用按钮，并且把内容改成 发送中...
  //2. 发送ajax请求
  $(".btn_getcode").on("click", function (e) {
    e.preventDefault();

    var $this = $(this);
    //首先
    $this.prop("disabled", true).addClass("disabled").text("发送中...");

    $.ajax({
      type:'GET',
      url:'/user/vCode',
      success:function (info) {
        console.log(info);
        //开启倒计时
        var count = 5;
        var timeId = setInterval(function () {

          count--;
          //修改text的内容
          $this.text(count+"秒后再次发送");

          if(count <= 0){
            //需要清除定时器
            clearInterval(timeId);
            //恢复按钮
            $this.prop("disabled", false).removeClass("disabled").text("再次发送");
          }

        },1000);
      }
    })

  });



  //注册功能
  $(".btn_register").on("click", function (e) {
    e.preventDefault();

    var username = $("[name='username']").val();
    var password = $("[name=password]").val();
    var repassword = $("#repassword").val();
    var mobile = $("[name=mobile]").val();
    var vCode = $("[name=vCode]").val();

    if(!username) {
      mui.toast("用户名不能为空");
      return;
    }

    if(!password) {
      mui.toast("密码不能为空");
      return;
    }

    if(repassword != password) {
      mui.toast("确认密码与密码不一致");
      return;
    }

    if(!mobile) {
      mui.toast("手机号不能为空");
      return;
    }

    if(!/^1[3-9]\d{9}$/.test(mobile)){
      mui.toast("手机号码格式错误");
      return;
    }

    if(!vCode) {
      mui.toast("验证码不能为空");
      return;
    }



    //校验通过
    $.ajax({
      type:'post',
      url:"/user/register",
      data: $("form").serialize(),
      success:function (info) {
        if(info.error){
          mui.toast(info.message);
        }
        if(info.success) {
          mui.toast("恭喜你，注册成功了，2秒后自动跳转到登录页");
          setTimeout(function () {
            location.href = "login.html";
          },2000);

        }
      }
    })

  });




});