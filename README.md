#boilerplum
> A quick 'n' dirty UI sketchpad for proof-of-conceptin', script testin', or just-let-me-tryin'.

##Boiled plums?
Not really.

##Installation
Who needs a solid foundation when you can have a [Slush](http://slushjs.github.io/)-y one? Boilerplum is a slush generator that creates a small local development environment suited for UI developers low on time and high on ambition.

If you already have Slush set up on your computer, jump on ahead to [The Next Step](#next-step). If you have no idea what I am talking about, then you are going to need to:

1. Install [Node.js](http://nodejs.org/). The download should also include [npm](https://www.npmjs.org/), the node package manager.

2. If for some reason npm does not install (test by running `npm` in the command line after you have installed node), install it manually by running the command:
```
$ curl http://npmjs.org/install.sh | sh
```

3. Install slush:
```
$ npm install -g slush
```

4. If you want to avoid wearing out your Ctrl+F5 keys (or Command+R on Mac), you should set up your favorite browser with the [LiveReload extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-). If enabled, your local app will refresh the browser automatically when files change as the app is running.

###<b id="next-step"></b>The Next Step
Boilerplum is still a work in progress, so it will not be published in the npm directory. To run the generator, you will need to clone the repository locally and link it up to npm. Find a nice, quiet, out-of-the-way directory on your machine, and run:

```
git clone https://github.com/s-plum/boilerplum.git
```

After the depository is cloned, jump into the ```boilerplum``` directory and run:

```
npm link
```

You may need to run the command as an administratior, depending on how permissions are configured on your machine.


##Boiling Plums
Create a new directory and direct a new command/terminal window to that path. Run:

```
slush boilerplum
```

Assuming I haven't broken something, this should initialize boilerplum setup. Boilerplum will ask you a few quick questions, work a little magic, set up a new folder structure within the target folder, and install all the necessary dependencies to run your local environment. 

After dependencies are installed, you can initialize file watching, live reload, and compilation by running 

```
gulp
```

from the target folder.

##Out of the Box
Boilerplum sets up a default file structure of:

```shell
[your target folder]
├──  .sass-cache
│    └── *
├──  build
│    ├──  css
│    │	  ├──  src
│    │    │	   ├──  _functions.scss
│    │    │    ├──  _mixins.scss
│    │    │    ├──  _normalize.scss
│    │    │    ├──  _variables.scss
│    │    │    └──  global.scss
│    │    ├──  img
│    │    │    └──  *
│    │    ├──  index.html
│    │    ├──  js
│    │    │    └──  main.js
├──  dist 
│    └── * (output files will be created here)
├──  node_modules (once dependencies are installed)
│    └── *
├──  .gitignore (only if you ask for git setup in the initial configuration questions)
├──  config.rb
├──  gulpfile.js
├──  package.json
└──  README.md (only if you ask for git setup in the initial configuration questions)
```

## Working With Boilerplum
When you run `gulp` in your newly plum-boiled folder, the application will:

1. Start up a local instance of your index.html file at localhost:4242
2. Set a watch on your html, css, js, and image files that will automatically reload the instance in the browser as files change (if LiveReload extension is installed in your browser).
3. Initializes [Compass](//http://compass-style.org/) compilation of .scss files

The output for all processes will be logged in the terminal/command prompt window. Once all of the initialization processes have fired successfully, you can navigate to localhost:4242 in any browser on your local machine to should see a blank page with the title you provided in the template setup as the page title. Once everything is up and running, you can dive right in and start adding and editing files within the default folder structure. 

## Batteries Not Included (but Sass functions are)
The ```global.scss``` file in your ```css/src``` folder imports a few partials to help kick off your Sass-y style sheets:

###_functions.scss

* **rem($pixels)** - returns the rem equivalent of a pixel measurement

	```rem(22) => 1.375rem```
* **pem($pixels)** - returns the em equivalent of a pixel measurement

	```pem(16) => 1em```


###_mixins.scss

* **breakpoint($break)** - shorthand for media queries

	```@include breakpoint(600px) => @media screen and (min-width: 600px)```
* **filter($params)** - returns standard and browser-prefixed styles for the filter attribute
	
	```@include filter(grayscale(50%)) => -webkit-filter: grayscale(50%); filter: grayscale(50%);```

* **linear-gradient($fallback, $direction, $colorstops...)** - linear gradient background with solid color fallback support for older browsers

	```@include linear-gradient(#fff, to bottom, #fff 0%, #000 100%)```

* **display-flex** - returns prefixed properties for the flexbox display: flex property

	```@include display-flex => display: -ms-flex; display: -webkit-flex; display: flex;```
* **flex-property($property, $value)** - returns prefixed properties for flexbox style attributes
	
	```@include flex-property(justify-content, flex-start) => -ms-justify-content: flex-start; -webkit-justify-content: flex-start; justify-content: flex-start;
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
* **animation($params)** - returns standard and -webkit-prefixed animation declaration
	
	```@include animation(my-animation 1s linear infinite) => -webkit-animation: my-animation 1s linear infinite; animation: my-animation 1s linear infinite;```

* **squishy-sprite($sprite, $index)** - to make sprite images responsive, so they can be sized relative to their container without worrying about improper background positioning moving the sprite as the window resizes. Best used when combined with [Compass sprites](http://compass-style.org/help/tutorials/spriting/) and [Sass for loops](http://thesassway.com/intermediate/if-for-each-while).

	```shell
	@for $i from 1 through length(sprite-names($share)) {
			$name: nth(sprite-names($share), $i);
			&.#{$name} {
				&:before {
					@include share-sprite($name);
					@include squishy-sprite($share, $i);
				}
				&:hover:before, &:focus:before {
					@include share-blue-sprite($name);
					@include squishy-sprite($share, $i);
				}
			}
		}
	```

###extends (in _mixins.scss)

See the [Sass documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) for more general instructions on using extends.

* **%borderbox** - adds prefixing for box-sizing
	
	```@extend %borderbox => -moz-box-sizing: border-box; box-sizing: border-box;```

* **%wai** - styles that hide content visually while still making it accessible to screen readers
	
	```@extend %wai => margin: 0; padding: 0; position: absolute; text-indent: -9999em; -webkit-appearance: none; z-index: -1;```

###_normalize.scss

HTML default browser style overrides to reduce default cross-browser inconsistencies on HTML elements. Modified from [normalize.css](https://github.com/necolas/normalize.css).

###_variables.scss

Blank file to be used to store breakpoints, colors, and other values that will be commonly reused in your code

```shell
$large_mobile: 500px;
$end_mobile: 800px;
$purple: #4b0062;
$purple_dk: #2f003d;
```

##Ready?

Go forth and make internet!