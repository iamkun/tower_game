var domReady,
  loadFinish,
  canvasReady,
  loadError,
  gameStart,
  game,
  score,
  successCount;

// init window height and width
var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;
var ratio = 1.5;
if (gameHeight / gameWidth < ratio) {
  gameWidth = Math.ceil(gameHeight / ratio);
}
$(".content").css({ height: gameHeight + "px", width: gameWidth + "px" });
$(".js-modal-content").css({ width: gameWidth + "px" });

// loading animation
function hideLoading() {
  if (domReady && canvasReady) {
    $("#canvas").show();
    loadFinish = true;
    setTimeout(function () {
      $(".loading").hide();
      $(".landing").show();
    }, 1000);
  }
}

function updateLoading(status) {
  var success = status.success;
  var total = status.total;
  var failed = status.failed;
  if (failed > 0 && !loadError) {
    loadError = true;
    alert("Network error... Please try again.");
    return;
  }
  var percent = parseInt((success / total) * 100);
  if (percent === 100 && !canvasReady) {
    canvasReady = true;
    hideLoading();
  }
  percent = percent > 98 ? 98 : percent;
  percent = percent + "%";
  $(".loading .title").text(percent);
  $(".loading .percent").css({
    width: percent,
  });
}

async function overShowOver() {
  window.location.href = window.location.href + "?s=" + +new Date();
}

let prevScore = 0;
// game customization options
const option = {
  width: gameWidth,
  height: gameHeight,
  canvasId: "canvas",
  soundOn: true,
  setGameScore: function (s) {
    score = s;
    updatePoints(s - prevScore);
    prevScore = s;
    fetchLeaderboardData();
  },
  setGameSuccess: function (s) {
    successCount = s;
  },
  setGameFailed: function (f) {
    $("#score").text(score);

    if (f >= 3) {
      const gameEnded = document.getElementById("play-again-modal");

      if (gameEnded) {
        gameEnded.style.display = "flex";
        const scoreModal = document.getElementById("modal-score");
        scoreModal.innerText = score;
        const playAgainBtn = document.getElementById("playAgainBtn");
        playAgainBtn.onclick = () => {
          gameStart();
        };
      }
      overShowOver();
    }
  },
};

// game init with option
function gameReady() {
  game = TowerGame(option);
  game.load(function () {
    game.init();
    setTimeout(function () {
      game.playBgm();
    });
  }, updateLoading);
}

var isWechat =
  navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
if (isWechat) {
  document.addEventListener("WeixinJSBridgeReady", gameReady, false);
} else {
  gameReady();
}

function indexHide() {
  $(".landing .action-1").addClass("slideTop");
  $(".landing .action-2").addClass("slideBottom");
  setTimeout(function () {
    $(".landing").hide();
  }, 950);
}

// click event

// listener
window.addEventListener(
  "load",
  function () {
    domReady = true;
    hideLoading();
  },
  false
);
