/**
 * Created by ling on 17/1/24.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var del = require('del');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var autoPrefix = require('gulp-autoprefixer');
var less = require('gulp-less');

var condition = true;


var debug = false;
var file = {
    "javascript":{
        "src":'./src/js/**/*.js',
        "dist":"./dist/js/"
    },
    "less":{
      "src":"./src/less/*",
      "dist":"./src/css/main/"
    },
    "css":{
        "src":["./src/css/main/**/*"],
        "dist":"./dist/css"
    },
    "html":{
        "src":"./dist/*.html",
        "dist":"./dist"
    }
};


//gulp.task('copy',function(){
//    gulp.src(['./src/vendor/angular.js','./src/js/vendor/modernizr-2.8.3.min.js','./src/vendor/jquery/dist/jquery.min.js']).pipe(gulp.dest('./dist/js/vendor'));
//    gulp.src(['./src/*.*']).pipe(gulp.dest('./dist'));
//});
gulp.task('copy',function(){
    gulp.src(['./src/**/*','!./src/js/**/*','!./src/css/main/**/*']).pipe(gulp.dest('./dist/'));
});

//合并压缩并添加版本号
gulp.task('jsMin',function(){
    gulp.src(file.javascript.src).pipe(concat('app.min.js')).pipe(gulpif(condition,uglify())).pipe(rev()).pipe(gulp.dest(file.javascript.dist)).pipe(rev.manifest()).pipe(gulp.dest('./dist/rev/js'));
});

//less转为css
gulp.task('less',function(){
    gulp.src(file.less.src).pipe(less()).pipe(gulp.dest(file.less.dist));
});


gulp.task('cssMin',function(){
   gulp.src(file.css.src).pipe(concat('main.min.css')).pipe(gulpif(condition,minifyCss()))
       .pipe(rev())
       .pipe(autoPrefix({
           cascade:false,
           remove:false
       }))
       .pipe(gulp.dest(file.css.dist))
       .pipe(rev.manifest())
       .pipe(gulp.dest('./dist/rev/css'));
});

//压缩并替换html
gulp.task('minHtml',function(){
   return gulp.src(['./dist/rev/**/*.json',file.html.src])
       .pipe(revCollector())
       .pipe(gulpif(
           condition,minifyHtml({
            empty:true,
            spare:true,
            quotes:true
            })
       ))
       .pipe(gulp.dest(file.html.dist));
});

//删除文件
gulp.task('clean', function () {
    'use strict';
    del(['./dist/**/*','./src/rev/**/*','./src/css/main/**/*']);
});

gulp.task('default',['copy','jsMin','less','cssMin']);
//gulp.task('minHtml',['minHtml']);








