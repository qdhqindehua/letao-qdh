$(function () {
  //1.加载一级分类的数据
  $.ajax({
    type:'GET',
    url:'/category/queryTopCategory',
    success:function (info) {
      // console.log(info);
      $(".first").html(template("tempfirst", info));
      //渲染二级分类
      renderSecond(info.rows[0].id);
    }
  });

  //2.点击一级菜单，重新渲染二级菜单
  $(".first").on("click", "li", function () {
    $(this).addClass("now").siblings().removeClass("now");

    var id = $(this).data("id");
    renderSecond(id);
  })

  //渲染二级分类的函数
  function renderSecond(id) {
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data: {id:id},
      success:function (info) {
        console.log(info);
        $(".second").html(template("tempsecond", info));
      }
    })
  }
})