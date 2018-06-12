var gulp = require('gulp');
//watch到文件更改后刷新浏览器
var liveReload = require('gulp-livereload');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
//npm install --save-dev gulp-babel babel-core babel-preset-env
var babel = require('gulp-babel');

//清除上一次编译的dist目录
gulp.task('clean', function () {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});
//js混淆
gulp.task('js', ['clean'], function () {
  return gulp.src('js/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
//sass解析、css压缩
gulp.task('sass:css', ['clean'], function () {
  return gulp.src('sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['clean', 'js', 'sass:css'], function () {
  liveReload.listen();
  gulp.watch('js/*.js', ['js']);
  gulp.watch('sass/*.scss', ['sass:css']);
  console.log('watching....');
});