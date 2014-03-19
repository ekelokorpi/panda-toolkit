## Panda.js node toolkit

### Install

    $ npm install -g pandajs

### Usage
    
    $ panda [command]

### Commands

- `build [configFile]` Build game

    _configFile_ Filename of config file _(default: src/game/config.js)_

- `offline [cacheFile] [gameFile] [mediaDir]` Create cache manifest

    _cacheFile_ Filename of cache file _(default: game.cache)_
    _gameFile_ Filename of game file _(default: game.min.js)_
    _mediaDir_ Directory of media files _(default: media)_

- `server [port]` Start local web server

    _port_ Server port _(default: 5975)_