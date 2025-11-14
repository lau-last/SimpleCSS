import EventManager from './event_manager.js';

export default class Aside {
    constructor() {
        Aside.init();
    }

    private static init(): void {
        EventManager.addEventToDocument('click', Aside.onClick);
    }


    private static onClick(event: Event): void {
        if (!(event instanceof MouseEvent)) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;

        Aside.handleClose(target);
        Aside.handleOpen(target);
    }

    private static handleOpen(target: HTMLElement): void {
        if (!target.matches('[data-js="aside"][data-target]')) return;
        const selector = target.getAttribute('data-target');
        if (!selector) return;
        const aside = document.querySelector(selector) as HTMLElement | null;
        if (!aside) return;
        Aside.isOpen(aside) ? Aside.hide(aside) : Aside.show(aside);

    }

    private static handleClose(target: HTMLElement): void {
        if (!target.matches('.close')) return;
            const aside = target.closest('aside') as HTMLElement | null;
            if (!aside) return;
            if (!Aside.isOpen(aside)) return;
            Aside.hide(aside);
            return;

    }


    private static isOpen(aside: HTMLElement): boolean {
        return aside.classList.contains('show');
    }


    private static show(aside: HTMLElement): void {
        aside.classList.add('show');
    }


    private static hide(aside: HTMLElement): void {
        aside.classList.remove('show');
    }
}