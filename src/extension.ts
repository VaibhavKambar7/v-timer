import * as vscode from "vscode";

let timer: NodeJS.Timeout | undefined;
let startTimer: number | undefined;
let pausedTime: number | undefined;
let isRunning = false;
let timerStartItem: vscode.StatusBarItem;
let timerPauseItem: vscode.StatusBarItem;
let timerResetItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "v-timer" is now active!');

  timerStartItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  timerStartItem.text = "$(triangle-right)";
  timerStartItem.command = "v-timer.toggleTimer";
  timerStartItem.show();

  timerResetItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  timerResetItem.text = "$(sync)";
  timerResetItem.command = "v-timer.resetTimer";
  timerResetItem.show();

  const toggleTimerCommand = vscode.commands.registerCommand(
    "v-timer.toggleTimer",
    () => {
      if (!isRunning) {
        startOrResumeTimer();
      } else {
        pauseTimer();
      }
    }
  );

  const resetTimerCommand = vscode.commands.registerCommand(
    "v-timer.resetTimer",
    () => {
      resetTimer();
    }
  );

  context.subscriptions.push(
    toggleTimerCommand,
    resetTimerCommand,
    timerStartItem,
    timerResetItem
  );
}

function startOrResumeTimer() {
  if (!startTimer) {
    startTimer = Date.now();
  }

  if (pausedTime) {
    startTimer += Date.now() - pausedTime;
    pausedTime = undefined;
  }

  timer = setInterval(() => {
    const currentTime = Date.now();
    const timeSpent = currentTime - startTimer!;
    vscode.window.setStatusBarMessage(`V Timer: ${formatTime(timeSpent)}`);
  }, 1000);

  isRunning = true;
  timerStartItem.text = "$(debug-pause)";
  vscode.window.showInformationMessage("V Timer started/resumed!");
}

function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    pausedTime = Date.now();
  }
  isRunning = false;
  timerStartItem.text = "$(triangle-right)";
  vscode.window.showInformationMessage("V Timer paused!");
}

function resetTimer() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  startTimer = undefined;
  pausedTime = undefined;
  isRunning = false;
  vscode.window.setStatusBarMessage("V Timer: 00:00:00");
  timerStartItem.text = "$(triangle-right)";
  vscode.window.showInformationMessage("V Timer reset!");
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function deactivate() {
  if (timer) {
    clearInterval(timer);
  }
}
