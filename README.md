# boilerplum
> A quick 'n' dirty UI sketchpad for proof-of-conceptin', script testin', or just-let-me-tryin'.

## Boiled plums?
Not really.

## Installation
Who needs a solid foundation when you can have a [Slush](http://slushjs.github.io/)-y one? Boilerplum is a slush generator that creates a small local development environment suited for UI developers low on time and high on ambition.

To get started, you will need to have the following dependencies installed globally on your machine:

* [Node.js](http://nodejs.org/)
* [Bower](http://bower.io/)
* [Compass](http://compass-style.org/install/)
* [Slush](http://slushjs.github.io/) 

If you want to avoid wearing out your Ctrl+F5 keys (or Command+R on Mac), you should set up your favorite browser with the [LiveReload extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-). If enabled, your local app will refresh the browser automatically when files change as the app is running.


## Boiling Plums

Create a new directory and direct a new command/terminal window to that path. Run:

```
slush boilerplum
```

Assuming I haven't broken something, this should initialize boilerplum setup. Boilerplum will ask you a few quick questions, work a little magic, and set up a new folder structure within the target folder. Once the folder is set up, install the rest of the project dependencies:

```
npm install
```

If you are using jQuery in your project, you will need to install that with Bower:
```
bower install
```

After dependencies are installed, you can initialize file watching, live reload, and compilation by running: 

```
gulp serve --watch
```

from the target folder. Additional build command tasks are set up in the `gulpfile` of your newly slushed project.

## Out of the Box
Boilerplum sets up a default file structure of:

```shell
[your target folder]
├──  .sass-cache
├──  src
│    ├──  sass
│    │    ├──  _functions.scss
│    │    ├──  _mixins.scss
│    │    ├──  _normalize.scss
│    │    ├──  _variables.scss
│    │    └──  main.scss
│    ├──  img
│    │    └──  *
│    ├──  index.html
│    ├──  js
│    │    ├──  main.js
│    │    └──  plugins
│    │    │    └── (Javascript dependencies installed via Bower)
├──  node_modules (once dependencies are installed)
│    └── *
├──  .bowerrc (if configured to use jQuery)
├──  .gitignore (if configured to include default git files)
├──  bower.json (if configured to use jQuery)
├──  config.rb
├──  gulpfile.js
├──  package.json
└──  README.md (if configured to include default git files)
```

## Working With Boilerplum
When you run `gulp serve --watch` in your newly plum-boiled folder, the application will:

1. Start up a local server to serve up your index.html file
2. Set a watch on your HTML, Sass, Javascript, and image files that will automatically reload the instance in the browser as files change (if LiveReload extension is installed in your browser)
3. Initialize [Compass](//http://compass-style.org/) compilation of .scss files, including sourcemaps and autoprefixing with the help of [Autoprefixer](https://github.com/postcss/autoprefixer)
4. [Browserify](http://browserify.org/) your scripts

The output for all processes will be logged in the terminal/command prompt window, and the compiled files will be dumped into a `dist` folder in the root project directory. Once all initial script processing has completed, you can view your site at http://localhost:3000. If you have LiveReload enabled, you can begin making edits to your `src` directory and see changes appear in your browser as you edit.

## Batteries Not Included (but Sass functions are)
The ```global.scss``` file in your ```css/src``` folder imports a few partials to help kick off your Sass-y style sheets:

###_functions.scss

* **rem($pixels)** - returns the rem equivalent of a pixel measurement

	```rem(22) => 1.375rem```
* **pem($pixels)** - returns the em equivalent of a pixel measurement

	```pem(16) => 1em```


### _mixins.scss

* **linear-gradient($fallback, $direction, $colorstops...)** - linear gradient background with solid color fallback support for older browsers

	```@include linear-gradient(#fff, to bottom, #fff 0%, #000 100%)```

* **keyframes($animation_name)** - helper to build out animation with regular and -webkit-prefixed declarations

	```shell
	@include keyframes(my-animation) {
		from { color: #fff; }
		to { color: #000; }
	}
	=>
	@-webkit-keyframes my-animation {
		from { color: #fff; }
		to { color: #000; }
	}
	@keyframes my-animation {
		from { color: #fff; }
		to { color: #000; }
	}
	```

### extends (in _mixins.scss)

See the [Sass documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) for more general instructions on using extends.

* **%wai** - styles that hide content visually while still making it accessible to screen readers
	
	```@extend %wai => margin: 0; padding: 0; position: absolute; text-indent: -9999em; -webkit-appearance: none; z-index: -1;```

###_normalize.scss

HTML default browser style overrides to reduce default cross-browser inconsistencies on HTML elements. Modified from [normalize.css](https://github.com/necolas/normalize.css).

### _variables.scss

Blank file to be used to store breakpoints, colors, and other values that will be commonly reused in your code, such as:

```shell
$large_mobile: 500px;
$end_mobile: 800px;
$purple: #4b0062;
$purple_dk: #2f003d;
```

## Ready?

Go forth and make internet!