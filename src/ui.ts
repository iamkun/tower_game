import { TowerGameInstance, TowerGameOption } from './types'

declare global {
  interface Window {
    TowerGame: (option: TowerGameOption) => TowerGameInstance;
  }
}

export function initUI(): void {
  let domReady: boolean, loadFinish: boolean, canvasReady: boolean, loadError: boolean, gameStart: boolean, game: TowerGameInstance, score: number, successCount: number

  let gameWidth = window.innerWidth
  const gameHeight = window.innerHeight
  const ratio = 1.5
  if (gameHeight / gameWidth < ratio) {
    gameWidth = Math.ceil(gameHeight / ratio);
  }
  $('.content').css({ "height": `${gameHeight}px`, "width": `${gameWidth}px` })
  $('.js-modal-content').css({ "width": `${gameWidth}px` })

  function hideLoading(): void {
    if (domReady && canvasReady) {
      $('#canvas').show()
      loadFinish = true
      setTimeout(function () {
        $('.loading').hide()
        $('.landing').show()
      }, 1000)
    }
  }

  function updateLoading(status: { success: number, total: number, failed: number }): void {
    const { success, total, failed } = status
    if (failed > 0 && !loadError) {
      loadError = true
      alert('Network error... Please try again.')
      return
    }
    let percent = Math.round((success / total) * 100);
    if (percent === 100 && !canvasReady) {
      canvasReady = true
      hideLoading()
    }
    percent = percent > 98 ? 98 : percent
    const percentStr = `${percent}%`
    $('.loading .title').text(percentStr);
    $('.loading .percent').css({
      'width': percentStr
    })
  }

  function overShowOver(): void {
    $('#modal').show()
    $('#over-modal').show()
    $('#over-zero').show()
  }

  const option: TowerGameOption = {
    width: gameWidth,
    height: gameHeight,
    canvasId: 'canvas',
    soundOn: true,
    setGameScore: function (s: number) {
      score = s
    },
    setGameSuccess: function (s: number) {
      successCount = s
    },
    setGameFailed: function (f: number) {
      $('#score').text(String(score))
      if (f >= 3) overShowOver()
    }
  }

  function gameReady(): void {
    game = window.TowerGame(option)
    game.load(function () {
      game.init()
      setTimeout(function () {
        game.playBgm()
      }, 1000)
    }, updateLoading)
  }

  const isWechat = navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1
  if (isWechat) {
    document.addEventListener("WeixinJSBridgeReady", gameReady, false)
  } else {
    gameReady()
  }

  function indexHide(): void {
    $('.landing .action-1').addClass('slideTop')
    $('.landing .action-2').addClass('slideBottom')
    setTimeout(function () {
      $('.landing').hide()
    }, 950)
  }

  $('#start').on('click', function () {
    if (gameStart) return
    gameStart = true
    setTimeout(function () {
      game.playBgm()
    }, 200)
    indexHide()
    setTimeout(game.start, 400)
  })

  $('.js-reload').on('click', function () {
    window.location.href = `${window.location.href}?s=${+new Date()}`
  })

  $('.js-invite').on('click', function () {
    $('.wxShare').show()
  })

  $('.wxShare').on('click', function () {
    $('.wxShare').hide()
  })

  window.addEventListener('load', function () {
    domReady = true
    hideLoading()
  }, false);
}
