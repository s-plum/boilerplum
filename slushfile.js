var gulp = require('gulp'),  
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    templateDir = __dirname + '/app/templates/';

gulp.task('default', function (done) {  
  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Name for the app?', default: ''},
    {type: 'input', name: 'description', message: 'Description for the app?', default: ''},
    {type: 'confirm', name: 'git', message: 'Add .gitignore and README?', default: true},
    {type: 'list', name: 'scriptLib', message: 'May I interest you in one of our delicious script libraries?', default: 'none', choices: [
    	{
        name: 'No, thank you.',
        value: 'none'
      },
      {
    		name: 'jQuery (all the bells and whistles)',
    		value: 'jquery'
    	},
    	{
    		name: 'plumQuery (one-bell basic CSS selector helper)',
    		value: 'plumquery'
    	}
    	]}
  ],
  function (answers) {
    answers['packageName'] = answers.name.replace(/ /g, "-").toLowerCase();
    var srcFiles = [templateDir + '**'];
    if (answers.scriptLib !== 'plumquery') {
    	srcFiles.push('!' + templateDir + 'src/js/plumquery.js');
    }
    if (!answers.git) {
    	srcFiles = srcFiles.concat(['!' + templateDir + 'README.md', '!' + templateDir + '.gitignore']);
    }
    gulp.src(srcFiles, { dot: true })
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .on('finish', function () {
        done();
      });
  });
});