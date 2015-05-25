'use strict';
var chai = require('chai'),
	expect = chai.expect,
	inquirer = require('inquirer'),
	gulp = require('gulp'),
	mockGulpDest = require('mock-gulp-dest')(gulp),
	template = require('gulp-template'),
	tap = require('gulp-tap');

chai.use(require('chai-fs'));

require('../slushfile');

describe('slush-boilerplum', function() {
	before(function() {
		process.chdir(__dirname);
	});

	describe('default generator', function() {
		beforeEach(function() {
			mockPrompt({
				name: 'test app'
			});
		});

		it ('should use current directory for files', function(done) {
			gulp.start('default').once('stop', function() {
				expect(mockGulpDest.cwd()).to.equal(__dirname);
        		expect(mockGulpDest.basePath()).to.equal(__dirname);
        		done();
			});
		});

		it ('should create config files in root', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains([
					'config.rb',
					'package.json',
					'gulpfile.js'
				]);
				done();
			});
		});

		it ('should create directory structure', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains({
					src: {
						sass: [],
						img: [],
						js: []
					}
				});
				done();
			});
		});

		it ('should create index.html in src directory', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains({
					src: 'index.html'
				});
				done();
			});
		});

		it ('should create default sass files', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains({
					src: {
						sass: [
							'_functions.scss',
							'_mixins.scss',
							'_normalize.scss',
							'_variables.scss',
							'main.scss'
						]
					}
				});
				done();
			});
		});

		it ('should create default js files', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains({
					src: {
						js: 'main.js'
					}
				});
				done();
			});
		});

		it ('should not include jQuery reference in main.js', function(done) {
			var answers = {
				scriptLib: 'none'
			};
			gulp.src('../app/templates/src/js/main.js')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8').replace(/\r\n/g, '');
					expect(actual).to.not.contain('jquery');
					done();
				}));
		});

		it ('should not include Bower files', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestNotContains([
					'.bowerrc',
					'bower.json'
				]);
				done();
			});
		});
	});

	describe('generator without git', function() {
		beforeEach(function() {
			mockPrompt({
				name: 'test app',
				git: false
			});
		});

		it ('should not include .gitignore and README.md', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestNotContains([
					'.gitignore',
					'README.md'
				]);
				done();
			});
		});
	});

	describe('generator with git', function() {
		beforeEach(function() {
			mockPrompt({
				name: 'test app',
				git: true
			});
		});

		it ('should include .gitignore and README.md', function(done) {
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains([
					'.gitignore',
					'README.md'
				]);
				done();
			});
		});
	});

	describe('generator with jquery', function() {
		it ('should include jquery in main.js', function(done) {
			var answers = {
				scriptLib: 'jquery'
			};
			gulp.src('../app/templates/src/js/main.js')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8').replace(/\r\n/g, '');
					expect(actual).to.contain('jquery');
					done();
				}));
		});

		it ('should include Bower files', function(done) {
			mockPrompt({
				name: 'test app',
				scriptLib: 'jquery'
			});
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains([
					'.bowerrc',
					'bower.json'
				]);
				done();
			});
		});
	});
});

var mockPrompt = function(answers) {
	inquirer.prompt = function(prompts, done) {
		prompts.forEach(function(prompt) {
			if (typeof answers[prompt.name] == 'undefined') {
				answers[prompt.name] = prompt.default;
			}
		})
		done(answers);
	};
};
