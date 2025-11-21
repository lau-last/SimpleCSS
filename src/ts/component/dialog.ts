import EventManager from './event-manager.js';

export default class Dialog {
    constructor() {
        Dialog.init();
    }

    private static init(): void {
        EventManager.addEventToDocument('click', Dialog.onClick);
    }

    private static onClick(event: Event): void {
        if (!(event instanceof MouseEvent)) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;

        if (Dialog.handleSwitch(target)) return;
        if (Dialog.handleClose(target)) return;
        Dialog.handleOpen(target);
    }

    private static handleSwitch(target: HTMLElement): boolean {

        if (!target.matches('.close[data-js="dialog"][data-target]')) {
            return false;
        }

        const selector = target.getAttribute('data-target');
        if (!selector) return true;

        const nextDialog = document.querySelector(selector) as HTMLDialogElement | null;
        if (!(nextDialog instanceof HTMLDialogElement)) return true;

        const currentDialog = target.closest('dialog') as HTMLDialogElement | null;

        if (currentDialog && currentDialog !== nextDialog) {
            currentDialog.addEventListener(
                'transitionend',
                () => Dialog.open(nextDialog),
                {once: true}
            );
            Dialog.close(currentDialog);
            return true;
        }

        if (!nextDialog.open) {
            Dialog.open(nextDialog);
        }
        return true;
    }

    private static handleClose(target: HTMLElement): boolean {
        if (!target.matches('.close') || target.matches('[data-js="dialog"]')) {
            return false;
        }

        const dialog = target.closest('dialog') as HTMLDialogElement | null;
        if (!dialog) return true;

        Dialog.close(dialog);
        return true;
    }


    private static handleOpen(target: HTMLElement): boolean {

        if (!target.matches('[data-js="dialog"][data-target]') || target.matches('.close')) {
            return false;
        }

        const selector = target.getAttribute('data-target');
        if (!selector) return true;

        const dialog = document.querySelector(selector) as HTMLDialogElement | null;
        if (!(dialog instanceof HTMLDialogElement)) return true;

        if (!dialog.open) {
            Dialog.open(dialog);
        }
        return true;
    }


    private static open(dialog: HTMLDialogElement): void {
        Dialog.emitEvent(dialog, 'dialog:beforeOpen', dialog);
        dialog.showModal();
        dialog.classList.add('show');
        Dialog.emitEvent(dialog, 'dialog:afterOpen', dialog);
    }


    private static close(dialog: HTMLDialogElement): void {
        Dialog.emitEvent(dialog, 'dialog:beforeClose', dialog);
        dialog.classList.remove('show');

        dialog.addEventListener(
            'transitionend',
            () => {
                dialog.close();
            },
            {once: true}
        );

        Dialog.emitEvent(dialog, 'dialog:afterClose', dialog);
    }


    private static emitEvent(target: EventTarget, name: string, dialog: HTMLDialogElement): void {
        target.dispatchEvent(
            new CustomEvent(name, {
                detail: {element: dialog},
                bubbles: true,
            })
        );
    }
}