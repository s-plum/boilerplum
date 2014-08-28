var gulp = require('gulp'),  
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    gulpif = require('gulp-if'),
    gulpIgnore = require('gulp-ignore');

gulp.task('default', function (done) {  
  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Name for the app?'},
    {type: 'input', name: 'description', message: 'Description for the app?'},
    {type: 'confirm', name: 'git', message: 'Add .gitignore and README?'}
  ],
  function (answers) {
    answers['packageName'] = answers.name.replace(/ /g, "-").toLowerCase();
    gulp.src(__dirname + '/app/templates/**')
      .pipe(gulpif(!answers.git, gulpIgnore.exclude('.gitignore')))
      .pipe(gulpif(!answers.git, gulpIgnore.exclude('*.md')))
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('finish', function () {
        done();
      });
  });
});