/**
 * Created by HUCC on 2018/3/4.
 */
$(function () {

  //发送ajax请求，获取用户数据，渲染到页面中
  var page = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      type:'GET',
      url:'/user/queryUser',
      data: {
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        //console.log(info);

        //3. 准备数据，获取到数据在info中
        //4. 模版 + 数据 = html结构  绑定模版与数据
        //第一个参数：模版id   第二参数：对象
        //当模版与对象绑定之后，在模版中可以直接使用对象的所有属性。
        var html = template("tpl", info);
        //5. 渲染数据
        $("tbody").html(html);


        //6. 渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3, //如果使用了bootstrap3版本，必须指定
          currentPage: page,  //设置当前页
          totalPages: Math.ceil(info.total/info.size),//设置总页数
          numberOfPages:5,// 设置显示多少页
          //当页码被点击的时候触发
          onPageClicked: function (a,b,c,p) {
            //修改一下page的值
            page = p;
            //重新渲染
            render();
          }

        });

      }
    })
  }

  render();



  //启用禁用用户
  $("tbody").on("click",".btn", function () {

    //显示模态框
    $("#userModal").modal("show");

    //获取到点击的按钮所在的用户的id
    var id = $(this).parent().data("id");

    var isDelete = $(this).hasClass("btn-success")?1:0;

    $(".btn_confirm").off().on("click", function () {

      //发送ajax请求
      $.ajax({
        type:"POST",
        url:"/user/updateUser",
        data: {
          id:id,
          isDelete: isDelete
        },
        success:function (info) {
          if(info.success) {
            //关闭模态框
            $("#userModal").modal('hide');
            //重新渲染
            render();
          }
        }
      });


    });
  });




});