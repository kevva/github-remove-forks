# github-remove-forks [![Build Status](http://img.shields.io/travis/kevva/github-remove-forks.svg?style=flat)](https://travis-ci.org/kevva/github-remove-forks)

> Remove all forked repositories


## Install

```
$ npm install --save github-remove-forks
```


## Usage

```js
var githubRemoveForks = require('github-remove-forks');

githubRemoveForks({token: '523ef691191'}, function (err, data) {
	console.log('Successfully remove all forked repositories');
});
```


## API

### githubRemoveForks(options, callback)

#### options.token

*Required*  
Type: `string`

Token to authenticate with. If you don't have a token you can generate a new one [here](https://github.com/settings/tokens/new).

#### callback(err, data)

Type: `function`

##### data

Type: `array`

An array containing all removed repositories.


## CLI

```sh
$ npm install --global github-remove-forks
```

```sh
$ github-remove-forks --help

  Usage
    $ github-remove-forks --token 523ef69119

  Options
    -t, --token      Github token to authenticate with
    -v, --verbose    Show detailed output
```


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
