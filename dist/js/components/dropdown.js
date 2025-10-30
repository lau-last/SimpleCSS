export default class Dropdown {
    constructor() {
        Dropdown.init();
    }
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
            Dropdown.actionEvent(button, dropdown);
        });
    }
    static actionEvent(button, dropdown) {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            Dropdown.closeAllDropdownsOverlay(dropdown);
            const isOpen = dropdown.classList.contains('show');
            if (isOpen) {
                Dropdown.slideUp(dropdown);
                dropdown.classList.remove('show');
            }
            else {
                Dropdown.slideDown(dropdown);
                dropdown.classList.add('show');
            }
        });
    }
    static slideDown(dropdown) {
        dropdown.dispatchEvent(new CustomEvent('dropdown:beforeOpen', {
            detail: { element: dropdown },
            bubbles: true,
        }));
        const height = dropdown.scrollHeight;
        dropdown.style.overflow = "hidden";
        dropdown.style.height = "0px";
        const animation = dropdown.animate([{ height: "0px" }, { height: `${height}px` }], { duration: 300, easing: "ease" });
        animation.onfinish = () => {
            dropdown.style.height = "auto";
            dropdown.style.overflow = "visible";
        };
        dropdown.dispatchEvent(new CustomEvent('dropdown:afterOpen', {
            detail: { element: dropdown },
            bubbles: true,
        }));
    }
    static slideUp(dropdown) {
        dropdown.dispatchEvent(new CustomEvent('dropdown:beforeClose', {
            detail: { element: dropdown },
            bubbles: true,
        }));
        const height = dropdown.scrollHeight;
        dropdown.style.overflow = "hidden";
        dropdown.style.height = `${height}px`;
        const animation = dropdown.animate([{ height: `${height}px` }, { height: "0px" }], { duration: 300, easing: "ease" });
        animation.onfinish = () => {
            dropdown.style.height = "0px";
        };
        dropdown.dispatchEvent(new CustomEvent('dropdown:afterClose', {
            detail: { element: dropdown },
            bubbles: true,
        }));
    }
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
            Dropdown.slideUp(dropdown);
            dropdown.classList.remove('show');
        });
    }
}
