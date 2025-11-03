export default class Dialog {
    constructor() {
        Dialog.init();
    }
    // Initialize all buttons that control dialogs
    static init() {
        document.querySelectorAll('[data-js="dialog"]').forEach(button => Dialog.setupButton(button));
    }
    // Setup the target dialog for each button
    static setupButton(button) {
        const target = button.getAttribute('data-target');
        if (!target)
            return;
        const dialog = document.querySelector(target);
        if (!(dialog instanceof HTMLDialogElement))
            return;
        Dialog.bindOpen(button, dialog);
        Dialog.bindClose(dialog);
    }
    // Close current first, then open target after transition (simple & sûr)
    static bindOpen(button, dialog) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const current = button.classList.contains('close') ? button.closest('dialog') : null;
            if (current && current !== dialog) {
                current.addEventListener('transitionend', () => Dialog.open(dialog), { once: true });
                Dialog.close(current);
                return;
            }
            if (!dialog.open)
                Dialog.open(dialog);
        });
    }
    // Attach click events to all .close buttons inside the dialog (excluding triggers)
    static bindClose(dialog) {
        // Skip buttons that also have data-js="dialog" (managed by bindOpen)
        const closeButtons = dialog.querySelectorAll('.close:not([data-js="dialog"])');
        if (!closeButtons.length)
            return;
        // Prevent binding the same listeners multiple times
        if (dialog.closeBound)
            return;
        dialog.closeBound = true;
        // Add click listener to each close button
        closeButtons.forEach((button) => {
            button.addEventListener('click', () => Dialog.close(dialog));
        });
    }
    // Open the dialog and emit lifecycle events
    static open(dialog) {
        Dialog.emitEvent(dialog, 'dialog:beforeOpen', dialog);
        dialog.showModal();
        dialog.classList.add('show');
        Dialog.emitEvent(dialog, 'dialog:afterOpen', dialog);
    }
    // Close the dialog and emit lifecycle events
    static close(dialog) {
        Dialog.emitEvent(dialog, 'dialog:beforeClose', dialog);
        dialog.classList.remove('show');
        dialog.addEventListener('transitionend', () => {
            dialog.close();
        }, { once: true });
        Dialog.emitEvent(dialog, 'dialog:afterClose', dialog);
    }
    // Emit a custom event carrying the dialog element
    static emitEvent(target, name, dialog) {
        target.dispatchEvent(new CustomEvent(name, { detail: { element: dialog }, bubbles: true }));
    }
}
