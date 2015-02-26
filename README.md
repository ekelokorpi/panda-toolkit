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
- `create [name]` Create new project
- `update` Update engine

## Example

	$ panda create MyPandaGame
	Creating new project...
	Done
	$ cd MyPandaGame
	$ panda build
	Building project...

Now you will have minified `game.min.js` file in your project folder.
