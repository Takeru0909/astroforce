window.addEventListener("load", initHome);

var w = window.innerWidth;
var h = window.innerHeight;
var is_game_end = false;
var is_enemy_animation = false;

createjs.Sound.registerSound("static/page/sound/button05.mp3", "click");
createjs.Sound.registerSound("static/page/sound/drop_piece.mp3", "drop_piece");
createjs.Sound.registerSound("static/page/sound/birth-and-death.mp3", "bgm");
createjs.Sound.registerSound("static/page/sound/light.mp3", "light");
createjs.Sound.registerSound("static/page/sound/win.mp3", "win");
createjs.Sound.registerSound("static/page/sound/lose.mp3", "lose");
var bgm = createjs.Sound.play("bgm");

function initHome () {
  const homeStage = new createjs.Stage("myCanvas");
  homeStage.canvas.width = w;
  homeStage.canvas.height = h;
  var select = document.getElementById('selectLevel');
  var selectOriginal = select.style.display;
  select.style.display = 'none';

  var astroforce = new createjs.Bitmap("static/page/image/astroforce.png");
  var playButton = new createjs.Bitmap("static/page/image/playbutton.png");
  var ruleButton = new createjs.Bitmap("static/page/image/rulebutton.png");
  astroforce.x = w * 0.001;
  astroforce.y = h * 0.001;
  playButton.x = w * 0.5 - 147;
  playButton.y = h * 0.65;
  ruleButton.x = w * 0.5 - 147;
  ruleButton.y = h * 0.8;
  homeStage.addChild(astroforce, playButton, ruleButton);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;

  playButton.addEventListener("click", playButtonClick);
  ruleButton.addEventListener("click", ruleButtonClick);

  function playButtonClick(event){
    createjs.Sound.play("click");
    select.style.display = selectOriginal;
    $('.image').children('img').attr('src', 'static/page/image/space.png');
    bgm.play();
    bgm.volume = 0.5;
    bgm.loop = -1;
    initGame("easy");
    playButton.removeAllEventListeners();
    ruleButton.removeAllEventListeners();
  }

  function ruleButtonClick(event){
    createjs.Sound.play("click");
    const ruleBack = new createjs.Shape();
    ruleBack.graphics.beginFill("#000B37");
    ruleBack.graphics.drawRect(0, 0, w, h);
    ruleBack.alpha = 0.5;
    homeStage.addChild(ruleBack);
    var rule = new createjs.Bitmap("static/page/image/rule.png");
    var x = new createjs.Bitmap("static/page/image/x.png");
    x.x = w*0.5 + 524*0.4;
    x.y = h*0.5 - 490*0.55;
    rule.x = w*0.5 -524*0.5;
    rule.y = h*0.5 -490*0.5;
    homeStage.addChild(rule, x);
    x.addEventListener("click", xButtonClick);
    playButton.removeAllEventListeners();
    ruleButton.removeAllEventListeners();
    function xButtonClick(event) {
      createjs.Sound.play("click");
      playButton.addEventListener("click", playButtonClick);
      ruleButton.addEventListener("click", ruleButtonClick);
      homeStage.removeChild(ruleBack, rule, x);
    }
  }

  createjs.Ticker.addEventListener("tick", function () {
    homeStage.update();
  });
}

function initGame(game_level) {
  [stage, pieces] = initalizeCanvas();
  reloadPiece(stage, pieces, game_level);
}

function initalizeCanvas() {
  const stage = new createjs.Stage("myCanvas");
  const pieces = Array(42).fill(0);
  var astroforce = new createjs.Bitmap("static/page/image/astroforce.png");
  astroforce.x = w * 0.001;
  astroforce.y = h * 0.001;
  const state = new createjs.Bitmap("static/page/image/board_42.png");
  const stateBack = new createjs.Shape();
  var stateX = w*0.5 - 405;
  var stateY = h*0.5 - 335;
  state.x = stateX;
  state.y = stateY;
  stateBack.graphics.beginFill("#000C32");
  stateBack.graphics.drawRect(stateX, stateY, 810, 670);
  stateBack.alpha = 0.7;
  stage.addChild(astroforce, stateBack, state);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", function () {
    stage.update();
  });

  var select = document.getElementById('selectLevel');
  select.onchange = function(){
    stage.removeChild(state, stateBack);
  }
  return [stage, pieces];
}

function putPieceY(pieces, action) {
  for (let y = 5; y > -1; y--) {
    if (pieces[action + y * 7] == 0) {
      return y;
    }
  }
}

function legalActions(pieces) {
  var actions = [];
  for (let i=0; i<7; i++) {
    if (pieces[i] == 0) {
      actions.push(i);
    };
  };
  return actions;
};

function lightUp(comp_x, comp_y, dx, dy) {
  createjs.Sound.play("light");
  var light = new createjs.Bitmap("static/page/image/light.png");
  light.x = (w*0.5 - 390) + 110 * (comp_x+dx);
  light.y = (h * 0.5 - 335) + 110 * (comp_y+dy);
  stage.addChild(light);
}

function checkCompType(comp_type, i) {
  if (comp_type == "horizontal") {
    var dx = i;
    var dy = 0;
  } else if (comp_type == "vertical") {
    var dx = 0;
    var dy = i;
  } else if (comp_type == "diagonal right up") {
      var dx = i;
      var dy = -i;
  } else {
    var dx = i;
    var dy = i;
  }
  return [dx, dy];
}

function homeButtonClick(event) {
  window.location.reload(true);
}

function isWin (stage, comp_place) {
  bgm.stop();
  var comp_x = comp_place.i;
  var comp_y = comp_place.j;
  var comp_type = comp_place.comp_type;
  for (let i=0; i<4; i++) {
    [dx, dy] = checkCompType(comp_type, i);
    setTimeout(lightUp, 500+400*i, comp_x, comp_y, dx, dy);
  }
  setTimeout(function() {
    createjs.Sound.play("win");
    const winBack = new createjs.Shape();
    winBack.graphics.beginFill("#000B37");
    winBack.graphics.drawRect(0, 0, w, h);
    winBack.alpha = 0.5;
    var winPic = new createjs.Bitmap("static/page/image/win.png");
    winPic.x = w*0.5 - 521*0.5;
    winPic.y = h*0.5 - 497*0.5;
    var home = new createjs.Bitmap("static/page/image/homebutton.png");
    home.x = w * 0.5 - 296*0.5;
    home.y = h * 0.8;
    stage.addChild(winBack, winPic, home);
    home.addEventListener("click", homeButtonClick);
  }, 4000);
};

function isLose (stage, comp_place) {
  var comp_action = comp_place.i;
  var comp_y = comp_place.j;
  var comp_type = comp_place.comp_type;
  for (let i=0; i<4; i++) {
    [dx, dy] = checkCompType(comp_type, i);
    setTimeout(lightUp, 2500+400*i, comp_action, comp_y, dx, dy);
  };
  setTimeout(function() {
    createjs.Sound.play("lose");
    const loseBack = new createjs.Shape();
    loseBack.graphics.beginFill("#000B37");
    loseBack.graphics.drawRect(0, 0, w, h);
    loseBack.alpha = 0.5;
    var losePic = new createjs.Bitmap("static/page/image/lose.png");
    losePic.x = w*0.5 - 555*0.5;
    losePic.y = h*0.5 - 526*0.5;
    var home = new createjs.Bitmap("static/page/image/homebutton.png");
    home.x = w * 0.5 - 296*0.5;
    home.y = h * 0.8;
    stage.addChild(loseBack, losePic, home);
    home.addEventListener("click", homeButtonClick);
  }, 5100);
};

function isDraw (stage) {
  createjs.Sound.play("win");
  const drawBack = new createjs.Shape();
  drawBack.graphics.beginFill("#000B37");
  drawBack.graphics.drawRect(0, 0, w, h);
  drawBack.alpha = 0.5;
  var drawPic = new createjs.Bitmap("static/page/image/draw.png");
  drawPic.x = w*0.5 - 555*0.5;
  drawPic.y = h*0.5 - 555*0.5;
  var home = new createjs.Bitmap("static/page/image/homebutton.png");
  home.x = w * 0.5 - 296*0.5;
  home.y = h * 0.8;
  stage.addChild(drawBack, drawPic, home);
  home.addEventListener("click", homeButtonClick);
}

function ajax(stage, action, piece_type, pieces, game_level) {
  var select = document.getElementById('selectLevel');
  console.log(select.value, game_level)
  if (select.value != game_level) return;
  $.ajax({
    url: '/api/inputstones/',
    type: 'GET',
    data: {
      'action': action,
      'piece_type': piece_type,
      'before_user_state': pieces,
      'game_level': game_level
    }
  })
    // Ajaxリクエストが成功した時発動
    .done((data) => {
      var ai_alien = new createjs.Bitmap("static/page/image/blue_alien.png");
      var ai_ufo = new createjs.Bitmap("static/page/image/blue_ufo.png");
      const state = new createjs.Bitmap("static/page/image/board_42.png");
      state.x = w * 0.5 - 405;
      state.y = h * 0.5 - 335;
      is_enemy_animation = true;
      // サーバーが算出した敵のアクションを表示
      var dataJson = JSON.parse(data);
      console.log("dataJson", dataJson);
      var ai_piece_type = dataJson.ai_piece_type;
      var ai_action = dataJson.ai_action;
      var next_user_state = dataJson.next_user_state;
      var next_ai_state = dataJson.next_ai_state;
      var win = dataJson.win;
      var comp_place = dataJson.comp_place;
      setTimeout(
        function() {
          if (win == "PLAYER") {
            isWin(stage, comp_place);
            is_game_end = true;
          } else if (win == "AI") {
            is_game_end = true;
            if (ai_piece_type == 2) {
              ai_piece = ai_alien;
            } else {
              ai_piece = ai_ufo;
            }
            ai_piece_y = putPieceY(next_user_state, ai_action);
            ai_piece.x = (w*0.5 - 380) + 110 * ai_action;
            stage.addChild(ai_piece, state);
            const last_state = new createjs.Bitmap("static/page/image/board_42.png");
            last_state.x = w * 0.5 - 405;
            last_state.y = h * 0.5 - 335;
            stage.addChild(last_state);
            createjs.Tween.get(ai_piece).to({ y: (h * 0.5 - 325) + 110 * ai_piece_y }, 1000, createjs.Ease.cubicIn);
            setTimeout(function() {
              createjs.Sound.play("drop_piece");
              bgm.stop();
            }, 1000);
            isLose(stage, comp_place);
          } else if (win == "DRAW") {
            is_game_end = true;
            if (ai_piece_type == 2) {
              ai_piece = ai_alien;
            } else {
              ai_piece = ai_ufo;
            };
            ai_piece_y = putPieceY(next_user_state, ai_action);
            ai_piece.x = (w*0.5 - 380) + 110 * ai_action;
            stage.addChild(ai_piece, state);
            const last_state = new createjs.Bitmap("static/page/image/board_42.png");
            last_state.x = w * 0.5 - 405;
            last_state.y = h * 0.5 - 335;
            stage.addChild(last_state);
            createjs.Tween.get(ai_piece).to({ y: (h * 0.5 - 325) + 110 * ai_piece_y }, 1000, createjs.Ease.cubicIn);
            setTimeout(function() {
              createjs.Sound.play("drop_piece");
            }, 1000);
            isDraw(stage);
          } else {
            if (ai_piece_type == 2) {
              ai_piece = ai_alien;
            } else {
              ai_piece = ai_ufo;
            };
            ai_piece_y = putPieceY(next_user_state, ai_action);
            ai_piece.x = (w*0.5 - 380) + 110 * ai_action;
            stage.addChild(ai_piece, state);
            var select = document.getElementById('selectLevel');
            select.onchange = function(){
            stage.removeChild(ai_piece, state);
            return
            };
            createjs.Tween.get(ai_piece).to({ y: (h * 0.5 - 325) + 110 * ai_piece_y }, 1000, createjs.Ease.cubicIn)
            .call(
            function () {
                is_enemy_animation = false;
            });
            setTimeout(function() {
              createjs.Sound.play("drop_piece");
            }, 1000);
            reloadPiece(stage, next_ai_state, game_level);
          }
        }, 2000);
    })
    .fail((data) => {
      // エラー
      console.log("error");
    })
    .always((data) => {
    });
}

function reloadPiece(stage, pieces, game_level) {
  var stateX = w * 0.5 - 405;
  var piece_place1 = new createjs.Bitmap("static/page/image/piece_place1.png");
  piece_place1.x = stateX * 0.5 - 55;
  piece_place1.y = h * 0.6;
  var piece_place2 = new createjs.Bitmap("static/page/image/piece_place2.png");
  piece_place2.x = stateX * 0.5 - 55;
  piece_place2.y = h * 0.8;
  var alien = new createjs.Bitmap("static/page/image/green_alien.png");
  alien.x = (w * 0.5 - 405) * 0.5 - 50;
  alien.y = h * 0.6 + 5;
  var ufo = new createjs.Bitmap("static/page/image/green_ufo.png");
  ufo.x = (w * 0.5 - 405) * 0.5 - 50;
  ufo.y = h * 0.8 + 5;
  stage.addChild(piece_place1, piece_place2, alien, ufo);
  var board_ufo = new createjs.Bitmap("static/page/image/board_ufo.png");
  board_ufo.y = 0;
  board_ufo.visible = false; 
  stage.addChild(board_ufo);
  // alienの処理
  alien.addEventListener("mousedown", outerHandleAlienDown(stage, alien));
  alien.addEventListener("pressmove", outerHandleAlienMove(stage, alien, board_ufo));
  alien.addEventListener("pressup", outerHandleAlienUp(stage, alien, pieces, game_level, board_ufo));

  // ufoの処理
  ufo.addEventListener("mousedown", outerHandleUfoDown(stage, ufo));
  ufo.addEventListener("pressmove", outerHandleUfoMove(stage, ufo, board_ufo));
  ufo.addEventListener("pressup", outerHandleUfoUp(stage, ufo, pieces, game_level, board_ufo));
  var select = document.getElementById('selectLevel');
  select.onchange = function(){
    var game_level = this.value;
    alien.removeAllEventListeners();
    ufo.removeAllEventListeners();
    stage.removeChild(piece_place1, piece_place2, alien, ufo);
    initGame(game_level);
    return
  }
}

// alienのドラッグ・アンド・ドロップ
function outerHandleAlienDown(stage, alien) {
  function handleAlienDown(event) {
    if (is_game_end) return;
    if (is_enemy_animation) return;
    dragPointAlienX = stage.mouseX - alien.x;
    dragPointAlienY = stage.mouseY - alien.y;
  }
  return handleAlienDown;
}

function outerHandleAlienMove(stage, alien, board_ufo) {
  function handleAlienMove(event) {
    if (is_game_end) return;
    if (is_enemy_animation) return;
    alien.x = stage.mouseX - dragPointAlienX;
    alien.y = stage.mouseY - dragPointAlienY;
    var board_ufo_mx = stage.mouseX;
    var board_ufo_my = stage.mouseY;
    if (w*0.5-405 < board_ufo_mx && board_ufo_mx < w*0.5+405 && h*0.5-335 < board_ufo_my && board_ufo_my < h*0.5+335) { // 盤面内の場合
      board_ufo.visible = true; 
      if (w*0.5-405 < board_ufo_mx && board_ufo_mx < w*0.5-275) { // １列目が選択された場合
        board_ufo.x = w*0.5 - 340 - 63;
      };
      if (w*0.5-275 < board_ufo_mx && board_ufo_mx < w*0.5-165) { // 2列目が選択された場合
        board_ufo.x = w*0.5 - 220 - 63;
      };
      if (w*0.5-165 < board_ufo_mx && board_ufo_mx < w*0.5-55) { // 3列目が選択された場合
        board_ufo.x = w*0.5 - 110 - 63;
      }
      if (w*0.5-55 < board_ufo_mx && board_ufo_mx < w*0.5+55) { // 4列目が選択された場合
        board_ufo.x = w*0.5 - 63;
      };
      if (w*0.5+55 < board_ufo_mx && board_ufo_mx < w*0.5+165) { // 5列目が選択された場合
        board_ufo.x = w*0.5 + 110 - 63;
      };
      if (w*0.5+165 < board_ufo_mx && board_ufo_mx < w*0.5+275) { // 6列目が選択された場合
        board_ufo.x = w*0.5 + 220 - 63;
      };
      if (w*0.5+275 < board_ufo_mx && board_ufo_mx < w*0.5+405) { // 7列目が選択された場合
        board_ufo.x = w*0.5 + 340 - 63;
      };
    } else {
      board_ufo.visible = false;
    };
  };
  return handleAlienMove;
};

function outerHandleAlienUp(stage, alien, pieces, game_level, board_ufo) {
  function handleAlienUp(event) {
    if (is_game_end) return;
    if (is_enemy_animation) return;
    stage.removeChild(board_ufo);
    const state = new createjs.Bitmap("static/page/image/board_42.png");
    state.x = w * 0.5 - 405;
    state.y = h * 0.5 - 335;
    stage.addChild(state);
    var alien_mx = stage.mouseX;
    var alien_my = stage.mouseY;
    var legal_action = legalActions(pieces);
    piece_type = 1;
    if (w*0.5-405 < alien_mx && alien_mx < w*0.5+405 && h*0.5-335 < alien_my && alien_my < h*0.5+335) { // 盤面内の場合
      if (w*0.5-405 < alien_mx && alien_mx < w*0.5-275) { // １列目が選択された場合
        action = 0;
        console.log("一列目が選択されました");
      }
      if (w*0.5-275 < alien_mx && alien_mx < w*0.5-165) { // 2列目が選択された場合
        action = 1;
        console.log("二列目が選択されました");
      }
      if (w*0.5-165 < alien_mx && alien_mx < w*0.5-55) { // 3列目が選択された場合
        action = 2;
        console.log("三列目が選択されました");
      }
      if (w*0.5-55 < alien_mx && alien_mx < w*0.5+55) { // 4列目が選択された場合
        action = 3;
        console.log("四列目が選択されました");
      }
      if (w*0.5+55 < alien_mx && alien_mx < w*0.5+165) { // 5列目が選択された場合
        action = 4;
        console.log("五列目が選択されました");
      }
      if (w*0.5+165 < alien_mx && alien_mx < w*0.5+275) { // 6列目が選択された場合
        action = 5;
        console.log("六列目が選択されました");
      }
      if (w*0.5+275 < alien_mx && alien_mx < w*0.5+405) { // 7列目が選択された場合
        action = 6;
        console.log("七列目が選択されました");
      }
      if (legal_action.includes(action)) {
        alienY = putPieceY(pieces, action);
        alien.y = 0;
        createjs.Tween.get(alien).to({ x: (w*0.5 - 380) + 110 * action }, 1).to({ y: (h * 0.5 - 325) + 110 * alienY }, 1000, createjs.Ease.cubicIn);
        setTimeout(function() {
          createjs.Sound.play("drop_piece");
        }, 1000);
        alien.removeAllEventListeners();
        ajax(stage, action, piece_type, pieces, game_level);
      } else {
        stage.removeChild(alien);
        alien.removeAllEventListeners();
        reloadPiece(stage, pieces, game_level);
      };
    } else {
      stage.removeChild(alien);
      alien.removeAllEventListeners();
      reloadPiece(stage, pieces, game_level);
    };
  };
  return handleAlienUp;
};

// ufoのドラッグ・アンド・ドロップ
function outerHandleUfoDown(stage, ufo) {
  function handleUfoDown(event) {
    if (is_game_end) return;
    if (is_enemy_animation) return;
    dragPointUfoX = stage.mouseX - ufo.x;
    dragPointUfoY = stage.mouseY - ufo.y;
  }
  return handleUfoDown;
}

function outerHandleUfoMove(stage, ufo, board_ufo) {
  function handleUfoMove(event) {
    if (is_game_end) return;
    if (is_enemy_animation) return;
    ufo.x = stage.mouseX - dragPointUfoX;
    ufo.y = stage.mouseY - dragPointUfoY;
    var board_ufo_mx = stage.mouseX;
    var board_ufo_my = stage.mouseY;
    if (w*0.5-405 < board_ufo_mx && board_ufo_mx < w*0.5+405 && h*0.5-335 < board_ufo_my && board_ufo_my < h*0.5+335) { // 盤面内の場合
      board_ufo.visible = true; 
      if (w*0.5-405 < board_ufo_mx && board_ufo_mx < w*0.5-275) { // １列目が選択された場合
        board_ufo.x = w*0.5 - 340 - 63;
      };
      if (w*0.5-275 < board_ufo_mx && board_ufo_mx < w*0.5-165) { // 2列目が選択された場合
        board_ufo.x = w*0.5 - 220 - 63;
      };
      if (w*0.5-165 < board_ufo_mx && board_ufo_mx < w*0.5-55) { // 3列目が選択された場合
        board_ufo.x = w*0.5 - 110 - 63;
      };
      if (w*0.5-55 < board_ufo_mx && board_ufo_mx < w*0.5+55) { // 4列目が選択された場合
        board_ufo.x = w*0.5 - 63;
      };
      if (w*0.5+55 < board_ufo_mx && board_ufo_mx < w*0.5+165) { // 5列目が選択された場合
        board_ufo.x = w*0.5 + 110 - 63;
      };
      if (w*0.5+165 < board_ufo_mx && board_ufo_mx < w*0.5+275) { // 6列目が選択された場合
        board_ufo.x = w*0.5 + 220 - 63;
      };
      if (w*0.5+275 < board_ufo_mx && board_ufo_mx < w*0.5+405) { // 7列目が選択された場合
        board_ufo.x = w*0.5 + 340 - 63;
      };
    } else {
      board_ufo.visible = false;
    };
  };
  return handleUfoMove;
};

function outerHandleUfoUp(stage, ufo, pieces, game_level, board_ufo) {
  function handleUfoUp(event) {
    if (is_game_end) return;
    if (is_enemy_animation) return;
    stage.removeChild(board_ufo);
    const state = new createjs.Bitmap("static/page/image/board_42.png");
    state.x = w * 0.5 - 405;
    state.y = h * 0.5 - 335;
    stage.addChild(state);
    var ufo_mx = stage.mouseX;
    var ufo_my = stage.mouseY;
    var legal_action = legalActions(pieces); 
    piece_type = 3;
    if (w*0.5-405 < ufo_mx && ufo_mx < w*0.5+405 && h*0.5-335 < ufo_my && ufo_my < h*0.5+335) { // 盤面内の場合
      if (w*0.5-405 < ufo_mx && ufo_mx < w*0.5-275) { // １列目が選択された場合
        action = 0;
        console.log("一列目が選択されました");
      };
      if (w*0.5-275 < ufo_mx && ufo_mx < w*0.5-165) { // 2列目が選択された場合
        action = 1;
        console.log("二列目が選択されました");
      };
      if (w*0.5-165 < ufo_mx && ufo_mx < w*0.5-55) { // 3列目が選択された場合
        action = 2;
        console.log("三列目が選択されました");
      };
      if (w*0.5-55 < ufo_mx && ufo_mx < w*0.5+55) { // 4列目が選択された場合
        action = 3;
        console.log("四列目が選択されました");
      };
      if (w*0.5+55 < ufo_mx && ufo_mx < w*0.5+165) { // 5列目が選択された場合
        action = 4;
        console.log("五列目が選択されました");
      };
      if (w*0.5+165 < ufo_mx && ufo_mx < w*0.5+275) { // 6列目が選択された場合
        action = 5;
        console.log("六列目が選択されました");
      };
      if (w*0.5+275 < ufo_mx && ufo_mx < w*0.5+405) { // 7列目が選択された場合
        action = 6;
        console.log("七列目が選択されました");
      };
      if (legal_action.includes(action)) {
        ufoY = putPieceY(pieces, action);
        ufo.y = 0;
        createjs.Tween.get(ufo).to({ x: (w*0.5 - 380) + 110 * action }, 1).to({ y: (h * 0.5 - 325) + 110 * ufoY }, 1000, createjs.Ease.cubicIn);
        setTimeout(function() {
          createjs.Sound.play("drop_piece");
        }, 1000);
        ufo.removeAllEventListeners();
        ajax(stage, action, piece_type, pieces, game_level);
      } else {
        stage.removeChild(ufo);
        ufo.removeAllEventListeners();
        reloadPiece(stage, pieces, game_level);
      };
    } else{
      stage.removeChild(ufo);
      ufo.removeAllEventListeners();
      reloadPiece(stage, pieces, game_level);
    };
  };
  return handleUfoUp;
};