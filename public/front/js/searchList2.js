/*
* @Author: admin
* @Date:   2018-03-07 16:34:17
* @Last Modified by:   admin
* @Last Modified time: 2018-03-07 17:00:07
*/
$(function () {
	var render = function () {
		$(".product").html('<div class="loading"></div>');
		//1.发送ajax
		//2.模板渲染
		var obj = {};
		obj.page = 1;
		obj.pageSize = 10;
		obj.proName =  $(".lt_search input").val();

		//处理price与num， 如果lt_sort下有now这个类，就传排序字段，否则不传
		//如果确定值：1 升序   2 降序
    var temp = $(".lt_sort a.now");
    if(temp.length > 0) {
      //说明需要排序,获取到了排序的名字
      var sortName = temp.data("type");
      //根据箭头来确定传递的具体的值，判断temp下的span是否有fa-angle-down这个类
      var sortValue = temp.find("span").hasClass("fa-angle-down")? 2 : 1;
      //把sortName与sortValue添加给param
			param[sortName] = sortValue;
    }else {
			console.log('不需要传递排序参数');
		}

		$.ajax({
			type:'get',
			url:'/product/queryProduct',
			data: obj,
			success:function (info) {
				setTimeout(function () {
					console.log(info);
					$(".product").html(template("tempproduct", info));
				}, 1000);
			}
		});
	};

	//功能一：页面一进来，需要渲染一次， proName来自于input框
	var key = getSearch("key");
	$(".lt_search input").val(key);
	render();

	//功能二：点击搜索按钮，需要渲染一次， 用户修改了proName
	$(".lt_search button").on("click", function () {
		//先把所有的排序全干掉
		$(".lt_sort a").removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");

		render();

		//想要把此次的搜索记录存储起来
		var value = $(".lt_search input").val();
		var arr = JSON.parse(localStorage.getItem("search_list") || '[]');

		var index = arr.indexOf(value);
		if(index != -1) {
			arr.splice(index, 1);//删除元素位置，元素个数
		}
		if(arr.length >= 10) {
			arr.pop();//取出数组中的最后一项
		}
		arr.unshift(value);//在数组最前面插入项
		localStorage.setItem("search_list", JSON.stringify(arr))
	});

	//功能三：点击排序的时候，需要渲染一次（需要传递更多的参 数）
	//1. 给lt_sort下的a注册点击事件
	$(".lt_sort a[data-type]").on("click", function () {
		var $this = $(this);
		
		if($this.hasClass("now")) {
			//切换箭头
			$this.find("span").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
		}else {
			$this.addClass("now").siblings().removeClass("now");
			//把所有的箭头都向下
			$("lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
		}

		render();
	});
})