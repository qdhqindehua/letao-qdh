/**
 * Created by HUCC on 2018/3/5.
 */
$(function () {

  //列表渲染以及分页
  var page = 1;
  var pageSize = 5;
  var result = [];//数组用于存储上传成功的图片的地址

  var render = function () {
    $.ajax({
      type: 'get',
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        $("tbody").html(template("tpl", info));

        //渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size:"normal",

          //itemTexts这个回调函数会给每一个按钮都执行一次，返回值就是每一个按钮显示的内容
          //type:指每个按钮的类型   首页-first  上一页-prev  页码-page  下一页-next 最后一个-last
          //page:指的是每个按钮对应的页码值
          itemTexts: function (type, page, current) {


            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default:
                return "第"+page+"页";
            }
          },
          tooltipTitles: function (type, page, current) {
            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default:
                return "第"+page+"页";
            }
          },
          useBootstrapTooltip:true,
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });

      }
    });
  };

  render();


  //添加商品
  $(".btn_add").on("click", function () {

    $("#productModal").modal("show");

    //发送ajax，渲染二级分类的数据
    $.ajax({
      type:'get',
      url:"/category/querySecondCategoryPaging",
      data: {
        page:1,
        pageSize:100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html( template("tpl2", info) );
      }
    })

  });


  //2. 给dropdown-menu下的a注册事件
  $(".dropdown-menu").on("click", "a", function () {

    //1. 设置按钮的内容
    $(".dropdown_text").text( $(this).text() );

    //2. 设置brandId
    $("[name='brandId']").val( $(this).data("id") );

    //3. 让brandId校验成功
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");

  });


  //3. 初始化图片上传
  $("#fileupload").fileupload({
    dataType:'json',
    done: function (e, data) {

      if(result.length >= 3){
        return;
      }

      //console.log(data.result);
      //1. 获取到上传的图片地址， 往img_box里面添加图片
      var pic = data.result.picAddr;

      //没用过？？？？？
      //$('<img src="'+pic+'" width="100" height="100" alt="">').appendTo(".img_box");
      $(".img_box").append('<img src="'+pic+'" width="100" height="100" alt="">');


      //将结果保存到数组中
      result.push(data.result);

      //可以根据数组的长度来判断上传了几张图片
      //console.log(result);
      if(result.length === 3) {
        //让某个字段校验成功
        $("form").data("bootstrapValidator").updateStatus("productLogo", "VALID");
      }else {
        //让某个字段校验失败
        $("form").data("bootstrapValidator").updateStatus("productLogo", "INVALID");
      }

    }
  })


  //4. 表单校验
  var $form = $("form");
  $form.bootstrapValidator({
    //让隐藏的也校验
    excluded:[],
    //配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置校验规则
    fields:{

      brandId:{
        validators:{
          notEmpty:{
            message:"请选择品牌"
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"请输入商品描述"
          }
        }
      },
      num:{
        validators:{
          //非空
          notEmpty:{
            message:"请输入商品库存"
          },
          //必须是非零开头的数字
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:"请输入一个有效的商品库存"
          }
        }
      },
      size:{
        validators:{
          //非空
          notEmpty:{
            message:"请输入商品尺码"
          },
          //要求：2位数字-2位数字
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"请输入一个合法的尺码（例如32-44）"
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"请输入商品原价"
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"请输入商品价格"
          }
        }
      },
      productLogo: {
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      }

    }
  });


  //5. 给表单注册一个校验成功的事件
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();

    var param = $form.serialize();

    param += "&picName1="+result[0].picName + "&picAddr1="+result[0].picAddr;
    param += "&picName2="+result[1].picName + "&picAddr2="+result[1].picAddr;
    param += "&picName3="+result[2].picName + "&picAddr3="+result[2].picAddr;

    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data: param,
      success:function (info) {
        if(info.success) {
          //1. 关闭模态框
          $("#productModal").modal('hide');
          //2. 重新渲染第一页
          page = 1;
          render();

          //3. 重置样式
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown_text").text("请选择二级分类");
          $(".img_box img").remove();

          result = [];
        }
      }
    })
  });

});