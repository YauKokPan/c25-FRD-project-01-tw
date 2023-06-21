interface CustomBeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export let deferredPrompt: CustomBeforeInstallPromptEvent | null;

function isIOS() {
  return (
    ["iPhone", "iPad", "iPod"].indexOf(navigator.platform) !== -1 ||
    navigator.maxTouchPoints > 1
  );
}

function showIOSInstallInstructions() {
  if (isIOS() && !("standalone" in navigator && navigator["standalone"])) {
    const installInstructions = document.createElement("div");
    installInstructions.id = "ios-install-instructions";
    installInstructions.innerHTML = `
        <div style="position: relative;">
        <button id="close-instructions" style="position: absolute; top: -30px; right: -30px;">&times;</button>
          <p>如想安裝Sweet Hour APP</p>
          <ol>
            <li>使用Safari瀏覽器開啟Sweet Hour，按分享按鈕<img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Ei-share-apple.svg" width="20" height="20" style="vertical-align:middle; z-index:1002;"> </li>
            <li>向下滑動，並按下「加至主畫面」</li>
            <li>按下右上角「新增」作確認</li>
          </ol>
        </div>
      `;
    document.body.appendChild(installInstructions);

    const closeButton = document.getElementById("close-instructions");
    closeButton?.addEventListener("click", () => {
      installInstructions.style.display = "none";
    });
  }
}

window.addEventListener("beforeinstallprompt", (e: Event) => {
  e.preventDefault();
  deferredPrompt = e as CustomBeforeInstallPromptEvent;
});

// Call the showIOSInstallInstructions() function outside of the event listener
if (isIOS()) {
  showIOSInstallInstructions();
}
