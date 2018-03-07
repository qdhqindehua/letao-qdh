$(function () {
  var page = 1;
  var pageSize = 5;

  // function render() {
    $.ajax({
      type:'GET',
      url:'/user/queryUser',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        //3. 准备数据，获取到数据在info中
        //4. 模版 + 数据 = html结构  绑定模版与数据
        //第一个参数：模版id   第二参数：对象
        //当模版与对象绑定之后，在模版中可以直接使用对象的所有属性。
        // var html = template("tempuser", info);
        // //5. 渲染数据
        // $("tbody").html(html);
        $("tbody").html(template("tempuser", info));

        //6.渲染分页
        $("#page")
      }
    })
  }
)