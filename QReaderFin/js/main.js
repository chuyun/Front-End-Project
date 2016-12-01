/**
 * Created by jun on 2016/11/12.
 */
// 简单的配置
require.config({

    // RequireJS 通过一个相对的路径 baseUrl来加载所有代码。baseUrl通常被设置成data-main属性指定脚本的同级目录。
    baseUrl: "js/libs"

});

// 开始使用jQuery 模块
require(['qrcode'],function ( qrcode) {
//这里直接可以使用jquery的方法，比如：$( "#result" ).html( "Hello World!" );


    var dropArea = document.getElementById('drop-area-canvas');

    var gCtx = null;
    var gCanvas = null;

    var imageData = null;
    var ii=0;
    var jj=0;
    var c=0;


    function dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    function dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        var dt = e.dataTransfer;
        var files = dt.files;
        handleFiles(files);
    }
    function handleFiles(f) {
        var o = [];
        for (var i = 0; i < f.length; i++) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    qrcode.qrcode.decode(e.target.result);
                };
            })(f[i]);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f[i]);
        }
    }
    (function load() {
        initCanvas(200, 200);
        qrcode.qrcode.success = function (d) {
//            alert('javascript读出的二维码信息为：' + utf8ToUtf16(d));
//

        };
        qrcode.qrcode.error = function (d) {
            alert('读取二维码信息错误：' + utf8ToUtf16(d))
        };
        qrcode.qrcode.callback = function (d, status) {
            alert('读取二维码信息' + (status == 1 ? '成功' : '失败') + '：'+
                '\n'+'二维码信息为：' + utf8ToUtf16(d));
//            window.clipboardData.setData("Text", utf8ToUtf16(d));
//                    alert(utf8ToUtf16(d));
            var decodeURL=utf8ToUtf16(d);
//
//              判断是不是URL
            var strRegex = "^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$";
            var re = new RegExp(strRegex);

            if(re.test(decodeURL)){
                window.open(decodeURL);
            }else {
//                alert('not url');
            }

        };
        qrcode.qrcode.decode("meqrthumb.png");
    })();

    function initCanvas(ww, hh) {
        gCanvas = document.getElementById("drop-area-canvas");
        gCanvas.addEventListener("dragenter", dragenter, false);
        gCanvas.addEventListener("dragover", dragover, false);
        gCanvas.addEventListener("drop", drop, false);
        var w = ww;
        var h = hh;
        gCanvas.style.width = w + "px";
        gCanvas.style.height = h + "px";
        gCanvas.width = w;
        gCanvas.height = h;
        gCtx = gCanvas.getContext("2d");
        gCtx.clearRect(0, 0, w, h);
        imageData = gCtx.getImageData(0, 0, 100, 100);
    }

    function utf8ToUtf16(s) {//将utf-8字符串转码为unicode字符串，要不读取的二维码信息包含中文会乱码
        if (!s) {
            return;
        }

        var i, codes, bytes, ret = [], len = s.length;
        for (i = 0; i < len; i++) {
            codes = [];
            codes.push(s.charCodeAt(i));
            if (((codes[0] >> 7) & 0xff) == 0x0) {
                //单字节  0xxxxxxx
                ret.push(s.charAt(i));
            } else if (((codes[0] >> 5) & 0xff) == 0x6) {
                //双字节  110xxxxx 10xxxxxx
                codes.push(s.charCodeAt(++i));
                bytes = [];
                bytes.push(codes[0] & 0x1f);
                bytes.push(codes[1] & 0x3f);
                ret.push(String.fromCharCode((bytes[0] << 6) | bytes[1]));
            } else if (((codes[0] >> 4) & 0xff) == 0xe) {
                //三字节  1110xxxx 10xxxxxx 10xxxxxx
                codes.push(s.charCodeAt(++i));
                codes.push(s.charCodeAt(++i));
                bytes = [];
                bytes.push((codes[0] << 4) | ((codes[1] >> 2) & 0xf));
                bytes.push(((codes[1] & 0x3) << 6) | (codes[2] & 0x3f));
                ret.push(String.fromCharCode((bytes[0] << 8) | bytes[1]));
            }
        }
        return ret.join('');
    }





});