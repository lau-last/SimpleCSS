export default class Dialog {
    constructor() {
        Dialog.init();
    }

    // Initialize all buttons that control dialogs
    private static init(): void {
        document.querySelectorAll<HTMLElement>('[data-js="dialog"]').forEach(button => Dialog.setupButton(button));
    }

    // Setup the target dialog for each button
    private static setupButton(button: HTMLElement): void {
        const target = button.getAttribute('data-target') as string;
        if (!target) return;
        const dialog = document.querySelector(target) as HTMLElement | null;
        if (!(dialog instanceof HTMLDialogElement)) return;
        Dialog.bindOpen(button, dialog);
        Dialog.bindClose(dialog);
    }


    // Close current first, then open target after transition (simple & sûr)
    private static bindOpen(button: HTMLElement, dialog: HTMLDialogElement): void {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const current = button.classList.contains('close') ? button.closest('dialog') as HTMLDialogElement | null : null;

            if (current && current !== dialog) {
                current.addEventListener('transitionend', () => Dialog.open(dialog), {once: true});
                Dialog.close(current);
                return;
            }

            if (!dialog.open) Dialog.open(dialog);
        });
    }


    // Attach click events to all .close buttons inside the dialog (excluding triggers)
    private static bindClose(dialog: HTMLDialogElement): void {
        // Skip buttons that also have data-js="dialog" (managed by bindOpen)
        const closeButtons = dialog.querySelectorAll<HTMLElement>('.close:not([data-js="dialog"])');
        if (!closeButtons.length) return;

        // Prevent binding the same listeners multiple times
        if ((dialog as any).closeBound) return;
        (dialog as any).closeBound = true;

        // Add click listener to each close button
        closeButtons.forEach((button) => {
            button.addEventListener('click', () => Dialog.close(dialog));
        });
    }

    // Open the dialog and emit lifecycle events
    private static open(dialog: HTMLDialogElement): void {
        Dialog.emitEvent(dialog, 'dialog:beforeOpen', dialog);
        dialog.showModal();
        dialog.classList.add('show');
        Dialog.emitEvent(dialog, 'dialog:afterOpen', dialog);
    }

    // Close the dialog and emit lifecycle events
    private static close(dialog: HTMLDialogElement): void {
        Dialog.emitEvent(dialog, 'dialog:beforeClose', dialog);
        dialog.classList.remove('show');
        dialog.addEventListener('transitionend', () => {
            dialog.close();
        }, {once: true});
        Dialog.emitEvent(dialog, 'dialog:afterClose', dialog);
    }

    // Emit a custom event carrying the dialog element
    private static emitEvent(target: EventTarget, name: string, dialog: HTMLDialogElement): void {
        target.dispatchEvent(new CustomEvent(name, {detail: {element: dialog}, bubbles: true}));
    }
}