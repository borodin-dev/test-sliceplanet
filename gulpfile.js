// Подключаем Gulp
var gulp = require("gulp");
// Подключаем плагины Gulp
var sass = require("gulp-sass"), // переводит SASS в CSS
    cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображений
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename"), // Переименование файлов
    browserSync = require('browser-sync');


// Копирование файлов HTML в папку dist
gulp.task("fonts", function() {
    return gulp.src("app/fonts/**/*.+(eot|otf|ttf|woff|woff2)")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("icons", function() {
    return gulp.src("app/fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.*")
        .pipe(gulp.dest("dist/fonts/fonts"));
});

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
    return gulp.src("app/*.html")
        .pipe(gulp.dest("dist"));
});

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("sass", function() {
    return gulp.src(['app/scss/*.scss', ])
        .pipe(concat('styles.scss'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream(true));
});

// Объединение и сжатие JS-файлов
gulp.task("scripts", function() {
    return gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "app/scripts/slick.js",
        "app/scripts/*.js"]) // директория откуда брать исходники
        .pipe(concat('scripts.js')) // объеденим все js-файлы в один
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
});

// Сжимаем картинки
gulp.task('imgs', function() {
    return gulp.src("app/images/**/*.+(jpg|jpeg|png|gif)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/images"))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: ["./dist"]
        },
        notify: false,
        // browser: "firefox",

    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Задача слежения за измененными файлами
gulp.task("watch", function() {
    gulp.watch("app/*.html", ["html"]);
    gulp.watch("app/scripts/*.js", ["scripts"]);
    gulp.watch("app/scss/*.scss", ["sass"]);
    gulp.watch("app/images/*.+(jpg|jpeg|png|gif)", ["imgs"]);
});

// Запуск тасков по умолчанию
gulp.task("default", ["html", "sass", "scripts", "imgs", "fonts", "icons", "watch", "browser-sync"]);