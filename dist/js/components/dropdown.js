export default class Dropdown {
    constructor() {
        Dropdown.init();
    }
    // Initialize all dropdown trigger buttons
    static init() {
        const buttons = document.querySelectorAll('[data-js="dropdown"]');
        if (!buttons.length)
            return;
        buttons.forEach((button) => {
            const target = button.getAttribute('data-target');
            if (!target)
                return;
            const dropdown = document.querySelector(target);
            if (!dropdown)
                return;
            Dropdown.bindToggle(button, dropdown);
        });
    }
    // Bind click to toggle the target dropdown
    static bindToggle(button, dropdown) {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            Dropdown.closeAllDropdownsOverlay(dropdown);
            const isOpen = dropdown.classList.contains('show');
            if (isOpen) {
                Dropdown.close(dropdown);
                dropdown.classList.remove('show');
            }
            else {
                Dropdown.open(dropdown);
                dropdown.classList.add('show');
            }
        });
    }
    // Open dropdown with animated expand
    static open(dropdown) {
        Dropdown.emit(dropdown, 'dropdown:beforeOpen');
        const height = dropdown.scrollHeight;
        Dropdown.prepareOpenStyles(dropdown);
        Dropdown.playOpenAnimation(dropdown, height);
        Dropdown.emit(dropdown, 'dropdown:afterOpen');
    }
    // Close dropdown with animated collapse
    static close(dropdown) {
        Dropdown.emit(dropdown, 'dropdown:beforeClose');
        const height = dropdown.scrollHeight;
        Dropdown.prepareCloseStyles(dropdown, height);
        Dropdown.playCloseAnimation(dropdown, height);
        Dropdown.emit(dropdown, 'dropdown:afterClose');
    }
    // Emit a custom dropdown event with the element in detail
    static emit(target, name) {
        target.dispatchEvent(new CustomEvent(name, { detail: { element: target }, bubbles: true }));
    }
    // Set initial styles before opening animation
    static prepareOpenStyles(dropdown) {
        dropdown.style.overflow = 'hidden';
        dropdown.style.height = '0px';
    }
    // Set initial styles before closing animation
    static prepareCloseStyles(dropdown, height) {
        dropdown.style.overflow = 'hidden';
        dropdown.style.height = `${height}px`;
    }
    // Play the opening height animation and finalize styles on finish
    static playOpenAnimation(dropdown, height) {
        const animation = dropdown.animate([{ height: '0px' }, { height: `${height}px` }], { duration: 300, easing: 'ease' });
        animation.onfinish = () => {
            dropdown.style.height = 'auto';
            dropdown.style.overflow = 'visible';
        };
    }
    // Play the closing height animation and finalize styles on finish
    static playCloseAnimation(dropdown, height) {
        const animation = dropdown.animate([{ height: `${height}px` }, { height: '0px' }], { duration: 300, easing: 'ease' });
        animation.onfinish = () => {
            dropdown.style.height = '0px';
        };
    }
    // Close all overlays except the one provided
    static closeAllDropdownsOverlay(except) {
        const dropdownsOverlay = document.querySelectorAll([
            '.dropdown-overlay.show',
            '.dropdown-overlay-right.show',
            '.dropdown-overlay-left.show'
        ].join(','));
        if (!dropdownsOverlay.length)
            return;
        dropdownsOverlay.forEach((dropdown) => {
            if (dropdown === except)
                return;
            Dropdown.close(dropdown);
            dropdown.classList.remove('show');
        });
    }
}
