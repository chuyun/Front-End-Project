/**
 * Created by jun on 2016/10/27.
 */
var gulp=require('gulp');
var jshint=require('jshint');
var browserSync=require('browser-sync');
var useref=require('useref');
var gulpIf=require('gulp-if');
var uglify=require('gulp-uglify');
var minifyCSS=require('gulp-minify-css');
var cleanCSS=require('gulp-clean-css');
var cache=require('gulp-cache');
var imagemin=require('gulp-imagemin');
var del=require('del');
var clean=require('gulp-clean');
var runSequence=require('run-sequence');
var imageisux=require('gulp-imageisux');


//语法检查
gulp.task('jshint',function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint,reporter('default'))
});

//browserSync 实时刷新
gulp.task('browserSync',function () {
    browserSync({
        server:{
            baseDir:'./'
        }
    })
});

//gulp-useref会将多个文件拼接成单一文件，并输出到相应目录
gulp.task('useref',function () {
    return gulp.src('index.html')
        .pipe(gulpIf('js/**/*.js',uglify()))
        .pipe(useref())
        .pipe(gulp.dest('dist/js'))

});

gulp.task('minify-css',function () {
   return gulp.src('css/*.css')
       .pipe(cleanCSS())
       .pipe(gulp.dest('dist/css'))
});

gulp.task('watch',function () {
   gulp.watch('index.html',browserSync.reload);
    gulp.watch('js/**/*.js',browserSync.reload);
    gulp.watch('css/**/*.css',browserSync.reload);
});


//webp
gulp.task('webp',function () {
    return gulp.src('image/*')
    .pipe(imageisux('/dirpath/',true));
});





// gulp-cache 插件可以减少重复压缩
gulp.task('imagemin',function () {
    return gulp.src('image/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced:true
        })))
        .pipe(gulp.dest('dist/images'))
});

//清理生成文件 Except images
gulp.task('clean',function (callback) {
    // del('dist');//默认
    // 不想删除图片
    del(['dist/**/*','!dist/images','!dist/images/**/*'],callback)

});

//cleanAll
gulp.task('clean-all',function (callback) {
    del('dist')
    return cache.clearAll()
});

gulp.task('build-clean',function () {
    return gulp.src('dist')
        .pipe(clean());
});





//组合Gulp任务


//build

gulp.task('build',function (callback) {
    runSequence('build-clean',['jshint','useref','minify-css','imagemin'],callback);
    console.log("Building Files")
});


//开发
gulp.task('default',function (callback) {
    runSequence(['browserSync','watch'], callback)
});




