import EventManager from './event-manager.js';

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
        const trigger = target.closest<HTMLElement>('[data-js="aside"][data-target]');
        if (!trigger) return;
        const selector = trigger.getAttribute('data-target');
        if (!selector) return;
        const aside = document.querySelector(selector) as HTMLElement | null;
        if (!aside) return;
        Aside.isOpen(aside) ? Aside.hide(aside) : Aside.show(aside);

    }

    private static handleClose(target: HTMLElement): void {
        const closeBtn = target.closest('.close') as HTMLElement | null;
        if (!closeBtn) return;
        const aside = closeBtn.closest('aside, .sidebar') as HTMLElement | null;
        if (!aside) return;
        if (!Aside.isOpen(aside)) return;
        Aside.hide(aside);
    }


    private static isOpen(aside: HTMLElement): boolean {
        return aside.classList.contains('show');
    }


    private static show(aside: HTMLElement): void {
        aside.classList.add('show');
        Aside.openTransition(aside);
        const button = Aside.getButtonForAside(aside);
        if (!button) return;
        button.setAttribute('aria-expanded', 'true');
    }


    private static hide(aside: HTMLElement): void {
        aside.classList.remove('show');
        Aside.closeTransition(aside);
        const button = Aside.getButtonForAside(aside);
        if (!button) return;
        button.setAttribute('aria-expanded', 'false');
    }

    private static getButtonForAside(aside: HTMLElement): HTMLElement | null {
        const id = aside.id;
        if (!id) return null;
        return document.querySelector<HTMLElement>(
            `[data-js="aside"][data-target="#${id}"]`
        );
    }


    // Only for sidebar-shrink
    private static openTransition(aside: HTMLElement): void {
        if (!aside.classList.contains('shrink-left') && !aside.classList.contains('shrink-right')) return;
        const items = aside.querySelectorAll('.side-item');
        const onTransitionStart = (event: TransitionEvent) => {
            if (event.propertyName !== 'width') return;

            items.forEach(item => {
                const element = item as HTMLElement;
                element.classList.add('open', 'fade-in');
            });
        };

        const onTransitionEnd = (event: TransitionEvent) => {
            Aside.onWidthTransitionEndRemoveClass(event, items, 'fade-in');
        };

        aside.addEventListener('transitionstart', onTransitionStart, {once: true});
        aside.addEventListener('transitionend', onTransitionEnd, {once: true});
    }

    // Only for sidebar-shrink
    private static closeTransition(aside: HTMLElement): void {
        if (!aside.classList.contains('shrink-left') && !aside.classList.contains('shrink-right')) return;
        const items = aside.querySelectorAll('.side-item');
        const onTransitionStart = (event: TransitionEvent) => {
            if (event.propertyName !== 'width') return;

            const duration = Aside.getAnimationDurationVar('--sidebar-transition-time');
            const half = duration / 2;

            items.forEach(item => {
                const element = item as HTMLElement;
                element.classList.add('fade-out-in');

                setTimeout(() => {
                    element.classList.remove('open');
                }, half);
            });
        };

        const onTransitionEnd = (event: TransitionEvent) => {
            Aside.onWidthTransitionEndRemoveClass(event, items, 'fade-out-in');
        };

        aside.addEventListener('transitionstart', onTransitionStart, { once: true });
        aside.addEventListener('transitionend', onTransitionEnd, { once: true });
    }


    // Only for sidebar-shrink
    private static onWidthTransitionEndRemoveClass(
        event: TransitionEvent,
        items: NodeListOf<Element>,
        className: string
    ): void {
        if (event.propertyName !== 'width') return;

        items.forEach(item => {
            const element = item as HTMLElement;
            element.classList.remove(className);
            void element.offsetWidth;
        });
    }


    // Only for sidebar-shrink
    private static getAnimationDurationVar(name: string): number {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        if (value.endsWith("ms")) return parseFloat(value);
        if (value.endsWith("s")) return parseFloat(value) * 1000;

        return 0;
    }


}