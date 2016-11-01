/**
 * Created by jun on 2016/10/29.
 */
//Ajax方法
function ajax(url,data,method,success,error) {
    var req;
    if(window.XMLHttpRequest){
        req=new XMLHttpRequest();
        if(req.overrideMimeType){
            req.overrideMimeType("text/xml");
        }
    }else if(window.ActiveXObject){
        var activeName=[
            "MSXML2.XMLHTP",
            "Microsoft.XMLHTTP"
        ];
        for(var i=0,len=activeName.length;i<len;i++){
            try {
                req=new ActiveXObject(activeName[i]);
                break;
            }catch (e){

            }
        }
    }

    var resA='';
    data=data||{};
    method=method||'get';
    success=success||function () {};
    error=error||function (f) {
            alert(url+"发生错误！");
        };

    //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调
    req.onreadystatechange=function () {
        if(req.readyState==4){
            if(req.status>=200&&status<300 ||req.status==304||req.status==0){
                success&&success(req.responseText);
            }else {
                error&&error(req.status);
            }
        }
    };

    if(data){
        var res=[];
        for (var i in data){
            res.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]));
        }
        resA=res.join("&");

    }

    if(method=='get'){
        if(data){
            url+='?'+resA;
        }
        req.open(method,url,true);
        req.send(null);
    }

    if(method=='post'){
        req.setRequestHeader("content-type","application/x-www-form-urlencoded");
        req.open(method,url,true);
        req.send(resA);

    }

}

// 给element绑定一个针对event事件的响应，响应函数为listener
function addFunc(ele,event,listener) {
    if(ele.addEventListener){
        ele.addEventListener(event,listener,false);
    }else if(ele.attachEvent){
        ele.attachEvent('on'+event,listener);
    }else {
        ele['on'+event]=listener;
    }
}

// 判断element是否有className
function hasClass(ele,className) {
    var list=ele.className.split(/\s+/);//\s+ 表示n个空格
    for(var i=0,len=list.length;i<len;i++){
        if(list[i]==className){
            return true;
        }
    }
    return false;
}


// 为element增加一个className

function addClass(ele,className) {
    var list=ele.className.split(/\s+/);
    if(!list[0]){ //如果不存在className
        ele.className=className;
    }else {
        ele.className+=" "+className;
    }
}


//移除element的className
function removeClass(ele,className) {
    var list=ele.className.split(/\s+/);
    if(!list[0])return;
    for(var i=0,len=list.length;i<len;i++){
        if(list[i]==className){
            list.splice(i,1);
            ele.className=list.join(" ");
        }
    }

}


// 设置cookie
function setCookie(name,value,days) {
    var cookie=encodeURIComponent(name)+'+'+encodeURIComponent(value);
    var exp=new Date();
    exp.setTime(exp.getTime()+days*24*60*60*1000);
    cookie+='; expires='+exp.toGMTString();
    document.cookie=cookie;
}
//获取cookie的值
function getCookie() {
    var cookie={};
    var all=document.cookie;
    if(all==='')return cookie;
    var list=all.split(';');
    for (var i=0,len=list.length;i<len;i++){
        var item=list[i];
        var p=item.indexOf('=');
        var name=item.substring(0,p);
        name=decodeURIComponent(name);
        var value=item.substring(p+1);
        value=decodeURIComponent(value);
        cookie[name] = value;
    }
    console.log("Cookie:");
    console.log(cookie);
    return cookie;
}

//通过class获取节点
function getElementByClassName(className) {
    var classArr=[];
    var tags=document.getElementsByTagName('*');
    for(var i=0,len=tags.length;i<len;i++){
        if(tags[i].nodeType==1){
            if(tags[i].getAttribute('class')==className){
                classArr.push(tags[i]);
            }
        }
    }
    return classArr;
}


//addLoadEvent函数
function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof window.onload != 'function'){
        window.onload=func;
    }else {
        window.onload=function () {
            oldonload();
            func();
        }
    }
}
