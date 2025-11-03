export default class Tab {
    constructor() {
        Tab.init();
    }
    // Initialize all tab containers and wire their buttons
    static init() {
        document.querySelectorAll('[data-js="tab"]').forEach(tab => Tab.bindTab(tab));
    }
    // Bind all buttons within a tab container
    static bindTab(tab) {
        const buttons = tab.querySelectorAll('[data-target]');
        if (!buttons.length)
            return;
        buttons.forEach(button => Tab.bindButton(tab, button));
    }
    // Bind a single tab button to its content
    static bindButton(tab, button) {
        const content = Tab.resolveContent(button);
        if (!content)
            return;
        Tab.bindShow(tab, button, content);
    }
    // Resolve target content element for a button
    static resolveContent(button) {
        const targetId = button.getAttribute('data-target');
        if (!targetId)
            return null;
        const element = document.querySelector(targetId);
        return element instanceof HTMLElement ? element : null;
    }
    // Bind click to show the target tab content
    static bindShow(tab, button, content) {
        button.addEventListener('click', () => {
            Tab.emitEvent(button, 'tab:beforeShow', content);
            Tab.hideAll(tab);
            Tab.clearActive(tab);
            Tab.showOne(button, content);
            Tab.emitEvent(button, 'tab:afterShow', content);
        });
    }
    // Hide all tab panels within the current tab container
    static hideAll(tab) {
        tab.querySelectorAll('[data-target]').forEach(button => Tab.hideContentByButton(button));
    }
    // Hide content associated with a given button
    static hideContentByButton(button) {
        const content = Tab.resolveContent(button);
        if (!content)
            return;
        content.classList.remove('show');
    }
    // Remove the 'active' class from all buttons within the container
    static clearActive(tab) {
        tab.querySelectorAll('[data-target]').forEach(button => Tab.deactivateButton(button));
    }
    // Deactivate a single button
    static deactivateButton(button) {
        button.classList.remove('active');
    }
    // Activate the clicked button and display its target panel
    static showOne(button, content) {
        Tab.activateButton(button);
        content.classList.add('show');
    }
    // Activate a single button
    static activateButton(button) {
        button.classList.add('active');
    }
    // Emit a custom tab event with the content element in detail
    static emitEvent(target, name, content) {
        target.dispatchEvent(new CustomEvent(name, { detail: { element: content }, bubbles: true }));
    }
}
