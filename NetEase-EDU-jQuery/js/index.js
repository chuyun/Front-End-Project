/**
 * Created by jun on 2016/11/1.
 */
$(document).ready(function () {
    closeTips();
    carousel();
    videoPlay();
    showHotList();
    mainContent();
    login();
});


function closeTips() {
$('#tip-close').click(function () {
    $('.prompt-message').hide();
    $('#tip').hide();
    $.cookie('tipCookie','tipHasClosed',{expires: 7, path: '/' })
})
}

function carousel() {
    var currentIndex=0,
        bannerArr=$('.banner-list').find('li'),
        bannerLen=bannerArr.length,
        indexListArr=$('#indexList').find('li');
//    定时器每5秒自动变换一次banner
    autoChange=setInterval(function () {
        if(currentIndex<bannerLen-1){
            currentIndex++;
        }else {
            currentIndex=0;
        }
        changeTo(currentIndex);

    },5000);

    addEvent();

    function addEvent() {
        for(var i=0;i<bannerLen;i++){
            (function (j) {
                $(indexListArr[j]).click(function () {
                    changeTo(j);
                    currentIndex=j;
                })
            })(i);
            (function (j) {
                $(bannerArr[j]).mouseover(function () {
                   clearTimeout(autoChange);
                    currentIndex=j;
                });
                $(bannerArr[j]).mouseout(function () {
                    autoChange=setInterval(function () {
                        if(currentIndex<bannerLen-1){
                            currentIndex++;

                        }else {
                            currentIndex=0;
                        }
                        //    调用变量处理函数
                        changeTo(currentIndex);
                    },5000)
                })
            })(i);

        }

    }

    function changeTo(num) {
        var currentBanner=$('.bannerOn')[0];
        $(currentBanner).fadeOut('slow');
        $(currentBanner).removeClass('bannerOn');
        $(bannerArr[num]).addClass('bannerOn');
        $(bannerArr[num]).fadeIn('slow');

        var currentIndexOn=$('.indexOn')[0];
        $(currentIndexOn).removeClass('indexOn');
        $(indexListArr[num]).addClass('indexOn');
    }
    
}


function videoPlay() {
    $('#video-image').click(function () {
        $('#mask').css('display','block');
        $('#video-pop').css('display','block');
    });

    $('#video-close').click(function () {
        $('#mask').css('display','none');
        $('#video-pop').css('display','none');
        $('#video').trigger('pause');
        // $('#video').get(0).pause();
    });

}


function showHotList() {
    $(document).load(
        'http://study.163.com/webDev/hotcouresByCategory.htm',
        {},
        function (res,status,xhr) {
            // alert(status);
            if(status=='success'){
            var returnData=JSON.parse(res);
            // console.log(returnData);
            for(var i=0;i<10;i++){
                var elementLi='';

                elementLi += '<li class="hotListLi">'+creatNode(returnData[i])+'</li>';
                $('#hotlistul').append(elementLi);
                // console.log(elementLi);

            }
            // $('#hotlistul').innerHTML=elementLi;


            }
        }
    );

    function creatNode(opt) {
        return '<img src="'+opt.smallPhotoUrl+'" alt="'+opt.name+'" class="hotListPic"><div><p class="hotListTitle">'+opt.name+'</p><span class="hotListUserCount">'+opt.learnerCount+'</span></div>';

    }
    
}



function initCourse(pageNo,psize,ptype) {
    var rootDom=$('.course');
    
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

    function courseRender(arr,num) {

        var courseTemple='';
        for (var i=0;i<num;i++){
            courseTemple+=segment(arr[i]);
            // console.log(courseTemple);

        }
        // console.log("courseTemple:");
        // console.log(courseTemple);
        // rootDom[0].innerHTML=courseTemple;
        $(rootDom[0]).append(courseTemple);
    }
        $(document).load(
            'http://study.163.com/webDev/couresByCategory.htm',
            {
                pageNo:pageNo,
                psize:psize,
                type:ptype
            },
            function (res,status,xhr) {
                if(status=='success'){
                    var result=JSON.parse(res);
                    console.log(result);
                    courseRender(result.list,result.pagination.pageSize);
                    pagination(result,courseRender,ptype,psize);

                    showCourse();
                }


            }
        )

}


function  pagination(data,render,courseType,size) {
        var pagination=$('.pagination'),
            paginationList = null,
            prevBtn = null,
            nextBtn = null,
            index = 1; // 当前页码

        function reCourse(n) {
            $(document).load(
                'http://study.163.com/webDev/couresByCategory.htm',
                {
                    pageNo:n,
                    psize:size,
                    type:courseType
                },
                function (res,status,xhr) {
                    var result=JSON.parse(res);
                    render(result.list,result.pagination.pageSize);

                    showCourse();
                }
            );
            for(var i=1;i<paginationList.length-1;i++){
                // removeClass(paginationList[i],'on');
                $(paginationList[i]).removeClass('on');
            }
            // addClass(paginationList[n],'on');
            $(paginationList[n]).add('on');
        }

    //
        paginationList=$('.ele');
        prevBtn=paginationList[0];
        nextBtn=paginationList[paginationList.length-1];

        $(paginationList[1]).addClass('on');
        $(prevBtn).click(function () {
            if(index>1){
                reCourse(--index);
            }
        });
        $(nextBtn).click(function () {
            if(index<8){
                reCourse(++index);
            }
        });

        //    页码数字点击事件
        for(var i=1;i<paginationList.length-1;i++){
            paginationList[i].id=i;
           $(paginationList[i]).click(function () {
               index=this.id;
               reCourse(this.id);
           })
        }

    }

function  showCourse() {
    var courseCell=$('.courseLi');
    for(var i=0;i<courseCell.length;i++){
        $(courseCell[i]).mouseover(function () {
            var dialog=this.getElementsByClassName('detail-dialog')[0];
            $(dialog).css('display','block');
        });
        $(courseCell[i]).mouseout(function () {
            var dialog=this.getElementsByClassName('detail-dialog')[0];
            $(dialog).css('display','none');
        })
    }
}


// 产品设计和编程语言的切换函数
function tabSwitch(size) {
    $('.product').click(function () {
        if( $('.program').hasClass('current')){
            $('.program').removeClass('current');
            $('.product').addClass('current');
            console.log('TABSWITCH');
            initCourse(1,size,10);
        }
    });
    $('.program').click(function () {
        if ( $('.product').hasClass('current')){
            $('.product').removeClass('current');
            $('.program').addClass('current');
            initCourse(1,size,20);
        }
    });
    //    初始和刷新时自动加载产品设计
    initCourse(1,size,10);
}

function mainContent() {
    tabSwitch(20);
}


//cookie
function checkCookie() {
    if($.cookie('tipCookie')){
        hideTip();
    }
}

//

function login() {
    $('#follow').click(function () {
        if(!($.cookie('loginSuccess'))){
            $('#mask').css('display','block');
            $('#login').css('display','block');

            $('#login-btn').click(function () {
                if(validate){
                    $(document).load(
                        'http://study.163.com/webDev/login.htm',
                        {
                        userName:md5("studyOnline"),
                        password:md5("study.163.com")
                        },

                        function (res,status,xhr) {
                            if(status=='success'){
                                $('#mask').css('display','none');
                                $('#login').css('display','none');
                                $.cookie('loginSuccess','ture',{expires: 7, path: '/' });
                                $(document).load(
                                    'http://study.163.com/webDev/ attention.htm',
                                    {
                                        
                                    },
                                    function (res,status,xhr) {
                                        if(status=='success') {
                                            $('#follow').css('display','none');
                                            $('#followSuccess').css('display','block');
                                            $.cookie('followSuccess','ture',{expires: 7, path: '/' });
                                        }
                                    }
                                )
                            }else {
                                alert('登录错误，请重新登录22')
                            }

                        }
                    )
                }
            })



        }else {
            // 若已设置loginSuc cookie，调用关注API，并设置followSuc cookie
            $(document).load(
                'http://study.163.com/webDev/ attention.htm',
                {},
                function (res, status, xhr) {
                    if(status=='success'){
                        $('#follow').css('display','none');
                        $('#followSuccess').css('display','block');
                        $.cookie('followSuccess','ture',{expires: 7, path: '/' })
                    }
                }
            )

        }
    })
    
}

function validate() {
    var userName=$('#userName').val,
        password=$('#password').val;
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