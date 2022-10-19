// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'));
	
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
	
// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем compress-images для работы с изображениями
// const imagecomp = require('compress-images');
 
// Подключаем модуль gulp-clean (вместо del)
const clean = require('gulp-clean');

// Подключаем плагин pug
const pug = require('gulp-pug')



// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function scripts() {
	return src([ // Берем файлы из источников
		
		'app/js/*.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
		])
	.pipe(concat('script.min.js')) // Конкатенируем в один файл
	.pipe(uglify()) // Сжимаем JavaScript
	.pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function scss() {
	return src('app/scss/**/*.scss') // Выбираем источник: "app/scss/main.scss"
	.pipe(sass())
	.pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 1 } }/* , format: 'beautify' */ } )) // Минифицируем стили
	.pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function pugStart() {
	return src('app/pug/**/*.pug') // Источник: "app/pug/index.pug"
	.pipe(pug({pretty: true}))
	.pipe(dest('app/')) // Выгружаем в index.html
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function startwatch() {
 
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
	
	// Мониторим файлы на изменения
	watch('app/scss/**/*.scss', scss);

	// Мониторим файлы Pug 
	// watch ('app/pug/modules/*.pug')
	watch('app/pug/**/*.pug', pugStart)
 
	// Мониторим файлы HTML на изменения
	watch('app/**/*.html').on('change', browserSync.reload);

	// Мониторим папку-источник изображений и выполняем images(), если есть изменения
	// watch('app/images/src/**/*', images);
}

function buildcopy() {
	return src([ // Выбираем нужные файлы
		'app/css/**/*.min.css',
		'app/js/**/*.js',
		'app/images/**/*',
		'app/**/*.html',
		'app/fonts/*'
		], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
	return src('dist', {allowEmpty: true}).pipe(clean()) // Удаляем папку "dist/"
}



// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию scss
exports.scss = scss;

// Экспортируем функцию images
// exports.images = images;

exports.pugStart = pugStart;

// Создаем новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, scss, scripts, buildcopy);

exports.default = parallel(scripts, browsersync, scss, pugStart, startwatch)