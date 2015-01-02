var gulp = require('gulp'),  
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    templateDir = __dirname + '/app/templates/';

gulp.task('default', function (done) {  
  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Name for the app?'},
    {type: 'input', name: 'description', message: 'Description for the app?'},
    {type: 'confirm', name: 'git', message: 'Add .gitignore and README?'},
    {type: 'list', name: 'scriptLib', message: 'May I interest you in one of our delicious script libraries?', choices: [
    	{
    		name: 'jQuery (all the bells and whistles)',
    		value: 'jquery'
    	},
    	{
    		name: 'plumQuery (one-bell basic CSS selector helper)',
    		value: 'plumquery'
    	},
    	{
    		name: 'No, thank you.',
    		value: 'none'
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
    else {
    	srcFiles.push(templateDir + '.gitignore');
    }
    gulp.src(srcFiles)
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('finish', function () {
        done();
      });
  });
});