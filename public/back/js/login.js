//等待页面加载完成
//防止全局变量的污染
$(function () {
  //1.校验表单
  $("form").bootstrapValidator({
    //要求：用户名不能为空  2-6
    //     密码不能为空  密码的长度在6-12为
    //指定校验字段
    fields: {
      //校验用户名，对应form中的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '长度应该在2-6位'
          },
          //提示信息
          callback: {
            message: '用户名错误'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度应该在6-12位'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    },
    //指定校验时的图标显示，成功 失败  校验中
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  });

  //2.给表单注册一个校验成功的事件， 成功的时候阻止表单的默认提交，使用ajax进行。
  

  //3.重置表单， 清除所有的样式
  
});