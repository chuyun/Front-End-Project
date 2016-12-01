/**
 * Created by jun on 2016/11/12.
 */

var checkbtn=document.getElementById('checkbtn');
var inputbtn=document.getElementById('input');


checkbtn.onclick=function () {

    queryList.innerHTML=' ';
    var inputVal=inputbtn.value;
    console.log(inputVal);
    Parking(inputVal);

};






