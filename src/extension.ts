import * as vscode from "vscode";

let timer: NodeJS.Timeout | undefined;
let startTimer: number | undefined;
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "v-timer" is now active!');

  const startTimerCommand = vscode.commands.registerCommand(
    "v-timer.startTimer",
    () => {
      if (!timer) {
        startTimer = Date.now();

        timer = setInterval(() => {
          const currentTime = Date.now();
          const timeSpent = Math.floor((currentTime - startTimer!) / 1000);
          vscode.window.setStatusBarMessage(
            `V Timer: ${timeSpent} seconds spent coding`
          );
        }, 1000);
        vscode.window.showInformationMessage("V Timer started!");
      }
    }
  );

  const stopTimerCommand = vscode.commands.registerCommand(
    "v-timer.stopTimer",
    () => {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
        vscode.window.setStatusBarMessage("");
        vscode.window.showInformationMessage("V Timer stopped!");
      }
    }
  );

  context.subscriptions.push(startTimerCommand, stopTimerCommand);
}

export function deactivate() {
  if (timer) {
    clearInterval(timer);
  }
}
