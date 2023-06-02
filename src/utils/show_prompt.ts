
import { window, ProgressLocation } from "vscode";

export const showErrorMessageWithTimeout = (title: string, second = 3): void => {
    void window.withProgress(
        {
            location: ProgressLocation.Notification,
            title: `Error: ${title}`,
            cancellable: false,
        },
        async (progress) => {

            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    progress.report({ increment: i * 10 })
                }, 10000)
            }

            return new Promise<void>(resolve => {
                setTimeout(() => {
                    resolve();
                }, (second - 1) * 1000);
            });
        })
};