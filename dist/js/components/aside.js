export default class Aside {
    constructor() {
        Aside.init();
    }
    // Initialize all buttons that control asides
    static init() {
        document.querySelectorAll('[data-js="aside"]').forEach(button => Aside.setupButton(button));
    }
    // Wire a single button with its target aside
    static setupButton(button) {
        const selector = button.getAttribute('data-target');
        if (!selector)
            return;
        const aside = document.querySelector(selector);
        if (!aside)
            return;
        Aside.bindOpen(button, aside);
        Aside.bindClose(aside);
    }
    // Emit a custom event carrying the aside element
    static emitEvent(target, name, aside) {
        target.dispatchEvent(new CustomEvent(name, { detail: { element: aside }, bubbles: true }));
    }
    // Return whether the aside is currently shown
    static isOpen(aside) {
        return aside.classList.contains('show');
    }
    // Bind the open behavior to the controller button
    static bindOpen(button, aside) {
        button.addEventListener('click', () => {
            if (Aside.isOpen(aside))
                return;
            Aside.emitEvent(button, 'aside:beforeOpen', aside);
            Aside.show(aside);
            Aside.emitEvent(button, 'aside:afterOpen', aside);
        });
    }
    // Bind close behavior to all .close elements inside the aside
    static bindClose(aside) {
        const closeButtons = aside.querySelectorAll('.close');
        if (!closeButtons.length)
            return;
        closeButtons.forEach(btn => btn.addEventListener('click', () => {
            if (!Aside.isOpen(aside))
                return;
            Aside.emitEvent(btn, 'aside:beforeClose', aside);
            Aside.hide(aside);
            Aside.emitEvent(btn, 'aside:afterClose', aside);
        }));
    }
    // Show the aside (state change only)
    static show(aside) {
        aside.classList.add('show');
    }
    // Hide the aside (state change only)
    static hide(aside) {
        aside.classList.remove('show');
    }
}
