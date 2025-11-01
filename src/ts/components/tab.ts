export default  class Tab {
    constructor() {
        Tab.init();
    }

    private static init(): void {
        const tabs = document.querySelectorAll('[data-js="tab"]') as NodeListOf<HTMLElement>;
        if (!tabs.length) return;


        tabs.forEach((tab: HTMLElement) => {
            const buttons = tab.querySelectorAll('[data-target]') as NodeListOf<HTMLElement>;
            if (!buttons.length) return;

            buttons.forEach((button: HTMLElement) => {
                const targetId = button.getAttribute('data-target') as string;
                if (!targetId) return;
                const tabContent = document.querySelector(targetId) as HTMLElement | null;
                if (!(tabContent instanceof HTMLElement)) return;
                Tab.actionEvent(tab, button, tabContent);
            });
        });
    }

    private static actionEvent(tab: HTMLElement, button: HTMLElement, tabContent: HTMLElement): void {
        button.addEventListener('click', () => {
            button.dispatchEvent(new CustomEvent('tab:beforeShow', {
                detail: {element: tabContent},
                bubbles: true,
            }));

            Tab.hideAllTabs(tab);
            Tab.removeAllClassActive(tab);
            Tab.showTab(button, tabContent);

            button.dispatchEvent(new CustomEvent('tab:afterShow', {
                detail: {element: tabContent},
                bubbles: true,
            }));
        });
    }

    private static hideAllTabs(tab: HTMLElement): void {
        const buttons = tab.querySelectorAll('[data-target]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        buttons.forEach((button: HTMLElement) => {
            const targetId = button.getAttribute('data-target') as string;
            if (!targetId) return;
            const tabContent = document.querySelector(targetId) as HTMLElement | null;
            if (!(tabContent instanceof HTMLElement)) return;
            tabContent.classList.remove('show');
        });
    }

    private static removeAllClassActive(tab: HTMLElement): void {
        const buttons = tab.querySelectorAll('[data-target]') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;
        buttons.forEach((button: HTMLElement) => {
            button.classList.remove('active');
        });
    }

    private static showTab(button: HTMLElement, tabContent: HTMLElement): void {
        button.classList.add('active');
        tabContent.classList.add('show');
    }
}