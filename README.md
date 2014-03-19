## Panda.js node toolkit

### Install

    $ npm install pandajs -g

### Usage
    
    $ panda [command]

### Commands

- `build` Build game

    Parameters:
    
    - `configFile` Filename of config file _(src/game/config.js)_

- `offline` Create cache manifest

    Parameters:

     - `cacheFile` Filename of cache file _(game.cache)_
    
     - `gameFile` Filename of game file _(game.min.js)_
    
     - `mediaDir` Directory of media files _(media)_

- `server` Start local web server

    Parameters:

    - `port` Server port _(5975)_