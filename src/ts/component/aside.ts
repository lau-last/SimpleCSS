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
        if (!target.matches('.close')) return;
        const aside = target.closest('aside, .sidebar') as HTMLElement | null;
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

        const onTransitionStart = (event: TransitionEvent) => {
            if (event.propertyName !== 'width') return;

            const duration = Aside.getAnimationDurationVar("--fade-switch-duration");
            const half = duration / 2;

            const items = aside.querySelectorAll('.side-item');

            items.forEach(item => {
                const element = item as HTMLElement;
                const sideIcon = element.querySelector('.side-icon') as HTMLElement | null;
                const sideText = element.querySelector('.side-text') as HTMLElement | null;

                Aside.restartAnimation(sideIcon, 'fade-icon');

                if (sideText) {
                    sideText.classList.remove('fade-text-in', 'fade-text-out');
                    Aside.restartAnimation(sideText, 'fade-text-in');
                }

                setTimeout(() => {
                    element.classList.add('is-full');
                }, half);
            });
        };

        aside.addEventListener('transitionstart', onTransitionStart, {once: true});
    }

    // Only for sidebar-shrink
    private static closeTransition(aside: HTMLElement): void {
        if (!aside.classList.contains('shrink-left') && !aside.classList.contains('shrink-right')) return;

        const onTransitionStart = (event: TransitionEvent) => {
            if (event.propertyName !== 'width') return;

            const duration = Aside.getAnimationDurationVar("--fade-switch-duration");
            const half = duration / 2;

            const items = aside.querySelectorAll('.side-item');

            items.forEach(item => {
                const element = item as HTMLElement;
                const sideIcon = element.querySelector('.side-icon') as HTMLElement | null;
                const sideText = element.querySelector('.side-text') as HTMLElement | null;

                Aside.restartAnimation(sideIcon, 'fade-icon');

                if (sideText) {
                    sideText.classList.remove('fade-text-in', 'fade-text-out');
                    Aside.restartAnimation(sideText, 'fade-text-out');
                }

                setTimeout(() => {
                    element.classList.remove('is-full');
                }, half);
            });
        };

        aside.addEventListener('transitionstart', onTransitionStart, {once: true});
    }

    // Only for sidebar-shrink
    private static restartAnimation(element: HTMLElement | null, className: string): void {
        if (!element) return;
        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);
    }

    // Only for sidebar-shrink
    private static getAnimationDurationVar(name: string): number {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        if (value.endsWith("ms")) return parseFloat(value);
        if (value.endsWith("s")) return parseFloat(value) * 1000;

        return 0;
    }

}