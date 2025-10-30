export default class Dialog {
    constructor() {
        Dialog.init();
    }

    private static init() {
        const buttons = document.querySelectorAll('[data-js="dialog"]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        buttons.forEach((button: HTMLElement) => {
            const target = button.getAttribute('data-target') as string;
            if (!target) return;
            const dialog = document.querySelector(target) as HTMLElement | null;
            if (!(dialog instanceof HTMLDialogElement)) return;

            Dialog.actionEvent(button, dialog);
        });
    }

    private static actionEvent(button: HTMLElement, dialog: HTMLDialogElement): void {
        button.addEventListener('click', () => {

            if (button.classList.contains('close')) {
                const current = button.closest('dialog') as HTMLDialogElement | null;
                if (current) {Dialog.closeDialog(current);}
            }
            
            Dialog.showDialog(dialog);
        });

        const buttonsClose = dialog.querySelectorAll('.close') as NodeListOf<HTMLElement>;
        if (!buttonsClose.length) return;

        buttonsClose.forEach((buttonClose: HTMLElement) => {
            buttonClose.addEventListener('click', () => {
                Dialog.closeDialog(dialog);
            });
        });
    }

    private static showDialog(dialog: HTMLDialogElement): void {
        dialog.dispatchEvent(new CustomEvent('dialog:beforeOpen', {
            detail: {element: dialog},
            bubbles: true,
        }));

        dialog.showModal();
        dialog.classList.add('show');

        dialog.dispatchEvent(new CustomEvent('dialog:afterOpen', {
            detail: {element: dialog},
            bubbles: true,
        }));
    }

    private static closeDialog(dialog: HTMLDialogElement): void {
        dialog.dispatchEvent(new CustomEvent('dialog:beforeClose', {
            detail: {element: dialog},
            bubbles: true,
        }));

        dialog.classList.remove('show');
        dialog.addEventListener('transitionend', () => {
            dialog.close();
        }, {once: true});

        dialog.dispatchEvent(new CustomEvent('dialog:afterClose', {
            detail: {element: dialog},
            bubbles: true,
        }));
    }

}