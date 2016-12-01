/**
 * Created by jun on 2016/11/11.
 */

function Data() {
    this.orderKind=[];
    this.time=[];
    this.plate=[];
}

Data.prototype={
    constructor:Data,
    addRecord:function (orderKind,time,plate) {
        this.orderKind.push(orderKind);
        this.time.push(time);
        this.plate.push(plate);
    }

};




function ListRecord() {}

ListRecord.prototype={
    constructor:ListRecord,
    listAll:function () {


    },

    listPlate:function () {
        
    },

    listTime:function () {
    
}

};

function Parking(string) {
    this.string=string;




}



var data=new Data();
var listRecord=new ListRecord();







