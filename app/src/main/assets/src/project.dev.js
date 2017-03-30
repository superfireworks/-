require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BackView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '66e42cWbV9IKKctblOoTcf+', 'BackView');
// scripts\common\BackView.js

var game = require('../common/Game');
var device = require('../common/Device');
var maincfg = require('../common/maincfg');
var analytics = require('../common/analytics');

var BackView = cc.Class({
  'extends': cc.Component,
  properties: {},
  // use this for initialization
  onLoad: function onLoad() {
    var listener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function onTouchBegan(touche, event) {
        event.stopPropagationImmediate();
        return true;
      },
      onTouchMoved: function onTouchMoved() {},
      onTouchEnded: function onTouchEnded() {},
      onTouchCancelled: function onTouchCancelled() {}
    };
    cc.eventManager.addListener(listener, this.node);
  },
  setGameKey: function setGameKey(game_key) {
    this.game_key = game_key;
  },
  onNo: function onNo() {
    cc.director.resume();
    this.node.removeFromParent();

    _one = null;
    analytics.buttonEvent('back_no_button');
  },
  onYes: function onYes() {

    _one = null;
    analytics.buttonEvent('back_yes_button');

    cc.director.resume();
    cc.audioEngine.end();
    maincfg.page = 1;
    maincfg.test = this.game_key;

    if (maincfg.accStatus == true) {
      cc.inputManager.setAccelerometerEnabled(false);
      maincfg.accStatus = false;
    }

    cc.director.loadScene('MainScene');

    game.postGameScore(this.game_key, 'N/A', false);

    if (device.intentGameId() != '') {
      // return device.exitMe();
      return cc.director.end();
    }
  }
});

var _one = null;
BackView.show = function (game_key) {
  if (_one) return;
  var winSize = cc.director.getWinSize();
  var prefab = cc.loader.getRes('prefabs/backView');
  var newNode = cc.instantiate(prefab);
  _one = newNode;
  newNode.setPosition(cc.v2(winSize.width / 2, winSize.height / 2));
  newNode.getComponent(BackView).setGameKey(game_key);
  var scene = cc.director.getScene();
  scene.addChild(newNode, 20);
  if (!cc.director.isPaused()) {
    setTimeout(function () {
      cc.director.pause();
    }, 1 / 20);
  }
  analytics.buttonEvent('back_key');
};

module.exports = BackView;

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/analytics":"analytics","../common/maincfg":"maincfg"}],"ButtonScaler":[function(require,module,exports){
"use strict";
cc._RFpush(module, '36fccTNV6dFY6YSuOz2SfUv', 'ButtonScaler');
// scripts\common\ButtonScaler.js

cc.Class({
    'extends': cc.Component,

    properties: {
        pressedScale: 0.9,
        transDuration: 0.1
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;

        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown(event) {
            this.stopAllActions();
            this.scale = 1;
            this.runAction(self.scaleDownAction);
        }
        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});

cc._RFpop();
},{}],"Button":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3b5440uOD9I9oosTW8ti5OX', 'Button');
// scripts\main\Button.js

cc.Class({
    "extends": cc.Component,

    properties: {
        game_key: String
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},
    setGameKey: function setGameKey(str) {
        this.game_key = str;
    },
    getGameKey: function getGameKey() {
        return this.game_key;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Confirm":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd303dKE1A9BZrk1Ppji5lM5', 'Confirm');
// scripts\common\Confirm.js

var Confirm = cc.Class({
    'extends': cc.Component,

    properties: {
        msg: cc.Label,
        btn1: cc.Button,
        btn2: cc.Button,
        mask: cc.Node
    },
    onLoad: function onLoad() {

        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(touche, event) {
                event.stopPropagationImmediate();
                return true;
            },
            onTouchMoved: function onTouchMoved() {},
            onTouchEnded: function onTouchEnded() {},
            onTouchCancelled: function onTouchCancelled() {}
        };
        cc.eventManager.addListener(listener, this.mask);
    },
    init: function init(msg, cb) {
        this.msg.string = msg;
        this.cb = cb;
    },
    onYes: function onYes() {
        this.cb(true);
        this.node.removeFromParent();
    },
    onNo: function onNo() {
        this.cb(false);
        this.node.removeFromParent();
    }
});

module.exports = function (msg, cb) {
    var prefab = cc.loader.getRes('prefabs/confirm');
    var newNode = cc.instantiate(prefab);
    var size = cc.director.getWinSize();
    newNode.setPosition(cc.v2(size.width / 2, size.height / 2));
    newNode.getComponent(Confirm).init(msg, cb);
    cc.director.getScene().addChild(newNode);
    return newNode;
};

cc._RFpop();
},{}],"EatGroup":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f15c4Jrhc9JSK9PeF+0I63b', 'EatGroup');
// scripts\04\EatGroup.js

cc.Class({
    "extends": cc.Component,
    properties: {
        spacingMinValue: 250,
        spacingMaxValue: 300,
        eats: [cc.Node],
        eatMoveSpeed: 200
    },

    init: function init(eatManager, speed, move, index) {
        this.eatManager = eatManager;
        this.eatMoveSpeed = speed;
        this._initPositionX();
        this._initPositionY(move, index);
    },
    _initPositionX: function _initPositionX() {
        var visibleSize = cc.director.getVisibleSize(); // 场景可见区域大小
        var sceneLeft = -visibleSize.width / 2; // Canvas锚点在中心，Canvas的左侧就是在锚点左边距离一半宽度的地方
        var sceneRight = visibleSize.width / 2; // Canvas锚点在中心，Canvas的右侧就是在锚点右边距离一半宽度的地方
        this.node.x = sceneRight + 300;
        this.recylceX = sceneLeft - this.node.width;
    },
    _initPositionY: function _initPositionY(move, index) {
        var visibleSize = cc.director.getVisibleSize();
        var topEatMaxY = visibleSize.height - 100;
        var bottomEatMinY = 100;
        var spacing = this.spacingMinValue + Math.random() * (this.spacingMaxValue - this.spacingMinValue);

        var gen = [];

        //随机生成三个数字
        if (move != 1) {
            for (var i = 0; i < 3; i++) {
                gen.push(this.getRandomNum(1, 100));
            }
            console.log(gen);
            gen.sort(function (a, b) {
                return a - b;
            });

            if (gen[1] - gen[0] < 10) {
                gen[1] += 10 - (gen[1] - gen[0]);
                gen[2] += 10 - (gen[1] - gen[0]);
            }
            if (gen[2] - gen[1] < 10) {
                gen[2] += 10 - (gen[2] - gen[1]);
            }
            //乱序
            this.sortRandom(gen);
            console.log(gen);

            gen.push(100);
        }

        for (var i = this.eats.length - 1; i >= 0; i--) {
            var eat = this.eats[i];

            if (move == 1) {

                if (i <= 2) {
                    eat.y = -9999;
                } else {
                    var num = this.getRandomNum(1, 100);
                    eat.y = topEatMaxY * num / 100;
                }
            } else {

                if (Math.random() > 0.4) {
                    // eat.y = topEatMaxY - Math.random() * (topEatMaxY - bottomEatMinY - spacing);
                    //var num = this.getRandomNum(1,100);
                    eat.y = topEatMaxY * gen[i] / 100;
                    console.log(eat.y);
                } else {
                    eat.y = -9999;
                }

                if (i == 3) eat.y = -9999;
            }

            if (index <= 0) {
                eat.y = -9999;
            }
        }
    },

    update: function update(dt) {
        if (!this.eatManager || !this.eatManager.isRunning) {
            return;
        }
        this.node.x += this.eatMoveSpeed * dt;

        if (this.node.x < 0) {
            this.node.active = false;
            this.eatManager.recycleEat(this);
        }
    },

    getRandomNum: function getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.round(Rand * Range);
    },

    sortRandom: function sortRandom(o) {
        //v1.0
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
});

cc._RFpop();
},{}],"EatManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a5da4hH+RJL6Z0z6m/5VWTk', 'EatManager');
// scripts\04\EatManager.js

var EatGroup = require('EatGroup');

cc.Class({
    "extends": cc.Component,

    properties: {
        eatPrefab: cc.Node,
        eatMoveSpeed: -120,
        eatSpacing: 300,
        index: 0
    },

    onLoad: function onLoad() {
        this.change = false;
        this.eatList = [];
        this.isRunning = false;

        this._time = 0;
    },

    startSpawn: function startSpawn() {
        this._spawnEat();
        var spawnInterval = Math.abs(this.eatSpacing / this.eatMoveSpeed);
        this.schedule(this._spawnEat, 1.5);
        this.isRunning = true;
    },

    _spawnEat: function _spawnEat() {

        console.log("_spawnEat");

        var eatGroup = null;
        if (cc.pool.hasObject(EatGroup)) {
            eatGroup = cc.pool.getFromPool(EatGroup);
        } else {
            eatGroup = cc.instantiate(this.eatPrefab).getComponent(EatGroup);
        }
        this.node.addChild(eatGroup.node);
        eatGroup.node.active = true;

        var num = this.getRandomNum(1, 3);
        if (num == 3) eatGroup.init(this, this.eatMoveSpeed - 400, 1, this.index);else eatGroup.init(this, this.eatMoveSpeed, 0, this.index);

        this.eatList.push(eatGroup);

        this.index++;
    },

    recycleEat: function recycleEat(eat) {
        eat.node.removeFromParent();
        eat.node.active = false;

        console.log("recycleEat");

        for (var i = 0; i < this.eatList.length; i++) {
            if (this.eatList[i].node.active == false) {
                console.log("splice");
                this.eatList.splice(i, 1);
            }
        }
        cc.pool.putInPool(eat);
    },

    /** 获取下个未通过的水管 */
    getNext: function getNext() {
        return this.eatList.shift();
    },

    reset: function reset() {
        this.unschedule(this._spawnEat);
        this.eatList = [];
        this.isRunning = false;
    },

    update: function update(dt) {
        this._time += dt;

        this.eatMoveSpeed = this.eatMoveSpeed - parseInt(this._time / 10) * 50;
        if (this.eatMoveSpeed < -400 && !this.change) {
            this.unschedule(this._spawnEat);
            this.schedule(this._spawnEat, 1);
            this.change = true;
        }
        if (this.eatMoveSpeed < -600) {
            this.eatMoveSpeed = -600;
        }
    },

    getRandomNum: function getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.round(Rand * Range);
    }
});

cc._RFpop();
},{"EatGroup":"EatGroup"}],"Fish":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1c3204B6MxM8Kaj/tIYN6oT', 'Fish');
// scripts\04\Fish.js



cc.Class({
    "extends": cc.Component,

    properties: {
        /** 上抛初速度，单位：像素/秒 */
        initRiseSpeed: 500,
        /** 重力加速度，单位：像素/秒的平方 */
        gravity: 1000,
        wudi: 0
    },

    init: function init(game) {
        this.game = game;
        this.currentSpeed = 0;
        this.isDead = false;
        this.anim = this.getComponent(cc.Animation);
    },

    startFly: function startFly() {
        this._getnextEat();
        this.rise();
    },

    _getnextEat: function _getnextEat() {
        this.nextEat = this.game.eatManager.getNext();
    },

    update: function update(dt) {
        if (this.isDead) {
            return;
        }
        this._updatePosition(dt);
        this._detectCollision();
    },

    _updatePosition: function _updatePosition(dt) {
        if (!this.isDead) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
            if (this.node.y < this.node.height / 2) {
                this.node.y = this.node.height / 2;
            }
            var visibleSize = cc.director.getVisibleSize();
            if (this.node.y >= visibleSize.height - this.node.height / 2) {
                this.node.y = visibleSize.height - this.node.height / 2;
            }
        }
    },

    _detectCollision: function _detectCollision() {
        var _this = this;

        console.log("this.game.eatManager.eatList.length  ", this.game.eatManager.eatList.length);
        for (var i = 0; i < this.game.eatManager.eatList.length; i++) {
            var curEat = this.game.eatManager.eatList[i];

            for (var _i = curEat.eats.length - 1; _i >= 0; _i--) {
                var eat = curEat.eats[_i];

                if (this._detectCollisionWithFish(eat)) {
                    if (_i < 2) {
                        // this.game.addHp();
                        if (_i == 0) this.game.addScore(10);else this.game.addScore(30);
                    } else {
                        if (this.wudi == 0) {
                            this.game.subHp();
                            this.wudi = 1;
                            var action = cc.blink(3, 15);
                            this.node.runAction(action);
                            setTimeout(function () {
                                _this.wudi = 0;
                            }, 3000);
                        }

                        //this.game.subScore(5);
                    }
                    eat.y = -999;
                }
            }
        }
        return;
        //if (!this.nextEat) {
        //    return;
        //}
        //if (this.isDead) {
        //    return;
        //}
        //for (let i = this.nextEat.eats.length - 1; i >= 0; i--) {
        //    let eat = this.nextEat.eats[i];
        //    console.log("eat",eat);
        //    if (this._detectCollisionWithFish(eat) ) {
        //        if( i < 2){
        //            // this.game.addHp();
        //            if(i ==0 )
        //                this.game.addScore(10);
        //            else
        //                this.game.addScore(30);
        //        }else{
        //            this.game.subHp();
        //
        //            //this.game.subScore(20);
        //        }
        //        eat.y = -999;
        //    }
        //}
        //
        //let fishLeft = this.node.x;
        //let eatRight = this.nextEat.node.x + this.nextEat.eats[0].width
        //let crossEat = fishLeft > eatRight;
        //if (crossEat) {
        //    this._getnextEat();
        //}
    },
    _detectCollisionWithFish: function _detectCollisionWithFish(otherNode) {
        if (!otherNode) return false;

        return cc.rectIntersectsRect(this.node.getBoundingBoxToWorld(), otherNode.getBoundingBoxToWorld());
    },

    rise: function rise() {
        this.currentSpeed = this.initRiseSpeed;
    }
});

cc._RFpop();
},{}],"GameTimer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bba02btUT5Ah6FQBr76rjof', 'GameTimer');
// scripts\common\GameTimer.js


var default_config = {
  step: 0.5,
  startTime: 0,
  max: Number.MAX_VALUE,
  over: function over() {}
};

var GameTimer = cc.Class({
  "extends": cc.Object,
  ctor: function ctor(config) {
    config = _.assign(default_config, config);
    this.startTime = config.startTime;
    this.step = config.step;
    this._time = 0;
  },
  start: function start() {
    this._time = this.startTime;
    this._timer = setInterval(this._onUpdate.bind(this), Math.abs(this.step * 1000));
  },
  _onUpdate: function _onUpdate() {
    this._time += this.step;
    if (this._time <= 0) {
      this.stop();
      this.over();
      return;
    }
    if (this._time >= this.max) {
      this.stop();
      this.over();
      return;
    }
  },
  getTime: function getTime() {
    return this._time.toFixed(2) * 1;
  },
  stop: function stop() {
    clearInterval(this._timer);
    this._timer = null;
  },
  release: function release() {
    this.stop();
    this.over = null;
  },
  isRuning: function isRuning() {
    return this._timer != null;
  }

});

module.exports = GameTimer;

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '625d2fFuQdF/ZfHf3L7PDl/', 'Game');
// scripts\common\Game.js

var config = require('./config');
var Confirm = require('./Confirm');
var maincfg = require('../common/maincfg');
var device = require('../common/device');

var Game = cc.Class({
  'extends': cc.Object,

  properties: {
    imode: 0
  },
  getMode: function getMode() {
    return this.imode;
  },
  init: function init() {
    //cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, _.once(this.preload.bind(this)));
  },
  preload: function preload() {
    cc.loader.loadResAll("prefabs", function (err, prefabs) {
      if (err) {
        return cc.log(err);
      }
      _.each(prefabs, function (prefab) {
        cc.assert(prefab instanceof cc.Prefab, '加载资源成功, 但该对象不是Prefab');
      });
    });
  },
  showTips: function showTips(str) {
    var prefab = cc.loader.getRes('prefabs/tip');
    var newNode = cc.instantiate(prefab);
    var size = cc.director.getWinSize();
    newNode.setPosition(cc.v2(size.width / 2, size.height / 2));
    newNode.getChildByName('label').getComponent(cc.Label).string = str;
    cc.director.getScene().addChild(newNode);
    setTimeout(function () {
      if (!newNode) return;
      newNode.removeFromParent();
    }, 3000);
  },
  confirm: function confirm(msg, cb) {
    return Confirm(msg, cb);
  },
  gameRecords: function gameRecords() {
    var _this = this;

    return _.map(config.games, function (item) {
      return _.assignIn({}, item, _this.getGameStoreData(item.key));
    });
  },
  findGameConfig: function findGameConfig(game_key) {
    var find_game = _.find(config.games, function (game) {
      return game.key == game_key;
    });
    return find_game;
  },
  getGameConfig: function getGameConfig(game_key) {
    var find_game = this.findGameConfig(game_key);
    cc.assert(find_game, 'game_key:' + game_key + ' not found!');
    return _.assignIn({}, find_game);
  },
  getGameStoreData: function getGameStoreData(game_key) {
    var str = cc.sys.localStorage.getItem(game_key) || '{}';
    var data = JSON.parse(str);
    var rev = {};
    rev.score = data.score;
    rev.date = data.date;
    rev.guide = data.guide;
    rev.is_success = data.is_success;
    return rev;
  },
  postGameScore: function postGameScore(game_key, score, is_success) {

    this.getGameConfig(game_key);
    var now = new Date();
    var gameData = this.getGameStoreData(game_key);
    gameData.date = now.getTime();
    gameData.score = score;
    // if (_.isNumber(score*1) && !Number.isNaN(score*1) ) {// && score > gameData.score
    //   gameData.score = score;
    // }

    //判定最高值
    //if( parseFloat(gameData.score ) > parseFloat( score )   ){
    //  gameData.score = score;
    //}
    //
    //if(gameData.score == undefined){
    //  gameData.score = score;
    //}

    gameData.is_success = is_success;
    cc.sys.localStorage.setItem(game_key, JSON.stringify(gameData));
  },
  showNextGame: function showNextGame(game_key) {
    if (this.imode == 1) {
      maincfg.page = 1;
      maincfg.test = game_key;
      cc.director.loadScene('MainScene');
      return true;
    }

    if (game_key == "proximity_sensor") {
      maincfg.page = 1;
      maincfg.test = game_key;
      cc.director.loadScene('MainScene');
      return true;
    }
    var index = _.findIndex(config.games, function (game) {
      return game.key == game_key;
    });
    cc.assert(index != -1, 'game_key:' + game_key + ' not found!');
    var game = config.games[index + 1];

    return this.showGame(game.key);
  },
  showGame: function showGame(game_key, imode) {
    this.imode = imode;
    var game_config = this.getGameConfig(game_key);
    this.cur_game = _.clone(game_config);

    cc.director.preloadScene(game_config.sceneName, function () {
      var reb = cc.director.loadScene(game_config.sceneName);
      //隐藏背景图
      // device.removeLaunchImage();
      return reb;
    });

    //let reb = cc.director.loadScene(game_config.sceneName);
  }
});

var game = new Game();
game.init();
module.exports = game;

cc._RFpop();
},{"../common/device":"device","../common/maincfg":"maincfg","./Confirm":"Confirm","./config":"config"}],"MainScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16aa9GNWwpPx6ePfwnfuaUf', 'MainScene');
// scripts\main\MainScene.js

var game = require('../common/Game');
var device = require('../common/device');
var config = require('../common/config');
var maincfg = require('../common/maincfg');
var analytics = require('../common/analytics');

cc.Class({
  'extends': cc.Component,

  properties: {
    start_node: cc.Node,
    test_mode_node: cc.Node,
    tc_node: cc.Node,
    itemTemplate: cc.Node,
    gameListContent: cc.Node,
    resultlist: cc.Node,
    mask: cc.Node
  },

  // use this for initialization
  onLoad: function onLoad() {
    var _this = this;

    cc.director.setDisplayStats(false);

    this.mask.active = true;
    this.backToStart();
    this.fillGameList();
    ////init db
    //cc.sys.localStorage.setItem('dbinit','1');
    //
    ////windTest
    //cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, _.once(this.preload.bind(this)));

    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function onKeyPressed(keyCode, event) {
        if (keyCode === cc.KEY.back || keyCode == 8 && cc.sys.isBrowser) {
          _this.onPressedBack();
        }
      }
    }, this.node);
    this._back = 0;

    var intentGameId = device.intentGameId();
    if (intentGameId != '') {
      var games = config.games;
      // let games = config.games.slice(0,Math.floor(config.games.length/2));
      var one = _.find(games, function (item) {
        return item.key == intentGameId;
      });
      if (one) {
        setTimeout(function () {
          game.showGame(intentGameId, 1);
        }, 1);
        return;
      } else {
        analytics.showToast('game_id:' + intentGameId + '  not found');
      }
    }
    this.mask.active = false;

    if (maincfg.page == 1) {
      this.tc_node.active = false;
      this.test_mode_node.active = false;
      this.start_node.active = false;
      this.resultlist.active = true;
      return;
    }

    if (maincfg.page == 2) {
      this.tc_node.active = false;
      this.test_mode_node.active = true;
      this.start_node.active = false;
      this.resultlist.active = false;
      return;
    }
  },
  onPressedBack: function onPressedBack() {
    var _this2 = this;

    if (this._back == 0) {
      analytics.showToast('press back again to exit game');
    }
    this._back += 1;
    if (this._back > 1) {
      cc.director.end();
    }
    setTimeout(function () {
      _this2._back = 0;
    }, 3000);
  },
  fillGameList: function fillGameList() {
    var _this3 = this;

    var spacing = 16;
    var games = game.gameRecords();
    var height = games.length * (this.itemTemplate.height + spacing) + spacing * 4;
    this.gameListContent.height = height;
    _.each(games, function (game, i) {
      var item = cc.instantiate(_this3.itemTemplate);
      item.active = true;
      _this3.gameListContent.addChild(item);
      item.setPosition(0, -item.height * (0.5 + i) - spacing * (i + 2));
      item.getComponentInChildren(cc.Label).string = '  ' + game.name;
      item.getComponentInChildren(cc.Label).node.x = 0;
      var btn = item.getComponentInChildren(cc.Button);
      btn.getComponent('Button').setGameKey(game.key);

      var eventHandler = new cc.Component.EventHandler();
      eventHandler.target = _this3;
      eventHandler.component = "MainScene";
      eventHandler.handler = "onGameItemClick";
      btn.clickEvents = [eventHandler];
    });
  },
  onGameItemClick: function onGameItemClick(e) {
    var game_key = e.currentTarget.getComponent('Button').getGameKey();
    if (game_key == "all") {
      game.showGame("screen", 0);
      return;
    }
    var ret = game.showGame(game_key, 1);
    if (!ret) {
      return game.showTips('In development ...');
    }
  },
  startAll: function startAll() {},
  backToStart: function backToStart() {
    this.tc_node.active = false;
    this.test_mode_node.active = false;
    this.start_node.active = true;
    this.resultlist.active = false;
  },
  showSimple: function showSimple() {
    game.showTips('In development ...');
  },
  showTestMode: function showTestMode() {
    this.tc_node.active = false;
    this.test_mode_node.active = true;
    this.start_node.active = false;
  },
  showTc: function showTc() {
    this.tc_node.active = true;
    this.start_node.active = false;
    this.test_mode_node.active = false;
  },

  showRecord: function showRecord() {
    //game.showTips('In development ...');

    this.tc_node.active = false;
    this.start_node.active = false;
    this.test_mode_node.active = false;
    this.resultlist.active = true;
  }

});

cc._RFpop();
},{"../common/Game":"Game","../common/analytics":"analytics","../common/config":"config","../common/device":"device","../common/maincfg":"maincfg"}],"PauseBtn":[function(require,module,exports){
"use strict";
cc._RFpush(module, '72199b46Z9Pzp6e9gZAs3uf', 'PauseBtn');
// scripts\common\PauseBtn.js

var game = require('../common/Game');
var device = require('../common/Device');
var analytics = require('../common/analytics');
var BackView = require('./BackView');

cc.Class({
  'extends': cc.Component,

  properties: {
    game_key: cc.String
  },
  onLoad: function onLoad() {
    var _this = this;

    var find_game = game.findGameConfig(this.game_key);
    cc.assert(find_game, 'PauseBtn game_key:' + this.game_key + ' not found!');

    analytics.startGame(this.game_key);

    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function onKeyPressed(keyCode, event) {
        if (keyCode === cc.KEY.back || keyCode == 8 && cc.sys.isBrowser) {
          _this.onPressedBack();
        }
      }
    }, this.node);
  },
  onPressedBack: function onPressedBack() {
    // BackView.show(this.game_key);
    this.onClick();
  },
  onDisable: function onDisable() {
    analytics.endGame(this.game_key);
  },
  onClick: function onClick() {
    if (cc.director.isPaused()) return;
    var winSize = cc.director.getWinSize();

    var prefab = cc.loader.getRes('prefabs/pauseView');
    var newNode = cc.instantiate(prefab);
    newNode.setPosition(cc.v2(winSize.width / 2, winSize.height / 2));
    newNode.getComponent('pauseView').setGameKey(this.game_key);
    var scene = cc.director.getScene();
    scene.addChild(newNode, 10);

    setTimeout(function () {
      cc.director.pause();
    }, 1 / 30);

    analytics.buttonEvent('pause_button');
  }
});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/analytics":"analytics","./BackView":"BackView"}],"Scroller":[function(require,module,exports){
"use strict";
cc._RFpush(module, '93a0c+Mok5GK70daSAFZjeo', 'Scroller');
// scripts\04\Scroller.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // 滚动的速度，单位px/s
        speed: -300,
        // x到达此位置后开始重头滚动
        startX: 360,
        resetX: -360
    },

    onLoad: function onLoad() {
        this.canScroll = true;
    },

    update: function update(dt) {
        if (!this.canScroll) {
            return;
        }
        this.node.x += this.speed * dt;
        if (this.node.x <= this.resetX) {
            this.node.x = this.startX;
        }
    },

    stopScroll: function stopScroll() {
        this.canScroll = false;
    },

    startScroll: function startScroll() {
        this.canScroll = true;
    }
});

cc._RFpop();
},{}],"SliderBar":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a07e51AipZI9rU0ykcThvVl', 'SliderBar');
// scripts\01\SliderBar.js

cc.Class({
  "extends": cc.Component,

  properties: {
    slide: cc.Node,
    slide_bg: cc.Node
  },
  onLoad: function onLoad() {
    this.slide_pos = _.clone(this.slide.position);
    this.bg_box = this.slide_bg.getBoundingBoxToWorld();
    this.initTouch();
    this.enable();
  },
  onSlide: function onSlide(fn) {
    this.onSlideCB = fn;
  },
  enable: function enable() {
    this._enable = true;
  },
  disable: function disable() {
    this._enable = false;
  },
  initTouch: function initTouch() {
    var _this = this;

    this.slide_bg.active = true;
    this.slide.position = this.slide_pos;

    var is_complete = false;
    var touchEnd = function touchEnd(touche) {
      _this.slide.position = _this.slide_pos;
      if (!is_complete) {
        return;
      }
      _this.onSlideCB && _this.onSlideCB();
    };
    var listener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function onTouchBegan(touche) {
        if (!_this._enable) return false;
        var rect = _this.slide.getBoundingBoxToWorld();
        var reb = cc.rectContainsPoint(rect, touche.getLocation());
        if (reb) {
          return true;
        }
        return false;
      },
      onTouchMoved: function onTouchMoved(touche) {
        var location = touche.getLocation();
        var pos = _this.slide.getParent().convertToNodeSpace(location);
        _this.slide.position = cc.v2(pos.x, _this.slide_pos.y);
        if (location.x + _this.slide.getContentSize().width / 2 >= _this.bg_box.x + _this.bg_box.width) {
          is_complete = true;
        }
      },
      onTouchEnded: touchEnd,
      onTouchCancelled: touchEnd
    };
    this._slide_listener = cc.eventManager.addListener(listener, this.slide);
  }

});

cc._RFpop();
},{}],"analytics":[function(require,module,exports){
"use strict";
cc._RFpush(module, '217afssHVREaIAVKl0vgS0w', 'analytics');
// scripts\common\analytics.js

var is_android = cc.sys.isNative;

var AnalyticsUtil = {
  startGame: function startGame(pageName) {
    if (!is_android) return cc.log('Analytics - startPage : ' + pageName);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/AnalyticsUtil", "startPage", "(Ljava/lang/String;)V", pageName);
  },
  endGame: function endGame(pageName) {
    if (!is_android) return cc.log('Analytics - endPage : ' + pageName);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/AnalyticsUtil", "endPage", "(Ljava/lang/String;)V", pageName);
  },
  buttonEvent: function buttonEvent(buttonName) {
    if (!is_android) return cc.log('Analytics - buttonEvent : ' + buttonName);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/AnalyticsUtil", "buttonEvent", "(Ljava/lang/String;)V", buttonName);
  },
  isAppInstalled: function isAppInstalled(packageName) {
    if (!is_android) return true;
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/AnalyticsUtil", "isAppInstalled", "(Ljava/lang/String;)Z", packageName);
  },
  showToast: function showToast(msg) {
    if (!is_android) return cc.log('showToast : ' + msg);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/AnalyticsUtil", "showToast", "(Ljava/lang/String;)V", msg);
  }

};

module.exports = AnalyticsUtil;

cc._RFpop();
},{}],"closeADbg":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0efd6HYnDZKPYcCdf0yhSFs', 'closeADbg');
// scripts\common\closeADbg.js

var device = require('../common/device');

cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.closeADbg.bind(this));
    },

    closeADbg: function closeADbg() {
        //隐藏背景图
        device.removeLaunchImage();
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.closeADbg.bind(this));
    }

});

cc._RFpop();
},{"../common/device":"device"}],"config":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a1193BfdGBGv7GglZ8Qd679', 'config');
// scripts\common\config.js

var config = {};

config.games = [{ name: 'Touch Screen', key: 'screen', sceneName: '01', need_score: true, score_unit: 's' }, { name: 'Display', key: 'display', sceneName: '02', need_score: true, score_unit: 's' }, { name: 'Speaker', key: 'speaker', sceneName: '03', need_score: true, score_unit: 's' }, { name: 'Microphone', key: 'microphone', sceneName: '04', need_score: true, score_unit: '' }, { name: 'Cameras', key: 'cameras', sceneName: '05', need_score: true, score_unit: '' }, { name: 'Flashlight', key: 'flashlight', sceneName: '06', need_score: true, score_unit: 's' }, { name: 'Vibrator', key: 'vibrator', sceneName: '07', need_score: true, score_unit: '' }, { name: 'Volume Keys', key: 'volume_keys', sceneName: '08', need_score: true, score_unit: '' }, { name: 'Gyroscope', key: 'gyroscope', sceneName: '10', need_score: true, score_unit: 's' }, { name: 'Accelerometer', key: 'accelerometer', sceneName: '11', need_score: true, score_unit: 's' }, { name: 'Proximity Sensor', key: 'proximity_sensor', sceneName: '12', need_score: true, score_unit: '' }, { name: 'Test All Above', key: 'all', sceneName: '-1', need_score: false, score_unit: '' }];

module.exports = config;

cc._RFpop();
},{}],"device":[function(require,module,exports){
"use strict";
cc._RFpush(module, '404fayhtOJKMZMv7IRtXXae', 'device');
// scripts\common\device.js

var is_android = cc.sys.isNative;

var volumeChangeFunc = null;
window.__onVolumeChange = function (value) {
  var v = parseInt(value);
  volumeChangeFunc && volumeChangeFunc(v);
};

var Device = cc.Class({
  "extends": cc.Object,
  init: function init() {

    // cc.director.end = function (){
    //   alert('end end');
    // };

  },
  exitMe: function exitMe() {
    if (!is_android) return cc.log('device exitMe');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/AnalyticsUtil", "finishActivity", "()V");
  },
  intentGameId: function intentGameId() {
    // return 'screen';
    if (!is_android) {
      // cc.log('intentGameId');
      return '';
    }
    if (this._intentGameId) return this._intentGameId;

    this._intentGameId = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/IntentUtil", "getGameId", "()Ljava/lang/String;");
    return this._intentGameId;
  },
  flash: function flash() {
    if (!is_android) return cc.log('device flash');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/LightUtils", "openLight", "()V");
    //setTimeout(()=>{
    //  jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/LightUtils", "closeLight", "()V");
    //},1000);
  },

  flashStop: function flashStop() {
    if (!is_android) return cc.log('device flash');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/LightUtils", "closeLight", "()V");
  },

  vibrator: function vibrator() {
    if (!is_android) return cc.log('device vibrator');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/VibratorUtil", "Vibrate", "(I)V", 200);
  },
  recordStart: function recordStart() {
    this._recording = true;
    if (!is_android) return cc.log('recordStart');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/RecordManager", "start", "()V");
  },
  recordStop: function recordStop() {
    cc.assert(this._recording, '请先调用recordStart');
    this._recording = false;
    if (!is_android) {
      return cc.log('recordStop');
    }
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/RecordManager", "stop", "()V");
  },
  getDecibel: function getDecibel() {
    cc.assert(this._recording, '请先调用recordStart');
    if (!is_android) {
      cc.log('getDecibel');
      return 1;
    }
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/RecordManager", "getDecibel", "()I");
  },
  playRecord: function playRecord() {
    cc.assert(!this._recording, '请先调用recordStop');
    if (!is_android) return cc.log('playRecord');
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/RecordManager", "playRecord", "()V");
  },

  proximityStart: function proximityStart(cb) {
    this._proximitying = true;
    var fn_name = bind_cb(cb);
    this._proximitying_fn_name = fn_name;
    if (!is_android) return cc.log('proximityStart');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/ProximitySensorUtils", "start", "(Ljava/lang/String;)V", fn_name);
  },
  proximityStop: function proximityStop() {
    cc.assert(this._proximitying, '请先调用proximityStart');
    this._proximitying = false;
    window[this._proximitying_fn_name] = null;
    this._proximitying_fn_name = null;
    if (!is_android) {
      return cc.log('proximityStop');
    }
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/ProximitySensorUtils", "stop", "()V");
  },

  volumeStart: function volumeStart(cb) {
    volumeChangeFunc = cb;
    // this._volumeing = true;
    // let fn_name = bind_cb(cb);
    // this._volume_fn_name = fn_name;
    // if (!is_android) return cc.log('volumeStart');
    // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/VolumeUtils", "start", "(Ljava/lang/String;)V", fn_name);
  },
  volumeStop: function volumeStop() {
    volumeChangeFunc = null;
    // cc.assert(this._volumeing, '请先调用volumeStart');
    // this._volumeing = false;
    // window[this._volume_fn_name] = null;
    // this._volume_fn_name = null;
    // if (!is_android) {
    //   return cc.log('volumeStop');
    // }
    // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/utils/VolumeUtils", "stop", "()V");
  },
  cameraStart: function cameraStart(camrea_id) {
    this._cameraing = true;
    if (!is_android) return cc.log('cameraStart');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraAndroid", "show", "(I)V", camrea_id);
  },
  cameraStop: function cameraStop() {
    // cc.assert(this._cameraing,'请先调用cameraStart');
    this._cameraing = false;
    if (this.cameraCapture_cb_name) window[this.cameraCapture_cb_name] = null;
    this.cameraCapture_cb_name = null;
    if (!is_android) {
      return cc.log('cameraStop');
    }
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraAndroid", "close", "()V");
  },
  cameraCapture: function cameraCapture(cb) {
    cc.assert(this._cameraing, '请先调用cameraStart');
    if (!is_android) {
      return cc.log('cameraCapture');
    }
    var cb_name = bind_cb(cb);
    this.cameraCapture_cb_name = cb_name;
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraAndroid", "capture", "(Ljava/lang/String;)V", cb_name);
  },
  getFrontCameraId: function getFrontCameraId() {
    if (!is_android) {
      return 2;
    }
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraView", "getFrontCameraId", "()I");
  },
  getBackCameraId: function getBackCameraId() {
    if (!is_android) {
      return 1;
    }
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraView", "getBackCameraId", "()I");
  },
  addToGallery: function addToGallery(filepath) {
    if (!is_android) return cc.log('addToGallery');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraAndroid", "addToGallery", "(Ljava/lang/String;)V", filepath);
  },
  shareToOtherApp: function shareToOtherApp(filepath) {
    if (!is_android) return cc.log('shareToOtherApp');
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/camera/CameraAndroid", "shareToOtherApp", "(Ljava/lang/String;)V", filepath);
  },

  removeLaunchImage: function removeLaunchImage() {
    if (!is_android) {
      return cc.log('removeLaunchImage');
    }
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/GameTestActivity", "removeLaunchImage", "()V");
  }

});

var fn_i = 0;

function bind_cb(fn) {
  fn_i++;
  var name = '__fn_' + fn_i;
  window[name] = fn;
  return name;
}

var device = new Device();
device.init();

module.exports = device;

cc._RFpop();
},{}],"fakeData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '85098+8AAxAQoAPLWZpbwI5', 'fakeData');
// scripts\common\fakeData.js

var results = [{
	name: '1- Screen',
	state: 1,
	score: 12345,
	time: '07/18/16 11:35'
}, {
	name: '2- Dispaly',
	state: 0,
	score: 'N/A',
	time: 'N/A'
}, {
	name: '3- Speaker',
	state: -1,
	score: 'N/A',
	time: '07/18/16 11:35'
}, {
	name: '4- Screen',
	state: 1,
	score: 12345,
	time: '07/18/16 11:35'
}, {
	name: '5- Dispaly',
	state: 0,
	score: 'N/A',
	time: 'N/A'
}, {
	name: '6- Speaker',
	state: -1,
	score: 'N/A',
	time: '07/18/16 11:35'
}, {
	name: '7- Screen',
	state: 1,
	score: 12345,
	time: '07/18/16 11:35'
}, {
	name: '8- Dispaly',
	state: 0,
	score: 'N/A',
	time: 'N/A'
}, {
	name: '9- Speaker',
	state: -1,
	score: 'N/A',
	time: '07/18/16 11:35'
}, {
	name: '10- Screen',
	state: 1,
	score: 12345,
	time: '07/18/16 11:35'
}, {
	name: '11- Dispaly',
	state: 0,
	score: 'N/A',
	time: 'N/A'
}, {
	name: '12- Speaker',
	state: -1,
	score: 'N/A',
	time: '07/18/16 11:35'
}];

module.exports = {
	results: results
};

cc._RFpop();
},{}],"guide":[function(require,module,exports){
"use strict";
cc._RFpush(module, '415406IHMVHOLp8Kjd1oKKD', 'guide');
// scripts\common\guide.js

var game = require('./Game');

module.exports = function (game_key, images, cb) {
  var gameData = game.getGameStoreData(game_key);
  if (gameData.guide === true) {
    return cb();
  }

  var winSize = cc.director.getWinSize();

  var newNode = new cc.Node("New Sprite");
  newNode.setContentSize(winSize);
  var sprite = newNode.addComponent(cc.Sprite);
  newNode.setPosition(cc.v2(winSize.width / 2, winSize.height / 2));

  var index = 0;
  var listener = {
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    onTouchBegan: function onTouchBegan(touche, event) {
      event.stopPropagationImmediate();
      return true;
    },
    onTouchEnded: function onTouchEnded() {
      change_image();
    }
  };
  cc.eventManager.addListener(listener, newNode);
  cc.director.getScene().addChild(newNode);

  var change_image = function change_image() {
    if (index >= images.length) {
      onEnd();
      return;
    }
    var path = images[index];
    index++;

    cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
      sprite.spriteFrame = spriteFrame;
    });
  };

  var onEnd = function onEnd() {
    newNode.removeFromParent();
    gameData.guide = true;
    cc.sys.localStorage.setItem(game_key, JSON.stringify(gameData));
    cb && cb();
  };

  change_image();
};

cc._RFpop();
},{"./Game":"Game"}],"loadingScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '79e54J7LRJN/pDiQCpYkX/Q', 'loadingScene');
// scripts\main\loadingScene.js

var game = require('../common/Game');
var device = require('../common/device');
var config = require('../common/config');
var analytics = require('../common/analytics');

cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.setDisplayStats(false);

        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, _.once(this.preload.bind(this)));
        //init db
        cc.sys.localStorage.setItem('dbinit', '1');

        var intentGameId = device.intentGameId();
        if (intentGameId != '') {
            var games = config.games;
            // let games = config.games.slice(0,Math.floor(config.games.length/2));
            var one = _.find(games, function (item) {
                return item.key == intentGameId;
            });
            if (one) {
                //setTimeout(()=>{
                game.showGame(intentGameId, 1);
                //},1);
                return;
            } else {
                analytics.showToast('game_id:' + intentGameId + '  not found');
            }
        }

        //隐藏背景图
        //device.removeLaunchImage();
        //game.showGame('microphone',1);
    },

    preload: function preload(deta) {
        var temp = deta;
        cc.loader.loadResAll("prefabs", function (err, prefabs) {
            if (err) {
                return cc.log(err);
            }
            _.each(prefabs, function (prefab) {
                cc.assert(prefab instanceof cc.Prefab, '加载资源成功, 但该对象不是Prefab');
            });
        });
    }

});

cc._RFpop();
},{"../common/Game":"Game","../common/analytics":"analytics","../common/config":"config","../common/device":"device"}],"maincfg":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b284fAN7ctHC4OFHIv0Cw/a', 'maincfg');
// scripts\common\maincfg.js

var config = {};
//主页的显示页面
config.page = 0;
//当前测试游戏
config.test = 'test';
//加速计状态
config.accStatus = 0;
//音乐状态
config.audioStatus = 0;

//音乐状态
config.pauseview = 0;

module.exports = config;

cc._RFpop();
},{}],"moment":[function(require,module,exports){
"use strict";
cc._RFpush(module, '38dc3nLes9C/K4s9FSCwAcF', 'moment');
// scripts\common\moment.js

//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.moment = factory();
})(this, function () {
    'use strict';

    var hookCallback;

    function utils_hooks__hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid(flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
    }

    function absFloor(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {}

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' && module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set(mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet(units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1 = /\d/; //       0 - 9
    var match2 = /\d\d/; //      00 - 99
    var match3 = /\d{3}/; //     000 - 999
    var match4 = /\d{4}/; //    0000 - 9999
    var match6 = /[+-]?\d{6}/; // -999999 - 999999
    var match1to2 = /\d\d?/; //       0 - 99
    var match1to3 = /\d{1,3}/; //       0 - 999
    var match1to4 = /\d{1,4}/; //       0 - 9999
    var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

    var matchUnsigned = /\d+/; //       0 - inf
    var matchSigned = /[+-]?\d+/; //    -inf - inf

    var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction(sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' && Object.prototype.toString.call(sth) === '[object Function]';
    }

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return isStrict && strictRegex ? strictRegex : regex;
        };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths(m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort(m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow(m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + new Error().stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/], ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/], ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/], ['GGGG-[W]WW', /\d{4}-W\d{2}/], ['YYYY-DDD', /\d{4}-\d{3}/]];

    // iso time formats and regexes
    var isoTimes = [['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/], ['HH:mm', /(T| )\d\d:\d\d/], ['HH', /(T| )\d\d/]];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate('moment construction falls back to js Date. This is ' + 'discouraged and will be removed in upcoming major ' + 'release. Please refer to ' + 'https://github.com/moment/moment/issues/1407 for more info.', function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    });

    function createDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;

        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear,
            janX = createUTCDate(year, 0, 1 + week1Jan),
            d = janX.getUTCDay(),
            dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true && config._a[HOUR] <= 12 && config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || format === undefined && input === '') {
            return valid__createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof input === 'object') {
            configFromObject(config);
        } else if (typeof input === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof locale === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548', function () {
        var other = local__createLocal.apply(null, arguments);
        return other < this ? this : other;
    });

    var prototypeMax = deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548', function () {
        var other = local__createLocal.apply(null, arguments);
        return other > this ? this : other;
    });

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~ ~(offset / 60), 2) + separator + zeroFill(~ ~offset % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = (string || '').match(matchOffset) || [];
        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - +res;
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }

    function isDaylightSavingTimeShifted() {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return !this._isUTC;
    }

    function isUtcOffset() {
        return this._isUTC;
    }

    function isUtc() {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration(input, key) {
        var duration = input,

        // matching against regexp is expensive, do it on demand
        match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                d: parseIso(match[4], sign),
                h: parseIso(match[5], sign),
                m: parseIso(match[6], sign),
                s: parseIso(match[7], sign),
                w: parseIso(match[8], sign)
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = { milliseconds: 0, months: 0 };

        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val;val = period;period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar(time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore(input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween(from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame(input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +this.clone().startOf(units) <= inputMs && inputMs <= +this.clone().endOf(units);
        }
    }

    function diff(input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta,
            output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),

        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString() {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format(inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow(withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow(withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    });

    function localeData() {
        return this._locale;
    }

    function startOf(units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
            /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
            /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
            /* falls through */
            case 'hour':
                this.minutes(0);
            /* falls through */
            case 'minute':
                this.seconds(0);
            /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf(units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, units === 'isoWeek' ? 'week' : units).subtract(1, 'ms');
    }

    function to_type__valueOf() {
        return +this._d - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(+this / 1000);
    }

    function toDate() {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray() {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid() {
        return valid__isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear(input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add(input - year, 'y');
    }

    function getSetISOWeekYear(input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add(input - year, 'y');
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', matchWord);
    addRegexToken('ddd', matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays(m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort(m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin(m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse(weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~ ~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~ ~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add = add_subtract__add;
    momentPrototype__proto.calendar = moment_calendar__calendar;
    momentPrototype__proto.clone = clone;
    momentPrototype__proto.diff = diff;
    momentPrototype__proto.endOf = endOf;
    momentPrototype__proto.format = format;
    momentPrototype__proto.from = from;
    momentPrototype__proto.fromNow = fromNow;
    momentPrototype__proto.to = to;
    momentPrototype__proto.toNow = toNow;
    momentPrototype__proto.get = getSet;
    momentPrototype__proto.invalidAt = invalidAt;
    momentPrototype__proto.isAfter = isAfter;
    momentPrototype__proto.isBefore = isBefore;
    momentPrototype__proto.isBetween = isBetween;
    momentPrototype__proto.isSame = isSame;
    momentPrototype__proto.isValid = moment_valid__isValid;
    momentPrototype__proto.lang = lang;
    momentPrototype__proto.locale = locale;
    momentPrototype__proto.localeData = localeData;
    momentPrototype__proto.max = prototypeMax;
    momentPrototype__proto.min = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set = getSet;
    momentPrototype__proto.startOf = startOf;
    momentPrototype__proto.subtract = add_subtract__subtract;
    momentPrototype__proto.toArray = toArray;
    momentPrototype__proto.toObject = toObject;
    momentPrototype__proto.toDate = toDate;
    momentPrototype__proto.toISOString = moment_format__toISOString;
    momentPrototype__proto.toJSON = moment_format__toISOString;
    momentPrototype__proto.toString = toString;
    momentPrototype__proto.unix = unix;
    momentPrototype__proto.valueOf = to_type__valueOf;

    // Year
    momentPrototype__proto.year = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
    momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
    momentPrototype__proto.weeksInYear = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date = getSetDayOfMonth;
    momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
    momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset = getSetOffset;
    momentPrototype__proto.utc = setOffsetToUTC;
    momentPrototype__proto.local = setOffsetToLocal;
    momentPrototype__proto.parseZone = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal = isLocal;
    momentPrototype__proto.isUtcOffset = isUtcOffset;
    momentPrototype__proto.isUtc = isUtc;
    momentPrototype__proto.isUTC = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix(input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone() {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
    };

    function locale_calendar__calendar(key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat(string) {
        return string;
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    };

    function relative__relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return typeof output === 'function' ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set(config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar = defaultCalendar;
    prototype__proto.calendar = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat = longDateFormat;
    prototype__proto._invalidDate = defaultInvalidDate;
    prototype__proto.invalidDate = invalidDate;
    prototype__proto._ordinal = defaultOrdinal;
    prototype__proto.ordinal = ordinal;
    prototype__proto._ordinalParse = defaultOrdinalParse;
    prototype__proto.preparse = preParsePostFormat;
    prototype__proto.postformat = preParsePostFormat;
    prototype__proto._relativeTime = defaultRelativeTime;
    prototype__proto.relativeTime = relative__relativeTime;
    prototype__proto.pastFuture = pastFuture;
    prototype__proto.set = locale_set__set;

    // Month
    prototype__proto.months = localeMonths;
    prototype__proto._months = defaultLocaleMonths;
    prototype__proto.monthsShort = localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse = localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays = localeWeekdays;
    prototype__proto._weekdays = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin = localeWeekdaysMin;
    prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort = localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse = localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get(format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list(format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths(format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort(format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays(format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort(format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin(format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function ordinal(number) {
            var b = number % 10,
                output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract(duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as(units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf() {
        return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds = makeAs('s');
    var asMinutes = makeAs('m');
    var asHours = makeAs('h');
    var asDays = makeAs('d');
    var asWeeks = makeAs('w');
    var asMonths = makeAs('M');
    var asYears = makeAs('y');

    function duration_get__get(units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds = makeGetter('seconds');
    var minutes = makeGetter('minutes');
    var hours = makeGetter('hours');
    var days = makeGetter('days');
    var months = makeGetter('months');
    var years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45, // seconds to minute
        m: 45, // minutes to hour
        h: 22, // hours to day
        d: 26, // days to month
        M: 11 // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds = round(duration.as('s'));
        var minutes = round(duration.as('m'));
        var hours = round(duration.as('h'));
        var days = round(duration.as('d'));
        var months = round(duration.as('M'));
        var years = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds] || minutes === 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours === 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days === 1 && ['d'] || days < thresholds.d && ['dd', days] || months === 1 && ['M'] || months < thresholds.M && ['MM', months] || years === 1 && ['y'] || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize(withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days = iso_string__abs(this._days);
        var months = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') + 'P' + (Y ? Y + 'Y' : '') + (M ? M + 'M' : '') + (D ? D + 'D' : '') + (h || m || s ? 'T' : '') + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs = duration_abs__abs;
    duration_prototype__proto.add = duration_add_subtract__add;
    duration_prototype__proto.subtract = duration_add_subtract__subtract;
    duration_prototype__proto.as = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds = asSeconds;
    duration_prototype__proto.asMinutes = asMinutes;
    duration_prototype__proto.asHours = asHours;
    duration_prototype__proto.asDays = asDays;
    duration_prototype__proto.asWeeks = asWeeks;
    duration_prototype__proto.asMonths = asMonths;
    duration_prototype__proto.asYears = asYears;
    duration_prototype__proto.valueOf = duration_as__valueOf;
    duration_prototype__proto._bubble = bubble;
    duration_prototype__proto.get = duration_get__get;
    duration_prototype__proto.milliseconds = milliseconds;
    duration_prototype__proto.seconds = seconds;
    duration_prototype__proto.minutes = minutes;
    duration_prototype__proto.hours = hours;
    duration_prototype__proto.days = days;
    duration_prototype__proto.weeks = weeks;
    duration_prototype__proto.months = months;
    duration_prototype__proto.years = years;
    duration_prototype__proto.humanize = humanize;
    duration_prototype__proto.toISOString = iso_string__toISOString;
    duration_prototype__proto.toString = iso_string__toISOString;
    duration_prototype__proto.toJSON = iso_string__toISOString;
    duration_prototype__proto.locale = locale;
    duration_prototype__proto.localeData = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports

    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn = momentPrototype;
    utils_hooks__hooks.min = min;
    utils_hooks__hooks.max = max;
    utils_hooks__hooks.utc = create_utc__createUTC;
    utils_hooks__hooks.unix = moment__createUnix;
    utils_hooks__hooks.months = lists__listMonths;
    utils_hooks__hooks.isDate = isDate;
    utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid = valid__createInvalid;
    utils_hooks__hooks.duration = create__createDuration;
    utils_hooks__hooks.isMoment = isMoment;
    utils_hooks__hooks.weekdays = lists__listWeekdays;
    utils_hooks__hooks.parseZone = moment__createInZone;
    utils_hooks__hooks.localeData = locale_locales__getLocale;
    utils_hooks__hooks.isDuration = isDuration;
    utils_hooks__hooks.monthsShort = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale = defineLocale;
    utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;
});
//! momentjs.com

cc._RFpop();
},{}],"pauseView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4f038fCj59NFbtJzAo7Vn/T', 'pauseView');
// scripts\common\pauseView.js

var game = require('../common/Game');
var device = require('../common/Device');
var maincfg = require('../common/maincfg');
var analytics = require('../common/analytics');
var BackView = require('./BackView');

cc.Class({
    'extends': cc.Component,

    properties: {
        guide1: {
            'default': null,
            type: cc.Sprite
        },
        guide2: {
            'default': null,
            type: cc.Sprite
        },
        guide3: {
            'default': null,
            type: cc.Sprite
        },

        btn1: {
            'default': null,
            type: cc.Button
        },
        btn2: {
            'default': null,
            type: cc.Button
        },
        btn3: {
            'default': null,
            type: cc.Button
        },

        dlgnode: cc.Node
    },
    // use this for initialization
    onLoad: function onLoad() {
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(touche, event) {
                event.stopPropagationImmediate();
                return true;
            },
            onTouchMoved: function onTouchMoved() {},
            onTouchEnded: function onTouchEnded() {},
            onTouchCancelled: function onTouchCancelled() {}
        };
        cc.eventManager.addListener(listener, this.node);

        this.guide1.node.active = false;
        this.guide2.node.active = false;
        this.guide3.node.active = false;

        //cc.sys.localStorage.setItem("pauseview", JSON.stringify({pcode:1}));
        //
        //if( maincfg.pauseview == 0 )
        //{
        //    cc.sys.localStorage.setItem("pauseview", JSON.stringify({pcode:1}));
        //
        //    this.guide1.node.active = true;
        //    this.dlgnode.active = false;
        //    maincfg.pauseview =1;
        //}

        var str = cc.sys.localStorage.getItem("pauseview_key") || '{}';
        var data = JSON.parse(str);
        var rev = {};
        rev.pcode = data.pcode;
        console.log(rev.pcode);
        if (rev.pcode == undefined) {

            console.log(rev.pcode);
            //第一次
            cc.sys.localStorage.setItem("pauseview_key", JSON.stringify({ pcode: 1 }));
            this.guide1.node.active = true;
            //this.btn1.node.active = false;
            //this.btn2.node.active = false;
            //this.btn3.node.active = false;
        }
    },
    setGameKey: function setGameKey(game_key) {
        this.game_key = game_key;
    },
    onContinue: function onContinue() {
        cc.director.resume();
        this.node.removeFromParent();

        analytics.buttonEvent('continue_button');
    },
    onHome: function onHome() {
        analytics.buttonEvent('home_button');

        var intentGameId = device.intentGameId();
        if (intentGameId != '') {
            // return device.exitMe();
            return cc.director.end();
        }

        cc.director.resume();
        cc.audioEngine.end();
        maincfg.page = 2;

        if (maincfg.accStatus == true) {
            cc.inputManager.setAccelerometerEnabled(false);
            maincfg.accStatus = false;
        }

        cc.director.loadScene('MainScene');
    },
    onSkip: function onSkip() {
        cc.director.resume();
        cc.audioEngine.end();

        if (maincfg.accStatus == true) {
            cc.inputManager.setAccelerometerEnabled(false);
            maincfg.accStatus = false;
        }

        analytics.buttonEvent('skip_button');

        console.log("onSkip");
        //game.postGameScore(this.game_key,0,false);
        var reb = game.showNextGame(this.game_key);
        console.log(reb);
        if (!reb) {
            game.showTips('In development ...');
        }
    },

    onBtn3: function onBtn3() {
        analytics.buttonEvent('skip_button');

        BackView.show(this.game_key);
        // cc.director.resume();
        // cc.audioEngine.end();

        // if( maincfg.accStatus == true ){
        //     cc.inputManager.setAccelerometerEnabled(false);
        //     maincfg.accStatus = false;
        // }
        // game.postGameScore(this.game_key,'N/A',false);
        // maincfg.page = 1;
        // maincfg.test = this.game_key;
        // cc.director.loadScene('MainScene');
    },

    userclick: function userclick() {},

    clickguide1: function clickguide1() {
        this.guide1.node.active = false;
        this.guide2.node.active = true;
    },

    clickguide2: function clickguide2() {
        this.guide2.node.active = false;
        this.guide3.node.active = true;
    },

    clickguide3: function clickguide3() {
        this.guide3.node.active = false;
        this.dlgnode.active = true;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/analytics":"analytics","../common/maincfg":"maincfg","./BackView":"BackView"}],"resultItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '240a9LADk1LVLhndQPAsLM8', 'resultItem');
// scripts\common\resultItem.js

var moment = require('../common/moment');
var game = require('../common/Game');

cc.Class({
    'extends': cc.Component,

    properties: {

        upnode: cc.Node,

        downnode: cc.Node,
        testname: {
            'default': null,
            type: cc.Label
        },
        result_ok: {
            'default': null,
            type: cc.Sprite
        },
        result_error: {
            'default': null,
            type: cc.Sprite
        },

        pic_open: {
            'default': null,
            type: cc.Sprite
        },

        pic_close: {
            'default': null,
            type: cc.Sprite
        },

        gamescore: {
            'default': null,
            type: cc.Label
        },
        lasttime: {
            'default': null,
            type: cc.Label
        },
        game_key: ''
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.pic_close.node.active = false;
    },

    init: function init(Info) {
        if (Info.date != undefined) {
            Info.date = moment(Info.date).format('YYYY-MM-DD HH:mm:ss');
            console.log(Info.date);
        } else {
            console.log('Info.date null  1111111111111');
        }

        this.game_key = Info.key;
        this.testname.string = Info.name;
        this.gamescore.string = Info.score == undefined ? 'N/A' : Info.score;
        this.lasttime.string = Info.date == undefined ? 'N/A' : Info.date;
        if (Info.is_success == false) {
            this.result_ok.node.active = false;
            this.result_error.node.active = true;
        } else if (Info.is_success == undefined) {
            this.result_ok.node.active = false;
            this.result_error.node.active = false;
        } else if (Info.is_success == true) {
            this.result_ok.node.active = true;
            this.result_error.node.active = false;
        }

        this.downnode.active = false;
    },

    open: function open() {
        if (this.node.height > 80) return;

        this.pic_close.node.active = true;
        this.pic_open.node.active = false;
        this.node.height += 240;

        this.downnode.active = true;

        var posX = this.upnode.getPositionX();
        var posY = this.upnode.getPositionY();
        posY += 120;
        var Pos = cc.p(posX, posY);
        this.upnode.setPosition(Pos);
    },
    close: function close() {
        if (this.node.height <= 80) {
            return;
        }

        this.pic_close.node.active = false;
        this.pic_open.node.active = true;

        this.node.height -= 240;
        this.downnode.active = false;

        var posX = this.upnode.getPositionX();
        var posY = this.upnode.getPositionY();
        posY -= 120;
        var Pos = cc.p(posX, posY);
        this.upnode.setPosition(Pos);
    },

    simple: function simple() {
        game.showTips('In development ...');
    },
    gotogame: function gotogame() {
        var reb = game.showGame(this.game_key, 1);
        if (!reb) {
            game.showTips('In development ...');
        }
    },
    help: function help() {
        game.showTips('In development ...');
    },

    cilckup: function cilckup() {
        if (this.node.height <= 80) {
            this.open();
        } else {
            this.close();
        }
    }

});

cc._RFpop();
},{"../common/Game":"Game","../common/moment":"moment"}],"resultList":[function(require,module,exports){
"use strict";
cc._RFpush(module, '84cd3fQUFlPSbFu4ozi4hHB', 'resultList');
// scripts\common\resultList.js

//const results = require('fakeData').results;
var game = require('../common/Game');
var maincfg = require('../common/maincfg');

cc.Class({
    'extends': cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabItem: cc.Prefab,
        rCount: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log("11111111111111111111111");
        this.content = this.scrollView.content;
        this.populateList();
    },

    populateList: function populateList() {

        var results = game.gameRecords();

        //rev.score = data.score;
        //rev.date = data.date;
        //rev.is_success = data.is_success;

        for (var i = 0; i < this.rCount; ++i) {
            var resultInfo = results[i];
            //console.log('key',resultInfo.key);
            //console.log('score',resultInfo.score);
            //console.log('date',resultInfo.date);
            //console.log('is_success',resultInfo.is_success);

            var item = cc.instantiate(this.prefabItem);
            //console.log(item);
            console.log(item.getComponent('resultItem'));
            item.getComponent('resultItem').init(resultInfo);
            item.getComponent('resultItem').node.height = 80;

            console.log("maincfg.test", maincfg.test);
            if (maincfg.test == resultInfo.key) {
                item.getComponent('resultItem').open();
            }
            this.content.addChild(item);
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"../common/Game":"Game","../common/maincfg":"maincfg"}],"s01":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2f507nryLBB/Zf8QWqMupft', 's01');
// scripts\01\s01.js

var ScoreView = require('../common/ScoreView');
var GameTimer = require('../common/GameTimer');
var game = require('../common/Game');
var device = require('../common/Device');
var SliderBar = require('./SliderBar');

var ball_radius = 25;
var TOP_TAG = 1;
var BOTTOM_TAG = 2;

cc.Class({
  'extends': cc.Component,

  properties: {
    mode_menu: cc.Node,
    top_bar: cc.Node,
    slider: SliderBar,
    game_node: cc.Node,
    content_node: cc.Node,
    guide_node: cc.Node,
    map1: [cc.Node],
    map2: [cc.Node],
    ball_node: cc.Node,
    monster_node: cc.Node,

    movehand: {
      'default': null,
      type: cc.Sprite
    }
  },
  easy: function easy() {
    this.guide_node.active = true;
    this.mode_menu.active = false;
    this.modeData = [4, 6];
  },
  normal: function normal() {
    this.guide_node.active = true;
    this.mode_menu.active = false;
    this.modeData = [2, 4];
  },
  hard: function hard() {
    this.guide_node.active = true;
    this.mode_menu.active = false;
    this.modeData = [1, 3];
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.top_bar.setLocalZOrder(10);

    this.checkBox = this.checkBox.bind(this);

    this.slider.onSlide(this.onSlide.bind(this));
    this.gameTimer = new GameTimer();

    var m1 = cc.instantiate(this.map1[Math.floor(Math.random() * this.map1.length)]);
    var m2 = cc.instantiate(this.map2[Math.floor(Math.random() * this.map2.length)]);
    this.maps = [m1, m2];

    //this.game_node.active = false;
    this.guide_node.active = false;
    this.mode_menu.active = true;

    //动作
    var pos = cc.v2(115, 75);
    this.movehand.node.setPosition(pos);
    var moveTo = cc.moveTo(1, cc.v2(215, 75));
    var moveBack = cc.moveTo(1, cc.v2(115, 75));

    this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
    this.movehand.node.runAction(this.action);
  },
  onDisable: function onDisable() {
    this.gameTimer.release();
  },
  onClickGuide: function onClickGuide() {
    //this.game_node.active = true;
    this.guide_node.active = false;
    this.top_bar.active = true;
    this.complete = 0;
  },
  onSlide: function onSlide() {
    this.top_bar.active = false;
    this.startGame();
  },
  startGame: function startGame() {
    if (this.map && this.map.parent) {
      this.map.removeFromParent();
    }
    this._moveTrace = [];

    var map = this.maps[0];
    if (this.complete > 0) {
      map = this.maps[1];
    }
    this.map = cc.instantiate(map);
    this.map.active = true;
    this.map.x = 0;
    this.map.y = 0;
    this.content_node.addChild(this.map);

    this.polygonCollider = this.map.getComponent(cc.PolygonCollider);
    var boxColliders = this.map.getComponents(cc.BoxCollider);
    var topBox = _.find(boxColliders, { tag: TOP_TAG });
    var bottomBox = _.find(boxColliders, { tag: BOTTOM_TAG });

    if (this.complete == 0) {
      this.startBox = topBox;
      this.endBox = bottomBox;
    } else {
      this.startBox = bottomBox;
      this.endBox = topBox;
    }

    this.ball = cc.instantiate(this.ball_node);
    this.monster = cc.instantiate(this.monster_node);

    this.ball.x = this.startBox.offset.x;
    this.ball.y = this.startBox.offset.y;

    this.monster.x = this.startBox.offset.x;
    this.monster.y = this.startBox.offset.y;

    this.monster.active = false;

    this.map.addChild(this.ball);
    this.map.addChild(this.monster);

    //var anim = this.ball;
    //var animCtrl = anim.node.getComponent(cc.Animation);
    //animCtrl.play("play_dj");
    this.ball.getComponent(cc.Animation).play();

    this.initMapTouch();
  },
  initMapTouch: function initMapTouch() {
    // 添加单点触摸事件监听器
    var listener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: this._onTouchStart.bind(this),
      onTouchMoved: this._onTouchMove.bind(this),
      onTouchEnded: this._onTouchEnd.bind(this),
      onTouchCancelled: this._onTouchEnd.bind(this)
    };
    this._map_listener = cc.eventManager.addListener(listener, this.map);

    if (!this.gameTimer.isRuning()) {
      this.gameTimer.start();
    }
    this.schedule(this.checkBox, 1 / 30);

    this.scheduleOnce(this.startTrace, _.random(this.modeData[0], this.modeData[1]));
  },

  startTrace: function startTrace() {
    this.monster.x = this.startBox.offset.x;
    this.monster.y = this.startBox.offset.y;
    this.monster.active = true;
    this.monster.getComponent(cc.Animation).play();
    // this.bossAnim.play('boss_move');

    this.schedule(this.trace, 1 / 30);
  },
  trace: function trace() {
    var p = this._moveTrace.shift();
    if (!p) return;
    this.monster.setPosition(p);
  },
  _onTouchStart: function _onTouchStart(touche, event) {
    var ball_pos = this.map.convertToWorldSpace(this.ball.getPosition());
    var dis = cc.pDistance(touche.getLocation(), ball_pos);
    if (dis < ball_radius) {
      this._touch_offset = cc.pSub(touche.getLocation(), ball_pos);
      this.ball.scaleX = 1.5;
      return true;
    }
    return false;
  },
  _onTouchMove: function _onTouchMove(touche, event) {
    var pos = this.map.convertToNodeSpace(touche.getLocation());
    var p = cc.pSub(pos, this._touch_offset);
    this.ball.setPosition(p);
    this._moveTrace.push(p);
  },
  _onTouchEnd: function _onTouchEnd(touche, event) {
    this._touch_offset = null;
    this.ball.scaleX = 1.0;

    if (!this.isCollisionEndBox()) {
      cc.log('touchEnd');

      this.endGame();
      this.scheduleOnce(this.onFail, 1);
    }
  },
  checkBox: function checkBox() {
    var _this = this;

    var isCollisionMonster = cc.pDistance(this.monster.getPosition(), this.ball.getPosition()) < ball_radius * 2;
    if (this.monster.active && isCollisionMonster) {
      cc.log('isCollisionMonster');
      this.ball.active = false;
      this.monster.getComponent(cc.Animation).play("play_eat");

      setTimeout(function () {
        _this.monster.active = false;
      }, 500);
      this.endGame();
      this.scheduleOnce(this.onFail, 1);
      return;
    }
    var isCollisionPath = cc.Intersection.polygonCircle(this.polygonCollider.world.points, { position: this.ball.getPosition(), radius: ball_radius });
    if (isCollisionPath) {
      cc.log('isCollisionPath');
      this.endGame();
      this.scheduleOnce(this.onFail, 1);
      return;
    }

    if (this.isCollisionEndBox()) {
      cc.log('isCollisionEnd');
      this.endGame();
      this.scheduleOnce(this.onSuccess, 0.5);
      return;
    }
  },
  isCollisionEndBox: function isCollisionEndBox() {
    var isCollisionEnd = this.BoxCircleIntersect(this.endBox.offset, this.ball.getPosition(), cc.v2(this.endBox.size.width / 2, this.endBox.size.height / 2), ball_radius);
    return isCollisionEnd;
  },
  BoxCircleIntersect: function BoxCircleIntersect(c, p, h, r) {
    var v = cc.pSub(p, c);
    v = cc.v2(Math.abs(v.x), Math.abs(v.y));
    var u = cc.pSub(v, h);
    u = cc.v2(Math.max(v.x, 0), Math.max(v.y, 0));
    return cc.pDot(u, u) <= r * r;
  },
  onFail: function onFail() {
    this.startGame();
  },
  onSuccess: function onSuccess() {
    this.complete++;
    if (this.complete > 1) {
      this.onComplete();
    } else {
      this.startGame();
    }
  },
  onComplete: function onComplete() {
    this.gameTimer.stop();

    game.postGameScore('screen', this.gameTimer.getTime(), true);
    ScoreView.show('screen', this.gameTimer.getTime(), true);
  },
  endGame: function endGame() {
    cc.eventManager.removeListener(this._map_listener);
    this._map_listener = null;
    this.unschedule(this.checkBox);
    this.unschedule(this.startTrace);
    this.unschedule(this.trace);
  }
});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/GameTimer":"GameTimer","../common/ScoreView":"scoreView","./SliderBar":"SliderBar"}],"s02_ask_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fb34fcrAlZKcIgifx/Wra6d', 's02_ask_layer');
// scripts\02\s02_ask_layer.js


//const gameresult = require('s02_game_layer');

cc.Class({
    "extends": cc.Component,

    properties: {

        // gameresult:gameresult,
    },

    // use this for initialization

    gonext: function gonext() {},

    onLoad: function onLoad() {
        this.node.active = false;
    },

    setactive: function setactive() {
        this.node.active = true;
        console.log("ask setactive");
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"s02_black_trans_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0c644nr+epETYUmxIgYkNtd', 's02_black_trans_layer');
// scripts\02\s02_black_trans_layer.js

var game = require('s02_game_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        label: {
            "default": null,
            type: cc.Label
        },
        game: game
    },

    // use this for initialization

    gonext: function gonext() {
        console.log("1111 balck");
        if (this.node.active == true) {
            console.log("gonext balck");
            this.node.active = false;
            this.game.setactive();
            console.log("222222 balck");
        }
    },

    onLoad: function onLoad() {
        this.node.active = false;
    },

    setactive: function setactive() {
        this.node.active = true;
        this.label.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1), cc.delayTime(3), cc.fadeIn(1))));
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s02_game_layer":"s02_game_layer"}],"s02_game_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '299fc/EEQNPbr+ZZlrGwZgb', 's02_game_layer');
// scripts\02\s02_game_layer.js

var white = require('s02_white_trans_layer');

var game = require('../common/Game');
var ScoreView = require('../common/ScoreView');

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },

        looklabel: {
            'default': null,
            type: cc.Label
        },
        lookbtn: {
            'default': null,
            type: cc.Sprite
        },
        pauselayer: {
            'default': null,
            type: cc.Sprite
        },

        item1: {
            'default': null,
            type: cc.Sprite
        },
        item2: {
            'default': null,
            type: cc.Sprite
        },
        item3: {
            'default': null,
            type: cc.Sprite
        },
        item4: {
            'default': null,
            type: cc.Sprite
        },
        item5: {
            'default': null,
            type: cc.Sprite
        },
        item6: {
            'default': null,
            type: cc.Sprite
        },
        item7: {
            'default': null,
            type: cc.Sprite
        },
        item8: {
            'default': null,
            type: cc.Sprite
        },
        item9: {
            'default': null,
            type: cc.Sprite
        },

        numArray: [],
        statusArray: [],
        index: 0,
        canClick: false,
        timeStatus: 0, //倒计时

        preTime: 5,
        action: null,
        lookaction: null,
        white: white,
        looktime: 5,
        returnStatus: 0,
        looks: 0,
        usetime: ''
    },

    // use this for initialization
    gonext: function gonext() {},

    getresult: function getresult() {
        return this.usetime;
    },
    onLoad: function onLoad() {
        this.node.active = false;
    },

    setOnePic: function setOnePic(num, status, target) {
        var path = "";

        if (status == 0) {
            if (this.returnStatus == 0) path = "resources/02/b" + num + ".jpg";else path = "resources/02/black.jpg";
        } else path = "resources/02/w" + num + ".jpg";
        console.log(path);
        var realUrl = cc.url.raw(path);
        var texture = cc.textureCache.addImage(realUrl);
        target.spriteFrame.setTexture(texture);
    },
    setPic: function setPic(numArray, statusArray) {
        console.log("statusArray", statusArray);

        this.setOnePic(numArray[0], statusArray[0], this.item1);
        this.setOnePic(numArray[1], statusArray[1], this.item2);
        this.setOnePic(numArray[2], statusArray[2], this.item3);
        this.setOnePic(numArray[3], statusArray[3], this.item4);
        this.setOnePic(numArray[4], statusArray[4], this.item5);
        this.setOnePic(numArray[5], statusArray[5], this.item6);
        this.setOnePic(numArray[6], statusArray[6], this.item7);
        this.setOnePic(numArray[7], statusArray[7], this.item8);
        this.setOnePic(numArray[8], statusArray[8], this.item9);
    },
    initAllPic: function initAllPic() {
        var numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.sortRandom(numArray);
        this.numArray = numArray;
        console.log(this.numArray);

        this.statusArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.returnStatus = 0;
        this.setPic(this.numArray, this.statusArray);

        this._time = this.preTime;
        this.timeStatus = 0; //倒计时
        //显示倒计时定时器
        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            this.setALLBlack();
        }, this.preTime);

        this.canClick = false;

        this.action = cc.repeat(cc.sequence(cc.scaleTo(1, 2), cc.scaleTo(1, 1)), this.preTime);
        this.label.node.runAction(this.action);

        this.looktime = 5;
    },

    setALLBlack: function setALLBlack() {

        this.label.node.stopAction(this.action);
        var path = "resources/02/black.jpg";
        var realUrl = cc.url.raw(path);
        var texture = cc.textureCache.addImage(realUrl);
        this.item1.spriteFrame.setTexture(texture);
        this.item2.spriteFrame.setTexture(texture);
        this.item3.spriteFrame.setTexture(texture);
        this.item4.spriteFrame.setTexture(texture);
        this.item5.spriteFrame.setTexture(texture);
        this.item6.spriteFrame.setTexture(texture);
        this.item7.spriteFrame.setTexture(texture);
        this.item8.spriteFrame.setTexture(texture);
        this.item9.spriteFrame.setTexture(texture);
        this.canClick = true;
        this._time = 0;
        this.timeStatus = 1; //正向计时
    },

    sortRandom: function sortRandom(o) {
        //v1.0
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    setactive: function setactive() {
        this.node.active = true;
        //this.scheduleUpdate();
        this.initAllPic();
    },

    start: function start() {
        //this._time = 0.0;
    },

    update: function update(dt) {

        if (this.timeStatus == 1) {
            this._time += dt;
            // [正则表达式]获取小数点后三位
            var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
            var timeStr = String(this._time);
            var finalStr = timeStr.replace(regex, "$1");
            finalStr = finalStr + "s";
            this.label.string = finalStr;

            if (this.looklabel.node.active) {
                this.looktime -= dt;
                var regex = /([0-9]+\.[0-9]{0})[0-9]*/;
                var timeStr = String(this.looktime);
                var finalStr = timeStr.replace(regex, "$1");
                finalStr = finalStr.substr(0, 1);
                this.looklabel.string = finalStr;
            }
        } else {
            this._time -= dt;
            var regex = /([0-9]+\.[0-9]{0})[0-9]*/;
            var timeStr = String(this._time);
            var finalStr = timeStr.replace(regex, "$1");
            finalStr = finalStr.substr(0, 1);
            this.label.string = finalStr;
        }
    },

    pause: function pause() {
        console.log("11111game");
        this.pauselayer.node.active = true;
        cc.game.pause();
    },

    resume: function resume() {

        console.log("2222game");
        cc.game.resume();
        this.pauselayer.node.active = false;
    },

    setClickStatus: function setClickStatus(index, target) {

        if (!this.canClick) {
            return;
        }

        if (this.numArray[index - 1] == this.index) {
            //重复点击了已经ok的点
            return;
        }

        if (this.statusArray[index - 1] == 1) {
            //重复点击了已经ok的点
            return;
        }

        console.log(this.numArray[index - 1]);
        console.log(this.index);

        if (this.numArray[index - 1] != this.index + 1) //点击错误，返回初始化
            {
                //显示正确结果
                var statusArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                this.returnStatus = 0;
                this.setPic(this.numArray, statusArray);

                this.lookaction = cc.fadeOut(2);
                this.node.runAction(this.lookaction);
                // 重新开始

                this.scheduleOnce(function () {
                    this.node.stopAction(this.lookaction);
                    this.lookaction = cc.fadeIn(0.5);
                    this.node.runAction(this.lookaction);
                    this.initAllPic();
                    this.index = 0;
                }, 2);

                this.canClick = false;
                return;
            }

        this.index++;
        var path = "resources/02/w" + this.numArray[index - 1] + ".jpg";
        console.log(path);
        var realUrl = cc.url.raw(path);
        var texture = cc.textureCache.addImage(realUrl);
        target.spriteFrame.setTexture(texture);

        this.statusArray[index - 1] = 1;

        //结束条件：点到9则结束
        if (this.index == 9) {
            //this._time 进行计分处理，这个后期统一进行
            if (this.node.active == true) {

                //记录结果
                // [正则表达式]获取小数点后三位
                var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
                var timeStr = String(this._time);
                var finalStr = timeStr.replace(regex, "$1");
                this.usetime = finalStr;

                console.log(this.usetime);
                console.log("gonext from game");
                this.node.active = false;
                this.white.setactive();
                console.log("222222 from game");
            }
        }
    },

    item1click: function item1click() {

        this.setClickStatus(1, this.item1);
    },

    item2click: function item2click() {
        this.setClickStatus(2, this.item2);
    },

    item3click: function item3click() {
        this.setClickStatus(3, this.item3);
    },

    item4click: function item4click() {
        this.setClickStatus(4, this.item4);
    },

    item5click: function item5click() {
        this.setClickStatus(5, this.item5);
    },

    item6click: function item6click() {
        this.setClickStatus(6, this.item6);
    },

    item7click: function item7click() {
        this.setClickStatus(7, this.item7);
    },

    item8click: function item8click() {
        this.setClickStatus(8, this.item8);
    },
    item9click: function item9click() {
        this.setClickStatus(9, this.item9);
    },

    pauseHome: function pauseHome() {
        cc.game.resume();
        console.log("pauseHome");
        cc.director.loadScene("MainScene");

        this.pauselayer.node.active = false;
    },
    lookAgain: function lookAgain() {
        if (!this.canClick) {
            return;
        }
        this.canClick = false;
        this.looks++;
        this.looktime = 5 * this.looks;

        console.log(this.statusArray);

        var statusArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.returnStatus = 0;
        this.setPic(this.numArray, statusArray);
        //设置look倒计时
        this.lookbtn.node.active = false;
        this.looklabel.node.active = true;

        //显示倒计时定时器
        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            this.returnGame();
        }, this.looktime);

        this.lookaction = cc.repeat(cc.sequence(cc.scaleTo(1, 2), cc.scaleTo(1, 1)), this.preTime);
        this.looklabel.node.runAction(this.lookaction);
    },

    returnGame: function returnGame() {

        this.canClick = true;
        this.lookbtn.node.active = true;
        this.looklabel.node.active = false;

        this.looklabel.node.stopAction(this.lookaction);

        this.returnStatus = 1;
        this.setPic(this.numArray, this.statusArray);
    },

    askYes: function askYes() {
        console.log(this.usetime);
        game.postGameScore('display', this.usetime, false);
        ScoreView.show('display', this.usetime, false);
    },
    askNo: function askNo() {
        console.log(this.usetime);
        game.postGameScore('display', this.usetime, true);
        ///game.showNextGame('display');
        ScoreView.show('display', this.usetime, true);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"../common/Game":"Game","../common/ScoreView":"scoreView","s02_white_trans_layer":"s02_white_trans_layer"}],"s02_ins_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bd1e6HQmiZPmbrrenGd1vtY', 's02_ins_layer');
// scripts\02\s02_ins_layer.js

var black_trans = require('s02_black_trans_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        black_trans: black_trans,
        hand: {
            "default": null,
            type: cc.Sprite
        },
        movehand: {
            "default": null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log("222222 ins");

        //动作
        var pos = cc.v2(60, 80);
        this.movehand.node.setPosition(pos);
        var moveTo = cc.moveTo(0.3, cc.v2(70, 90));
        var moveBack = cc.moveTo(0.3, cc.v2(60, 60));

        this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
        this.movehand.node.runAction(this.action);
    },

    gonext: function gonext() {
        console.log("111111 ins");
        if (this.node.active == true) {

            console.log("gonext ins");
            this.node.active = false;
            this.black_trans.setactive();
            console.log("222222 ins");
        }
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s02_black_trans_layer":"s02_black_trans_layer"}],"s02_white_trans_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '43a36dnL4ZImrL8fXG0gbiy', 's02_white_trans_layer');
// scripts\02\s02_white_trans_layer.js

var ask = require('s02_ask_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        label: {
            "default": null,
            type: cc.Label
        },

        ask: ask
    },

    // use this for initialization

    gonext: function gonext() {
        if (this.node.active == true) {

            console.log("gonext from white");

            console.log(this.ask);
            this.node.active = false;
            this.ask.setactive();
            console.log("222222 from white");
        }
    },

    onLoad: function onLoad() {
        this.node.active = false;
    },

    setactive: function setactive() {
        this.node.active = true;
        this.label.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1), cc.delayTime(3), cc.fadeIn(1))));
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s02_ask_layer":"s02_ask_layer"}],"s03_ButtonScaler":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9139eiymR1ANoiwwzgXh421', 's03_ButtonScaler');
// scripts\03\s03_ButtonScaler.js

cc.Class({
    'extends': cc.Component,

    properties: {
        pressedScale: 0.9,
        transDuration: 0.1
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;

        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown(event) {
            this.stopAllActions();

            this.runAction(self.scaleDownAction);
        }
        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});

cc._RFpop();
},{}],"s03_game_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bd70bTXVMFDQqi23UypkZTQ', 's03_game_layer');
// scripts\03\s03_game_layer.js

var last = require('s03_last_layer');

var game = require('../common/Game');
var guide = require('../common/guide');
var ScoreView = require('../common/ScoreView');

cc.Class({
    'extends': cc.Component,

    properties: {

        last: last,
        label: {
            'default': null,
            type: cc.Label
        },
        bottomLabel: {
            'default': null,
            type: cc.Label
        },

        mode: {
            'default': null,
            type: cc.Label
        },

        errorAudio: {
            'default': null,
            url: cc.AudioClip
        },
        audio01: {
            'default': null,
            url: cc.AudioClip
        },
        audio02: {
            'default': null,
            url: cc.AudioClip
        },
        audio03: {
            'default': null,
            url: cc.AudioClip
        },
        audio04: {
            'default': null,
            url: cc.AudioClip
        },
        audio05: {
            'default': null,
            url: cc.AudioClip
        },
        audio06: {
            'default': null,
            url: cc.AudioClip
        },
        audio07: {
            'default': null,
            url: cc.AudioClip
        }, audio08: {
            'default': null,
            url: cc.AudioClip
        }, audio09: {
            'default': null,
            url: cc.AudioClip
        }, audio10: {
            'default': null,
            url: cc.AudioClip
        },

        audioRight: {
            'default': null,
            url: cc.AudioClip
        },
        audioSuccess: {
            'default': null,
            url: cc.AudioClip
        },
        ranAduio: {
            'default': null,
            url: cc.AudioClip
        },

        replayBtn: {
            'default': null,
            type: cc.Sprite
        },

        choose1: {
            'default': null,
            type: cc.Sprite
        },
        choose2: {
            'default': null,
            type: cc.Sprite
        },
        choose3: {
            'default': null,
            type: cc.Sprite
        },

        //20个精灵
        item1: {
            'default': null,
            type: cc.Sprite
        },
        item2: {
            'default': null,
            type: cc.Sprite
        },
        item3: {
            'default': null,
            type: cc.Sprite
        },
        item4: {
            'default': null,
            type: cc.Sprite
        },
        item5: {
            'default': null,
            type: cc.Sprite
        },
        item6: {
            'default': null,
            type: cc.Sprite
        },
        item7: {
            'default': null,
            type: cc.Sprite
        },
        item8: {
            'default': null,
            type: cc.Sprite
        },
        item9: {
            'default': null,
            type: cc.Sprite
        },
        item10: {
            'default': null,
            type: cc.Sprite
        },
        item11: {
            'default': null,
            type: cc.Sprite
        },
        item12: {
            'default': null,
            type: cc.Sprite
        },
        item13: {
            'default': null,
            type: cc.Sprite
        },
        item14: {
            'default': null,
            type: cc.Sprite
        },
        item15: {
            'default': null,
            type: cc.Sprite
        },
        item16: {
            'default': null,
            type: cc.Sprite
        },
        item17: {
            'default': null,
            type: cc.Sprite
        },
        item18: {
            'default': null,
            type: cc.Sprite
        },
        item19: {
            'default': null,
            type: cc.Sprite
        },
        item20: {
            'default': null,
            type: cc.Sprite
        },

        ranNumArray: [],
        ranNum: 0,
        timeStatus: 0,

        usetime: '',
        gmode: 1,
        guide_node: cc.Node,
        movehand: {
            'default': null,
            type: cc.Sprite
        },

        bstartgame: false,
        mode_menu: cc.Node
    },

    easy: function easy() {
        this.mode_menu.active = false;
        this.gmode = 1;
        this.bottomLabel.string = 'Select the animal you heard. Only one animal at this level.';

        this.guideStart();
    },
    normal: function normal() {
        this.mode_menu.active = false;
        this.gmode = 2;
        this.bottomLabel.string = 'Two animals made sounds at the same time. Try to find them.';

        this.guideStart();
    },
    hard: function hard() {
        this.mode_menu.active = false;
        this.gmode = 3;
        this.bottomLabel.string = 'Three animals made sounds at the same time. Try to find all of them.';
        this.guideStart();
    },

    // use this for initialization
    onClickGuide: function onClickGuide() {
        this.guide_node.active = false;
    },
    onLoad: function onLoad() {
        this.mode_menu.active = true;

        this.records = [];

        //动作
        var pos = cc.v2(118, 2);
        this.movehand.node.setPosition(pos);
        var moveTo = cc.moveTo(0.3, cc.v2(125, 17));
        var moveBack = cc.moveTo(0.3, cc.v2(118, 2));

        this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
        this.movehand.node.runAction(this.action);
    },

    guideStart: function guideStart() {
        guide('speaker', ['03/guide-1', '03/guide-2'], this.onGuideEnd.bind(this));
    },
    onGuideEnd: function onGuideEnd() {
        this.setactive();
    },

    getRandomNum: function getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.round(Rand * Range);
    },

    _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
    },

    playerror: function playerror() {
        this._playSFX(this.errorAudio);
    },

    playright: function playright() {
        this._playSFX(this.audioRight);
    },

    playsuccess: function playsuccess() {
        this._playSFX(this.audioSuccess);
    },

    setactive: function setactive() {
        var _this = this;

        this.bstartgame = true;
        this._time = 0;
        this.node.active = true;
        //随机动物
        this.anims = _.map(_.range(0, this.gmode), function () {
            var i = _this.getRandomNum(1, 10);
            return i;
        });
        this.playEffect();

        //对图片进行随机选择和排序，1~4,11~14.。。每个选择一个，压入数组
        this.initAllPic();
    },
    playEffect: function playEffect() {
        var _this2 = this;

        console.log(this.anims);
        _.each(this.anims, function (i) {
            //播放选择的音乐
            cc.audioEngine.playEffect(_this2['audio' + sprintf('%02d', i)], false);
        });
    },
    reset: function reset() {

        var Pos = cc.p(-2000, -2000);
        this.choose1.node.setPosition(Pos);
        this.choose2.node.setPosition(Pos);
        this.timeStatus == 0;

        this.setactive();
    },
    initAllPic: function initAllPic() {
        var numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var others = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112];
        //数组乱序
        numArray.sort(function () {
            return Math.random() > 0.5 ? -1 : 1;
        });
        others.sort(function () {
            return Math.random() > 0.5 ? -1 : 1;
        });
        others.pop();
        others.pop();

        this.ranNumArray = numArray.concat(others).sort(function () {
            return Math.random() > 0.5 ? -1 : 1;
        });
        for (var i = 0; i < this.ranNumArray.length; i++) {
            this.setpic(this.ranNumArray[i], this['item' + (i + 1)]);
        }
    },

    setpic: function setpic(index, target) {
        var path = "03/pre/" + index;

        cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            target.spriteFrame = spriteFrame;
        });

        // var realUrl = cc.url.raw(path);
        // var texture = cc.textureCache.addImage(realUrl);
        // target.spriteFrame.setTexture(texture);
    },
    setChoose: function setChoose(target) {

        console.log("setChoose");
        var x = target.node.getPosition().x;
        var y = target.node.getPosition().y;
        var Pos = cc.p(x, y);
        console.log(x, ",", y);

        var choose_node = this['choose' + this.records.length];

        this.playright();
        choose_node.node.setPosition(Pos);

        if (this.records.length != this.anims.length) return;

        this.timeStatus = -1;
        this.scheduleOnce(function () {
            // 播放成功音乐
            this.playsuccess();
        }, 1);
        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            //this.gonext();
            this.finish();
        }, 2);
    },

    finish: function finish() {

        var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
        var timeStr = String(this._time);
        var finalStr = timeStr.replace(regex, "$1");
        this.usetime = finalStr;

        game.postGameScore('speaker', this.usetime, true);
        ScoreView.show('speaker', this.usetime, true);

        //this.node.active = false;
    },

    update: function update(dt) {
        if (!this.bstartgame) return;
        if (this.timeStatus == 0) {
            this._time += dt;
            // [正则表达式]获取小数点后三位
            var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
            var timeStr = String(this._time);
            var finalStr = timeStr.replace(regex, "$1");
            finalStr = finalStr + "s";
            this.label.string = finalStr;
        }
    },
    gonext: function gonext() {
        if (this.node.active == true) {

            console.log("gonext game");
            this.node.active = false;
            this.last.setactive();
            console.log("222222 game");
        }
    },
    isCorrect: function isCorrect(num) {
        return this.anims.indexOf(num) != -1;
    },
    isInRecords: function isInRecords(num) {
        return this.records.indexOf(num) != -1;
    },
    itemclick: function itemclick(e, index) {
        var tmp = parseInt(this.ranNumArray[index * 1 - 1]);
        if (this.isCorrect(tmp) && !this.isInRecords(tmp)) {
            this.records.push(tmp);
            this.setChoose(this['item' + index]);
        } else {
            this.playerror();
        }
    },

    replay: function replay() {
        this.playEffect();
        // cc.audioEngine.playEffect( this.ranAduio, false );
    },

    goHome: function goHome() {

        console.log("goHome");
        cc.director.loadScene("MainScene");
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"../common/Game":"Game","../common/ScoreView":"scoreView","../common/guide":"guide","s03_last_layer":"s03_last_layer"}],"s03_ins_alyer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f30ca9/2QdJuanDbpN+GStl', 's03_ins_alyer');
// scripts\03\s03_ins_alyer.js

var game = require('s03_game_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        game: game
    },

    // use this for initialization
    onLoad: function onLoad() {},
    gonext: function gonext() {
        console.log("111111 ins");
        if (this.node.active == true) {

            console.log("gonext ins");
            this.node.active = false;
            this.game.setactive();
            console.log("222222 ins");
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s03_game_layer":"s03_game_layer"}],"s03_last_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '87f18v6AWpPzaRxz4giHWal', 's03_last_layer');
// scripts\03\s03_last_layer.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.node.active = false;
    },
    setactive: function setactive() {
        this.node.active = true;
    },

    goMain: function goMain() {
        cc.director.loadScene("MainScene");
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"s04_game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '991d9MZdoFKiIIKubXWs/sj', 's04_game');
// scripts\04\s04_game.js


var ScoreView = require('../common/ScoreView');
var device = require('../common/device');
var game = require('../common/game');
var EatManager = require('EatManager');
var Fish = require('Fish');
var Scroller = require('Scroller');

cc.Class({
    'extends': cc.Component,

    properties: {
        gameTime: 30,
        background: cc.Node,
        eatManager: EatManager,
        fish: Fish,
        timeLabel: cc.Label,
        scoreLabel: cc.Label,
        hpNodes: [cc.Node]
    },

    onLoad: function onLoad() {
        var _this = this;

        this.hp = 3;
        this.score = 0;
        this.enable = true;
        this.fish.init(this);
        this._decibelChange = false;

        setTimeout(function () {
            _this._gameStart();
        }, 10);
        setTimeout(function () {
            _this.initEvent();
        }, 200);
    },
    initEvent: function initEvent() {
        if (cc.sys.os != cc.sys.OS_ANDROID) {
            var listener = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this.onTap.bind(this)
            };
            cc.eventManager.addListener(listener, this.eatManager.node);
            return;
        }
        this.schedule(this._loadDecibel, 1 / 15);
    },
    _loadDecibel: function _loadDecibel() {
        var value = device.getDecibel();
        // cc.log(value);
        if (value >= 35) {
            this.onTap();
            this._decibelChange = true;
        }
    },
    onTap: function onTap() {
        if (!this.enable) return false;
        this.fish.rise();
        return false;
    },

    _gameStart: function _gameStart() {
        this.score = 0;
        this.eatManager.startSpawn();
        this.fish.startFly();
        this.startTimer();
        device.recordStart();
    },

    gameOver: function gameOver() {
        var _this2 = this;

        this.fish.isDead = true;
        this.enable = false;
        this.endTimer();
        this.eatManager.reset();
        this.background.getComponent(Scroller).stopScroll();
        this.unschedule(this._loadDecibel);
        device.recordStop();
        if (!this._decibelChange) {
            game.confirm('The microphone did not detect a loud enough voice. Did you make an audible sound?', function (b) {
                if (b) {
                    game.postGameScore('microphone', 'not work', false);
                    ScoreView.show('microphone', 'not work', false);
                } else {
                    game.postGameScore('microphone', this.score, true);
                    ScoreView.show('microphone', this.score, true);
                }
            });
            return;
        }
        setTimeout(function () {
            game.postGameScore('microphone', _this2.score, true);
            ScoreView.show('microphone', _this2.score, true);
        }, 2 * 1000);
    },

    addHp: function addHp() {
        this.hp++;
        if (this.hp >= 3) {
            this.hp = 3;
        }
        this.updateHp();
    },
    subHp: function subHp() {
        this.hp--;
        if (this.hp <= 0) {
            this.hp = 0;
            this.gameOver();
        }
        this.updateHp();
    },
    addScore: function addScore(n) {
        this.score += n;
        this.updateScore();
    },
    subScore: function subScore(n) {
        this.score -= n;
        if (this.score <= 0) this.score = 0;
        this.updateScore();
    },
    updateScore: function updateScore() {
        this.scoreLabel.string = this.score.toString();
    },
    updateHp: function updateHp() {
        for (var i = this.hpNodes.length - 1; i >= 0; i--) {
            var node = this.hpNodes[i];
            node.active = false;
        }
        for (var i = 0; i < this.hp; i++) {
            this.hpNodes[i].active = true;
        }
    },
    startTimer: function startTimer() {
        this._time = this.gameTime;
        this.schedule(this._updateTimer, 0.1);
    },
    _updateTimer: function _updateTimer(dt) {
        this._time += dt;
        //if(this._time <= 0 ){
        //    this._time = 0;
        //    this.gameOver();
        //}
        this._time = this._time.toFixed(2) * 1;
        var str = this._time + 's';
        this.timeLabel.string = str;
    },
    endTimer: function endTimer() {
        this.unschedule(this._updateTimer);
    }
});

cc._RFpop();
},{"../common/ScoreView":"scoreView","../common/device":"device","../common/game":"Game","EatManager":"EatManager","Fish":"Fish","Scroller":"Scroller"}],"s04_ins2_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9c41bgSfqRL5b8xc0gAEi7A', 's04_ins2_layer');
// scripts\04\s04_ins2_layer.js


var game = require('../common/Game');
var guide = require('../common/guide');
cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.node.active = false; 

        this.node.active = false;
        guide('microphone', ['04/guide-1', '04/guide-2', '04/guide-3', '04/guide-4'], function () {
            cc.director.loadScene('04_game');
        });
    },

    setactive: function setactive() {
        this.node.active = true;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"../common/Game":"Game","../common/guide":"guide"}],"s04_ins_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2f529mSL7FEdqxr3D4aqyHf', 's04_ins_layer');
// scripts\04\s04_ins_layer.js

var rec = require('s04_record_layer');

cc.Class({
    'extends': cc.Component,

    properties: {
        rec: rec
    },

    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    // use this for initialization
    onLoad: function onLoad() {},

    gonext: function gonext() {
        if (this.node.active == true) {

            this.node.active = false;
            this.rec.setactive();
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s04_record_layer":"s04_record_layer"}],"s04_record_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4f9e7SB345OcaVrpmQePu1Q', 's04_record_layer');
// scripts\04\s04_record_layer.js

var Result = require('s04_result_layer');
var device = require('../common/device');
var game = require('../common/game');

cc.Class({
    'extends': cc.Component,

    properties: {

        waveAnim: {
            'default': null,
            type: cc.Animation
        },
        recbtn: {
            'default': null,
            type: cc.Sprite
        },
        result: Result,

        guide_node: cc.Node
    },

    setactive: function setactive() {
        this.node.active = true;
    },

    onClickGuide: function onClickGuide() {
        console.log("onClickGuide");
        this.guide_node.active = false;
        this.setactive();
    },
    onLoad: function onLoad() {
        //this.node.active = false;
        // 添加单点触摸事件监听器
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this._onTouchStart.bind(this),
            onTouchMove: function onTouchMove() {},
            onTouchEnded: this._onTouchEnd.bind(this),
            onTouchCancelled: this._onTouchEnd.bind(this)
        };
        cc.eventManager.addListener(listener, this.recbtn.node);
    },
    _onTouchStart: function _onTouchStart(touche, event) {
        var rect = this.recbtn.node.getBoundingBoxToWorld();
        var reb = cc.rectContainsPoint(rect, touche.getLocation());
        if (reb) {
            var anim = this.waveAnim;
            anim.play();
            this._startTime = Date.now();
            device.recordStart();
            return true;
        }
        return false;
    },

    _onTouchEnd: function _onTouchEnd(touche, event) {
        var anim = this.waveAnim;
        anim.stop();
        device.recordStop();

        if (Date.now() - this._startTime <= 1000) {
            game.showTips('too short');
            return;
        }
        this.scheduleOnce(function () {
            this.node.active = false;
            this.result.setactive();
        }, 1);
    }
});

cc._RFpop();
},{"../common/device":"device","../common/game":"Game","s04_result_layer":"s04_result_layer"}],"s04_result_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2e5a4fbA4VH0pEVz1D4+/cx', 's04_result_layer');
// scripts\04\s04_result_layer.js


var device = require('../common/device');
var game = require('../common/game');
var ScoreView = require('../common/ScoreView');

var Ins2 = require('s04_ins2_layer');

cc.Class({
    'extends': cc.Component,

    properties: {
        ins: Ins2

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.active = false;
    },

    setactive: function setactive() {
        this.node.active = true;
    },
    repalyMic: function repalyMic() {
        device.playRecord();
    },
    onYes: function onYes() {
        //cc.director.loadScene('04_game');
        //显示04game的说明
        this.ins.setactive();
    },
    onNo: function onNo() {
        //cc.director.loadScene('04_game');
        game.postGameScore('microphone', 0, false);
        ScoreView.show('microphone', 0, false);
    }
});

cc._RFpop();
},{"../common/ScoreView":"scoreView","../common/device":"device","../common/game":"Game","s04_ins2_layer":"s04_ins2_layer"}],"s05":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dad05Q9EP9GoqnxEBeRD3n4', 's05');
// scripts\05\s05.js

var game = require('../common/Game');
var device = require('../common/Device');
var ScoreView = require('../common/ScoreView');

cc.Class({
  'extends': cc.Component,

  properties: {
    backCamera: cc.Node,
    frontCamera: cc.Node,
    compound: cc.Node,
    content: cc.Node,
    topBar: cc.Node,
    bottomBar: cc.Node,
    photoBtn: cc.Node
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.glassFile = 'res/raw-assets/resources/05/glass' + Math.ceil(Math.random() * 4) + '.png';
    this.backFile = null;
    this.frontFile = null;
    this.backCameraId = device.getBackCameraId();
    this.frontCameraId = device.getFrontCameraId();

    this.hideBar();
    setTimeout(this.showBackCamera.bind(this), 100);
  },
  onDisable: function onDisable() {
    this.endCamera();
  },
  showBackCamera: function showBackCamera() {
    var _this = this;

    this.showBar();

    this.backCamera.active = true;
    this.frontCamera.active = false;
    this.compound.active = false;
    this.startCamera(this.backCameraId);

    game.confirm('Is your back camera activated?', function (b) {
      if (!b) {
        _this.hideBar();
        _this.showFrontCamera();
      }
    });
  },
  showFrontCamera: function showFrontCamera() {
    var _this2 = this;

    this.showBar();
    this.backCamera.active = false;
    this.frontCamera.active = true;
    this.compound.active = false;
    this.startCamera(this.frontCameraId);

    var winSize = cc.director.getWinSize();
    var stencil = new _ccsg.Sprite('res/raw-assets/resources/05/top_body.png');
    var cn = new cc.ClippingNode(stencil);
    cn.setContentSize(winSize);
    cn.setInverted(true);
    cn.setAlphaThreshold(0.05);

    var bg = new _ccsg.Sprite(this.backFile || 'res/raw-assets/resources/05/bg.png');
    bg.setScale(winSize.width / bg.getContentSize().width);
    cn.addChild(bg);

    this.content._sgNode.addChild(cn, 2);

    var glass = new _ccsg.Sprite(this.glassFile);
    this.content._sgNode.addChild(glass, 3);

    game.confirm('Is your front camera activated?', function (b) {
      if (!b) {
        game.postGameScore('cameras', 'not work', false);
        _this2.onNext();
      }
    });
  },
  showCompound: function showCompound() {
    this.content._sgNode.removeAllChildren();
    this.backCamera.active = false;
    this.frontCamera.active = false;
    this.compound.active = true;

    var winSize = cc.director.getWinSize();
    var stencil = new _ccsg.Sprite('res/raw-assets/resources/05/top_body.png');
    var cn = new cc.ClippingNode(stencil);
    cn.setContentSize(winSize);
    cn.setInverted(true);
    cn.setAlphaThreshold(0.05);

    var bg = new _ccsg.Sprite(this.backFile || 'res/raw-assets/resources/05/bg.png');
    bg.setScale(winSize.width / bg.getContentSize().width);
    cn.addChild(bg);

    this.content._sgNode.addChild(cn, 2);

    var glass = new _ccsg.Sprite(this.glassFile);
    this.content._sgNode.addChild(glass, 3);

    var frontSp = new _ccsg.Sprite(this.frontFile);
    frontSp.setScale(winSize.width / frontSp.getContentSize().width);
    this.content._sgNode.addChild(frontSp, 1);

    setTimeout(this.saveFile.bind(this), 10);
  },
  startCamera: function startCamera(camera_id) {
    device.cameraStart(camera_id);
  },
  endCamera: function endCamera() {
    device.cameraStop();
  },
  onTakeBackPhoto: function onTakeBackPhoto() {
    var _this3 = this;

    this.hideBar();
    device.cameraCapture(function (file) {
      _this3.setBackBg(file);
    });
  },
  onTakeFrontPhoto: function onTakeFrontPhoto() {
    var _this4 = this;

    this.hideBar();
    device.cameraCapture(function (file) {
      _this4.setFrontBg(file);
    });
  },
  setBackBg: function setBackBg(file) {
    this.backFile = file;
    this.endCamera();
    this.backCamera.active = false;
    setTimeout(this.showFrontCamera.bind(this), 1000);
  },
  setFrontBg: function setFrontBg(file) {
    this.frontFile = file;
    this.endCamera();
    this.showCompound();
  },
  onSelectPhoto: function onSelectPhoto() {},
  onShare: function onShare() {
    device.shareToOtherApp(this.photoFile);
  },
  onNext: function onNext() {
    game.showNextGame('cameras');
  },
  onRePlay: function onRePlay() {
    cc.director.loadScene('05');
  },
  showBar: function showBar() {
    this.topBar.active = true;
    this.bottomBar.active = true;
  },
  hideBar: function hideBar() {
    this.topBar.active = false;
    this.bottomBar.active = false;
  },
  saveFile: function saveFile() {
    var _this5 = this;

    this.hideBar();

    var winSize = cc.director.getWinSize();
    var renderTexture = jsb.RenderTextureMyCreate(winSize.width, winSize.height);

    renderTexture.begin();
    cc.director.getRunningScene().visit();
    renderTexture.end();
    var filename = 'camera-' + Date.now() + '.png';
    var filepath = jsb.fileUtils.getWritablePath() + filename;

    renderTexture.saveToFile(filename, cc.ImageFormat.PNG, true, function () {
      device.addToGallery(filepath);
      _this5.photoFile = filepath;
      _this5.showBar();
      game.postGameScore('cameras', 'is work', true);
    });
  }
});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/ScoreView":"scoreView"}],"s06":[function(require,module,exports){
"use strict";
cc._RFpush(module, '87488OGQAZEJ54BV+o+O2+m', 's06');
// scripts\06\s06.js

var game = require('../common/Game');
var device = require('../common/Device');
var ScoreView = require('../common/ScoreView');

cc.Class({
  'extends': cc.Component,

  properties: {
    controllerPower: {
      'default': 0.1,
      type: cc.Integer
    },
    maxPower: {
      'default': 1000,
      type: cc.Integer
    },
    ins: cc.Node,
    game: cc.Node,
    //controller: cc.Node,
    light1: cc.Node,
    light2: cc.Node,

    askNode: cc.Node,
    timeLabel: cc.Label,

    zhen: {
      'default': null,
      type: cc.Sprite
    },

    goon: {
      'default': null,
      type: cc.Sprite
    },
    b2: {
      'default': null,
      type: cc.Sprite
    },

    stopbtn: {
      'default': null,
      type: cc.Sprite
    },

    action: null,

    step: 0,
    pause: false,

    finish: false,

    level: {
      'default': null,
      type: cc.Sprite
    },

    modepanel: {
      'default': null,
      type: cc.Node
    },
    imode: 0,

    speed: 1,
    bstartgame: false,
    movehand: {
      'default': null,
      type: cc.Sprite
    }
  },

  onLoad: function onLoad() {
    this.step = 0;
    //this.game.active = false;
    this._updateTimer = this._updateTimer.bind(this);
    this.curPower = 0;
    this.askNode.active = false;
    this.light1.node.active = true;
    this.light2.node.active = false;

    //动作
    var pos = cc.v2(50, 50);
    this.movehand.node.setPosition(pos);
    var moveTo = cc.moveTo(0.3, cc.v2(60, 60));
    var moveBack = cc.moveTo(0.3, cc.v2(50, 50));

    this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
    this.movehand.node.runAction(this.action);

    //this.controller_pos = this.controller.node.getParent().convertToWorldSpaceAR(this.controller.node.position);

    //let listener = {
    //  event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //  onTouchBegan: this._onTouchStart.bind(this),
    //  onTouchMoved: this._onTouchMove.bind(this),
    //  onTouchEnded: this._onTouchEnd.bind(this),
    //  onTouchCancelled: this._onTouchEnd.bind(this)
    //}
    //this._touch_listener = cc.eventManager.addListener(listener, this.controller.node);

    //this.resetBattery();

    this._updateTimer(0);

    this.finish = false;
    this.modepanel.active = true;
    this.speed = 1;
  },
  startTimer: function startTimer() {
    this._time = 0;
    this.schedule(this._updateTimer, 0.1);
  },
  _updateTimer: function _updateTimer(dt) {
    if (!this.bstartgame) {
      return;
    }
    this._time += dt;
    this._time = this._time.toFixed(2) * 1;
    var str = this._time + 's';
    this.timeLabel.string = str;
  },
  endTimer: function endTimer() {
    this.unschedule(this._updateTimer);
  },
  //resetBattery:function (){
  //  //this.controller.node.rotation = 0;
  //  this.curPower = 0;
  //  this._offset = 0;
  //  this.updateBattery();
  //
  //},
  //updateBattery:function (){
  //  let w = (this.curPower / this.maxPower) * this.battery_size.width;
  //  w = w > this.battery_size.width ? this.battery_size.width : w;
  //  this.battery.node.setContentSize(cc.size(w,this.battery_size.height));
  //  if(w == this.battery_size.width ){
  //      this.flash();
  //  }
  //},
  //_onTouchStart: function(touche, event) {
  //  let rect = this.controller.node.getBoundingBoxToWorld();
  //  let reb = cc.rectContainsPoint(rect,touche.getLocation());
  //  if(reb){
  //      let touch_pos = touche.getLocation();
  //      let angleRadians = cc.pToAngle(cc.pSub(touch_pos,this.controller_pos));
  //      this._offset = cc.radiansToDegrees(-angleRadians);
  //      return true;
  //  }
  //  return false;
  //},
  //_onTouchMove: function(touche, event) {
  //  let touch_pos = touche.getLocation();
  //  let angleRadians = cc.pToAngle(cc.pSub(touch_pos,this.controller_pos));
  //  let rot = cc.radiansToDegrees(-angleRadians);
  //  this.controller.node.rotation = rot - this._offset;
  //
  //  this.curPower += (Math.abs(this.controller.node.rotation)/200);
  //  this.updateBattery();
  //},
  //_onTouchEnd: function(touche, event) {
  //  this.resetBattery();
  //},
  flash: function flash() {
    var _this = this;

    device.flash();

    this.endTimer();

    this.light1.node.active = false;
    this.light2.node.active = true;

    this.finish = true;
    setTimeout(function () {
      //this.light1.node.active = true;
      //this.light2.node.active = false;
      _this.showMsg();
    }, 3000);
    cc.eventManager.removeListener(this._touch_listener);
  },
  showMsg: function showMsg() {
    this.askNode.active = true;
  },
  askYes: function askYes() {

    device.flashStop();
    game.postGameScore('flashlight', this._time, true);
    ScoreView.show('flashlight', this._time, true);
  },
  askNo: function askNo() {
    device.flashStop();

    game.postGameScore('flashlight', this._time, false);
    ScoreView.show('flashlight', this._time, false);
  },

  clickIns: function clickIns() {
    console.log("clickIns");
    this.ins.active = false;
    this.game.active = true;
    this.bstartgame = true;
    this.startgo();
  },

  clickBtn: function clickBtn() {
    var _this2 = this;

    if (this.finish) return;

    this.zhen.node.stopAction(this.action);
    this.stopbtn.node.active = false;
    this.tickStop();

    setTimeout(function () {
      _this2.palyGoon();
      var pos = cc.v2(10, 10);
      _this2.zhen.node.setPosition(pos);
      var moveTo = cc.moveTo(_this2.speed, cc.v2(300, 10));
      var moveBack = cc.moveTo(_this2.speed, cc.v2(0, 10));

      _this2.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
      _this2.zhen.node.runAction(_this2.action);

      console.log("clickBtn");
      _this2.stopbtn.node.active = true;
    }, 1000);
  },

  tickStop: function tickStop() {

    var point = cc.v2(this.zhen.node.x + 10, this.zhen.node.y + 50);
    var isCollisionEnd = cc.rectContainsPoint(cc.rect(this.level.node.x, this.level.node.y, this.level.node.width, this.level.node.height), point);

    console.log("point:", this.zhen.node.x + 10, "  ", this.zhen.node.y + 50);
    console.log("rectContainsPoint:", this.level.node.x, "  ", this.level.node.y, "  ", this.level.node.width, this.level.node.height);

    if (!isCollisionEnd) {
      this.updateBattery2(-2);
    } else {
      this.updateBattery2(1);
    }
  },

  goRUN: function goRUN() {

    //this.zhen.node.rotation = 0;
    //this.go.node.active = false;
    //var rotateTo = cc.rotateBy  (1, 180);
    //var rotateBack = cc.rotateBy (1, -180);
    //
    //this.go.node.active = false;
    //this.action = cc.repeatForever(cc.sequence(rotateTo,rotateBack))
    //this.zhen.node.runAction( this.action );
  },

  updateBattery2: function updateBattery2(step) {
    console.log("updateBatteryof5  step:", step, "  ", this.step);

    this.step = this.step + step;
    if (this.step < 0) this.step = 0;
    if (this.step > 7) this.step = 7;

    //let w = (this.step / 7) * this.b2_size.width;
    this.b2.fillRange = this.step / 7;
    if (this.step == 7) {
      this.flash();
    }
  },

  palyGoon: function palyGoon() {
    var _this3 = this;

    this.goon.node.active = true;

    var action = cc.sequence(cc.scaleTo(0.2, 5), cc.scaleTo(0.2, 1));
    this.goon.node.runAction(action);
    console.log("palyGoon");
    setTimeout(function () {
      _this3.goon.node.active = false;
    }, 400);
  },

  select01: function select01() {
    console.log("select01");
    this.ins.active = true;
    this.imode = 1;
    this.speed = 1;
    ///this.setpic(1,this.level);

    this.modepanel.active = false;

    //打击区域的设置
    this.level.node.width = 100;
    var pos = cc.v2(165 - this.level.node.width / 2, 20);
    this.level.node.setPosition(pos);
  },

  select02: function select02() {
    console.log("select02");
    this.ins.active = true;
    this.imode = 2;
    this.speed = 0.8;
    //this.setpic(2,this.level);
    this.modepanel.active = false;

    //打击区域的设置
    this.level.node.width = 80;
    var pos = cc.v2(165 - this.level.node.width / 2, 20);
    this.level.node.setPosition(pos);
  },

  select03: function select03() {
    console.log("select03");
    this.ins.active = true;
    this.imode = 3;
    this.speed = 0.6;
    //this.setpic(3,this.level);
    this.modepanel.active = false;

    //打击区域的设置
    this.level.node.width = 60;
    var pos = cc.v2(165 - this.level.node.width / 2, 20);
    this.level.node.setPosition(pos);
  },

  setpic: function setpic(index, target) {
    var path = "resources/06/level" + index + ".png";
    console.log(path);
    var realUrl = cc.url.raw(path);
    var texture = cc.textureCache.addImage(realUrl);
    target.spriteFrame.setTexture(texture);
  },

  startgo: function startgo() {

    var moveTo = cc.moveTo(this.speed, cc.v2(300, 10));
    var moveBack = cc.moveTo(this.speed, cc.v2(0, 10));

    this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
    this.zhen.node.runAction(this.action);
    console.log("start");
    this.startTimer();
  }

});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/ScoreView":"scoreView"}],"s07_bar":[function(require,module,exports){
"use strict";
cc._RFpush(module, '29037Xq+iRIxaDc2V8SijO4', 's07_bar');
// scripts\07\s07_bar.js

var game = require('../common/Game');
var device = require('../common/Device');

var balls = 4;

cc.Class({
    'extends': cc.Component,
    properties: {
        target_node: cc.Node,
        point_node: cc.Node,
        bar_node: cc.Node,
        score: 0,
        good: {
            'default': null,
            type: cc.Sprite
        },
        perfect: {
            'default': null,
            type: cc.Sprite
        },
        amazing: {
            'default': null,
            type: cc.Sprite
        },

        addscore: {
            'default': null,
            type: cc.Sprite
        },

        miss: {
            'default': null,
            type: cc.Sprite
        },

        poor: {
            'default': null,
            type: cc.Sprite
        },

        audio_hit01: {
            'default': null,
            url: cc.AudioClip
        },

        audio_hit02: {
            'default': null,
            url: cc.AudioClip
        },

        audio_hit03: {
            'default': null,
            url: cc.AudioClip
        },

        bGen: true

    },
    setSpeed: function setSpeed(speed) {
        this.speed = speed;
    },

    setIndex: function setIndex(index) {
        this.index = index;
    },

    setGen: function setGen(bGen) {
        this.bGen = bGen;
        console.log("setGen", bGen);
    },
    // use this for initialization
    onLoad: function onLoad() {
        var _this = this;

        this.point_node.on('touchstart', function () {

            if (_this.isContain()) {
                device.vibrator();
                if (_this.index == 1) cc.audioEngine.playEffect(_this.audio_hit01, false);else if (_this.index == 2) cc.audioEngine.playEffect(_this.audio_hit02, false);else if (_this.index == 3) cc.audioEngine.playEffect(_this.audio_hit03, false);
            }
        }, this.point_node);
    },
    isContain: function isContain() {
        var children = this.bar_node.children;
        var button = {
            radius: this.target_node.getContentSize().width * 1.5,
            position: this.target_node.getPosition()
        };
        //console.log("children.length           ",children.length);
        //console.log("position           ",button.position);
        if (children.length > 1) {
            for (var i = children.length - 1; i >= 1; i--) {

                var node = children[i];
                var ball = {
                    radius: node.getContentSize().width / 2,
                    position: node.getPosition()
                };
                if (cc.Intersection.circleCircle(button, ball)) {
                    //======Perfect
                    var distance = Math.abs(button.position.y - ball.position.y);
                    if (distance < 30) {
                        this.palyPerfect();
                        //this.palyAddscore(3);
                        node.removeFromParent();
                        this.score += 3;
                        return true;
                    } else if (distance < 100) {
                        this.palyGood();
                        //this.palyAddscore(2);
                        this.score += 2;
                        node.removeFromParent();
                        return true;
                    } else {
                        this.palyPoor();
                        //this.palyAddscore(1);
                        this.score += 1;
                        node.removeFromParent();
                        return true;
                    }
                }
            }
        }

        return false;
    },
    newPoint: function newPoint() {
        var _this2 = this;

        var url = '07/b' + Math.ceil(Math.random() * balls);
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            var node = new cc.Node('');
            var sprite = node.addComponent(cc.Sprite);
            node.x = 0;
            node.y = _this2.bar_node.getContentSize().height - 72;
            sprite.spriteFrame = spriteFrame;

            var action = cc.sequence(cc.moveTo(10 / _this2.speed, cc.v2(0, -100)),
            //cc.moveTo(5,cc.v2(6,-100)),
            cc.callFunc(function () {
                node && node.removeFromParent();
            }));

            _this2.bar_node.addChild(node);
            node.runAction(action);
        });
    },
    updateMe: function updateMe(dt) {
        if (Math.random() > 0.6 && this.bGen) {
            this.newPoint();
        }
    },

    palyPoor: function palyPoor() {
        var _this3 = this;

        this.poor.node.active = true;

        var action = cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 1));
        this.poor.node.runAction(action);

        setTimeout(function () {
            _this3.poor.node.active = false;
        }, 500);
    },

    palyGood: function palyGood() {
        var _this4 = this;

        this.good.node.active = true;

        var action = cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 1));
        this.good.node.runAction(action);

        setTimeout(function () {
            _this4.good.node.active = false;
        }, 500);
    },

    palyMiss: function palyMiss() {
        var _this5 = this;

        this.miss.node.active = true;

        var action = cc.blink(0.5, 5);
        this.miss.node.runAction(action);

        setTimeout(function () {
            _this5.miss.node.active = false;
        }, 500);
    },

    palyPerfect: function palyPerfect() {
        var _this6 = this;

        this.perfect.node.active = true;

        var action = cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 1));
        this.perfect.node.runAction(action);

        setTimeout(function () {
            _this6.perfect.node.active = false;
        }, 500);
    },

    palyAmazing: function palyAmazing() {
        var _this7 = this;

        this.amazing.node.active = true;

        var action = cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 1));
        this.amazing.node.runAction(action);

        setTimeout(function () {
            _this7.amazing.node.active = false;
        }, 500);
    },

    palyAddscore: function palyAddscore(score) {
        var _this8 = this;

        this.addscore.node.active = true;

        this.setpic(score, this.addscore);

        var action = cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 1));
        this.addscore.node.runAction(action);

        setTimeout(function () {
            _this8.addscore.node.active = false;
        }, 400);
    },

    setpic: function setpic(score, target) {
        var path = "resources/07/tmpUI/" + score + ".png";

        var realUrl = cc.url.raw(path);
        var texture = cc.textureCache.addImage(realUrl);
        target.spriteFrame.setTexture(texture);
    },

    update: function update(dt) {

        var children = this.bar_node.children;

        //console.log(" update  children.length           ",children.length);

        for (var i = children.length - 1; i >= 0; i--) {

            var node = children[i];

            if (node.y < 0) {
                node.removeFromParent();
                node.active = false;
                this.palyMiss();
            }
        }
    }
});
////======Amazing
//let buttonAmazing = {
//    radius : this.target_node.getContentSize().width *0.2,
//    position : this.target_node.getPosition()
//};
//
//if(cc.Intersection.circleCircle(buttonAmazing,ball)) {
//    this.palyAmazing();
//    this.palyAddscore(4);
//    node.removeFromParent();
//    return true;
//}
//======Poor
//let buttonPoor = {
//    radius : this.target_node.getContentSize().width *1.4,
//    position : this.target_node.getPosition()
//};
//
//if(cc.Intersection.circleCircle(buttonPoor,ball)) {
//    this.palyPoor();
//    this.palyAddscore(1);
//    node.removeFromParent();
//    return true;
//}

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game"}],"s07":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ccf89X9PixMfY9Q8jRZXjRX', 's07');
// scripts\07\s07.js

var Bar = require('./s07_bar');
var game = require('../common/Game');
var device = require('../common/Device');
var ScoreView = require('../common/ScoreView');

cc.Class({
    'extends': cc.Component,

    properties: {
        bars_layer: cc.Node,
        bar_node: cc.Node,
        ask_node: cc.Node,
        mode_node: cc.Node,
        game_layer: cc.Node,
        ins_node: cc.Node,
        time: 30,
        scoreLabel: {
            'default': null,
            type: cc.Label
        },
        audio01: {
            'default': null,
            url: cc.AudioClip
        },
        audio02: {
            'default': null,
            url: cc.AudioClip
        },
        audio03: {
            'default': null,
            url: cc.AudioClip
        },
        movehand: {
            'default': null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.bars = [];
        this.bar_node.active = false;

        this.ask_node.active = false;
        this.game_layer.active = false;
        this.mode_node.active = true;
        this.ins_node.active = false;

        //动作
        var pos = cc.v2(35, 65);
        this.movehand.node.setPosition(pos);
        var moveTo = cc.moveTo(0.3, cc.v2(45, 70));
        var moveBack = cc.moveTo(0.3, cc.v2(35, 60));

        this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
        this.movehand.node.runAction(this.action);
    },

    ins_click: function ins_click() {
        this.ins_node.active = false;

        if (this.imode == 0) {
            this.easy();
        } else if (this.imode == 1) {
            this.normal();
        } else if (this.imode == 2) {
            this.hard();
        }
    },
    init: function init(cols, speed) {
        this.bars = [];

        this.game_layer.active = true;
        this.ask_node.active = false;
        this.mode_node.active = false;

        this.cols = cols;
        this.speed = speed;
        this.over = false;

        var startx = (this.bars_layer.getContentSize().width - this.bar_node.getContentSize().width * cols) / 2;
        for (var i = 0; i < cols; i++) {
            var newNode = cc.instantiate(this.bar_node);
            newNode.active = true;
            newNode.x = startx + i * this.bar_node.getContentSize().width;
            newNode.getComponent(Bar).setSpeed(speed);
            newNode.getComponent(Bar).setIndex(i + 1);
            console.log("setGen");
            newNode.getComponent(Bar).setGen(true);
            this.bars_layer.addChild(newNode);
            this.bars.push(newNode);
        }
        this.scheduleOnce(this.onStopGen, this.time);
        this.scheduleOnce(this.onTimeEnd, this.time + 3);
        this.schedule(this._makePoints, 0.5);
    },
    onTimeEnd: function onTimeEnd() {
        this.over = true;
        this.ask_node.active = true;
    },

    onStopGen: function onStopGen() {
        for (var i = this.bars.length - 1; i >= 0; i--) {
            this.bars[i].getComponent(Bar).setGen(false);
        }
    },

    hit_easy: function hit_easy() {
        this.imode = 0;
        this.ins_node.active = true;
        this.mode_node.active = false;
    },
    hit_normal: function hit_normal() {
        this.imode = 1;
        this.ins_node.active = true;
        this.mode_node.active = false;
    },
    hit_hard: function hit_hard() {
        this.imode = 2;
        this.ins_node.active = true;
        this.mode_node.active = false;
    },
    easy: function easy() {
        this.time = 31;
        this.init(3, 4);
        cc.audioEngine.end();
        cc.audioEngine.playMusic(this.audio01, false);
    },
    normal: function normal() {
        this.time = 28;
        this.init(3, 6);
        cc.audioEngine.end();
        cc.audioEngine.playMusic(this.audio02, false);
    },
    hard: function hard() {
        this.time = 30;
        this.init(3, 8);
        cc.audioEngine.end();
        cc.audioEngine.playMusic(this.audio03, false);
    },
    _makePoints: function _makePoints(dt) {
        if (this.over === true) return;
        for (var i = this.bars.length - 1; i >= 0; i--) {
            this.bars[i].getComponent(Bar).updateMe(dt);
        }
    },
    getScore: function getScore() {
        var score = 0;
        for (var i = this.bars.length - 1; i >= 0; i--) {
            score += this.bars[i].getComponent(Bar).score;
        }
        return score;
    },
    onYes: function onYes() {
        var score = this.getScore();
        game.postGameScore('vibrator', score, true);
        ScoreView.show('vibrator', score, true);
    },
    onNo: function onNo() {
        var score = this.getScore();
        game.postGameScore('vibrator', score, false);
        game.showNextGame('vibrator', score, false);
    },

    update: function update(dt) {
        this.scoreLabel.string = this.getScore();
    }
});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/ScoreView":"scoreView","./s07_bar":"s07_bar"}],"s08":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c9c4214T3lN5ZBiCh1QwU1F', 's08');
// scripts\08\s08.js

var game = require('../common/Game');
var device = require('../common/Device');
var ScoreView = require('../common/ScoreView');
var maincfg = require('../common/maincfg');

cc.Class({
    'extends': cc.Component,

    properties: {

        label: {
            'default': null,
            type: cc.Label
        },

        bl: {
            'default': null,
            type: cc.Label
        },
        bgm: {
            'default': null,
            url: cc.AudioClip
        },

        bgShake: {
            'default': null,
            type: cc.Sprite
        },

        action: null,
        status: false,

        sayUp: {
            'default': null,
            type: cc.Sprite
        },

        sayDown: {
            'default': null,
            type: cc.Sprite
        },

        tmpV: 0,
        nUp: {
            'default': null,
            type: cc.Node
        },

        nDown: {
            'default': null,
            type: cc.Node
        },

        pauseStatus: false,
        decStatus: false,
        outline: 10,

        playstatus: false,
        start02ed: false,
        volume: -1,
        last_volume: -1,
        finish_01: false,
        finish_01_done: false,
        finish_01_finish: false,
        finish_02_done: false,

        m1Anim: {
            'default': null,
            type: cc.Animation
        },
        m2Anim: {
            'default': null,
            type: cc.Animation
        },
        m3Anim: {
            'default': null,
            type: cc.Animation
        },
        m4Anim: {
            'default': null,
            type: cc.Animation
        },

        ins_node: {
            'default': null,
            type: cc.Node
        },

        finished: false,
        bstartgame: false,

        movehand: {
            'default': null,
            type: cc.Sprite
        }
    },
    cilck_ins: function cilck_ins() {
        this.ins_node.active = false;
        this.bstartgame = true;
    },
    // use this for initialization
    onLoad: function onLoad() {
        var _this = this;

        this.ins_node.active = true;
        this._time = 0;
        this.status = false;
        this.tmpV = 0;

        //动作
        var pos = cc.v2(-115, 85);
        this.movehand.node.setPosition(pos);
        var moveTo = cc.moveTo(0.3, cc.v2(-110, 95));
        var moveBack = cc.moveTo(0.3, cc.v2(-115, 85));

        this.action = cc.repeatForever(cc.sequence(moveTo, moveBack));
        this.movehand.node.runAction(this.action);

        //this.moveUpAction = cc.moveTo(1, 300);

        //var moveLeft  = cc.MoveBy.create(2,cc.p(-600,0));  // 左移

        //this.picUp.node.runAction(moveLeft);

        setTimeout(function () {
            device.volumeStart(function (v) {

                //game.showTips('volume:'+v);
                _this.tickVolume(v);
            });
        }, 2000);
    },

    tickVolume: function tickVolume(v) {

        if (v > 0) {
            //up
            this.finish_01 = true;
        }
        if (this.finish_01 && !this.finish_01_done) {
            this.shake();
            this.finish_01_done = true;
        }
        if (v < 0 && this.finish_01_finish && !this.finish_02_done) {
            //down
            this.cooldown();
            this.finish_02_done = true;
        }

        return;
        //this.last_volume = this.volume;
        //this.volume = v;
        //
        //if(this.volume > this.last_volume && this.last_volume!=-1)
        //{
        //    this.finish_01 = true;
        //}
        //
        //if(this.finish_01   && !this.finish_01_done){
        //    this.shake();
        //    this.finish_01_done = true;
        //}
        //
        //
        //if(this.volume < this.last_volume && this.finish_01_finish && !this.finish_02_done)
        //{
        //    this.cooldown();
        //    this.finish_02_done = true;
        //}
        //if(v >= 10 ){
        //    this.shake();
        //
        //
        //
        //}else if(v <=5 && this.start02ed )
        //{
        //
        //    this.cooldown();
        //
        //}
    },
    shake: function shake() {
        var _this2 = this;

        if (!this.status) {
            this.decStatus = true;
            game.showTips('volume is up!');
            //this.action = cc.repeatForever(cc.sequence(cc.scaleTo(1, 1.2),cc.scaleTo(1, 1)));
            //this.bgShake.node.runAction(this.action);
            this.status = true;

            var moveOut = cc.MoveBy.create(2, cc.p(800, 0));
            this.sayUp.node.runAction(moveOut);

            cc.audioEngine.end();
            cc.audioEngine.playMusic(this.bgm, true);
            maincfg.audioStatus = 1;

            this.m1Anim.play();
            this.m2Anim.play();
            this.m3Anim.play();
            this.m4Anim.play();

            this.playstatus = true;
            setTimeout(function () {
                _this2.start02();
            }, 3000);
        }
    },

    cooldown: function cooldown() {
        var _this3 = this;

        if (this.status) {
            this.decStatus = true;
            game.showTips('volume is down!');
            this.bgShake.node.stopAction(this.action);
            this.status = false;

            cc.audioEngine.end();

            this.playstatus = false;

            var moveLeft = cc.MoveBy.create(2, cc.p(600, 0)); // 左移
            this.sayDown.node.runAction(moveLeft);

            this.m1Anim.pause();
            this.m2Anim.pause();
            this.m3Anim.pause();
            this.m4Anim.pause();

            this.finished = true;

            setTimeout(function () {
                _this3.result(true);
            }, 2000);
        }
    },

    upBtn: function upBtn() {
        this.tmpV++;
        this.tickVolume(1);
    },
    downBtn: function downBtn() {
        this.tmpV--;
        this.tickVolume(-1);
    },

    upYes: function upYes() {
        this.nUp.active = false;
        this.pauseStatus = false;
        //
        //this.start02();

        this.result(false);
    },

    upNo: function upNo() {
        this.nUp.active = false;
        this.outline += 10;
        this.pauseStatus = false;
    },

    downYes: function downYes() {
        this.nDown.active = false;
        this.pauseStatus = false;

        this.result(false);
    },

    downNo: function downNo() {
        this.nDown.active = false;
        this.outline += 10;
        this.pauseStatus = false;
    },

    update: function update(dt) {
        if (!this.bstartgame) {
            return;
        }
        if (this.finished) return;
        if (!this.pauseStatus) this._time += dt;
        // [正则表达式]获取小数点后三位
        var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
        var timeStr = String(this._time);
        var finalStr = timeStr.replace(regex, "$1");
        finalStr = finalStr + "s";
        this.label.string = finalStr;

        if (this._time > this.outline && !this.decStatus) {
            //过了10s还未检测到任何
            if (!this.start02ed) this.nUp.active = true;else this.nDown.active = true;
            this.pauseStatus = true;
        }
    },

    start02: function start02() {
        var _this4 = this;

        //this.tmpV = 10;
        this.nUp.active = false;
        this.start02ed = true;

        this.outline = this._time + 10;
        this.decStatus = false;

        this.bgShake.node.stopAction(this.action);
        this.action = cc.repeatForever(cc.sequence(cc.scaleTo(1, 1.2), cc.scaleTo(1, 1)));
        this.bgShake.node.runAction(this.action);

        //if( !this.playstatus ){
        //    cc.audioEngine.end();
        //    cc.audioEngine.playMusic( this.bgm, true );
        //}

        var moveOut = cc.MoveBy.create(2, cc.p(-600, 0)); // 左移
        this.sayDown.node.runAction(moveOut);

        //this.bl.string = "Turn down your phone volume by pressing the [Volume Down] key on the side of your phone";
        setTimeout(function () {
            _this4.finish_01_finish = true;
        }, 2000);
    },

    result: function result(ret) {
        device.volumeStop();
        cc.audioEngine.end();
        game.postGameScore('volume_keys', this._time.toFixed(2), ret);
        ScoreView.show('volume_keys', this._time.toFixed(2), ret);
    }

});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/ScoreView":"scoreView","../common/maincfg":"maincfg"}],"s10_game_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '98a9bmwPZxOFpJWg0W6B6aM', 's10_game_layer');
// scripts\10\s10_game_layer.js

var game = require('../common/Game');
var ScoreView = require('../common/ScoreView');
var maincfg = require('../common/maincfg');

cc.Class({
    'extends': cc.Component,

    properties: {
        left: {
            'default': null,
            type: cc.Label
        },
        label: {
            'default': null,
            type: cc.Label
        },
        test: {
            'default': null,
            type: cc.Label
        },
        ball: {
            'default': null,
            type: cc.Sprite
        },
        SPEED: 1,

        box_node: {
            'default': null,
            type: cc.Node
        },

        last_x: null,
        last_y: null,
        finish: false,
        guide_node: cc.Node,
        bstartgame: false
    },

    // use this for initialization
    onLoad: function onLoad() {

        //this.node.active = false;

    },

    onClickGuide: function onClickGuide() {
        this.guide_node.active = false;
        this.bstartgame = true;
        this.setactive();
    },
    calculateFixCollision: function calculateFixCollision(point, pyc) {

        console.log("22222222");
        var radius = 16;

        var small_radius = 0;
        var big_radius = 16;

        while (small_radius < big_radius - 2) {

            radius = parseInt((small_radius + big_radius) / 2);
            console.log("cc radius", radius);
            var isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: point, radius: radius });
            if (isCollisionPath) {
                console.log("risCollisionPath");
                big_radius = radius;
            } else {
                console.log("return radius", radius);
                small_radius = radius;
            }
        }

        return small_radius;
    },

    setactive: function setactive() {

        this.node.active = true;

        this.finish = false;
        this.circleCollider = this.ball.getComponent(cc.CircleCollider);
        this.polygonCollider = this.box_node.getComponent(cc.PolygonCollider);
        this.boxCollider = this.box_node.getComponent(cc.BoxCollider);

        this._listener = this.startGame();
    },

    startGame: function startGame() {
        var _this = this;

        this._time = 0;
        var ccc = this.circleCollider;
        var pyc = this.polygonCollider;
        var bc = this.boxCollider;

        console.log("onLoad");
        cc.inputManager.setAccelerometerInterval(1 / 5);
        cc.inputManager.setAccelerometerEnabled(true);
        maincfg.accStatus = true;

        var ball = this.ball;

        var left = this.left;
        var label = this.label;
        var test = this.test;

        var speed = this.SPEED * 10;

        var bCollisionX = false;
        var bCollisionY = false;

        var calc = this.calculateFixCollision;
        this.last_x = null;
        console.log(bc);

        var listener = cc.eventManager.addListener({
            event: cc.EventListener.ACCELERATION,
            callback: function callback(acc, event) {
                //callback: function (acc, event){

                console.log("start");

                if (_this.finish) return;
                if (_this.last_x != null) {
                    console.log("2222");
                    var pointLast = cc.v2(_this.last_x, _this.last_y);
                    //判定前一个点是否已经碰撞
                    var isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointLast, radius: 16 });
                    if (isCollisionPath) {
                        test.string = "isCollisionPath";

                        var p1x = _this.last_x;
                        var p1y = _this.last_y;

                        //判定现在的点
                        p1x = _this.last_x + acc.x * speed;
                        p1y = _this.last_y + acc.y * speed;
                        var pointNext = cc.v2(p1x, p1y);
                        isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointNext, radius: 16 });
                        if (!isCollisionPath) {

                            ball.node.runAction(cc.place(cc.p(p1x.toFixed(2), p1y.toFixed(2))));
                            _this.last_x = p1x;
                            _this.last_y = p1y;

                            //var finalStr = p1x.toFixed(2) + ","+ p1y.toFixed(2);
                            //label.string = finalStr;

                            return;
                        }

                        p1x = _this.last_x;
                        p1y = _this.last_y;

                        bCollisionX = false;
                        bCollisionY = false;

                        var fixY = 0;
                        var fixX = 0;
                        //判定x单移
                        var old_p1x = p1x;
                        p1x += acc.x * speed;
                        var pointX = cc.v2(p1x, p1y);

                        isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointX, radius: 12 });
                        if (isCollisionPath) {
                            isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointX, radius: 8 });
                            if (isCollisionPath) {

                                isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointX, radius: 4 });
                                if (isCollisionPath) {
                                    bCollisionX = true;
                                } else {
                                    fixY = 8;
                                }
                            } else {
                                fixY = 4;
                            }
                        }

                        //判定y单移
                        p1y += acc.y * speed;
                        var pointY = cc.v2(old_p1x, p1y);
                        isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointY, radius: 12 });
                        if (isCollisionPath) {
                            isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointY, radius: 8 });
                            if (isCollisionPath) {
                                isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: pointY, radius: 4 });
                                if (isCollisionPath) {
                                    bCollisionY = true;
                                } else {
                                    fixX = 8;
                                }
                            } else {
                                fixX = 4;
                            }
                        }

                        if (bCollisionX && !bCollisionY) {
                            p1y = _this.last_y + acc.y * speed;
                            p1x = _this.last_x;
                            //if(acc.x > 0)
                            //    p1x =  this.last_x - fixX;
                            //else
                            //    p1x =  this.last_x + fixX;

                            test.string = "bx";
                        }

                        if (!bCollisionX && bCollisionY) {
                            p1x = _this.last_x + acc.x * speed;

                            p1y = _this.last_y;
                            //if(acc.y > 0)
                            //    p1y =  this.last_y - fixY;
                            //else
                            //    p1y =  this.last_y + fixY;

                            test.string = "by";
                        }

                        if (bCollisionX && bCollisionY) {

                            if (acc.x > 0) p1x = _this.last_x - 1;else p1x = _this.last_x + 1;

                            if (acc.y > 0) p1y = _this.last_y - 1;else p1y = _this.last_y + 1;
                            test.string = "bxby";
                        }

                        if (!bCollisionX && !bCollisionY) {
                            p1x = _this.last_x + acc.x * speed;
                            p1y = _this.last_y + acc.y * speed;

                            test.string = "nbxnby";
                        }

                        ball.node.runAction(cc.place(cc.p(p1x.toFixed(2), p1y.toFixed(2))));
                        _this.last_x = p1x;
                        _this.last_y = p1y;

                        //var finalStr = p1x.toFixed(2) + ","+ p1y.toFixed(2);
                        //label.string = finalStr;

                        console.log("return", _this.last_x, _this.last_y);
                        return;
                    }
                }

                //处理当前的点
                var size = cc.director.getWinSize();
                var s = ball.node.getContentSize();
                var p0 = ball.node.getPosition();

                console.log("acc.x", acc.x);
                console.log("p0", p0);
                console.log("speed", speed);
                var p1x = p0.x + acc.x * speed;
                if (p1x - s.width / 2 < 0) {
                    p1x = s.width / 2;
                }
                if (p1x + s.width / 2 > size.width) {
                    p1x = size.width - s.width / 2;
                }

                var p1y = p0.y + acc.y * speed;
                if (p1y - s.height / 2 < 0) {
                    p1y = s.height / 2;
                }
                if (p1y + s.height / 2 > size.height) {
                    p1y = size.height - s.height / 2;
                }

                var point = cc.v2(p1x, p1y);

                //p1x -= 1;
                //p1y -= 1;
                console.log("point", point);
                console.log("bcbcbcbcbcbc");

                var isCollisionEnd = cc.rectContainsPoint(cc.rect(bc.offset.x - 50, bc.offset.y - 50, bc.size.width, bc.size.height), point);

                if (isCollisionEnd) {

                    //test.string = "End";
                    game.showTips('you win');
                    _this.endGame();
                    return;
                }

                console.log("1111111111111111");
                var isCollisionPath = cc.Intersection.polygonCircle(pyc.world.points, { position: point, radius: 16 });
                if (isCollisionPath) {
                    test.string = "Collision";
                    //计算逆向的点
                    var ret = calc(point, pyc);
                    left.string = ret;

                    var dec = 16 - ret - 1;
                    if (acc.x > 0 && acc.y > 0) {
                        p1x = p1x - dec;
                        p1y = p1y - dec;
                    } else if (acc.x > 0 && acc.y < 0) {
                        p1x = p1x - dec;
                        p1y = p1y + dec;
                    } else if (acc.x < 0 && acc.y < 0) {
                        p1x = p1x + dec;
                        p1y = p1y + dec;
                    } else if (acc.x < 0 && acc.y > 0) {
                        p1x = p1x + dec;
                        p1y = p1y - dec;
                    }
                } else {
                    test.string = "out";
                }

                //var finalStr = p1x.toFixed(2) + ","+ p1y.toFixed(2);
                //label.string = finalStr;
                ball.node.runAction(cc.place(cc.p(p1x.toFixed(2), p1y.toFixed(2))));

                _this.last_x = p1x;
                _this.last_y = p1y;

                console.log("last", _this.last_x, _this.last_y);
            }
        }, ball.node);

        return listener;
    },

    addSpeed: function addSpeed() {
        this.SPEED += 1;
        cc.eventManager.removeListener(this._listener);
        this._listener = this.startGame();
    },

    endGame: function endGame() {
        this.finish = true;

        game.postGameScore('gyroscope', this._time.toFixed(2), true);
        ScoreView.show('gyroscope', this._time.toFixed(2), true);

        cc.eventManager.removeListener(this._listener);
        cc.inputManager.setAccelerometerEnabled(false);
        maincfg.accStatus = false;
    },

    update: function update(dt) {
        if (!this.bstartgame) {
            return;
        }
        if (!this.finish) this._time += dt;
        // [正则表达式]获取小数点后三位
        var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
        var timeStr = String(this._time);
        var finalStr = timeStr.replace(regex, "$1");
        finalStr = finalStr + "s";
        this.label.string = finalStr;
    }

});

cc._RFpop();
},{"../common/Game":"Game","../common/ScoreView":"scoreView","../common/maincfg":"maincfg"}],"s10_ins_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6f7812vAhVFtIg67VNXB+G1', 's10_ins_layer');
// scripts\10\s10_ins_layer.js

var game = require('s10_game_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        game: game
    },

    // use this for initialization
    onLoad: function onLoad() {},
    gonext: function gonext() {
        console.log("111111 ins");
        if (this.node.active == true) {

            console.log("gonext ins");
            this.node.active = false;
            this.game.setactive();
            console.log("222222 ins");
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s10_game_layer":"s10_game_layer"}],"s11_game_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1fb2bk0fp9Af6xW5khBmdj2', 's11_game_layer');
// scripts\11\s11_game_layer.js

var ScoreView = require('../common/ScoreView');
var device = require('../common/device');
var game = require('../common/game');

var maincfg = require('../common/maincfg');

var analytics = require('../common/analytics');

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },

        ask: cc.Node,
        b1: {
            'default': null,
            type: cc.Sprite
        },
        b2: {
            'default': null,
            type: cc.Sprite
        },
        accStatus: false,
        pongStatus: false,
        pongAnim: {
            'default': null,
            type: cc.Animation
        },

        decStatus: false, //检测状态
        pauseStatus: false, //检测状态时候暂停状态
        outline: 10,

        yaoAduio: {
            'default': null,
            url: cc.AudioClip
        },

        audioSuccess: {
            'default': null,
            url: cc.AudioClip
        },
        pongAduio: {
            'default': null,
            url: cc.AudioClip
        },

        end: false,

        b1Anim: {
            'default': null,
            type: cc.Animation
        },
        b2Anim: {
            'default': null,
            type: cc.Animation
        },

        num: 0,
        count: 0,
        play03: false,
        play02: false,
        play01: false,

        guide_node: cc.Node,
        moto_node: cc.Node,
        bstartgame: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.node.active = false;
        this.end = false;
    },
    onClickGuide: function onClickGuide() {
        this.guide_node.active = false;
        //moto提示
        if (analytics.isAppInstalled('com.motorola.moto')) {

            this.moto_node.active = true;
            console.log("com.motorola.moto");
        } else {
            console.log("onClickGuide no moto   ");
            this.moto_node.active = false;
            this.bstartgame = true;
            this.setactive();
        }
    },

    onClickMoto: function onClickMoto() {
        console.log("onClickMoto");
        this.moto_node.active = false;

        this.bstartgame = true;
        this.setactive();
    },

    setactive: function setactive() {
        var _this = this;

        this._time = 0;
        this.node.active = true;
        //this.pongAnim.node.active = false;
        this.b1.node.active = true;
        this.b2.node.active = false;

        cc.inputManager.setAccelerometerInterval(1 / 5);
        //在使用加速计事件监听器之前，需要先启用此硬件设备
        cc.inputManager.setAccelerometerEnabled(true);
        maincfg.accStatus = true;

        cc.eventManager.addListener({
            event: cc.EventListener.ACCELERATION,
            callback: function callback(acc, event) {
                if (_this.pauseStatus) return;
                cc.log(acc.x, acc.y);
                var nowGX = acc.x * 9.81;
                var nowGY = acc.y * 9.81;
                if ((nowGX < -8.0 || nowGX > 8.0) && (nowGY < -8.0 || nowGY > 8.0)) {
                    //this.onRock();
                    //5s 由半瓶到爆炸
                    _this.doAcc();
                } else {
                    _this.doWait();
                }
            }
        }, this.node);

        // setTimeout(()=>{
        //     this.onRock();
        // },2000);
    },

    doAcc: function doAcc() {
        var _this2 = this;

        this.accStatus = true;
        //检测状态设置为true
        this.decStatus = true;

        this.count++;
        //if(this.inner.fillRange <=0.9)
        //{
        //    cc.audioEngine.end();
        //    //播放选择的音乐
        //    cc.audioEngine.playEffect( this.yaoAduio, false );
        //}
        if (!this.audioing) {
            cc.audioEngine.end();
            //播放选择的音乐
            cc.audioEngine.playEffect(this.yaoAduio, false);
        }

        this.audioing = true;
        setTimeout(function () {
            _this2.audioing = false;
        }, 500);
    },

    doWait: function doWait() {
        this.accStatus = false;
    },

    doPong: function doPong() {
        this.palyPong();

        //进入结束条件
        this.scheduleOnce(function () {
            // 播放成功音乐
            this.playsuccess();
        }, 1);
        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            //this.gonext();
            this.finish();
        }, 2);
    },
    _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
    },
    playsuccess: function playsuccess() {
        this._playSFX(this.audioSuccess);
    },

    palyPong: function palyPong() {
        var _this3 = this;

        this.pongAnim.node.active = true;
        //播放选择的音乐
        cc.audioEngine.playEffect(this.pongAduio, false);
        var anim = this.pongAnim;
        anim.play();
        setTimeout(function () {
            _this3.pongAnim.node.active = false;
        }, 400);
    },

    onRock: function onRock() {
        var _this4 = this;

        this.bottleout.active = true;
        setTimeout(function () {
            _this4.ask.active = true;
        }, 1000);
    },
    update: function update(dt) {

        if (!this.bstartgame) return;
        if (!this.pauseStatus) this._time += dt;
        // [正则表达式]获取小数点后三位
        var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
        var timeStr = String(this._time);
        var finalStr = timeStr.replace(regex, "$1");
        finalStr = finalStr + "s";
        this.label.string = finalStr;

        //if(this.accStatus){
        //    this.inner.fillRange += dt*0.5;
        //    if( this.inner.fillRange >=0.9 && !this.end )
        //    {
        //        this.end = true;
        //        this.inner.fillRange = 1;
        //        this.accStatus = false;
        //        this.doPong();
        //    }
        //}

        if (this._time > this.outline && !this.decStatus) {
            //过了10s还未检测到任何
            this.ask.active = true;
            this.pauseStatus = true;
        }

        if (this.count > 1 && this.count <= 5 && !this.play01) {
            var anim = this.b1Anim;

            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("no1");
            this.play01 = true;
            this.decStatus = true;
        }

        if (this.count > 5 && this.count <= 10 && !this.play02) {
            var anim = this.b1Anim;

            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("no2");
            this.play02 = true;
        }

        if (this.count > 10 && !this.play03) {
            this.b1.node.active = false;
            this.b2.node.active = true;

            this.b2Anim.play();
            this.play03 = true;
            //播放选择的音乐
            cc.audioEngine.playEffect(this.pongAduio, false);
            //进入结束条件
            this.scheduleOnce(function () {
                // 播放成功音乐
                this.playsuccess();
            }, 1);
            this.scheduleOnce(function () {

                this.finish();
            }, 2);
        }
    },
    onDisable: function onDisable() {
        cc.inputManager.setAccelerometerEnabled(false);
        maincfg.accStatus = false;
    },
    onYes: function onYes() {
        console.log("onYes");
        game.postGameScore('accelerometer', this._time.toFixed(2), false);
        ScoreView.show('accelerometer', this._time.toFixed(2), false);
    },
    onNo: function onNo() {
        //game.postGameScore('accelerometer',this._time.toFixed(3),false);
        //game.showNextGame('accelerometer');
        //给多10s
        console.log("onNo");
        this.ask.active = false;
        this.outline += 10;
        this.pauseStatus = false;
    },

    //addinner:function (){
    //    this.doAcc();
    //},
    finish: function finish() {
        this.onDisable();
        game.postGameScore('accelerometer', this._time.toFixed(2), true);
        ScoreView.show('accelerometer', this._time.toFixed(2), true);
    },

    testAdd: function testAdd() {
        this.num++;

        if (this.num == 3) {
            this.b1.node.active = false;
            this.b2.node.active = true;

            this.b2Anim.play();
        } else if (this.num == 2) {

            var anim = this.b1Anim;

            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("no2");
        } else if (this.num == 1) {

            var anim = this.b1Anim;

            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("no1");
        }

        if (this.num > 3) {
            this.num = 0;
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"../common/ScoreView":"scoreView","../common/analytics":"analytics","../common/device":"device","../common/game":"Game","../common/maincfg":"maincfg"}],"s11_ins_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '101a62j8+VDtobmQsNQazi4', 's11_ins_layer');
// scripts\11\s11_ins_layer.js

var game = require('s11_game_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        game: game
    },

    // use this for initialization
    onLoad: function onLoad() {},
    gonext: function gonext() {
        console.log("111111 ins");
        if (this.node.active == true) {

            console.log("gonext ins");
            this.node.active = false;
            this.game.setactive();
            console.log("222222 ins");
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s11_game_layer":"s11_game_layer"}],"s12_game_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cb985apEbxCg73S0xtxhDFP', 's12_game_layer');
// scripts\12\s12_game_layer.js

var game = require('../common/Game');
var device = require('../common/Device');
var ScoreView = require('../common/ScoreView');

cc.Class({
    'extends': cc.Component,

    properties: {
        hand: {
            'default': null,
            type: cc.Sprite
        },
        label: {
            'default': null,
            type: cc.Label
        },

        status: false,

        outAnim: {
            'default': null,
            type: cc.Animation
        },
        outAnim02: {
            'default': null,
            type: cc.Animation
        },
        outAnim03: {
            'default': null,
            type: cc.Animation
        },

        playtime: 0,
        outline: 15,

        nAsk: {
            'default': null,
            type: cc.Node
        },

        outAudio: {
            'default': null,
            url: cc.AudioClip
        },
        outAudio02: {
            'default': null,
            url: cc.AudioClip
        },
        outAudio03: {
            'default': null,
            url: cc.AudioClip
        },

        finishAudio: {
            'default': null,
            url: cc.AudioClip
        },

        isFinish: false,
        guide_node: cc.Node,
        bstartgame: false,

        movehand: {
            'default': null,
            type: cc.Sprite
        },
        last_num: -1
    },

    // use this for initialization

    onLoad: function onLoad() {
        //this.node.active = false;
        this.last_num = -1;
        //动作
        var pos = cc.v2(-60, 150);
        this.movehand.node.setPosition(pos);
        var moveTo = cc.moveTo(0.8, cc.v2(-150, 150));
        var moveBack = cc.moveTo(0.8, cc.v2(-60, 150));

        this.action = cc.repeatForever(cc.sequence(moveTo, cc.delayTime(1), moveBack, cc.delayTime(1)));
        this.movehand.node.runAction(this.action);
    },
    onClickGuide: function onClickGuide() {
        this.guide_node.active = false;
        this.bstartgame = true;
        this.setactive();
    },
    setactive: function setactive() {
        this.node.active = true;
        this.status = false;
        this.outAnim.node.active = false;
        this.outAnim02.node.active = false;
        this.outAnim03.node.active = false;

        this._time = 0;
        this.startGame();
    },

    startGame: function startGame() {
        var _this = this;

        device.proximityStart(function (isSwitch) {
            if (_this.status != isSwitch) {
                _this.status = isSwitch;

                if (_this.isFinish) return;
                if (_this.status) {

                    _this.doMoveOut();
                } else {

                    _this.hand.node.active = true;
                    _this.outAnim.node.active = false;
                    _this.outAnim02.node.active = false;
                    _this.outAnim03.node.active = false;
                    cc.audioEngine.end();
                }
            }
        });
    },
    end: function end() {
        device.proximityStop();
    },

    doMoveOut: function doMoveOut() {
        var _this2 = this;

        if (this.playtime == 0) {
            this.playtime++;
            this.hand.node.active = true;
            return;
        }
        this.decStatus = true;
        this.hand.node.active = false;

        var ran = this.getRandomNum(1, 3);
        if (this.last_num == -1) {
            this.last_num = ran;

            console.log("first", this.last_num);
        } else {
            while (ran == this.last_num) {
                ran = this.getRandomNum(1, 3);
                console.log("while", ran);
            }

            this.last_num = ran;
            console.log("second", this.last_num);
        }

        if (ran == 1) {
            this.outAnim.node.active = true;

            var anim = this.outAnim;
            //anim.play();
            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("gezi");
            setTimeout(function () {
                animCtrl.play("gezi_dj");
            }, 1000);
            cc.audioEngine.end();
            cc.audioEngine.playEffect(this.outAudio, true);
        } else if (ran == 2) {
            this.outAnim02.node.active = true;

            var anim = this.outAnim02;
            //anim.play();
            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("gou");
            setTimeout(function () {
                animCtrl.play("gou_dj");
            }, 1000);
            cc.audioEngine.end();
            cc.audioEngine.playEffect(this.outAudio02, true);
        } else if (ran == 3) {
            this.outAnim03.node.active = true;

            var anim = this.outAnim03;
            //anim.play();
            var animCtrl = anim.node.getComponent(cc.Animation);
            animCtrl.play("wa");
            setTimeout(function () {
                animCtrl.play("wa_dj");
            }, 1000);
            cc.audioEngine.end();
            cc.audioEngine.playEffect(this.outAudio03, true);
        }

        this.playtime++;
        console.log(this.playtime);

        if (this.playtime >= 3) {
            this.isFinish = true;
            game.showTips("finish!");
            cc.audioEngine.playEffect(this.finishAudio, false);
            setTimeout(function () {
                cc.audioEngine.end();
                _this2.result(true);
            }, 4000);
        }
    },

    doMoveAway: function doMoveAway() {
        var _this3 = this;

        if (this.isFinish) return;

        if (!this.status) {
            this.hand.node.active = false;

            var ran = this.getRandomNum(1, 3);
            if (this.last_num == -1) {
                this.last_num = ran;

                console.log("first", this.last_num);
            } else {
                while (ran == this.last_num) {
                    ran = this.getRandomNum(1, 3);
                    console.log("while", ran);
                }

                this.last_num = ran;
                console.log("second", this.last_num);
            }

            if (ran == 1) {
                this.outAnim.node.active = true;

                var anim = this.outAnim;
                //anim.play();
                var animCtrl = anim.node.getComponent(cc.Animation);
                animCtrl.play("gezi");
                setTimeout(function () {
                    animCtrl.play("gezi_dj");
                }, 1000);
                cc.audioEngine.end();
                cc.audioEngine.playEffect(this.outAudio, true);
            } else if (ran == 2) {
                this.outAnim02.node.active = true;

                var anim = this.outAnim02;
                //anim.play();
                var animCtrl = anim.node.getComponent(cc.Animation);
                animCtrl.play("gou");
                setTimeout(function () {
                    animCtrl.play("gou_dj");
                }, 1000);
                cc.audioEngine.end();
                cc.audioEngine.playEffect(this.outAudio02, true);
            } else if (ran == 3) {
                this.outAnim03.node.active = true;

                var anim = this.outAnim03;
                //anim.play();
                var animCtrl = anim.node.getComponent(cc.Animation);
                animCtrl.play("wa");
                setTimeout(function () {
                    animCtrl.play("wa_dj");
                }, 1000);
                cc.audioEngine.end();
                cc.audioEngine.playEffect(this.outAudio03, true);
            }

            this.playtime++;
            console.log(this.playtime);

            if (this.playtime >= 2) {
                this.isFinish = true;
                game.showTips("finish!");

                cc.audioEngine.playEffect(this.finishAudio, false);

                setTimeout(function () {
                    _this3.result(true);
                }, 5000);
            }

            this.status = true;
        } else {
            this.hand.node.active = true;
            this.outAnim.node.active = false;
            this.outAnim02.node.active = false;
            this.outAnim03.node.active = false;
            this.status = false;
        }
    },

    result: function result(ret) {

        if (ret) {
            game.postGameScore('proximity_sensor', this._time.toFixed(2), ret);
            ScoreView.show('proximity_sensor', this._time.toFixed(2), ret);
        } else {
            game.postGameScore('proximity_sensor', this._time.toFixed(2), ret);
            ScoreView.show('proximity_sensor', this._time.toFixed(2), ret);
        }
        this.end();
    },

    onYes: function onYes() {
        var _this4 = this;

        this.nAsk.active = false;

        setTimeout(function () {
            _this4.result(false);
        }, 2000);

        device.proximityStop();
    },

    onNo: function onNo() {
        this.nAsk.active = false;
        this.outline += 10;

        device.proximityStop();
    },
    getRandomNum: function getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.round(Rand * Range);
    },

    update: function update(dt) {

        if (!this.bstartgame) {
            return;
        }
        this._time += dt;
        // [正则表达式]获取小数点后三位
        var regex = /([0-9]+\.[0-9]{2})[0-9]*/;
        var timeStr = String(this._time);
        var finalStr = timeStr.replace(regex, "$1");
        finalStr = finalStr + "s";
        this.label.string = finalStr;

        if (this._time > this.outline && !this.decStatus) {
            //过了10s还未检测到任何
            this.nAsk.active = true;
            this.pauseStatus = true;
        }
    }
});

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/ScoreView":"scoreView"}],"s12_ins_layer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3e7995wkDZPjK0RgM8Zj52u', 's12_ins_layer');
// scripts\12\s12_ins_layer.js

var game = require('s12_game_layer');

cc.Class({
    "extends": cc.Component,

    properties: {
        game: game
    },

    // use this for initialization
    onLoad: function onLoad() {},
    gonext: function gonext() {
        console.log("111111 ins");
        if (this.node.active == true) {

            console.log("gonext ins");
            this.node.active = false;
            this.game.setactive();
            console.log("222222 ins");
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"s12_game_layer":"s12_game_layer"}],"scoreView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '28244PUMKdC4qs0yXbNs4kb', 'scoreView');
// scripts\common\scoreView.js

var game = require('../common/Game');
var device = require('../common/Device');
var maincfg = require('../common/maincfg');

var ScoreView = cc.Class({
  'extends': cc.Component,

  properties: {
    titleLabel: cc.Label,
    scoreLabel: cc.Label
  },

  // use this for initialization
  onLoad: function onLoad() {
    var listener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function onTouchBegan(touche) {
        return true;
      },
      onTouchMoved: function onTouchMoved() {},
      onTouchEnded: function onTouchEnded() {},
      onTouchCancelled: function onTouchCancelled() {}
    };
    cc.eventManager.addListener(listener, this.node);
  },
  setGameKey: function setGameKey(game_key, ret) {
    this.game_key = game_key;
    var config = game.getGameConfig(game_key);
    if (ret) this.titleLabel.string = config.name + ' is functioning properly';else {

      this.titleLabel.string = config.name + ' test fails';
      console.log(this.titleLabel.string);
    }
  },
  setScore: function setScore(score) {
    var config = game.getGameConfig(this.game_key);
    this.scoreLabel.string = score.toString() + config.score_unit;
  },
  goShare: function goShare() {
    var winSize = cc.director.getWinSize();
    var renderTexture = jsb.RenderTextureMyCreate(winSize.width, winSize.height);

    renderTexture.begin();
    cc.director.getRunningScene().visit();
    renderTexture.end();
    var filename = 'share-' + Date.now() + '.png';
    var filepath = jsb.fileUtils.getWritablePath() + filename;

    renderTexture.saveToFile(filename, cc.ImageFormat.PNG, true, function () {
      device.shareToOtherApp(filepath);
    });
  },
  goHome: function goHome() {
    var intentGameId = device.intentGameId();
    if (intentGameId != '') {
      // return device.exitMe();
      return cc.director.end();
    }

    maincfg.page = 2;
    cc.director.loadScene('MainScene');
  },
  goNext: function goNext() {
    // let intentGameId = device.intentGameId();
    // if(intentGameId != ''){
    //   // return device.exitMe();
    //   return cc.director.end();
    // }

    // var reb = game.showNextGame(this.game_key);
    // if (!reb) {
    //   game.showTips('In development ...');
    // }

    var game_config = game.getGameConfig(this.game_key);
    cc.director.loadScene(game_config.sceneName);
  },
  userclick: function userclick() {}
});

ScoreView.show = function (game_key, score, ret) {
  var winSize = cc.director.getWinSize();

  var prefab = cc.loader.getRes('prefabs/scoreView');
  var newNode = cc.instantiate(prefab);
  newNode.setPosition(cc.v2(winSize.width / 2, winSize.height / 2));
  newNode.getComponent('scoreView').setGameKey(game_key, ret);
  newNode.getComponent('scoreView').setScore(score);

  cc.director.getScene().addChild(newNode);
};

cc._RFpop();
},{"../common/Device":"device","../common/Game":"Game","../common/maincfg":"maincfg"}],"test.js":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fb703fe02xNuJdZG28A71DH', 'test.js');
// scripts\test\test.js.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"test01":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1dfd8yzX1JNj4OKmFerBCxz', 'test01');
// scripts\test\test01.js

cc.Class({
    "extends": cc.Component,

    properties: {
        great: {
            "default": null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.great.node.active = false;
    },

    btn: function btn() {
        var _this = this;

        this.great.node.active = true;

        this.action = cc.sequence(cc.scaleTo(0.2, 3), cc.scaleTo(0.2, 1));
        this.great.node.runAction(this.action);

        setTimeout(function () {
            _this.great.node.active = false;
        }, 400);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["s02_black_trans_layer","closeADbg","s11_ins_layer","MainScene","Fish","test01","s11_game_layer","analytics","resultItem","scoreView","s07_bar","s02_game_layer","s04_result_layer","s01","s04_ins_layer","ButtonScaler","moment","Button","s12_ins_layer","device","guide","s02_white_trans_layer","pauseView","s04_record_layer","Game","BackView","s10_ins_layer","PauseBtn","loadingScene","resultList","fakeData","s06","s03_last_layer","s03_ButtonScaler","Scroller","s10_game_layer","s04_game","s04_ins2_layer","SliderBar","config","EatManager","maincfg","GameTimer","s02_ins_layer","s03_game_layer","s08","s12_game_layer","s07","Confirm","s05","EatGroup","s03_ins_alyer","s02_ask_layer","test.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvY29zY3JlYXRvcjEuMzMvQ29jb3NDcmVhdG9yL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2NyaXB0cy9jb21tb24vQmFja1ZpZXcuanMiLCJzY3JpcHRzL2NvbW1vbi9CdXR0b25TY2FsZXIuanMiLCJzY3JpcHRzL21haW4vQnV0dG9uLmpzIiwic2NyaXB0cy9jb21tb24vQ29uZmlybS5qcyIsInNjcmlwdHMvMDQvRWF0R3JvdXAuanMiLCJzY3JpcHRzLzA0L0VhdE1hbmFnZXIuanMiLCJzY3JpcHRzLzA0L0Zpc2guanMiLCJzY3JpcHRzL2NvbW1vbi9HYW1lVGltZXIuanMiLCJzY3JpcHRzL2NvbW1vbi9HYW1lLmpzIiwic2NyaXB0cy9tYWluL01haW5TY2VuZS5qcyIsInNjcmlwdHMvY29tbW9uL1BhdXNlQnRuLmpzIiwic2NyaXB0cy8wNC9TY3JvbGxlci5qcyIsInNjcmlwdHMvMDEvU2xpZGVyQmFyLmpzIiwic2NyaXB0cy9jb21tb24vYW5hbHl0aWNzLmpzIiwic2NyaXB0cy9jb21tb24vY2xvc2VBRGJnLmpzIiwic2NyaXB0cy9jb21tb24vY29uZmlnLmpzIiwic2NyaXB0cy9jb21tb24vZGV2aWNlLmpzIiwic2NyaXB0cy9jb21tb24vZmFrZURhdGEuanMiLCJzY3JpcHRzL2NvbW1vbi9ndWlkZS5qcyIsInNjcmlwdHMvbWFpbi9sb2FkaW5nU2NlbmUuanMiLCJzY3JpcHRzL2NvbW1vbi9tYWluY2ZnLmpzIiwic2NyaXB0cy9jb21tb24vbW9tZW50LmpzIiwic2NyaXB0cy9jb21tb24vcGF1c2VWaWV3LmpzIiwic2NyaXB0cy9jb21tb24vcmVzdWx0SXRlbS5qcyIsInNjcmlwdHMvY29tbW9uL3Jlc3VsdExpc3QuanMiLCJzY3JpcHRzLzAxL3MwMS5qcyIsInNjcmlwdHMvMDIvczAyX2Fza19sYXllci5qcyIsInNjcmlwdHMvMDIvczAyX2JsYWNrX3RyYW5zX2xheWVyLmpzIiwic2NyaXB0cy8wMi9zMDJfZ2FtZV9sYXllci5qcyIsInNjcmlwdHMvMDIvczAyX2luc19sYXllci5qcyIsInNjcmlwdHMvMDIvczAyX3doaXRlX3RyYW5zX2xheWVyLmpzIiwic2NyaXB0cy8wMy9zMDNfQnV0dG9uU2NhbGVyLmpzIiwic2NyaXB0cy8wMy9zMDNfZ2FtZV9sYXllci5qcyIsInNjcmlwdHMvMDMvczAzX2luc19hbHllci5qcyIsInNjcmlwdHMvMDMvczAzX2xhc3RfbGF5ZXIuanMiLCJzY3JpcHRzLzA0L3MwNF9nYW1lLmpzIiwic2NyaXB0cy8wNC9zMDRfaW5zMl9sYXllci5qcyIsInNjcmlwdHMvMDQvczA0X2luc19sYXllci5qcyIsInNjcmlwdHMvMDQvczA0X3JlY29yZF9sYXllci5qcyIsInNjcmlwdHMvMDQvczA0X3Jlc3VsdF9sYXllci5qcyIsInNjcmlwdHMvMDUvczA1LmpzIiwic2NyaXB0cy8wNi9zMDYuanMiLCJzY3JpcHRzLzA3L3MwN19iYXIuanMiLCJzY3JpcHRzLzA3L3MwNy5qcyIsInNjcmlwdHMvMDgvczA4LmpzIiwic2NyaXB0cy8xMC9zMTBfZ2FtZV9sYXllci5qcyIsInNjcmlwdHMvMTAvczEwX2luc19sYXllci5qcyIsInNjcmlwdHMvMTEvczExX2dhbWVfbGF5ZXIuanMiLCJzY3JpcHRzLzExL3MxMV9pbnNfbGF5ZXIuanMiLCJzY3JpcHRzLzEyL3MxMl9nYW1lX2xheWVyLmpzIiwic2NyaXB0cy8xMi9zMTJfaW5zX2xheWVyLmpzIiwic2NyaXB0cy9jb21tb24vc2NvcmVWaWV3LmpzIiwic2NyaXB0cy90ZXN0L3Rlc3QuanMuanMiLCJzY3JpcHRzL3Rlc3QvdGVzdDAxLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9pR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2NmU0MmNXYlY5SUtLY3RibE9vVGNmKycsICdCYWNrVmlldycpO1xuLy8gc2NyaXB0c1xcY29tbW9uXFxCYWNrVmlldy5qc1xuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL0RldmljZScpO1xudmFyIG1haW5jZmcgPSByZXF1aXJlKCcuLi9jb21tb24vbWFpbmNmZycpO1xudmFyIGFuYWx5dGljcyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9hbmFseXRpY3MnKTtcblxudmFyIEJhY2tWaWV3ID0gY2MuQ2xhc3Moe1xuICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge30sXG4gIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbiBvblRvdWNoQmVnYW4odG91Y2hlLCBldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb25JbW1lZGlhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25Ub3VjaE1vdmVkOiBmdW5jdGlvbiBvblRvdWNoTW92ZWQoKSB7fSxcbiAgICAgIG9uVG91Y2hFbmRlZDogZnVuY3Rpb24gb25Ub3VjaEVuZGVkKCkge30sXG4gICAgICBvblRvdWNoQ2FuY2VsbGVkOiBmdW5jdGlvbiBvblRvdWNoQ2FuY2VsbGVkKCkge31cbiAgICB9O1xuICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpcy5ub2RlKTtcbiAgfSxcbiAgc2V0R2FtZUtleTogZnVuY3Rpb24gc2V0R2FtZUtleShnYW1lX2tleSkge1xuICAgIHRoaXMuZ2FtZV9rZXkgPSBnYW1lX2tleTtcbiAgfSxcbiAgb25ObzogZnVuY3Rpb24gb25ObygpIHtcbiAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKTtcbiAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuXG4gICAgX29uZSA9IG51bGw7XG4gICAgYW5hbHl0aWNzLmJ1dHRvbkV2ZW50KCdiYWNrX25vX2J1dHRvbicpO1xuICB9LFxuICBvblllczogZnVuY3Rpb24gb25ZZXMoKSB7XG5cbiAgICBfb25lID0gbnVsbDtcbiAgICBhbmFseXRpY3MuYnV0dG9uRXZlbnQoJ2JhY2tfeWVzX2J1dHRvbicpO1xuXG4gICAgY2MuZGlyZWN0b3IucmVzdW1lKCk7XG4gICAgY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG4gICAgbWFpbmNmZy5wYWdlID0gMTtcbiAgICBtYWluY2ZnLnRlc3QgPSB0aGlzLmdhbWVfa2V5O1xuXG4gICAgaWYgKG1haW5jZmcuYWNjU3RhdHVzID09IHRydWUpIHtcbiAgICAgIGNjLmlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVyRW5hYmxlZChmYWxzZSk7XG4gICAgICBtYWluY2ZnLmFjY1N0YXR1cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnTWFpblNjZW5lJyk7XG5cbiAgICBnYW1lLnBvc3RHYW1lU2NvcmUodGhpcy5nYW1lX2tleSwgJ04vQScsIGZhbHNlKTtcblxuICAgIGlmIChkZXZpY2UuaW50ZW50R2FtZUlkKCkgIT0gJycpIHtcbiAgICAgIC8vIHJldHVybiBkZXZpY2UuZXhpdE1lKCk7XG4gICAgICByZXR1cm4gY2MuZGlyZWN0b3IuZW5kKCk7XG4gICAgfVxuICB9XG59KTtcblxudmFyIF9vbmUgPSBudWxsO1xuQmFja1ZpZXcuc2hvdyA9IGZ1bmN0aW9uIChnYW1lX2tleSkge1xuICBpZiAoX29uZSkgcmV0dXJuO1xuICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgdmFyIHByZWZhYiA9IGNjLmxvYWRlci5nZXRSZXMoJ3ByZWZhYnMvYmFja1ZpZXcnKTtcbiAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICBfb25lID0gbmV3Tm9kZTtcbiAgbmV3Tm9kZS5zZXRQb3NpdGlvbihjYy52Mih3aW5TaXplLndpZHRoIC8gMiwgd2luU2l6ZS5oZWlnaHQgLyAyKSk7XG4gIG5ld05vZGUuZ2V0Q29tcG9uZW50KEJhY2tWaWV3KS5zZXRHYW1lS2V5KGdhbWVfa2V5KTtcbiAgdmFyIHNjZW5lID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcbiAgc2NlbmUuYWRkQ2hpbGQobmV3Tm9kZSwgMjApO1xuICBpZiAoIWNjLmRpcmVjdG9yLmlzUGF1c2VkKCkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNjLmRpcmVjdG9yLnBhdXNlKCk7XG4gICAgfSwgMSAvIDIwKTtcbiAgfVxuICBhbmFseXRpY3MuYnV0dG9uRXZlbnQoJ2JhY2tfa2V5Jyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tWaWV3O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzZmY2NUTlY2ZEZZNllTdU96MlNmVXYnLCAnQnV0dG9uU2NhbGVyJyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXEJ1dHRvblNjYWxlci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHByZXNzZWRTY2FsZTogMC45LFxuICAgICAgICB0cmFuc0R1cmF0aW9uOiAwLjFcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmluaXRTY2FsZSA9IHRoaXMubm9kZS5zY2FsZTtcbiAgICAgICAgc2VsZi5idXR0b24gPSBzZWxmLmdldENvbXBvbmVudChjYy5CdXR0b24pO1xuICAgICAgICBzZWxmLnNjYWxlRG93bkFjdGlvbiA9IGNjLnNjYWxlVG8oc2VsZi50cmFuc0R1cmF0aW9uLCBzZWxmLnByZXNzZWRTY2FsZSk7XG4gICAgICAgIHNlbGYuc2NhbGVVcEFjdGlvbiA9IGNjLnNjYWxlVG8oc2VsZi50cmFuc0R1cmF0aW9uLCBzZWxmLmluaXRTY2FsZSk7XG4gICAgICAgIGZ1bmN0aW9uIG9uVG91Y2hEb3duKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnNjYWxlID0gMTtcbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKHNlbGYuc2NhbGVEb3duQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblRvdWNoVXAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKHNlbGYuc2NhbGVVcEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaERvd24sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hlbmQnLCBvblRvdWNoVXAsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hjYW5jZWwnLCBvblRvdWNoVXAsIHRoaXMubm9kZSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczYjU0NDB1T0Q5STlvb3NUVzh0aTVPWCcsICdCdXR0b24nKTtcbi8vIHNjcmlwdHNcXG1haW5cXEJ1dHRvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2FtZV9rZXk6IFN0cmluZ1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuICAgIHNldEdhbWVLZXk6IGZ1bmN0aW9uIHNldEdhbWVLZXkoc3RyKSB7XG4gICAgICAgIHRoaXMuZ2FtZV9rZXkgPSBzdHI7XG4gICAgfSxcbiAgICBnZXRHYW1lS2V5OiBmdW5jdGlvbiBnZXRHYW1lS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lX2tleTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkMzAzZEtFMUE5QlpyazFQcGppNWxNNScsICdDb25maXJtJyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXENvbmZpcm0uanNcblxudmFyIENvbmZpcm0gPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1zZzogY2MuTGFiZWwsXG4gICAgICAgIGJ0bjE6IGNjLkJ1dHRvbixcbiAgICAgICAgYnRuMjogY2MuQnV0dG9uLFxuICAgICAgICBtYXNrOiBjYy5Ob2RlXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgICAgICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbiBvblRvdWNoQmVnYW4odG91Y2hlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbkltbWVkaWF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVG91Y2hNb3ZlZDogZnVuY3Rpb24gb25Ub3VjaE1vdmVkKCkge30sXG4gICAgICAgICAgICBvblRvdWNoRW5kZWQ6IGZ1bmN0aW9uIG9uVG91Y2hFbmRlZCgpIHt9LFxuICAgICAgICAgICAgb25Ub3VjaENhbmNlbGxlZDogZnVuY3Rpb24gb25Ub3VjaENhbmNlbGxlZCgpIHt9XG4gICAgICAgIH07XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpcy5tYXNrKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQobXNnLCBjYikge1xuICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBtc2c7XG4gICAgICAgIHRoaXMuY2IgPSBjYjtcbiAgICB9LFxuICAgIG9uWWVzOiBmdW5jdGlvbiBvblllcygpIHtcbiAgICAgICAgdGhpcy5jYih0cnVlKTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICB9LFxuICAgIG9uTm86IGZ1bmN0aW9uIG9uTm8oKSB7XG4gICAgICAgIHRoaXMuY2IoZmFsc2UpO1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtc2csIGNiKSB7XG4gICAgdmFyIHByZWZhYiA9IGNjLmxvYWRlci5nZXRSZXMoJ3ByZWZhYnMvY29uZmlybScpO1xuICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICB2YXIgc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICBuZXdOb2RlLnNldFBvc2l0aW9uKGNjLnYyKHNpemUud2lkdGggLyAyLCBzaXplLmhlaWdodCAvIDIpKTtcbiAgICBuZXdOb2RlLmdldENvbXBvbmVudChDb25maXJtKS5pbml0KG1zZywgY2IpO1xuICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjE1YzRKcmhjOUpTSzlQZUYrMEk2M2InLCAnRWF0R3JvdXAnKTtcbi8vIHNjcmlwdHNcXDA0XFxFYXRHcm91cC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwYWNpbmdNaW5WYWx1ZTogMjUwLFxuICAgICAgICBzcGFjaW5nTWF4VmFsdWU6IDMwMCxcbiAgICAgICAgZWF0czogW2NjLk5vZGVdLFxuICAgICAgICBlYXRNb3ZlU3BlZWQ6IDIwMFxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGVhdE1hbmFnZXIsIHNwZWVkLCBtb3ZlLCBpbmRleCkge1xuICAgICAgICB0aGlzLmVhdE1hbmFnZXIgPSBlYXRNYW5hZ2VyO1xuICAgICAgICB0aGlzLmVhdE1vdmVTcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLl9pbml0UG9zaXRpb25YKCk7XG4gICAgICAgIHRoaXMuX2luaXRQb3NpdGlvblkobW92ZSwgaW5kZXgpO1xuICAgIH0sXG4gICAgX2luaXRQb3NpdGlvblg6IGZ1bmN0aW9uIF9pbml0UG9zaXRpb25YKCkge1xuICAgICAgICB2YXIgdmlzaWJsZVNpemUgPSBjYy5kaXJlY3Rvci5nZXRWaXNpYmxlU2l6ZSgpOyAvLyDlnLrmma/lj6/op4HljLrln5/lpKflsI9cbiAgICAgICAgdmFyIHNjZW5lTGVmdCA9IC12aXNpYmxlU2l6ZS53aWR0aCAvIDI7IC8vIENhbnZhc+mUmueCueWcqOS4reW/g++8jENhbnZhc+eahOW3puS+p+WwseaYr+WcqOmUmueCueW3pui+uei3neemu+S4gOWNiuWuveW6pueahOWcsOaWuVxuICAgICAgICB2YXIgc2NlbmVSaWdodCA9IHZpc2libGVTaXplLndpZHRoIC8gMjsgLy8gQ2FudmFz6ZSa54K55Zyo5Lit5b+D77yMQ2FudmFz55qE5Y+z5L6n5bCx5piv5Zyo6ZSa54K55Y+z6L656Led56a75LiA5Y2K5a695bqm55qE5Zyw5pa5XG4gICAgICAgIHRoaXMubm9kZS54ID0gc2NlbmVSaWdodCArIDMwMDtcbiAgICAgICAgdGhpcy5yZWN5bGNlWCA9IHNjZW5lTGVmdCAtIHRoaXMubm9kZS53aWR0aDtcbiAgICB9LFxuICAgIF9pbml0UG9zaXRpb25ZOiBmdW5jdGlvbiBfaW5pdFBvc2l0aW9uWShtb3ZlLCBpbmRleCkge1xuICAgICAgICB2YXIgdmlzaWJsZVNpemUgPSBjYy5kaXJlY3Rvci5nZXRWaXNpYmxlU2l6ZSgpO1xuICAgICAgICB2YXIgdG9wRWF0TWF4WSA9IHZpc2libGVTaXplLmhlaWdodCAtIDEwMDtcbiAgICAgICAgdmFyIGJvdHRvbUVhdE1pblkgPSAxMDA7XG4gICAgICAgIHZhciBzcGFjaW5nID0gdGhpcy5zcGFjaW5nTWluVmFsdWUgKyBNYXRoLnJhbmRvbSgpICogKHRoaXMuc3BhY2luZ01heFZhbHVlIC0gdGhpcy5zcGFjaW5nTWluVmFsdWUpO1xuXG4gICAgICAgIHZhciBnZW4gPSBbXTtcblxuICAgICAgICAvL+maj+acuueUn+aIkOS4ieS4quaVsOWtl1xuICAgICAgICBpZiAobW92ZSAhPSAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGdlbi5wdXNoKHRoaXMuZ2V0UmFuZG9tTnVtKDEsIDEwMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coZ2VuKTtcbiAgICAgICAgICAgIGdlbi5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChnZW5bMV0gLSBnZW5bMF0gPCAxMCkge1xuICAgICAgICAgICAgICAgIGdlblsxXSArPSAxMCAtIChnZW5bMV0gLSBnZW5bMF0pO1xuICAgICAgICAgICAgICAgIGdlblsyXSArPSAxMCAtIChnZW5bMV0gLSBnZW5bMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdlblsyXSAtIGdlblsxXSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgZ2VuWzJdICs9IDEwIC0gKGdlblsyXSAtIGdlblsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+S5seW6j1xuICAgICAgICAgICAgdGhpcy5zb3J0UmFuZG9tKGdlbik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnZW4pO1xuXG4gICAgICAgICAgICBnZW4ucHVzaCgxMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuZWF0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGVhdCA9IHRoaXMuZWF0c1tpXTtcblxuICAgICAgICAgICAgaWYgKG1vdmUgPT0gMSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICBlYXQueSA9IC05OTk5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBudW0gPSB0aGlzLmdldFJhbmRvbU51bSgxLCAxMDApO1xuICAgICAgICAgICAgICAgICAgICBlYXQueSA9IHRvcEVhdE1heFkgKiBudW0gLyAxMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC40KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVhdC55ID0gdG9wRWF0TWF4WSAtIE1hdGgucmFuZG9tKCkgKiAodG9wRWF0TWF4WSAtIGJvdHRvbUVhdE1pblkgLSBzcGFjaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgbnVtID0gdGhpcy5nZXRSYW5kb21OdW0oMSwxMDApO1xuICAgICAgICAgICAgICAgICAgICBlYXQueSA9IHRvcEVhdE1heFkgKiBnZW5baV0gLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVhdC55KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlYXQueSA9IC05OTk5O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpID09IDMpIGVhdC55ID0gLTk5OTk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgZWF0LnkgPSAtOTk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAoIXRoaXMuZWF0TWFuYWdlciB8fCAhdGhpcy5lYXRNYW5hZ2VyLmlzUnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMuZWF0TW92ZVNwZWVkICogZHQ7XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZS54IDwgMCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lYXRNYW5hZ2VyLnJlY3ljbGVFYXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0UmFuZG9tTnVtOiBmdW5jdGlvbiBnZXRSYW5kb21OdW0oTWluLCBNYXgpIHtcbiAgICAgICAgdmFyIFJhbmdlID0gTWF4IC0gTWluO1xuICAgICAgICB2YXIgUmFuZCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiBNaW4gKyBNYXRoLnJvdW5kKFJhbmQgKiBSYW5nZSk7XG4gICAgfSxcblxuICAgIHNvcnRSYW5kb206IGZ1bmN0aW9uIHNvcnRSYW5kb20obykge1xuICAgICAgICAvL3YxLjBcbiAgICAgICAgZm9yICh2YXIgaiwgeCwgaSA9IG8ubGVuZ3RoOyBpOyBqID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIGkpLCB4ID0gb1stLWldLCBvW2ldID0gb1tqXSwgb1tqXSA9IHgpO1xuICAgICAgICByZXR1cm4gbztcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E1ZGE0aEgrUkpMNlowejZtLzVWV1RrJywgJ0VhdE1hbmFnZXInKTtcbi8vIHNjcmlwdHNcXDA0XFxFYXRNYW5hZ2VyLmpzXG5cbnZhciBFYXRHcm91cCA9IHJlcXVpcmUoJ0VhdEdyb3VwJyk7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBlYXRQcmVmYWI6IGNjLk5vZGUsXG4gICAgICAgIGVhdE1vdmVTcGVlZDogLTEyMCxcbiAgICAgICAgZWF0U3BhY2luZzogMzAwLFxuICAgICAgICBpbmRleDogMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lYXRMaXN0ID0gW107XG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0U3Bhd246IGZ1bmN0aW9uIHN0YXJ0U3Bhd24oKSB7XG4gICAgICAgIHRoaXMuX3NwYXduRWF0KCk7XG4gICAgICAgIHZhciBzcGF3bkludGVydmFsID0gTWF0aC5hYnModGhpcy5lYXRTcGFjaW5nIC8gdGhpcy5lYXRNb3ZlU3BlZWQpO1xuICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuX3NwYXduRWF0LCAxLjUpO1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgfSxcblxuICAgIF9zcGF3bkVhdDogZnVuY3Rpb24gX3NwYXduRWF0KCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX3NwYXduRWF0XCIpO1xuXG4gICAgICAgIHZhciBlYXRHcm91cCA9IG51bGw7XG4gICAgICAgIGlmIChjYy5wb29sLmhhc09iamVjdChFYXRHcm91cCkpIHtcbiAgICAgICAgICAgIGVhdEdyb3VwID0gY2MucG9vbC5nZXRGcm9tUG9vbChFYXRHcm91cCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlYXRHcm91cCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZWF0UHJlZmFiKS5nZXRDb21wb25lbnQoRWF0R3JvdXApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChlYXRHcm91cC5ub2RlKTtcbiAgICAgICAgZWF0R3JvdXAubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciBudW0gPSB0aGlzLmdldFJhbmRvbU51bSgxLCAzKTtcbiAgICAgICAgaWYgKG51bSA9PSAzKSBlYXRHcm91cC5pbml0KHRoaXMsIHRoaXMuZWF0TW92ZVNwZWVkIC0gNDAwLCAxLCB0aGlzLmluZGV4KTtlbHNlIGVhdEdyb3VwLmluaXQodGhpcywgdGhpcy5lYXRNb3ZlU3BlZWQsIDAsIHRoaXMuaW5kZXgpO1xuXG4gICAgICAgIHRoaXMuZWF0TGlzdC5wdXNoKGVhdEdyb3VwKTtcblxuICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgfSxcblxuICAgIHJlY3ljbGVFYXQ6IGZ1bmN0aW9uIHJlY3ljbGVFYXQoZWF0KSB7XG4gICAgICAgIGVhdC5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgZWF0Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJyZWN5Y2xlRWF0XCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lYXRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lYXRMaXN0W2ldLm5vZGUuYWN0aXZlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzcGxpY2VcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5lYXRMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYy5wb29sLnB1dEluUG9vbChlYXQpO1xuICAgIH0sXG5cbiAgICAvKiog6I635Y+W5LiL5Liq5pyq6YCa6L+H55qE5rC0566hICovXG4gICAgZ2V0TmV4dDogZnVuY3Rpb24gZ2V0TmV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWF0TGlzdC5zaGlmdCgpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLl9zcGF3bkVhdCk7XG4gICAgICAgIHRoaXMuZWF0TGlzdCA9IFtdO1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLl90aW1lICs9IGR0O1xuXG4gICAgICAgIHRoaXMuZWF0TW92ZVNwZWVkID0gdGhpcy5lYXRNb3ZlU3BlZWQgLSBwYXJzZUludCh0aGlzLl90aW1lIC8gMTApICogNTA7XG4gICAgICAgIGlmICh0aGlzLmVhdE1vdmVTcGVlZCA8IC00MDAgJiYgIXRoaXMuY2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fc3Bhd25FYXQpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLl9zcGF3bkVhdCwgMSk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWF0TW92ZVNwZWVkIDwgLTYwMCkge1xuICAgICAgICAgICAgdGhpcy5lYXRNb3ZlU3BlZWQgPSAtNjAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFJhbmRvbU51bTogZnVuY3Rpb24gZ2V0UmFuZG9tTnVtKE1pbiwgTWF4KSB7XG4gICAgICAgIHZhciBSYW5nZSA9IE1heCAtIE1pbjtcbiAgICAgICAgdmFyIFJhbmQgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICByZXR1cm4gTWluICsgTWF0aC5yb3VuZChSYW5kICogUmFuZ2UpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWMzMjA0QjZNeE04S2FqL3RJWU42b1QnLCAnRmlzaCcpO1xuLy8gc2NyaXB0c1xcMDRcXEZpc2guanNcblxuXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKiog5LiK5oqb5Yid6YCf5bqm77yM5Y2V5L2N77ya5YOP57SgL+enkiAqL1xuICAgICAgICBpbml0UmlzZVNwZWVkOiA1MDAsXG4gICAgICAgIC8qKiDph43lipvliqDpgJ/luqbvvIzljZXkvY3vvJrlg4/ntKAv56eS55qE5bmz5pa5ICovXG4gICAgICAgIGdyYXZpdHk6IDEwMDAsXG4gICAgICAgIHd1ZGk6IDBcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gMDtcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbmltID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICB9LFxuXG4gICAgc3RhcnRGbHk6IGZ1bmN0aW9uIHN0YXJ0Rmx5KCkge1xuICAgICAgICB0aGlzLl9nZXRuZXh0RWF0KCk7XG4gICAgICAgIHRoaXMucmlzZSgpO1xuICAgIH0sXG5cbiAgICBfZ2V0bmV4dEVhdDogZnVuY3Rpb24gX2dldG5leHRFYXQoKSB7XG4gICAgICAgIHRoaXMubmV4dEVhdCA9IHRoaXMuZ2FtZS5lYXRNYW5hZ2VyLmdldE5leHQoKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWFkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oZHQpO1xuICAgICAgICB0aGlzLl9kZXRlY3RDb2xsaXNpb24oKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiBfdXBkYXRlUG9zaXRpb24oZHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVhZCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgLT0gZHQgKiB0aGlzLmdyYXZpdHk7XG4gICAgICAgICAgICB0aGlzLm5vZGUueSArPSBkdCAqIHRoaXMuY3VycmVudFNwZWVkO1xuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS55IDwgdGhpcy5ub2RlLmhlaWdodCAvIDIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMubm9kZS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZpc2libGVTaXplID0gY2MuZGlyZWN0b3IuZ2V0VmlzaWJsZVNpemUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA+PSB2aXNpYmxlU2l6ZS5oZWlnaHQgLSB0aGlzLm5vZGUuaGVpZ2h0IC8gMikge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdmlzaWJsZVNpemUuaGVpZ2h0IC0gdGhpcy5ub2RlLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RldGVjdENvbGxpc2lvbjogZnVuY3Rpb24gX2RldGVjdENvbGxpc2lvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2FtZS5lYXRNYW5hZ2VyLmVhdExpc3QubGVuZ3RoICBcIiwgdGhpcy5nYW1lLmVhdE1hbmFnZXIuZWF0TGlzdC5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZS5lYXRNYW5hZ2VyLmVhdExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJFYXQgPSB0aGlzLmdhbWUuZWF0TWFuYWdlci5lYXRMaXN0W2ldO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IGN1ckVhdC5lYXRzLmxlbmd0aCAtIDE7IF9pID49IDA7IF9pLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgZWF0ID0gY3VyRWF0LmVhdHNbX2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RldGVjdENvbGxpc2lvbldpdGhGaXNoKGVhdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9pIDwgMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nYW1lLmFkZEhwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2kgPT0gMCkgdGhpcy5nYW1lLmFkZFNjb3JlKDEwKTtlbHNlIHRoaXMuZ2FtZS5hZGRTY29yZSgzMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53dWRpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc3ViSHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnd1ZGkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBjYy5ibGluaygzLCAxNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy53dWRpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmdhbWUuc3ViU2NvcmUoNSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWF0LnkgPSAtOTk5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICAgIC8vaWYgKCF0aGlzLm5leHRFYXQpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuO1xuICAgICAgICAvL31cbiAgICAgICAgLy9pZiAodGhpcy5pc0RlYWQpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuO1xuICAgICAgICAvL31cbiAgICAgICAgLy9mb3IgKGxldCBpID0gdGhpcy5uZXh0RWF0LmVhdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgLy8gICAgbGV0IGVhdCA9IHRoaXMubmV4dEVhdC5lYXRzW2ldO1xuICAgICAgICAvLyAgICBjb25zb2xlLmxvZyhcImVhdFwiLGVhdCk7XG4gICAgICAgIC8vICAgIGlmICh0aGlzLl9kZXRlY3RDb2xsaXNpb25XaXRoRmlzaChlYXQpICkge1xuICAgICAgICAvLyAgICAgICAgaWYoIGkgPCAyKXtcbiAgICAgICAgLy8gICAgICAgICAgICAvLyB0aGlzLmdhbWUuYWRkSHAoKTtcbiAgICAgICAgLy8gICAgICAgICAgICBpZihpID09MCApXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGRTY29yZSgxMCk7XG4gICAgICAgIC8vICAgICAgICAgICAgZWxzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYWRkU2NvcmUoMzApO1xuICAgICAgICAvLyAgICAgICAgfWVsc2V7XG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5nYW1lLnN1YkhwKCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgLy90aGlzLmdhbWUuc3ViU2NvcmUoMjApO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgZWF0LnkgPSAtOTk5O1xuICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuICAgICAgICAvL2xldCBmaXNoTGVmdCA9IHRoaXMubm9kZS54O1xuICAgICAgICAvL2xldCBlYXRSaWdodCA9IHRoaXMubmV4dEVhdC5ub2RlLnggKyB0aGlzLm5leHRFYXQuZWF0c1swXS53aWR0aFxuICAgICAgICAvL2xldCBjcm9zc0VhdCA9IGZpc2hMZWZ0ID4gZWF0UmlnaHQ7XG4gICAgICAgIC8vaWYgKGNyb3NzRWF0KSB7XG4gICAgICAgIC8vICAgIHRoaXMuX2dldG5leHRFYXQoKTtcbiAgICAgICAgLy99XG4gICAgfSxcbiAgICBfZGV0ZWN0Q29sbGlzaW9uV2l0aEZpc2g6IGZ1bmN0aW9uIF9kZXRlY3RDb2xsaXNpb25XaXRoRmlzaChvdGhlck5vZGUpIHtcbiAgICAgICAgaWYgKCFvdGhlck5vZGUpIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gY2MucmVjdEludGVyc2VjdHNSZWN0KHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKSwgb3RoZXJOb2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpKTtcbiAgICB9LFxuXG4gICAgcmlzZTogZnVuY3Rpb24gcmlzZSgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSB0aGlzLmluaXRSaXNlU3BlZWQ7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiYmEwMmJ0VVQ1QWg2RlFCcjc2cmpvZicsICdHYW1lVGltZXInKTtcbi8vIHNjcmlwdHNcXGNvbW1vblxcR2FtZVRpbWVyLmpzXG5cblxudmFyIGRlZmF1bHRfY29uZmlnID0ge1xuICBzdGVwOiAwLjUsXG4gIHN0YXJ0VGltZTogMCxcbiAgbWF4OiBOdW1iZXIuTUFYX1ZBTFVFLFxuICBvdmVyOiBmdW5jdGlvbiBvdmVyKCkge31cbn07XG5cbnZhciBHYW1lVGltZXIgPSBjYy5DbGFzcyh7XG4gIFwiZXh0ZW5kc1wiOiBjYy5PYmplY3QsXG4gIGN0b3I6IGZ1bmN0aW9uIGN0b3IoY29uZmlnKSB7XG4gICAgY29uZmlnID0gXy5hc3NpZ24oZGVmYXVsdF9jb25maWcsIGNvbmZpZyk7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBjb25maWcuc3RhcnRUaW1lO1xuICAgIHRoaXMuc3RlcCA9IGNvbmZpZy5zdGVwO1xuICAgIHRoaXMuX3RpbWUgPSAwO1xuICB9LFxuICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgdGhpcy5fdGltZSA9IHRoaXMuc3RhcnRUaW1lO1xuICAgIHRoaXMuX3RpbWVyID0gc2V0SW50ZXJ2YWwodGhpcy5fb25VcGRhdGUuYmluZCh0aGlzKSwgTWF0aC5hYnModGhpcy5zdGVwICogMTAwMCkpO1xuICB9LFxuICBfb25VcGRhdGU6IGZ1bmN0aW9uIF9vblVwZGF0ZSgpIHtcbiAgICB0aGlzLl90aW1lICs9IHRoaXMuc3RlcDtcbiAgICBpZiAodGhpcy5fdGltZSA8PSAwKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIHRoaXMub3ZlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fdGltZSA+PSB0aGlzLm1heCkge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB0aGlzLm92ZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0sXG4gIGdldFRpbWU6IGZ1bmN0aW9uIGdldFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWUudG9GaXhlZCgyKSAqIDE7XG4gIH0sXG4gIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lcik7XG4gICAgdGhpcy5fdGltZXIgPSBudWxsO1xuICB9LFxuICByZWxlYXNlOiBmdW5jdGlvbiByZWxlYXNlKCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMub3ZlciA9IG51bGw7XG4gIH0sXG4gIGlzUnVuaW5nOiBmdW5jdGlvbiBpc1J1bmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5fdGltZXIgIT0gbnVsbDtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lVGltZXI7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2MjVkMmZGdVFkRi9aZkhmM0w3UERsLycsICdHYW1lJyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXEdhbWUuanNcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG52YXIgQ29uZmlybSA9IHJlcXVpcmUoJy4vQ29uZmlybScpO1xudmFyIG1haW5jZmcgPSByZXF1aXJlKCcuLi9jb21tb24vbWFpbmNmZycpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9kZXZpY2UnKTtcblxudmFyIEdhbWUgPSBjYy5DbGFzcyh7XG4gICdleHRlbmRzJzogY2MuT2JqZWN0LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBpbW9kZTogMFxuICB9LFxuICBnZXRNb2RlOiBmdW5jdGlvbiBnZXRNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmltb2RlO1xuICB9LFxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgIC8vY2MuZGlyZWN0b3Iub24oY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfU0NFTkVfTEFVTkNILCBfLm9uY2UodGhpcy5wcmVsb2FkLmJpbmQodGhpcykpKTtcbiAgfSxcbiAgcHJlbG9hZDogZnVuY3Rpb24gcHJlbG9hZCgpIHtcbiAgICBjYy5sb2FkZXIubG9hZFJlc0FsbChcInByZWZhYnNcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFicykge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2MubG9nKGVycik7XG4gICAgICB9XG4gICAgICBfLmVhY2gocHJlZmFicywgZnVuY3Rpb24gKHByZWZhYikge1xuICAgICAgICBjYy5hc3NlcnQocHJlZmFiIGluc3RhbmNlb2YgY2MuUHJlZmFiLCAn5Yqg6L296LWE5rqQ5oiQ5YqfLCDkvYbor6Xlr7nosaHkuI3mmK9QcmVmYWInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBzaG93VGlwczogZnVuY3Rpb24gc2hvd1RpcHMoc3RyKSB7XG4gICAgdmFyIHByZWZhYiA9IGNjLmxvYWRlci5nZXRSZXMoJ3ByZWZhYnMvdGlwJyk7XG4gICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgIHZhciBzaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgIG5ld05vZGUuc2V0UG9zaXRpb24oY2MudjIoc2l6ZS53aWR0aCAvIDIsIHNpemUuaGVpZ2h0IC8gMikpO1xuICAgIG5ld05vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2xhYmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBzdHI7XG4gICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghbmV3Tm9kZSkgcmV0dXJuO1xuICAgICAgbmV3Tm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgfSwgMzAwMCk7XG4gIH0sXG4gIGNvbmZpcm06IGZ1bmN0aW9uIGNvbmZpcm0obXNnLCBjYikge1xuICAgIHJldHVybiBDb25maXJtKG1zZywgY2IpO1xuICB9LFxuICBnYW1lUmVjb3JkczogZnVuY3Rpb24gZ2FtZVJlY29yZHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBfLm1hcChjb25maWcuZ2FtZXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gXy5hc3NpZ25Jbih7fSwgaXRlbSwgX3RoaXMuZ2V0R2FtZVN0b3JlRGF0YShpdGVtLmtleSkpO1xuICAgIH0pO1xuICB9LFxuICBmaW5kR2FtZUNvbmZpZzogZnVuY3Rpb24gZmluZEdhbWVDb25maWcoZ2FtZV9rZXkpIHtcbiAgICB2YXIgZmluZF9nYW1lID0gXy5maW5kKGNvbmZpZy5nYW1lcywgZnVuY3Rpb24gKGdhbWUpIHtcbiAgICAgIHJldHVybiBnYW1lLmtleSA9PSBnYW1lX2tleTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmluZF9nYW1lO1xuICB9LFxuICBnZXRHYW1lQ29uZmlnOiBmdW5jdGlvbiBnZXRHYW1lQ29uZmlnKGdhbWVfa2V5KSB7XG4gICAgdmFyIGZpbmRfZ2FtZSA9IHRoaXMuZmluZEdhbWVDb25maWcoZ2FtZV9rZXkpO1xuICAgIGNjLmFzc2VydChmaW5kX2dhbWUsICdnYW1lX2tleTonICsgZ2FtZV9rZXkgKyAnIG5vdCBmb3VuZCEnKTtcbiAgICByZXR1cm4gXy5hc3NpZ25Jbih7fSwgZmluZF9nYW1lKTtcbiAgfSxcbiAgZ2V0R2FtZVN0b3JlRGF0YTogZnVuY3Rpb24gZ2V0R2FtZVN0b3JlRGF0YShnYW1lX2tleSkge1xuICAgIHZhciBzdHIgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2FtZV9rZXkpIHx8ICd7fSc7XG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHN0cik7XG4gICAgdmFyIHJldiA9IHt9O1xuICAgIHJldi5zY29yZSA9IGRhdGEuc2NvcmU7XG4gICAgcmV2LmRhdGUgPSBkYXRhLmRhdGU7XG4gICAgcmV2Lmd1aWRlID0gZGF0YS5ndWlkZTtcbiAgICByZXYuaXNfc3VjY2VzcyA9IGRhdGEuaXNfc3VjY2VzcztcbiAgICByZXR1cm4gcmV2O1xuICB9LFxuICBwb3N0R2FtZVNjb3JlOiBmdW5jdGlvbiBwb3N0R2FtZVNjb3JlKGdhbWVfa2V5LCBzY29yZSwgaXNfc3VjY2Vzcykge1xuXG4gICAgdGhpcy5nZXRHYW1lQ29uZmlnKGdhbWVfa2V5KTtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgZ2FtZURhdGEgPSB0aGlzLmdldEdhbWVTdG9yZURhdGEoZ2FtZV9rZXkpO1xuICAgIGdhbWVEYXRhLmRhdGUgPSBub3cuZ2V0VGltZSgpO1xuICAgIGdhbWVEYXRhLnNjb3JlID0gc2NvcmU7XG4gICAgLy8gaWYgKF8uaXNOdW1iZXIoc2NvcmUqMSkgJiYgIU51bWJlci5pc05hTihzY29yZSoxKSApIHsvLyAmJiBzY29yZSA+IGdhbWVEYXRhLnNjb3JlXG4gICAgLy8gICBnYW1lRGF0YS5zY29yZSA9IHNjb3JlO1xuICAgIC8vIH1cblxuICAgIC8v5Yik5a6a5pyA6auY5YC8XG4gICAgLy9pZiggcGFyc2VGbG9hdChnYW1lRGF0YS5zY29yZSApID4gcGFyc2VGbG9hdCggc2NvcmUgKSAgICl7XG4gICAgLy8gIGdhbWVEYXRhLnNjb3JlID0gc2NvcmU7XG4gICAgLy99XG4gICAgLy9cbiAgICAvL2lmKGdhbWVEYXRhLnNjb3JlID09IHVuZGVmaW5lZCl7XG4gICAgLy8gIGdhbWVEYXRhLnNjb3JlID0gc2NvcmU7XG4gICAgLy99XG5cbiAgICBnYW1lRGF0YS5pc19zdWNjZXNzID0gaXNfc3VjY2VzcztcbiAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oZ2FtZV9rZXksIEpTT04uc3RyaW5naWZ5KGdhbWVEYXRhKSk7XG4gIH0sXG4gIHNob3dOZXh0R2FtZTogZnVuY3Rpb24gc2hvd05leHRHYW1lKGdhbWVfa2V5KSB7XG4gICAgaWYgKHRoaXMuaW1vZGUgPT0gMSkge1xuICAgICAgbWFpbmNmZy5wYWdlID0gMTtcbiAgICAgIG1haW5jZmcudGVzdCA9IGdhbWVfa2V5O1xuICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdNYWluU2NlbmUnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChnYW1lX2tleSA9PSBcInByb3hpbWl0eV9zZW5zb3JcIikge1xuICAgICAgbWFpbmNmZy5wYWdlID0gMTtcbiAgICAgIG1haW5jZmcudGVzdCA9IGdhbWVfa2V5O1xuICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdNYWluU2NlbmUnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleChjb25maWcuZ2FtZXMsIGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICByZXR1cm4gZ2FtZS5rZXkgPT0gZ2FtZV9rZXk7XG4gICAgfSk7XG4gICAgY2MuYXNzZXJ0KGluZGV4ICE9IC0xLCAnZ2FtZV9rZXk6JyArIGdhbWVfa2V5ICsgJyBub3QgZm91bmQhJyk7XG4gICAgdmFyIGdhbWUgPSBjb25maWcuZ2FtZXNbaW5kZXggKyAxXTtcblxuICAgIHJldHVybiB0aGlzLnNob3dHYW1lKGdhbWUua2V5KTtcbiAgfSxcbiAgc2hvd0dhbWU6IGZ1bmN0aW9uIHNob3dHYW1lKGdhbWVfa2V5LCBpbW9kZSkge1xuICAgIHRoaXMuaW1vZGUgPSBpbW9kZTtcbiAgICB2YXIgZ2FtZV9jb25maWcgPSB0aGlzLmdldEdhbWVDb25maWcoZ2FtZV9rZXkpO1xuICAgIHRoaXMuY3VyX2dhbWUgPSBfLmNsb25lKGdhbWVfY29uZmlnKTtcblxuICAgIGNjLmRpcmVjdG9yLnByZWxvYWRTY2VuZShnYW1lX2NvbmZpZy5zY2VuZU5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZWIgPSBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoZ2FtZV9jb25maWcuc2NlbmVOYW1lKTtcbiAgICAgIC8v6ZqQ6JeP6IOM5pmv5Zu+XG4gICAgICAvLyBkZXZpY2UucmVtb3ZlTGF1bmNoSW1hZ2UoKTtcbiAgICAgIHJldHVybiByZWI7XG4gICAgfSk7XG5cbiAgICAvL2xldCByZWIgPSBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoZ2FtZV9jb25maWcuc2NlbmVOYW1lKTtcbiAgfVxufSk7XG5cbnZhciBnYW1lID0gbmV3IEdhbWUoKTtcbmdhbWUuaW5pdCgpO1xubW9kdWxlLmV4cG9ydHMgPSBnYW1lO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTZhYTlHTld3cFB4NmVQZnduZnVhVWYnLCAnTWFpblNjZW5lJyk7XG4vLyBzY3JpcHRzXFxtYWluXFxNYWluU2NlbmUuanNcblxudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vR2FtZScpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9kZXZpY2UnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb21tb24vY29uZmlnJyk7XG52YXIgbWFpbmNmZyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tYWluY2ZnJyk7XG52YXIgYW5hbHl0aWNzID0gcmVxdWlyZSgnLi4vY29tbW9uL2FuYWx5dGljcycpO1xuXG5jYy5DbGFzcyh7XG4gICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzdGFydF9ub2RlOiBjYy5Ob2RlLFxuICAgIHRlc3RfbW9kZV9ub2RlOiBjYy5Ob2RlLFxuICAgIHRjX25vZGU6IGNjLk5vZGUsXG4gICAgaXRlbVRlbXBsYXRlOiBjYy5Ob2RlLFxuICAgIGdhbWVMaXN0Q29udGVudDogY2MuTm9kZSxcbiAgICByZXN1bHRsaXN0OiBjYy5Ob2RlLFxuICAgIG1hc2s6IGNjLk5vZGVcbiAgfSxcblxuICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGNjLmRpcmVjdG9yLnNldERpc3BsYXlTdGF0cyhmYWxzZSk7XG5cbiAgICB0aGlzLm1hc2suYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmJhY2tUb1N0YXJ0KCk7XG4gICAgdGhpcy5maWxsR2FtZUxpc3QoKTtcbiAgICAvLy8vaW5pdCBkYlxuICAgIC8vY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYmluaXQnLCcxJyk7XG4gICAgLy9cbiAgICAvLy8vd2luZFRlc3RcbiAgICAvL2NjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1NDRU5FX0xBVU5DSCwgXy5vbmNlKHRoaXMucHJlbG9hZC5iaW5kKHRoaXMpKSk7XG5cbiAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PSA4ICYmIGNjLnN5cy5pc0Jyb3dzZXIpIHtcbiAgICAgICAgICBfdGhpcy5vblByZXNzZWRCYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzLm5vZGUpO1xuICAgIHRoaXMuX2JhY2sgPSAwO1xuXG4gICAgdmFyIGludGVudEdhbWVJZCA9IGRldmljZS5pbnRlbnRHYW1lSWQoKTtcbiAgICBpZiAoaW50ZW50R2FtZUlkICE9ICcnKSB7XG4gICAgICB2YXIgZ2FtZXMgPSBjb25maWcuZ2FtZXM7XG4gICAgICAvLyBsZXQgZ2FtZXMgPSBjb25maWcuZ2FtZXMuc2xpY2UoMCxNYXRoLmZsb29yKGNvbmZpZy5nYW1lcy5sZW5ndGgvMikpO1xuICAgICAgdmFyIG9uZSA9IF8uZmluZChnYW1lcywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0ua2V5ID09IGludGVudEdhbWVJZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKG9uZSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnYW1lLnNob3dHYW1lKGludGVudEdhbWVJZCwgMSk7XG4gICAgICAgIH0sIDEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbmFseXRpY3Muc2hvd1RvYXN0KCdnYW1lX2lkOicgKyBpbnRlbnRHYW1lSWQgKyAnICBub3QgZm91bmQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5tYXNrLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKG1haW5jZmcucGFnZSA9PSAxKSB7XG4gICAgICB0aGlzLnRjX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLnRlc3RfbW9kZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGFydF9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXN1bHRsaXN0LmFjdGl2ZSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1haW5jZmcucGFnZSA9PSAyKSB7XG4gICAgICB0aGlzLnRjX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLnRlc3RfbW9kZV9ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLnN0YXJ0X25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLnJlc3VsdGxpc3QuYWN0aXZlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9LFxuICBvblByZXNzZWRCYWNrOiBmdW5jdGlvbiBvblByZXNzZWRCYWNrKCkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX2JhY2sgPT0gMCkge1xuICAgICAgYW5hbHl0aWNzLnNob3dUb2FzdCgncHJlc3MgYmFjayBhZ2FpbiB0byBleGl0IGdhbWUnKTtcbiAgICB9XG4gICAgdGhpcy5fYmFjayArPSAxO1xuICAgIGlmICh0aGlzLl9iYWNrID4gMSkge1xuICAgICAgY2MuZGlyZWN0b3IuZW5kKCk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMyLl9iYWNrID0gMDtcbiAgICB9LCAzMDAwKTtcbiAgfSxcbiAgZmlsbEdhbWVMaXN0OiBmdW5jdGlvbiBmaWxsR2FtZUxpc3QoKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB2YXIgc3BhY2luZyA9IDE2O1xuICAgIHZhciBnYW1lcyA9IGdhbWUuZ2FtZVJlY29yZHMoKTtcbiAgICB2YXIgaGVpZ2h0ID0gZ2FtZXMubGVuZ3RoICogKHRoaXMuaXRlbVRlbXBsYXRlLmhlaWdodCArIHNwYWNpbmcpICsgc3BhY2luZyAqIDQ7XG4gICAgdGhpcy5nYW1lTGlzdENvbnRlbnQuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIF8uZWFjaChnYW1lcywgZnVuY3Rpb24gKGdhbWUsIGkpIHtcbiAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUoX3RoaXMzLml0ZW1UZW1wbGF0ZSk7XG4gICAgICBpdGVtLmFjdGl2ZSA9IHRydWU7XG4gICAgICBfdGhpczMuZ2FtZUxpc3RDb250ZW50LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgaXRlbS5zZXRQb3NpdGlvbigwLCAtaXRlbS5oZWlnaHQgKiAoMC41ICsgaSkgLSBzcGFjaW5nICogKGkgKyAyKSk7XG4gICAgICBpdGVtLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpLnN0cmluZyA9ICcgICcgKyBnYW1lLm5hbWU7XG4gICAgICBpdGVtLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpLm5vZGUueCA9IDA7XG4gICAgICB2YXIgYnRuID0gaXRlbS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLkJ1dHRvbik7XG4gICAgICBidG4uZ2V0Q29tcG9uZW50KCdCdXR0b24nKS5zZXRHYW1lS2V5KGdhbWUua2V5KTtcblxuICAgICAgdmFyIGV2ZW50SGFuZGxlciA9IG5ldyBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyKCk7XG4gICAgICBldmVudEhhbmRsZXIudGFyZ2V0ID0gX3RoaXMzO1xuICAgICAgZXZlbnRIYW5kbGVyLmNvbXBvbmVudCA9IFwiTWFpblNjZW5lXCI7XG4gICAgICBldmVudEhhbmRsZXIuaGFuZGxlciA9IFwib25HYW1lSXRlbUNsaWNrXCI7XG4gICAgICBidG4uY2xpY2tFdmVudHMgPSBbZXZlbnRIYW5kbGVyXTtcbiAgICB9KTtcbiAgfSxcbiAgb25HYW1lSXRlbUNsaWNrOiBmdW5jdGlvbiBvbkdhbWVJdGVtQ2xpY2soZSkge1xuICAgIHZhciBnYW1lX2tleSA9IGUuY3VycmVudFRhcmdldC5nZXRDb21wb25lbnQoJ0J1dHRvbicpLmdldEdhbWVLZXkoKTtcbiAgICBpZiAoZ2FtZV9rZXkgPT0gXCJhbGxcIikge1xuICAgICAgZ2FtZS5zaG93R2FtZShcInNjcmVlblwiLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldCA9IGdhbWUuc2hvd0dhbWUoZ2FtZV9rZXksIDEpO1xuICAgIGlmICghcmV0KSB7XG4gICAgICByZXR1cm4gZ2FtZS5zaG93VGlwcygnSW4gZGV2ZWxvcG1lbnQgLi4uJyk7XG4gICAgfVxuICB9LFxuICBzdGFydEFsbDogZnVuY3Rpb24gc3RhcnRBbGwoKSB7fSxcbiAgYmFja1RvU3RhcnQ6IGZ1bmN0aW9uIGJhY2tUb1N0YXJ0KCkge1xuICAgIHRoaXMudGNfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnRlc3RfbW9kZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RhcnRfbm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMucmVzdWx0bGlzdC5hY3RpdmUgPSBmYWxzZTtcbiAgfSxcbiAgc2hvd1NpbXBsZTogZnVuY3Rpb24gc2hvd1NpbXBsZSgpIHtcbiAgICBnYW1lLnNob3dUaXBzKCdJbiBkZXZlbG9wbWVudCAuLi4nKTtcbiAgfSxcbiAgc2hvd1Rlc3RNb2RlOiBmdW5jdGlvbiBzaG93VGVzdE1vZGUoKSB7XG4gICAgdGhpcy50Y19ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMudGVzdF9tb2RlX25vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXJ0X25vZGUuYWN0aXZlID0gZmFsc2U7XG4gIH0sXG4gIHNob3dUYzogZnVuY3Rpb24gc2hvd1RjKCkge1xuICAgIHRoaXMudGNfbm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuc3RhcnRfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnRlc3RfbW9kZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICB9LFxuXG4gIHNob3dSZWNvcmQ6IGZ1bmN0aW9uIHNob3dSZWNvcmQoKSB7XG4gICAgLy9nYW1lLnNob3dUaXBzKCdJbiBkZXZlbG9wbWVudCAuLi4nKTtcblxuICAgIHRoaXMudGNfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0X25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy50ZXN0X21vZGVfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnJlc3VsdGxpc3QuYWN0aXZlID0gdHJ1ZTtcbiAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcyMTk5YjQ2WjlQenA2ZTlnWkFzM3VmJywgJ1BhdXNlQnRuJyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXFBhdXNlQnRuLmpzXG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWUnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vRGV2aWNlJyk7XG52YXIgYW5hbHl0aWNzID0gcmVxdWlyZSgnLi4vY29tbW9uL2FuYWx5dGljcycpO1xudmFyIEJhY2tWaWV3ID0gcmVxdWlyZSgnLi9CYWNrVmlldycpO1xuXG5jYy5DbGFzcyh7XG4gICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBnYW1lX2tleTogY2MuU3RyaW5nXG4gIH0sXG4gIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZmluZF9nYW1lID0gZ2FtZS5maW5kR2FtZUNvbmZpZyh0aGlzLmdhbWVfa2V5KTtcbiAgICBjYy5hc3NlcnQoZmluZF9nYW1lLCAnUGF1c2VCdG4gZ2FtZV9rZXk6JyArIHRoaXMuZ2FtZV9rZXkgKyAnIG5vdCBmb3VuZCEnKTtcblxuICAgIGFuYWx5dGljcy5zdGFydEdhbWUodGhpcy5nYW1lX2tleSk7XG5cbiAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PSA4ICYmIGNjLnN5cy5pc0Jyb3dzZXIpIHtcbiAgICAgICAgICBfdGhpcy5vblByZXNzZWRCYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzLm5vZGUpO1xuICB9LFxuICBvblByZXNzZWRCYWNrOiBmdW5jdGlvbiBvblByZXNzZWRCYWNrKCkge1xuICAgIC8vIEJhY2tWaWV3LnNob3codGhpcy5nYW1lX2tleSk7XG4gICAgdGhpcy5vbkNsaWNrKCk7XG4gIH0sXG4gIG9uRGlzYWJsZTogZnVuY3Rpb24gb25EaXNhYmxlKCkge1xuICAgIGFuYWx5dGljcy5lbmRHYW1lKHRoaXMuZ2FtZV9rZXkpO1xuICB9LFxuICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKCkge1xuICAgIGlmIChjYy5kaXJlY3Rvci5pc1BhdXNlZCgpKSByZXR1cm47XG4gICAgdmFyIHdpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG5cbiAgICB2YXIgcHJlZmFiID0gY2MubG9hZGVyLmdldFJlcygncHJlZmFicy9wYXVzZVZpZXcnKTtcbiAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgbmV3Tm9kZS5zZXRQb3NpdGlvbihjYy52Mih3aW5TaXplLndpZHRoIC8gMiwgd2luU2l6ZS5oZWlnaHQgLyAyKSk7XG4gICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoJ3BhdXNlVmlldycpLnNldEdhbWVLZXkodGhpcy5nYW1lX2tleSk7XG4gICAgdmFyIHNjZW5lID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcbiAgICBzY2VuZS5hZGRDaGlsZChuZXdOb2RlLCAxMCk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNjLmRpcmVjdG9yLnBhdXNlKCk7XG4gICAgfSwgMSAvIDMwKTtcblxuICAgIGFuYWx5dGljcy5idXR0b25FdmVudCgncGF1c2VfYnV0dG9uJyk7XG4gIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTNhMGMrTW9rNUdLNzBkYVNBRlpqZW8nLCAnU2Nyb2xsZXInKTtcbi8vIHNjcmlwdHNcXDA0XFxTY3JvbGxlci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g5rua5Yqo55qE6YCf5bqm77yM5Y2V5L2NcHgvc1xuICAgICAgICBzcGVlZDogLTMwMCxcbiAgICAgICAgLy8geOWIsOi+vuatpOS9jee9ruWQjuW8gOWni+mHjeWktOa7muWKqFxuICAgICAgICBzdGFydFg6IDM2MCxcbiAgICAgICAgcmVzZXRYOiAtMzYwXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmNhblNjcm9sbCA9IHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5TY3JvbGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLnNwZWVkICogZHQ7XG4gICAgICAgIGlmICh0aGlzLm5vZGUueCA8PSB0aGlzLnJlc2V0WCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnN0YXJ0WDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wU2Nyb2xsOiBmdW5jdGlvbiBzdG9wU2Nyb2xsKCkge1xuICAgICAgICB0aGlzLmNhblNjcm9sbCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzdGFydFNjcm9sbDogZnVuY3Rpb24gc3RhcnRTY3JvbGwoKSB7XG4gICAgICAgIHRoaXMuY2FuU2Nyb2xsID0gdHJ1ZTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2EwN2U1MUFpcFpJOXJVMHlrY1RodlZsJywgJ1NsaWRlckJhcicpO1xuLy8gc2NyaXB0c1xcMDFcXFNsaWRlckJhci5qc1xuXG5jYy5DbGFzcyh7XG4gIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgcHJvcGVydGllczoge1xuICAgIHNsaWRlOiBjYy5Ob2RlLFxuICAgIHNsaWRlX2JnOiBjYy5Ob2RlXG4gIH0sXG4gIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgIHRoaXMuc2xpZGVfcG9zID0gXy5jbG9uZSh0aGlzLnNsaWRlLnBvc2l0aW9uKTtcbiAgICB0aGlzLmJnX2JveCA9IHRoaXMuc2xpZGVfYmcuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgdGhpcy5pbml0VG91Y2goKTtcbiAgICB0aGlzLmVuYWJsZSgpO1xuICB9LFxuICBvblNsaWRlOiBmdW5jdGlvbiBvblNsaWRlKGZuKSB7XG4gICAgdGhpcy5vblNsaWRlQ0IgPSBmbjtcbiAgfSxcbiAgZW5hYmxlOiBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgdGhpcy5fZW5hYmxlID0gdHJ1ZTtcbiAgfSxcbiAgZGlzYWJsZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICB0aGlzLl9lbmFibGUgPSBmYWxzZTtcbiAgfSxcbiAgaW5pdFRvdWNoOiBmdW5jdGlvbiBpbml0VG91Y2goKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuc2xpZGVfYmcuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnNsaWRlLnBvc2l0aW9uID0gdGhpcy5zbGlkZV9wb3M7XG5cbiAgICB2YXIgaXNfY29tcGxldGUgPSBmYWxzZTtcbiAgICB2YXIgdG91Y2hFbmQgPSBmdW5jdGlvbiB0b3VjaEVuZCh0b3VjaGUpIHtcbiAgICAgIF90aGlzLnNsaWRlLnBvc2l0aW9uID0gX3RoaXMuc2xpZGVfcG9zO1xuICAgICAgaWYgKCFpc19jb21wbGV0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBfdGhpcy5vblNsaWRlQ0IgJiYgX3RoaXMub25TbGlkZUNCKCk7XG4gICAgfTtcbiAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbiBvblRvdWNoQmVnYW4odG91Y2hlKSB7XG4gICAgICAgIGlmICghX3RoaXMuX2VuYWJsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgcmVjdCA9IF90aGlzLnNsaWRlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgICAgICB2YXIgcmViID0gY2MucmVjdENvbnRhaW5zUG9pbnQocmVjdCwgdG91Y2hlLmdldExvY2F0aW9uKCkpO1xuICAgICAgICBpZiAocmViKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uVG91Y2hNb3ZlZDogZnVuY3Rpb24gb25Ub3VjaE1vdmVkKHRvdWNoZSkge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSB0b3VjaGUuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLnNsaWRlLmdldFBhcmVudCgpLmNvbnZlcnRUb05vZGVTcGFjZShsb2NhdGlvbik7XG4gICAgICAgIF90aGlzLnNsaWRlLnBvc2l0aW9uID0gY2MudjIocG9zLngsIF90aGlzLnNsaWRlX3Bvcy55KTtcbiAgICAgICAgaWYgKGxvY2F0aW9uLnggKyBfdGhpcy5zbGlkZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC8gMiA+PSBfdGhpcy5iZ19ib3gueCArIF90aGlzLmJnX2JveC53aWR0aCkge1xuICAgICAgICAgIGlzX2NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uVG91Y2hFbmRlZDogdG91Y2hFbmQsXG4gICAgICBvblRvdWNoQ2FuY2VsbGVkOiB0b3VjaEVuZFxuICAgIH07XG4gICAgdGhpcy5fc2xpZGVfbGlzdGVuZXIgPSBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIobGlzdGVuZXIsIHRoaXMuc2xpZGUpO1xuICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjE3YWZzc0hWUkVhSUFWS2wwdmdTMHcnLCAnYW5hbHl0aWNzJyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXGFuYWx5dGljcy5qc1xuXG52YXIgaXNfYW5kcm9pZCA9IGNjLnN5cy5pc05hdGl2ZTtcblxudmFyIEFuYWx5dGljc1V0aWwgPSB7XG4gIHN0YXJ0R2FtZTogZnVuY3Rpb24gc3RhcnRHYW1lKHBhZ2VOYW1lKSB7XG4gICAgaWYgKCFpc19hbmRyb2lkKSByZXR1cm4gY2MubG9nKCdBbmFseXRpY3MgLSBzdGFydFBhZ2UgOiAnICsgcGFnZU5hbWUpO1xuICAgIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9BbmFseXRpY3NVdGlsXCIsIFwic3RhcnRQYWdlXCIsIFwiKExqYXZhL2xhbmcvU3RyaW5nOylWXCIsIHBhZ2VOYW1lKTtcbiAgfSxcbiAgZW5kR2FtZTogZnVuY3Rpb24gZW5kR2FtZShwYWdlTmFtZSkge1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygnQW5hbHl0aWNzIC0gZW5kUGFnZSA6ICcgKyBwYWdlTmFtZSk7XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L3V0aWxzL0FuYWx5dGljc1V0aWxcIiwgXCJlbmRQYWdlXCIsIFwiKExqYXZhL2xhbmcvU3RyaW5nOylWXCIsIHBhZ2VOYW1lKTtcbiAgfSxcbiAgYnV0dG9uRXZlbnQ6IGZ1bmN0aW9uIGJ1dHRvbkV2ZW50KGJ1dHRvbk5hbWUpIHtcbiAgICBpZiAoIWlzX2FuZHJvaWQpIHJldHVybiBjYy5sb2coJ0FuYWx5dGljcyAtIGJ1dHRvbkV2ZW50IDogJyArIGJ1dHRvbk5hbWUpO1xuICAgIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9BbmFseXRpY3NVdGlsXCIsIFwiYnV0dG9uRXZlbnRcIiwgXCIoTGphdmEvbGFuZy9TdHJpbmc7KVZcIiwgYnV0dG9uTmFtZSk7XG4gIH0sXG4gIGlzQXBwSW5zdGFsbGVkOiBmdW5jdGlvbiBpc0FwcEluc3RhbGxlZChwYWNrYWdlTmFtZSkge1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9BbmFseXRpY3NVdGlsXCIsIFwiaXNBcHBJbnN0YWxsZWRcIiwgXCIoTGphdmEvbGFuZy9TdHJpbmc7KVpcIiwgcGFja2FnZU5hbWUpO1xuICB9LFxuICBzaG93VG9hc3Q6IGZ1bmN0aW9uIHNob3dUb2FzdChtc2cpIHtcbiAgICBpZiAoIWlzX2FuZHJvaWQpIHJldHVybiBjYy5sb2coJ3Nob3dUb2FzdCA6ICcgKyBtc2cpO1xuICAgIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9BbmFseXRpY3NVdGlsXCIsIFwic2hvd1RvYXN0XCIsIFwiKExqYXZhL2xhbmcvU3RyaW5nOylWXCIsIG1zZyk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbmFseXRpY3NVdGlsO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGVmZDZIWW5EWktQWWNDZGYweWhTRnMnLCAnY2xvc2VBRGJnJyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXGNsb3NlQURiZy5qc1xuXG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL2RldmljZScpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCB0aGlzLmNsb3NlQURiZy5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgY2xvc2VBRGJnOiBmdW5jdGlvbiBjbG9zZUFEYmcoKSB7XG4gICAgICAgIC8v6ZqQ6JeP6IOM5pmv5Zu+XG4gICAgICAgIGRldmljZS5yZW1vdmVMYXVuY2hJbWFnZSgpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVywgdGhpcy5jbG9zZUFEYmcuYmluZCh0aGlzKSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ExMTkzQmZkR0JHdjdHZ2xaOFFkNjc5JywgJ2NvbmZpZycpO1xuLy8gc2NyaXB0c1xcY29tbW9uXFxjb25maWcuanNcblxudmFyIGNvbmZpZyA9IHt9O1xuXG5jb25maWcuZ2FtZXMgPSBbeyBuYW1lOiAnVG91Y2ggU2NyZWVuJywga2V5OiAnc2NyZWVuJywgc2NlbmVOYW1lOiAnMDEnLCBuZWVkX3Njb3JlOiB0cnVlLCBzY29yZV91bml0OiAncycgfSwgeyBuYW1lOiAnRGlzcGxheScsIGtleTogJ2Rpc3BsYXknLCBzY2VuZU5hbWU6ICcwMicsIG5lZWRfc2NvcmU6IHRydWUsIHNjb3JlX3VuaXQ6ICdzJyB9LCB7IG5hbWU6ICdTcGVha2VyJywga2V5OiAnc3BlYWtlcicsIHNjZW5lTmFtZTogJzAzJywgbmVlZF9zY29yZTogdHJ1ZSwgc2NvcmVfdW5pdDogJ3MnIH0sIHsgbmFtZTogJ01pY3JvcGhvbmUnLCBrZXk6ICdtaWNyb3Bob25lJywgc2NlbmVOYW1lOiAnMDQnLCBuZWVkX3Njb3JlOiB0cnVlLCBzY29yZV91bml0OiAnJyB9LCB7IG5hbWU6ICdDYW1lcmFzJywga2V5OiAnY2FtZXJhcycsIHNjZW5lTmFtZTogJzA1JywgbmVlZF9zY29yZTogdHJ1ZSwgc2NvcmVfdW5pdDogJycgfSwgeyBuYW1lOiAnRmxhc2hsaWdodCcsIGtleTogJ2ZsYXNobGlnaHQnLCBzY2VuZU5hbWU6ICcwNicsIG5lZWRfc2NvcmU6IHRydWUsIHNjb3JlX3VuaXQ6ICdzJyB9LCB7IG5hbWU6ICdWaWJyYXRvcicsIGtleTogJ3ZpYnJhdG9yJywgc2NlbmVOYW1lOiAnMDcnLCBuZWVkX3Njb3JlOiB0cnVlLCBzY29yZV91bml0OiAnJyB9LCB7IG5hbWU6ICdWb2x1bWUgS2V5cycsIGtleTogJ3ZvbHVtZV9rZXlzJywgc2NlbmVOYW1lOiAnMDgnLCBuZWVkX3Njb3JlOiB0cnVlLCBzY29yZV91bml0OiAnJyB9LCB7IG5hbWU6ICdHeXJvc2NvcGUnLCBrZXk6ICdneXJvc2NvcGUnLCBzY2VuZU5hbWU6ICcxMCcsIG5lZWRfc2NvcmU6IHRydWUsIHNjb3JlX3VuaXQ6ICdzJyB9LCB7IG5hbWU6ICdBY2NlbGVyb21ldGVyJywga2V5OiAnYWNjZWxlcm9tZXRlcicsIHNjZW5lTmFtZTogJzExJywgbmVlZF9zY29yZTogdHJ1ZSwgc2NvcmVfdW5pdDogJ3MnIH0sIHsgbmFtZTogJ1Byb3hpbWl0eSBTZW5zb3InLCBrZXk6ICdwcm94aW1pdHlfc2Vuc29yJywgc2NlbmVOYW1lOiAnMTInLCBuZWVkX3Njb3JlOiB0cnVlLCBzY29yZV91bml0OiAnJyB9LCB7IG5hbWU6ICdUZXN0IEFsbCBBYm92ZScsIGtleTogJ2FsbCcsIHNjZW5lTmFtZTogJy0xJywgbmVlZF9zY29yZTogZmFsc2UsIHNjb3JlX3VuaXQ6ICcnIH1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQwNGZheWh0T0pLTVpNdjdJUnRYWGFlJywgJ2RldmljZScpO1xuLy8gc2NyaXB0c1xcY29tbW9uXFxkZXZpY2UuanNcblxudmFyIGlzX2FuZHJvaWQgPSBjYy5zeXMuaXNOYXRpdmU7XG5cbnZhciB2b2x1bWVDaGFuZ2VGdW5jID0gbnVsbDtcbndpbmRvdy5fX29uVm9sdW1lQ2hhbmdlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciB2ID0gcGFyc2VJbnQodmFsdWUpO1xuICB2b2x1bWVDaGFuZ2VGdW5jICYmIHZvbHVtZUNoYW5nZUZ1bmModik7XG59O1xuXG52YXIgRGV2aWNlID0gY2MuQ2xhc3Moe1xuICBcImV4dGVuZHNcIjogY2MuT2JqZWN0LFxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gY2MuZGlyZWN0b3IuZW5kID0gZnVuY3Rpb24gKCl7XG4gICAgLy8gICBhbGVydCgnZW5kIGVuZCcpO1xuICAgIC8vIH07XG5cbiAgfSxcbiAgZXhpdE1lOiBmdW5jdGlvbiBleGl0TWUoKSB7XG4gICAgaWYgKCFpc19hbmRyb2lkKSByZXR1cm4gY2MubG9nKCdkZXZpY2UgZXhpdE1lJyk7XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L3V0aWxzL0FuYWx5dGljc1V0aWxcIiwgXCJmaW5pc2hBY3Rpdml0eVwiLCBcIigpVlwiKTtcbiAgfSxcbiAgaW50ZW50R2FtZUlkOiBmdW5jdGlvbiBpbnRlbnRHYW1lSWQoKSB7XG4gICAgLy8gcmV0dXJuICdzY3JlZW4nO1xuICAgIGlmICghaXNfYW5kcm9pZCkge1xuICAgICAgLy8gY2MubG9nKCdpbnRlbnRHYW1lSWQnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2ludGVudEdhbWVJZCkgcmV0dXJuIHRoaXMuX2ludGVudEdhbWVJZDtcblxuICAgIHRoaXMuX2ludGVudEdhbWVJZCA9IGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9JbnRlbnRVdGlsXCIsIFwiZ2V0R2FtZUlkXCIsIFwiKClMamF2YS9sYW5nL1N0cmluZztcIik7XG4gICAgcmV0dXJuIHRoaXMuX2ludGVudEdhbWVJZDtcbiAgfSxcbiAgZmxhc2g6IGZ1bmN0aW9uIGZsYXNoKCkge1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygnZGV2aWNlIGZsYXNoJyk7XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L3V0aWxzL0xpZ2h0VXRpbHNcIiwgXCJvcGVuTGlnaHRcIiwgXCIoKVZcIik7XG4gICAgLy9zZXRUaW1lb3V0KCgpPT57XG4gICAgLy8gIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9MaWdodFV0aWxzXCIsIFwiY2xvc2VMaWdodFwiLCBcIigpVlwiKTtcbiAgICAvL30sMTAwMCk7XG4gIH0sXG5cbiAgZmxhc2hTdG9wOiBmdW5jdGlvbiBmbGFzaFN0b3AoKSB7XG4gICAgaWYgKCFpc19hbmRyb2lkKSByZXR1cm4gY2MubG9nKCdkZXZpY2UgZmxhc2gnKTtcbiAgICBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvdXRpbHMvTGlnaHRVdGlsc1wiLCBcImNsb3NlTGlnaHRcIiwgXCIoKVZcIik7XG4gIH0sXG5cbiAgdmlicmF0b3I6IGZ1bmN0aW9uIHZpYnJhdG9yKCkge1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygnZGV2aWNlIHZpYnJhdG9yJyk7XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L3V0aWxzL1ZpYnJhdG9yVXRpbFwiLCBcIlZpYnJhdGVcIiwgXCIoSSlWXCIsIDIwMCk7XG4gIH0sXG4gIHJlY29yZFN0YXJ0OiBmdW5jdGlvbiByZWNvcmRTdGFydCgpIHtcbiAgICB0aGlzLl9yZWNvcmRpbmcgPSB0cnVlO1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygncmVjb3JkU3RhcnQnKTtcbiAgICBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvdXRpbHMvUmVjb3JkTWFuYWdlclwiLCBcInN0YXJ0XCIsIFwiKClWXCIpO1xuICB9LFxuICByZWNvcmRTdG9wOiBmdW5jdGlvbiByZWNvcmRTdG9wKCkge1xuICAgIGNjLmFzc2VydCh0aGlzLl9yZWNvcmRpbmcsICfor7flhYjosIPnlKhyZWNvcmRTdGFydCcpO1xuICAgIHRoaXMuX3JlY29yZGluZyA9IGZhbHNlO1xuICAgIGlmICghaXNfYW5kcm9pZCkge1xuICAgICAgcmV0dXJuIGNjLmxvZygncmVjb3JkU3RvcCcpO1xuICAgIH1cbiAgICBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvdXRpbHMvUmVjb3JkTWFuYWdlclwiLCBcInN0b3BcIiwgXCIoKVZcIik7XG4gIH0sXG4gIGdldERlY2liZWw6IGZ1bmN0aW9uIGdldERlY2liZWwoKSB7XG4gICAgY2MuYXNzZXJ0KHRoaXMuX3JlY29yZGluZywgJ+ivt+WFiOiwg+eUqHJlY29yZFN0YXJ0Jyk7XG4gICAgaWYgKCFpc19hbmRyb2lkKSB7XG4gICAgICBjYy5sb2coJ2dldERlY2liZWwnKTtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICByZXR1cm4ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L3V0aWxzL1JlY29yZE1hbmFnZXJcIiwgXCJnZXREZWNpYmVsXCIsIFwiKClJXCIpO1xuICB9LFxuICBwbGF5UmVjb3JkOiBmdW5jdGlvbiBwbGF5UmVjb3JkKCkge1xuICAgIGNjLmFzc2VydCghdGhpcy5fcmVjb3JkaW5nLCAn6K+35YWI6LCD55SocmVjb3JkU3RvcCcpO1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygncGxheVJlY29yZCcpO1xuICAgIHJldHVybiBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvdXRpbHMvUmVjb3JkTWFuYWdlclwiLCBcInBsYXlSZWNvcmRcIiwgXCIoKVZcIik7XG4gIH0sXG5cbiAgcHJveGltaXR5U3RhcnQ6IGZ1bmN0aW9uIHByb3hpbWl0eVN0YXJ0KGNiKSB7XG4gICAgdGhpcy5fcHJveGltaXR5aW5nID0gdHJ1ZTtcbiAgICB2YXIgZm5fbmFtZSA9IGJpbmRfY2IoY2IpO1xuICAgIHRoaXMuX3Byb3hpbWl0eWluZ19mbl9uYW1lID0gZm5fbmFtZTtcbiAgICBpZiAoIWlzX2FuZHJvaWQpIHJldHVybiBjYy5sb2coJ3Byb3hpbWl0eVN0YXJ0Jyk7XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L3V0aWxzL1Byb3hpbWl0eVNlbnNvclV0aWxzXCIsIFwic3RhcnRcIiwgXCIoTGphdmEvbGFuZy9TdHJpbmc7KVZcIiwgZm5fbmFtZSk7XG4gIH0sXG4gIHByb3hpbWl0eVN0b3A6IGZ1bmN0aW9uIHByb3hpbWl0eVN0b3AoKSB7XG4gICAgY2MuYXNzZXJ0KHRoaXMuX3Byb3hpbWl0eWluZywgJ+ivt+WFiOiwg+eUqHByb3hpbWl0eVN0YXJ0Jyk7XG4gICAgdGhpcy5fcHJveGltaXR5aW5nID0gZmFsc2U7XG4gICAgd2luZG93W3RoaXMuX3Byb3hpbWl0eWluZ19mbl9uYW1lXSA9IG51bGw7XG4gICAgdGhpcy5fcHJveGltaXR5aW5nX2ZuX25hbWUgPSBudWxsO1xuICAgIGlmICghaXNfYW5kcm9pZCkge1xuICAgICAgcmV0dXJuIGNjLmxvZygncHJveGltaXR5U3RvcCcpO1xuICAgIH1cbiAgICBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvdXRpbHMvUHJveGltaXR5U2Vuc29yVXRpbHNcIiwgXCJzdG9wXCIsIFwiKClWXCIpO1xuICB9LFxuXG4gIHZvbHVtZVN0YXJ0OiBmdW5jdGlvbiB2b2x1bWVTdGFydChjYikge1xuICAgIHZvbHVtZUNoYW5nZUZ1bmMgPSBjYjtcbiAgICAvLyB0aGlzLl92b2x1bWVpbmcgPSB0cnVlO1xuICAgIC8vIGxldCBmbl9uYW1lID0gYmluZF9jYihjYik7XG4gICAgLy8gdGhpcy5fdm9sdW1lX2ZuX25hbWUgPSBmbl9uYW1lO1xuICAgIC8vIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygndm9sdW1lU3RhcnQnKTtcbiAgICAvLyBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvdXRpbHMvVm9sdW1lVXRpbHNcIiwgXCJzdGFydFwiLCBcIihMamF2YS9sYW5nL1N0cmluZzspVlwiLCBmbl9uYW1lKTtcbiAgfSxcbiAgdm9sdW1lU3RvcDogZnVuY3Rpb24gdm9sdW1lU3RvcCgpIHtcbiAgICB2b2x1bWVDaGFuZ2VGdW5jID0gbnVsbDtcbiAgICAvLyBjYy5hc3NlcnQodGhpcy5fdm9sdW1laW5nLCAn6K+35YWI6LCD55Sodm9sdW1lU3RhcnQnKTtcbiAgICAvLyB0aGlzLl92b2x1bWVpbmcgPSBmYWxzZTtcbiAgICAvLyB3aW5kb3dbdGhpcy5fdm9sdW1lX2ZuX25hbWVdID0gbnVsbDtcbiAgICAvLyB0aGlzLl92b2x1bWVfZm5fbmFtZSA9IG51bGw7XG4gICAgLy8gaWYgKCFpc19hbmRyb2lkKSB7XG4gICAgLy8gICByZXR1cm4gY2MubG9nKCd2b2x1bWVTdG9wJyk7XG4gICAgLy8gfVxuICAgIC8vIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC91dGlscy9Wb2x1bWVVdGlsc1wiLCBcInN0b3BcIiwgXCIoKVZcIik7XG4gIH0sXG4gIGNhbWVyYVN0YXJ0OiBmdW5jdGlvbiBjYW1lcmFTdGFydChjYW1yZWFfaWQpIHtcbiAgICB0aGlzLl9jYW1lcmFpbmcgPSB0cnVlO1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygnY2FtZXJhU3RhcnQnKTtcbiAgICBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvY2FtZXJhL0NhbWVyYUFuZHJvaWRcIiwgXCJzaG93XCIsIFwiKEkpVlwiLCBjYW1yZWFfaWQpO1xuICB9LFxuICBjYW1lcmFTdG9wOiBmdW5jdGlvbiBjYW1lcmFTdG9wKCkge1xuICAgIC8vIGNjLmFzc2VydCh0aGlzLl9jYW1lcmFpbmcsJ+ivt+WFiOiwg+eUqGNhbWVyYVN0YXJ0Jyk7XG4gICAgdGhpcy5fY2FtZXJhaW5nID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuY2FtZXJhQ2FwdHVyZV9jYl9uYW1lKSB3aW5kb3dbdGhpcy5jYW1lcmFDYXB0dXJlX2NiX25hbWVdID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYUNhcHR1cmVfY2JfbmFtZSA9IG51bGw7XG4gICAgaWYgKCFpc19hbmRyb2lkKSB7XG4gICAgICByZXR1cm4gY2MubG9nKCdjYW1lcmFTdG9wJyk7XG4gICAgfVxuICAgIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC9jYW1lcmEvQ2FtZXJhQW5kcm9pZFwiLCBcImNsb3NlXCIsIFwiKClWXCIpO1xuICB9LFxuICBjYW1lcmFDYXB0dXJlOiBmdW5jdGlvbiBjYW1lcmFDYXB0dXJlKGNiKSB7XG4gICAgY2MuYXNzZXJ0KHRoaXMuX2NhbWVyYWluZywgJ+ivt+WFiOiwg+eUqGNhbWVyYVN0YXJ0Jyk7XG4gICAgaWYgKCFpc19hbmRyb2lkKSB7XG4gICAgICByZXR1cm4gY2MubG9nKCdjYW1lcmFDYXB0dXJlJyk7XG4gICAgfVxuICAgIHZhciBjYl9uYW1lID0gYmluZF9jYihjYik7XG4gICAgdGhpcy5jYW1lcmFDYXB0dXJlX2NiX25hbWUgPSBjYl9uYW1lO1xuICAgIHJldHVybiBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvY2FtZXJhL0NhbWVyYUFuZHJvaWRcIiwgXCJjYXB0dXJlXCIsIFwiKExqYXZhL2xhbmcvU3RyaW5nOylWXCIsIGNiX25hbWUpO1xuICB9LFxuICBnZXRGcm9udENhbWVyYUlkOiBmdW5jdGlvbiBnZXRGcm9udENhbWVyYUlkKCkge1xuICAgIGlmICghaXNfYW5kcm9pZCkge1xuICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIHJldHVybiBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvY2FtZXJhL0NhbWVyYVZpZXdcIiwgXCJnZXRGcm9udENhbWVyYUlkXCIsIFwiKClJXCIpO1xuICB9LFxuICBnZXRCYWNrQ2FtZXJhSWQ6IGZ1bmN0aW9uIGdldEJhY2tDYW1lcmFJZCgpIHtcbiAgICBpZiAoIWlzX2FuZHJvaWQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICByZXR1cm4ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L2NhbWVyYS9DYW1lcmFWaWV3XCIsIFwiZ2V0QmFja0NhbWVyYUlkXCIsIFwiKClJXCIpO1xuICB9LFxuICBhZGRUb0dhbGxlcnk6IGZ1bmN0aW9uIGFkZFRvR2FsbGVyeShmaWxlcGF0aCkge1xuICAgIGlmICghaXNfYW5kcm9pZCkgcmV0dXJuIGNjLmxvZygnYWRkVG9HYWxsZXJ5Jyk7XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L2NhbWVyYS9DYW1lcmFBbmRyb2lkXCIsIFwiYWRkVG9HYWxsZXJ5XCIsIFwiKExqYXZhL2xhbmcvU3RyaW5nOylWXCIsIGZpbGVwYXRoKTtcbiAgfSxcbiAgc2hhcmVUb090aGVyQXBwOiBmdW5jdGlvbiBzaGFyZVRvT3RoZXJBcHAoZmlsZXBhdGgpIHtcbiAgICBpZiAoIWlzX2FuZHJvaWQpIHJldHVybiBjYy5sb2coJ3NoYXJlVG9PdGhlckFwcCcpO1xuICAgIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC9jYW1lcmEvQ2FtZXJhQW5kcm9pZFwiLCBcInNoYXJlVG9PdGhlckFwcFwiLCBcIihMamF2YS9sYW5nL1N0cmluZzspVlwiLCBmaWxlcGF0aCk7XG4gIH0sXG5cbiAgcmVtb3ZlTGF1bmNoSW1hZ2U6IGZ1bmN0aW9uIHJlbW92ZUxhdW5jaEltYWdlKCkge1xuICAgIGlmICghaXNfYW5kcm9pZCkge1xuICAgICAgcmV0dXJuIGNjLmxvZygncmVtb3ZlTGF1bmNoSW1hZ2UnKTtcbiAgICB9XG4gICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L0dhbWVUZXN0QWN0aXZpdHlcIiwgXCJyZW1vdmVMYXVuY2hJbWFnZVwiLCBcIigpVlwiKTtcbiAgfVxuXG59KTtcblxudmFyIGZuX2kgPSAwO1xuXG5mdW5jdGlvbiBiaW5kX2NiKGZuKSB7XG4gIGZuX2krKztcbiAgdmFyIG5hbWUgPSAnX19mbl8nICsgZm5faTtcbiAgd2luZG93W25hbWVdID0gZm47XG4gIHJldHVybiBuYW1lO1xufVxuXG52YXIgZGV2aWNlID0gbmV3IERldmljZSgpO1xuZGV2aWNlLmluaXQoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZXZpY2U7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4NTA5OCs4QUF4QVFvQVBMV1pwYndJNScsICdmYWtlRGF0YScpO1xuLy8gc2NyaXB0c1xcY29tbW9uXFxmYWtlRGF0YS5qc1xuXG52YXIgcmVzdWx0cyA9IFt7XG5cdG5hbWU6ICcxLSBTY3JlZW4nLFxuXHRzdGF0ZTogMSxcblx0c2NvcmU6IDEyMzQ1LFxuXHR0aW1lOiAnMDcvMTgvMTYgMTE6MzUnXG59LCB7XG5cdG5hbWU6ICcyLSBEaXNwYWx5Jyxcblx0c3RhdGU6IDAsXG5cdHNjb3JlOiAnTi9BJyxcblx0dGltZTogJ04vQSdcbn0sIHtcblx0bmFtZTogJzMtIFNwZWFrZXInLFxuXHRzdGF0ZTogLTEsXG5cdHNjb3JlOiAnTi9BJyxcblx0dGltZTogJzA3LzE4LzE2IDExOjM1J1xufSwge1xuXHRuYW1lOiAnNC0gU2NyZWVuJyxcblx0c3RhdGU6IDEsXG5cdHNjb3JlOiAxMjM0NSxcblx0dGltZTogJzA3LzE4LzE2IDExOjM1J1xufSwge1xuXHRuYW1lOiAnNS0gRGlzcGFseScsXG5cdHN0YXRlOiAwLFxuXHRzY29yZTogJ04vQScsXG5cdHRpbWU6ICdOL0EnXG59LCB7XG5cdG5hbWU6ICc2LSBTcGVha2VyJyxcblx0c3RhdGU6IC0xLFxuXHRzY29yZTogJ04vQScsXG5cdHRpbWU6ICcwNy8xOC8xNiAxMTozNSdcbn0sIHtcblx0bmFtZTogJzctIFNjcmVlbicsXG5cdHN0YXRlOiAxLFxuXHRzY29yZTogMTIzNDUsXG5cdHRpbWU6ICcwNy8xOC8xNiAxMTozNSdcbn0sIHtcblx0bmFtZTogJzgtIERpc3BhbHknLFxuXHRzdGF0ZTogMCxcblx0c2NvcmU6ICdOL0EnLFxuXHR0aW1lOiAnTi9BJ1xufSwge1xuXHRuYW1lOiAnOS0gU3BlYWtlcicsXG5cdHN0YXRlOiAtMSxcblx0c2NvcmU6ICdOL0EnLFxuXHR0aW1lOiAnMDcvMTgvMTYgMTE6MzUnXG59LCB7XG5cdG5hbWU6ICcxMC0gU2NyZWVuJyxcblx0c3RhdGU6IDEsXG5cdHNjb3JlOiAxMjM0NSxcblx0dGltZTogJzA3LzE4LzE2IDExOjM1J1xufSwge1xuXHRuYW1lOiAnMTEtIERpc3BhbHknLFxuXHRzdGF0ZTogMCxcblx0c2NvcmU6ICdOL0EnLFxuXHR0aW1lOiAnTi9BJ1xufSwge1xuXHRuYW1lOiAnMTItIFNwZWFrZXInLFxuXHRzdGF0ZTogLTEsXG5cdHNjb3JlOiAnTi9BJyxcblx0dGltZTogJzA3LzE4LzE2IDExOjM1J1xufV07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN1bHRzOiByZXN1bHRzXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDE1NDA2SUhNVkhPTHA4S2pkMW9LS0QnLCAnZ3VpZGUnKTtcbi8vIHNjcmlwdHNcXGNvbW1vblxcZ3VpZGUuanNcblxudmFyIGdhbWUgPSByZXF1aXJlKCcuL0dhbWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZ2FtZV9rZXksIGltYWdlcywgY2IpIHtcbiAgdmFyIGdhbWVEYXRhID0gZ2FtZS5nZXRHYW1lU3RvcmVEYXRhKGdhbWVfa2V5KTtcbiAgaWYgKGdhbWVEYXRhLmd1aWRlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGNiKCk7XG4gIH1cblxuICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcblxuICB2YXIgbmV3Tm9kZSA9IG5ldyBjYy5Ob2RlKFwiTmV3IFNwcml0ZVwiKTtcbiAgbmV3Tm9kZS5zZXRDb250ZW50U2l6ZSh3aW5TaXplKTtcbiAgdmFyIHNwcml0ZSA9IG5ld05vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gIG5ld05vZGUuc2V0UG9zaXRpb24oY2MudjIod2luU2l6ZS53aWR0aCAvIDIsIHdpblNpemUuaGVpZ2h0IC8gMikpO1xuXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsaXN0ZW5lciA9IHtcbiAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKHRvdWNoZSwgZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbkltbWVkaWF0ZSgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBvblRvdWNoRW5kZWQ6IGZ1bmN0aW9uIG9uVG91Y2hFbmRlZCgpIHtcbiAgICAgIGNoYW5nZV9pbWFnZSgpO1xuICAgIH1cbiAgfTtcbiAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCBuZXdOb2RlKTtcbiAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChuZXdOb2RlKTtcblxuICB2YXIgY2hhbmdlX2ltYWdlID0gZnVuY3Rpb24gY2hhbmdlX2ltYWdlKCkge1xuICAgIGlmIChpbmRleCA+PSBpbWFnZXMubGVuZ3RoKSB7XG4gICAgICBvbkVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGltYWdlc1tpbmRleF07XG4gICAgaW5kZXgrKztcblxuICAgIGNjLmxvYWRlci5sb2FkUmVzKHBhdGgsIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xuICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIG9uRW5kID0gZnVuY3Rpb24gb25FbmQoKSB7XG4gICAgbmV3Tm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgZ2FtZURhdGEuZ3VpZGUgPSB0cnVlO1xuICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShnYW1lX2tleSwgSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpKTtcbiAgICBjYiAmJiBjYigpO1xuICB9O1xuXG4gIGNoYW5nZV9pbWFnZSgpO1xufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzc5ZTU0SjdMUkpOL3BEaVFDcFlrWC9RJywgJ2xvYWRpbmdTY2VuZScpO1xuLy8gc2NyaXB0c1xcbWFpblxcbG9hZGluZ1NjZW5lLmpzXG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWUnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vZGV2aWNlJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29tbW9uL2NvbmZpZycpO1xudmFyIGFuYWx5dGljcyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9hbmFseXRpY3MnKTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iuc2V0RGlzcGxheVN0YXRzKGZhbHNlKTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5vbihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0gsIF8ub25jZSh0aGlzLnByZWxvYWQuYmluZCh0aGlzKSkpO1xuICAgICAgICAvL2luaXQgZGJcbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYmluaXQnLCAnMScpO1xuXG4gICAgICAgIHZhciBpbnRlbnRHYW1lSWQgPSBkZXZpY2UuaW50ZW50R2FtZUlkKCk7XG4gICAgICAgIGlmIChpbnRlbnRHYW1lSWQgIT0gJycpIHtcbiAgICAgICAgICAgIHZhciBnYW1lcyA9IGNvbmZpZy5nYW1lcztcbiAgICAgICAgICAgIC8vIGxldCBnYW1lcyA9IGNvbmZpZy5nYW1lcy5zbGljZSgwLE1hdGguZmxvb3IoY29uZmlnLmdhbWVzLmxlbmd0aC8yKSk7XG4gICAgICAgICAgICB2YXIgb25lID0gXy5maW5kKGdhbWVzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmtleSA9PSBpbnRlbnRHYW1lSWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChvbmUpIHtcbiAgICAgICAgICAgICAgICAvL3NldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgICAgICBnYW1lLnNob3dHYW1lKGludGVudEdhbWVJZCwgMSk7XG4gICAgICAgICAgICAgICAgLy99LDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5hbHl0aWNzLnNob3dUb2FzdCgnZ2FtZV9pZDonICsgaW50ZW50R2FtZUlkICsgJyAgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL+makOiXj+iDjOaZr+WbvlxuICAgICAgICAvL2RldmljZS5yZW1vdmVMYXVuY2hJbWFnZSgpO1xuICAgICAgICAvL2dhbWUuc2hvd0dhbWUoJ21pY3JvcGhvbmUnLDEpO1xuICAgIH0sXG5cbiAgICBwcmVsb2FkOiBmdW5jdGlvbiBwcmVsb2FkKGRldGEpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBkZXRhO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlc0FsbChcInByZWZhYnNcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFicykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5sb2coZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF8uZWFjaChwcmVmYWJzLCBmdW5jdGlvbiAocHJlZmFiKSB7XG4gICAgICAgICAgICAgICAgY2MuYXNzZXJ0KHByZWZhYiBpbnN0YW5jZW9mIGNjLlByZWZhYiwgJ+WKoOi9vei1hOa6kOaIkOWKnywg5L2G6K+l5a+56LGh5LiN5pivUHJlZmFiJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2IyODRmQU43Y3RIQzRPRkhJdjBDdy9hJywgJ21haW5jZmcnKTtcbi8vIHNjcmlwdHNcXGNvbW1vblxcbWFpbmNmZy5qc1xuXG52YXIgY29uZmlnID0ge307XG4vL+S4u+mhteeahOaYvuekuumhtemdolxuY29uZmlnLnBhZ2UgPSAwO1xuLy/lvZPliY3mtYvor5XmuLjmiI9cbmNvbmZpZy50ZXN0ID0gJ3Rlc3QnO1xuLy/liqDpgJ/orqHnirbmgIFcbmNvbmZpZy5hY2NTdGF0dXMgPSAwO1xuLy/pn7PkuZDnirbmgIFcbmNvbmZpZy5hdWRpb1N0YXR1cyA9IDA7XG5cbi8v6Z+z5LmQ54q25oCBXG5jb25maWcucGF1c2V2aWV3ID0gMDtcblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczOGRjM25MZXM5Qy9LNHM5RlNDd0FjRicsICdtb21lbnQnKTtcbi8vIHNjcmlwdHNcXGNvbW1vblxcbW9tZW50LmpzXG5cbi8vISBtb21lbnQuanNcbi8vISB2ZXJzaW9uIDogMi4xMC42XG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6IHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6IGdsb2JhbC5tb21lbnQgPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGhvb2tDYWxsYmFjaztcblxuICAgIGZ1bmN0aW9uIHV0aWxzX2hvb2tzX19ob29rcygpIHtcbiAgICAgICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4gICAgLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gICAgZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIERhdGUgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcChhcnIsIGZuKSB7XG4gICAgICAgIHZhciByZXMgPSBbXSxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCB0cnVlKS51dGMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbXB0eTogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnM6IFtdLFxuICAgICAgICAgICAgdW51c2VkSW5wdXQ6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3c6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlcjogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGg6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0OiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJbnZhbGlkYXRlZDogZmFsc2UsXG4gICAgICAgICAgICBpc286IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2luZ0ZsYWdzKG0pIHtcbiAgICAgICAgaWYgKG0uX3BmID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9wZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9faXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBmbGFncyA9IGdldFBhcnNpbmdGbGFncyhtKTtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmIGZsYWdzLm92ZXJmbG93IDwgMCAmJiAhZmxhZ3MuZW1wdHkgJiYgIWZsYWdzLmludmFsaWRNb250aCAmJiAhZmxhZ3MuaW52YWxpZFdlZWtkYXkgJiYgIWZsYWdzLm51bGxJbnB1dCAmJiAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJiAhZmxhZ3MudXNlckludmFsaWRhdGVkO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgbS5faXNWYWxpZCA9IG0uX2lzVmFsaWQgJiYgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJiBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9fY3JlYXRlSW52YWxpZChmbGFncykge1xuICAgICAgICB2YXIgbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKGdldFBhcnNpbmdGbGFncyhtKSwgZmxhZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICB2YXIgbW9tZW50UHJvcGVydGllcyA9IHV0aWxzX2hvb2tzX19ob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc0FNb21lbnRPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fc3RyaWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3R6bSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc1VUQyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fb2Zmc2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3BmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50KG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IG9iaiAhPSBudWxsICYmIG9iai5faXNBTW9tZW50T2JqZWN0ICE9IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzRmxvb3IobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFic0Zsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSB8fCAhZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoKSB7fVxuXG4gICAgdmFyIGxvY2FsZXMgPSB7fTtcbiAgICB2YXIgZ2xvYmFsTG9jYWxlO1xuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICAgICAgcmVxdWlyZSgnLi9sb2NhbGUvJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgZGVmaW5lTG9jYWxlIGN1cnJlbnRseSBhbHNvIHNldHMgdGhlIGdsb2JhbCBsb2NhbGUsIHdlXG4gICAgICAgICAgICAgICAgLy8gd2FudCB0byB1bmRvIHRoYXQgZm9yIGxhenkgbG9hZGVkIGxvY2FsZXNcbiAgICAgICAgICAgICAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxvY2FsZSBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsb2NhbGUuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbG9jYWxlIGtleS5cbiAgICBmdW5jdGlvbiBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVMb2NhbGUobmFtZSwgdmFsdWVzKSB7XG4gICAgICAgIGlmICh2YWx1ZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlcy5hYmJyID0gbmFtZTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGVzW25hbWVdIHx8IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0gW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG4gICAgfVxuXG4gICAgdmFyIGFsaWFzZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFVuaXRBbGlhcyh1bml0LCBzaG9ydGhhbmQpIHtcbiAgICAgICAgdmFyIGxvd2VyQ2FzZSA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYWxpYXNlc1tsb3dlckNhc2VdID0gYWxpYXNlc1tsb3dlckNhc2UgKyAncyddID0gYWxpYXNlc1tzaG9ydGhhbmRdID0gdW5pdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHVuaXRzID09PSAnc3RyaW5nJyA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldFNldCh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdldF9zZXRfX3NldCh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fZ2V0KG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydnZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fc2V0KG1vbSwgdW5pdCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0KHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdW5pdDtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGZvciAodW5pdCBpbiB1bml0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHVuaXQsIHVuaXRzW3VuaXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgYWJzTnVtYmVyID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgemVyb3NUb0ZpbGwgPSB0YXJnZXRMZW5ndGggLSBhYnNOdW1iZXIubGVuZ3RoLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuICAgICAgICByZXR1cm4gKHNpZ24gPyBmb3JjZVNpZ24gPyAnKycgOiAnJyA6ICctJykgKyBNYXRoLnBvdygxMCwgTWF0aC5tYXgoMCwgemVyb3NUb0ZpbGwpKS50b1N0cmluZygpLnN1YnN0cigxKSArIGFic051bWJlcjtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRfFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbiAgICB2YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxuICAgIHZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxuICAgIHZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZGRlZCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRva2VuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSB8fCBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHZhciBtYXRjaDEgPSAvXFxkLzsgLy8gICAgICAgMCAtIDlcbiAgICB2YXIgbWF0Y2gyID0gL1xcZFxcZC87IC8vICAgICAgMDAgLSA5OVxuICAgIHZhciBtYXRjaDMgPSAvXFxkezN9LzsgLy8gICAgIDAwMCAtIDk5OVxuICAgIHZhciBtYXRjaDQgPSAvXFxkezR9LzsgLy8gICAgMDAwMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2g2ID0gL1srLV0/XFxkezZ9LzsgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzIgPSAvXFxkXFxkPy87IC8vICAgICAgIDAgLSA5OVxuICAgIHZhciBtYXRjaDF0bzMgPSAvXFxkezEsM30vOyAvLyAgICAgICAwIC0gOTk5XG4gICAgdmFyIG1hdGNoMXRvNCA9IC9cXGR7MSw0fS87IC8vICAgICAgIDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoMXRvNiA9IC9bKy1dP1xcZHsxLDZ9LzsgLy8gLTk5OTk5OSAtIDk5OTk5OVxuXG4gICAgdmFyIG1hdGNoVW5zaWduZWQgPSAvXFxkKy87IC8vICAgICAgIDAgLSBpbmZcbiAgICB2YXIgbWF0Y2hTaWduZWQgPSAvWystXT9cXGQrLzsgLy8gICAgLWluZiAtIGluZlxuXG4gICAgdmFyIG1hdGNoT2Zmc2V0ID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcblxuICAgIHZhciBtYXRjaFRpbWVzdGFtcCA9IC9bKy1dP1xcZCsoXFwuXFxkezEsM30pPy87IC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG5cbiAgICAvLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbiAgICB2YXIgbWF0Y2hXb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2k7XG5cbiAgICB2YXIgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbihzdGgpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzIzMjVcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBzdGggPT09ICdmdW5jdGlvbicgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0aCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUmVnZXhUb2tlbih0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gaXNGdW5jdGlvbihyZWdleCkgPyByZWdleCA6IGZ1bmN0aW9uIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzU3RyaWN0ICYmIHN0cmljdFJlZ2V4ID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykge1xuICAgICAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgnXFxcXCcsICcnKS5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgICAgICB9KS5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW5zID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRQYXJzZVRva2VuKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRva2VuID0gW3Rva2VuXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtjYWxsYmFja10gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuW2ldXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrUGFyc2VUb2tlbih0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgWUVBUiA9IDA7XG4gICAgdmFyIE1PTlRIID0gMTtcbiAgICB2YXIgREFURSA9IDI7XG4gICAgdmFyIEhPVVIgPSAzO1xuICAgIHZhciBNSU5VVEUgPSA0O1xuICAgIHZhciBTRUNPTkQgPSA1O1xuICAgIHZhciBNSUxMSVNFQ09ORCA9IDY7XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdNJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU0nLCBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHMgPSAnSmFudWFyeV9GZWJydWFyeV9NYXJjaF9BcHJpbF9NYXlfSnVuZV9KdWx5X0F1Z3VzdF9TZXB0ZW1iZXJfT2N0b2Jlcl9Ob3ZlbWJlcl9EZWNlbWJlcicuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHMobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NJyAmJiB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc2V0TW9udGgobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgb3V0IG9mIGhlcmUhXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0X3NldF9fZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGgoKSB7XG4gICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja092ZXJmbG93KG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICAgICAgaWYgKGEgJiYgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPSBhW01PTlRIXSA8IDAgfHwgYVtNT05USF0gPiAxMSA/IE1PTlRIIDogYVtEQVRFXSA8IDEgfHwgYVtEQVRFXSA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOiBhW0hPVVJdIDwgMCB8fCBhW0hPVVJdID4gMjQgfHwgYVtIT1VSXSA9PT0gMjQgJiYgKGFbTUlOVVRFXSAhPT0gMCB8fCBhW1NFQ09ORF0gIT09IDAgfHwgYVtNSUxMSVNFQ09ORF0gIT09IDApID8gSE9VUiA6IGFbTUlOVVRFXSA8IDAgfHwgYVtNSU5VVEVdID4gNTkgPyBNSU5VVEUgOiBhW1NFQ09ORF0gPCAwIHx8IGFbU0VDT05EXSA+IDU5ID8gU0VDT05EIDogYVtNSUxMSVNFQ09ORF0gPCAwIHx8IGFbTUlMTElTRUNPTkRdID4gOTk5ID8gTUlMTElTRUNPTkQgOiAtMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhcm4obXNnKSB7XG4gICAgICAgIGlmICh1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgd2Fybihtc2cgKyAnXFxuJyArIG5ldyBFcnJvcigpLnN0YWNrKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIHZhciBmcm9tX3N0cmluZ19faXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG4gICAgdmFyIGlzb0RhdGVzID0gW1snWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkezJ9LVxcZHsyfS9dLCBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZHsyfS1cXGR7Mn0vXSwgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGR7Mn0tXFxkL10sIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZHsyfS9dLCBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXV07XG5cbiAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgdmFyIGlzb1RpbWVzID0gW1snSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLCBbJ0hIOm1tOnNzJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSwgWydISDptbScsIC8oVHwgKVxcZFxcZDpcXGRcXGQvXSwgWydISCcsIC8oVHwgKVxcZFxcZC9dXTtcblxuICAgIHZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBzdHJpbmcgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBtYXRjaCA9IGZyb21fc3RyaW5nX19pc29SZWdleC5leGVjKHN0cmluZyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mID0gaXNvRGF0ZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzZdIHNob3VsZCBiZSAnVCcgb3Igc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IChtYXRjaFs2XSB8fCAnICcpICsgaXNvVGltZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHJpbmcubWF0Y2gobWF0Y2hPZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9mICs9ICdaJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGNvbmZpZy5faSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZSgnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgKyAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLCBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODEzNDgvaW5zdGFudGlhdGluZy1hLWphdmFzY3JpcHQtb2JqZWN0LWJ5LWNhbGxpbmctcHJvdG90eXBlLWNvbnN0cnVjdG9yLWFwcGx5XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vdGhlIGRhdGUgY29uc3RydWN0b3IgZG9lc24ndCBhY2NlcHQgeWVhcnMgPCAxOTcwXG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCA0XSwgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgNV0sIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWVlZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IGlucHV0Lmxlbmd0aCA9PT0gMiA/IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCkgOiB0b0ludChpbnB1dCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDAgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBnZXRJc0xlYXBZZWFyKCkge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3cnLCBbJ3d3JywgMl0sICd3bycsICd3ZWVrJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ1cnLCBbJ1dXJywgMl0sICdXbycsICdpc29XZWVrJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWsnLCAndycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2VlaycsICdXJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd3JywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsndycsICd3dycsICdXJywgJ1dXJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBsb2NhbF9fY3JlYXRlTG9jYWwobW9tKS5hZGQoZGF5c1RvRGF5T2ZXZWVrLCAnZCcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdzogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgIGRveTogNiAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZlllYXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRveTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLndlZWs7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignREREJywgWydEREREJywgM10sICdERERvJywgJ2RheU9mWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXlPZlllYXInLCAnREREJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEREQnLCBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciB3ZWVrMUphbiA9IDYgKyBmaXJzdERheU9mV2VlayAtIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyLFxuICAgICAgICAgICAgamFuWCA9IGNyZWF0ZVVUQ0RhdGUoeWVhciwgMCwgMSArIHdlZWsxSmFuKSxcbiAgICAgICAgICAgIGQgPSBqYW5YLmdldFVUQ0RheSgpLFxuICAgICAgICAgICAgZGF5T2ZZZWFyO1xuICAgICAgICBpZiAoZCA8IGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgICAgICBkICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICB3ZWVrZGF5ID0gd2Vla2RheSAhPSBudWxsID8gMSAqIHdlZWtkYXkgOiBmaXJzdERheU9mV2VlaztcblxuICAgICAgICBkYXlPZlllYXIgPSAxICsgd2VlazFKYW4gKyA3ICogKHdlZWsgLSAxKSAtIGQgKyB3ZWVrZGF5O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiBkYXlPZlllYXIgPiAwID8geWVhciA6IHllYXIgLSAxLFxuICAgICAgICAgICAgZGF5T2ZZZWFyOiBkYXlPZlllYXIgPiAwID8gZGF5T2ZZZWFyIDogZGF5c0luWWVhcih5ZWFyIC0gMSkgKyBkYXlPZlllYXJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZlllYXIoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheU9mWWVhciA9IE1hdGgucm91bmQoKHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKSAtIHRoaXMuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZChpbnB1dCAtIGRheU9mWWVhciwgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgICAgICByZXR1cm4gW25vdy5nZXRVVENGdWxsWWVhcigpLCBub3cuZ2V0VVRDTW9udGgoKSwgbm93LmdldFVUQ0RhdGUoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCldO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICBpbnB1dCA9IFtdLFxuICAgICAgICAgICAgY3VycmVudERhdGUsXG4gICAgICAgICAgICB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyKSB7XG4gICAgICAgICAgICB5ZWFyVG9Vc2UgPSBkZWZhdWx0cyhjb25maWcuX2FbWUVBUl0sIGN1cnJlbnREYXRlW1lFQVJdKTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyVG9Vc2UpKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjb25maWcuX2FbaV0gPT0gbnVsbCA/IGkgPT09IDIgPyAxIDogMCA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiYgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiYgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiYgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXA7XG5cbiAgICAgICAgdyA9IGNvbmZpZy5fdztcbiAgICAgICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZG93ID0gMTtcbiAgICAgICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LkdHLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvdyA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRvdztcbiAgICAgICAgICAgIGRveSA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRveTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LmdnLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKCksIGRvdywgZG95KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIDEpO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICsrd2VlaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZSArIGRvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3ksIGRvdyk7XG5cbiAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IHV0aWxzX2hvb2tzX19ob29rcy5JU09fODYwMSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgcGFyc2VkSW5wdXQsXG4gICAgICAgICAgICB0b2tlbnMsXG4gICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgcGFyc2VkSW5wdXQgPSAoc3RyaW5nLm1hdGNoKGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSkgfHwgW10pWzBdO1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkgKyBwYXJzZWRJbnB1dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggKz0gcGFyc2VkSW5wdXQubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3QgcGFyc2UgaWYgaXQncyBub3QgYSBrbm93biB0b2tlblxuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcuX3N0cmljdCAmJiAhcGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVtYWluaW5nIHVucGFyc2VkIGlucHV0IGxlbmd0aCB0byB0aGUgc3RyaW5nXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFyIF8xMmggZmxhZyBpZiBob3VyIGlzIDw9IDEyXG4gICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmIGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJiBjb25maWcuX2FbSE9VUl0gPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBtZXJpZGllbVxuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSBtZXJpZGllbUZpeFdyYXAoY29uZmlnLl9sb2NhbGUsIGNvbmZpZy5fYVtIT1VSXSwgY29uZmlnLl9tZXJpZGllbSk7XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZywgYmVzdE1vbWVudCwgc2NvcmVUb0JlYXQsIGksIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkX19pc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLmNoYXJzTGVmdE92ZXI7XG5cbiAgICAgICAgICAgIC8vb3IgdG9rZW5zXG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcoY29uZmlnKSB7XG4gICAgICAgIHZhciByZXMgPSBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3cocHJlcGFyZUNvbmZpZyhjb25maWcpKSk7XG4gICAgICAgIGlmIChyZXMuX25leHREYXkpIHtcbiAgICAgICAgICAgIC8vIEFkZGluZyBpcyBzbWFydCBlbm91Z2ggYXJvdW5kIERTVFxuICAgICAgICAgICAgcmVzLmFkZCgxLCAnZCcpO1xuICAgICAgICAgICAgcmVzLl9uZXh0RGF5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlQ29uZmlnKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbGlkX19jcmVhdGVJbnZhbGlkKHsgbnVsbElucHV0OiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gaW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxvY2FsZTtcbiAgICAgICAgICAgIGxvY2FsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgYy5fdXNlVVRDID0gYy5faXNVVEMgPSBpc1VUQztcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5faSA9IGlucHV0O1xuICAgICAgICBjLl9mID0gZm9ybWF0O1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZyb21Db25maWcoYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZU1pbiA9IGRlcHJlY2F0ZSgnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3RoZXIgPSBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICB9KTtcblxuICAgIHZhciBwcm90b3R5cGVNYXggPSBkZXByZWNhdGUoJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgfSk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIW1vbWVudHNbaV0uaXNWYWxpZCgpIHx8IG1vbWVudHNbaV1bZm5dKHJlcykpIHtcbiAgICAgICAgICAgICAgICByZXMgPSBtb21lbnRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIFtdLnNvcnQgaW5zdGVhZD9cbiAgICBmdW5jdGlvbiBtaW4oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF4KCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArIHNlY29uZHMgKiAxZTMgKyAvLyAxMDAwXG4gICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgaG91cnMgKiAzNmU1OyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgKyB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgKyBxdWFydGVycyAqIDMgKyB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG5cbiAgICAgICAgdGhpcy5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEdXJhdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldCh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH4gfihvZmZzZXQgLyA2MCksIDIpICsgc2VwYXJhdG9yICsgemVyb0ZpbGwofiB+b2Zmc2V0ICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgbWF0Y2hPZmZzZXQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hPZmZzZXQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydaJywgJ1paJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fdHptID0gb2Zmc2V0RnJvbVN0cmluZyhpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyB0aW1lem9uZSBjaHVua2VyXG4gICAgLy8gJysxMDowMCcgPiBbJzEwJywgICcwMCddXG4gICAgLy8gJy0xNTMwJyAgPiBbJy0xNScsICczMCddXG4gICAgdmFyIGNodW5rT2Zmc2V0ID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpO1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0RnJvbVN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSAoc3RyaW5nIHx8ICcnKS5tYXRjaChtYXRjaE9mZnNldCkgfHwgW107XG4gICAgICAgIHZhciBjaHVuayA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICAgICAgdmFyIHBhcnRzID0gKGNodW5rICsgJycpLm1hdGNoKGNodW5rT2Zmc2V0KSB8fCBbJy0nLCAwLCAwXTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSArKHBhcnRzWzFdICogNjApICsgdG9JbnQocGFydHNbMl0pO1xuXG4gICAgICAgIHJldHVybiBwYXJ0c1swXSA9PT0gJysnID8gbWludXRlcyA6IC1taW51dGVzO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG4gICAgZnVuY3Rpb24gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCBtb2RlbCkge1xuICAgICAgICB2YXIgcmVzLCBkaWZmO1xuICAgICAgICBpZiAobW9kZWwuX2lzVVRDKSB7XG4gICAgICAgICAgICByZXMgPSBtb2RlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZGlmZiA9IChpc01vbWVudChpbnB1dCkgfHwgaXNEYXRlKGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpKSAtICtyZXM7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZSgrcmVzLl9kICsgZGlmZik7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXRlT2Zmc2V0KG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgIC8vIGFmZmVjdGluZyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt1dGNPZmZzZXQoMiwgdHJ1ZSldLS0+XG4gICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCB3aXRoIG9mZnNldFxuICAgIC8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAvL1xuICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgIGZ1bmN0aW9uIGdldFNldE9mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBvZmZzZXRGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNikge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0IC0gb2Zmc2V0LCAnbScpLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0Wm9uZShpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IC1pbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoaW5wdXQsIGtlZXBMb2NhbFRpbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvVVRDKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwoa2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGdldERhdGVPZmZzZXQodGhpcyksICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLl90em0pIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChvZmZzZXRGcm9tU3RyaW5nKHRoaXMuX2kpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldChpbnB1dCkge1xuICAgICAgICBpbnB1dCA9IGlucHV0ID8gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS51dGNPZmZzZXQoKSA6IDA7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDApLnV0Y09mZnNldCgpIHx8IHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2lzRFNUU2hpZnRlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgICAgIGlmIChjLl9hKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhjLl9hKSA6IGxvY2FsX19jcmVhdGVMb2NhbChjLl9hKTtcbiAgICAgICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IHRoaXMuaXNWYWxpZCgpICYmIGNvbXBhcmVBcnJheXMoYy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0Y09mZnNldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgJiYgdGhpcy5fb2Zmc2V0ID09PSAwO1xuICAgIH1cblxuICAgIHZhciBhc3BOZXRSZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy87XG5cbiAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgIC8vIHNvbWV3aGF0IG1vcmUgaW4gbGluZSB3aXRoIDQuNC4zLjIgMjAwNCBzcGVjLCBidXQgYWxsb3dzIGRlY2ltYWwgYW55d2hlcmVcbiAgICB2YXIgY3JlYXRlX19pc29SZWdleCA9IC9eKC0pP1AoPzooPzooWzAtOSwuXSopWSk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilEKT8oPzpUKD86KFswLTksLl0qKUgpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopUyk/KT98KFswLTksLl0qKVcpJC87XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG5cbiAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtczogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNOiBpbnB1dC5fbW9udGhzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IG1hdGNoWzFdID09PSAnLScgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGNyZWF0ZV9faXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gbWF0Y2hbMV0gPT09ICctJyA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHk6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgZDogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGg6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBtOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgczogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHc6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiYgKCdmcm9tJyBpbiBkdXJhdGlvbiB8fCAndG8nIGluIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgZGlmZlJlcyA9IG1vbWVudHNEaWZmZXJlbmNlKGxvY2FsX19jcmVhdGVMb2NhbChkdXJhdGlvbi5mcm9tKSwgbG9jYWxfX2NyZWF0ZUxvY2FsKGR1cmF0aW9uLnRvKSk7XG5cbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBkdXJhdGlvbi5tcyA9IGRpZmZSZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgZHVyYXRpb24uTSA9IGRpZmZSZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0ID0gbmV3IER1cmF0aW9uKGR1cmF0aW9uKTtcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkgJiYgaGFzT3duUHJvcChpbnB1dCwgJ19sb2NhbGUnKSkge1xuICAgICAgICAgICAgcmV0Ll9sb2NhbGUgPSBpbnB1dC5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VJc28oaW5wLCBzaWduKSB7XG4gICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7IG1pbGxpc2Vjb25kczogMCwgbW9udGhzOiAwIH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgKyAob3RoZXIueWVhcigpIC0gYmFzZS55ZWFyKCkpICogMTI7XG4gICAgICAgIGlmIChiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykuaXNBZnRlcihvdGhlcikpIHtcbiAgICAgICAgICAgIC0tcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSArb3RoZXIgLSArYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSArICcocGVyaW9kLCBudW1iZXIpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgbW9tZW50KCkuJyArIG5hbWUgKyAnKG51bWJlciwgcGVyaW9kKS4nKTtcbiAgICAgICAgICAgICAgICB0bXAgPSB2YWw7dmFsID0gcGVyaW9kO3BlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QobW9tLCBkdXJhdGlvbiwgaXNBZGRpbmcsIHVwZGF0ZU9mZnNldCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gZHVyYXRpb24uX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGRheXMgPSBkdXJhdGlvbi5fZGF5cyxcbiAgICAgICAgICAgIG1vbnRocyA9IGR1cmF0aW9uLl9tb250aHM7XG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZSgrbW9tLl9kICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBnZXRfc2V0X19zZXQobW9tLCAnRGF0ZScsIGdldF9zZXRfX2dldChtb20sICdEYXRlJykgKyBkYXlzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKG1vbSwgZ2V0X3NldF9fZ2V0KG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZU9mZnNldCkge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhZGRfc3VidHJhY3RfX2FkZCA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbiAgICB2YXIgYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuICAgIGZ1bmN0aW9uIG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXIodGltZSwgZm9ybWF0cykge1xuICAgICAgICAvLyBXZSB3YW50IHRvIGNvbXBhcmUgdGhlIHN0YXJ0IG9mIHRvZGF5LCB2cyB0aGlzLlxuICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSBsb2NhbC91dGMvb2Zmc2V0IG9yIG5vdC5cbiAgICAgICAgdmFyIG5vdyA9IHRpbWUgfHwgbG9jYWxfX2NyZWF0ZUxvY2FsKCksXG4gICAgICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgIGRpZmYgPSB0aGlzLmRpZmYoc29kLCAnZGF5cycsIHRydWUpLFxuICAgICAgICAgICAgZm9ybWF0ID0gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6IGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOiBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6IGRpZmYgPCAxID8gJ3NhbWVEYXknIDogZGlmZiA8IDIgPyAnbmV4dERheScgOiBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoZm9ybWF0cyAmJiBmb3JtYXRzW2Zvcm1hdF0gfHwgdGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBsb2NhbF9fY3JlYXRlTG9jYWwobm93KSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA+ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dE1zIDwgK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmVmb3JlKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA8ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSA8IGlucHV0TXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JldHdlZW4oZnJvbSwgdG8sIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQWZ0ZXIoZnJvbSwgdW5pdHMpICYmIHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzIHx8ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzID09PSAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSA8PSBpbnB1dE1zICYmIGlucHV0TXMgPD0gK3RoaXMuY2xvbmUoKS5lbmRPZih1bml0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaWZmKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgICAgICB2YXIgdGhhdCA9IGNsb25lV2l0aE9mZnNldChpbnB1dCwgdGhpcyksXG4gICAgICAgICAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0LFxuICAgICAgICAgICAgZGVsdGEsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAneWVhcicgfHwgdW5pdHMgPT09ICdtb250aCcgfHwgdW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAzO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWx0YSA9IHRoaXMgLSB0aGF0O1xuICAgICAgICAgICAgb3V0cHV0ID0gdW5pdHMgPT09ICdzZWNvbmQnID8gZGVsdGEgLyAxZTMgOiAvLyAxMDAwXG4gICAgICAgICAgICB1bml0cyA9PT0gJ21pbnV0ZScgPyBkZWx0YSAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgdW5pdHMgPT09ICdob3VyJyA/IGRlbHRhIC8gMzZlNSA6IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICB1bml0cyA9PT0gJ2RheScgPyAoZGVsdGEgLSB6b25lRGVsdGEpIC8gODY0ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDYwNDhlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic0Zsb29yKG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhEaWZmKGEsIGIpIHtcbiAgICAgICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICAgICAgdmFyIHdob2xlTW9udGhEaWZmID0gKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIgKyAoYi5tb250aCgpIC0gYS5tb250aCgpKSxcblxuICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICBhbmNob3IgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmLCAnbW9udGhzJyksXG4gICAgICAgICAgICBhbmNob3IyLFxuICAgICAgICAgICAgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmcoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcy5jbG9uZSgpLnV0YygpO1xuICAgICAgICBpZiAoMCA8IG0ueWVhcigpICYmIG0ueWVhcigpIDw9IDk5OTkpIHtcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0KGlucHV0U3RyaW5nKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20odGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih7IHRvOiB0aGlzLCBmcm9tOiB0aW1lIH0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbU5vdyh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb20obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oeyBmcm9tOiB0aGlzLCB0bzogdGltZSB9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvTm93KHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZShrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBuZXdMb2NhbGVEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZURhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZih1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgICAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2YodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXRzKS5hZGQoMSwgdW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b190eXBlX192YWx1ZU9mKCkge1xuICAgICAgICByZXR1cm4gK3RoaXMuX2QgLSAodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoK3RoaXMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXJzOiBtLnllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoczogbS5tb250aCgpLFxuICAgICAgICAgICAgZGF0ZTogbS5kYXRlKCksXG4gICAgICAgICAgICBob3VyczogbS5ob3VycygpLFxuICAgICAgICAgICAgbWludXRlczogbS5taW51dGVzKCksXG4gICAgICAgICAgICBzZWNvbmRzOiBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kczogbS5taWxsaXNlY29uZHMoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF92YWxpZF9faXNWYWxpZCgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkX19pc1ZhbGlkKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQoKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzaW5nRmxhZ3ModGhpcykub3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4odG9rZW4sIGdldHRlcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIHRva2VuLmxlbmd0aF0sIDAsIGdldHRlcik7XG4gICAgfVxuXG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZycsICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICdpc29XZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRycsIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0cnLCBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2dnZycsICdnZ2dnZycsICdHR0dHJywgJ0dHR0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAyKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnJywgJ0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiB3ZWVrc0luWWVhcih5ZWFyLCBkb3csIGRveSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoW3llYXIsIDExLCAzMSArIGRvdyAtIGRveV0pLCBkb3csIGRveSkud2VlaztcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrWWVhcihpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3kpLnllYXI7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKGlucHV0IC0geWVhciwgJ3knKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhcihpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoaW5wdXQgLSB5ZWFyLCAneScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldElTT1dlZWtzSW5ZZWFyKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAwLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IGxvY2FsZS5fb3JkaW5hbFBhcnNlIDogbG9jYWxlLl9vcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG4gICAgYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdkJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdlJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdFJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZCcsIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkJywgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgbWF0Y2hXb3JkKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXMgPSAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXMobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0KG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbiA9ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbihtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSB0aGlzLl93ZWVrZGF5c1BhcnNlIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgbW9tID0gbG9jYWxfX2NyZWF0ZUxvY2FsKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZldlZWsoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayhpbnB1dCkge1xuICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPRGF5T2ZXZWVrKGlucHV0KSB7XG4gICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHRoaXMuZGF5KCkgfHwgNyA6IHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gaW5wdXQgOiBpbnB1dCAtIDcpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdIJywgWydISCcsIDJdLCAwLCAnaG91cicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdoJywgWydoaCcsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGZ1bmN0aW9uIG1hdGNoTWVyaWRpZW0oaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdBJywgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignSCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignSEgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignaGgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnSCcsICdISCddLCBIT1VSKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnYScsICdBJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgY29uZmlnLl9tZXJpZGllbSA9IGlucHV0O1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oWydoJywgJ2hoJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVJc1BNKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UgPSAvW2FwXVxcLj9tP1xcLj8vaTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNZXJpZGllbShob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbiAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciBoZSB3YW50cy4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4gICAgLy8gdGhpcyBydWxlLlxuICAgIHZhciBnZXRTZXRIb3VyID0gbWFrZUdldFNldCgnSG91cnMnLCB0cnVlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdtJywgWydtbScsIDJdLCAwLCAnbWludXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21pbnV0ZScsICdtJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdtJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigncycsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+IH4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfiB+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTJywgM10sIDAsICdtaWxsaXNlY29uZCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTUycsIDRdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTJywgNV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTUycsIDZdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTUycsIDddLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTJywgOF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTUycsIDldLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDAwO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsIG1hdGNoMXRvMywgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdTU1MnLCBtYXRjaDF0bzMsIG1hdGNoMyk7XG5cbiAgICB2YXIgdG9rZW47XG4gICAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH1cblxuICAgIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG4gICAgfVxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJicigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ1VUQycgOiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRab25lTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm90b3R5cGVfX3Byb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uYWRkID0gYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jYWxlbmRhciA9IG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jbG9uZSA9IGNsb25lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGlmZiA9IGRpZmY7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5lbmRPZiA9IGVuZE9mO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZm9ybWF0ID0gZm9ybWF0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZnJvbSA9IGZyb207XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tTm93ID0gZnJvbU5vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvID0gdG87XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b05vdyA9IHRvTm93O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZ2V0ID0gZ2V0U2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaW52YWxpZEF0ID0gaW52YWxpZEF0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNBZnRlciA9IGlzQWZ0ZXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JlZm9yZSA9IGlzQmVmb3JlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNCZXR3ZWVuID0gaXNCZXR3ZWVuO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNTYW1lID0gaXNTYW1lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNWYWxpZCA9IG1vbWVudF92YWxpZF9faXNWYWxpZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxhbmcgPSBsYW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlID0gbG9jYWxlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSA9IGxvY2FsZURhdGE7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tYXggPSBwcm90b3R5cGVNYXg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW4gPSBwcm90b3R5cGVNaW47XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5wYXJzaW5nRmxhZ3MgPSBwYXJzaW5nRmxhZ3M7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zZXQgPSBnZXRTZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zdGFydE9mID0gc3RhcnRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ID0gYWRkX3N1YnRyYWN0X19zdWJ0cmFjdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvQXJyYXkgPSB0b0FycmF5O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9PYmplY3QgPSB0b09iamVjdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvRGF0ZSA9IHRvRGF0ZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0pTT04gPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51bml4ID0gdW5peDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgPSB0b190eXBlX192YWx1ZU9mO1xuXG4gICAgLy8gWWVhclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ueWVhciA9IGdldFNldFllYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0xlYXBZZWFyID0gZ2V0SXNMZWFwWWVhcjtcblxuICAgIC8vIFdlZWsgWWVhclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla1llYXIgPSBnZXRTZXRXZWVrWWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtZZWFyID0gZ2V0U2V0SVNPV2Vla1llYXI7XG5cbiAgICAvLyBRdWFydGVyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5xdWFydGVyID0gbW9tZW50UHJvdG90eXBlX19wcm90by5xdWFydGVycyA9IGdldFNldFF1YXJ0ZXI7XG5cbiAgICAvLyBNb250aFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubW9udGggPSBnZXRTZXRNb250aDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGg7XG5cbiAgICAvLyBXZWVrXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrID0gbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrcyA9IGdldFNldFdlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrID0gbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrcyA9IGdldFNldElTT1dlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrc0luWWVhciA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcblxuICAgIC8vIERheVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZSA9IGdldFNldERheU9mTW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXkgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheXMgPSBnZXRTZXREYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrZGF5ID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla2RheSA9IGdldFNldElTT0RheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheU9mWWVhciA9IGdldFNldERheU9mWWVhcjtcblxuICAgIC8vIEhvdXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhvdXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcblxuICAgIC8vIE1pbnV0ZVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWludXRlID0gbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xuXG4gICAgLy8gU2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zZWNvbmQgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG5cbiAgICAvLyBNaWxsaXNlY29uZFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmQgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kcyA9IGdldFNldE1pbGxpc2Vjb25kO1xuXG4gICAgLy8gT2Zmc2V0XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51dGNPZmZzZXQgPSBnZXRTZXRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51dGMgPSBzZXRPZmZzZXRUb1VUQztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNlWm9uZSA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaGFzQWxpZ25lZEhvdXJPZmZzZXQgPSBoYXNBbGlnbmVkSG91ck9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUID0gaXNEYXlsaWdodFNhdmluZ1RpbWU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0RTVFNoaWZ0ZWQgPSBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0xvY2FsID0gaXNMb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjT2Zmc2V0ID0gaXNVdGNPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1V0YyA9IGlzVXRjO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVVEMgPSBpc1V0YztcblxuICAgIC8vIFRpbWV6b25lXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZU5hbWUgPSBnZXRab25lTmFtZTtcblxuICAgIC8vIERlcHJlY2F0aW9uc1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZXMgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgZ2V0U2V0RGF5T2ZNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXJzID0gZGVwcmVjYXRlKCd5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkJywgZ2V0U2V0WWVhcik7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lID0gZGVwcmVjYXRlKCdtb21lbnQoKS56b25lIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQoKS51dGNPZmZzZXQgaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE3NzknLCBnZXRTZXRab25lKTtcblxuICAgIHZhciBtb21lbnRQcm90b3R5cGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVVbml4KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfX2NyZWF0ZUluWm9uZSgpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0Q2FsZW5kYXIgPSB7XG4gICAgICAgIHNhbWVEYXk6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgbmV4dERheTogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgICAgICBuZXh0V2VlazogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgIGxhc3REYXk6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgIGxhc3RXZWVrOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgICAgIHNhbWVFbHNlOiAnTCdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlX2NhbGVuZGFyX19jYWxlbmRhcihrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgICAgICBMVFM6ICdoOm1tOnNzIEEnLFxuICAgICAgICBMVDogJ2g6bW0gQScsXG4gICAgICAgIEw6ICdNTS9ERC9ZWVlZJyxcbiAgICAgICAgTEw6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICBMTEw6ICdNTU1NIEQsIFlZWVkgaDptbSBBJyxcbiAgICAgICAgTExMTDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBoOm1tIEEnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvbmdEYXRlRm9ybWF0KGtleSkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSxcbiAgICAgICAgICAgIGZvcm1hdFVwcGVyID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChmb3JtYXQgfHwgIWZvcm1hdFVwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IGZvcm1hdFVwcGVyLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCc7XG4gICAgdmFyIGRlZmF1bHRPcmRpbmFsUGFyc2UgPSAvXFxkezEsMn0vO1xuXG4gICAgZnVuY3Rpb24gb3JkaW5hbChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFJlbGF0aXZlVGltZSA9IHtcbiAgICAgICAgZnV0dXJlOiAnaW4gJXMnLFxuICAgICAgICBwYXN0OiAnJXMgYWdvJyxcbiAgICAgICAgczogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICBtOiAnYSBtaW51dGUnLFxuICAgICAgICBtbTogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoOiAnYW4gaG91cicsXG4gICAgICAgIGhoOiAnJWQgaG91cnMnLFxuICAgICAgICBkOiAnYSBkYXknLFxuICAgICAgICBkZDogJyVkIGRheXMnLFxuICAgICAgICBNOiAnYSBtb250aCcsXG4gICAgICAgIE1NOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeTogJ2EgeWVhcicsXG4gICAgICAgIHl5OiAnJWQgeWVhcnMnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlX19yZWxhdGl2ZVRpbWUobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSA6IG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfc2V0X19zZXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBwcm9wLCBpO1xuICAgICAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBwcm9wID0gY29uZmlnW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9vcmRpbmFsUGFyc2VMZW5pZW50LlxuICAgICAgICB0aGlzLl9vcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cCh0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlICsgJ3wnICsgL1xcZHsxLDJ9Ly5zb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVfX3Byb3RvID0gTG9jYWxlLnByb3RvdHlwZTtcblxuICAgIHByb3RvdHlwZV9fcHJvdG8uX2NhbGVuZGFyID0gZGVmYXVsdENhbGVuZGFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uY2FsZW5kYXIgPSBsb2NhbGVfY2FsZW5kYXJfX2NhbGVuZGFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX2xvbmdEYXRlRm9ybWF0ID0gZGVmYXVsdExvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubG9uZ0RhdGVGb3JtYXQgPSBsb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9pbnZhbGlkRGF0ZSA9IGRlZmF1bHRJbnZhbGlkRGF0ZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmludmFsaWREYXRlID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbCA9IGRlZmF1bHRPcmRpbmFsO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ub3JkaW5hbCA9IG9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbFBhcnNlID0gZGVmYXVsdE9yZGluYWxQYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnByZXBhcnNlID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucG9zdGZvcm1hdCA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9yZWxhdGl2ZVRpbWUgPSBkZWZhdWx0UmVsYXRpdmVUaW1lO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucmVsYXRpdmVUaW1lID0gcmVsYXRpdmVfX3JlbGF0aXZlVGltZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnBhc3RGdXR1cmUgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uc2V0ID0gbG9jYWxlX3NldF9fc2V0O1xuXG4gICAgLy8gTW9udGhcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRocyA9IGxvY2FsZU1vbnRocztcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHMgPSBkZWZhdWx0TG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzU2hvcnQgPSBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHNTaG9ydCA9IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1BhcnNlID0gbG9jYWxlTW9udGhzUGFyc2U7XG5cbiAgICAvLyBXZWVrXG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrID0gbG9jYWxlV2VlaztcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrID0gZGVmYXVsdExvY2FsZVdlZWs7XG4gICAgcHJvdG90eXBlX19wcm90by5maXJzdERheU9mWWVhciA9IGxvY2FsZUZpcnN0RGF5T2ZZZWFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uZmlyc3REYXlPZldlZWsgPSBsb2NhbGVGaXJzdERheU9mV2VlaztcblxuICAgIC8vIERheSBvZiBXZWVrXG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5cyA9IGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNNaW4gPSBsb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c01pbiA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzU2hvcnQgPSBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzU2hvcnQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzUGFyc2UgPSBsb2NhbGVXZWVrZGF5c1BhcnNlO1xuXG4gICAgLy8gSG91cnNcbiAgICBwcm90b3R5cGVfX3Byb3RvLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21lcmlkaWVtUGFyc2UgPSBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fZ2V0KGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoKTtcbiAgICAgICAgdmFyIHV0YyA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3QoZm9ybWF0LCBpbmRleCwgZmllbGQsIGNvdW50LCBzZXR0ZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcblxuICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3RzX19nZXQoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gbGlzdHNfX2dldChmb3JtYXQsIGksIGZpZWxkLCBzZXR0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RNb250aHMoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzJywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzU2hvcnQoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5cyhmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5cycsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzU2hvcnQoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzTWluKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBvcmRpbmFsUGFyc2U6IC9cXGR7MSwyfSh0aHxzdHxuZHxyZCkvLFxuICAgICAgICBvcmRpbmFsOiBmdW5jdGlvbiBvcmRpbmFsKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEgPyAndGgnIDogYiA9PT0gMSA/ICdzdCcgOiBiID09PSAyID8gJ25kJyA6IGIgPT09IDMgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKTtcblxuICAgIHZhciBtYXRoQWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hYnNfX2FicygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9IG1hdGhBYnModGhpcy5fbWlsbGlzZWNvbmRzKTtcbiAgICAgICAgdGhpcy5fZGF5cyA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1hdGhBYnMoZGF0YS5taWxsaXNlY29uZHMpO1xuICAgICAgICBkYXRhLnNlY29uZHMgPSBtYXRoQWJzKGRhdGEuc2Vjb25kcyk7XG4gICAgICAgIGRhdGEubWludXRlcyA9IG1hdGhBYnMoZGF0YS5taW51dGVzKTtcbiAgICAgICAgZGF0YS5ob3VycyA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzID0gbWF0aEFicyhkYXRhLm1vbnRocyk7XG4gICAgICAgIGRhdGEueWVhcnMgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QoZHVyYXRpb24sIGlucHV0LCB2YWx1ZSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oaW5wdXQsIHZhbHVlKTtcblxuICAgICAgICBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgIGR1cmF0aW9uLl9kYXlzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9kYXlzO1xuICAgICAgICBkdXJhdGlvbi5fbW9udGhzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9tb250aHM7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGlucHV0LCB2YWx1ZSwgMSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgc3VidHJhY3QoMSwgJ3MnKSBvciBzdWJ0cmFjdChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX3N1YnRyYWN0KGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNDZWlsKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1YmJsZSgpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICAgICAgdmFyIGRheXMgPSB0aGlzLl9kYXlzO1xuICAgICAgICB2YXIgbW9udGhzID0gdGhpcy5fbW9udGhzO1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMsIG1vbnRoc0Zyb21EYXlzO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtaXggb2YgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcywgYnViYmxlIGRvd24gZmlyc3RcbiAgICAgICAgLy8gY2hlY2s6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMTY2XG4gICAgICAgIGlmICghKG1pbGxpc2Vjb25kcyA+PSAwICYmIGRheXMgPj0gMCAmJiBtb250aHMgPj0gMCB8fCBtaWxsaXNlY29uZHMgPD0gMCAmJiBkYXlzIDw9IDAgJiYgbW9udGhzIDw9IDApKSB7XG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgICAgIHNlY29uZHMgPSBhYnNGbG9vcihtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIG1pbnV0ZXMgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgaG91cnMgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBkYXRhLmhvdXJzID0gaG91cnMgJSAyNDtcblxuICAgICAgICBkYXlzICs9IGFic0Zsb29yKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgZGF5cyB0byBtb250aHNcbiAgICAgICAgbW9udGhzRnJvbURheXMgPSBhYnNGbG9vcihkYXlzVG9Nb250aHMoZGF5cykpO1xuICAgICAgICBtb250aHMgKz0gbW9udGhzRnJvbURheXM7XG4gICAgICAgIGRheXMgLT0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzRnJvbURheXMpKTtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgZGF0YS5kYXlzID0gZGF5cztcbiAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgIGRhdGEueWVhcnMgPSB5ZWFycztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzVG9Nb250aHMoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDEyIG1vbnRocyA9PT0gNDgwMFxuICAgICAgICByZXR1cm4gZGF5cyAqIDQ4MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhzVG9EYXlzKG1vbnRocykge1xuICAgICAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICAgICAgcmV0dXJuIG1vbnRocyAqIDE0NjA5NyAvIDQ4MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXModW5pdHMpIHtcbiAgICAgICAgdmFyIGRheXM7XG4gICAgICAgIHZhciBtb250aHM7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMgKyBkYXlzVG9Nb250aHMoZGF5cyk7XG4gICAgICAgICAgICByZXR1cm4gdW5pdHMgPT09ICdtb250aCcgPyBtb250aHMgOiBtb250aHMgLyAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgTWF0aC5yb3VuZChtb250aHNUb0RheXModGhpcy5fbW9udGhzKSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXlzIC8gNyArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5cyArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5cyAqIDI0ICsgbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5cyAqIDE0NDAgKyBtaWxsaXNlY29uZHMgLyA2ZTQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRheXMgKiA4NjQwMCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogODY0ZTUpICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hc19fdmFsdWVPZigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbGxpc2Vjb25kcyArIHRoaXMuX2RheXMgKiA4NjRlNSArIHRoaXMuX21vbnRocyAlIDEyICogMjU5MmU2ICsgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlQXMoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG4gICAgdmFyIGFzU2Vjb25kcyA9IG1ha2VBcygncycpO1xuICAgIHZhciBhc01pbnV0ZXMgPSBtYWtlQXMoJ20nKTtcbiAgICB2YXIgYXNIb3VycyA9IG1ha2VBcygnaCcpO1xuICAgIHZhciBhc0RheXMgPSBtYWtlQXMoJ2QnKTtcbiAgICB2YXIgYXNXZWVrcyA9IG1ha2VBcygndycpO1xuICAgIHZhciBhc01vbnRocyA9IG1ha2VBcygnTScpO1xuICAgIHZhciBhc1llYXJzID0gbWFrZUFzKCd5Jyk7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9nZXRfX2dldCh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHMgKyAncyddKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldHRlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyk7XG4gICAgdmFyIHNlY29uZHMgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG4gICAgdmFyIG1pbnV0ZXMgPSBtYWtlR2V0dGVyKCdtaW51dGVzJyk7XG4gICAgdmFyIGhvdXJzID0gbWFrZUdldHRlcignaG91cnMnKTtcbiAgICB2YXIgZGF5cyA9IG1ha2VHZXR0ZXIoJ2RheXMnKTtcbiAgICB2YXIgbW9udGhzID0gbWFrZUdldHRlcignbW9udGhzJyk7XG4gICAgdmFyIHllYXJzID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzKCkge1xuICAgICAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbiAgICB9XG5cbiAgICB2YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xuICAgIHZhciB0aHJlc2hvbGRzID0ge1xuICAgICAgICBzOiA0NSwgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbTogNDUsIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBoOiAyMiwgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGQ6IDI2LCAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIE06IDExIC8vIG1vbnRocyB0byB5ZWFyXG4gICAgfTtcblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25faHVtYW5pemVfX3JlbGF0aXZlVGltZShwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgICAgICB2YXIgc2Vjb25kcyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdzJykpO1xuICAgICAgICB2YXIgbWludXRlcyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpO1xuICAgICAgICB2YXIgaG91cnMgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKTtcbiAgICAgICAgdmFyIGRheXMgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICAgICAgdmFyIG1vbnRocyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpO1xuICAgICAgICB2YXIgeWVhcnMgPSByb3VuZChkdXJhdGlvbi5hcygneScpKTtcblxuICAgICAgICB2YXIgYSA9IHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgJiYgWydzJywgc2Vjb25kc10gfHwgbWludXRlcyA9PT0gMSAmJiBbJ20nXSB8fCBtaW51dGVzIDwgdGhyZXNob2xkcy5tICYmIFsnbW0nLCBtaW51dGVzXSB8fCBob3VycyA9PT0gMSAmJiBbJ2gnXSB8fCBob3VycyA8IHRocmVzaG9sZHMuaCAmJiBbJ2hoJywgaG91cnNdIHx8IGRheXMgPT09IDEgJiYgWydkJ10gfHwgZGF5cyA8IHRocmVzaG9sZHMuZCAmJiBbJ2RkJywgZGF5c10gfHwgbW9udGhzID09PSAxICYmIFsnTSddIHx8IG1vbnRocyA8IHRocmVzaG9sZHMuTSAmJiBbJ01NJywgbW9udGhzXSB8fCB5ZWFycyA9PT0gMSAmJiBbJ3knXSB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgICAgIGFbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICAgICAgYVs0XSA9IGxvY2FsZTtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KG51bGwsIGEpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19nZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQodGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgICBpZiAodGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICAgICAgfVxuICAgICAgICB0aHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHVtYW5pemUod2l0aFN1ZmZpeCkge1xuICAgICAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBpc29fc3RyaW5nX19hYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nKCkge1xuICAgICAgICAvLyBmb3IgSVNPIHN0cmluZ3Mgd2UgZG8gbm90IHVzZSB0aGUgbm9ybWFsIGJ1YmJsaW5nIHJ1bGVzOlxuICAgICAgICAvLyAgKiBtaWxsaXNlY29uZHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIGhvdXJzXG4gICAgICAgIC8vICAqIGRheXMgZG8gbm90IGJ1YmJsZSBhdCBhbGxcbiAgICAgICAgLy8gICogbW9udGhzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSB5ZWFyc1xuICAgICAgICAvLyBUaGlzIGlzIGJlY2F1c2UgdGhlcmUgaXMgbm8gY29udGV4dC1mcmVlIGNvbnZlcnNpb24gYmV0d2VlbiBob3VycyBhbmQgZGF5c1xuICAgICAgICAvLyAodGhpbmsgb2YgY2xvY2sgY2hhbmdlcylcbiAgICAgICAgLy8gYW5kIGFsc28gbm90IGJldHdlZW4gZGF5cyBhbmQgbW9udGhzICgyOC0zMSBkYXlzIHBlciBtb250aClcbiAgICAgICAgdmFyIHNlY29uZHMgPSBpc29fc3RyaW5nX19hYnModGhpcy5fbWlsbGlzZWNvbmRzKSAvIDEwMDA7XG4gICAgICAgIHZhciBkYXlzID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB2YXIgbW9udGhzID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuX21vbnRocyk7XG4gICAgICAgIHZhciBtaW51dGVzLCBob3VycywgeWVhcnM7XG5cbiAgICAgICAgLy8gMzYwMCBzZWNvbmRzIC0+IDYwIG1pbnV0ZXMgLT4gMSBob3VyXG4gICAgICAgIG1pbnV0ZXMgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBob3VycyA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIHNlY29uZHMgJT0gNjA7XG4gICAgICAgIG1pbnV0ZXMgJT0gNjA7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgICAgIHZhciBZID0geWVhcnM7XG4gICAgICAgIHZhciBNID0gbW9udGhzO1xuICAgICAgICB2YXIgRCA9IGRheXM7XG4gICAgICAgIHZhciBoID0gaG91cnM7XG4gICAgICAgIHZhciBtID0gbWludXRlcztcbiAgICAgICAgdmFyIHMgPSBzZWNvbmRzO1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodG90YWwgPCAwID8gJy0nIDogJycpICsgJ1AnICsgKFkgPyBZICsgJ1knIDogJycpICsgKE0gPyBNICsgJ00nIDogJycpICsgKEQgPyBEICsgJ0QnIDogJycpICsgKGggfHwgbSB8fCBzID8gJ1QnIDogJycpICsgKGggPyBoICsgJ0gnIDogJycpICsgKG0gPyBtICsgJ00nIDogJycpICsgKHMgPyBzICsgJ1MnIDogJycpO1xuICAgIH1cblxuICAgIHZhciBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hYnMgPSBkdXJhdGlvbl9hYnNfX2FicztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFkZCA9IGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uc3VidHJhY3QgPSBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX3N1YnRyYWN0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXMgPSBhcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTWlsbGlzZWNvbmRzID0gYXNNaWxsaXNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1NlY29uZHMgPSBhc1NlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbnV0ZXMgPSBhc01pbnV0ZXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0hvdXJzID0gYXNIb3VycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzRGF5cyA9IGFzRGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzV2Vla3MgPSBhc1dlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNb250aHMgPSBhc01vbnRocztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzWWVhcnMgPSBhc1llYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udmFsdWVPZiA9IGR1cmF0aW9uX2FzX192YWx1ZU9mO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uX2J1YmJsZSA9IGJ1YmJsZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmdldCA9IGR1cmF0aW9uX2dldF9fZ2V0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyA9IHNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5taW51dGVzID0gbWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmhvdXJzID0gaG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5kYXlzID0gZGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLndlZWtzID0gd2Vla3M7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5tb250aHMgPSBtb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by55ZWFycyA9IHllYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaHVtYW5pemUgPSBodW1hbml6ZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b1N0cmluZyA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9KU09OID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sb2NhbGUgPSBsb2NhbGU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sb2NhbGVEYXRhID0gbG9jYWxlRGF0YTtcblxuICAgIC8vIERlcHJlY2F0aW9uc1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9Jc29TdHJpbmcgPSBkZXByZWNhdGUoJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJywgaXNvX3N0cmluZ19fdG9JU09TdHJpbmcpO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubGFuZyA9IGxhbmc7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbiAgICBhZGRGb3JtYXRUb2tlbignWCcsIDAsIDAsICd1bml4Jyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3gnLCAwLCAwLCAndmFsdWVPZicpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigneCcsIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdYJywgbWF0Y2hUaW1lc3RhbXApO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUocGFyc2VGbG9hdChpbnB1dCwgMTApICogMTAwMCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbigneCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSh0b0ludChpbnB1dCkpO1xuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnZlcnNpb24gPSAnMi4xMC42JztcblxuICAgIHNldEhvb2tDYWxsYmFjayhsb2NhbF9fY3JlYXRlTG9jYWwpO1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmZuID0gbW9tZW50UHJvdG90eXBlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5taW4gPSBtaW47XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1heCA9IG1heDtcbiAgICB1dGlsc19ob29rc19faG9va3MudXRjID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51bml4ID0gbW9tZW50X19jcmVhdGVVbml4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tb250aHMgPSBsaXN0c19fbGlzdE1vbnRocztcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEYXRlID0gaXNEYXRlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pbnZhbGlkID0gdmFsaWRfX2NyZWF0ZUludmFsaWQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmR1cmF0aW9uID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNNb21lbnQgPSBpc01vbWVudDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXMgPSBsaXN0c19fbGlzdFdlZWtkYXlzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVpvbmUgPSBtb21lbnRfX2NyZWF0ZUluWm9uZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlRGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRHVyYXRpb24gPSBpc0R1cmF0aW9uO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tb250aHNTaG9ydCA9IGxpc3RzX19saXN0TW9udGhzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzTWluID0gbGlzdHNfX2xpc3RXZWVrZGF5c01pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmaW5lTG9jYWxlID0gZGVmaW5lTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c1Nob3J0ID0gbGlzdHNfX2xpc3RXZWVrZGF5c1Nob3J0O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5ub3JtYWxpemVVbml0cyA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuXG4gICAgdmFyIF9tb21lbnQgPSB1dGlsc19ob29rc19faG9va3M7XG5cbiAgICByZXR1cm4gX21vbWVudDtcbn0pO1xuLy8hIG1vbWVudGpzLmNvbVxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGYwMzhmQ2o1OU5GYnRKekFvN1ZuL1QnLCAncGF1c2VWaWV3Jyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXHBhdXNlVmlldy5qc1xuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL0RldmljZScpO1xudmFyIG1haW5jZmcgPSByZXF1aXJlKCcuLi9jb21tb24vbWFpbmNmZycpO1xudmFyIGFuYWx5dGljcyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9hbmFseXRpY3MnKTtcbnZhciBCYWNrVmlldyA9IHJlcXVpcmUoJy4vQmFja1ZpZXcnKTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZTE6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBndWlkZTI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBndWlkZTM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGJ0bjE6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBidG4yOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgYnRuMzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGxnbm9kZTogY2MuTm9kZVxuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXG4gICAgICAgICAgICBvblRvdWNoQmVnYW46IGZ1bmN0aW9uIG9uVG91Y2hCZWdhbih0b3VjaGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uSW1tZWRpYXRlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Ub3VjaE1vdmVkOiBmdW5jdGlvbiBvblRvdWNoTW92ZWQoKSB7fSxcbiAgICAgICAgICAgIG9uVG91Y2hFbmRlZDogZnVuY3Rpb24gb25Ub3VjaEVuZGVkKCkge30sXG4gICAgICAgICAgICBvblRvdWNoQ2FuY2VsbGVkOiBmdW5jdGlvbiBvblRvdWNoQ2FuY2VsbGVkKCkge31cbiAgICAgICAgfTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzLm5vZGUpO1xuXG4gICAgICAgIHRoaXMuZ3VpZGUxLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3VpZGUyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3VpZGUzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgLy9jYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwYXVzZXZpZXdcIiwgSlNPTi5zdHJpbmdpZnkoe3Bjb2RlOjF9KSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vaWYoIG1haW5jZmcucGF1c2V2aWV3ID09IDAgKVxuICAgICAgICAvL3tcbiAgICAgICAgLy8gICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGF1c2V2aWV3XCIsIEpTT04uc3RyaW5naWZ5KHtwY29kZToxfSkpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB0aGlzLmd1aWRlMS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIC8vICAgIHRoaXMuZGxnbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgbWFpbmNmZy5wYXVzZXZpZXcgPTE7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIHZhciBzdHIgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwYXVzZXZpZXdfa2V5XCIpIHx8ICd7fSc7XG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShzdHIpO1xuICAgICAgICB2YXIgcmV2ID0ge307XG4gICAgICAgIHJldi5wY29kZSA9IGRhdGEucGNvZGU7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldi5wY29kZSk7XG4gICAgICAgIGlmIChyZXYucGNvZGUgPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJldi5wY29kZSk7XG4gICAgICAgICAgICAvL+esrOS4gOasoVxuICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGF1c2V2aWV3X2tleVwiLCBKU09OLnN0cmluZ2lmeSh7IHBjb2RlOiAxIH0pKTtcbiAgICAgICAgICAgIHRoaXMuZ3VpZGUxLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vdGhpcy5idG4xLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAvL3RoaXMuYnRuMi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy90aGlzLmJ0bjMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0R2FtZUtleTogZnVuY3Rpb24gc2V0R2FtZUtleShnYW1lX2tleSkge1xuICAgICAgICB0aGlzLmdhbWVfa2V5ID0gZ2FtZV9rZXk7XG4gICAgfSxcbiAgICBvbkNvbnRpbnVlOiBmdW5jdGlvbiBvbkNvbnRpbnVlKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICBhbmFseXRpY3MuYnV0dG9uRXZlbnQoJ2NvbnRpbnVlX2J1dHRvbicpO1xuICAgIH0sXG4gICAgb25Ib21lOiBmdW5jdGlvbiBvbkhvbWUoKSB7XG4gICAgICAgIGFuYWx5dGljcy5idXR0b25FdmVudCgnaG9tZV9idXR0b24nKTtcblxuICAgICAgICB2YXIgaW50ZW50R2FtZUlkID0gZGV2aWNlLmludGVudEdhbWVJZCgpO1xuICAgICAgICBpZiAoaW50ZW50R2FtZUlkICE9ICcnKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gZGV2aWNlLmV4aXRNZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuZGlyZWN0b3IucmVzdW1lKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuICAgICAgICBtYWluY2ZnLnBhZ2UgPSAyO1xuXG4gICAgICAgIGlmIChtYWluY2ZnLmFjY1N0YXR1cyA9PSB0cnVlKSB7XG4gICAgICAgICAgICBjYy5pbnB1dE1hbmFnZXIuc2V0QWNjZWxlcm9tZXRlckVuYWJsZWQoZmFsc2UpO1xuICAgICAgICAgICAgbWFpbmNmZy5hY2NTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnTWFpblNjZW5lJyk7XG4gICAgfSxcbiAgICBvblNraXA6IGZ1bmN0aW9uIG9uU2tpcCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IucmVzdW1lKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuXG4gICAgICAgIGlmIChtYWluY2ZnLmFjY1N0YXR1cyA9PSB0cnVlKSB7XG4gICAgICAgICAgICBjYy5pbnB1dE1hbmFnZXIuc2V0QWNjZWxlcm9tZXRlckVuYWJsZWQoZmFsc2UpO1xuICAgICAgICAgICAgbWFpbmNmZy5hY2NTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuYWx5dGljcy5idXR0b25FdmVudCgnc2tpcF9idXR0b24nKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU2tpcFwiKTtcbiAgICAgICAgLy9nYW1lLnBvc3RHYW1lU2NvcmUodGhpcy5nYW1lX2tleSwwLGZhbHNlKTtcbiAgICAgICAgdmFyIHJlYiA9IGdhbWUuc2hvd05leHRHYW1lKHRoaXMuZ2FtZV9rZXkpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZWIpO1xuICAgICAgICBpZiAoIXJlYikge1xuICAgICAgICAgICAgZ2FtZS5zaG93VGlwcygnSW4gZGV2ZWxvcG1lbnQgLi4uJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25CdG4zOiBmdW5jdGlvbiBvbkJ0bjMoKSB7XG4gICAgICAgIGFuYWx5dGljcy5idXR0b25FdmVudCgnc2tpcF9idXR0b24nKTtcblxuICAgICAgICBCYWNrVmlldy5zaG93KHRoaXMuZ2FtZV9rZXkpO1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5yZXN1bWUoKTtcbiAgICAgICAgLy8gY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG5cbiAgICAgICAgLy8gaWYoIG1haW5jZmcuYWNjU3RhdHVzID09IHRydWUgKXtcbiAgICAgICAgLy8gICAgIGNjLmlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVyRW5hYmxlZChmYWxzZSk7XG4gICAgICAgIC8vICAgICBtYWluY2ZnLmFjY1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGdhbWUucG9zdEdhbWVTY29yZSh0aGlzLmdhbWVfa2V5LCdOL0EnLGZhbHNlKTtcbiAgICAgICAgLy8gbWFpbmNmZy5wYWdlID0gMTtcbiAgICAgICAgLy8gbWFpbmNmZy50ZXN0ID0gdGhpcy5nYW1lX2tleTtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdNYWluU2NlbmUnKTtcbiAgICB9LFxuXG4gICAgdXNlcmNsaWNrOiBmdW5jdGlvbiB1c2VyY2xpY2soKSB7fSxcblxuICAgIGNsaWNrZ3VpZGUxOiBmdW5jdGlvbiBjbGlja2d1aWRlMSgpIHtcbiAgICAgICAgdGhpcy5ndWlkZTEubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ndWlkZTIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjbGlja2d1aWRlMjogZnVuY3Rpb24gY2xpY2tndWlkZTIoKSB7XG4gICAgICAgIHRoaXMuZ3VpZGUyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3VpZGUzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY2xpY2tndWlkZTM6IGZ1bmN0aW9uIGNsaWNrZ3VpZGUzKCkge1xuICAgICAgICB0aGlzLmd1aWRlMy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRsZ25vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjQwYTlMQURrMUxWTGhuZFFQQXNMTTgnLCAncmVzdWx0SXRlbScpO1xuLy8gc2NyaXB0c1xcY29tbW9uXFxyZXN1bHRJdGVtLmpzXG5cbnZhciBtb21lbnQgPSByZXF1aXJlKCcuLi9jb21tb24vbW9tZW50Jyk7XG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICB1cG5vZGU6IGNjLk5vZGUsXG5cbiAgICAgICAgZG93bm5vZGU6IGNjLk5vZGUsXG4gICAgICAgIHRlc3RuYW1lOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICByZXN1bHRfb2s6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICByZXN1bHRfZXJyb3I6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHBpY19vcGVuOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcblxuICAgICAgICBwaWNfY2xvc2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGdhbWVzY29yZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgbGFzdHRpbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGdhbWVfa2V5OiAnJ1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5waWNfY2xvc2Uubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChJbmZvKSB7XG4gICAgICAgIGlmIChJbmZvLmRhdGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBJbmZvLmRhdGUgPSBtb21lbnQoSW5mby5kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEluZm8uZGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSW5mby5kYXRlIG51bGwgIDExMTExMTExMTExMTEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2FtZV9rZXkgPSBJbmZvLmtleTtcbiAgICAgICAgdGhpcy50ZXN0bmFtZS5zdHJpbmcgPSBJbmZvLm5hbWU7XG4gICAgICAgIHRoaXMuZ2FtZXNjb3JlLnN0cmluZyA9IEluZm8uc2NvcmUgPT0gdW5kZWZpbmVkID8gJ04vQScgOiBJbmZvLnNjb3JlO1xuICAgICAgICB0aGlzLmxhc3R0aW1lLnN0cmluZyA9IEluZm8uZGF0ZSA9PSB1bmRlZmluZWQgPyAnTi9BJyA6IEluZm8uZGF0ZTtcbiAgICAgICAgaWYgKEluZm8uaXNfc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRfb2subm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0X2Vycm9yLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChJbmZvLmlzX3N1Y2Nlc3MgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdF9vay5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRfZXJyb3Iubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChJbmZvLmlzX3N1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRfb2subm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRfZXJyb3Iubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZG93bm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuaGVpZ2h0ID4gODApIHJldHVybjtcblxuICAgICAgICB0aGlzLnBpY19jbG9zZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucGljX29wZW4ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ub2RlLmhlaWdodCArPSAyNDA7XG5cbiAgICAgICAgdGhpcy5kb3dubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciBwb3NYID0gdGhpcy51cG5vZGUuZ2V0UG9zaXRpb25YKCk7XG4gICAgICAgIHZhciBwb3NZID0gdGhpcy51cG5vZGUuZ2V0UG9zaXRpb25ZKCk7XG4gICAgICAgIHBvc1kgKz0gMTIwO1xuICAgICAgICB2YXIgUG9zID0gY2MucChwb3NYLCBwb3NZKTtcbiAgICAgICAgdGhpcy51cG5vZGUuc2V0UG9zaXRpb24oUG9zKTtcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5oZWlnaHQgPD0gODApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGljX2Nsb3NlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGljX29wZW4ubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubm9kZS5oZWlnaHQgLT0gMjQwO1xuICAgICAgICB0aGlzLmRvd25ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBwb3NYID0gdGhpcy51cG5vZGUuZ2V0UG9zaXRpb25YKCk7XG4gICAgICAgIHZhciBwb3NZID0gdGhpcy51cG5vZGUuZ2V0UG9zaXRpb25ZKCk7XG4gICAgICAgIHBvc1kgLT0gMTIwO1xuICAgICAgICB2YXIgUG9zID0gY2MucChwb3NYLCBwb3NZKTtcbiAgICAgICAgdGhpcy51cG5vZGUuc2V0UG9zaXRpb24oUG9zKTtcbiAgICB9LFxuXG4gICAgc2ltcGxlOiBmdW5jdGlvbiBzaW1wbGUoKSB7XG4gICAgICAgIGdhbWUuc2hvd1RpcHMoJ0luIGRldmVsb3BtZW50IC4uLicpO1xuICAgIH0sXG4gICAgZ290b2dhbWU6IGZ1bmN0aW9uIGdvdG9nYW1lKCkge1xuICAgICAgICB2YXIgcmViID0gZ2FtZS5zaG93R2FtZSh0aGlzLmdhbWVfa2V5LCAxKTtcbiAgICAgICAgaWYgKCFyZWIpIHtcbiAgICAgICAgICAgIGdhbWUuc2hvd1RpcHMoJ0luIGRldmVsb3BtZW50IC4uLicpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoZWxwOiBmdW5jdGlvbiBoZWxwKCkge1xuICAgICAgICBnYW1lLnNob3dUaXBzKCdJbiBkZXZlbG9wbWVudCAuLi4nKTtcbiAgICB9LFxuXG4gICAgY2lsY2t1cDogZnVuY3Rpb24gY2lsY2t1cCgpIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5oZWlnaHQgPD0gODApIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzg0Y2QzZlFVRmxQU2JGdTRvemk0aEhCJywgJ3Jlc3VsdExpc3QnKTtcbi8vIHNjcmlwdHNcXGNvbW1vblxccmVzdWx0TGlzdC5qc1xuXG4vL2NvbnN0IHJlc3VsdHMgPSByZXF1aXJlKCdmYWtlRGF0YScpLnJlc3VsdHM7XG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG52YXIgbWFpbmNmZyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tYWluY2ZnJyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2Nyb2xsVmlldzogY2MuU2Nyb2xsVmlldyxcbiAgICAgICAgcHJlZmFiSXRlbTogY2MuUHJlZmFiLFxuICAgICAgICByQ291bnQ6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiMTExMTExMTExMTExMTExMTExMTExMTFcIik7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2Nyb2xsVmlldy5jb250ZW50O1xuICAgICAgICB0aGlzLnBvcHVsYXRlTGlzdCgpO1xuICAgIH0sXG5cbiAgICBwb3B1bGF0ZUxpc3Q6IGZ1bmN0aW9uIHBvcHVsYXRlTGlzdCgpIHtcblxuICAgICAgICB2YXIgcmVzdWx0cyA9IGdhbWUuZ2FtZVJlY29yZHMoKTtcblxuICAgICAgICAvL3Jldi5zY29yZSA9IGRhdGEuc2NvcmU7XG4gICAgICAgIC8vcmV2LmRhdGUgPSBkYXRhLmRhdGU7XG4gICAgICAgIC8vcmV2LmlzX3N1Y2Nlc3MgPSBkYXRhLmlzX3N1Y2Nlc3M7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJDb3VudDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0SW5mbyA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdrZXknLHJlc3VsdEluZm8ua2V5KTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Njb3JlJyxyZXN1bHRJbmZvLnNjb3JlKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2RhdGUnLHJlc3VsdEluZm8uZGF0ZSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdpc19zdWNjZXNzJyxyZXN1bHRJbmZvLmlzX3N1Y2Nlc3MpO1xuXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiSXRlbSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbS5nZXRDb21wb25lbnQoJ3Jlc3VsdEl0ZW0nKSk7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudCgncmVzdWx0SXRlbScpLmluaXQocmVzdWx0SW5mbyk7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudCgncmVzdWx0SXRlbScpLm5vZGUuaGVpZ2h0ID0gODA7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbmNmZy50ZXN0XCIsIG1haW5jZmcudGVzdCk7XG4gICAgICAgICAgICBpZiAobWFpbmNmZy50ZXN0ID09IHJlc3VsdEluZm8ua2V5KSB7XG4gICAgICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoJ3Jlc3VsdEl0ZW0nKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmY1MDducnlMQkIvWmY4UVdxTXVwZnQnLCAnczAxJyk7XG4vLyBzY3JpcHRzXFwwMVxcczAxLmpzXG5cbnZhciBTY29yZVZpZXcgPSByZXF1aXJlKCcuLi9jb21tb24vU2NvcmVWaWV3Jyk7XG52YXIgR2FtZVRpbWVyID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWVUaW1lcicpO1xudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vR2FtZScpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9EZXZpY2UnKTtcbnZhciBTbGlkZXJCYXIgPSByZXF1aXJlKCcuL1NsaWRlckJhcicpO1xuXG52YXIgYmFsbF9yYWRpdXMgPSAyNTtcbnZhciBUT1BfVEFHID0gMTtcbnZhciBCT1RUT01fVEFHID0gMjtcblxuY2MuQ2xhc3Moe1xuICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbW9kZV9tZW51OiBjYy5Ob2RlLFxuICAgIHRvcF9iYXI6IGNjLk5vZGUsXG4gICAgc2xpZGVyOiBTbGlkZXJCYXIsXG4gICAgZ2FtZV9ub2RlOiBjYy5Ob2RlLFxuICAgIGNvbnRlbnRfbm9kZTogY2MuTm9kZSxcbiAgICBndWlkZV9ub2RlOiBjYy5Ob2RlLFxuICAgIG1hcDE6IFtjYy5Ob2RlXSxcbiAgICBtYXAyOiBbY2MuTm9kZV0sXG4gICAgYmFsbF9ub2RlOiBjYy5Ob2RlLFxuICAgIG1vbnN0ZXJfbm9kZTogY2MuTm9kZSxcblxuICAgIG1vdmVoYW5kOiB7XG4gICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICB9XG4gIH0sXG4gIGVhc3k6IGZ1bmN0aW9uIGVhc3koKSB7XG4gICAgdGhpcy5ndWlkZV9ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5tb2RlX21lbnUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5tb2RlRGF0YSA9IFs0LCA2XTtcbiAgfSxcbiAgbm9ybWFsOiBmdW5jdGlvbiBub3JtYWwoKSB7XG4gICAgdGhpcy5ndWlkZV9ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5tb2RlX21lbnUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5tb2RlRGF0YSA9IFsyLCA0XTtcbiAgfSxcbiAgaGFyZDogZnVuY3Rpb24gaGFyZCgpIHtcbiAgICB0aGlzLmd1aWRlX25vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLm1vZGVfbWVudS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLm1vZGVEYXRhID0gWzEsIDNdO1xuICB9LFxuXG4gIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICB0aGlzLnRvcF9iYXIuc2V0TG9jYWxaT3JkZXIoMTApO1xuXG4gICAgdGhpcy5jaGVja0JveCA9IHRoaXMuY2hlY2tCb3guYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc2xpZGVyLm9uU2xpZGUodGhpcy5vblNsaWRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZ2FtZVRpbWVyID0gbmV3IEdhbWVUaW1lcigpO1xuXG4gICAgdmFyIG0xID0gY2MuaW5zdGFudGlhdGUodGhpcy5tYXAxW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMubWFwMS5sZW5ndGgpXSk7XG4gICAgdmFyIG0yID0gY2MuaW5zdGFudGlhdGUodGhpcy5tYXAyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMubWFwMi5sZW5ndGgpXSk7XG4gICAgdGhpcy5tYXBzID0gW20xLCBtMl07XG5cbiAgICAvL3RoaXMuZ2FtZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZ3VpZGVfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLm1vZGVfbWVudS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgLy/liqjkvZxcbiAgICB2YXIgcG9zID0gY2MudjIoMTE1LCA3NSk7XG4gICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gICAgdmFyIG1vdmVUbyA9IGNjLm1vdmVUbygxLCBjYy52MigyMTUsIDc1KSk7XG4gICAgdmFyIG1vdmVCYWNrID0gY2MubW92ZVRvKDEsIGNjLnYyKDExNSwgNzUpKTtcblxuICAgIHRoaXMuYWN0aW9uID0gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShtb3ZlVG8sIG1vdmVCYWNrKSk7XG4gICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG4gIH0sXG4gIG9uRGlzYWJsZTogZnVuY3Rpb24gb25EaXNhYmxlKCkge1xuICAgIHRoaXMuZ2FtZVRpbWVyLnJlbGVhc2UoKTtcbiAgfSxcbiAgb25DbGlja0d1aWRlOiBmdW5jdGlvbiBvbkNsaWNrR3VpZGUoKSB7XG4gICAgLy90aGlzLmdhbWVfbm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuZ3VpZGVfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnRvcF9iYXIuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmNvbXBsZXRlID0gMDtcbiAgfSxcbiAgb25TbGlkZTogZnVuY3Rpb24gb25TbGlkZSgpIHtcbiAgICB0aGlzLnRvcF9iYXIuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgfSxcbiAgc3RhcnRHYW1lOiBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgaWYgKHRoaXMubWFwICYmIHRoaXMubWFwLnBhcmVudCkge1xuICAgICAgdGhpcy5tYXAucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgIH1cbiAgICB0aGlzLl9tb3ZlVHJhY2UgPSBbXTtcblxuICAgIHZhciBtYXAgPSB0aGlzLm1hcHNbMF07XG4gICAgaWYgKHRoaXMuY29tcGxldGUgPiAwKSB7XG4gICAgICBtYXAgPSB0aGlzLm1hcHNbMV07XG4gICAgfVxuICAgIHRoaXMubWFwID0gY2MuaW5zdGFudGlhdGUobWFwKTtcbiAgICB0aGlzLm1hcC5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMubWFwLnggPSAwO1xuICAgIHRoaXMubWFwLnkgPSAwO1xuICAgIHRoaXMuY29udGVudF9ub2RlLmFkZENoaWxkKHRoaXMubWFwKTtcblxuICAgIHRoaXMucG9seWdvbkNvbGxpZGVyID0gdGhpcy5tYXAuZ2V0Q29tcG9uZW50KGNjLlBvbHlnb25Db2xsaWRlcik7XG4gICAgdmFyIGJveENvbGxpZGVycyA9IHRoaXMubWFwLmdldENvbXBvbmVudHMoY2MuQm94Q29sbGlkZXIpO1xuICAgIHZhciB0b3BCb3ggPSBfLmZpbmQoYm94Q29sbGlkZXJzLCB7IHRhZzogVE9QX1RBRyB9KTtcbiAgICB2YXIgYm90dG9tQm94ID0gXy5maW5kKGJveENvbGxpZGVycywgeyB0YWc6IEJPVFRPTV9UQUcgfSk7XG5cbiAgICBpZiAodGhpcy5jb21wbGV0ZSA9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0Qm94ID0gdG9wQm94O1xuICAgICAgdGhpcy5lbmRCb3ggPSBib3R0b21Cb3g7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhcnRCb3ggPSBib3R0b21Cb3g7XG4gICAgICB0aGlzLmVuZEJveCA9IHRvcEJveDtcbiAgICB9XG5cbiAgICB0aGlzLmJhbGwgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJhbGxfbm9kZSk7XG4gICAgdGhpcy5tb25zdGVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5tb25zdGVyX25vZGUpO1xuXG4gICAgdGhpcy5iYWxsLnggPSB0aGlzLnN0YXJ0Qm94Lm9mZnNldC54O1xuICAgIHRoaXMuYmFsbC55ID0gdGhpcy5zdGFydEJveC5vZmZzZXQueTtcblxuICAgIHRoaXMubW9uc3Rlci54ID0gdGhpcy5zdGFydEJveC5vZmZzZXQueDtcbiAgICB0aGlzLm1vbnN0ZXIueSA9IHRoaXMuc3RhcnRCb3gub2Zmc2V0Lnk7XG5cbiAgICB0aGlzLm1vbnN0ZXIuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLm1hcC5hZGRDaGlsZCh0aGlzLmJhbGwpO1xuICAgIHRoaXMubWFwLmFkZENoaWxkKHRoaXMubW9uc3Rlcik7XG5cbiAgICAvL3ZhciBhbmltID0gdGhpcy5iYWxsO1xuICAgIC8vdmFyIGFuaW1DdHJsID0gYW5pbS5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgIC8vYW5pbUN0cmwucGxheShcInBsYXlfZGpcIik7XG4gICAgdGhpcy5iYWxsLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkoKTtcblxuICAgIHRoaXMuaW5pdE1hcFRvdWNoKCk7XG4gIH0sXG4gIGluaXRNYXBUb3VjaDogZnVuY3Rpb24gaW5pdE1hcFRvdWNoKCkge1xuICAgIC8vIOa3u+WKoOWNleeCueinpuaRuOS6i+S7tuebkeWQrOWZqFxuICAgIHZhciBsaXN0ZW5lciA9IHtcbiAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXG4gICAgICBvblRvdWNoQmVnYW46IHRoaXMuX29uVG91Y2hTdGFydC5iaW5kKHRoaXMpLFxuICAgICAgb25Ub3VjaE1vdmVkOiB0aGlzLl9vblRvdWNoTW92ZS5iaW5kKHRoaXMpLFxuICAgICAgb25Ub3VjaEVuZGVkOiB0aGlzLl9vblRvdWNoRW5kLmJpbmQodGhpcyksXG4gICAgICBvblRvdWNoQ2FuY2VsbGVkOiB0aGlzLl9vblRvdWNoRW5kLmJpbmQodGhpcylcbiAgICB9O1xuICAgIHRoaXMuX21hcF9saXN0ZW5lciA9IGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpcy5tYXApO1xuXG4gICAgaWYgKCF0aGlzLmdhbWVUaW1lci5pc1J1bmluZygpKSB7XG4gICAgICB0aGlzLmdhbWVUaW1lci5zdGFydCgpO1xuICAgIH1cbiAgICB0aGlzLnNjaGVkdWxlKHRoaXMuY2hlY2tCb3gsIDEgLyAzMCk7XG5cbiAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLnN0YXJ0VHJhY2UsIF8ucmFuZG9tKHRoaXMubW9kZURhdGFbMF0sIHRoaXMubW9kZURhdGFbMV0pKTtcbiAgfSxcblxuICBzdGFydFRyYWNlOiBmdW5jdGlvbiBzdGFydFRyYWNlKCkge1xuICAgIHRoaXMubW9uc3Rlci54ID0gdGhpcy5zdGFydEJveC5vZmZzZXQueDtcbiAgICB0aGlzLm1vbnN0ZXIueSA9IHRoaXMuc3RhcnRCb3gub2Zmc2V0Lnk7XG4gICAgdGhpcy5tb25zdGVyLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5tb25zdGVyLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkoKTtcbiAgICAvLyB0aGlzLmJvc3NBbmltLnBsYXkoJ2Jvc3NfbW92ZScpO1xuXG4gICAgdGhpcy5zY2hlZHVsZSh0aGlzLnRyYWNlLCAxIC8gMzApO1xuICB9LFxuICB0cmFjZTogZnVuY3Rpb24gdHJhY2UoKSB7XG4gICAgdmFyIHAgPSB0aGlzLl9tb3ZlVHJhY2Uuc2hpZnQoKTtcbiAgICBpZiAoIXApIHJldHVybjtcbiAgICB0aGlzLm1vbnN0ZXIuc2V0UG9zaXRpb24ocCk7XG4gIH0sXG4gIF9vblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIF9vblRvdWNoU3RhcnQodG91Y2hlLCBldmVudCkge1xuICAgIHZhciBiYWxsX3BvcyA9IHRoaXMubWFwLmNvbnZlcnRUb1dvcmxkU3BhY2UodGhpcy5iYWxsLmdldFBvc2l0aW9uKCkpO1xuICAgIHZhciBkaXMgPSBjYy5wRGlzdGFuY2UodG91Y2hlLmdldExvY2F0aW9uKCksIGJhbGxfcG9zKTtcbiAgICBpZiAoZGlzIDwgYmFsbF9yYWRpdXMpIHtcbiAgICAgIHRoaXMuX3RvdWNoX29mZnNldCA9IGNjLnBTdWIodG91Y2hlLmdldExvY2F0aW9uKCksIGJhbGxfcG9zKTtcbiAgICAgIHRoaXMuYmFsbC5zY2FsZVggPSAxLjU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBfb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIF9vblRvdWNoTW92ZSh0b3VjaGUsIGV2ZW50KSB7XG4gICAgdmFyIHBvcyA9IHRoaXMubWFwLmNvbnZlcnRUb05vZGVTcGFjZSh0b3VjaGUuZ2V0TG9jYXRpb24oKSk7XG4gICAgdmFyIHAgPSBjYy5wU3ViKHBvcywgdGhpcy5fdG91Y2hfb2Zmc2V0KTtcbiAgICB0aGlzLmJhbGwuc2V0UG9zaXRpb24ocCk7XG4gICAgdGhpcy5fbW92ZVRyYWNlLnB1c2gocCk7XG4gIH0sXG4gIF9vblRvdWNoRW5kOiBmdW5jdGlvbiBfb25Ub3VjaEVuZCh0b3VjaGUsIGV2ZW50KSB7XG4gICAgdGhpcy5fdG91Y2hfb2Zmc2V0ID0gbnVsbDtcbiAgICB0aGlzLmJhbGwuc2NhbGVYID0gMS4wO1xuXG4gICAgaWYgKCF0aGlzLmlzQ29sbGlzaW9uRW5kQm94KCkpIHtcbiAgICAgIGNjLmxvZygndG91Y2hFbmQnKTtcblxuICAgICAgdGhpcy5lbmRHYW1lKCk7XG4gICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLm9uRmFpbCwgMSk7XG4gICAgfVxuICB9LFxuICBjaGVja0JveDogZnVuY3Rpb24gY2hlY2tCb3goKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBpc0NvbGxpc2lvbk1vbnN0ZXIgPSBjYy5wRGlzdGFuY2UodGhpcy5tb25zdGVyLmdldFBvc2l0aW9uKCksIHRoaXMuYmFsbC5nZXRQb3NpdGlvbigpKSA8IGJhbGxfcmFkaXVzICogMjtcbiAgICBpZiAodGhpcy5tb25zdGVyLmFjdGl2ZSAmJiBpc0NvbGxpc2lvbk1vbnN0ZXIpIHtcbiAgICAgIGNjLmxvZygnaXNDb2xsaXNpb25Nb25zdGVyJyk7XG4gICAgICB0aGlzLmJhbGwuYWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLm1vbnN0ZXIuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInBsYXlfZWF0XCIpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMubW9uc3Rlci5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIH0sIDUwMCk7XG4gICAgICB0aGlzLmVuZEdhbWUoKTtcbiAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMub25GYWlsLCAxKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGlzQ29sbGlzaW9uUGF0aCA9IGNjLkludGVyc2VjdGlvbi5wb2x5Z29uQ2lyY2xlKHRoaXMucG9seWdvbkNvbGxpZGVyLndvcmxkLnBvaW50cywgeyBwb3NpdGlvbjogdGhpcy5iYWxsLmdldFBvc2l0aW9uKCksIHJhZGl1czogYmFsbF9yYWRpdXMgfSk7XG4gICAgaWYgKGlzQ29sbGlzaW9uUGF0aCkge1xuICAgICAgY2MubG9nKCdpc0NvbGxpc2lvblBhdGgnKTtcbiAgICAgIHRoaXMuZW5kR2FtZSgpO1xuICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5vbkZhaWwsIDEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQ29sbGlzaW9uRW5kQm94KCkpIHtcbiAgICAgIGNjLmxvZygnaXNDb2xsaXNpb25FbmQnKTtcbiAgICAgIHRoaXMuZW5kR2FtZSgpO1xuICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5vblN1Y2Nlc3MsIDAuNSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9LFxuICBpc0NvbGxpc2lvbkVuZEJveDogZnVuY3Rpb24gaXNDb2xsaXNpb25FbmRCb3goKSB7XG4gICAgdmFyIGlzQ29sbGlzaW9uRW5kID0gdGhpcy5Cb3hDaXJjbGVJbnRlcnNlY3QodGhpcy5lbmRCb3gub2Zmc2V0LCB0aGlzLmJhbGwuZ2V0UG9zaXRpb24oKSwgY2MudjIodGhpcy5lbmRCb3guc2l6ZS53aWR0aCAvIDIsIHRoaXMuZW5kQm94LnNpemUuaGVpZ2h0IC8gMiksIGJhbGxfcmFkaXVzKTtcbiAgICByZXR1cm4gaXNDb2xsaXNpb25FbmQ7XG4gIH0sXG4gIEJveENpcmNsZUludGVyc2VjdDogZnVuY3Rpb24gQm94Q2lyY2xlSW50ZXJzZWN0KGMsIHAsIGgsIHIpIHtcbiAgICB2YXIgdiA9IGNjLnBTdWIocCwgYyk7XG4gICAgdiA9IGNjLnYyKE1hdGguYWJzKHYueCksIE1hdGguYWJzKHYueSkpO1xuICAgIHZhciB1ID0gY2MucFN1Yih2LCBoKTtcbiAgICB1ID0gY2MudjIoTWF0aC5tYXgodi54LCAwKSwgTWF0aC5tYXgodi55LCAwKSk7XG4gICAgcmV0dXJuIGNjLnBEb3QodSwgdSkgPD0gciAqIHI7XG4gIH0sXG4gIG9uRmFpbDogZnVuY3Rpb24gb25GYWlsKCkge1xuICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gIH0sXG4gIG9uU3VjY2VzczogZnVuY3Rpb24gb25TdWNjZXNzKCkge1xuICAgIHRoaXMuY29tcGxldGUrKztcbiAgICBpZiAodGhpcy5jb21wbGV0ZSA+IDEpIHtcbiAgICAgIHRoaXMub25Db21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgIH1cbiAgfSxcbiAgb25Db21wbGV0ZTogZnVuY3Rpb24gb25Db21wbGV0ZSgpIHtcbiAgICB0aGlzLmdhbWVUaW1lci5zdG9wKCk7XG5cbiAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ3NjcmVlbicsIHRoaXMuZ2FtZVRpbWVyLmdldFRpbWUoKSwgdHJ1ZSk7XG4gICAgU2NvcmVWaWV3LnNob3coJ3NjcmVlbicsIHRoaXMuZ2FtZVRpbWVyLmdldFRpbWUoKSwgdHJ1ZSk7XG4gIH0sXG4gIGVuZEdhbWU6IGZ1bmN0aW9uIGVuZEdhbWUoKSB7XG4gICAgY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX21hcF9saXN0ZW5lcik7XG4gICAgdGhpcy5fbWFwX2xpc3RlbmVyID0gbnVsbDtcbiAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5jaGVja0JveCk7XG4gICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuc3RhcnRUcmFjZSk7XG4gICAgdGhpcy51bnNjaGVkdWxlKHRoaXMudHJhY2UpO1xuICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZiMzRmY3JBbFpLY0lnaWZ4L1dyYTZkJywgJ3MwMl9hc2tfbGF5ZXInKTtcbi8vIHNjcmlwdHNcXDAyXFxzMDJfYXNrX2xheWVyLmpzXG5cblxuLy9jb25zdCBnYW1lcmVzdWx0ID0gcmVxdWlyZSgnczAyX2dhbWVfbGF5ZXInKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy8gZ2FtZXJlc3VsdDpnYW1lcmVzdWx0LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRhY3RpdmU6IGZ1bmN0aW9uIHNldGFjdGl2ZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYXNrIHNldGFjdGl2ZVwiKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwYzY0NG5yK2VwRVRZVW14SWdZa050ZCcsICdzMDJfYmxhY2tfdHJhbnNfbGF5ZXInKTtcbi8vIHNjcmlwdHNcXDAyXFxzMDJfYmxhY2tfdHJhbnNfbGF5ZXIuanNcblxudmFyIGdhbWUgPSByZXF1aXJlKCdzMDJfZ2FtZV9sYXllcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZTogZ2FtZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIjExMTEgYmFsY2tcIik7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuYWN0aXZlID09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ29uZXh0IGJhbGNrXCIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnNldGFjdGl2ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyMjIgYmFsY2tcIik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc2V0YWN0aXZlOiBmdW5jdGlvbiBzZXRhY3RpdmUoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhYmVsLm5vZGUucnVuQWN0aW9uKGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoY2MuZmFkZU91dCgxKSwgY2MuZGVsYXlUaW1lKDMpLCBjYy5mYWRlSW4oMSkpKSk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI5OWZjL0VFUU5QYnIrWlpsckd3WmdiJywgJ3MwMl9nYW1lX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwwMlxcczAyX2dhbWVfbGF5ZXIuanNcblxudmFyIHdoaXRlID0gcmVxdWlyZSgnczAyX3doaXRlX3RyYW5zX2xheWVyJyk7XG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWUnKTtcbnZhciBTY29yZVZpZXcgPSByZXF1aXJlKCcuLi9jb21tb24vU2NvcmVWaWV3Jyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9va2xhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsb29rYnRuOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgcGF1c2VsYXllcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbTE6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBpdGVtMjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0zOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbTQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBpdGVtNToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW02OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbTc6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBpdGVtODoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW05OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcblxuICAgICAgICBudW1BcnJheTogW10sXG4gICAgICAgIHN0YXR1c0FycmF5OiBbXSxcbiAgICAgICAgaW5kZXg6IDAsXG4gICAgICAgIGNhbkNsaWNrOiBmYWxzZSxcbiAgICAgICAgdGltZVN0YXR1czogMCwgLy/lgJLorqHml7ZcblxuICAgICAgICBwcmVUaW1lOiA1LFxuICAgICAgICBhY3Rpb246IG51bGwsXG4gICAgICAgIGxvb2thY3Rpb246IG51bGwsXG4gICAgICAgIHdoaXRlOiB3aGl0ZSxcbiAgICAgICAgbG9va3RpbWU6IDUsXG4gICAgICAgIHJldHVyblN0YXR1czogMCxcbiAgICAgICAgbG9va3M6IDAsXG4gICAgICAgIHVzZXRpbWU6ICcnXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge30sXG5cbiAgICBnZXRyZXN1bHQ6IGZ1bmN0aW9uIGdldHJlc3VsdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNldGltZTtcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHNldE9uZVBpYzogZnVuY3Rpb24gc2V0T25lUGljKG51bSwgc3RhdHVzLCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIHBhdGggPSBcIlwiO1xuXG4gICAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmV0dXJuU3RhdHVzID09IDApIHBhdGggPSBcInJlc291cmNlcy8wMi9iXCIgKyBudW0gKyBcIi5qcGdcIjtlbHNlIHBhdGggPSBcInJlc291cmNlcy8wMi9ibGFjay5qcGdcIjtcbiAgICAgICAgfSBlbHNlIHBhdGggPSBcInJlc291cmNlcy8wMi93XCIgKyBudW0gKyBcIi5qcGdcIjtcbiAgICAgICAgY29uc29sZS5sb2cocGF0aCk7XG4gICAgICAgIHZhciByZWFsVXJsID0gY2MudXJsLnJhdyhwYXRoKTtcbiAgICAgICAgdmFyIHRleHR1cmUgPSBjYy50ZXh0dXJlQ2FjaGUuYWRkSW1hZ2UocmVhbFVybCk7XG4gICAgICAgIHRhcmdldC5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgIH0sXG4gICAgc2V0UGljOiBmdW5jdGlvbiBzZXRQaWMobnVtQXJyYXksIHN0YXR1c0FycmF5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhdHVzQXJyYXlcIiwgc3RhdHVzQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzBdLCBzdGF0dXNBcnJheVswXSwgdGhpcy5pdGVtMSk7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzFdLCBzdGF0dXNBcnJheVsxXSwgdGhpcy5pdGVtMik7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzJdLCBzdGF0dXNBcnJheVsyXSwgdGhpcy5pdGVtMyk7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzNdLCBzdGF0dXNBcnJheVszXSwgdGhpcy5pdGVtNCk7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzRdLCBzdGF0dXNBcnJheVs0XSwgdGhpcy5pdGVtNSk7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzVdLCBzdGF0dXNBcnJheVs1XSwgdGhpcy5pdGVtNik7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzZdLCBzdGF0dXNBcnJheVs2XSwgdGhpcy5pdGVtNyk7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzddLCBzdGF0dXNBcnJheVs3XSwgdGhpcy5pdGVtOCk7XG4gICAgICAgIHRoaXMuc2V0T25lUGljKG51bUFycmF5WzhdLCBzdGF0dXNBcnJheVs4XSwgdGhpcy5pdGVtOSk7XG4gICAgfSxcbiAgICBpbml0QWxsUGljOiBmdW5jdGlvbiBpbml0QWxsUGljKCkge1xuICAgICAgICB2YXIgbnVtQXJyYXkgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV07XG4gICAgICAgIHRoaXMuc29ydFJhbmRvbShudW1BcnJheSk7XG4gICAgICAgIHRoaXMubnVtQXJyYXkgPSBudW1BcnJheTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5udW1BcnJheSk7XG5cbiAgICAgICAgdGhpcy5zdGF0dXNBcnJheSA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcblxuICAgICAgICB0aGlzLnJldHVyblN0YXR1cyA9IDA7XG4gICAgICAgIHRoaXMuc2V0UGljKHRoaXMubnVtQXJyYXksIHRoaXMuc3RhdHVzQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLnByZVRpbWU7XG4gICAgICAgIHRoaXMudGltZVN0YXR1cyA9IDA7IC8v5YCS6K6h5pe2XG4gICAgICAgIC8v5pi+56S65YCS6K6h5pe25a6a5pe25ZmoXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIOi/memHjOeahCB0aGlzIOaMh+WQkSBjb21wb25lbnRcbiAgICAgICAgICAgIHRoaXMuc2V0QUxMQmxhY2soKTtcbiAgICAgICAgfSwgdGhpcy5wcmVUaW1lKTtcblxuICAgICAgICB0aGlzLmNhbkNsaWNrID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5hY3Rpb24gPSBjYy5yZXBlYXQoY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygxLCAyKSwgY2Muc2NhbGVUbygxLCAxKSksIHRoaXMucHJlVGltZSk7XG4gICAgICAgIHRoaXMubGFiZWwubm9kZS5ydW5BY3Rpb24odGhpcy5hY3Rpb24pO1xuXG4gICAgICAgIHRoaXMubG9va3RpbWUgPSA1O1xuICAgIH0sXG5cbiAgICBzZXRBTExCbGFjazogZnVuY3Rpb24gc2V0QUxMQmxhY2soKSB7XG5cbiAgICAgICAgdGhpcy5sYWJlbC5ub2RlLnN0b3BBY3Rpb24odGhpcy5hY3Rpb24pO1xuICAgICAgICB2YXIgcGF0aCA9IFwicmVzb3VyY2VzLzAyL2JsYWNrLmpwZ1wiO1xuICAgICAgICB2YXIgcmVhbFVybCA9IGNjLnVybC5yYXcocGF0aCk7XG4gICAgICAgIHZhciB0ZXh0dXJlID0gY2MudGV4dHVyZUNhY2hlLmFkZEltYWdlKHJlYWxVcmwpO1xuICAgICAgICB0aGlzLml0ZW0xLnNwcml0ZUZyYW1lLnNldFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgIHRoaXMuaXRlbTIuc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgdGhpcy5pdGVtMy5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICB0aGlzLml0ZW00LnNwcml0ZUZyYW1lLnNldFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgIHRoaXMuaXRlbTUuc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgdGhpcy5pdGVtNi5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICB0aGlzLml0ZW03LnNwcml0ZUZyYW1lLnNldFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgIHRoaXMuaXRlbTguc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgdGhpcy5pdGVtOS5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICB0aGlzLmNhbkNsaWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgICAgIHRoaXMudGltZVN0YXR1cyA9IDE7IC8v5q2j5ZCR6K6h5pe2XG4gICAgfSxcblxuICAgIHNvcnRSYW5kb206IGZ1bmN0aW9uIHNvcnRSYW5kb20obykge1xuICAgICAgICAvL3YxLjBcbiAgICAgICAgZm9yICh2YXIgaiwgeCwgaSA9IG8ubGVuZ3RoOyBpOyBqID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIGkpLCB4ID0gb1stLWldLCBvW2ldID0gb1tqXSwgb1tqXSA9IHgpO1xuICAgICAgICByZXR1cm4gbztcbiAgICB9LFxuXG4gICAgc2V0YWN0aXZlOiBmdW5jdGlvbiBzZXRhY3RpdmUoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAvL3RoaXMuc2NoZWR1bGVVcGRhdGUoKTtcbiAgICAgICAgdGhpcy5pbml0QWxsUGljKCk7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgLy90aGlzLl90aW1lID0gMC4wO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXG4gICAgICAgIGlmICh0aGlzLnRpbWVTdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fdGltZSArPSBkdDtcbiAgICAgICAgICAgIC8vIFvmraPliJnooajovr7lvI9d6I635Y+W5bCP5pWw54K55ZCO5LiJ5L2NXG4gICAgICAgICAgICB2YXIgcmVnZXggPSAvKFswLTldK1xcLlswLTldezJ9KVswLTldKi87XG4gICAgICAgICAgICB2YXIgdGltZVN0ciA9IFN0cmluZyh0aGlzLl90aW1lKTtcbiAgICAgICAgICAgIHZhciBmaW5hbFN0ciA9IHRpbWVTdHIucmVwbGFjZShyZWdleCwgXCIkMVwiKTtcbiAgICAgICAgICAgIGZpbmFsU3RyID0gZmluYWxTdHIgKyBcInNcIjtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gZmluYWxTdHI7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxvb2tsYWJlbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9va3RpbWUgLT0gZHQ7XG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gLyhbMC05XStcXC5bMC05XXswfSlbMC05XSovO1xuICAgICAgICAgICAgICAgIHZhciB0aW1lU3RyID0gU3RyaW5nKHRoaXMubG9va3RpbWUpO1xuICAgICAgICAgICAgICAgIHZhciBmaW5hbFN0ciA9IHRpbWVTdHIucmVwbGFjZShyZWdleCwgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICBmaW5hbFN0ciA9IGZpbmFsU3RyLnN1YnN0cigwLCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvb2tsYWJlbC5zdHJpbmcgPSBmaW5hbFN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgLT0gZHQ7XG4gICAgICAgICAgICB2YXIgcmVnZXggPSAvKFswLTldK1xcLlswLTldezB9KVswLTldKi87XG4gICAgICAgICAgICB2YXIgdGltZVN0ciA9IFN0cmluZyh0aGlzLl90aW1lKTtcbiAgICAgICAgICAgIHZhciBmaW5hbFN0ciA9IHRpbWVTdHIucmVwbGFjZShyZWdleCwgXCIkMVwiKTtcbiAgICAgICAgICAgIGZpbmFsU3RyID0gZmluYWxTdHIuc3Vic3RyKDAsIDEpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSBmaW5hbFN0cjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwYXVzZTogZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiMTExMTFnYW1lXCIpO1xuICAgICAgICB0aGlzLnBhdXNlbGF5ZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBjYy5nYW1lLnBhdXNlKCk7XG4gICAgfSxcblxuICAgIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiMjIyMmdhbWVcIik7XG4gICAgICAgIGNjLmdhbWUucmVzdW1lKCk7XG4gICAgICAgIHRoaXMucGF1c2VsYXllci5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRDbGlja1N0YXR1czogZnVuY3Rpb24gc2V0Q2xpY2tTdGF0dXMoaW5kZXgsIHRhcmdldCkge1xuXG4gICAgICAgIGlmICghdGhpcy5jYW5DbGljaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubnVtQXJyYXlbaW5kZXggLSAxXSA9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICAvL+mHjeWkjeeCueWHu+S6huW3sue7j29r55qE54K5XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGF0dXNBcnJheVtpbmRleCAtIDFdID09IDEpIHtcbiAgICAgICAgICAgIC8v6YeN5aSN54K55Ye75LqG5bey57uPb2vnmoTngrlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubnVtQXJyYXlbaW5kZXggLSAxXSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaW5kZXgpO1xuXG4gICAgICAgIGlmICh0aGlzLm51bUFycmF5W2luZGV4IC0gMV0gIT0gdGhpcy5pbmRleCArIDEpIC8v54K55Ye76ZSZ6K+v77yM6L+U5Zue5Yid5aeL5YyWXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy/mmL7npLrmraPnoa7nu5PmnpxcbiAgICAgICAgICAgICAgICB2YXIgc3RhdHVzQXJyYXkgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgICAgICAgICAgICAgdGhpcy5yZXR1cm5TdGF0dXMgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UGljKHRoaXMubnVtQXJyYXksIHN0YXR1c0FycmF5KTtcblxuICAgICAgICAgICAgICAgIHRoaXMubG9va2FjdGlvbiA9IGNjLmZhZGVPdXQoMik7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLmxvb2thY3Rpb24pO1xuICAgICAgICAgICAgICAgIC8vIOmHjeaWsOW8gOWni1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc3RvcEFjdGlvbih0aGlzLmxvb2thY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvb2thY3Rpb24gPSBjYy5mYWRlSW4oMC41KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLmxvb2thY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRBbGxQaWMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfSwgMik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNhbkNsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgdmFyIHBhdGggPSBcInJlc291cmNlcy8wMi93XCIgKyB0aGlzLm51bUFycmF5W2luZGV4IC0gMV0gKyBcIi5qcGdcIjtcbiAgICAgICAgY29uc29sZS5sb2cocGF0aCk7XG4gICAgICAgIHZhciByZWFsVXJsID0gY2MudXJsLnJhdyhwYXRoKTtcbiAgICAgICAgdmFyIHRleHR1cmUgPSBjYy50ZXh0dXJlQ2FjaGUuYWRkSW1hZ2UocmVhbFVybCk7XG4gICAgICAgIHRhcmdldC5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuXG4gICAgICAgIHRoaXMuc3RhdHVzQXJyYXlbaW5kZXggLSAxXSA9IDE7XG5cbiAgICAgICAgLy/nu5PmnZ/mnaHku7bvvJrngrnliLA55YiZ57uT5p2fXG4gICAgICAgIGlmICh0aGlzLmluZGV4ID09IDkpIHtcbiAgICAgICAgICAgIC8vdGhpcy5fdGltZSDov5vooYzorqHliIblpITnkIbvvIzov5nkuKrlkI7mnJ/nu5/kuIDov5vooYxcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuYWN0aXZlID09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIC8v6K6w5b2V57uT5p6cXG4gICAgICAgICAgICAgICAgLy8gW+ato+WImeihqOi+vuW8j13ojrflj5blsI/mlbDngrnlkI7kuInkvY1cbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSAvKFswLTldK1xcLlswLTldezJ9KVswLTldKi87XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVTdHIgPSBTdHJpbmcodGhpcy5fdGltZSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbmFsU3RyID0gdGltZVN0ci5yZXBsYWNlKHJlZ2V4LCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudXNldGltZSA9IGZpbmFsU3RyO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy51c2V0aW1lKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdvbmV4dCBmcm9tIGdhbWVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUuc2V0YWN0aXZlKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyMjIgZnJvbSBnYW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGl0ZW0xY2xpY2s6IGZ1bmN0aW9uIGl0ZW0xY2xpY2soKSB7XG5cbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cygxLCB0aGlzLml0ZW0xKTtcbiAgICB9LFxuXG4gICAgaXRlbTJjbGljazogZnVuY3Rpb24gaXRlbTJjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cygyLCB0aGlzLml0ZW0yKTtcbiAgICB9LFxuXG4gICAgaXRlbTNjbGljazogZnVuY3Rpb24gaXRlbTNjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cygzLCB0aGlzLml0ZW0zKTtcbiAgICB9LFxuXG4gICAgaXRlbTRjbGljazogZnVuY3Rpb24gaXRlbTRjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cyg0LCB0aGlzLml0ZW00KTtcbiAgICB9LFxuXG4gICAgaXRlbTVjbGljazogZnVuY3Rpb24gaXRlbTVjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cyg1LCB0aGlzLml0ZW01KTtcbiAgICB9LFxuXG4gICAgaXRlbTZjbGljazogZnVuY3Rpb24gaXRlbTZjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cyg2LCB0aGlzLml0ZW02KTtcbiAgICB9LFxuXG4gICAgaXRlbTdjbGljazogZnVuY3Rpb24gaXRlbTdjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cyg3LCB0aGlzLml0ZW03KTtcbiAgICB9LFxuXG4gICAgaXRlbThjbGljazogZnVuY3Rpb24gaXRlbThjbGljaygpIHtcbiAgICAgICAgdGhpcy5zZXRDbGlja1N0YXR1cyg4LCB0aGlzLml0ZW04KTtcbiAgICB9LFxuICAgIGl0ZW05Y2xpY2s6IGZ1bmN0aW9uIGl0ZW05Y2xpY2soKSB7XG4gICAgICAgIHRoaXMuc2V0Q2xpY2tTdGF0dXMoOSwgdGhpcy5pdGVtOSk7XG4gICAgfSxcblxuICAgIHBhdXNlSG9tZTogZnVuY3Rpb24gcGF1c2VIb21lKCkge1xuICAgICAgICBjYy5nYW1lLnJlc3VtZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInBhdXNlSG9tZVwiKTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiTWFpblNjZW5lXCIpO1xuXG4gICAgICAgIHRoaXMucGF1c2VsYXllci5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgbG9va0FnYWluOiBmdW5jdGlvbiBsb29rQWdhaW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5DbGljaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FuQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb29rcysrO1xuICAgICAgICB0aGlzLmxvb2t0aW1lID0gNSAqIHRoaXMubG9va3M7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0dXNBcnJheSk7XG5cbiAgICAgICAgdmFyIHN0YXR1c0FycmF5ID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xuICAgICAgICB0aGlzLnJldHVyblN0YXR1cyA9IDA7XG4gICAgICAgIHRoaXMuc2V0UGljKHRoaXMubnVtQXJyYXksIHN0YXR1c0FycmF5KTtcbiAgICAgICAgLy/orr7nva5sb29r5YCS6K6h5pe2XG4gICAgICAgIHRoaXMubG9va2J0bi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvb2tsYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgLy/mmL7npLrlgJLorqHml7blrprml7blmahcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8g6L+Z6YeM55qEIHRoaXMg5oyH5ZCRIGNvbXBvbmVudFxuICAgICAgICAgICAgdGhpcy5yZXR1cm5HYW1lKCk7XG4gICAgICAgIH0sIHRoaXMubG9va3RpbWUpO1xuXG4gICAgICAgIHRoaXMubG9va2FjdGlvbiA9IGNjLnJlcGVhdChjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDEsIDIpLCBjYy5zY2FsZVRvKDEsIDEpKSwgdGhpcy5wcmVUaW1lKTtcbiAgICAgICAgdGhpcy5sb29rbGFiZWwubm9kZS5ydW5BY3Rpb24odGhpcy5sb29rYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgcmV0dXJuR2FtZTogZnVuY3Rpb24gcmV0dXJuR2FtZSgpIHtcblxuICAgICAgICB0aGlzLmNhbkNsaWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sb29rYnRuLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sb29rbGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmxvb2tsYWJlbC5ub2RlLnN0b3BBY3Rpb24odGhpcy5sb29rYWN0aW9uKTtcblxuICAgICAgICB0aGlzLnJldHVyblN0YXR1cyA9IDE7XG4gICAgICAgIHRoaXMuc2V0UGljKHRoaXMubnVtQXJyYXksIHRoaXMuc3RhdHVzQXJyYXkpO1xuICAgIH0sXG5cbiAgICBhc2tZZXM6IGZ1bmN0aW9uIGFza1llcygpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy51c2V0aW1lKTtcbiAgICAgICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdkaXNwbGF5JywgdGhpcy51c2V0aW1lLCBmYWxzZSk7XG4gICAgICAgIFNjb3JlVmlldy5zaG93KCdkaXNwbGF5JywgdGhpcy51c2V0aW1lLCBmYWxzZSk7XG4gICAgfSxcbiAgICBhc2tObzogZnVuY3Rpb24gYXNrTm8oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudXNldGltZSk7XG4gICAgICAgIGdhbWUucG9zdEdhbWVTY29yZSgnZGlzcGxheScsIHRoaXMudXNldGltZSwgdHJ1ZSk7XG4gICAgICAgIC8vL2dhbWUuc2hvd05leHRHYW1lKCdkaXNwbGF5Jyk7XG4gICAgICAgIFNjb3JlVmlldy5zaG93KCdkaXNwbGF5JywgdGhpcy51c2V0aW1lLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZDFlNkhRbWlaUG1icnJlbkdkMXZ0WScsICdzMDJfaW5zX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwwMlxcczAyX2luc19sYXllci5qc1xuXG52YXIgYmxhY2tfdHJhbnMgPSByZXF1aXJlKCdzMDJfYmxhY2tfdHJhbnNfbGF5ZXInKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJsYWNrX3RyYW5zOiBibGFja190cmFucyxcbiAgICAgICAgaGFuZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZWhhbmQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiMjIyMjIyIGluc1wiKTtcblxuICAgICAgICAvL+WKqOS9nFxuICAgICAgICB2YXIgcG9zID0gY2MudjIoNjAsIDgwKTtcbiAgICAgICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIHZhciBtb3ZlVG8gPSBjYy5tb3ZlVG8oMC4zLCBjYy52Mig3MCwgOTApKTtcbiAgICAgICAgdmFyIG1vdmVCYWNrID0gY2MubW92ZVRvKDAuMywgY2MudjIoNjAsIDYwKSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb24gPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKG1vdmVUbywgbW92ZUJhY2spKTtcbiAgICAgICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG4gICAgfSxcblxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIjExMTExMSBpbnNcIik7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuYWN0aXZlID09IHRydWUpIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnb25leHQgaW5zXCIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5ibGFja190cmFucy5zZXRhY3RpdmUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMjIyMjIyIGluc1wiKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQzYTM2ZG5MNFpJbXJMOGZYRzBnYml5JywgJ3MwMl93aGl0ZV90cmFuc19sYXllcicpO1xuLy8gc2NyaXB0c1xcMDJcXHMwMl93aGl0ZV90cmFuc19sYXllci5qc1xuXG52YXIgYXNrID0gcmVxdWlyZSgnczAyX2Fza19sYXllcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBhc2s6IGFza1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5ub2RlLmFjdGl2ZSA9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ29uZXh0IGZyb20gd2hpdGVcIik7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXNrKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYXNrLnNldGFjdGl2ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyMjIgZnJvbSB3aGl0ZVwiKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRhY3RpdmU6IGZ1bmN0aW9uIHNldGFjdGl2ZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubGFiZWwubm9kZS5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShjYy5mYWRlT3V0KDEpLCBjYy5kZWxheVRpbWUoMyksIGNjLmZhZGVJbigxKSkpKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MTM5ZWl5bVIxQU5vaXd3emdYaDQyMScsICdzMDNfQnV0dG9uU2NhbGVyJyk7XG4vLyBzY3JpcHRzXFwwM1xcczAzX0J1dHRvblNjYWxlci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHByZXNzZWRTY2FsZTogMC45LFxuICAgICAgICB0cmFuc0R1cmF0aW9uOiAwLjFcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmluaXRTY2FsZSA9IHRoaXMubm9kZS5zY2FsZTtcbiAgICAgICAgc2VsZi5idXR0b24gPSBzZWxmLmdldENvbXBvbmVudChjYy5CdXR0b24pO1xuICAgICAgICBzZWxmLnNjYWxlRG93bkFjdGlvbiA9IGNjLnNjYWxlVG8oc2VsZi50cmFuc0R1cmF0aW9uLCBzZWxmLnByZXNzZWRTY2FsZSk7XG4gICAgICAgIHNlbGYuc2NhbGVVcEFjdGlvbiA9IGNjLnNjYWxlVG8oc2VsZi50cmFuc0R1cmF0aW9uLCBzZWxmLmluaXRTY2FsZSk7XG4gICAgICAgIGZ1bmN0aW9uIG9uVG91Y2hEb3duKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBbGxBY3Rpb25zKCk7XG5cbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKHNlbGYuc2NhbGVEb3duQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblRvdWNoVXAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKHNlbGYuc2NhbGVVcEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaERvd24sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hlbmQnLCBvblRvdWNoVXAsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hjYW5jZWwnLCBvblRvdWNoVXAsIHRoaXMubm9kZSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZDcwYlRYVk1GRFFxaTIzVXlwa1pUUScsICdzMDNfZ2FtZV9sYXllcicpO1xuLy8gc2NyaXB0c1xcMDNcXHMwM19nYW1lX2xheWVyLmpzXG5cbnZhciBsYXN0ID0gcmVxdWlyZSgnczAzX2xhc3RfbGF5ZXInKTtcblxudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vR2FtZScpO1xudmFyIGd1aWRlID0gcmVxdWlyZSgnLi4vY29tbW9uL2d1aWRlJyk7XG52YXIgU2NvcmVWaWV3ID0gcmVxdWlyZSgnLi4vY29tbW9uL1Njb3JlVmlldycpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgbGFzdDogbGFzdCxcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGJvdHRvbUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIG1vZGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXJyb3JBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wMToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wMjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wMzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wNDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wNToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wNjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wNzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSwgYXVkaW8wODoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSwgYXVkaW8wOToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSwgYXVkaW8xMDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBhdWRpb1JpZ2h0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBhdWRpb1N1Y2Nlc3M6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHJhbkFkdWlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIHJlcGxheUJ0bjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hvb3NlMToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGNob29zZTI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBjaG9vc2UzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcblxuICAgICAgICAvLzIw5Liq57K+54G1XG4gICAgICAgIGl0ZW0xOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbTI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBpdGVtMzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW00OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbTU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBpdGVtNjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW03OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbTg6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBpdGVtOToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xMDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xMToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xMjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xMzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xNDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xNToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xNjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xNzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xODoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0xOToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0yMDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFuTnVtQXJyYXk6IFtdLFxuICAgICAgICByYW5OdW06IDAsXG4gICAgICAgIHRpbWVTdGF0dXM6IDAsXG5cbiAgICAgICAgdXNldGltZTogJycsXG4gICAgICAgIGdtb2RlOiAxLFxuICAgICAgICBndWlkZV9ub2RlOiBjYy5Ob2RlLFxuICAgICAgICBtb3ZlaGFuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYnN0YXJ0Z2FtZTogZmFsc2UsXG4gICAgICAgIG1vZGVfbWVudTogY2MuTm9kZVxuICAgIH0sXG5cbiAgICBlYXN5OiBmdW5jdGlvbiBlYXN5KCkge1xuICAgICAgICB0aGlzLm1vZGVfbWVudS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nbW9kZSA9IDE7XG4gICAgICAgIHRoaXMuYm90dG9tTGFiZWwuc3RyaW5nID0gJ1NlbGVjdCB0aGUgYW5pbWFsIHlvdSBoZWFyZC4gT25seSBvbmUgYW5pbWFsIGF0IHRoaXMgbGV2ZWwuJztcblxuICAgICAgICB0aGlzLmd1aWRlU3RhcnQoKTtcbiAgICB9LFxuICAgIG5vcm1hbDogZnVuY3Rpb24gbm9ybWFsKCkge1xuICAgICAgICB0aGlzLm1vZGVfbWVudS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nbW9kZSA9IDI7XG4gICAgICAgIHRoaXMuYm90dG9tTGFiZWwuc3RyaW5nID0gJ1R3byBhbmltYWxzIG1hZGUgc291bmRzIGF0IHRoZSBzYW1lIHRpbWUuIFRyeSB0byBmaW5kIHRoZW0uJztcblxuICAgICAgICB0aGlzLmd1aWRlU3RhcnQoKTtcbiAgICB9LFxuICAgIGhhcmQ6IGZ1bmN0aW9uIGhhcmQoKSB7XG4gICAgICAgIHRoaXMubW9kZV9tZW51LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdtb2RlID0gMztcbiAgICAgICAgdGhpcy5ib3R0b21MYWJlbC5zdHJpbmcgPSAnVGhyZWUgYW5pbWFscyBtYWRlIHNvdW5kcyBhdCB0aGUgc2FtZSB0aW1lLiBUcnkgdG8gZmluZCBhbGwgb2YgdGhlbS4nO1xuICAgICAgICB0aGlzLmd1aWRlU3RhcnQoKTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25DbGlja0d1aWRlOiBmdW5jdGlvbiBvbkNsaWNrR3VpZGUoKSB7XG4gICAgICAgIHRoaXMuZ3VpZGVfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm1vZGVfbWVudS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuXG4gICAgICAgIC8v5Yqo5L2cXG4gICAgICAgIHZhciBwb3MgPSBjYy52MigxMTgsIDIpO1xuICAgICAgICB0aGlzLm1vdmVoYW5kLm5vZGUuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgICAgdmFyIG1vdmVUbyA9IGNjLm1vdmVUbygwLjMsIGNjLnYyKDEyNSwgMTcpKTtcbiAgICAgICAgdmFyIG1vdmVCYWNrID0gY2MubW92ZVRvKDAuMywgY2MudjIoMTE4LCAyKSk7XG5cbiAgICAgICAgdGhpcy5hY3Rpb24gPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKG1vdmVUbywgbW92ZUJhY2spKTtcbiAgICAgICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG4gICAgfSxcblxuICAgIGd1aWRlU3RhcnQ6IGZ1bmN0aW9uIGd1aWRlU3RhcnQoKSB7XG4gICAgICAgIGd1aWRlKCdzcGVha2VyJywgWycwMy9ndWlkZS0xJywgJzAzL2d1aWRlLTInXSwgdGhpcy5vbkd1aWRlRW5kLmJpbmQodGhpcykpO1xuICAgIH0sXG4gICAgb25HdWlkZUVuZDogZnVuY3Rpb24gb25HdWlkZUVuZCgpIHtcbiAgICAgICAgdGhpcy5zZXRhY3RpdmUoKTtcbiAgICB9LFxuXG4gICAgZ2V0UmFuZG9tTnVtOiBmdW5jdGlvbiBnZXRSYW5kb21OdW0oTWluLCBNYXgpIHtcbiAgICAgICAgdmFyIFJhbmdlID0gTWF4IC0gTWluO1xuICAgICAgICB2YXIgUmFuZCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiBNaW4gKyBNYXRoLnJvdW5kKFJhbmQgKiBSYW5nZSk7XG4gICAgfSxcblxuICAgIF9wbGF5U0ZYOiBmdW5jdGlvbiBfcGxheVNGWChjbGlwKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoY2xpcCwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBwbGF5ZXJyb3I6IGZ1bmN0aW9uIHBsYXllcnJvcigpIHtcbiAgICAgICAgdGhpcy5fcGxheVNGWCh0aGlzLmVycm9yQXVkaW8pO1xuICAgIH0sXG5cbiAgICBwbGF5cmlnaHQ6IGZ1bmN0aW9uIHBsYXlyaWdodCgpIHtcbiAgICAgICAgdGhpcy5fcGxheVNGWCh0aGlzLmF1ZGlvUmlnaHQpO1xuICAgIH0sXG5cbiAgICBwbGF5c3VjY2VzczogZnVuY3Rpb24gcGxheXN1Y2Nlc3MoKSB7XG4gICAgICAgIHRoaXMuX3BsYXlTRlgodGhpcy5hdWRpb1N1Y2Nlc3MpO1xuICAgIH0sXG5cbiAgICBzZXRhY3RpdmU6IGZ1bmN0aW9uIHNldGFjdGl2ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmJzdGFydGdhbWUgPSB0cnVlO1xuICAgICAgICB0aGlzLl90aW1lID0gMDtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIC8v6ZqP5py65Yqo54mpXG4gICAgICAgIHRoaXMuYW5pbXMgPSBfLm1hcChfLnJhbmdlKDAsIHRoaXMuZ21vZGUpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IF90aGlzLmdldFJhbmRvbU51bSgxLCAxMCk7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGxheUVmZmVjdCgpO1xuXG4gICAgICAgIC8v5a+55Zu+54mH6L+b6KGM6ZqP5py66YCJ5oup5ZKM5o6S5bqP77yMMX40LDExfjE0LuOAguOAguavj+S4qumAieaLqeS4gOS4qu+8jOWOi+WFpeaVsOe7hFxuICAgICAgICB0aGlzLmluaXRBbGxQaWMoKTtcbiAgICB9LFxuICAgIHBsYXlFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlFZmZlY3QoKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYW5pbXMpO1xuICAgICAgICBfLmVhY2godGhpcy5hbmltcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIC8v5pKt5pS+6YCJ5oup55qE6Z+z5LmQXG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KF90aGlzMlsnYXVkaW8nICsgc3ByaW50ZignJTAyZCcsIGkpXSwgZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcblxuICAgICAgICB2YXIgUG9zID0gY2MucCgtMjAwMCwgLTIwMDApO1xuICAgICAgICB0aGlzLmNob29zZTEubm9kZS5zZXRQb3NpdGlvbihQb3MpO1xuICAgICAgICB0aGlzLmNob29zZTIubm9kZS5zZXRQb3NpdGlvbihQb3MpO1xuICAgICAgICB0aGlzLnRpbWVTdGF0dXMgPT0gMDtcblxuICAgICAgICB0aGlzLnNldGFjdGl2ZSgpO1xuICAgIH0sXG4gICAgaW5pdEFsbFBpYzogZnVuY3Rpb24gaW5pdEFsbFBpYygpIHtcbiAgICAgICAgdmFyIG51bUFycmF5ID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwXTtcbiAgICAgICAgdmFyIG90aGVycyA9IFsxMDEsIDEwMiwgMTAzLCAxMDQsIDEwNSwgMTA2LCAxMDcsIDEwOCwgMTA5LCAxMTAsIDExMSwgMTEyXTtcbiAgICAgICAgLy/mlbDnu4TkubHluo9cbiAgICAgICAgbnVtQXJyYXkuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA+IDAuNSA/IC0xIDogMTtcbiAgICAgICAgfSk7XG4gICAgICAgIG90aGVycy5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpID4gMC41ID8gLTEgOiAxO1xuICAgICAgICB9KTtcbiAgICAgICAgb3RoZXJzLnBvcCgpO1xuICAgICAgICBvdGhlcnMucG9wKCk7XG5cbiAgICAgICAgdGhpcy5yYW5OdW1BcnJheSA9IG51bUFycmF5LmNvbmNhdChvdGhlcnMpLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPiAwLjUgPyAtMSA6IDE7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmFuTnVtQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2V0cGljKHRoaXMucmFuTnVtQXJyYXlbaV0sIHRoaXNbJ2l0ZW0nICsgKGkgKyAxKV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldHBpYzogZnVuY3Rpb24gc2V0cGljKGluZGV4LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIHBhdGggPSBcIjAzL3ByZS9cIiArIGluZGV4O1xuXG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHBhdGgsIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHZhciByZWFsVXJsID0gY2MudXJsLnJhdyhwYXRoKTtcbiAgICAgICAgLy8gdmFyIHRleHR1cmUgPSBjYy50ZXh0dXJlQ2FjaGUuYWRkSW1hZ2UocmVhbFVybCk7XG4gICAgICAgIC8vIHRhcmdldC5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgIH0sXG4gICAgc2V0Q2hvb3NlOiBmdW5jdGlvbiBzZXRDaG9vc2UodGFyZ2V0KSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJzZXRDaG9vc2VcIik7XG4gICAgICAgIHZhciB4ID0gdGFyZ2V0Lm5vZGUuZ2V0UG9zaXRpb24oKS54O1xuICAgICAgICB2YXIgeSA9IHRhcmdldC5ub2RlLmdldFBvc2l0aW9uKCkueTtcbiAgICAgICAgdmFyIFBvcyA9IGNjLnAoeCwgeSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHgsIFwiLFwiLCB5KTtcblxuICAgICAgICB2YXIgY2hvb3NlX25vZGUgPSB0aGlzWydjaG9vc2UnICsgdGhpcy5yZWNvcmRzLmxlbmd0aF07XG5cbiAgICAgICAgdGhpcy5wbGF5cmlnaHQoKTtcbiAgICAgICAgY2hvb3NlX25vZGUubm9kZS5zZXRQb3NpdGlvbihQb3MpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlY29yZHMubGVuZ3RoICE9IHRoaXMuYW5pbXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy50aW1lU3RhdHVzID0gLTE7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIOaSreaUvuaIkOWKn+mfs+S5kFxuICAgICAgICAgICAgdGhpcy5wbGF5c3VjY2VzcygpO1xuICAgICAgICB9LCAxKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8g6L+Z6YeM55qEIHRoaXMg5oyH5ZCRIGNvbXBvbmVudFxuICAgICAgICAgICAgLy90aGlzLmdvbmV4dCgpO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgfSwgMik7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24gZmluaXNoKCkge1xuXG4gICAgICAgIHZhciByZWdleCA9IC8oWzAtOV0rXFwuWzAtOV17Mn0pWzAtOV0qLztcbiAgICAgICAgdmFyIHRpbWVTdHIgPSBTdHJpbmcodGhpcy5fdGltZSk7XG4gICAgICAgIHZhciBmaW5hbFN0ciA9IHRpbWVTdHIucmVwbGFjZShyZWdleCwgXCIkMVwiKTtcbiAgICAgICAgdGhpcy51c2V0aW1lID0gZmluYWxTdHI7XG5cbiAgICAgICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdzcGVha2VyJywgdGhpcy51c2V0aW1lLCB0cnVlKTtcbiAgICAgICAgU2NvcmVWaWV3LnNob3coJ3NwZWFrZXInLCB0aGlzLnVzZXRpbWUsIHRydWUpO1xuXG4gICAgICAgIC8vdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAoIXRoaXMuYnN0YXJ0Z2FtZSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy50aW1lU3RhdHVzID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgKz0gZHQ7XG4gICAgICAgICAgICAvLyBb5q2j5YiZ6KGo6L6+5byPXeiOt+WPluWwj+aVsOeCueWQjuS4ieS9jVxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gLyhbMC05XStcXC5bMC05XXsyfSlbMC05XSovO1xuICAgICAgICAgICAgdmFyIHRpbWVTdHIgPSBTdHJpbmcodGhpcy5fdGltZSk7XG4gICAgICAgICAgICB2YXIgZmluYWxTdHIgPSB0aW1lU3RyLnJlcGxhY2UocmVnZXgsIFwiJDFcIik7XG4gICAgICAgICAgICBmaW5hbFN0ciA9IGZpbmFsU3RyICsgXCJzXCI7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnN0cmluZyA9IGZpbmFsU3RyO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnb25leHQ6IGZ1bmN0aW9uIGdvbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5hY3RpdmUgPT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdvbmV4dCBnYW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sYXN0LnNldGFjdGl2ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyMjIgZ2FtZVwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaXNDb3JyZWN0OiBmdW5jdGlvbiBpc0NvcnJlY3QobnVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1zLmluZGV4T2YobnVtKSAhPSAtMTtcbiAgICB9LFxuICAgIGlzSW5SZWNvcmRzOiBmdW5jdGlvbiBpc0luUmVjb3JkcyhudW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3Jkcy5pbmRleE9mKG51bSkgIT0gLTE7XG4gICAgfSxcbiAgICBpdGVtY2xpY2s6IGZ1bmN0aW9uIGl0ZW1jbGljayhlLCBpbmRleCkge1xuICAgICAgICB2YXIgdG1wID0gcGFyc2VJbnQodGhpcy5yYW5OdW1BcnJheVtpbmRleCAqIDEgLSAxXSk7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdCh0bXApICYmICF0aGlzLmlzSW5SZWNvcmRzKHRtcCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKHRtcCk7XG4gICAgICAgICAgICB0aGlzLnNldENob29zZSh0aGlzWydpdGVtJyArIGluZGV4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllcnJvcigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlcGxheTogZnVuY3Rpb24gcmVwbGF5KCkge1xuICAgICAgICB0aGlzLnBsYXlFZmZlY3QoKTtcbiAgICAgICAgLy8gY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCggdGhpcy5yYW5BZHVpbywgZmFsc2UgKTtcbiAgICB9LFxuXG4gICAgZ29Ib21lOiBmdW5jdGlvbiBnb0hvbWUoKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJnb0hvbWVcIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIk1haW5TY2VuZVwiKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjMwY2E5LzJRZEp1YW5EYnBOK0dTdGwnLCAnczAzX2luc19hbHllcicpO1xuLy8gc2NyaXB0c1xcMDNcXHMwM19pbnNfYWx5ZXIuanNcblxudmFyIGdhbWUgPSByZXF1aXJlKCdzMDNfZ2FtZV9sYXllcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ2FtZTogZ2FtZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIjExMTExMSBpbnNcIik7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuYWN0aXZlID09IHRydWUpIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnb25leHQgaW5zXCIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnNldGFjdGl2ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyMjIgaW5zXCIpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzg3ZjE4djZBV3BQemFSeHo0Z2lIV2FsJywgJ3MwM19sYXN0X2xheWVyJyk7XG4vLyBzY3JpcHRzXFwwM1xcczAzX2xhc3RfbGF5ZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcbiAgICBzZXRhY3RpdmU6IGZ1bmN0aW9uIHNldGFjdGl2ZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGdvTWFpbjogZnVuY3Rpb24gZ29NYWluKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJNYWluU2NlbmVcIik7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk5MWQ5TVpkb0ZLaUlJS3ViWFdzL3NqJywgJ3MwNF9nYW1lJyk7XG4vLyBzY3JpcHRzXFwwNFxcczA0X2dhbWUuanNcblxuXG52YXIgU2NvcmVWaWV3ID0gcmVxdWlyZSgnLi4vY29tbW9uL1Njb3JlVmlldycpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9kZXZpY2UnKTtcbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL2dhbWUnKTtcbnZhciBFYXRNYW5hZ2VyID0gcmVxdWlyZSgnRWF0TWFuYWdlcicpO1xudmFyIEZpc2ggPSByZXF1aXJlKCdGaXNoJyk7XG52YXIgU2Nyb2xsZXIgPSByZXF1aXJlKCdTY3JvbGxlcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdhbWVUaW1lOiAzMCxcbiAgICAgICAgYmFja2dyb3VuZDogY2MuTm9kZSxcbiAgICAgICAgZWF0TWFuYWdlcjogRWF0TWFuYWdlcixcbiAgICAgICAgZmlzaDogRmlzaCxcbiAgICAgICAgdGltZUxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgc2NvcmVMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIGhwTm9kZXM6IFtjYy5Ob2RlXVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmhwID0gMztcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuZW5hYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maXNoLmluaXQodGhpcyk7XG4gICAgICAgIHRoaXMuX2RlY2liZWxDaGFuZ2UgPSBmYWxzZTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9nYW1lU3RhcnQoKTtcbiAgICAgICAgfSwgMTApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmluaXRFdmVudCgpO1xuICAgICAgICB9LCAyMDApO1xuICAgIH0sXG4gICAgaW5pdEV2ZW50OiBmdW5jdGlvbiBpbml0RXZlbnQoKSB7XG4gICAgICAgIGlmIChjYy5zeXMub3MgIT0gY2Muc3lzLk9TX0FORFJPSUQpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHtcbiAgICAgICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogdGhpcy5vblRhcC5iaW5kKHRoaXMpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzLmVhdE1hbmFnZXIubm9kZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLl9sb2FkRGVjaWJlbCwgMSAvIDE1KTtcbiAgICB9LFxuICAgIF9sb2FkRGVjaWJlbDogZnVuY3Rpb24gX2xvYWREZWNpYmVsKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBkZXZpY2UuZ2V0RGVjaWJlbCgpO1xuICAgICAgICAvLyBjYy5sb2codmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgPj0gMzUpIHtcbiAgICAgICAgICAgIHRoaXMub25UYXAoKTtcbiAgICAgICAgICAgIHRoaXMuX2RlY2liZWxDaGFuZ2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblRhcDogZnVuY3Rpb24gb25UYXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5maXNoLnJpc2UoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBfZ2FtZVN0YXJ0OiBmdW5jdGlvbiBfZ2FtZVN0YXJ0KCkge1xuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5lYXRNYW5hZ2VyLnN0YXJ0U3Bhd24oKTtcbiAgICAgICAgdGhpcy5maXNoLnN0YXJ0Rmx5KCk7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICAgICAgICBkZXZpY2UucmVjb3JkU3RhcnQoKTtcbiAgICB9LFxuXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB0aGlzLmZpc2guaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmFibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmRUaW1lcigpO1xuICAgICAgICB0aGlzLmVhdE1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmdldENvbXBvbmVudChTY3JvbGxlcikuc3RvcFNjcm9sbCgpO1xuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fbG9hZERlY2liZWwpO1xuICAgICAgICBkZXZpY2UucmVjb3JkU3RvcCgpO1xuICAgICAgICBpZiAoIXRoaXMuX2RlY2liZWxDaGFuZ2UpIHtcbiAgICAgICAgICAgIGdhbWUuY29uZmlybSgnVGhlIG1pY3JvcGhvbmUgZGlkIG5vdCBkZXRlY3QgYSBsb3VkIGVub3VnaCB2b2ljZS4gRGlkIHlvdSBtYWtlIGFuIGF1ZGlibGUgc291bmQ/JywgZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYikge1xuICAgICAgICAgICAgICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ21pY3JvcGhvbmUnLCAnbm90IHdvcmsnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIFNjb3JlVmlldy5zaG93KCdtaWNyb3Bob25lJywgJ25vdCB3b3JrJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdhbWUucG9zdEdhbWVTY29yZSgnbWljcm9waG9uZScsIHRoaXMuc2NvcmUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBTY29yZVZpZXcuc2hvdygnbWljcm9waG9uZScsIHRoaXMuc2NvcmUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdtaWNyb3Bob25lJywgX3RoaXMyLnNjb3JlLCB0cnVlKTtcbiAgICAgICAgICAgIFNjb3JlVmlldy5zaG93KCdtaWNyb3Bob25lJywgX3RoaXMyLnNjb3JlLCB0cnVlKTtcbiAgICAgICAgfSwgMiAqIDEwMDApO1xuICAgIH0sXG5cbiAgICBhZGRIcDogZnVuY3Rpb24gYWRkSHAoKSB7XG4gICAgICAgIHRoaXMuaHArKztcbiAgICAgICAgaWYgKHRoaXMuaHAgPj0gMykge1xuICAgICAgICAgICAgdGhpcy5ocCA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVIcCgpO1xuICAgIH0sXG4gICAgc3ViSHA6IGZ1bmN0aW9uIHN1YkhwKCkge1xuICAgICAgICB0aGlzLmhwLS07XG4gICAgICAgIGlmICh0aGlzLmhwIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuaHAgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlSHAoKTtcbiAgICB9LFxuICAgIGFkZFNjb3JlOiBmdW5jdGlvbiBhZGRTY29yZShuKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gbjtcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuICAgIH0sXG4gICAgc3ViU2NvcmU6IGZ1bmN0aW9uIHN1YlNjb3JlKG4pIHtcbiAgICAgICAgdGhpcy5zY29yZSAtPSBuO1xuICAgICAgICBpZiAodGhpcy5zY29yZSA8PSAwKSB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlU2NvcmU6IGZ1bmN0aW9uIHVwZGF0ZVNjb3JlKCkge1xuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5zY29yZS50b1N0cmluZygpO1xuICAgIH0sXG4gICAgdXBkYXRlSHA6IGZ1bmN0aW9uIHVwZGF0ZUhwKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5ocE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuaHBOb2Rlc1tpXTtcbiAgICAgICAgICAgIG5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmhwOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaHBOb2Rlc1tpXS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydFRpbWVyOiBmdW5jdGlvbiBzdGFydFRpbWVyKCkge1xuICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5nYW1lVGltZTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLl91cGRhdGVUaW1lciwgMC4xKTtcbiAgICB9LFxuICAgIF91cGRhdGVUaW1lcjogZnVuY3Rpb24gX3VwZGF0ZVRpbWVyKGR0KSB7XG4gICAgICAgIHRoaXMuX3RpbWUgKz0gZHQ7XG4gICAgICAgIC8vaWYodGhpcy5fdGltZSA8PSAwICl7XG4gICAgICAgIC8vICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgICAgICAvLyAgICB0aGlzLmdhbWVPdmVyKCk7XG4gICAgICAgIC8vfVxuICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fdGltZS50b0ZpeGVkKDIpICogMTtcbiAgICAgICAgdmFyIHN0ciA9IHRoaXMuX3RpbWUgKyAncyc7XG4gICAgICAgIHRoaXMudGltZUxhYmVsLnN0cmluZyA9IHN0cjtcbiAgICB9LFxuICAgIGVuZFRpbWVyOiBmdW5jdGlvbiBlbmRUaW1lcigpIHtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuX3VwZGF0ZVRpbWVyKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzljNDFiZ1NmcVJMNWI4eGMwZ0FFaTdBJywgJ3MwNF9pbnMyX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwwNFxcczA0X2luczJfbGF5ZXIuanNcblxuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG52YXIgZ3VpZGUgPSByZXF1aXJlKCcuLi9jb21tb24vZ3VpZGUnKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTsgXG5cbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBndWlkZSgnbWljcm9waG9uZScsIFsnMDQvZ3VpZGUtMScsICcwNC9ndWlkZS0yJywgJzA0L2d1aWRlLTMnLCAnMDQvZ3VpZGUtNCddLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJzA0X2dhbWUnKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldGFjdGl2ZTogZnVuY3Rpb24gc2V0YWN0aXZlKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyZjUyOW1TTDdGRWRxeHIzRDRhcXlIZicsICdzMDRfaW5zX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwwNFxcczA0X2luc19sYXllci5qc1xuXG52YXIgcmVjID0gcmVxdWlyZSgnczA0X3JlY29yZF9sYXllcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlYzogcmVjXG4gICAgfSxcblxuICAgIC8vIGZvbzoge1xuICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgIC8vIH0sXG4gICAgLy8gLi4uXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIGdvbmV4dDogZnVuY3Rpb24gZ29uZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5ub2RlLmFjdGl2ZSA9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVjLnNldGFjdGl2ZSgpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzRmOWU3U0IzNDVPY2FWcnBtUWVQdTFRJywgJ3MwNF9yZWNvcmRfbGF5ZXInKTtcbi8vIHNjcmlwdHNcXDA0XFxzMDRfcmVjb3JkX2xheWVyLmpzXG5cbnZhciBSZXN1bHQgPSByZXF1aXJlKCdzMDRfcmVzdWx0X2xheWVyJyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL2RldmljZScpO1xudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vZ2FtZScpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgd2F2ZUFuaW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkFuaW1hdGlvblxuICAgICAgICB9LFxuICAgICAgICByZWNidG46IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IFJlc3VsdCxcblxuICAgICAgICBndWlkZV9ub2RlOiBjYy5Ob2RlXG4gICAgfSxcblxuICAgIHNldGFjdGl2ZTogZnVuY3Rpb24gc2V0YWN0aXZlKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb25DbGlja0d1aWRlOiBmdW5jdGlvbiBvbkNsaWNrR3VpZGUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib25DbGlja0d1aWRlXCIpO1xuICAgICAgICB0aGlzLmd1aWRlX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2V0YWN0aXZlKCk7XG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy90aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIC8vIOa3u+WKoOWNleeCueinpuaRuOS6i+S7tuebkeWQrOWZqFxuICAgICAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgICAgICAgb25Ub3VjaEJlZ2FuOiB0aGlzLl9vblRvdWNoU3RhcnQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIG9uVG91Y2hNb3ZlOiBmdW5jdGlvbiBvblRvdWNoTW92ZSgpIHt9LFxuICAgICAgICAgICAgb25Ub3VjaEVuZGVkOiB0aGlzLl9vblRvdWNoRW5kLmJpbmQodGhpcyksXG4gICAgICAgICAgICBvblRvdWNoQ2FuY2VsbGVkOiB0aGlzLl9vblRvdWNoRW5kLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzLnJlY2J0bi5ub2RlKTtcbiAgICB9LFxuICAgIF9vblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIF9vblRvdWNoU3RhcnQodG91Y2hlLCBldmVudCkge1xuICAgICAgICB2YXIgcmVjdCA9IHRoaXMucmVjYnRuLm5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgIHZhciByZWIgPSBjYy5yZWN0Q29udGFpbnNQb2ludChyZWN0LCB0b3VjaGUuZ2V0TG9jYXRpb24oKSk7XG4gICAgICAgIGlmIChyZWIpIHtcbiAgICAgICAgICAgIHZhciBhbmltID0gdGhpcy53YXZlQW5pbTtcbiAgICAgICAgICAgIGFuaW0ucGxheSgpO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGRldmljZS5yZWNvcmRTdGFydCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEVuZDogZnVuY3Rpb24gX29uVG91Y2hFbmQodG91Y2hlLCBldmVudCkge1xuICAgICAgICB2YXIgYW5pbSA9IHRoaXMud2F2ZUFuaW07XG4gICAgICAgIGFuaW0uc3RvcCgpO1xuICAgICAgICBkZXZpY2UucmVjb3JkU3RvcCgpO1xuXG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gdGhpcy5fc3RhcnRUaW1lIDw9IDEwMDApIHtcbiAgICAgICAgICAgIGdhbWUuc2hvd1RpcHMoJ3RvbyBzaG9ydCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0LnNldGFjdGl2ZSgpO1xuICAgICAgICB9LCAxKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJlNWE0ZmJBNFZIMHBFVnoxRDQrL2N4JywgJ3MwNF9yZXN1bHRfbGF5ZXInKTtcbi8vIHNjcmlwdHNcXDA0XFxzMDRfcmVzdWx0X2xheWVyLmpzXG5cblxudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9kZXZpY2UnKTtcbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL2dhbWUnKTtcbnZhciBTY29yZVZpZXcgPSByZXF1aXJlKCcuLi9jb21tb24vU2NvcmVWaWV3Jyk7XG5cbnZhciBJbnMyID0gcmVxdWlyZSgnczA0X2luczJfbGF5ZXInKTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpbnM6IEluczJcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRhY3RpdmU6IGZ1bmN0aW9uIHNldGFjdGl2ZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgfSxcbiAgICByZXBhbHlNaWM6IGZ1bmN0aW9uIHJlcGFseU1pYygpIHtcbiAgICAgICAgZGV2aWNlLnBsYXlSZWNvcmQoKTtcbiAgICB9LFxuICAgIG9uWWVzOiBmdW5jdGlvbiBvblllcygpIHtcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5sb2FkU2NlbmUoJzA0X2dhbWUnKTtcbiAgICAgICAgLy/mmL7npLowNGdhbWXnmoTor7TmmI5cbiAgICAgICAgdGhpcy5pbnMuc2V0YWN0aXZlKCk7XG4gICAgfSxcbiAgICBvbk5vOiBmdW5jdGlvbiBvbk5vKCkge1xuICAgICAgICAvL2NjLmRpcmVjdG9yLmxvYWRTY2VuZSgnMDRfZ2FtZScpO1xuICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ21pY3JvcGhvbmUnLCAwLCBmYWxzZSk7XG4gICAgICAgIFNjb3JlVmlldy5zaG93KCdtaWNyb3Bob25lJywgMCwgZmFsc2UpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGFkMDVROUVQOUdvcW54RUJlUkQzbjQnLCAnczA1Jyk7XG4vLyBzY3JpcHRzXFwwNVxcczA1LmpzXG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWUnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vRGV2aWNlJyk7XG52YXIgU2NvcmVWaWV3ID0gcmVxdWlyZSgnLi4vY29tbW9uL1Njb3JlVmlldycpO1xuXG5jYy5DbGFzcyh7XG4gICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBiYWNrQ2FtZXJhOiBjYy5Ob2RlLFxuICAgIGZyb250Q2FtZXJhOiBjYy5Ob2RlLFxuICAgIGNvbXBvdW5kOiBjYy5Ob2RlLFxuICAgIGNvbnRlbnQ6IGNjLk5vZGUsXG4gICAgdG9wQmFyOiBjYy5Ob2RlLFxuICAgIGJvdHRvbUJhcjogY2MuTm9kZSxcbiAgICBwaG90b0J0bjogY2MuTm9kZVxuICB9LFxuXG4gIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICB0aGlzLmdsYXNzRmlsZSA9ICdyZXMvcmF3LWFzc2V0cy9yZXNvdXJjZXMvMDUvZ2xhc3MnICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA0KSArICcucG5nJztcbiAgICB0aGlzLmJhY2tGaWxlID0gbnVsbDtcbiAgICB0aGlzLmZyb250RmlsZSA9IG51bGw7XG4gICAgdGhpcy5iYWNrQ2FtZXJhSWQgPSBkZXZpY2UuZ2V0QmFja0NhbWVyYUlkKCk7XG4gICAgdGhpcy5mcm9udENhbWVyYUlkID0gZGV2aWNlLmdldEZyb250Q2FtZXJhSWQoKTtcblxuICAgIHRoaXMuaGlkZUJhcigpO1xuICAgIHNldFRpbWVvdXQodGhpcy5zaG93QmFja0NhbWVyYS5iaW5kKHRoaXMpLCAxMDApO1xuICB9LFxuICBvbkRpc2FibGU6IGZ1bmN0aW9uIG9uRGlzYWJsZSgpIHtcbiAgICB0aGlzLmVuZENhbWVyYSgpO1xuICB9LFxuICBzaG93QmFja0NhbWVyYTogZnVuY3Rpb24gc2hvd0JhY2tDYW1lcmEoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuc2hvd0JhcigpO1xuXG4gICAgdGhpcy5iYWNrQ2FtZXJhLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5mcm9udENhbWVyYS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmNvbXBvdW5kLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RhcnRDYW1lcmEodGhpcy5iYWNrQ2FtZXJhSWQpO1xuXG4gICAgZ2FtZS5jb25maXJtKCdJcyB5b3VyIGJhY2sgY2FtZXJhIGFjdGl2YXRlZD8nLCBmdW5jdGlvbiAoYikge1xuICAgICAgaWYgKCFiKSB7XG4gICAgICAgIF90aGlzLmhpZGVCYXIoKTtcbiAgICAgICAgX3RoaXMuc2hvd0Zyb250Q2FtZXJhKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHNob3dGcm9udENhbWVyYTogZnVuY3Rpb24gc2hvd0Zyb250Q2FtZXJhKCkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgdGhpcy5zaG93QmFyKCk7XG4gICAgdGhpcy5iYWNrQ2FtZXJhLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZnJvbnRDYW1lcmEuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmNvbXBvdW5kLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RhcnRDYW1lcmEodGhpcy5mcm9udENhbWVyYUlkKTtcblxuICAgIHZhciB3aW5TaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgIHZhciBzdGVuY2lsID0gbmV3IF9jY3NnLlNwcml0ZSgncmVzL3Jhdy1hc3NldHMvcmVzb3VyY2VzLzA1L3RvcF9ib2R5LnBuZycpO1xuICAgIHZhciBjbiA9IG5ldyBjYy5DbGlwcGluZ05vZGUoc3RlbmNpbCk7XG4gICAgY24uc2V0Q29udGVudFNpemUod2luU2l6ZSk7XG4gICAgY24uc2V0SW52ZXJ0ZWQodHJ1ZSk7XG4gICAgY24uc2V0QWxwaGFUaHJlc2hvbGQoMC4wNSk7XG5cbiAgICB2YXIgYmcgPSBuZXcgX2Njc2cuU3ByaXRlKHRoaXMuYmFja0ZpbGUgfHwgJ3Jlcy9yYXctYXNzZXRzL3Jlc291cmNlcy8wNS9iZy5wbmcnKTtcbiAgICBiZy5zZXRTY2FsZSh3aW5TaXplLndpZHRoIC8gYmcuZ2V0Q29udGVudFNpemUoKS53aWR0aCk7XG4gICAgY24uYWRkQ2hpbGQoYmcpO1xuXG4gICAgdGhpcy5jb250ZW50Ll9zZ05vZGUuYWRkQ2hpbGQoY24sIDIpO1xuXG4gICAgdmFyIGdsYXNzID0gbmV3IF9jY3NnLlNwcml0ZSh0aGlzLmdsYXNzRmlsZSk7XG4gICAgdGhpcy5jb250ZW50Ll9zZ05vZGUuYWRkQ2hpbGQoZ2xhc3MsIDMpO1xuXG4gICAgZ2FtZS5jb25maXJtKCdJcyB5b3VyIGZyb250IGNhbWVyYSBhY3RpdmF0ZWQ/JywgZnVuY3Rpb24gKGIpIHtcbiAgICAgIGlmICghYikge1xuICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ2NhbWVyYXMnLCAnbm90IHdvcmsnLCBmYWxzZSk7XG4gICAgICAgIF90aGlzMi5vbk5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgc2hvd0NvbXBvdW5kOiBmdW5jdGlvbiBzaG93Q29tcG91bmQoKSB7XG4gICAgdGhpcy5jb250ZW50Ll9zZ05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB0aGlzLmJhY2tDYW1lcmEuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5mcm9udENhbWVyYS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmNvbXBvdW5kLmFjdGl2ZSA9IHRydWU7XG5cbiAgICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICB2YXIgc3RlbmNpbCA9IG5ldyBfY2NzZy5TcHJpdGUoJ3Jlcy9yYXctYXNzZXRzL3Jlc291cmNlcy8wNS90b3BfYm9keS5wbmcnKTtcbiAgICB2YXIgY24gPSBuZXcgY2MuQ2xpcHBpbmdOb2RlKHN0ZW5jaWwpO1xuICAgIGNuLnNldENvbnRlbnRTaXplKHdpblNpemUpO1xuICAgIGNuLnNldEludmVydGVkKHRydWUpO1xuICAgIGNuLnNldEFscGhhVGhyZXNob2xkKDAuMDUpO1xuXG4gICAgdmFyIGJnID0gbmV3IF9jY3NnLlNwcml0ZSh0aGlzLmJhY2tGaWxlIHx8ICdyZXMvcmF3LWFzc2V0cy9yZXNvdXJjZXMvMDUvYmcucG5nJyk7XG4gICAgYmcuc2V0U2NhbGUod2luU2l6ZS53aWR0aCAvIGJnLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xuICAgIGNuLmFkZENoaWxkKGJnKTtcblxuICAgIHRoaXMuY29udGVudC5fc2dOb2RlLmFkZENoaWxkKGNuLCAyKTtcblxuICAgIHZhciBnbGFzcyA9IG5ldyBfY2NzZy5TcHJpdGUodGhpcy5nbGFzc0ZpbGUpO1xuICAgIHRoaXMuY29udGVudC5fc2dOb2RlLmFkZENoaWxkKGdsYXNzLCAzKTtcblxuICAgIHZhciBmcm9udFNwID0gbmV3IF9jY3NnLlNwcml0ZSh0aGlzLmZyb250RmlsZSk7XG4gICAgZnJvbnRTcC5zZXRTY2FsZSh3aW5TaXplLndpZHRoIC8gZnJvbnRTcC5nZXRDb250ZW50U2l6ZSgpLndpZHRoKTtcbiAgICB0aGlzLmNvbnRlbnQuX3NnTm9kZS5hZGRDaGlsZChmcm9udFNwLCAxKTtcblxuICAgIHNldFRpbWVvdXQodGhpcy5zYXZlRmlsZS5iaW5kKHRoaXMpLCAxMCk7XG4gIH0sXG4gIHN0YXJ0Q2FtZXJhOiBmdW5jdGlvbiBzdGFydENhbWVyYShjYW1lcmFfaWQpIHtcbiAgICBkZXZpY2UuY2FtZXJhU3RhcnQoY2FtZXJhX2lkKTtcbiAgfSxcbiAgZW5kQ2FtZXJhOiBmdW5jdGlvbiBlbmRDYW1lcmEoKSB7XG4gICAgZGV2aWNlLmNhbWVyYVN0b3AoKTtcbiAgfSxcbiAgb25UYWtlQmFja1Bob3RvOiBmdW5jdGlvbiBvblRha2VCYWNrUGhvdG8oKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB0aGlzLmhpZGVCYXIoKTtcbiAgICBkZXZpY2UuY2FtZXJhQ2FwdHVyZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgX3RoaXMzLnNldEJhY2tCZyhmaWxlKTtcbiAgICB9KTtcbiAgfSxcbiAgb25UYWtlRnJvbnRQaG90bzogZnVuY3Rpb24gb25UYWtlRnJvbnRQaG90bygpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHRoaXMuaGlkZUJhcigpO1xuICAgIGRldmljZS5jYW1lcmFDYXB0dXJlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICBfdGhpczQuc2V0RnJvbnRCZyhmaWxlKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0QmFja0JnOiBmdW5jdGlvbiBzZXRCYWNrQmcoZmlsZSkge1xuICAgIHRoaXMuYmFja0ZpbGUgPSBmaWxlO1xuICAgIHRoaXMuZW5kQ2FtZXJhKCk7XG4gICAgdGhpcy5iYWNrQ2FtZXJhLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHNldFRpbWVvdXQodGhpcy5zaG93RnJvbnRDYW1lcmEuYmluZCh0aGlzKSwgMTAwMCk7XG4gIH0sXG4gIHNldEZyb250Qmc6IGZ1bmN0aW9uIHNldEZyb250QmcoZmlsZSkge1xuICAgIHRoaXMuZnJvbnRGaWxlID0gZmlsZTtcbiAgICB0aGlzLmVuZENhbWVyYSgpO1xuICAgIHRoaXMuc2hvd0NvbXBvdW5kKCk7XG4gIH0sXG4gIG9uU2VsZWN0UGhvdG86IGZ1bmN0aW9uIG9uU2VsZWN0UGhvdG8oKSB7fSxcbiAgb25TaGFyZTogZnVuY3Rpb24gb25TaGFyZSgpIHtcbiAgICBkZXZpY2Uuc2hhcmVUb090aGVyQXBwKHRoaXMucGhvdG9GaWxlKTtcbiAgfSxcbiAgb25OZXh0OiBmdW5jdGlvbiBvbk5leHQoKSB7XG4gICAgZ2FtZS5zaG93TmV4dEdhbWUoJ2NhbWVyYXMnKTtcbiAgfSxcbiAgb25SZVBsYXk6IGZ1bmN0aW9uIG9uUmVQbGF5KCkge1xuICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnMDUnKTtcbiAgfSxcbiAgc2hvd0JhcjogZnVuY3Rpb24gc2hvd0JhcigpIHtcbiAgICB0aGlzLnRvcEJhci5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuYm90dG9tQmFyLmFjdGl2ZSA9IHRydWU7XG4gIH0sXG4gIGhpZGVCYXI6IGZ1bmN0aW9uIGhpZGVCYXIoKSB7XG4gICAgdGhpcy50b3BCYXIuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5ib3R0b21CYXIuYWN0aXZlID0gZmFsc2U7XG4gIH0sXG4gIHNhdmVGaWxlOiBmdW5jdGlvbiBzYXZlRmlsZSgpIHtcbiAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgIHRoaXMuaGlkZUJhcigpO1xuXG4gICAgdmFyIHdpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG4gICAgdmFyIHJlbmRlclRleHR1cmUgPSBqc2IuUmVuZGVyVGV4dHVyZU15Q3JlYXRlKHdpblNpemUud2lkdGgsIHdpblNpemUuaGVpZ2h0KTtcblxuICAgIHJlbmRlclRleHR1cmUuYmVnaW4oKTtcbiAgICBjYy5kaXJlY3Rvci5nZXRSdW5uaW5nU2NlbmUoKS52aXNpdCgpO1xuICAgIHJlbmRlclRleHR1cmUuZW5kKCk7XG4gICAgdmFyIGZpbGVuYW1lID0gJ2NhbWVyYS0nICsgRGF0ZS5ub3coKSArICcucG5nJztcbiAgICB2YXIgZmlsZXBhdGggPSBqc2IuZmlsZVV0aWxzLmdldFdyaXRhYmxlUGF0aCgpICsgZmlsZW5hbWU7XG5cbiAgICByZW5kZXJUZXh0dXJlLnNhdmVUb0ZpbGUoZmlsZW5hbWUsIGNjLkltYWdlRm9ybWF0LlBORywgdHJ1ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgZGV2aWNlLmFkZFRvR2FsbGVyeShmaWxlcGF0aCk7XG4gICAgICBfdGhpczUucGhvdG9GaWxlID0gZmlsZXBhdGg7XG4gICAgICBfdGhpczUuc2hvd0JhcigpO1xuICAgICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdjYW1lcmFzJywgJ2lzIHdvcmsnLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4NzQ4OE9HUUFaRUo1NEJWK28rTzIrbScsICdzMDYnKTtcbi8vIHNjcmlwdHNcXDA2XFxzMDYuanNcblxudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vR2FtZScpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9EZXZpY2UnKTtcbnZhciBTY29yZVZpZXcgPSByZXF1aXJlKCcuLi9jb21tb24vU2NvcmVWaWV3Jyk7XG5cbmNjLkNsYXNzKHtcbiAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgcHJvcGVydGllczoge1xuICAgIGNvbnRyb2xsZXJQb3dlcjoge1xuICAgICAgJ2RlZmF1bHQnOiAwLjEsXG4gICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgfSxcbiAgICBtYXhQb3dlcjoge1xuICAgICAgJ2RlZmF1bHQnOiAxMDAwLFxuICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgIH0sXG4gICAgaW5zOiBjYy5Ob2RlLFxuICAgIGdhbWU6IGNjLk5vZGUsXG4gICAgLy9jb250cm9sbGVyOiBjYy5Ob2RlLFxuICAgIGxpZ2h0MTogY2MuTm9kZSxcbiAgICBsaWdodDI6IGNjLk5vZGUsXG5cbiAgICBhc2tOb2RlOiBjYy5Ob2RlLFxuICAgIHRpbWVMYWJlbDogY2MuTGFiZWwsXG5cbiAgICB6aGVuOiB7XG4gICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICB9LFxuXG4gICAgZ29vbjoge1xuICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgfSxcbiAgICBiMjoge1xuICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgfSxcblxuICAgIHN0b3BidG46IHtcbiAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgIH0sXG5cbiAgICBhY3Rpb246IG51bGwsXG5cbiAgICBzdGVwOiAwLFxuICAgIHBhdXNlOiBmYWxzZSxcblxuICAgIGZpbmlzaDogZmFsc2UsXG5cbiAgICBsZXZlbDoge1xuICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgfSxcblxuICAgIG1vZGVwYW5lbDoge1xuICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgdHlwZTogY2MuTm9kZVxuICAgIH0sXG4gICAgaW1vZGU6IDAsXG5cbiAgICBzcGVlZDogMSxcbiAgICBic3RhcnRnYW1lOiBmYWxzZSxcbiAgICBtb3ZlaGFuZDoge1xuICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgfVxuICB9LFxuXG4gIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgIHRoaXMuc3RlcCA9IDA7XG4gICAgLy90aGlzLmdhbWUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5fdXBkYXRlVGltZXIgPSB0aGlzLl91cGRhdGVUaW1lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3VyUG93ZXIgPSAwO1xuICAgIHRoaXMuYXNrTm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmxpZ2h0MS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5saWdodDIubm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgIC8v5Yqo5L2cXG4gICAgdmFyIHBvcyA9IGNjLnYyKDUwLCA1MCk7XG4gICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gICAgdmFyIG1vdmVUbyA9IGNjLm1vdmVUbygwLjMsIGNjLnYyKDYwLCA2MCkpO1xuICAgIHZhciBtb3ZlQmFjayA9IGNjLm1vdmVUbygwLjMsIGNjLnYyKDUwLCA1MCkpO1xuXG4gICAgdGhpcy5hY3Rpb24gPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKG1vdmVUbywgbW92ZUJhY2spKTtcbiAgICB0aGlzLm1vdmVoYW5kLm5vZGUucnVuQWN0aW9uKHRoaXMuYWN0aW9uKTtcblxuICAgIC8vdGhpcy5jb250cm9sbGVyX3BvcyA9IHRoaXMuY29udHJvbGxlci5ub2RlLmdldFBhcmVudCgpLmNvbnZlcnRUb1dvcmxkU3BhY2VBUih0aGlzLmNvbnRyb2xsZXIubm9kZS5wb3NpdGlvbik7XG5cbiAgICAvL2xldCBsaXN0ZW5lciA9IHtcbiAgICAvLyAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAvLyAgb25Ub3VjaEJlZ2FuOiB0aGlzLl9vblRvdWNoU3RhcnQuYmluZCh0aGlzKSxcbiAgICAvLyAgb25Ub3VjaE1vdmVkOiB0aGlzLl9vblRvdWNoTW92ZS5iaW5kKHRoaXMpLFxuICAgIC8vICBvblRvdWNoRW5kZWQ6IHRoaXMuX29uVG91Y2hFbmQuYmluZCh0aGlzKSxcbiAgICAvLyAgb25Ub3VjaENhbmNlbGxlZDogdGhpcy5fb25Ub3VjaEVuZC5iaW5kKHRoaXMpXG4gICAgLy99XG4gICAgLy90aGlzLl90b3VjaF9saXN0ZW5lciA9IGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpcy5jb250cm9sbGVyLm5vZGUpO1xuXG4gICAgLy90aGlzLnJlc2V0QmF0dGVyeSgpO1xuXG4gICAgdGhpcy5fdXBkYXRlVGltZXIoMCk7XG5cbiAgICB0aGlzLmZpbmlzaCA9IGZhbHNlO1xuICAgIHRoaXMubW9kZXBhbmVsLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zcGVlZCA9IDE7XG4gIH0sXG4gIHN0YXJ0VGltZXI6IGZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XG4gICAgdGhpcy5fdGltZSA9IDA7XG4gICAgdGhpcy5zY2hlZHVsZSh0aGlzLl91cGRhdGVUaW1lciwgMC4xKTtcbiAgfSxcbiAgX3VwZGF0ZVRpbWVyOiBmdW5jdGlvbiBfdXBkYXRlVGltZXIoZHQpIHtcbiAgICBpZiAoIXRoaXMuYnN0YXJ0Z2FtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl90aW1lICs9IGR0O1xuICAgIHRoaXMuX3RpbWUgPSB0aGlzLl90aW1lLnRvRml4ZWQoMikgKiAxO1xuICAgIHZhciBzdHIgPSB0aGlzLl90aW1lICsgJ3MnO1xuICAgIHRoaXMudGltZUxhYmVsLnN0cmluZyA9IHN0cjtcbiAgfSxcbiAgZW5kVGltZXI6IGZ1bmN0aW9uIGVuZFRpbWVyKCkge1xuICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLl91cGRhdGVUaW1lcik7XG4gIH0sXG4gIC8vcmVzZXRCYXR0ZXJ5OmZ1bmN0aW9uICgpe1xuICAvLyAgLy90aGlzLmNvbnRyb2xsZXIubm9kZS5yb3RhdGlvbiA9IDA7XG4gIC8vICB0aGlzLmN1clBvd2VyID0gMDtcbiAgLy8gIHRoaXMuX29mZnNldCA9IDA7XG4gIC8vICB0aGlzLnVwZGF0ZUJhdHRlcnkoKTtcbiAgLy9cbiAgLy99LFxuICAvL3VwZGF0ZUJhdHRlcnk6ZnVuY3Rpb24gKCl7XG4gIC8vICBsZXQgdyA9ICh0aGlzLmN1clBvd2VyIC8gdGhpcy5tYXhQb3dlcikgKiB0aGlzLmJhdHRlcnlfc2l6ZS53aWR0aDtcbiAgLy8gIHcgPSB3ID4gdGhpcy5iYXR0ZXJ5X3NpemUud2lkdGggPyB0aGlzLmJhdHRlcnlfc2l6ZS53aWR0aCA6IHc7XG4gIC8vICB0aGlzLmJhdHRlcnkubm9kZS5zZXRDb250ZW50U2l6ZShjYy5zaXplKHcsdGhpcy5iYXR0ZXJ5X3NpemUuaGVpZ2h0KSk7XG4gIC8vICBpZih3ID09IHRoaXMuYmF0dGVyeV9zaXplLndpZHRoICl7XG4gIC8vICAgICAgdGhpcy5mbGFzaCgpO1xuICAvLyAgfVxuICAvL30sXG4gIC8vX29uVG91Y2hTdGFydDogZnVuY3Rpb24odG91Y2hlLCBldmVudCkge1xuICAvLyAgbGV0IHJlY3QgPSB0aGlzLmNvbnRyb2xsZXIubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcbiAgLy8gIGxldCByZWIgPSBjYy5yZWN0Q29udGFpbnNQb2ludChyZWN0LHRvdWNoZS5nZXRMb2NhdGlvbigpKTtcbiAgLy8gIGlmKHJlYil7XG4gIC8vICAgICAgbGV0IHRvdWNoX3BvcyA9IHRvdWNoZS5nZXRMb2NhdGlvbigpO1xuICAvLyAgICAgIGxldCBhbmdsZVJhZGlhbnMgPSBjYy5wVG9BbmdsZShjYy5wU3ViKHRvdWNoX3Bvcyx0aGlzLmNvbnRyb2xsZXJfcG9zKSk7XG4gIC8vICAgICAgdGhpcy5fb2Zmc2V0ID0gY2MucmFkaWFuc1RvRGVncmVlcygtYW5nbGVSYWRpYW5zKTtcbiAgLy8gICAgICByZXR1cm4gdHJ1ZTtcbiAgLy8gIH1cbiAgLy8gIHJldHVybiBmYWxzZTtcbiAgLy99LFxuICAvL19vblRvdWNoTW92ZTogZnVuY3Rpb24odG91Y2hlLCBldmVudCkge1xuICAvLyAgbGV0IHRvdWNoX3BvcyA9IHRvdWNoZS5nZXRMb2NhdGlvbigpO1xuICAvLyAgbGV0IGFuZ2xlUmFkaWFucyA9IGNjLnBUb0FuZ2xlKGNjLnBTdWIodG91Y2hfcG9zLHRoaXMuY29udHJvbGxlcl9wb3MpKTtcbiAgLy8gIGxldCByb3QgPSBjYy5yYWRpYW5zVG9EZWdyZWVzKC1hbmdsZVJhZGlhbnMpO1xuICAvLyAgdGhpcy5jb250cm9sbGVyLm5vZGUucm90YXRpb24gPSByb3QgLSB0aGlzLl9vZmZzZXQ7XG4gIC8vXG4gIC8vICB0aGlzLmN1clBvd2VyICs9IChNYXRoLmFicyh0aGlzLmNvbnRyb2xsZXIubm9kZS5yb3RhdGlvbikvMjAwKTtcbiAgLy8gIHRoaXMudXBkYXRlQmF0dGVyeSgpO1xuICAvL30sXG4gIC8vX29uVG91Y2hFbmQ6IGZ1bmN0aW9uKHRvdWNoZSwgZXZlbnQpIHtcbiAgLy8gIHRoaXMucmVzZXRCYXR0ZXJ5KCk7XG4gIC8vfSxcbiAgZmxhc2g6IGZ1bmN0aW9uIGZsYXNoKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBkZXZpY2UuZmxhc2goKTtcblxuICAgIHRoaXMuZW5kVGltZXIoKTtcblxuICAgIHRoaXMubGlnaHQxLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5saWdodDIubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgdGhpcy5maW5pc2ggPSB0cnVlO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgLy90aGlzLmxpZ2h0MS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAvL3RoaXMubGlnaHQyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICBfdGhpcy5zaG93TXNnKCk7XG4gICAgfSwgMzAwMCk7XG4gICAgY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX3RvdWNoX2xpc3RlbmVyKTtcbiAgfSxcbiAgc2hvd01zZzogZnVuY3Rpb24gc2hvd01zZygpIHtcbiAgICB0aGlzLmFza05vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgfSxcbiAgYXNrWWVzOiBmdW5jdGlvbiBhc2tZZXMoKSB7XG5cbiAgICBkZXZpY2UuZmxhc2hTdG9wKCk7XG4gICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdmbGFzaGxpZ2h0JywgdGhpcy5fdGltZSwgdHJ1ZSk7XG4gICAgU2NvcmVWaWV3LnNob3coJ2ZsYXNobGlnaHQnLCB0aGlzLl90aW1lLCB0cnVlKTtcbiAgfSxcbiAgYXNrTm86IGZ1bmN0aW9uIGFza05vKCkge1xuICAgIGRldmljZS5mbGFzaFN0b3AoKTtcblxuICAgIGdhbWUucG9zdEdhbWVTY29yZSgnZmxhc2hsaWdodCcsIHRoaXMuX3RpbWUsIGZhbHNlKTtcbiAgICBTY29yZVZpZXcuc2hvdygnZmxhc2hsaWdodCcsIHRoaXMuX3RpbWUsIGZhbHNlKTtcbiAgfSxcblxuICBjbGlja0luczogZnVuY3Rpb24gY2xpY2tJbnMoKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja0luc1wiKTtcbiAgICB0aGlzLmlucy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmdhbWUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmJzdGFydGdhbWUgPSB0cnVlO1xuICAgIHRoaXMuc3RhcnRnbygpO1xuICB9LFxuXG4gIGNsaWNrQnRuOiBmdW5jdGlvbiBjbGlja0J0bigpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICh0aGlzLmZpbmlzaCkgcmV0dXJuO1xuXG4gICAgdGhpcy56aGVuLm5vZGUuc3RvcEFjdGlvbih0aGlzLmFjdGlvbik7XG4gICAgdGhpcy5zdG9wYnRuLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy50aWNrU3RvcCgpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpczIucGFseUdvb24oKTtcbiAgICAgIHZhciBwb3MgPSBjYy52MigxMCwgMTApO1xuICAgICAgX3RoaXMyLnpoZW4ubm9kZS5zZXRQb3NpdGlvbihwb3MpO1xuICAgICAgdmFyIG1vdmVUbyA9IGNjLm1vdmVUbyhfdGhpczIuc3BlZWQsIGNjLnYyKDMwMCwgMTApKTtcbiAgICAgIHZhciBtb3ZlQmFjayA9IGNjLm1vdmVUbyhfdGhpczIuc3BlZWQsIGNjLnYyKDAsIDEwKSk7XG5cbiAgICAgIF90aGlzMi5hY3Rpb24gPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKG1vdmVUbywgbW92ZUJhY2spKTtcbiAgICAgIF90aGlzMi56aGVuLm5vZGUucnVuQWN0aW9uKF90aGlzMi5hY3Rpb24pO1xuXG4gICAgICBjb25zb2xlLmxvZyhcImNsaWNrQnRuXCIpO1xuICAgICAgX3RoaXMyLnN0b3BidG4ubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIH0sIDEwMDApO1xuICB9LFxuXG4gIHRpY2tTdG9wOiBmdW5jdGlvbiB0aWNrU3RvcCgpIHtcblxuICAgIHZhciBwb2ludCA9IGNjLnYyKHRoaXMuemhlbi5ub2RlLnggKyAxMCwgdGhpcy56aGVuLm5vZGUueSArIDUwKTtcbiAgICB2YXIgaXNDb2xsaXNpb25FbmQgPSBjYy5yZWN0Q29udGFpbnNQb2ludChjYy5yZWN0KHRoaXMubGV2ZWwubm9kZS54LCB0aGlzLmxldmVsLm5vZGUueSwgdGhpcy5sZXZlbC5ub2RlLndpZHRoLCB0aGlzLmxldmVsLm5vZGUuaGVpZ2h0KSwgcG9pbnQpO1xuXG4gICAgY29uc29sZS5sb2coXCJwb2ludDpcIiwgdGhpcy56aGVuLm5vZGUueCArIDEwLCBcIiAgXCIsIHRoaXMuemhlbi5ub2RlLnkgKyA1MCk7XG4gICAgY29uc29sZS5sb2coXCJyZWN0Q29udGFpbnNQb2ludDpcIiwgdGhpcy5sZXZlbC5ub2RlLngsIFwiICBcIiwgdGhpcy5sZXZlbC5ub2RlLnksIFwiICBcIiwgdGhpcy5sZXZlbC5ub2RlLndpZHRoLCB0aGlzLmxldmVsLm5vZGUuaGVpZ2h0KTtcblxuICAgIGlmICghaXNDb2xsaXNpb25FbmQpIHtcbiAgICAgIHRoaXMudXBkYXRlQmF0dGVyeTIoLTIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZUJhdHRlcnkyKDEpO1xuICAgIH1cbiAgfSxcblxuICBnb1JVTjogZnVuY3Rpb24gZ29SVU4oKSB7XG5cbiAgICAvL3RoaXMuemhlbi5ub2RlLnJvdGF0aW9uID0gMDtcbiAgICAvL3RoaXMuZ28ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAvL3ZhciByb3RhdGVUbyA9IGNjLnJvdGF0ZUJ5ICAoMSwgMTgwKTtcbiAgICAvL3ZhciByb3RhdGVCYWNrID0gY2Mucm90YXRlQnkgKDEsIC0xODApO1xuICAgIC8vXG4gICAgLy90aGlzLmdvLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgLy90aGlzLmFjdGlvbiA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2Uocm90YXRlVG8scm90YXRlQmFjaykpXG4gICAgLy90aGlzLnpoZW4ubm9kZS5ydW5BY3Rpb24oIHRoaXMuYWN0aW9uICk7XG4gIH0sXG5cbiAgdXBkYXRlQmF0dGVyeTI6IGZ1bmN0aW9uIHVwZGF0ZUJhdHRlcnkyKHN0ZXApIHtcbiAgICBjb25zb2xlLmxvZyhcInVwZGF0ZUJhdHRlcnlvZjUgIHN0ZXA6XCIsIHN0ZXAsIFwiICBcIiwgdGhpcy5zdGVwKTtcblxuICAgIHRoaXMuc3RlcCA9IHRoaXMuc3RlcCArIHN0ZXA7XG4gICAgaWYgKHRoaXMuc3RlcCA8IDApIHRoaXMuc3RlcCA9IDA7XG4gICAgaWYgKHRoaXMuc3RlcCA+IDcpIHRoaXMuc3RlcCA9IDc7XG5cbiAgICAvL2xldCB3ID0gKHRoaXMuc3RlcCAvIDcpICogdGhpcy5iMl9zaXplLndpZHRoO1xuICAgIHRoaXMuYjIuZmlsbFJhbmdlID0gdGhpcy5zdGVwIC8gNztcbiAgICBpZiAodGhpcy5zdGVwID09IDcpIHtcbiAgICAgIHRoaXMuZmxhc2goKTtcbiAgICB9XG4gIH0sXG5cbiAgcGFseUdvb246IGZ1bmN0aW9uIHBhbHlHb29uKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdGhpcy5nb29uLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgIHZhciBhY3Rpb24gPSBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgNSksIGNjLnNjYWxlVG8oMC4yLCAxKSk7XG4gICAgdGhpcy5nb29uLm5vZGUucnVuQWN0aW9uKGFjdGlvbik7XG4gICAgY29uc29sZS5sb2coXCJwYWx5R29vblwiKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzMy5nb29uLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSwgNDAwKTtcbiAgfSxcblxuICBzZWxlY3QwMTogZnVuY3Rpb24gc2VsZWN0MDEoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZWxlY3QwMVwiKTtcbiAgICB0aGlzLmlucy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuaW1vZGUgPSAxO1xuICAgIHRoaXMuc3BlZWQgPSAxO1xuICAgIC8vL3RoaXMuc2V0cGljKDEsdGhpcy5sZXZlbCk7XG5cbiAgICB0aGlzLm1vZGVwYW5lbC5hY3RpdmUgPSBmYWxzZTtcblxuICAgIC8v5omT5Ye75Yy65Z+f55qE6K6+572uXG4gICAgdGhpcy5sZXZlbC5ub2RlLndpZHRoID0gMTAwO1xuICAgIHZhciBwb3MgPSBjYy52MigxNjUgLSB0aGlzLmxldmVsLm5vZGUud2lkdGggLyAyLCAyMCk7XG4gICAgdGhpcy5sZXZlbC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gIH0sXG5cbiAgc2VsZWN0MDI6IGZ1bmN0aW9uIHNlbGVjdDAyKCkge1xuICAgIGNvbnNvbGUubG9nKFwic2VsZWN0MDJcIik7XG4gICAgdGhpcy5pbnMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmltb2RlID0gMjtcbiAgICB0aGlzLnNwZWVkID0gMC44O1xuICAgIC8vdGhpcy5zZXRwaWMoMix0aGlzLmxldmVsKTtcbiAgICB0aGlzLm1vZGVwYW5lbC5hY3RpdmUgPSBmYWxzZTtcblxuICAgIC8v5omT5Ye75Yy65Z+f55qE6K6+572uXG4gICAgdGhpcy5sZXZlbC5ub2RlLndpZHRoID0gODA7XG4gICAgdmFyIHBvcyA9IGNjLnYyKDE2NSAtIHRoaXMubGV2ZWwubm9kZS53aWR0aCAvIDIsIDIwKTtcbiAgICB0aGlzLmxldmVsLm5vZGUuc2V0UG9zaXRpb24ocG9zKTtcbiAgfSxcblxuICBzZWxlY3QwMzogZnVuY3Rpb24gc2VsZWN0MDMoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZWxlY3QwM1wiKTtcbiAgICB0aGlzLmlucy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuaW1vZGUgPSAzO1xuICAgIHRoaXMuc3BlZWQgPSAwLjY7XG4gICAgLy90aGlzLnNldHBpYygzLHRoaXMubGV2ZWwpO1xuICAgIHRoaXMubW9kZXBhbmVsLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgLy/miZPlh7vljLrln5/nmoTorr7nva5cbiAgICB0aGlzLmxldmVsLm5vZGUud2lkdGggPSA2MDtcbiAgICB2YXIgcG9zID0gY2MudjIoMTY1IC0gdGhpcy5sZXZlbC5ub2RlLndpZHRoIC8gMiwgMjApO1xuICAgIHRoaXMubGV2ZWwubm9kZS5zZXRQb3NpdGlvbihwb3MpO1xuICB9LFxuXG4gIHNldHBpYzogZnVuY3Rpb24gc2V0cGljKGluZGV4LCB0YXJnZXQpIHtcbiAgICB2YXIgcGF0aCA9IFwicmVzb3VyY2VzLzA2L2xldmVsXCIgKyBpbmRleCArIFwiLnBuZ1wiO1xuICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgIHZhciByZWFsVXJsID0gY2MudXJsLnJhdyhwYXRoKTtcbiAgICB2YXIgdGV4dHVyZSA9IGNjLnRleHR1cmVDYWNoZS5hZGRJbWFnZShyZWFsVXJsKTtcbiAgICB0YXJnZXQuc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgfSxcblxuICBzdGFydGdvOiBmdW5jdGlvbiBzdGFydGdvKCkge1xuXG4gICAgdmFyIG1vdmVUbyA9IGNjLm1vdmVUbyh0aGlzLnNwZWVkLCBjYy52MigzMDAsIDEwKSk7XG4gICAgdmFyIG1vdmVCYWNrID0gY2MubW92ZVRvKHRoaXMuc3BlZWQsIGNjLnYyKDAsIDEwKSk7XG5cbiAgICB0aGlzLmFjdGlvbiA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UobW92ZVRvLCBtb3ZlQmFjaykpO1xuICAgIHRoaXMuemhlbi5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG4gICAgY29uc29sZS5sb2coXCJzdGFydFwiKTtcbiAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI5MDM3WHEraVJJeGFEYzJWOFNpak80JywgJ3MwN19iYXInKTtcbi8vIHNjcmlwdHNcXDA3XFxzMDdfYmFyLmpzXG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWUnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vRGV2aWNlJyk7XG5cbnZhciBiYWxscyA9IDQ7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRhcmdldF9ub2RlOiBjYy5Ob2RlLFxuICAgICAgICBwb2ludF9ub2RlOiBjYy5Ob2RlLFxuICAgICAgICBiYXJfbm9kZTogY2MuTm9kZSxcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgIGdvb2Q6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBwZXJmZWN0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgYW1hemluZzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkc2NvcmU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIG1pc3M6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHBvb3I6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGF1ZGlvX2hpdDAxOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGF1ZGlvX2hpdDAyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGF1ZGlvX2hpdDAzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGJHZW46IHRydWVcblxuICAgIH0sXG4gICAgc2V0U3BlZWQ6IGZ1bmN0aW9uIHNldFNwZWVkKHNwZWVkKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB9LFxuXG4gICAgc2V0SW5kZXg6IGZ1bmN0aW9uIHNldEluZGV4KGluZGV4KSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB9LFxuXG4gICAgc2V0R2VuOiBmdW5jdGlvbiBzZXRHZW4oYkdlbikge1xuICAgICAgICB0aGlzLmJHZW4gPSBiR2VuO1xuICAgICAgICBjb25zb2xlLmxvZyhcInNldEdlblwiLCBiR2VuKTtcbiAgICB9LFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucG9pbnRfbm9kZS5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKF90aGlzLmlzQ29udGFpbigpKSB7XG4gICAgICAgICAgICAgICAgZGV2aWNlLnZpYnJhdG9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmluZGV4ID09IDEpIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoX3RoaXMuYXVkaW9faGl0MDEsIGZhbHNlKTtlbHNlIGlmIChfdGhpcy5pbmRleCA9PSAyKSBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KF90aGlzLmF1ZGlvX2hpdDAyLCBmYWxzZSk7ZWxzZSBpZiAoX3RoaXMuaW5kZXggPT0gMykgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdChfdGhpcy5hdWRpb19oaXQwMywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLnBvaW50X25vZGUpO1xuICAgIH0sXG4gICAgaXNDb250YWluOiBmdW5jdGlvbiBpc0NvbnRhaW4oKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuYmFyX25vZGUuY2hpbGRyZW47XG4gICAgICAgIHZhciBidXR0b24gPSB7XG4gICAgICAgICAgICByYWRpdXM6IHRoaXMudGFyZ2V0X25vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAqIDEuNSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnRhcmdldF9ub2RlLmdldFBvc2l0aW9uKClcbiAgICAgICAgfTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImNoaWxkcmVuLmxlbmd0aCAgICAgICAgICAgXCIsY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInBvc2l0aW9uICAgICAgICAgICBcIixidXR0b24ucG9zaXRpb24pO1xuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMTsgaS0tKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIHZhciBiYWxsID0ge1xuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IG5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBub2RlLmdldFBvc2l0aW9uKClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChjYy5JbnRlcnNlY3Rpb24uY2lyY2xlQ2lyY2xlKGJ1dHRvbiwgYmFsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy89PT09PT1QZXJmZWN0XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguYWJzKGJ1dHRvbi5wb3NpdGlvbi55IC0gYmFsbC5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgMzApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFseVBlcmZlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5wYWx5QWRkc2NvcmUoMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3RhbmNlIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbHlHb29kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMucGFseUFkZHNjb3JlKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFseVBvb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5wYWx5QWRkc2NvcmUoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgbmV3UG9pbnQ6IGZ1bmN0aW9uIG5ld1BvaW50KCkge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB2YXIgdXJsID0gJzA3L2InICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiBiYWxscyk7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgY2MuU3ByaXRlRnJhbWUsIGZ1bmN0aW9uIChlcnIsIHNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKCcnKTtcbiAgICAgICAgICAgIHZhciBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICAgICAgbm9kZS54ID0gMDtcbiAgICAgICAgICAgIG5vZGUueSA9IF90aGlzMi5iYXJfbm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAtIDcyO1xuICAgICAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XG5cbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBjYy5zZXF1ZW5jZShjYy5tb3ZlVG8oMTAgLyBfdGhpczIuc3BlZWQsIGNjLnYyKDAsIC0xMDApKSxcbiAgICAgICAgICAgIC8vY2MubW92ZVRvKDUsY2MudjIoNiwtMTAwKSksXG4gICAgICAgICAgICBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbm9kZSAmJiBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgX3RoaXMyLmJhcl9ub2RlLmFkZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgbm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB1cGRhdGVNZTogZnVuY3Rpb24gdXBkYXRlTWUoZHQpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYgJiYgdGhpcy5iR2VuKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BvaW50KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGFseVBvb3I6IGZ1bmN0aW9uIHBhbHlQb29yKCkge1xuICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICB0aGlzLnBvb3Iubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciBhY3Rpb24gPSBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgMiksIGNjLnNjYWxlVG8oMC4yLCAxKSk7XG4gICAgICAgIHRoaXMucG9vci5ub2RlLnJ1bkFjdGlvbihhY3Rpb24pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMzLnBvb3Iubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICB9LFxuXG4gICAgcGFseUdvb2Q6IGZ1bmN0aW9uIHBhbHlHb29kKCkge1xuICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICB0aGlzLmdvb2Qubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciBhY3Rpb24gPSBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgMiksIGNjLnNjYWxlVG8oMC4yLCAxKSk7XG4gICAgICAgIHRoaXMuZ29vZC5ub2RlLnJ1bkFjdGlvbihhY3Rpb24pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM0Lmdvb2Qubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICB9LFxuXG4gICAgcGFseU1pc3M6IGZ1bmN0aW9uIHBhbHlNaXNzKCkge1xuICAgICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgICB0aGlzLm1pc3Mubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciBhY3Rpb24gPSBjYy5ibGluaygwLjUsIDUpO1xuICAgICAgICB0aGlzLm1pc3Mubm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNS5taXNzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIHBhbHlQZXJmZWN0OiBmdW5jdGlvbiBwYWx5UGVyZmVjdCgpIHtcbiAgICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5wZXJmZWN0Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICB2YXIgYWN0aW9uID0gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDIpLCBjYy5zY2FsZVRvKDAuMiwgMSkpO1xuICAgICAgICB0aGlzLnBlcmZlY3Qubm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNi5wZXJmZWN0Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIHBhbHlBbWF6aW5nOiBmdW5jdGlvbiBwYWx5QW1hemluZygpIHtcbiAgICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5hbWF6aW5nLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICB2YXIgYWN0aW9uID0gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDIpLCBjYy5zY2FsZVRvKDAuMiwgMSkpO1xuICAgICAgICB0aGlzLmFtYXppbmcubm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNy5hbWF6aW5nLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIHBhbHlBZGRzY29yZTogZnVuY3Rpb24gcGFseUFkZHNjb3JlKHNjb3JlKSB7XG4gICAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuYWRkc2NvcmUubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2V0cGljKHNjb3JlLCB0aGlzLmFkZHNjb3JlKTtcblxuICAgICAgICB2YXIgYWN0aW9uID0gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDIpLCBjYy5zY2FsZVRvKDAuMiwgMSkpO1xuICAgICAgICB0aGlzLmFkZHNjb3JlLm5vZGUucnVuQWN0aW9uKGFjdGlvbik7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczguYWRkc2NvcmUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9LFxuXG4gICAgc2V0cGljOiBmdW5jdGlvbiBzZXRwaWMoc2NvcmUsIHRhcmdldCkge1xuICAgICAgICB2YXIgcGF0aCA9IFwicmVzb3VyY2VzLzA3L3RtcFVJL1wiICsgc2NvcmUgKyBcIi5wbmdcIjtcblxuICAgICAgICB2YXIgcmVhbFVybCA9IGNjLnVybC5yYXcocGF0aCk7XG4gICAgICAgIHZhciB0ZXh0dXJlID0gY2MudGV4dHVyZUNhY2hlLmFkZEltYWdlKHJlYWxVcmwpO1xuICAgICAgICB0YXJnZXQuc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmJhcl9ub2RlLmNoaWxkcmVuO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coXCIgdXBkYXRlICBjaGlsZHJlbi5sZW5ndGggICAgICAgICAgIFwiLGNoaWxkcmVuLmxlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gY2hpbGRyZW5baV07XG5cbiAgICAgICAgICAgIGlmIChub2RlLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICAgICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhbHlNaXNzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vLy89PT09PT1BbWF6aW5nXG4vL2xldCBidXR0b25BbWF6aW5nID0ge1xuLy8gICAgcmFkaXVzIDogdGhpcy50YXJnZXRfbm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoICowLjIsXG4vLyAgICBwb3NpdGlvbiA6IHRoaXMudGFyZ2V0X25vZGUuZ2V0UG9zaXRpb24oKVxuLy99O1xuLy9cbi8vaWYoY2MuSW50ZXJzZWN0aW9uLmNpcmNsZUNpcmNsZShidXR0b25BbWF6aW5nLGJhbGwpKSB7XG4vLyAgICB0aGlzLnBhbHlBbWF6aW5nKCk7XG4vLyAgICB0aGlzLnBhbHlBZGRzY29yZSg0KTtcbi8vICAgIG5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuLy8gICAgcmV0dXJuIHRydWU7XG4vL31cbi8vPT09PT09UG9vclxuLy9sZXQgYnV0dG9uUG9vciA9IHtcbi8vICAgIHJhZGl1cyA6IHRoaXMudGFyZ2V0X25vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aCAqMS40LFxuLy8gICAgcG9zaXRpb24gOiB0aGlzLnRhcmdldF9ub2RlLmdldFBvc2l0aW9uKClcbi8vfTtcbi8vXG4vL2lmKGNjLkludGVyc2VjdGlvbi5jaXJjbGVDaXJjbGUoYnV0dG9uUG9vcixiYWxsKSkge1xuLy8gICAgdGhpcy5wYWx5UG9vcigpO1xuLy8gICAgdGhpcy5wYWx5QWRkc2NvcmUoMSk7XG4vLyAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbi8vICAgIHJldHVybiB0cnVlO1xuLy99XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjY2Y4OVg5UGl4TWZZOVE4alJaWGpSWCcsICdzMDcnKTtcbi8vIHNjcmlwdHNcXDA3XFxzMDcuanNcblxudmFyIEJhciA9IHJlcXVpcmUoJy4vczA3X2JhcicpO1xudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vR2FtZScpO1xudmFyIGRldmljZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9EZXZpY2UnKTtcbnZhciBTY29yZVZpZXcgPSByZXF1aXJlKCcuLi9jb21tb24vU2NvcmVWaWV3Jyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmFyc19sYXllcjogY2MuTm9kZSxcbiAgICAgICAgYmFyX25vZGU6IGNjLk5vZGUsXG4gICAgICAgIGFza19ub2RlOiBjYy5Ob2RlLFxuICAgICAgICBtb2RlX25vZGU6IGNjLk5vZGUsXG4gICAgICAgIGdhbWVfbGF5ZXI6IGNjLk5vZGUsXG4gICAgICAgIGluc19ub2RlOiBjYy5Ob2RlLFxuICAgICAgICB0aW1lOiAzMCxcbiAgICAgICAgc2NvcmVMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wMToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wMjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYXVkaW8wMzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZWhhbmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmJhcnMgPSBbXTtcbiAgICAgICAgdGhpcy5iYXJfbm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmFza19ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdhbWVfbGF5ZXIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW9kZV9ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaW5zX25vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgLy/liqjkvZxcbiAgICAgICAgdmFyIHBvcyA9IGNjLnYyKDM1LCA2NSk7XG4gICAgICAgIHRoaXMubW92ZWhhbmQubm9kZS5zZXRQb3NpdGlvbihwb3MpO1xuICAgICAgICB2YXIgbW92ZVRvID0gY2MubW92ZVRvKDAuMywgY2MudjIoNDUsIDcwKSk7XG4gICAgICAgIHZhciBtb3ZlQmFjayA9IGNjLm1vdmVUbygwLjMsIGNjLnYyKDM1LCA2MCkpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uID0gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShtb3ZlVG8sIG1vdmVCYWNrKSk7XG4gICAgICAgIHRoaXMubW92ZWhhbmQubm9kZS5ydW5BY3Rpb24odGhpcy5hY3Rpb24pO1xuICAgIH0sXG5cbiAgICBpbnNfY2xpY2s6IGZ1bmN0aW9uIGluc19jbGljaygpIHtcbiAgICAgICAgdGhpcy5pbnNfbm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5pbW9kZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVhc3koKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltb2RlID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbW9kZSA9PSAyKSB7XG4gICAgICAgICAgICB0aGlzLmhhcmQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChjb2xzLCBzcGVlZCkge1xuICAgICAgICB0aGlzLmJhcnMgPSBbXTtcblxuICAgICAgICB0aGlzLmdhbWVfbGF5ZXIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hc2tfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb2RlX25vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5jb2xzID0gY29scztcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLm92ZXIgPSBmYWxzZTtcblxuICAgICAgICB2YXIgc3RhcnR4ID0gKHRoaXMuYmFyc19sYXllci5nZXRDb250ZW50U2l6ZSgpLndpZHRoIC0gdGhpcy5iYXJfbm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoICogY29scykgLyAyO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbHM7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJhcl9ub2RlKTtcbiAgICAgICAgICAgIG5ld05vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIG5ld05vZGUueCA9IHN0YXJ0eCArIGkgKiB0aGlzLmJhcl9ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChCYXIpLnNldFNwZWVkKHNwZWVkKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KEJhcikuc2V0SW5kZXgoaSArIDEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRHZW5cIik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChCYXIpLnNldEdlbih0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFyc19sYXllci5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIHRoaXMuYmFycy5wdXNoKG5ld05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMub25TdG9wR2VuLCB0aGlzLnRpbWUpO1xuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLm9uVGltZUVuZCwgdGhpcy50aW1lICsgMyk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5fbWFrZVBvaW50cywgMC41KTtcbiAgICB9LFxuICAgIG9uVGltZUVuZDogZnVuY3Rpb24gb25UaW1lRW5kKCkge1xuICAgICAgICB0aGlzLm92ZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLmFza19ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgfSxcblxuICAgIG9uU3RvcEdlbjogZnVuY3Rpb24gb25TdG9wR2VuKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5iYXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB0aGlzLmJhcnNbaV0uZ2V0Q29tcG9uZW50KEJhcikuc2V0R2VuKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoaXRfZWFzeTogZnVuY3Rpb24gaGl0X2Vhc3koKSB7XG4gICAgICAgIHRoaXMuaW1vZGUgPSAwO1xuICAgICAgICB0aGlzLmluc19ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgaGl0X25vcm1hbDogZnVuY3Rpb24gaGl0X25vcm1hbCgpIHtcbiAgICAgICAgdGhpcy5pbW9kZSA9IDE7XG4gICAgICAgIHRoaXMuaW5zX25vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RlX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcbiAgICBoaXRfaGFyZDogZnVuY3Rpb24gaGl0X2hhcmQoKSB7XG4gICAgICAgIHRoaXMuaW1vZGUgPSAyO1xuICAgICAgICB0aGlzLmluc19ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgZWFzeTogZnVuY3Rpb24gZWFzeSgpIHtcbiAgICAgICAgdGhpcy50aW1lID0gMzE7XG4gICAgICAgIHRoaXMuaW5pdCgzLCA0KTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh0aGlzLmF1ZGlvMDEsIGZhbHNlKTtcbiAgICB9LFxuICAgIG5vcm1hbDogZnVuY3Rpb24gbm9ybWFsKCkge1xuICAgICAgICB0aGlzLnRpbWUgPSAyODtcbiAgICAgICAgdGhpcy5pbml0KDMsIDYpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKHRoaXMuYXVkaW8wMiwgZmFsc2UpO1xuICAgIH0sXG4gICAgaGFyZDogZnVuY3Rpb24gaGFyZCgpIHtcbiAgICAgICAgdGhpcy50aW1lID0gMzA7XG4gICAgICAgIHRoaXMuaW5pdCgzLCA4KTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh0aGlzLmF1ZGlvMDMsIGZhbHNlKTtcbiAgICB9LFxuICAgIF9tYWtlUG9pbnRzOiBmdW5jdGlvbiBfbWFrZVBvaW50cyhkdCkge1xuICAgICAgICBpZiAodGhpcy5vdmVyID09PSB0cnVlKSByZXR1cm47XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmJhcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuYmFyc1tpXS5nZXRDb21wb25lbnQoQmFyKS51cGRhdGVNZShkdCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFNjb3JlOiBmdW5jdGlvbiBnZXRTY29yZSgpIHtcbiAgICAgICAgdmFyIHNjb3JlID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuYmFycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgc2NvcmUgKz0gdGhpcy5iYXJzW2ldLmdldENvbXBvbmVudChCYXIpLnNjb3JlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY29yZTtcbiAgICB9LFxuICAgIG9uWWVzOiBmdW5jdGlvbiBvblllcygpIHtcbiAgICAgICAgdmFyIHNjb3JlID0gdGhpcy5nZXRTY29yZSgpO1xuICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ3ZpYnJhdG9yJywgc2NvcmUsIHRydWUpO1xuICAgICAgICBTY29yZVZpZXcuc2hvdygndmlicmF0b3InLCBzY29yZSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBvbk5vOiBmdW5jdGlvbiBvbk5vKCkge1xuICAgICAgICB2YXIgc2NvcmUgPSB0aGlzLmdldFNjb3JlKCk7XG4gICAgICAgIGdhbWUucG9zdEdhbWVTY29yZSgndmlicmF0b3InLCBzY29yZSwgZmFsc2UpO1xuICAgICAgICBnYW1lLnNob3dOZXh0R2FtZSgndmlicmF0b3InLCBzY29yZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5nZXRTY29yZSgpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzljNDIxNFQzbE41WkJpQ2gxUXdVMUYnLCAnczA4Jyk7XG4vLyBzY3JpcHRzXFwwOFxcczA4LmpzXG5cbnZhciBnYW1lID0gcmVxdWlyZSgnLi4vY29tbW9uL0dhbWUnKTtcbnZhciBkZXZpY2UgPSByZXF1aXJlKCcuLi9jb21tb24vRGV2aWNlJyk7XG52YXIgU2NvcmVWaWV3ID0gcmVxdWlyZSgnLi4vY29tbW9uL1Njb3JlVmlldycpO1xudmFyIG1haW5jZmcgPSByZXF1aXJlKCcuLi9jb21tb24vbWFpbmNmZycpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYmw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGJnbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBiZ1NoYWtlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb246IG51bGwsXG4gICAgICAgIHN0YXR1czogZmFsc2UsXG5cbiAgICAgICAgc2F5VXA6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHNheURvd246IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHRtcFY6IDAsXG4gICAgICAgIG5VcDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIG5Eb3duOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGF1c2VTdGF0dXM6IGZhbHNlLFxuICAgICAgICBkZWNTdGF0dXM6IGZhbHNlLFxuICAgICAgICBvdXRsaW5lOiAxMCxcblxuICAgICAgICBwbGF5c3RhdHVzOiBmYWxzZSxcbiAgICAgICAgc3RhcnQwMmVkOiBmYWxzZSxcbiAgICAgICAgdm9sdW1lOiAtMSxcbiAgICAgICAgbGFzdF92b2x1bWU6IC0xLFxuICAgICAgICBmaW5pc2hfMDE6IGZhbHNlLFxuICAgICAgICBmaW5pc2hfMDFfZG9uZTogZmFsc2UsXG4gICAgICAgIGZpbmlzaF8wMV9maW5pc2g6IGZhbHNlLFxuICAgICAgICBmaW5pc2hfMDJfZG9uZTogZmFsc2UsXG5cbiAgICAgICAgbTFBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcbiAgICAgICAgbTJBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcbiAgICAgICAgbTNBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcbiAgICAgICAgbTRBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcblxuICAgICAgICBpbnNfbm9kZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaGVkOiBmYWxzZSxcbiAgICAgICAgYnN0YXJ0Z2FtZTogZmFsc2UsXG5cbiAgICAgICAgbW92ZWhhbmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjaWxja19pbnM6IGZ1bmN0aW9uIGNpbGNrX2lucygpIHtcbiAgICAgICAgdGhpcy5pbnNfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ic3RhcnRnYW1lID0gdHJ1ZTtcbiAgICB9LFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuaW5zX25vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG1wViA9IDA7XG5cbiAgICAgICAgLy/liqjkvZxcbiAgICAgICAgdmFyIHBvcyA9IGNjLnYyKC0xMTUsIDg1KTtcbiAgICAgICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIHZhciBtb3ZlVG8gPSBjYy5tb3ZlVG8oMC4zLCBjYy52MigtMTEwLCA5NSkpO1xuICAgICAgICB2YXIgbW92ZUJhY2sgPSBjYy5tb3ZlVG8oMC4zLCBjYy52MigtMTE1LCA4NSkpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uID0gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShtb3ZlVG8sIG1vdmVCYWNrKSk7XG4gICAgICAgIHRoaXMubW92ZWhhbmQubm9kZS5ydW5BY3Rpb24odGhpcy5hY3Rpb24pO1xuXG4gICAgICAgIC8vdGhpcy5tb3ZlVXBBY3Rpb24gPSBjYy5tb3ZlVG8oMSwgMzAwKTtcblxuICAgICAgICAvL3ZhciBtb3ZlTGVmdCAgPSBjYy5Nb3ZlQnkuY3JlYXRlKDIsY2MucCgtNjAwLDApKTsgIC8vIOW3puenu1xuXG4gICAgICAgIC8vdGhpcy5waWNVcC5ub2RlLnJ1bkFjdGlvbihtb3ZlTGVmdCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZXZpY2Uudm9sdW1lU3RhcnQoZnVuY3Rpb24gKHYpIHtcblxuICAgICAgICAgICAgICAgIC8vZ2FtZS5zaG93VGlwcygndm9sdW1lOicrdik7XG4gICAgICAgICAgICAgICAgX3RoaXMudGlja1ZvbHVtZSh2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICB9LFxuXG4gICAgdGlja1ZvbHVtZTogZnVuY3Rpb24gdGlja1ZvbHVtZSh2KSB7XG5cbiAgICAgICAgaWYgKHYgPiAwKSB7XG4gICAgICAgICAgICAvL3VwXG4gICAgICAgICAgICB0aGlzLmZpbmlzaF8wMSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluaXNoXzAxICYmICF0aGlzLmZpbmlzaF8wMV9kb25lKSB7XG4gICAgICAgICAgICB0aGlzLnNoYWtlKCk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaF8wMV9kb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodiA8IDAgJiYgdGhpcy5maW5pc2hfMDFfZmluaXNoICYmICF0aGlzLmZpbmlzaF8wMl9kb25lKSB7XG4gICAgICAgICAgICAvL2Rvd25cbiAgICAgICAgICAgIHRoaXMuY29vbGRvd24oKTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoXzAyX2RvbmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgICAvL3RoaXMubGFzdF92b2x1bWUgPSB0aGlzLnZvbHVtZTtcbiAgICAgICAgLy90aGlzLnZvbHVtZSA9IHY7XG4gICAgICAgIC8vXG4gICAgICAgIC8vaWYodGhpcy52b2x1bWUgPiB0aGlzLmxhc3Rfdm9sdW1lICYmIHRoaXMubGFzdF92b2x1bWUhPS0xKVxuICAgICAgICAvL3tcbiAgICAgICAgLy8gICAgdGhpcy5maW5pc2hfMDEgPSB0cnVlO1xuICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy9pZih0aGlzLmZpbmlzaF8wMSAgICYmICF0aGlzLmZpbmlzaF8wMV9kb25lKXtcbiAgICAgICAgLy8gICAgdGhpcy5zaGFrZSgpO1xuICAgICAgICAvLyAgICB0aGlzLmZpbmlzaF8wMV9kb25lID0gdHJ1ZTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG4gICAgICAgIC8vXG4gICAgICAgIC8vaWYodGhpcy52b2x1bWUgPCB0aGlzLmxhc3Rfdm9sdW1lICYmIHRoaXMuZmluaXNoXzAxX2ZpbmlzaCAmJiAhdGhpcy5maW5pc2hfMDJfZG9uZSlcbiAgICAgICAgLy97XG4gICAgICAgIC8vICAgIHRoaXMuY29vbGRvd24oKTtcbiAgICAgICAgLy8gICAgdGhpcy5maW5pc2hfMDJfZG9uZSA9IHRydWU7XG4gICAgICAgIC8vfVxuICAgICAgICAvL2lmKHYgPj0gMTAgKXtcbiAgICAgICAgLy8gICAgdGhpcy5zaGFrZSgpO1xuICAgICAgICAvL1xuICAgICAgICAvL1xuICAgICAgICAvL1xuICAgICAgICAvL31lbHNlIGlmKHYgPD01ICYmIHRoaXMuc3RhcnQwMmVkIClcbiAgICAgICAgLy97XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIHRoaXMuY29vbGRvd24oKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy99XG4gICAgfSxcbiAgICBzaGFrZTogZnVuY3Rpb24gc2hha2UoKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIGlmICghdGhpcy5zdGF0dXMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgIGdhbWUuc2hvd1RpcHMoJ3ZvbHVtZSBpcyB1cCEnKTtcbiAgICAgICAgICAgIC8vdGhpcy5hY3Rpb24gPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oMSwgMS4yKSxjYy5zY2FsZVRvKDEsIDEpKSk7XG4gICAgICAgICAgICAvL3RoaXMuYmdTaGFrZS5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBtb3ZlT3V0ID0gY2MuTW92ZUJ5LmNyZWF0ZSgyLCBjYy5wKDgwMCwgMCkpO1xuICAgICAgICAgICAgdGhpcy5zYXlVcC5ub2RlLnJ1bkFjdGlvbihtb3ZlT3V0KTtcblxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModGhpcy5iZ20sIHRydWUpO1xuICAgICAgICAgICAgbWFpbmNmZy5hdWRpb1N0YXR1cyA9IDE7XG5cbiAgICAgICAgICAgIHRoaXMubTFBbmltLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMubTJBbmltLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMubTNBbmltLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMubTRBbmltLnBsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5c3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMi5zdGFydDAyKCk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb29sZG93bjogZnVuY3Rpb24gY29vbGRvd24oKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy5kZWNTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgZ2FtZS5zaG93VGlwcygndm9sdW1lIGlzIGRvd24hJyk7XG4gICAgICAgICAgICB0aGlzLmJnU2hha2Uubm9kZS5zdG9wQWN0aW9uKHRoaXMuYWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuXG4gICAgICAgICAgICB0aGlzLnBsYXlzdGF0dXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIG1vdmVMZWZ0ID0gY2MuTW92ZUJ5LmNyZWF0ZSgyLCBjYy5wKDYwMCwgMCkpOyAvLyDlt6bnp7tcbiAgICAgICAgICAgIHRoaXMuc2F5RG93bi5ub2RlLnJ1bkFjdGlvbihtb3ZlTGVmdCk7XG5cbiAgICAgICAgICAgIHRoaXMubTFBbmltLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLm0yQW5pbS5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5tM0FuaW0ucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMubTRBbmltLnBhdXNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMucmVzdWx0KHRydWUpO1xuICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBCdG46IGZ1bmN0aW9uIHVwQnRuKCkge1xuICAgICAgICB0aGlzLnRtcFYrKztcbiAgICAgICAgdGhpcy50aWNrVm9sdW1lKDEpO1xuICAgIH0sXG4gICAgZG93bkJ0bjogZnVuY3Rpb24gZG93bkJ0bigpIHtcbiAgICAgICAgdGhpcy50bXBWLS07XG4gICAgICAgIHRoaXMudGlja1ZvbHVtZSgtMSk7XG4gICAgfSxcblxuICAgIHVwWWVzOiBmdW5jdGlvbiB1cFllcygpIHtcbiAgICAgICAgdGhpcy5uVXAuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGF1c2VTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgLy9cbiAgICAgICAgLy90aGlzLnN0YXJ0MDIoKTtcblxuICAgICAgICB0aGlzLnJlc3VsdChmYWxzZSk7XG4gICAgfSxcblxuICAgIHVwTm86IGZ1bmN0aW9uIHVwTm8oKSB7XG4gICAgICAgIHRoaXMublVwLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm91dGxpbmUgKz0gMTA7XG4gICAgICAgIHRoaXMucGF1c2VTdGF0dXMgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgZG93blllczogZnVuY3Rpb24gZG93blllcygpIHtcbiAgICAgICAgdGhpcy5uRG93bi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXVzZVN0YXR1cyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMucmVzdWx0KGZhbHNlKTtcbiAgICB9LFxuXG4gICAgZG93bk5vOiBmdW5jdGlvbiBkb3duTm8oKSB7XG4gICAgICAgIHRoaXMubkRvd24uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3V0bGluZSArPSAxMDtcbiAgICAgICAgdGhpcy5wYXVzZVN0YXR1cyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAoIXRoaXMuYnN0YXJ0Z2FtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmlzaGVkKSByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5wYXVzZVN0YXR1cykgdGhpcy5fdGltZSArPSBkdDtcbiAgICAgICAgLy8gW+ato+WImeihqOi+vuW8j13ojrflj5blsI/mlbDngrnlkI7kuInkvY1cbiAgICAgICAgdmFyIHJlZ2V4ID0gLyhbMC05XStcXC5bMC05XXsyfSlbMC05XSovO1xuICAgICAgICB2YXIgdGltZVN0ciA9IFN0cmluZyh0aGlzLl90aW1lKTtcbiAgICAgICAgdmFyIGZpbmFsU3RyID0gdGltZVN0ci5yZXBsYWNlKHJlZ2V4LCBcIiQxXCIpO1xuICAgICAgICBmaW5hbFN0ciA9IGZpbmFsU3RyICsgXCJzXCI7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gZmluYWxTdHI7XG5cbiAgICAgICAgaWYgKHRoaXMuX3RpbWUgPiB0aGlzLm91dGxpbmUgJiYgIXRoaXMuZGVjU3RhdHVzKSB7XG4gICAgICAgICAgICAvL+i/h+S6hjEwc+i/mOacquajgOa1i+WIsOS7u+S9lVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0MDJlZCkgdGhpcy5uVXAuYWN0aXZlID0gdHJ1ZTtlbHNlIHRoaXMubkRvd24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0MDI6IGZ1bmN0aW9uIHN0YXJ0MDIoKSB7XG4gICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgIC8vdGhpcy50bXBWID0gMTA7XG4gICAgICAgIHRoaXMublVwLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXJ0MDJlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5vdXRsaW5lID0gdGhpcy5fdGltZSArIDEwO1xuICAgICAgICB0aGlzLmRlY1N0YXR1cyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYmdTaGFrZS5ub2RlLnN0b3BBY3Rpb24odGhpcy5hY3Rpb24pO1xuICAgICAgICB0aGlzLmFjdGlvbiA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygxLCAxLjIpLCBjYy5zY2FsZVRvKDEsIDEpKSk7XG4gICAgICAgIHRoaXMuYmdTaGFrZS5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG5cbiAgICAgICAgLy9pZiggIXRoaXMucGxheXN0YXR1cyApe1xuICAgICAgICAvLyAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgLy8gICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKCB0aGlzLmJnbSwgdHJ1ZSApO1xuICAgICAgICAvL31cblxuICAgICAgICB2YXIgbW92ZU91dCA9IGNjLk1vdmVCeS5jcmVhdGUoMiwgY2MucCgtNjAwLCAwKSk7IC8vIOW3puenu1xuICAgICAgICB0aGlzLnNheURvd24ubm9kZS5ydW5BY3Rpb24obW92ZU91dCk7XG5cbiAgICAgICAgLy90aGlzLmJsLnN0cmluZyA9IFwiVHVybiBkb3duIHlvdXIgcGhvbmUgdm9sdW1lIGJ5IHByZXNzaW5nIHRoZSBbVm9sdW1lIERvd25dIGtleSBvbiB0aGUgc2lkZSBvZiB5b3VyIHBob25lXCI7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM0LmZpbmlzaF8wMV9maW5pc2ggPSB0cnVlO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICB9LFxuXG4gICAgcmVzdWx0OiBmdW5jdGlvbiByZXN1bHQocmV0KSB7XG4gICAgICAgIGRldmljZS52b2x1bWVTdG9wKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ3ZvbHVtZV9rZXlzJywgdGhpcy5fdGltZS50b0ZpeGVkKDIpLCByZXQpO1xuICAgICAgICBTY29yZVZpZXcuc2hvdygndm9sdW1lX2tleXMnLCB0aGlzLl90aW1lLnRvRml4ZWQoMiksIHJldCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk4YTlibXdQWnhPRnBKV2cwVzZCNmFNJywgJ3MxMF9nYW1lX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwxMFxcczEwX2dhbWVfbGF5ZXIuanNcblxudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vR2FtZScpO1xudmFyIFNjb3JlVmlldyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9TY29yZVZpZXcnKTtcbnZhciBtYWluY2ZnID0gcmVxdWlyZSgnLi4vY29tbW9uL21haW5jZmcnKTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsZWZ0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgYmFsbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIFNQRUVEOiAxLFxuXG4gICAgICAgIGJveF9ub2RlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgbGFzdF94OiBudWxsLFxuICAgICAgICBsYXN0X3k6IG51bGwsXG4gICAgICAgIGZpbmlzaDogZmFsc2UsXG4gICAgICAgIGd1aWRlX25vZGU6IGNjLk5vZGUsXG4gICAgICAgIGJzdGFydGdhbWU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIC8vdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgfSxcblxuICAgIG9uQ2xpY2tHdWlkZTogZnVuY3Rpb24gb25DbGlja0d1aWRlKCkge1xuICAgICAgICB0aGlzLmd1aWRlX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnN0YXJ0Z2FtZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2V0YWN0aXZlKCk7XG4gICAgfSxcbiAgICBjYWxjdWxhdGVGaXhDb2xsaXNpb246IGZ1bmN0aW9uIGNhbGN1bGF0ZUZpeENvbGxpc2lvbihwb2ludCwgcHljKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCIyMjIyMjIyMlwiKTtcbiAgICAgICAgdmFyIHJhZGl1cyA9IDE2O1xuXG4gICAgICAgIHZhciBzbWFsbF9yYWRpdXMgPSAwO1xuICAgICAgICB2YXIgYmlnX3JhZGl1cyA9IDE2O1xuXG4gICAgICAgIHdoaWxlIChzbWFsbF9yYWRpdXMgPCBiaWdfcmFkaXVzIC0gMikge1xuXG4gICAgICAgICAgICByYWRpdXMgPSBwYXJzZUludCgoc21hbGxfcmFkaXVzICsgYmlnX3JhZGl1cykgLyAyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2MgcmFkaXVzXCIsIHJhZGl1cyk7XG4gICAgICAgICAgICB2YXIgaXNDb2xsaXNpb25QYXRoID0gY2MuSW50ZXJzZWN0aW9uLnBvbHlnb25DaXJjbGUocHljLndvcmxkLnBvaW50cywgeyBwb3NpdGlvbjogcG9pbnQsIHJhZGl1czogcmFkaXVzIH0pO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGlzaW9uUGF0aCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmlzQ29sbGlzaW9uUGF0aFwiKTtcbiAgICAgICAgICAgICAgICBiaWdfcmFkaXVzID0gcmFkaXVzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJldHVybiByYWRpdXNcIiwgcmFkaXVzKTtcbiAgICAgICAgICAgICAgICBzbWFsbF9yYWRpdXMgPSByYWRpdXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc21hbGxfcmFkaXVzO1xuICAgIH0sXG5cbiAgICBzZXRhY3RpdmU6IGZ1bmN0aW9uIHNldGFjdGl2ZSgpIHtcblxuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmZpbmlzaCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNpcmNsZUNvbGxpZGVyID0gdGhpcy5iYWxsLmdldENvbXBvbmVudChjYy5DaXJjbGVDb2xsaWRlcik7XG4gICAgICAgIHRoaXMucG9seWdvbkNvbGxpZGVyID0gdGhpcy5ib3hfbm9kZS5nZXRDb21wb25lbnQoY2MuUG9seWdvbkNvbGxpZGVyKTtcbiAgICAgICAgdGhpcy5ib3hDb2xsaWRlciA9IHRoaXMuYm94X25vZGUuZ2V0Q29tcG9uZW50KGNjLkJveENvbGxpZGVyKTtcblxuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgfSxcblxuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgICAgICB2YXIgY2NjID0gdGhpcy5jaXJjbGVDb2xsaWRlcjtcbiAgICAgICAgdmFyIHB5YyA9IHRoaXMucG9seWdvbkNvbGxpZGVyO1xuICAgICAgICB2YXIgYmMgPSB0aGlzLmJveENvbGxpZGVyO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwib25Mb2FkXCIpO1xuICAgICAgICBjYy5pbnB1dE1hbmFnZXIuc2V0QWNjZWxlcm9tZXRlckludGVydmFsKDEgLyA1KTtcbiAgICAgICAgY2MuaW5wdXRNYW5hZ2VyLnNldEFjY2VsZXJvbWV0ZXJFbmFibGVkKHRydWUpO1xuICAgICAgICBtYWluY2ZnLmFjY1N0YXR1cyA9IHRydWU7XG5cbiAgICAgICAgdmFyIGJhbGwgPSB0aGlzLmJhbGw7XG5cbiAgICAgICAgdmFyIGxlZnQgPSB0aGlzLmxlZnQ7XG4gICAgICAgIHZhciBsYWJlbCA9IHRoaXMubGFiZWw7XG4gICAgICAgIHZhciB0ZXN0ID0gdGhpcy50ZXN0O1xuXG4gICAgICAgIHZhciBzcGVlZCA9IHRoaXMuU1BFRUQgKiAxMDtcblxuICAgICAgICB2YXIgYkNvbGxpc2lvblggPSBmYWxzZTtcbiAgICAgICAgdmFyIGJDb2xsaXNpb25ZID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGNhbGMgPSB0aGlzLmNhbGN1bGF0ZUZpeENvbGxpc2lvbjtcbiAgICAgICAgdGhpcy5sYXN0X3ggPSBudWxsO1xuICAgICAgICBjb25zb2xlLmxvZyhiYyk7XG5cbiAgICAgICAgdmFyIGxpc3RlbmVyID0gY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTixcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjayhhY2MsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy9jYWxsYmFjazogZnVuY3Rpb24gKGFjYywgZXZlbnQpe1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydFwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5maW5pc2gpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMubGFzdF94ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnRMYXN0ID0gY2MudjIoX3RoaXMubGFzdF94LCBfdGhpcy5sYXN0X3kpO1xuICAgICAgICAgICAgICAgICAgICAvL+WIpOWumuWJjeS4gOS4queCueaYr+WQpuW3sue7j+eisOaSnlxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNDb2xsaXNpb25QYXRoID0gY2MuSW50ZXJzZWN0aW9uLnBvbHlnb25DaXJjbGUocHljLndvcmxkLnBvaW50cywgeyBwb3NpdGlvbjogcG9pbnRMYXN0LCByYWRpdXM6IDE2IH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb2xsaXNpb25QYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0LnN0cmluZyA9IFwiaXNDb2xsaXNpb25QYXRoXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwMXggPSBfdGhpcy5sYXN0X3g7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcDF5ID0gX3RoaXMubGFzdF95O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WIpOWumueOsOWcqOeahOeCuVxuICAgICAgICAgICAgICAgICAgICAgICAgcDF4ID0gX3RoaXMubGFzdF94ICsgYWNjLnggKiBzcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxeSA9IF90aGlzLmxhc3RfeSArIGFjYy55ICogc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnROZXh0ID0gY2MudjIocDF4LCBwMXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaXNpb25QYXRoID0gY2MuSW50ZXJzZWN0aW9uLnBvbHlnb25DaXJjbGUocHljLndvcmxkLnBvaW50cywgeyBwb3NpdGlvbjogcG9pbnROZXh0LCByYWRpdXM6IDE2IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0NvbGxpc2lvblBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGwubm9kZS5ydW5BY3Rpb24oY2MucGxhY2UoY2MucChwMXgudG9GaXhlZCgyKSwgcDF5LnRvRml4ZWQoMikpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubGFzdF94ID0gcDF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmxhc3RfeSA9IHAxeTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGZpbmFsU3RyID0gcDF4LnRvRml4ZWQoMikgKyBcIixcIisgcDF5LnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9sYWJlbC5zdHJpbmcgPSBmaW5hbFN0cjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcDF4ID0gX3RoaXMubGFzdF94O1xuICAgICAgICAgICAgICAgICAgICAgICAgcDF5ID0gX3RoaXMubGFzdF95O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBiQ29sbGlzaW9uWCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYkNvbGxpc2lvblkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpeFkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpeFggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/liKTlrpp45Y2V56e7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkX3AxeCA9IHAxeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxeCArPSBhY2MueCAqIHNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvaW50WCA9IGNjLnYyKHAxeCwgcDF5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaXNpb25QYXRoID0gY2MuSW50ZXJzZWN0aW9uLnBvbHlnb25DaXJjbGUocHljLndvcmxkLnBvaW50cywgeyBwb3NpdGlvbjogcG9pbnRYLCByYWRpdXM6IDEyIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29sbGlzaW9uUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlzaW9uUGF0aCA9IGNjLkludGVyc2VjdGlvbi5wb2x5Z29uQ2lyY2xlKHB5Yy53b3JsZC5wb2ludHMsIHsgcG9zaXRpb246IHBvaW50WCwgcmFkaXVzOiA4IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbGxpc2lvblBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbGxpc2lvblBhdGggPSBjYy5JbnRlcnNlY3Rpb24ucG9seWdvbkNpcmNsZShweWMud29ybGQucG9pbnRzLCB7IHBvc2l0aW9uOiBwb2ludFgsIHJhZGl1czogNCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29sbGlzaW9uUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkNvbGxpc2lvblggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4WSA9IDg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXhZID0gNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yik5a6aeeWNleenu1xuICAgICAgICAgICAgICAgICAgICAgICAgcDF5ICs9IGFjYy55ICogc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnRZID0gY2MudjIob2xkX3AxeCwgcDF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlzaW9uUGF0aCA9IGNjLkludGVyc2VjdGlvbi5wb2x5Z29uQ2lyY2xlKHB5Yy53b3JsZC5wb2ludHMsIHsgcG9zaXRpb246IHBvaW50WSwgcmFkaXVzOiAxMiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbGxpc2lvblBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbGxpc2lvblBhdGggPSBjYy5JbnRlcnNlY3Rpb24ucG9seWdvbkNpcmNsZShweWMud29ybGQucG9pbnRzLCB7IHBvc2l0aW9uOiBwb2ludFksIHJhZGl1czogOCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb2xsaXNpb25QYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlzaW9uUGF0aCA9IGNjLkludGVyc2VjdGlvbi5wb2x5Z29uQ2lyY2xlKHB5Yy53b3JsZC5wb2ludHMsIHsgcG9zaXRpb246IHBvaW50WSwgcmFkaXVzOiA0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb2xsaXNpb25QYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiQ29sbGlzaW9uWSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXhYID0gODtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeFggPSA0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJDb2xsaXNpb25YICYmICFiQ29sbGlzaW9uWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAxeSA9IF90aGlzLmxhc3RfeSArIGFjYy55ICogc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcDF4ID0gX3RoaXMubGFzdF94O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYoYWNjLnggPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHAxeCA9ICB0aGlzLmxhc3RfeCAtIGZpeFg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgcDF4ID0gIHRoaXMubGFzdF94ICsgZml4WDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3Quc3RyaW5nID0gXCJieFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJDb2xsaXNpb25YICYmIGJDb2xsaXNpb25ZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcDF4ID0gX3RoaXMubGFzdF94ICsgYWNjLnggKiBzcGVlZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAxeSA9IF90aGlzLmxhc3RfeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKGFjYy55ID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICBwMXkgPSAgdGhpcy5sYXN0X3kgLSBmaXhZO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHAxeSA9ICB0aGlzLmxhc3RfeSArIGZpeFk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0LnN0cmluZyA9IFwiYnlcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJDb2xsaXNpb25YICYmIGJDb2xsaXNpb25ZKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWNjLnggPiAwKSBwMXggPSBfdGhpcy5sYXN0X3ggLSAxO2Vsc2UgcDF4ID0gX3RoaXMubGFzdF94ICsgMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY2MueSA+IDApIHAxeSA9IF90aGlzLmxhc3RfeSAtIDE7ZWxzZSBwMXkgPSBfdGhpcy5sYXN0X3kgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3Quc3RyaW5nID0gXCJieGJ5XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYkNvbGxpc2lvblggJiYgIWJDb2xsaXNpb25ZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcDF4ID0gX3RoaXMubGFzdF94ICsgYWNjLnggKiBzcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwMXkgPSBfdGhpcy5sYXN0X3kgKyBhY2MueSAqIHNwZWVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdC5zdHJpbmcgPSBcIm5ieG5ieVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWxsLm5vZGUucnVuQWN0aW9uKGNjLnBsYWNlKGNjLnAocDF4LnRvRml4ZWQoMiksIHAxeS50b0ZpeGVkKDIpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubGFzdF94ID0gcDF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubGFzdF95ID0gcDF5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBmaW5hbFN0ciA9IHAxeC50b0ZpeGVkKDIpICsgXCIsXCIrIHAxeS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9sYWJlbC5zdHJpbmcgPSBmaW5hbFN0cjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXR1cm5cIiwgX3RoaXMubGFzdF94LCBfdGhpcy5sYXN0X3kpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy/lpITnkIblvZPliY3nmoTngrlcbiAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgICAgICAgICB2YXIgcyA9IGJhbGwubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBwMCA9IGJhbGwubm9kZS5nZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY2MueFwiLCBhY2MueCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwMFwiLCBwMCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzcGVlZFwiLCBzcGVlZCk7XG4gICAgICAgICAgICAgICAgdmFyIHAxeCA9IHAwLnggKyBhY2MueCAqIHNwZWVkO1xuICAgICAgICAgICAgICAgIGlmIChwMXggLSBzLndpZHRoIC8gMiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcDF4ID0gcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwMXggKyBzLndpZHRoIC8gMiA+IHNpemUud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcDF4ID0gc2l6ZS53aWR0aCAtIHMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBwMXkgPSBwMC55ICsgYWNjLnkgKiBzcGVlZDtcbiAgICAgICAgICAgICAgICBpZiAocDF5IC0gcy5oZWlnaHQgLyAyIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBwMXkgPSBzLmhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwMXkgKyBzLmhlaWdodCAvIDIgPiBzaXplLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwMXkgPSBzaXplLmhlaWdodCAtIHMuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBjYy52MihwMXgsIHAxeSk7XG5cbiAgICAgICAgICAgICAgICAvL3AxeCAtPSAxO1xuICAgICAgICAgICAgICAgIC8vcDF5IC09IDE7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwb2ludFwiLCBwb2ludCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJiY2JjYmNiY2JjYmNcIik7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNDb2xsaXNpb25FbmQgPSBjYy5yZWN0Q29udGFpbnNQb2ludChjYy5yZWN0KGJjLm9mZnNldC54IC0gNTAsIGJjLm9mZnNldC55IC0gNTAsIGJjLnNpemUud2lkdGgsIGJjLnNpemUuaGVpZ2h0KSwgcG9pbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29sbGlzaW9uRW5kKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy90ZXN0LnN0cmluZyA9IFwiRW5kXCI7XG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2hvd1RpcHMoJ3lvdSB3aW4nKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5kR2FtZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIxMTExMTExMTExMTExMTExXCIpO1xuICAgICAgICAgICAgICAgIHZhciBpc0NvbGxpc2lvblBhdGggPSBjYy5JbnRlcnNlY3Rpb24ucG9seWdvbkNpcmNsZShweWMud29ybGQucG9pbnRzLCB7IHBvc2l0aW9uOiBwb2ludCwgcmFkaXVzOiAxNiB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaXNDb2xsaXNpb25QYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3Quc3RyaW5nID0gXCJDb2xsaXNpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgLy/orqHnrpfpgIblkJHnmoTngrlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9IGNhbGMocG9pbnQsIHB5Yyk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQuc3RyaW5nID0gcmV0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWMgPSAxNiAtIHJldCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY2MueCA+IDAgJiYgYWNjLnkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwMXggPSBwMXggLSBkZWM7XG4gICAgICAgICAgICAgICAgICAgICAgICBwMXkgPSBwMXkgLSBkZWM7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWNjLnggPiAwICYmIGFjYy55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcDF4ID0gcDF4IC0gZGVjO1xuICAgICAgICAgICAgICAgICAgICAgICAgcDF5ID0gcDF5ICsgZGVjO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjYy54IDwgMCAmJiBhY2MueSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxeCA9IHAxeCArIGRlYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxeSA9IHAxeSArIGRlYztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY2MueCA8IDAgJiYgYWNjLnkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwMXggPSBwMXggKyBkZWM7XG4gICAgICAgICAgICAgICAgICAgICAgICBwMXkgPSBwMXkgLSBkZWM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZXN0LnN0cmluZyA9IFwib3V0XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy92YXIgZmluYWxTdHIgPSBwMXgudG9GaXhlZCgyKSArIFwiLFwiKyBwMXkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAvL2xhYmVsLnN0cmluZyA9IGZpbmFsU3RyO1xuICAgICAgICAgICAgICAgIGJhbGwubm9kZS5ydW5BY3Rpb24oY2MucGxhY2UoY2MucChwMXgudG9GaXhlZCgyKSwgcDF5LnRvRml4ZWQoMikpKSk7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy5sYXN0X3ggPSBwMXg7XG4gICAgICAgICAgICAgICAgX3RoaXMubGFzdF95ID0gcDF5O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0XCIsIF90aGlzLmxhc3RfeCwgX3RoaXMubGFzdF95KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgYmFsbC5ub2RlKTtcblxuICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIGFkZFNwZWVkOiBmdW5jdGlvbiBhZGRTcGVlZCgpIHtcbiAgICAgICAgdGhpcy5TUEVFRCArPSAxO1xuICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgfSxcblxuICAgIGVuZEdhbWU6IGZ1bmN0aW9uIGVuZEdhbWUoKSB7XG4gICAgICAgIHRoaXMuZmluaXNoID0gdHJ1ZTtcblxuICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ2d5cm9zY29wZScsIHRoaXMuX3RpbWUudG9GaXhlZCgyKSwgdHJ1ZSk7XG4gICAgICAgIFNjb3JlVmlldy5zaG93KCdneXJvc2NvcGUnLCB0aGlzLl90aW1lLnRvRml4ZWQoMiksIHRydWUpO1xuXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgIGNjLmlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVyRW5hYmxlZChmYWxzZSk7XG4gICAgICAgIG1haW5jZmcuYWNjU3RhdHVzID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICghdGhpcy5ic3RhcnRnYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZpbmlzaCkgdGhpcy5fdGltZSArPSBkdDtcbiAgICAgICAgLy8gW+ato+WImeihqOi+vuW8j13ojrflj5blsI/mlbDngrnlkI7kuInkvY1cbiAgICAgICAgdmFyIHJlZ2V4ID0gLyhbMC05XStcXC5bMC05XXsyfSlbMC05XSovO1xuICAgICAgICB2YXIgdGltZVN0ciA9IFN0cmluZyh0aGlzLl90aW1lKTtcbiAgICAgICAgdmFyIGZpbmFsU3RyID0gdGltZVN0ci5yZXBsYWNlKHJlZ2V4LCBcIiQxXCIpO1xuICAgICAgICBmaW5hbFN0ciA9IGZpbmFsU3RyICsgXCJzXCI7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gZmluYWxTdHI7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZmNzgxMnZBaFZGdElnNjdWTlhCK0cxJywgJ3MxMF9pbnNfbGF5ZXInKTtcbi8vIHNjcmlwdHNcXDEwXFxzMTBfaW5zX2xheWVyLmpzXG5cbnZhciBnYW1lID0gcmVxdWlyZSgnczEwX2dhbWVfbGF5ZXInKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdhbWU6IGdhbWVcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICBnb25leHQ6IGZ1bmN0aW9uIGdvbmV4dCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCIxMTExMTEgaW5zXCIpO1xuICAgICAgICBpZiAodGhpcy5ub2RlLmFjdGl2ZSA9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ29uZXh0IGluc1wiKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXRhY3RpdmUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMjIyMjIyIGluc1wiKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxZmIyYmswZnA5QWY2eFc1a2hCbWRqMicsICdzMTFfZ2FtZV9sYXllcicpO1xuLy8gc2NyaXB0c1xcMTFcXHMxMV9nYW1lX2xheWVyLmpzXG5cbnZhciBTY29yZVZpZXcgPSByZXF1aXJlKCcuLi9jb21tb24vU2NvcmVWaWV3Jyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL2RldmljZScpO1xudmFyIGdhbWUgPSByZXF1aXJlKCcuLi9jb21tb24vZ2FtZScpO1xuXG52YXIgbWFpbmNmZyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tYWluY2ZnJyk7XG5cbnZhciBhbmFseXRpY3MgPSByZXF1aXJlKCcuLi9jb21tb24vYW5hbHl0aWNzJyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYXNrOiBjYy5Ob2RlLFxuICAgICAgICBiMToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGIyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgYWNjU3RhdHVzOiBmYWxzZSxcbiAgICAgICAgcG9uZ1N0YXR1czogZmFsc2UsXG4gICAgICAgIHBvbmdBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcblxuICAgICAgICBkZWNTdGF0dXM6IGZhbHNlLCAvL+ajgOa1i+eKtuaAgVxuICAgICAgICBwYXVzZVN0YXR1czogZmFsc2UsIC8v5qOA5rWL54q25oCB5pe25YCZ5pqC5YGc54q25oCBXG4gICAgICAgIG91dGxpbmU6IDEwLFxuXG4gICAgICAgIHlhb0FkdWlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGF1ZGlvU3VjY2Vzczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgcG9uZ0FkdWlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGVuZDogZmFsc2UsXG5cbiAgICAgICAgYjFBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcbiAgICAgICAgYjJBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcblxuICAgICAgICBudW06IDAsXG4gICAgICAgIGNvdW50OiAwLFxuICAgICAgICBwbGF5MDM6IGZhbHNlLFxuICAgICAgICBwbGF5MDI6IGZhbHNlLFxuICAgICAgICBwbGF5MDE6IGZhbHNlLFxuXG4gICAgICAgIGd1aWRlX25vZGU6IGNjLk5vZGUsXG4gICAgICAgIG1vdG9fbm9kZTogY2MuTm9kZSxcbiAgICAgICAgYnN0YXJ0Z2FtZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb25DbGlja0d1aWRlOiBmdW5jdGlvbiBvbkNsaWNrR3VpZGUoKSB7XG4gICAgICAgIHRoaXMuZ3VpZGVfbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgLy9tb3Rv5o+Q56S6XG4gICAgICAgIGlmIChhbmFseXRpY3MuaXNBcHBJbnN0YWxsZWQoJ2NvbS5tb3Rvcm9sYS5tb3RvJykpIHtcblxuICAgICAgICAgICAgdGhpcy5tb3RvX25vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29tLm1vdG9yb2xhLm1vdG9cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uQ2xpY2tHdWlkZSBubyBtb3RvICAgXCIpO1xuICAgICAgICAgICAgdGhpcy5tb3RvX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJzdGFydGdhbWUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRhY3RpdmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNsaWNrTW90bzogZnVuY3Rpb24gb25DbGlja01vdG8oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib25DbGlja01vdG9cIik7XG4gICAgICAgIHRoaXMubW90b19ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYnN0YXJ0Z2FtZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2V0YWN0aXZlKCk7XG4gICAgfSxcblxuICAgIHNldGFjdGl2ZTogZnVuY3Rpb24gc2V0YWN0aXZlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLnBvbmdBbmltLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYjEubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmIyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgY2MuaW5wdXRNYW5hZ2VyLnNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbCgxIC8gNSk7XG4gICAgICAgIC8v5Zyo5L2/55So5Yqg6YCf6K6h5LqL5Lu255uR5ZCs5Zmo5LmL5YmN77yM6ZyA6KaB5YWI5ZCv55So5q2k56Gs5Lu26K6+5aSHXG4gICAgICAgIGNjLmlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVyRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgbWFpbmNmZy5hY2NTdGF0dXMgPSB0cnVlO1xuXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soYWNjLCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5wYXVzZVN0YXR1cykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNjLmxvZyhhY2MueCwgYWNjLnkpO1xuICAgICAgICAgICAgICAgIHZhciBub3dHWCA9IGFjYy54ICogOS44MTtcbiAgICAgICAgICAgICAgICB2YXIgbm93R1kgPSBhY2MueSAqIDkuODE7XG4gICAgICAgICAgICAgICAgaWYgKChub3dHWCA8IC04LjAgfHwgbm93R1ggPiA4LjApICYmIChub3dHWSA8IC04LjAgfHwgbm93R1kgPiA4LjApKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5vblJvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgLy81cyDnlLHljYrnk7bliLDniIbngrhcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZG9BY2MoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kb1dhaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMubm9kZSk7XG5cbiAgICAgICAgLy8gc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAvLyAgICAgdGhpcy5vblJvY2soKTtcbiAgICAgICAgLy8gfSwyMDAwKTtcbiAgICB9LFxuXG4gICAgZG9BY2M6IGZ1bmN0aW9uIGRvQWNjKCkge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB0aGlzLmFjY1N0YXR1cyA9IHRydWU7XG4gICAgICAgIC8v5qOA5rWL54q25oCB6K6+572u5Li6dHJ1ZVxuICAgICAgICB0aGlzLmRlY1N0YXR1cyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgICAvL2lmKHRoaXMuaW5uZXIuZmlsbFJhbmdlIDw9MC45KVxuICAgICAgICAvL3tcbiAgICAgICAgLy8gICAgY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG4gICAgICAgIC8vICAgIC8v5pKt5pS+6YCJ5oup55qE6Z+z5LmQXG4gICAgICAgIC8vICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoIHRoaXMueWFvQWR1aW8sIGZhbHNlICk7XG4gICAgICAgIC8vfVxuICAgICAgICBpZiAoIXRoaXMuYXVkaW9pbmcpIHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuICAgICAgICAgICAgLy/mkq3mlL7pgInmi6nnmoTpn7PkuZBcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy55YW9BZHVpbywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hdWRpb2luZyA9IHRydWU7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMyLmF1ZGlvaW5nID0gZmFsc2U7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIGRvV2FpdDogZnVuY3Rpb24gZG9XYWl0KCkge1xuICAgICAgICB0aGlzLmFjY1N0YXR1cyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBkb1Bvbmc6IGZ1bmN0aW9uIGRvUG9uZygpIHtcbiAgICAgICAgdGhpcy5wYWx5UG9uZygpO1xuXG4gICAgICAgIC8v6L+b5YWl57uT5p2f5p2h5Lu2XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIOaSreaUvuaIkOWKn+mfs+S5kFxuICAgICAgICAgICAgdGhpcy5wbGF5c3VjY2VzcygpO1xuICAgICAgICB9LCAxKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8g6L+Z6YeM55qEIHRoaXMg5oyH5ZCRIGNvbXBvbmVudFxuICAgICAgICAgICAgLy90aGlzLmdvbmV4dCgpO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBfcGxheVNGWDogZnVuY3Rpb24gX3BsYXlTRlgoY2xpcCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KGNsaXAsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlzdWNjZXNzOiBmdW5jdGlvbiBwbGF5c3VjY2VzcygpIHtcbiAgICAgICAgdGhpcy5fcGxheVNGWCh0aGlzLmF1ZGlvU3VjY2Vzcyk7XG4gICAgfSxcblxuICAgIHBhbHlQb25nOiBmdW5jdGlvbiBwYWx5UG9uZygpIHtcbiAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5wb25nQW5pbS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIC8v5pKt5pS+6YCJ5oup55qE6Z+z5LmQXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5wb25nQWR1aW8sIGZhbHNlKTtcbiAgICAgICAgdmFyIGFuaW0gPSB0aGlzLnBvbmdBbmltO1xuICAgICAgICBhbmltLnBsYXkoKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczMucG9uZ0FuaW0ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9LFxuXG4gICAgb25Sb2NrOiBmdW5jdGlvbiBvblJvY2soKSB7XG4gICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuYm90dGxlb3V0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM0LmFzay5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmJzdGFydGdhbWUpIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLnBhdXNlU3RhdHVzKSB0aGlzLl90aW1lICs9IGR0O1xuICAgICAgICAvLyBb5q2j5YiZ6KGo6L6+5byPXeiOt+WPluWwj+aVsOeCueWQjuS4ieS9jVxuICAgICAgICB2YXIgcmVnZXggPSAvKFswLTldK1xcLlswLTldezJ9KVswLTldKi87XG4gICAgICAgIHZhciB0aW1lU3RyID0gU3RyaW5nKHRoaXMuX3RpbWUpO1xuICAgICAgICB2YXIgZmluYWxTdHIgPSB0aW1lU3RyLnJlcGxhY2UocmVnZXgsIFwiJDFcIik7XG4gICAgICAgIGZpbmFsU3RyID0gZmluYWxTdHIgKyBcInNcIjtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSBmaW5hbFN0cjtcblxuICAgICAgICAvL2lmKHRoaXMuYWNjU3RhdHVzKXtcbiAgICAgICAgLy8gICAgdGhpcy5pbm5lci5maWxsUmFuZ2UgKz0gZHQqMC41O1xuICAgICAgICAvLyAgICBpZiggdGhpcy5pbm5lci5maWxsUmFuZ2UgPj0wLjkgJiYgIXRoaXMuZW5kIClcbiAgICAgICAgLy8gICAge1xuICAgICAgICAvLyAgICAgICAgdGhpcy5lbmQgPSB0cnVlO1xuICAgICAgICAvLyAgICAgICAgdGhpcy5pbm5lci5maWxsUmFuZ2UgPSAxO1xuICAgICAgICAvLyAgICAgICAgdGhpcy5hY2NTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgICAgIHRoaXMuZG9Qb25nKCk7XG4gICAgICAgIC8vICAgIH1cbiAgICAgICAgLy99XG5cbiAgICAgICAgaWYgKHRoaXMuX3RpbWUgPiB0aGlzLm91dGxpbmUgJiYgIXRoaXMuZGVjU3RhdHVzKSB7XG4gICAgICAgICAgICAvL+i/h+S6hjEwc+i/mOacquajgOa1i+WIsOS7u+S9lVxuICAgICAgICAgICAgdGhpcy5hc2suYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY291bnQgPiAxICYmIHRoaXMuY291bnQgPD0gNSAmJiAhdGhpcy5wbGF5MDEpIHtcbiAgICAgICAgICAgIHZhciBhbmltID0gdGhpcy5iMUFuaW07XG5cbiAgICAgICAgICAgIHZhciBhbmltQ3RybCA9IGFuaW0ubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGFuaW1DdHJsLnBsYXkoXCJubzFcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkwMSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRlY1N0YXR1cyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb3VudCA+IDUgJiYgdGhpcy5jb3VudCA8PSAxMCAmJiAhdGhpcy5wbGF5MDIpIHtcbiAgICAgICAgICAgIHZhciBhbmltID0gdGhpcy5iMUFuaW07XG5cbiAgICAgICAgICAgIHZhciBhbmltQ3RybCA9IGFuaW0ubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGFuaW1DdHJsLnBsYXkoXCJubzJcIik7XG4gICAgICAgICAgICB0aGlzLnBsYXkwMiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb3VudCA+IDEwICYmICF0aGlzLnBsYXkwMykge1xuICAgICAgICAgICAgdGhpcy5iMS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5iMi5ub2RlLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuYjJBbmltLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMucGxheTAzID0gdHJ1ZTtcbiAgICAgICAgICAgIC8v5pKt5pS+6YCJ5oup55qE6Z+z5LmQXG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMucG9uZ0FkdWlvLCBmYWxzZSk7XG4gICAgICAgICAgICAvL+i/m+WFpee7k+adn+adoeS7tlxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIOaSreaUvuaIkOWKn+mfs+S5kFxuICAgICAgICAgICAgICAgIHRoaXMucGxheXN1Y2Nlc3MoKTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIH0sIDIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uIG9uRGlzYWJsZSgpIHtcbiAgICAgICAgY2MuaW5wdXRNYW5hZ2VyLnNldEFjY2VsZXJvbWV0ZXJFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgbWFpbmNmZy5hY2NTdGF0dXMgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uWWVzOiBmdW5jdGlvbiBvblllcygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJvblllc1wiKTtcbiAgICAgICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdhY2NlbGVyb21ldGVyJywgdGhpcy5fdGltZS50b0ZpeGVkKDIpLCBmYWxzZSk7XG4gICAgICAgIFNjb3JlVmlldy5zaG93KCdhY2NlbGVyb21ldGVyJywgdGhpcy5fdGltZS50b0ZpeGVkKDIpLCBmYWxzZSk7XG4gICAgfSxcbiAgICBvbk5vOiBmdW5jdGlvbiBvbk5vKCkge1xuICAgICAgICAvL2dhbWUucG9zdEdhbWVTY29yZSgnYWNjZWxlcm9tZXRlcicsdGhpcy5fdGltZS50b0ZpeGVkKDMpLGZhbHNlKTtcbiAgICAgICAgLy9nYW1lLnNob3dOZXh0R2FtZSgnYWNjZWxlcm9tZXRlcicpO1xuICAgICAgICAvL+e7meWkmjEwc1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uTm9cIik7XG4gICAgICAgIHRoaXMuYXNrLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm91dGxpbmUgKz0gMTA7XG4gICAgICAgIHRoaXMucGF1c2VTdGF0dXMgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy9hZGRpbm5lcjpmdW5jdGlvbiAoKXtcbiAgICAvLyAgICB0aGlzLmRvQWNjKCk7XG4gICAgLy99LFxuICAgIGZpbmlzaDogZnVuY3Rpb24gZmluaXNoKCkge1xuICAgICAgICB0aGlzLm9uRGlzYWJsZSgpO1xuICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ2FjY2VsZXJvbWV0ZXInLCB0aGlzLl90aW1lLnRvRml4ZWQoMiksIHRydWUpO1xuICAgICAgICBTY29yZVZpZXcuc2hvdygnYWNjZWxlcm9tZXRlcicsIHRoaXMuX3RpbWUudG9GaXhlZCgyKSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIHRlc3RBZGQ6IGZ1bmN0aW9uIHRlc3RBZGQoKSB7XG4gICAgICAgIHRoaXMubnVtKys7XG5cbiAgICAgICAgaWYgKHRoaXMubnVtID09IDMpIHtcbiAgICAgICAgICAgIHRoaXMuYjEubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYjIubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmIyQW5pbS5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udW0gPT0gMikge1xuXG4gICAgICAgICAgICB2YXIgYW5pbSA9IHRoaXMuYjFBbmltO1xuXG4gICAgICAgICAgICB2YXIgYW5pbUN0cmwgPSBhbmltLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwibm8yXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubnVtID09IDEpIHtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSB0aGlzLmIxQW5pbTtcblxuICAgICAgICAgICAgdmFyIGFuaW1DdHJsID0gYW5pbS5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgYW5pbUN0cmwucGxheShcIm5vMVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm51bSA+IDMpIHtcbiAgICAgICAgICAgIHRoaXMubnVtID0gMDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxMDFhNjJqOCtWRHRvYm1Rc05RYXppNCcsICdzMTFfaW5zX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwxMVxcczExX2luc19sYXllci5qc1xuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJ3MxMV9nYW1lX2xheWVyJyk7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnYW1lOiBnYW1lXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG4gICAgZ29uZXh0OiBmdW5jdGlvbiBnb25leHQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiMTExMTExIGluc1wiKTtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5hY3RpdmUgPT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdvbmV4dCBpbnNcIik7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc2V0YWN0aXZlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjIyMjIyMiBpbnNcIik7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnY2I5ODVhcEVieENnNzNTMHh0eGhERlAnLCAnczEyX2dhbWVfbGF5ZXInKTtcbi8vIHNjcmlwdHNcXDEyXFxzMTJfZ2FtZV9sYXllci5qc1xuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL0RldmljZScpO1xudmFyIFNjb3JlVmlldyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9TY29yZVZpZXcnKTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBoYW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhdHVzOiBmYWxzZSxcblxuICAgICAgICBvdXRBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcbiAgICAgICAgb3V0QW5pbTAyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcbiAgICAgICAgb3V0QW5pbTAzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5dGltZTogMCxcbiAgICAgICAgb3V0bGluZTogMTUsXG5cbiAgICAgICAgbkFzazoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIG91dEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBvdXRBdWRpbzAyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBvdXRBdWRpbzAzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmluaXNoOiBmYWxzZSxcbiAgICAgICAgZ3VpZGVfbm9kZTogY2MuTm9kZSxcbiAgICAgICAgYnN0YXJ0Z2FtZTogZmFsc2UsXG5cbiAgICAgICAgbW92ZWhhbmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuICAgICAgICBsYXN0X251bTogLTFcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy90aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGFzdF9udW0gPSAtMTtcbiAgICAgICAgLy/liqjkvZxcbiAgICAgICAgdmFyIHBvcyA9IGNjLnYyKC02MCwgMTUwKTtcbiAgICAgICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIHZhciBtb3ZlVG8gPSBjYy5tb3ZlVG8oMC44LCBjYy52MigtMTUwLCAxNTApKTtcbiAgICAgICAgdmFyIG1vdmVCYWNrID0gY2MubW92ZVRvKDAuOCwgY2MudjIoLTYwLCAxNTApKTtcblxuICAgICAgICB0aGlzLmFjdGlvbiA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UobW92ZVRvLCBjYy5kZWxheVRpbWUoMSksIG1vdmVCYWNrLCBjYy5kZWxheVRpbWUoMSkpKTtcbiAgICAgICAgdGhpcy5tb3ZlaGFuZC5ub2RlLnJ1bkFjdGlvbih0aGlzLmFjdGlvbik7XG4gICAgfSxcbiAgICBvbkNsaWNrR3VpZGU6IGZ1bmN0aW9uIG9uQ2xpY2tHdWlkZSgpIHtcbiAgICAgICAgdGhpcy5ndWlkZV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJzdGFydGdhbWUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldGFjdGl2ZSgpO1xuICAgIH0sXG4gICAgc2V0YWN0aXZlOiBmdW5jdGlvbiBzZXRhY3RpdmUoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm91dEFuaW0ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vdXRBbmltMDIubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vdXRBbmltMDMubm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl90aW1lID0gMDtcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICB9LFxuXG4gICAgc3RhcnRHYW1lOiBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgZGV2aWNlLnByb3hpbWl0eVN0YXJ0KGZ1bmN0aW9uIChpc1N3aXRjaCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPSBpc1N3aXRjaCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnN0YXR1cyA9IGlzU3dpdGNoO1xuXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmlzRmluaXNoKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnN0YXR1cykge1xuXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRvTW92ZU91dCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGFuZC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm91dEFuaW0ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub3V0QW5pbTAyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm91dEFuaW0wMy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbiBlbmQoKSB7XG4gICAgICAgIGRldmljZS5wcm94aW1pdHlTdG9wKCk7XG4gICAgfSxcblxuICAgIGRvTW92ZU91dDogZnVuY3Rpb24gZG9Nb3ZlT3V0KCkge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5wbGF5dGltZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXl0aW1lKys7XG4gICAgICAgICAgICB0aGlzLmhhbmQubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVjU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYW5kLm5vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIHJhbiA9IHRoaXMuZ2V0UmFuZG9tTnVtKDEsIDMpO1xuICAgICAgICBpZiAodGhpcy5sYXN0X251bSA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0X251bSA9IHJhbjtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaXJzdFwiLCB0aGlzLmxhc3RfbnVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChyYW4gPT0gdGhpcy5sYXN0X251bSkge1xuICAgICAgICAgICAgICAgIHJhbiA9IHRoaXMuZ2V0UmFuZG9tTnVtKDEsIDMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2hpbGVcIiwgcmFuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0X251bSA9IHJhbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2Vjb25kXCIsIHRoaXMubGFzdF9udW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhbiA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLm91dEFuaW0ubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgYW5pbSA9IHRoaXMub3V0QW5pbTtcbiAgICAgICAgICAgIC8vYW5pbS5wbGF5KCk7XG4gICAgICAgICAgICB2YXIgYW5pbUN0cmwgPSBhbmltLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwiZ2V6aVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGFuaW1DdHJsLnBsYXkoXCJnZXppX2RqXCIpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5vdXRBdWRpbywgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuID09IDIpIHtcbiAgICAgICAgICAgIHRoaXMub3V0QW5pbTAyLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSB0aGlzLm91dEFuaW0wMjtcbiAgICAgICAgICAgIC8vYW5pbS5wbGF5KCk7XG4gICAgICAgICAgICB2YXIgYW5pbUN0cmwgPSBhbmltLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwiZ291XCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYW5pbUN0cmwucGxheShcImdvdV9kalwiKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuZW5kKCk7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMub3V0QXVkaW8wMiwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuID09IDMpIHtcbiAgICAgICAgICAgIHRoaXMub3V0QW5pbTAzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSB0aGlzLm91dEFuaW0wMztcbiAgICAgICAgICAgIC8vYW5pbS5wbGF5KCk7XG4gICAgICAgICAgICB2YXIgYW5pbUN0cmwgPSBhbmltLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwid2FcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwid2FfZGpcIik7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLm91dEF1ZGlvMDMsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wbGF5dGltZSsrO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBsYXl0aW1lKTtcblxuICAgICAgICBpZiAodGhpcy5wbGF5dGltZSA+PSAzKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmluaXNoID0gdHJ1ZTtcbiAgICAgICAgICAgIGdhbWUuc2hvd1RpcHMoXCJmaW5pc2ghXCIpO1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmZpbmlzaEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgICAgICAgICBfdGhpczIucmVzdWx0KHRydWUpO1xuICAgICAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9Nb3ZlQXdheTogZnVuY3Rpb24gZG9Nb3ZlQXdheSgpIHtcbiAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNGaW5pc2gpIHJldHVybjtcblxuICAgICAgICBpZiAoIXRoaXMuc3RhdHVzKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmQubm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIHJhbiA9IHRoaXMuZ2V0UmFuZG9tTnVtKDEsIDMpO1xuICAgICAgICAgICAgaWYgKHRoaXMubGFzdF9udW0gPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RfbnVtID0gcmFuO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaXJzdFwiLCB0aGlzLmxhc3RfbnVtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHJhbiA9PSB0aGlzLmxhc3RfbnVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhbiA9IHRoaXMuZ2V0UmFuZG9tTnVtKDEsIDMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndoaWxlXCIsIHJhbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0X251bSA9IHJhbjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlY29uZFwiLCB0aGlzLmxhc3RfbnVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJhbiA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRBbmltLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHZhciBhbmltID0gdGhpcy5vdXRBbmltO1xuICAgICAgICAgICAgICAgIC8vYW5pbS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1DdHJsID0gYW5pbS5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgICAgIGFuaW1DdHJsLnBsYXkoXCJnZXppXCIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwiZ2V6aV9kalwiKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMub3V0QXVkaW8sIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyYW4gPT0gMikge1xuICAgICAgICAgICAgICAgIHRoaXMub3V0QW5pbTAyLm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHZhciBhbmltID0gdGhpcy5vdXRBbmltMDI7XG4gICAgICAgICAgICAgICAgLy9hbmltLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbUN0cmwgPSBhbmltLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgYW5pbUN0cmwucGxheShcImdvdVwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbUN0cmwucGxheShcImdvdV9kalwiKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMub3V0QXVkaW8wMiwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbiA9PSAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRBbmltMDMubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFuaW0gPSB0aGlzLm91dEFuaW0wMztcbiAgICAgICAgICAgICAgICAvL2FuaW0ucGxheSgpO1xuICAgICAgICAgICAgICAgIHZhciBhbmltQ3RybCA9IGFuaW0ubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICBhbmltQ3RybC5wbGF5KFwid2FcIik7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1DdHJsLnBsYXkoXCJ3YV9kalwiKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5lbmQoKTtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMub3V0QXVkaW8wMywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucGxheXRpbWUrKztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGxheXRpbWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5dGltZSA+PSAyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0ZpbmlzaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ2FtZS5zaG93VGlwcyhcImZpbmlzaCFcIik7XG5cbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZmluaXNoQXVkaW8sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczMucmVzdWx0KHRydWUpO1xuICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhhbmQubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vdXRBbmltLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm91dEFuaW0wMi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vdXRBbmltMDMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzdWx0OiBmdW5jdGlvbiByZXN1bHQocmV0KSB7XG5cbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgICAgZ2FtZS5wb3N0R2FtZVNjb3JlKCdwcm94aW1pdHlfc2Vuc29yJywgdGhpcy5fdGltZS50b0ZpeGVkKDIpLCByZXQpO1xuICAgICAgICAgICAgU2NvcmVWaWV3LnNob3coJ3Byb3hpbWl0eV9zZW5zb3InLCB0aGlzLl90aW1lLnRvRml4ZWQoMiksIHJldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnYW1lLnBvc3RHYW1lU2NvcmUoJ3Byb3hpbWl0eV9zZW5zb3InLCB0aGlzLl90aW1lLnRvRml4ZWQoMiksIHJldCk7XG4gICAgICAgICAgICBTY29yZVZpZXcuc2hvdygncHJveGltaXR5X3NlbnNvcicsIHRoaXMuX3RpbWUudG9GaXhlZCgyKSwgcmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH0sXG5cbiAgICBvblllczogZnVuY3Rpb24gb25ZZXMoKSB7XG4gICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMubkFzay5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNC5yZXN1bHQoZmFsc2UpO1xuICAgICAgICB9LCAyMDAwKTtcblxuICAgICAgICBkZXZpY2UucHJveGltaXR5U3RvcCgpO1xuICAgIH0sXG5cbiAgICBvbk5vOiBmdW5jdGlvbiBvbk5vKCkge1xuICAgICAgICB0aGlzLm5Bc2suYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3V0bGluZSArPSAxMDtcblxuICAgICAgICBkZXZpY2UucHJveGltaXR5U3RvcCgpO1xuICAgIH0sXG4gICAgZ2V0UmFuZG9tTnVtOiBmdW5jdGlvbiBnZXRSYW5kb21OdW0oTWluLCBNYXgpIHtcbiAgICAgICAgdmFyIFJhbmdlID0gTWF4IC0gTWluO1xuICAgICAgICB2YXIgUmFuZCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiBNaW4gKyBNYXRoLnJvdW5kKFJhbmQgKiBSYW5nZSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmJzdGFydGdhbWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90aW1lICs9IGR0O1xuICAgICAgICAvLyBb5q2j5YiZ6KGo6L6+5byPXeiOt+WPluWwj+aVsOeCueWQjuS4ieS9jVxuICAgICAgICB2YXIgcmVnZXggPSAvKFswLTldK1xcLlswLTldezJ9KVswLTldKi87XG4gICAgICAgIHZhciB0aW1lU3RyID0gU3RyaW5nKHRoaXMuX3RpbWUpO1xuICAgICAgICB2YXIgZmluYWxTdHIgPSB0aW1lU3RyLnJlcGxhY2UocmVnZXgsIFwiJDFcIik7XG4gICAgICAgIGZpbmFsU3RyID0gZmluYWxTdHIgKyBcInNcIjtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSBmaW5hbFN0cjtcblxuICAgICAgICBpZiAodGhpcy5fdGltZSA+IHRoaXMub3V0bGluZSAmJiAhdGhpcy5kZWNTdGF0dXMpIHtcbiAgICAgICAgICAgIC8v6L+H5LqGMTBz6L+Y5pyq5qOA5rWL5Yiw5Lu75L2VXG4gICAgICAgICAgICB0aGlzLm5Bc2suYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczZTc5OTV3a0RaUGpLMFJnTThaajUydScsICdzMTJfaW5zX2xheWVyJyk7XG4vLyBzY3JpcHRzXFwxMlxcczEyX2luc19sYXllci5qc1xuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJ3MxMl9nYW1lX2xheWVyJyk7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnYW1lOiBnYW1lXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG4gICAgZ29uZXh0OiBmdW5jdGlvbiBnb25leHQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiMTExMTExIGluc1wiKTtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5hY3RpdmUgPT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdvbmV4dCBpbnNcIik7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc2V0YWN0aXZlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjIyMjIyMiBpbnNcIik7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjgyNDRQVU1LZEM0cXMweVhiTnM0a2InLCAnc2NvcmVWaWV3Jyk7XG4vLyBzY3JpcHRzXFxjb21tb25cXHNjb3JlVmlldy5qc1xuXG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9HYW1lJyk7XG52YXIgZGV2aWNlID0gcmVxdWlyZSgnLi4vY29tbW9uL0RldmljZScpO1xudmFyIG1haW5jZmcgPSByZXF1aXJlKCcuLi9jb21tb24vbWFpbmNmZycpO1xuXG52YXIgU2NvcmVWaWV3ID0gY2MuQ2xhc3Moe1xuICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdGl0bGVMYWJlbDogY2MuTGFiZWwsXG4gICAgc2NvcmVMYWJlbDogY2MuTGFiZWxcbiAgfSxcblxuICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgdmFyIGxpc3RlbmVyID0ge1xuICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKHRvdWNoZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBvblRvdWNoTW92ZWQ6IGZ1bmN0aW9uIG9uVG91Y2hNb3ZlZCgpIHt9LFxuICAgICAgb25Ub3VjaEVuZGVkOiBmdW5jdGlvbiBvblRvdWNoRW5kZWQoKSB7fSxcbiAgICAgIG9uVG91Y2hDYW5jZWxsZWQ6IGZ1bmN0aW9uIG9uVG91Y2hDYW5jZWxsZWQoKSB7fVxuICAgIH07XG4gICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzLm5vZGUpO1xuICB9LFxuICBzZXRHYW1lS2V5OiBmdW5jdGlvbiBzZXRHYW1lS2V5KGdhbWVfa2V5LCByZXQpIHtcbiAgICB0aGlzLmdhbWVfa2V5ID0gZ2FtZV9rZXk7XG4gICAgdmFyIGNvbmZpZyA9IGdhbWUuZ2V0R2FtZUNvbmZpZyhnYW1lX2tleSk7XG4gICAgaWYgKHJldCkgdGhpcy50aXRsZUxhYmVsLnN0cmluZyA9IGNvbmZpZy5uYW1lICsgJyBpcyBmdW5jdGlvbmluZyBwcm9wZXJseSc7ZWxzZSB7XG5cbiAgICAgIHRoaXMudGl0bGVMYWJlbC5zdHJpbmcgPSBjb25maWcubmFtZSArICcgdGVzdCBmYWlscyc7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnRpdGxlTGFiZWwuc3RyaW5nKTtcbiAgICB9XG4gIH0sXG4gIHNldFNjb3JlOiBmdW5jdGlvbiBzZXRTY29yZShzY29yZSkge1xuICAgIHZhciBjb25maWcgPSBnYW1lLmdldEdhbWVDb25maWcodGhpcy5nYW1lX2tleSk7XG4gICAgdGhpcy5zY29yZUxhYmVsLnN0cmluZyA9IHNjb3JlLnRvU3RyaW5nKCkgKyBjb25maWcuc2NvcmVfdW5pdDtcbiAgfSxcbiAgZ29TaGFyZTogZnVuY3Rpb24gZ29TaGFyZSgpIHtcbiAgICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICB2YXIgcmVuZGVyVGV4dHVyZSA9IGpzYi5SZW5kZXJUZXh0dXJlTXlDcmVhdGUod2luU2l6ZS53aWR0aCwgd2luU2l6ZS5oZWlnaHQpO1xuXG4gICAgcmVuZGVyVGV4dHVyZS5iZWdpbigpO1xuICAgIGNjLmRpcmVjdG9yLmdldFJ1bm5pbmdTY2VuZSgpLnZpc2l0KCk7XG4gICAgcmVuZGVyVGV4dHVyZS5lbmQoKTtcbiAgICB2YXIgZmlsZW5hbWUgPSAnc2hhcmUtJyArIERhdGUubm93KCkgKyAnLnBuZyc7XG4gICAgdmFyIGZpbGVwYXRoID0ganNiLmZpbGVVdGlscy5nZXRXcml0YWJsZVBhdGgoKSArIGZpbGVuYW1lO1xuXG4gICAgcmVuZGVyVGV4dHVyZS5zYXZlVG9GaWxlKGZpbGVuYW1lLCBjYy5JbWFnZUZvcm1hdC5QTkcsIHRydWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRldmljZS5zaGFyZVRvT3RoZXJBcHAoZmlsZXBhdGgpO1xuICAgIH0pO1xuICB9LFxuICBnb0hvbWU6IGZ1bmN0aW9uIGdvSG9tZSgpIHtcbiAgICB2YXIgaW50ZW50R2FtZUlkID0gZGV2aWNlLmludGVudEdhbWVJZCgpO1xuICAgIGlmIChpbnRlbnRHYW1lSWQgIT0gJycpIHtcbiAgICAgIC8vIHJldHVybiBkZXZpY2UuZXhpdE1lKCk7XG4gICAgICByZXR1cm4gY2MuZGlyZWN0b3IuZW5kKCk7XG4gICAgfVxuXG4gICAgbWFpbmNmZy5wYWdlID0gMjtcbiAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ01haW5TY2VuZScpO1xuICB9LFxuICBnb05leHQ6IGZ1bmN0aW9uIGdvTmV4dCgpIHtcbiAgICAvLyBsZXQgaW50ZW50R2FtZUlkID0gZGV2aWNlLmludGVudEdhbWVJZCgpO1xuICAgIC8vIGlmKGludGVudEdhbWVJZCAhPSAnJyl7XG4gICAgLy8gICAvLyByZXR1cm4gZGV2aWNlLmV4aXRNZSgpO1xuICAgIC8vICAgcmV0dXJuIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgIC8vIH1cblxuICAgIC8vIHZhciByZWIgPSBnYW1lLnNob3dOZXh0R2FtZSh0aGlzLmdhbWVfa2V5KTtcbiAgICAvLyBpZiAoIXJlYikge1xuICAgIC8vICAgZ2FtZS5zaG93VGlwcygnSW4gZGV2ZWxvcG1lbnQgLi4uJyk7XG4gICAgLy8gfVxuXG4gICAgdmFyIGdhbWVfY29uZmlnID0gZ2FtZS5nZXRHYW1lQ29uZmlnKHRoaXMuZ2FtZV9rZXkpO1xuICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShnYW1lX2NvbmZpZy5zY2VuZU5hbWUpO1xuICB9LFxuICB1c2VyY2xpY2s6IGZ1bmN0aW9uIHVzZXJjbGljaygpIHt9XG59KTtcblxuU2NvcmVWaWV3LnNob3cgPSBmdW5jdGlvbiAoZ2FtZV9rZXksIHNjb3JlLCByZXQpIHtcbiAgdmFyIHdpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG5cbiAgdmFyIHByZWZhYiA9IGNjLmxvYWRlci5nZXRSZXMoJ3ByZWZhYnMvc2NvcmVWaWV3Jyk7XG4gIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgbmV3Tm9kZS5zZXRQb3NpdGlvbihjYy52Mih3aW5TaXplLndpZHRoIC8gMiwgd2luU2l6ZS5oZWlnaHQgLyAyKSk7XG4gIG5ld05vZGUuZ2V0Q29tcG9uZW50KCdzY29yZVZpZXcnKS5zZXRHYW1lS2V5KGdhbWVfa2V5LCByZXQpO1xuICBuZXdOb2RlLmdldENvbXBvbmVudCgnc2NvcmVWaWV3Jykuc2V0U2NvcmUoc2NvcmUpO1xuXG4gIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobmV3Tm9kZSk7XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZmI3MDNmZTAyeE51SmRaRzI4QTcxREgnLCAndGVzdC5qcycpO1xuLy8gc2NyaXB0c1xcdGVzdFxcdGVzdC5qcy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWRmZDh5elgxSk5qNE9LbUZlckJDeHonLCAndGVzdDAxJyk7XG4vLyBzY3JpcHRzXFx0ZXN0XFx0ZXN0MDEuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdyZWF0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmdyZWF0Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGJ0bjogZnVuY3Rpb24gYnRuKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZ3JlYXQubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uID0gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDMpLCBjYy5zY2FsZVRvKDAuMiwgMSkpO1xuICAgICAgICB0aGlzLmdyZWF0Lm5vZGUucnVuQWN0aW9uKHRoaXMuYWN0aW9uKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmdyZWF0Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0sIDQwMCk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
