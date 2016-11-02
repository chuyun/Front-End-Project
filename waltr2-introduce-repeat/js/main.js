/**
 * Created by jun on 2016/10/15.
 */
$(document).ready(function () {
    initialize();

});

var cntr='n',
    interval,
    interval2,
    subscribed=false,
    cntr1=0;
var video=$('video')[0];

$(video).bind('canplay',function (e) {
    setTimeout(function () {

        $('#video-container').css('opacity','1');
    },400);
});

$('#skip').click(function () {
    video.pause();
    initialize2(100.00);
});

$('.w2-activate').click(function () {
   video.pause();
    $('#form').hide();
    $('#thank').css('display','block');

});

// start-waltr-button 点击事件
$('#start-waltr-button').click(function () {
    initialize2(5.00);
    $('#start-waltr-button').hide();
});

//START button click
function startWaltr() {
    $('#start-waltr').css('opacity',1);
    $('#start-waltr-button').click(function () {
        cntr=2;
        video.pause();
    })
}

function initialize() {
    video.play();
    interval=setInterval(function () {
        if(video.currentTime>=4.9&&cntr=='n'){
            cntr='y';
            video.pause();
            $('#start-waltr-button').css('display','block');
        }
    },10)
}

//Interval 2 - email providing
function initialize2(time) {
    clearInterval(interval);
    video.currentTime=time;
    video.play();
    cntr=0;
    $('#skip').css('opacity',1);
    interval2=setInterval(function () {
        if(video.currentTime>=54&&video.currentTime<=84){
            $('body').css('background-color','#000');
        }else {
            $('body').css('background-color','#FFF');
        }

        if(video.currentTime>=20.5&&cntr==0){
            cntr='y';
            $('#skip').click(function () {
                cntr=0;
                video.currentTime=94.6;
                setTimeout(function () {
                    $('#skip').hide()
                },200);
            })
        }
        if(video.currentTime>=99.5&&cntr=='y'){
            cntr=0;
            // $('#skip').addClass('todown');
            setTimeout(function () {
                $('#skip').hide()
            },1200)
        }
        if (video.currentTime >= 106.2 && cntr == 0) {
            //event one - opacity & other
            cntr = 1;
            SubscribeUsers();
        }
        if (video.currentTime >= 121.9 && cntr == 1) {
            cntr == 2;
            video.currentTime = 116.5;

        }
    },10)
    
}


function SubscribeUsers() {
    $('#form').css('display','block');
    $('#subscribe-me').css('opacity','1');
    $('#skip').css('display','none');
    $('#emailer').focus();
    $('#form').submit(function (e) {
        submitclick();
        return false;
    });
    $('#subscribe-button').click(function () {
        $('#form').submit();
        clearInterval(interval2)
    });

    setTimeout(function () {
        $('#form').submit();
    },100)

}

function submitclick() {
    $('#form').validate({
            rules:{
                emailer:{
                    email:true,
                    required:true
                }
            },
            submitHandler:function(form) {
                $('#emailer').attr('disabled','disabled');
                $('#subscribe-button').text('Please wait...').addClass('bdisabled');
                $(video).pause();

                $.ajax({
                        type:'POST',
                        cache:false,
                        dataType:'json',
                        url: "https://softorino.com/api/get-devmate-trial-key",//product=WALTR2-MAC
                        data:{
                            'email' : ($('#emailer').val()) ,
                            'product' : 'WALTR2-MAC'
                        },
                        error:function(err){

                            // alert('can not get key');
                            showError(data.message);// NEEDS TESTING
                            $('#emailer').removeAttr('disabled');
                            $('#subscribe-button').text('Send Me My WALTR 2 Key').removeClass('bdisabled');
                        },
                        success:function(data){
                            if(data.result=='ok'){
                                clearInterval(interval2);
                                subscribed=true;
                                finishSubscription();

                            }else {
                                console.log('Error');
                            }
                        }
                    }

                )

            }

    })

}

function showError(datta){
    $('<span class="error">'+datta+'</span>').prependTo($('#emailer').parent());
    $('input[type=email]').addClass('error').removeClass('valid');
}

function finishSubscription(){
    cntr = 3;
    if (subscribed){
        video.currentTime = 122.2;
        interval1 = setInterval(function(){
            if (video.currentTime >= 125.2 && cntr1==0){
                cntr1 = 1;
                clearInterval(interval1);
                video.pause();
            }
        }, 20);
    } else {
        video.currentTime = 122.3;
    }

    $('#subscribe-me').hide();
}