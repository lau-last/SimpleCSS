export default class Tab {
    constructor() {
        Tab.init();
    }

    // Initialize all tab containers and wire their buttons
    private static init(): void {
        document.querySelectorAll<HTMLElement>('[data-js="tab"]').forEach(tab => Tab.bindTab(tab));
    }

    // Bind all buttons within a tab container
    private static bindTab(tab: HTMLElement): void {
        const buttons = tab.querySelectorAll<HTMLElement>('[data-target]');
        if (!buttons.length) return;
        buttons.forEach(button => Tab.bindButton(tab, button));
    }

    // Bind a single tab button to its content
    private static bindButton(tab: HTMLElement, button: HTMLElement): void {
        const content = Tab.resolveContent(button);
        if (!content) return;
        Tab.bindShow(tab, button, content);
    }

    // Resolve target content element for a button
    private static resolveContent(button: HTMLElement): HTMLElement | null {
        const targetId = button.getAttribute('data-target');
        if (!targetId) return null;
        const element = document.querySelector(targetId);
        return element instanceof HTMLElement ? element : null;
    }

    // Bind click to show the target tab content
    private static bindShow(tab: HTMLElement, button: HTMLElement, content: HTMLElement): void {
        button.addEventListener('click', () => {
            Tab.emitEvent(button, 'tab:beforeShow', content);
            Tab.hideAll(tab);
            Tab.clearActive(tab);
            Tab.showOne(button, content);
            Tab.emitEvent(button, 'tab:afterShow', content);
        });
    }

    // Hide all tab panels within the current tab container
    private static hideAll(tab: HTMLElement): void {
        tab.querySelectorAll<HTMLElement>('[data-target]').forEach(button => Tab.hideContentByButton(button));
    }

    // Hide content associated with a given button
    private static hideContentByButton(button: HTMLElement): void {
        const content = Tab.resolveContent(button);
        if (!content) return;
        content.classList.remove('show');
    }

    // Remove the 'active' class from all buttons within the container
    private static clearActive(tab: HTMLElement): void {
        tab.querySelectorAll<HTMLElement>('[data-target]').forEach(button => Tab.deactivateButton(button));
    }

    // Deactivate a single button
    private static deactivateButton(button: HTMLElement): void {
        button.classList.remove('active');
    }

    // Activate the clicked button and display its target panel
    private static showOne(button: HTMLElement, content: HTMLElement): void {
        Tab.activateButton(button);
        content.classList.add('show');
    }

    // Activate a single button
    private static activateButton(button: HTMLElement): void {
        button.classList.add('active');
    }

    // Emit a custom tab event with the content element in detail
    private static emitEvent(target: EventTarget, name: string, content: HTMLElement): void {
        target.dispatchEvent(new CustomEvent(name, {detail: {element: content}, bubbles: true}));
    }
}