/**
 * Created by jun on 2016/11/9.
 */

    var recordPZ=[],
        recordTime=[],
        recordStats=[],
        timeArray=[],
        myReg = /-n=/g;

function Parking(str) {
    var arr=str.split(' ');
        var str2=arr[1];
    // console.log(typeof str2);
    var a2=str2.replace(/-t=/ig,'');

    // var a2=str2.replace(/-tn/g,'');
    if(arr[2]){
        var str3=arr[2];
        var a3=str3.replace(/-n=/ig,'');

        // var a3=arr[3].substring(3,arr[3].length);

        if(arr[0]=='checkin'){
            recordPZ.push(a3);
            recordTime.push(a2);
            recordStats.push('in');


        }else if(arr[0]=='checkout'){
            recordPZ.push(a3);
            recordTime.push(a2);
            recordStats.push('out');

        }else if (arr[0]=='listrecord'){
            var startTime=arr[1].replace(/-st=/ig,'');
            var endTime=arr[2].replace(/-et=/g,'');
                for(var m=0;m<recordTime.length;m++){
                    if(recordTime[m]>=startTime && recordTime[m]<=endTime){
                        // timeArray.push(m);
                        console.log('Record'+m+':'+recordPZ[m]+' '+ recordTime[m].replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+recordStats[m]);


                    }


                }


        }
        else {
            console.log('ERROR')
        }

    } else {

    if(arr[0]=='listrecord'){
        // console.log("TESTLIS");
            if(arr[1]=='-all'){
                Print();
            }else if(myReg.test(arr[1])){

                var p2=arr[1].replace(/-n=/ig,'');

                // var xiabiao=recordPZ.indexOf(p2);
                // console.log(xiabiao);

                for(var j=0;j<recordPZ.length;j++){
                    if(recordPZ[j] == p2) {
                        console.log('Record' + j + ':' + recordPZ[j] + ' ' + recordTime[j].replace(/\B(?=(?:\d{2})+\b)/g, ':') + ' ' + recordStats[j]);
                    }
                    }


            }



        }


    }


}


function Print() {
    for(var i=0;i<recordPZ.length;i++){
        console.log('Record'+i+':'+recordPZ[i]+' '+ recordTime[i].replace(/\B(?=(?:\d{2})+\b)/g,':')+' '+recordStats[i]);
    }

}

// console.log( '123456789000'.replace(/\B(?=(?:\d{2})+\b)/g, ',') );



Parking("checkin -t=225959 -n=AT4257");
Parking("checkout -t=225959 -n=AT4257");

Parking("listrecord -all");
Parking("listrecord -n=AT4257");

Parking("listrecord -st=220000 -et=235959" );