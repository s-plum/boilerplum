var fs = require('fs'),
    gulp = require('gulp'),  
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
    {type: 'list', name: 'scriptLib', message: 'May I interest you in a delicious script library?', default: 'none', choices: [
    	{
        name: 'No, thank you.',
        value: 'none'
      },
      {
    		name: 'jQuery',
    		value: 'jquery'
    	}
    	]}
  ],
  function (answers) {
    answers['packageName'] = answers.name.replace(/ /g, "-").toLowerCase();
    var srcFiles = [templateDir + '**'];
    if (answers.scriptLib !== 'jquery') {
    	srcFiles = srcFiles.concat(['!' + templateDir + 'bower.json', '!' + templateDir + '.bowerrc']);
    }
    if (!answers.git) {
    	srcFiles = srcFiles.concat(['!' + templateDir + 'README.md', '!' + templateDir + '.gitignore']);
    }
    gulp.src(srcFiles, { dot: true })
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .on('finish', function () {
        if (fs.existsSync('./src')) {
          fs.mkdirSync('./src/img');
        }                       
        done();
      });
  });
});