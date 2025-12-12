import EventManager from './event-manager.js';
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
        const button = target.closest('[data-js="tab"][data-target]');
        if (!button)
            return;
        const container = button.parentElement;
        if (!container)
            return;
        const content = Tab.resolveContent(button);
        if (!content)
            return;
        Tab.hideAll(container);
        Tab.clearActive(container);
        Tab.showOne(button, content);
    }
    static resolveContent(button) {
        const selector = button.getAttribute('data-target');
        if (!selector)
            return null;
        const element = document.querySelector(selector);
        return element instanceof HTMLElement ? element : null;
    }
    static hideAll(container) {
        const buttons = container.querySelectorAll('[data-js="tab"][data-target]');
        buttons.forEach(button => {
            const content = Tab.resolveContent(button);
            if (!content)
                return;
            content.classList.remove('show');
        });
    }
    static clearActive(container) {
        const buttons = container.querySelectorAll('[data-js="tab"][data-target]');
        buttons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
    }
    static showOne(button, content) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        content.classList.add('show');
    }
}
