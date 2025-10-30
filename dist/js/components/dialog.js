export default class Dialog {
    constructor() {
        Dialog.init();
    }
    static init() {
        const buttons = document.querySelectorAll('[data-js="dialog"]');
        if (!buttons.length)
            return;
        buttons.forEach((button) => {
            const target = button.getAttribute('data-target');
            if (!target)
                return;
            const dialog = document.querySelector(target);
            if (!(dialog instanceof HTMLDialogElement))
                return;
            Dialog.actionEvent(button, dialog);
        });
    }
    static actionEvent(button, dialog) {
        button.addEventListener('click', () => {
            Dialog.showDialog(dialog);
        });
        const buttonsClose = dialog.querySelectorAll('.close');
        if (!buttonsClose.length)
            return;
        buttonsClose.forEach((buttonClose) => {
            buttonClose.addEventListener('click', () => {
                Dialog.closeDialog(dialog);
            });
        });
    }
    static showDialog(dialog) {
        dialog.dispatchEvent(new CustomEvent('dialog:beforeOpen', {
            detail: { element: dialog },
            bubbles: true,
        }));
        dialog.showModal();
        dialog.classList.add('show');
        dialog.dispatchEvent(new CustomEvent('dialog:afterOpen', {
            detail: { element: dialog },
            bubbles: true,
        }));
    }
    static closeDialog(dialog) {
        dialog.dispatchEvent(new CustomEvent('dialog:beforeClose', {
            detail: { element: dialog },
            bubbles: true,
        }));
        dialog.classList.remove('show');
        dialog.addEventListener('transitionend', () => {
            dialog.close();
        }, { once: true });
        dialog.dispatchEvent(new CustomEvent('dialog:afterClose', {
            detail: { element: dialog },
            bubbles: true,
        }));
    }
}
