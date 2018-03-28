//input标签的改变事件
function BindHeadChange() {
    $("[name=headImg]").change(function() {
        /*        if (navigator.userAgent.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 9.0") > 0) { //ie8不能再js提交表单，再页面显示一个提交按钮
                    $("#submitForm").show();
                } else {
                    $("#imgForm").submit();
                    document.getElementById("imgForm").submit();
                    //把修改后的头像保存到Jd.oStorage()里面
                    //GB.Ajax({
                    //    url: CtrlHead + "/customer/security/GetUserInfomation",
                    //    ok: function (json) {
                    //        var map_id = json.data.user_info[0].head_image_server_map_listID;
                    //        var subPath = json.data.user_info[0].head_image_webSubPath;
                    //        var user = GB.jsonDeserialization(GB.oStorage().getItem("jd_user"));
                    //        user.user_info[0].head_image_server_map_listID = map_id;
                    //        user.user_info[0].head_image_webSubPath = subPath;
                    //        GB.oStorage().setItem("jd_user", GB.jsonSerializable(user)); //重新写入Jd.oStorage()

                    //        var imgDOM = $("#headImg");
                    //        imgDOM.attr("src", GB.SrcPath(map_id, subPath));
                    //    }
                    //});
                }*/
        fnImgClip();
    });
}

//图片裁剪面板
function fnImgClip() {
    var imgClipPanel = $("#clipImgPanel"),
        mask = $(".mask");
    mask.show();
    imgClipPanel.show();
    var selectRectX,
        selectRectY;

    var imgChange = $("#imgChange");
    var mskCanvas = $("#canvasMask")[0],
        mskCtx = mskCanvas.getContext("2d");

    var temCan = document.createElement("canvas");
    var temCtx = temCan.getContext("2d");
    var preViewCtx, newWidth, newHeight;
    if (imgClipPanel.attr("isInit")) {
        return;
    }
    imgClipPanel.attr("isInit", "true");
    //处理IE10安全限制
    if (navigator.userAgent.indexOf("MSIE") > -1) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var url = URL.createObjectURL(this.response);
            $("#imgChange").attr("src", url);
            URL.revokeObjectURL(url);
        };
        xhr.open("GET", $("#headImg").attr("src"), true);
        xhr.responseType = 'blob';
        xhr.send();
    } else {

        $("#imgChange").attr("src", $("#headImg").attr("src"));
    }


    $("#imgChange")[0].onload = function() {
        var width = imgChange.width(),
            height = imgChange.height();
        newWidth = width > height ? 250 : 250 * (width / height);
        newHeight = height > width ? 250 : 250 * (height / width);
        temCan.width = newWidth;
        temCan.height = newHeight;
        $(".operArea").css("width", newWidth).css("height", newHeight);
        imgChange.css("width", newWidth).css("height", newHeight);
        $(".clipImgPanel").css("height", 200 + newHeight);
        mskCanvas.width = newWidth;
        mskCanvas.height = newHeight;
        temCtx.drawImage(document.getElementById("imgChange"), 0, 0, newWidth, newHeight);

        mskCtx.globalAlpha = 0.8;
        mskCtx.fillStyle = 'black';
        mskCtx.fillRect(0, 0, 300, 300);
        mskCtx.globalCompositeOperation = 'xor';
        mskCtx.globalAlpha = 1;
        mskCtx.fillRect(selectRectX = (newWidth - 150) / 2, selectRectY = (newHeight - 150) / 2, 150, 150);

        //预览图片框的初始化

        var temImageData = temCtx.getImageData(selectRectX, selectRectY, 150, 150);
        preViewCtx = document.getElementById("imgPreView").getContext("2d");
        preViewCtx.putImageData(temImageData, 0, 0, 0, 0, 200, 200);
    };
    $(".title .closeBtn").on("click", function() {
        imgClipPanel.hide();
        mask.hide();
    });
    $("#chooseImg").on("change", function() {
        var fileReader = new FileReader(),
            imgReg = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        fileReader.onload = function(fileReaderEvent) {
            $("#imgChange").css("width", "auto").css("height", "auto").attr("src", fileReaderEvent.target.result);
        };
        var fileArr = $(this)[0].files;
        if (!fileArr.length) {
            return;
        }
        if (!imgReg.test(fileArr[0].type)) {
            GB.Alert("只能选择图片类型！");
            return;
        }
        fileReader.readAsDataURL(fileArr[0]);
    });

    //选择框移动
    var mouseStartX, mouseStartY, moveDisX, moveDisY, temX, temY, isDrag = false;
    $(mskCanvas).on("mousedown", function(e) {
        isDrag = true;
        mouseStartX = e.pageX;
        mouseStartY = e.pageY;
    });
    $(mskCanvas).on("mousemove", function(e) {
        if (isDrag) {
            moveDisX = e.pageX - mouseStartX;
            moveDisY = e.pageY - mouseStartY;
            mskCtx.globalAlpha = 0.8;
            mskCtx.globalCompositeOperation = 'copy';
            mskCtx.fillRect(0, 0, 300, 300);
            mskCtx.globalCompositeOperation = 'xor';
            mskCtx.globalAlpha = 1;
            temX = (selectRectX + moveDisX > newWidth - 150 ? newWidth - 150 : selectRectX + moveDisX < 0 ? 0 : selectRectX + moveDisX);
            temY = (selectRectY + moveDisY > newHeight - 150 ? newHeight - 150 : selectRectY + moveDisY < 0 ? 0 : selectRectY + moveDisY);
            mskCtx.fillRect(temX, temY, 150, 150);

            var newImageData = temCtx.getImageData(temX, temY, 150, 150);
            preViewCtx.putImageData(newImageData, 0, 0, 0, 0, 300, 300);
        }
    });
    $(mskCanvas).on("mouseup", function(e) {
        isDrag = false;
        selectRectX = (selectRectX + moveDisX > newWidth - 150 ? newWidth - 150 : selectRectX + moveDisX < 0 ? 0 : selectRectX + moveDisX);
        selectRectY = (selectRectY + moveDisY > newHeight - 150 ? newHeight - 150 : selectRectY + moveDisY < 0 ? 0 : selectRectY + moveDisY);
    });
    $(mskCanvas).on("mouseout", function(e) {
        isDrag = false;
    });
    //选择本地照片
    $("#localPictureBtn").on("click", function() {
        $("#chooseImg").click();
    });
    //取消裁剪
    $("#clipCancel").on("click", function() {
        $("#clipImgPanel").hide();
        $(".mask").hide();
    });
    //确定裁剪并上传
    $("#clipConfirm").on("click", function() {
        var confirmCanvas = document.getElementById("imgPreView");
        confirmCanvas.toBlob(function(blob) {
            var newForm = new FormData(document.getElementById("imgForm"));
            var imgFile = document.getElementById("chooseImg");
            newForm.set("headImg", blob, imgFile.files[0].name);
            var request = new XMLHttpRequest();
            request.open("POST", "http://controller.xiaohuangdou.com/customer/security/SetUserHeadImg?name=chenchen");
            request.withCredentials = true;
            request.send(newForm);
            /*            if (navigator.userAgent.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 9.0") > 0) { //ie8不能再js提交表单，再页面显示一个提交按钮
                            $("#submitForm").show();
                        } else {
                            $("#imgForm").submit();
                            document.getElementById("imgForm").submit();
                            //把修改后的头像保存到Jd.oStorage()里面
                            //GB.Ajax({
                            //    url: CtrlHead + "/customer/security/GetUserInfomation",
                            //    ok: function (json) {
                            //        var map_id = json.data.user_info[0].head_image_server_map_listID;
                            //        var subPath = json.data.user_info[0].head_image_webSubPath;
                            //        var user = GB.jsonDeserialization(GB.oStorage().getItem("jd_user"));
                            //        user.user_info[0].head_image_server_map_listID = map_id;
                            //        user.user_info[0].head_image_webSubPath = subPath;
                            //        GB.oStorage().setItem("jd_user", GB.jsonSerializable(user)); //重新写入Jd.oStorage()

                            //        var imgDOM = $("#headImg");
                            //        imgDOM.attr("src", GB.SrcPath(map_id, subPath));
                            //    }
                            //});
                        }*/
        });

    });
}

function fnEventBind() {
    $("#imgUpload").on("click", function() {
        fnImgClip();
    });
}

