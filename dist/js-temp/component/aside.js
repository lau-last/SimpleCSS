import EventManager from './event-manager.js';
export default class Aside {
    constructor() {
        Aside.init();
    }
    static init() {
        EventManager.addEventToDocument('click', Aside.onClick);
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        Aside.handleClose(target);
        Aside.handleOpen(target);
    }
    static handleOpen(target) {
        const trigger = target.closest('[data-js="aside"][data-target]');
        if (!trigger)
            return;
        const selector = trigger.getAttribute('data-target');
        if (!selector)
            return;
        const aside = document.querySelector(selector);
        if (!aside)
            return;
        Aside.isOpen(aside) ? Aside.hide(aside) : Aside.show(aside);
    }
    static handleClose(target) {
        const closeBtn = target.closest('.close');
        if (!closeBtn)
            return;
        const aside = closeBtn.closest('aside, .sidebar');
        if (!aside)
            return;
        if (!Aside.isOpen(aside))
            return;
        Aside.hide(aside);
    }
    static isOpen(aside) {
        return aside.classList.contains('show');
    }
    static show(aside) {
        aside.classList.add('show');
        Aside.openTransition(aside);
        const button = Aside.getButtonForAside(aside);
        if (!button)
            return;
        button.setAttribute('aria-expanded', 'true');
    }
    static hide(aside) {
        aside.classList.remove('show');
        Aside.closeTransition(aside);
        const button = Aside.getButtonForAside(aside);
        if (!button)
            return;
        button.setAttribute('aria-expanded', 'false');
    }
    static getButtonForAside(aside) {
        const id = aside.id;
        if (!id)
            return null;
        return document.querySelector(`[data-js="aside"][data-target="#${id}"]`);
    }
    // Only for sidebar-shrink
    static openTransition(aside) {
        if (!aside.classList.contains('shrink-left') && !aside.classList.contains('shrink-right'))
            return;
        const items = aside.querySelectorAll('.side-item');
        const onTransitionStart = (event) => {
            if (event.propertyName !== 'width')
                return;
            items.forEach(item => {
                const element = item;
                element.classList.add('open', 'fade-in');
            });
        };
        const onTransitionEnd = (event) => {
            Aside.onWidthTransitionEndRemoveClass(event, items, 'fade-in');
        };
        aside.addEventListener('transitionstart', onTransitionStart, { once: true });
        aside.addEventListener('transitionend', onTransitionEnd, { once: true });
    }
    // Only for sidebar-shrink
    static closeTransition(aside) {
        if (!aside.classList.contains('shrink-left') && !aside.classList.contains('shrink-right'))
            return;
        const items = aside.querySelectorAll('.side-item');
        const onTransitionStart = (event) => {
            if (event.propertyName !== 'width')
                return;
            const duration = Aside.getAnimationDurationVar('--sidebar-transition-time');
            const half = duration / 2;
            items.forEach(item => {
                const element = item;
                element.classList.add('fade-out-in');
                setTimeout(() => {
                    element.classList.remove('open');
                }, half);
            });
        };
        const onTransitionEnd = (event) => {
            Aside.onWidthTransitionEndRemoveClass(event, items, 'fade-out-in');
        };
        aside.addEventListener('transitionstart', onTransitionStart, { once: true });
        aside.addEventListener('transitionend', onTransitionEnd, { once: true });
    }
    // Only for sidebar-shrink
    static onWidthTransitionEndRemoveClass(event, items, className) {
        if (event.propertyName !== 'width')
            return;
        items.forEach(item => {
            const element = item;
            element.classList.remove(className);
            void element.offsetWidth;
        });
    }
    // Only for sidebar-shrink
    static getAnimationDurationVar(name) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (value.endsWith("ms"))
            return parseFloat(value);
        if (value.endsWith("s"))
            return parseFloat(value) * 1000;
        return 0;
    }
}
