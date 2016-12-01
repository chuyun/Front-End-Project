/**
 * Created by jun on 2016/10/27.
 */
var gulp=require('gulp');

var browserSync=require('browser-sync');

var runSequence=require('run-sequence');


//browserSync 实时刷新
gulp.task('browserSync',function () {
    browserSync({
        server:{
            baseDir:'./'
        }
    })
});


gulp.task('watch',function () {
   gulp.watch('index.html',browserSync.reload);
    gulp.watch('js/**/*.js',browserSync.reload);
    gulp.watch('css/**/*.css',browserSync.reload);
});



//开发
gulp.task('default',function (callback) {
    runSequence(['browserSync','watch'], callback)
});




