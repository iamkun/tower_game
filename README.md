[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

English | [简体中文](./README.zh-CN.md)

<h1 align="center">Tower Building Game</h1>
<p align="center"><img src="https://o2qq673j2.qnssl.com/tower-loading.gif"/></p>

> a tower building game based on ES6 and Canvas (Tower Bloxx Deluxe Skyscraper)

## Demo
<p align="center"><img src="https://user-images.githubusercontent.com/17680888/47480922-93a20c00-d864-11e8-8f7c-6d1d60184730.gif"/></p>
<h2 align="center"><a href="https://iamkun.github.io/tower_game">Link to online Demo (Demo Link)</a></h2>
<h4 align="center">Mobile Devices can scan following QR code:</h4>
<p align="center">
  <img src="https://user-images.githubusercontent.com/17680888/47480646-abc55b80-d863-11e8-9337-4ea768ebe55d.png" />
</p>

## Game Rule

The following are the default game rule:

- In every game player starts with 3 hp. Every time a Tower block is dropped player is deduct 1 hp; game ends when hp is depleted.

- Player is rewarded with 25 point for every succesful stacked blocks(Success). If a block is stacked pefectly (Perfect) on top of the previous one, then player
rewarded with 50 points instead. Consecutive Perfects awards additional 25 points.

**Note: Each Success or Perfect constitutes a floor**

  For example, the first Perfect awards 50 point. The second consecutive Perfect awards 75 points.
 The third consecutive Perfect awards 100 points.  etc.

<p align="center">
  <img width="550" src="https://user-images.githubusercontent.com/17680888/47473105-d9021180-d843-11e8-8c19-b6b78d86cbdf.png" />
</p>

## Customizing the game rule

```
git clone https://github.com/iamkun/tower_game.git
cd tower_game
npm install
npm start
```
Open `http://localhost:8082` in a web browser.

- To customize image and sound resource files directly replace the corresponding file under `assets` directory.
- To customize game rules modify the `option` object in `index.html`.

## Option

Use following table of `option` constants to complete customization of game rules.

**Note: all constants are optionally included**

| Option | Type | Description |
|---------|--------|-------------|
| width          | number | Width of game interface |
| height         | number | Height of game interface |
| canvasId       | string | DOM ID in Canvas |
| soundOn        | boolean | If sound is on |
| successScore   | number | Points awarded for success |
| perfectScore   | number | Additional points awarded for perfect |
| <a href="#hookspeed">hookSpeed</a> | function | Speed of hook's movement |
| <a href="#hookangle">hookAngle</a> | function | Angle of hook |
| <a href="#landblockspeed">landBlockSpeed</a> | function | Speed of block sway |
| <a href="#setgamescore">setGameScore</a> | function | hook for current score |
| <a href="#setgamesuccess">setGameSuccess</a> | function | hook for number of current succesful game |
| <a href="#setgamefailed">setGameFailed</a> | function | hook for number of current failed game |

#### hookSpeed
Speed of hook's movement
This function takes in two parameters, currentFloor and currentScore, and returns a speed value.
```
function(currentFloor, currentScore) {
  return number
}
```

#### hookAngle
Angle of hook
This function takes in two parameters, currentFloor and currentScore, and returns a angle value.
```
function(currentFloor, currentScore) {
  return number
}
```

#### landBlockSpeed
Speed of block sway
This function takes in two parameters, currentFloor and currentScore, and returns a speed value.
```
function(currentFloor, currentScore) {
  return number
}
```

#### setGameScore
hook for current score
This function takes in one parameters, score, and sets currentScore to score.
```
function(score) {
  // your logic
}
```

#### setGameSuccess
hook for number of current succesful game
This function takes in one parameters, score, and sets GameSuccess to successCount.
```
function(successCount) {
  // your logic
}
```

#### setGameFailed
hook for number of current failed game
This function takes in one parameters, score, and sets GameFailed to failedCount.
```
function(failedCount) {
  // your logic
}
```

## License

MIT license.
