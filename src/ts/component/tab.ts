import EventManager from './event-manager';

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
        if (!target.matches('[data-js="tab"][data-target]')) return;

        const container = target.parentElement;
        if (!container) return;

        const content = Tab.resolveContent(target);
        if (!content) return;

        Tab.hideAll(container);
        Tab.clearActive(container);
        Tab.showOne(target, content);
    }

    private static resolveContent(button: HTMLElement): HTMLElement | null {
        const selector = button.getAttribute('data-target');
        if (!selector) return null;

        const el = document.querySelector(selector);
        return el instanceof HTMLElement ? el : null;
    }

    private static hideAll(container: HTMLElement): void {
        const buttons = container.querySelectorAll<HTMLElement>('[data-js="tab"][data-target]');
        buttons.forEach(button => {
            const content = Tab.resolveContent(button);
            if (content) content.classList.remove('show');
        });
    }

    private static clearActive(container: HTMLElement): void {
        const buttons = container.querySelectorAll<HTMLElement>('[data-js="tab"][data-target]');
        buttons.forEach(button => button.classList.remove('active'));
    }

    private static showOne(button: HTMLElement, content: HTMLElement): void {
        button.classList.add('active');
        content.classList.add('show');
    }
}