'use strict';
var chai = require('chai'),
	should = chai.should(),
	assert = chai.assert,
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
				mockGulpDest.cwd().should.equal(__dirname);
        		mockGulpDest.basePath().should.equal(__dirname);
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
						css: [],
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
						css: {
							src: [
								'_functions.scss',
								'_mixins.scss',
								'_normalize.scss',
								'_variables.scss',
								'main.scss'
							]
						}
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

		it ('should not include library references in main.js', function(done) {
			var answers = {
				scriptLib: 'none'
			};
			var expected = '\'use strict\';';
			gulp.src('../app/templates/src/js/main.js')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8').replace(/\r\n/g, '');
					assert.equal(actual,expected);
					done();
				}));
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
			var expected = '\'use strict\';var $ = require(\'jquery\');';
			gulp.src('../app/templates/src/js/main.js')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8').replace(/\r\n/g, '');
					assert.equal(actual,expected);
					done();
				}));
		});

		it('should include jquery in package.json', function(done) {
			var answers = {
				scriptLib: 'jquery',
				packageName: 'test',
				description: 'test app'
			};
			gulp.src('../app/templates/package.json')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8');
					assert(actual.indexOf('jquery') > 0);
					done();
				}));
		});

		it('should not include plumquery', function(done) {
			mockPrompt({
				name: 'test app',
				scriptLib: 'jquery'
			});
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestNotContains({
					src: {
						js: 'plumquery.js'
					}
				});
				done();
			});
		});
	});

	describe('generator with plumquery', function() {
		it ('should include plumquery in main.js', function(done) {
			var answers = {
				scriptLib: 'plumquery'
			};
			var expected = '\'use strict\';var $ = require(\'./plumquery\');';
			gulp.src('../app/templates/src/js/main.js')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8').replace(/\r\n/g, '');
					assert.equal(actual,expected);
					done();
				}));
		});

		it('should not include jquery in package.json', function(done) {
			var answers = {
				scriptLib: 'plumquery',
				packageName: 'test',
				description: 'test app'
			};
			gulp.src('../app/templates/package.json')
				.pipe(template(answers))
				.pipe(tap(function(file, t){
					var actual = file.contents.toString('utf8');
					assert(actual.indexOf('jquery') === -1);
					done();
				}));
		});

		it('should include plumquery', function(done) {
			mockPrompt({
				name: 'test app',
				scriptLib: 'plumquery'
			});
			gulp.start('default').once('stop', function() {
				mockGulpDest.assertDestContains({
					src: {
						js: 'plumquery.js'
					}
				});
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
