import EventManager from './event-manager.js';

export default class Tab {
    constructor() {
        Tab.init();
    }

    private static init(): void {
        EventManager.addEventToDocument('click', Tab.onClick);
    }

    private static onClick(event: Event): void {
        if (!(event instanceof MouseEvent)) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;

        Tab.handleTabClick(target);
    }

    private static handleTabClick(target: HTMLElement): void {
        const button = target.closest<HTMLElement>('[data-js="tab"][data-target]');
        if (!button) return;

        const container = button.parentElement;
        if (!container) return;

        const content = Tab.resolveContent(button);
        if (!content) return;

        Tab.hideAll(container);
        Tab.clearActive(container);
        Tab.showOne(button, content);
    }

    private static resolveContent(button: HTMLElement): HTMLElement | null {
        const selector = button.getAttribute('data-target');
        if (!selector) return null;

        const element = document.querySelector(selector);
        return element instanceof HTMLElement ? element : null;
    }

    private static hideAll(container: HTMLElement): void {
        const buttons = container.querySelectorAll<HTMLElement>('[data-js="tab"][data-target]');
        buttons.forEach(button => {
            const content = Tab.resolveContent(button);
            if (!content) return;
            content.classList.remove('show');
        });
    }

    private static clearActive(container: HTMLElement): void {
        const buttons = container.querySelectorAll<HTMLElement>('[data-js="tab"][data-target]');
        buttons.forEach(button => {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            }
        );
    }

    private static showOne(button: HTMLElement, content: HTMLElement): void {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        content.classList.add('show');
    }
}