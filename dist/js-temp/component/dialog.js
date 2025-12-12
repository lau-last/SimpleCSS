import EventManager from './event-manager.js';
export default class Dialog {
    constructor() {
        Dialog.init();
    }
    static init() {
        EventManager.addEventToDocument('click', Dialog.onClick);
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        if (Dialog.handleSwitch(target))
            return;
        if (Dialog.handleClose(target))
            return;
        Dialog.handleOpen(target);
    }
    static handleSwitch(target) {
        const trigger = target.closest('.close[data-js="dialog"][data-target]');
        if (!trigger)
            return false;
        const selector = trigger.getAttribute('data-target');
        if (!selector)
            return true;
        const nextDialog = document.querySelector(selector);
        if (!(nextDialog instanceof HTMLDialogElement))
            return true;
        const currentDialog = target.closest('dialog');
        if (currentDialog && currentDialog !== nextDialog) {
            currentDialog.addEventListener('transitionend', () => Dialog.open(nextDialog), { once: true });
            Dialog.close(currentDialog);
            return true;
        }
        if (!nextDialog.open) {
            Dialog.open(nextDialog);
        }
        return true;
    }
    static handleClose(target) {
        const closeBtn = target.closest('.close');
        if (!closeBtn || closeBtn.matches('[data-js="dialog"]')) {
            return false;
        }
        const dialog = closeBtn.closest('dialog');
        if (!dialog)
            return true;
        Dialog.close(dialog);
        return true;
    }
    static handleOpen(target) {
        const trigger = target.closest('[data-js="dialog"][data-target]');
        if (!trigger || trigger.closest('.close')) {
            return false;
        }
        const selector = trigger.getAttribute('data-target');
        if (!selector)
            return true;
        const dialog = document.querySelector(selector);
        if (!(dialog instanceof HTMLDialogElement))
            return true;
        if (!dialog.open) {
            Dialog.open(dialog);
        }
        return true;
    }
    static open(dialog) {
        Dialog.emitEvent(dialog, 'dialog:beforeOpen', dialog);
        dialog.showModal();
        dialog.classList.add('show');
        Dialog.emitEvent(dialog, 'dialog:afterOpen', dialog);
    }
    static close(dialog) {
        Dialog.emitEvent(dialog, 'dialog:beforeClose', dialog);
        dialog.classList.remove('show');
        dialog.addEventListener('transitionend', () => {
            dialog.close();
        }, { once: true });
        Dialog.emitEvent(dialog, 'dialog:afterClose', dialog);
    }
    static emitEvent(target, name, dialog) {
        target.dispatchEvent(new CustomEvent(name, {
            detail: { element: dialog },
            bubbles: true,
        }));
    }
}
