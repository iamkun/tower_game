const startGame = () => {
  if (gameStart) return;
  if (!walletConnected) {
    nftModalButton.onclick = (e) => {
      e.preventDefault();
    };

    const walletConenctModalContainer =
      document.getElementById("walletConenctModal");
    const walletConenctModal = document.getElementById("walletModal");

    if (walletConenctModalContainer) {
      walletConenctModalContainer.style.display = "flex";
      // note: want to close modal when clicked
      walletConenctModalContainer.onclick = () => {
        walletConenctModalContainer.style.display = "none";
      };
      walletConnectModal.onclick = (e) => {
        e.preventDefault();
      };
    }

    return;
  }
  console.log("is nft present: ", isNFTPresent);
  if (!isNFTPresent) {
    const nftModal = document.getElementById("nftNotFoundContainer");

    if (nftModal) {
      nftModal.style.display = "flex";
      nftModal.onclick = () => {
        nftModal.style.display = "none";
      };

      notFoundModal.onclick = (e) => {
        e.preventDefault();
      };
    }

    return;
  }

  gameStart = true;
  setTimeout(function () {
    game.playBgm();
  });
  indexHide();
  setTimeout(game.start, 400);
};

document.addEventListener("DOMContentLoaded", async function () {
  const nftModalButton = document.getElementById("nftModalButton");
  if (nftModalButton) {
    document
      .getElementById("nftModalButton")
      .addEventListener("click", onButtonClick);
  }
  const textContainer = document.getElementsByClassName("side-panel-header");
  const playButtonElement = document.getElementById("start-game");

  if (!walletConnected && textContainer && playButtonElement) {
    textContainer[0].innerHTML = `
  Get as <br />
  Higher↑ <br />
  as you can!
  `;

    playButtonElement.textContent = "Connect Wallet to play";
  }
  if (playButtonElement) {
    document.getElementById("start-game").addEventListener("click", startGame);
  }
  if (selectedAccount) {
    const walletBtn = document.getElementById("walletButton");
    walletBtn.innerText =
      selectedAccount.slice(0, 5) + "..." + selectedAccount.slice(-4);

    const textContainer = document.getElementsByClassName("side-panel-header");

    if (textContainer && playButtonElement) {
      textContainer[0].innerHTML = `
            Your score is
            <span id="top-score" class="font-Kangmas font-bold">${0}</span>! Can be
            Higher↑`;

      playButtonElement.textContent = "Play game";
      walletConnected = true;
    }

    // fetching fc details of user
    // const fetchUser = await fetchFCUser(s);

    // console.log(fetchFCUser);
  }
});
