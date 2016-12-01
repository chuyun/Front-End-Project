/**
 * Created by jun on 2016/11/12.
 */
function Data(orderKind,time,plate) {
    this.orderKind=orderKind;
    this.time=time;
    this.plate=plate;
}

function ListRecord() {}
    ListRecord.prototype={
        constructor:ListRecord,
        listAll:function (arr) {
            for(var i=0;i<arr.length;i++){
                queryList.innerHTML+=('Record'+i+':'+arr[i].plate+' '+arr[i].time.replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+arr[i].orderKind)+'<br/>';

                console.log('Record'+i+':'+arr[i].plate+' '+arr[i].time.replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+arr[i].orderKind);
            }

        },
        // listPlate:function (arr,plate) {
        //     for(var j=0;j<recordPZ.length;j++){
        //         if(arr[j].plate==plate){
        //             console.log('Record'+j+':'+arr[j].plate+' '+arr[j].time+' '+arr[j].orderKind);
        //         }
        //     }
        //
        // },
        //
        // listTime:function (arr,st,et) {
        //     if(st&&et){
        //         for(var i=0;i<arr.length;i++){
        //             if(arr[i].time>=st&&arr[i].time<=et){
        //             console.log('Record'+i+':'+arr[i].plate+' '+arr[i].time.replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+arr[i].orderKind);
        //             }
        //
        //         }
        //     }else if(st||et){
        //         var startTime=st?st:et;
        //         for(var i=0;i<arr.length;i++){
        //             if(arr[i].time>=startTime){
        //             console.log('Record'+i+':'+arr[i].plate+' '+arr[i].time.replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+arr[i].orderKind);
        //             }
        //
        //         }
        //     }else {
        //         console('未查询到记录')
        //     }
        //
        //
        // },
        list:function (arr, plate, st, et) {
            for(var i=0;i<arr.length;i++){
                if((st?(arr[i].time>=st):true)&&(et?(arr[i].time<=et):true)&&(plate?(arr[i].plate==plate):true)){
                    queryList.innerHTML+=('Record'+i+':'+arr[i].plate+' '+arr[i].time.replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+arr[i].orderKind)+'<br/>';

                    console.log('Record'+i+':'+arr[i].plate+' '+arr[i].time.replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+arr[i].orderKind);
                }

            }
        }


};

function Parking(str) {
    var arr=str.split(' '),
        arrLen=arr.length,
        plate,
        timest,
        timeet;

    var orderKindReg=/^check/,
        plateReg=/^-n=/,
        listcommandReg=/listrecord/,
        liststReg=/^-st=/,
        listetReg=/^-et=/;

    if(orderKindReg.test(arr[0])){
        // var addrecord=addRecord(arr);
       Record.push(addRecord(arr));


    } else if(listcommandReg.test(arr[0])){
        for (var i=0;i<arrLen;i++){
            plate=plateReg.test(arr[i])?arr[i].replace(plateReg,''):'';
            timest=liststReg.test(arr[i])?arr[i].replace(liststReg,''):'';
            timeet=listetReg.test(arr[i])?arr[i].replace(listetReg,''):'';
        }


        var listrecord=new ListRecord();

        listrecord.list(Record,plate,timest,timeet);
    }

}

//添加记录————>返回一个Data对象
function addRecord(arr) {
    var arrLen=arr.length,
        checkKind,
        plate,
        time;

    var orderKindReg=/^check/,
        timeReg=/^-t=/,
        plateReg=/^-n=/;

    for(var i=0;i<arrLen;i++){
        if(orderKindReg.test(arr[i])){
            checkKind=arr[i].replace(/check/,'');
        }
        else if(timeReg.test(arr[i])){
            time=arr[i].replace(/-t=/,'');
        }
        else if(plateReg.test(arr[i])){
            plate=arr[i].replace(/-n=/,'');
        }
    }

    recordDiv.innerHTML+=checkKind+" "+time+" "+plate+'<br/>';


    return (new Data(checkKind,time,plate));



}

var Record=[];

var recordDiv=document.getElementById('record');
var queryList=document.getElementById('queryList');

// Parking("checkin -t=205959 -n=AT4257");
// Parking("checkout -t=225959 -n=AT4357");
// Parking("checkout -t=255959 -n=AT4457");
//
// Parking("listrecord -all");
// Parking("listrecord -n=AT4257");
//
// Parking("listrecord -et=235959" );
// Parking("listrecord -st=235959" );
// // console.log(Record);
//
//
// Parking("listrecord -st=220000 -et=235959 -n=AT4457" );
//
// Parking("listrecord -st=220000 -n=AT4457 -et=235959" );