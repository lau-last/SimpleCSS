export default class Tab {
    constructor() {
        Tab.init();
    }
    static init() {
        const tabs = document.querySelectorAll('[data-js="tab"]');
        if (!tabs.length)
            return;
        tabs.forEach((tab) => {
            const buttons = tab.querySelectorAll('[data-target]');
            if (!buttons.length)
                return;
            buttons.forEach((button) => {
                const targetId = button.getAttribute('data-target');
                if (!targetId)
                    return;
                const tabContent = document.querySelector(targetId);
                if (!(tabContent instanceof HTMLElement))
                    return;
                Tab.actionEvent(tab, button, tabContent);
            });
        });
    }
    static actionEvent(tab, button, tabContent) {
        button.addEventListener('click', () => {
            button.dispatchEvent(new CustomEvent('tab:beforeShow', {
                detail: { element: tabContent },
                bubbles: true,
            }));
            Tab.hideAllTabs(tab);
            Tab.removeAllClassActive(tab);
            Tab.showTab(button, tabContent);
            button.dispatchEvent(new CustomEvent('tab:afterShow', {
                detail: { element: tabContent },
                bubbles: true,
            }));
        });
    }
    static hideAllTabs(tab) {
        const buttons = tab.querySelectorAll('[data-target]');
        if (!buttons.length)
            return;
        buttons.forEach((button) => {
            const targetId = button.getAttribute('data-target');
            if (!targetId)
                return;
            const tabContent = document.querySelector(targetId);
            if (!(tabContent instanceof HTMLElement))
                return;
            tabContent.classList.remove('show');
        });
    }
    static removeAllClassActive(tab) {
        const buttons = tab.querySelectorAll('[data-target]');
        if (!buttons.length)
            return;
        buttons.forEach((button) => {
            button.classList.remove('active');
        });
    }
    static showTab(button, tabContent) {
        button.classList.add('active');
        tabContent.classList.add('show');
    }
}
