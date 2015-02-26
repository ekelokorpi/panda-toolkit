# Panda Toolkit

### Command-line interface

With Panda Toolkit, you can build and manage your game projects.

## Install

Make sure you got [Node.js](http://nodejs.org/) installed first.

    $ sudo npm install -g pandatool

## Usage
    
    $ panda <command> [options]

## Commands

- `build` Build project
- `create <name> [dev]` Create new project. Use `dev` parameter for develop version
- `update [dev]` Update engine. Use `dev` parameter for develop version

## Example

	$ panda create MyPandaGame
	Creating new project...
	Done
	$ cd MyPandaGame
	$ panda build
	Building project...

Now you will have minified `game.min.js` file in your project folder.

You can also use Panda Toolkit as npm module:

```javascript
var panda = require('pandatool');

panda.build('/path/to/MyPandaGame', function(err) {
    if (err) console.log(err);
});
```
