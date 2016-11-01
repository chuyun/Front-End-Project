/**
 * Created by jun on 2016/10/28.
 */

/*Message*/
//添加tipClose函数，并设置cookie
function closeTip() {
    var tipClose=document.getElementById('tip-close');
    addFunc(tipClose,'click',function () {
        hideTip();
        setCookie('tipCookie','tipCookieValue',30);
    });

}

addLoadEvent(closeTip);

//加载页面前检查Cookie
function checkCookie() {
    if(getCookie().tipCookie){
        console.log(getCookie().tipCookie);
        hideTip();
    }

    if((getCookie().loginSuccess)&&(getCookie().followSuccess)){
        console.log(getCookie().loginSuccess);
        console.log(getCookie().followSuccess);

        hideFollow();
        showFollowSuccess();
    }
}

addFunc(window,'unbeforeunload',checkCookie());
//隐藏Tip函数
function hideTip() {
    var tip=document.getElementById('tip');
        tip.style.display='none';
    var message=document.getElementsByClassName('prompt-message')[0];
    message.style.display="none";
}


//head

//关注，登录
function login() {
//    为关注按钮添加点击事件
    var follow=document.getElementById('follow');
    addFunc(follow,'click',function () {
        //先判断登陆的loginCookie是否已设置
        if(!getCookie().loginSuccess){
            // 登陆cookie未设置，弹出登陆弹窗
            showLoginPop();
            // 为登陆弹窗的关闭按钮添加点击事件，点击后关闭登陆弹窗
            var loginclose=document.getElementById('login-close');
            //点击事件
            addFunc(loginclose,'click',function () {
                // ajax请求登陆
                if(validate()){
                //    ajax登陆
                    //noinspection JSUndeclaredVariable,JSUndeclaredVariable,JSUndeclaredVariable,JSUndeclaredVariable
                    ajax(
                        url='http://study.163.com/webDev/login.htm',
                        data={
                            userName:md5("studyOnline"),
                            password:md5("study.163.com")
                         },
                        method='get',
                        success=function (res) {
                            // alert("登陆API的返回：" + res);
                            // ajax请求得到的status为0，网上搜索有的说是跨域问题
                            if(res==1){
                                //登陆成功，则设置loginSuc cookie
                                closeLoginPop();
                                setCookie("loginSuccess","loginSUccessValue",30);
                                console.log(getCookie().loginSuccess);

                                //noinspection JSUndeclaredVariable,JSUndeclaredVariable,JSUndeclaredVariable
                                ajax(
                                    url='http://study.163.com/webDev/ attention.htm',
                                    method='get',
                                    success=function (res) {
                                        alert("关注："+res);
                                        if(res==1){
                                            //隐藏关注按钮，显示已关注按钮，设置cookie
                                            hideFollow();
                                            showFollowSuccess();
                                            setCookie('followSuccess','followSuccessValue',30);

                                        }
                                    }
                                )
                            }
                    },
                        error=function () {
                            alert("登陆错误，请重新登陆")
                        }
                    )
                }
            });
        }else {
            // 若已设置loginSuc cookie，调用关注API，并设置followSuc cookie
            ajax(
                url='http://study.163.com/webDev/ attention.htm',
                data={},
                method='get',
                success=function () {
                    hideFollow();
                    showFollowSuccess();
                    setCookie('followSuccess','followSuccessValue',30);
                }
            )
        }
    });

    // js表单验证是否输入用户名和密码必填项
    function validate() {
    //
        var userName=document.getElementById('userName').value,
            password=document.getElementById('password').value;
        if(userName==null || userName==""){
            alert("请输入用户名");
        }
        if(password==null || password==""){
            alert("请输入密码");
        }

        if(userName=='studyOnline'&&password=='study.163.com'){
            return true;
        }else {
            alert('请输入正确的用户名和密码');
        }

    }

//显示登录弹窗
function showLoginPop() {
 // 弹出登陆界面，并遮罩
    document.getElementById('mask').style.display="block";
    document.getElementById('login').style.display="block";
}

// 关闭登陆弹窗
function closeLoginPop() {
    document.getElementById("mask").style.display = "none";
    document.getElementById("login").style.display = "none";
}

//隐藏关注按钮

function hideFollow() {
    var follow=document.getElementById('follow');
    follow.style.display="none";
}

function showFollowSuccess() {
    var followSuccess=document.getElementById('followSuccess');
    followSuccess.style.display='block'
}


}

addLoadEvent(login);


// 轮播
function carousel() {
    var currentIndex=0,//当前控制按钮
        bannerArr=getElementByClassName('banner-list')[0].getElementsByTagName('li'),//图片组
        bannerLen=bannerArr.length,
        indexListArr=document.getElementById('indexList').getElementsByTagName('li');
//    定时器每5秒自动变换一次banner
    //noinspection JSUndeclaredVariable
    autoChange=setInterval(function () {
        if(currentIndex<bannerLen-1){
            currentIndex++;
        }else {
            currentIndex=0;
        }
    //    调用变换处理函数
        changeTo(currentIndex);
    },5000);

//调用控制按钮点击和鼠标悬浮事件处理函数
    addEvent();
    
    function addEvent() {
        for(var i=0;i<bannerLen;i++){
        //    闭包防止作用域内活动对象的影响
            (function (j) {
            //    鼠标点击控制按钮作变换处理
                addFunc(indexListArr[j],'click',function () {
                    changeTo(j);
                    currentIndex=j;
                })
            })(i);
            (function (j) {
                //鼠标悬浮图片上方则清除定时器
                addFunc(bannerArr[j],'mouseover',function () {
                    clearTimeout(autoChange);
                    currentIndex=j;
                });
            //    鼠标划出图片则重置定时器
                addFunc(bannerArr[j],'mouseout',function () {
                    //noinspection JSUndeclaredVariable
                    autoChange=setInterval(function () {
                        if(currentIndex<bannerLen-1){
                            currentIndex++;

                        }else {
                            currentIndex=0;
                        }
                    //    调用变量处理函数
                        changeTo(currentIndex);
                    },5000)
                });
            })(i);

        }
    }

    //变换处理函数
    function changeTo(num) {
        var currentBanner=document.getElementsByClassName('bannerOn')[0];
        fadeOut(currentBanner);
        removeClass(currentBanner,'bannerOn');
        addClass(bannerArr[num],'bannerOn');
        fadeIn(bannerArr[num]);

        //设置banner的控制按钮
        var currentIndexOn=document.getElementsByClassName('indexOn')[0];
        removeClass(currentIndexOn,'indexOn');
        addClass(indexListArr[num],'indexOn');
    }

    //淡入处理函数
    function fadeIn(elem){
        setOpacity(elem,0); //初始全透明
        for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
            (function(){
                var level = i * 5;  //透明度每次变化值
                setTimeout(function(){
                    setOpacity(elem, level)
                },i*25); //i * 25 即为每次改变透明度的时间间隔
            })(i);
        }
    }
    //淡出处理函数
    function fadeOut(elem){
        for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
            (function(){
                var level = 100 - i * 5; //透明度每次变化值
                setTimeout(function(){
                    setOpacity(elem, level)
                },i*25); //i * 25 即为每次改变透明度的时间间隔
            })(i);
        }
    }
    //设置透明度
    function setOpacity(elem,level){
        if(elem.filters){
            elem.style.filter = "alpha(opacity="+level+")";
        }else{
            elem.style.opacity = level / 100;
        }
    }

}

addLoadEvent(carousel);

/*
*内容区
* */
// 右侧
// 机构介绍，点击图片弹出视频弹窗

function videoPlay() {
    var videoImage=document.getElementById('video-image'),
        videoClose=document.getElementById('video-close');

    addFunc(videoImage,'click',function () {
        showVideoPop();
    });
    addFunc(videoClose,'click',function () {
        hideVideoPop();
    });
    
    
    function showVideoPop() {
        document.getElementById('mask').style.display='block';
        document.getElementById('video-pop').style.display='block';
    }
    
    function hideVideoPop() {
        document.getElementById('mask').style.display='none';
        var video=document.getElementById('video');
        video.pause();
        document.getElementById('video-pop').style.display='none';
    }
}

addLoadEvent(videoPlay);


// 热门推荐，从服务器请求数据，默认展示前 10 门课程，隔 5 秒更新一门课程， 实现滚动更新热门课程的效果
function showHotList() {
    var returnData=null,
        elementLi='',
        num=0,
        elementUl=document.getElementById('hotlistul');
    //单个热门课程
    function creatNode(opt) {
        return '<img src="'+opt.smallPhotoUrl+'" alt="'+opt.name+'" class="hotListPic"><div><p class="hotListTitle">'+opt.name+'</p><span class="hotListUserCount">'+opt.learnerCount+'</span></div>';

    }

    ajax(
        url='http://study.163.com/webDev/hotcouresByCategory.htm',
        data={},
        method='get',
        success=function (res) {
            returnData=JSON.parse(res);
            console.log(returnData);
            for(var i=0;i<10;i++){
                elementLi+='<li class="hotListLi">'+creatNode(returnData[i])+'</li>';
                // console.log(elementLi);
            }
            elementUl.innerHTML=elementLi;
        },
        error=function () {
            alert("ERROR");
        }
    );
    // console.log('HDHHJDS');
}

addLoadEvent(showHotList);

// 左侧内容区
function initCourse(pageNo,psize,ptype) {
    var rootDom=document.getElementsByClassName('course');
    // 单个课程和课程详细的浮层一起构造

    function segment(opt) {
        return '<li class="courseLi"><div class="img"><img src="' + opt.middlePhotoUrl + '"></div><div class="title">'
            + opt.name + '</div><div class="orgName">' + opt.provider + '</div><span class="hot">'
            + opt.learnerCount + '</span><div class="discount">¥ <span>' + opt.price + '</span></div>'
            + '<div class="detail-dialog"><div class="uHead"><img src="'
            + opt.middlePhotoUrl + '" class="pic"><div class="uInfo"><h3 class="uTit">'
            + opt.name +'</h3><div class="uHot"><span class="uNum">'
            + opt.learnerCount +'</span>人在学</div><div class="uPub">发布者：<span class="uOri">'
            + opt.provider + '</span></div><div class="uCategory">分类：<span class="uTag">'
            + opt.categoryName + '</span></div></div></div><div class="uIntro">'
            + opt.description + '</div></div></li>';
    }
    //将每页课程写入html
    function courseRender(arr,num) {
        var courseTemple='';
        for (var i=0;i<num;i++){
            courseTemple+=segment(arr[i]);

        }
        console.log("courseTemple:");
        console.log(courseTemple);

        rootDom[0].innerHTML=courseTemple;
    }

//    ajax请求数据

    ajax(
        url='http://study.163.com/webDev/couresByCategory.htm',
        data={
            pageNo:pageNo,
            psize:psize,
            type:ptype

        },
        method='get',
        success=function (res) {
            var result=JSON.parse(res);
            courseRender(result.list,result.pagination.pageSize);
            //页面导航功能
            pagination(result,courseRender,ptype,psize);
            //显示课程详情
            showCourse();
            }
    )
}

//页码导航功能函数
function pagination(data,render,courseType,size) {
    var paginationDom = document.getElementsByClassName('pagination'),
        paginationList = null,
        prevBtn = null,
        nextBtn = null,
        index = 1; // 当前页码

//    页码切换
    function reCourse(n) {
        //noinspection JSUndeclaredVariable,JSUndeclaredVariable
        ajax(
            url='http://study.163.com/webDev/couresByCategory.htm',
            data={
                pageNo:n,
                psize:size,
                type:courseType
            },
            method='get',
            success=function (res) {
                var result=JSON.parse(res);
                render(result.list,result.pagination.pageSize);
                //    显示课程详情
                showCourse();
            }
        );
    //    页码样式切换
        for(var i=1;i<paginationList.length-1;i++){
            removeClass(paginationList[i],'on');
        }
        addClass(paginationList[n],'on');
    }

//    初始化相关DOM
    paginationList=document.getElementsByClassName('ele');
    prevBtn=paginationList[0];
    nextBtn=paginationList[paginationList.length-1];
//    初始化页码1的样式
    addClass(paginationList[1],'on');
//    上一页，下一页点击事件
    addFunc(prevBtn,'click',function () {
        if(index>1){
            reCourse(--index);
        }

    });
    addFunc(nextBtn,'click',function () {
        if(index<8){
            reCourse(++index);
        }
    });
//    页码数字点击事件
    for(var i=1;i<paginationList.length-1;i++){
        paginationList[i].id=i;
        addFunc(paginationList[i],'click',function () {
            index=this.id;
            reCourse(this.id);
        })
    }

}

//显示课程详情函数
function showCourse() {
    var courseCell=document.getElementsByClassName('courseLi');
    for(var i=0;i<courseCell.length;i++){
        addFunc(courseCell[i],'mouseover',function () {
            var dialog=this.getElementsByClassName("detail-dialog")[0];
            dialog.style.display='block';
        });
        addFunc(courseCell[i],'mouseout',function () {
            var dialog=this.getElementsByClassName("detail-dialog")[0];
            dialog.style.display='none';
        })
    }
}

// 产品设计和编程语言的切换函数
function tabSwitch(size) {
    var productBtn=document.getElementsByClassName('product')[0];
    var programBtn=document.getElementsByClassName('program')[0];
    var data=null;

//    点击事件
    addFunc(productBtn,'click',function () {
        if(hasClass(programBtn,'current')){
            removeClass(programBtn,'current');
            addClass(productBtn,'current');
            initCourse(1,size,10);
        }
    });
    addFunc(programBtn,'click',function () {
        if(hasClass(productBtn,'current')){
            removeClass(productBtn,'current');
            addClass(programBtn,'current');
            initCourse(1,size,20);
        }
    });
//    初始和刷新时自动加载产品设计
    initCourse(1,size,10);


}


function mainContent() {
    if (document.body.clientWidth >= 1205) {
        tabSwitch(20);
    } else {
        tabSwitch(15);
    }

}
addLoadEvent(mainContent);
