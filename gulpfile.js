'use strict';
const gulp = require("gulp");
const minify = require('gulp-minify');
const inject = require("gulp-inject-string");
const ts = require('gulp-typescript');
const plus = require('typescript-plus');
const merge = require('merge2');
const del = require('del');
const tsProject = ts.createProject('tsconfig.json', { typescript: plus });
const lib_name = 'library';
gulp.task('clean', () => {
    return del([
        'bin',
        'dist'
    ]);
});
gulp.task('buildJs', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(inject.replace('var ' + lib_name + ';', ''))
        .pipe(inject.prepend('window.' + lib_name + ' = {};\n'))
        .pipe(inject.replace('var __extends =', 'window.__extends ='))
        .pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(gulp.dest('./bin'));
});

gulp.task("buildDts", ["buildJs"], () => {
    return tsProject.src()
        .pipe(tsProject())
        .dts
        .pipe(gulp.dest('./bin'));
});

gulp.task("build", ["buildDts"], () => {
    return merge([
        gulp.src('bin/**/*')
            .pipe(gulp.dest('./dist/egret.' + lib_name + '/')),
        // gulp.src('bin/*.ts').pipe(),//复制dts到其他依赖项目中
    ]);
});
gulp.task('default', ['clean', 'build']);