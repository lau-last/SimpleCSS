export default class Aside {
    constructor() {
        Aside.init();
    }

    // Initialize all buttons that control asides
    private static init(): void {
        document.querySelectorAll<HTMLElement>('[data-js="aside"]').forEach(button => Aside.setupButton(button));
    }

    // Wire a single button with its target aside
    private static setupButton(button: HTMLElement): void {
        const selector = button.getAttribute('data-target');
        if (!selector) return;
        const aside = document.querySelector(selector) as HTMLElement | null;
        if (!aside) return;
        Aside.bindOpen(button, aside);
        Aside.bindClose(aside);
    }

    // Emit a custom event carrying the aside element
    private static emitEvent(target: EventTarget, name: string, aside: HTMLElement): void {
        target.dispatchEvent(new CustomEvent(name, {detail: {element: aside}, bubbles: true}));
    }

    // Return whether the aside is currently shown
    private static isOpen(aside: HTMLElement): boolean {
        return aside.classList.contains('show');
    }

    // Bind the open behavior to the controller button
    private static bindOpen(button: HTMLElement, aside: HTMLElement): void {
        button.addEventListener('click', () => {
            if (Aside.isOpen(aside)) return;
            Aside.emitEvent(button, 'aside:beforeOpen', aside);
            Aside.show(aside);
            Aside.emitEvent(button, 'aside:afterOpen', aside);
        });
    }

    // Bind close behavior to all .close elements inside the aside
    private static bindClose(aside: HTMLElement): void {
        const closeButtons = aside.querySelectorAll<HTMLElement>('.close');
        if (!closeButtons.length) return;
        closeButtons.forEach(btn => btn.addEventListener('click', () => {
            if (!Aside.isOpen(aside)) return;
            Aside.emitEvent(btn, 'aside:beforeClose', aside);
            Aside.hide(aside);
            Aside.emitEvent(btn, 'aside:afterClose', aside);
        }));
    }

    // Show the aside (state change only)
    private static show(aside: HTMLElement): void {
        aside.classList.add('show');
    }

    // Hide the aside (state change only)
    private static hide(aside: HTMLElement): void {
        aside.classList.remove('show');
    }
}