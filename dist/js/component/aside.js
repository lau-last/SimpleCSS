import EventManager from './event_manager.js';
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
        if (!target.matches('[data-js="aside"][data-target]'))
            return;
        const selector = target.getAttribute('data-target');
        if (!selector)
            return;
        const aside = document.querySelector(selector);
        if (!aside)
            return;
        Aside.isOpen(aside) ? Aside.hide(aside) : Aside.show(aside);
    }
    static handleClose(target) {
        if (!target.matches('.close'))
            return;
        const aside = target.closest('aside, .sidebar-left, .sidebar-right');
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
    }
    static hide(aside) {
        aside.classList.remove('show');
    }
}
