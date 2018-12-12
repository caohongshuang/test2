(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
        $.post(
            this.action,
            $(this).serialize(),
            function (data) {
                if (data.code !== 0) {
                    $(".help-block").text("");
                    for (var property in data.data) {
                        if (data.data.hasOwnProperty(property)) {
                            $('#alert-' + property).text(data.data[property]);
                        }
                    }
                }
                else {
                    location.href = location.origin + location.pathname + '/success';
                }
            });
    });
})();


(function () {
        var ticketUrl = jsTicketApi + "?url=" + encodeURIComponent(pageUrl);
        var selectedLocalId = "";
        var selectedServerId = "";
        var scanLoading;

        $().ready(function () {
            mainLoading.hide();
        });
        $.ajax({
            type: "GET",
            url: ticketUrl,
            success: function (res) {
                var data = res.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: [
                        'checkJsApi',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'closeWindow',
                        'scanQRCode',
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            },
            error: function (err) {
                weui.topTips('jsticket fail', 3000);
            }
        });

        $('#chooseFromCamera').on("click", function () {
            chooseImage(["camera"]);
        });

        $('#chooseFromAlbum').on("click", function () {
            chooseImage(["camera", "album"]);
        });

        $("#resetImage").on("click", function () {
            showChooseImage();
        });

        $("#submitImage").on("click", function () {
            if (selectedLocalId) {
                uploadImage(selectedLocalId);
            }
        });

        function showChooseImage() {
            $("#previewContainer").hide();
            $("#chooseContainer").show();
        }

        function showPreview() {
            $("#chooseContainer").hide();
            $("#previewContainer").show();
        }

        function chooseImage(sourceType) {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: sourceType || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    console.log(res);
                    var localId = res.localIds[0];
                    selectedLocalId = localId;
                    //uploadImage(res.localIds[0]);
                    getLocalImgData(localId);
                    showPreview();
                }
            });
        }

        function uploadImage(localId) {
            wx.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    selectedServerId = res.serverId;
                    scanMedia(res.serverId);
                }

            })
        }

        function scanMedia(mediaId) {
            var data = {openId: openId, unionId: unionId, mediaId: mediaId};
            $.ajax({
                type: "POST",
                url: scanMediaApi,
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function (res) {
                    hideScanLoading();
                    var data = res.data;
                    if (!data) {
                        weui.topTips('不能识别该名片，请重试', 3000);
                    }
                    if (data && data === 1) {
                        location.href = location.origin + location.pathname + '/cardRegistered' + redirectParams;
                    }
                    if (data && data === 2) {
                        location.href = location.origin + location.pathname + '/success';
                    }
                    if (data && data === 3) {
                        location.href = location.origin + location.pathname + '/cardSuccess' + redirectParams;
                    }
                },
                error: function (err) {
                    hideScanLoading();
                    weui.toast('名片识别失败', 3000);
                }

            });
            showScanLoading();
        }

        function showScanLoading() {
            scanLoading = weui.loading('名片识别中...');
            scanLoading.show();
        }

        function hideScanLoading() {
            if (scanLoading) {
                scanLoading.hide();
            }
        }

        function getLocalImgData(localId) {
            wx.getLocalImgData({
                localId: localId, // 图片的localID
                success: function (res) {
                    var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    var imageData = "data:image/png;base64," + localData;
                    if (isAndroid()) {
                        $("#cardImg").attr("src", imageData);
                    }
                    if (isIos()) {
                        $("#cardImg").attr("src", localData);
                    }
                }
            });
        }


        function isAndroid() {
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            return isAndroid;
        }

        function isIos() {
            var u = navigator.userAgent, app = navigator.appVersion;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            return isIOS;
        }
    }

)();

