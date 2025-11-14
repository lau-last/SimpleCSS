import EventManager from './event_manager.js';
export default class Tab {
    constructor() {
        Tab.init();
    }
    static init() {
        EventManager.addEventToDocument('click', Tab.onClick);
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        Tab.handleTabClick(target);
    }
    static handleTabClick(target) {
        if (!target.matches('[data-js="tab"][data-target]'))
            return;
        const container = target.parentElement;
        if (!container)
            return;
        const content = Tab.resolveContent(target);
        if (!content)
            return;
        Tab.hideAll(container);
        Tab.clearActive(container);
        Tab.showOne(target, content);
    }
    static resolveContent(button) {
        const selector = button.getAttribute('data-target');
        if (!selector)
            return null;
        const el = document.querySelector(selector);
        return el instanceof HTMLElement ? el : null;
    }
    static hideAll(container) {
        const buttons = container.querySelectorAll('[data-js="tab"][data-target]');
        buttons.forEach(button => {
            const content = Tab.resolveContent(button);
            if (content)
                content.classList.remove('show');
        });
    }
    static clearActive(container) {
        const buttons = container.querySelectorAll('[data-js="tab"][data-target]');
        buttons.forEach(button => button.classList.remove('active'));
    }
    static showOne(button, content) {
        button.classList.add('active');
        content.classList.add('show');
    }
}
