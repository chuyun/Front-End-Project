/**
 * Created by jun on 2016/11/13.
 */
define(['decoder','exports'],function (decoder,exports) {

    var qrcode = {};
    qrcode.imagedata = null;
    qrcode.width = 0;
    qrcode.height = 0;
    qrcode.qrCodeSymbol = null;
    qrcode.debug = false;
    qrcode.maxImgSize = 1024*1024;

    qrcode.sizeOfDataLengthInfo =  [  [ 10, 9, 8, 8 ],  [ 12, 11, 16, 10 ],  [ 14, 13, 16, 12 ] ];

    qrcode.error=qrcode.success=qrcode.callback = null;

    qrcode.decode = function (src) {

        if (arguments.length == 0) {
            var ok = 0;
            try {
                var canvas_qr = document.getElementById("qr-canvas");
                var context = canvas_qr.getContext('2d');
                qrcode.width = canvas_qr.width;
                qrcode.height = canvas_qr.height;
                qrcode.imagedata = context.getImageData(0, 0, qrcode.width, qrcode.height);
                qrcode.result = qrcode.process(context);
                ok = 1;
                if (qrcode.success) qrcode.success(qrcode.result);
            } catch (ex) {
                qrcode.result = ex.ToString();
                if (qrcode.error) qrcode.error(qrcode.result);
            }
            if (qrcode.callback != null)
                qrcode.callback(qrcode.result, ok);
            return qrcode.result;
        }
        else {
            var image = new Image();
            image.onload = function () {
                var canvas_qr = document.createElement('canvas');
                var context = canvas_qr.getContext('2d');
                var nheight = image.height;
                var nwidth = image.width;
                if (image.width * image.height > qrcode.maxImgSize) {
                    var ir = image.width / image.height;
                    nheight = Math.sqrt(qrcode.maxImgSize / ir);
                    nwidth = ir * nheight;
                }

                canvas_qr.width = nwidth;
                canvas_qr.height = nheight;

                context.drawImage(image, 0, 0, canvas_qr.width, canvas_qr.height);
                qrcode.width = canvas_qr.width;
                qrcode.height = canvas_qr.height;
                try {
                    qrcode.imagedata = context.getImageData(0, 0, canvas_qr.width, canvas_qr.height);
                } catch (e) {
                    qrcode.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!";
                    if (qrcode.callback != null) qrcode.callback(qrcode.result, 0);
                    if (qrcode.error) qrcode.error(qrcode.result);
                    return;
                }
                var ok = 0;
                try {
                    qrcode.result = qrcode.process(context);
                    if (qrcode.success) qrcode.success(qrcode.result);
                    ok = 1;
                }
                catch (e) {
                    qrcode.result = "error decoding QR Code";
                    if (qrcode.error) qrcode.error(qrcode.result);
                }
                if (qrcode.callback != null)
                    qrcode.callback(qrcode.result, ok);
            };
            image.src = src;
        }
    };

    qrcode.isUrl = function(s)
    {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
    };

    qrcode.decode_url = function (s)
    {
        var escaped = "";
        try{
            // escaped = escape( s );
            escaped=decodeURI(s);
        }
        catch(e)
        {
            escaped = s;
        }
        var ret = "";
        try{
            ret = decodeURIComponent( escaped );
        }
        catch(e)
        {
            ret = escaped;
        }
        return ret;
    };

    qrcode.decode_utf8 = function ( s )
    {
        if(qrcode.isUrl(s))
            return qrcode.decode_url(s);
        else
            return s;
    };

    qrcode.process = function (ctx) {


        var image = qrcode.grayScaleToBitmap(qrcode.grayscale());

        var detector = new Detector(image);

        var qRCodeMatrix = detector.detect();


        var reader = decoder.Decoder.decode(qRCodeMatrix.bits);
        var data = reader.DataByte;
        var str = "";
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++)
                str += String.fromCharCode(data[i][j]);
        }
        return qrcode.decode_utf8(str);
    };

    qrcode.getPixel = function(x,y){
        if (qrcode.width < x) {
            throw "point error";
        }
        if (qrcode.height < y) {
            throw "point error";
        }
         var point = (x * 4) + (y * qrcode.width * 4);
         var p = (qrcode.imagedata.data[point]*33 + qrcode.imagedata.data[point + 1]*34 + qrcode.imagedata.data[point + 2]*33)/100;
        return p;
    };

    qrcode.binarize = function(th){
        var ret = new Array(qrcode.width*qrcode.height);
        for (var y = 0; y < qrcode.height; y++)
        {
            for (var x = 0; x < qrcode.width; x++)
            {
                var gray = qrcode.getPixel(x, y);

                ret[x+y*qrcode.width] = gray<=th?true:false;
            }
        }
        return ret;
    };

    qrcode.getMiddleBrightnessPerArea=function(image)
    {
        var numSqrtArea = 4;
        //obtain middle brightness((min + max) / 2) per area
        var areaWidth = Math.floor(qrcode.width / numSqrtArea);
        var areaHeight = Math.floor(qrcode.height / numSqrtArea);
        var minmax = new Array(numSqrtArea);
        for (var i = 0; i < numSqrtArea; i++)
        {
            minmax[i] = new Array(numSqrtArea);
            for (var i2 = 0; i2 < numSqrtArea; i2++)
            {
                minmax[i][i2] = [0,0];
            }
        }
        for (var ay = 0; ay < numSqrtArea; ay++)
        {
            for (var ax = 0; ax < numSqrtArea; ax++)
            {
                minmax[ax][ay][0] = 0xFF;
                for (var dy = 0; dy < areaHeight; dy++)
                {
                    for (var dx = 0; dx < areaWidth; dx++)
                    {
                        var target = image[areaWidth * ax + dx+(areaHeight * ay + dy)*qrcode.width];
                        if (target < minmax[ax][ay][0])
                            minmax[ax][ay][0] = target;
                        if (target > minmax[ax][ay][1])
                            minmax[ax][ay][1] = target;
                    }
                }
                //minmax[ax][ay][0] = (minmax[ax][ay][0] + minmax[ax][ay][1]) / 2;
            }
        }
        var middle = new Array(numSqrtArea);
        for (var i3 = 0; i3 < numSqrtArea; i3++)
        {
            middle[i3] = new Array(numSqrtArea);
        }
        for (var ay = 0; ay < numSqrtArea; ay++)
        {
            for (var ax = 0; ax < numSqrtArea; ax++)
            {
                middle[ax][ay] = Math.floor((minmax[ax][ay][0] + minmax[ax][ay][1]) / 2);
            }
        }

        return middle;
    };

    qrcode.grayScaleToBitmap=function(grayScale)
    {
        var middle = qrcode.getMiddleBrightnessPerArea(grayScale);
        var sqrtNumArea = middle.length;
        var areaWidth = Math.floor(qrcode.width / sqrtNumArea);
        var areaHeight = Math.floor(qrcode.height / sqrtNumArea);
        var bitmap = new Array(qrcode.height*qrcode.width);

        for (var ay = 0; ay < sqrtNumArea; ay++)
        {
            for (var ax = 0; ax < sqrtNumArea; ax++)
            {
                for (var dy = 0; dy < areaHeight; dy++)
                {
                    for (var dx = 0; dx < areaWidth; dx++)
                    {
                        bitmap[areaWidth * ax + dx+ (areaHeight * ay + dy)*qrcode.width] = (grayScale[areaWidth * ax + dx+ (areaHeight * ay + dy)*qrcode.width] < middle[ax][ay])?true:false;
                    }
                }
            }
        }
        return bitmap;
    };

    qrcode.grayscale = function(){
        var ret = new Array(qrcode.width*qrcode.height);
        for (var y = 0; y < qrcode.height; y++)
        {
            for (var x = 0; x < qrcode.width; x++)
            {
                var gray = qrcode.getPixel(x, y);

                ret[x+y*qrcode.width] = gray;
            }
        }
        return ret;
    };




    function URShift( number,  bits)
    {
        if (number >= 0)
            return number >> bits;
        else
            return (number >> bits) + (2 << ~bits);
    }


    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };




    exports.qrcode=qrcode;
    exports.URShift=URShift;

    // return qrcode;

});