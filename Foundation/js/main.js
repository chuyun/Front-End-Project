/**
 * Created by jun on 2016/11/15.
 */
require.config({
   baseUrl:'js/libs',
    shim:{
       'jquery':{
           deps:[],
           exports:'$'
       },

       'foundation':{
           deps:['jquery'],
           exports:'_'
       }
    }
});


require(['jquery','foundation'],function ($,_) {







});