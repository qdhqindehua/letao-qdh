/**
 * Created by HUCC on 2018/3/7.
 */

$(function () {


  var page = 1;//全局的page
  var pageSize = 4;

  //render: 1. 获取服务器的数据  2. 拿到数据后渲染
  //问题：获取数据是一样    数据渲染不一样
  var render = function (callback) {
    //1. 发送ajax
    //2. 模版渲染
    var obj = {};
    obj.page = page;
    obj.pageSize = pageSize;
    obj.proName = $(".lt_search input").val();


    //处理price与num， 如果lt_sort下有now这个类，就传排序字段，否则不传
    var $now = $(".lt_sort a.now");
    if ($now.length > 0) {

      var sortName = $now.data('type');
      var sortValue = $now.find("span").hasClass("fa-angle-down") ? 2 : 1;

      obj[sortName] = sortValue;

    } else {
      console.log("不需要传递排序参数");
    }


    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: obj,
      success: function (info) {
        console.log(info);
        setTimeout(function () {
          //把渲染的操作放到callback中
          callback(info);
        }, 1000);
      }
    });

  };


  //1.把地址栏中的key放到input中
  var key = getSearch("key");
  $(".lt_search input").val(key);

  mui.init({

    //配置下拉刷新和上拉加载的
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true,
        callback: function () {
          page = 1;
          render(function (info) {

            //渲染数据
            $(".product").html(template("tpl", info));

            //结束下拉刷新
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

            //重置上拉加载
            mui(".mui-scroll-wrapper").pullRefresh().refresh(true);

          });
        }
      },
      up: {
        callback: function () {
          //要加载下一页的数据，并且
          page++;
          render(function (info) {
            //渲染数据
            //结束下拉刷新
            if (info.data.length > 0) {
              $(".product").append(template("tpl", info));
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(false);
            } else {
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            }

          })

        }
      }
    }
  });


  //功能二：点击搜索按钮，需要渲染一次， 用户修改了proName
  $(".lt_search button").on("click", function () {
    //先把所有的排序全干掉
    $(".lt_sort a").removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");


    //让容器下拉刷新一次即可。
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

    //想要把此次的搜索记录存储起来
    var value = $(".lt_search input").val();
    var arr = JSON.parse(localStorage.getItem("search_list") || '[]');

    var index = arr.indexOf(value);
    if (index != -1) {
      arr.splice(index, 1);
    }

    if (arr.length >= 10) {
      arr.pop();
    }

    arr.unshift(value);

    localStorage.setItem("search_list", JSON.stringify(arr));

  });


  //功能三：点击排序的时候，需要渲染一次（需要传递更多的参数）
  //1. 给lt_sort下的a注册点击事件
  $(".lt_sort a[data-type]").on("tap", function () {

    var $this = $(this);

    if ($this.hasClass("now")) {
      //切换箭头
      $this.find("span").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    } else {
      $this.addClass("now").siblings().removeClass("now");
      //把所有的箭头都向下
      $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    }
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  });

});
