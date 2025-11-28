import EventManager from './event-manager.js';
export default class Dropdown {
    constructor() {
        Dropdown.init();
    }
    static init() {
        EventManager.addEventToDocument('click', Dropdown.onClick);
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        if (target.matches('[data-js="dropdown"][data-target]')) {
            const button = target;
            const selector = button.getAttribute('data-target');
            if (!selector)
                return;
            const dropdown = document.querySelector(selector);
            if (!dropdown)
                return;
            Dropdown.closeAllDropdownsExcept(dropdown);
            Dropdown.toggleDropdown(dropdown, button);
            return;
        }
        if (target.closest('.dropdown-body.show')) {
            return;
        }
        Dropdown.closeAllDropdowns();
    }
    static toggleDropdown(dropdown, button) {
        Dropdown.isOpen(dropdown) ? Dropdown.closeDropdown(dropdown, button) : Dropdown.openDropdown(dropdown, button);
    }
    static isOpen(dropdown) {
        return dropdown.classList.contains('show');
    }
    static openDropdown(dropdown, button) {
        if (Dropdown.isOpen(dropdown))
            return;
        dropdown.style.display = 'block';
        dropdown.offsetHeight;
        dropdown.classList.add('show');
        button.setAttribute('aria-expanded', 'true');
    }
    static closeDropdown(dropdown, button) {
        if (!Dropdown.isOpen(dropdown))
            return;
        dropdown.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
        const onTransitionEnd = (event) => {
            if (event.propertyName !== 'opacity')
                return;
            dropdown.style.display = 'none';
            dropdown.removeEventListener('transitionend', onTransitionEnd);
        };
        dropdown.addEventListener('transitionend', onTransitionEnd, { once: true });
    }
    static closeAllDropdownsExcept(exception) {
        const dropdowns = document.querySelectorAll('.dropdown-body.show');
        dropdowns.forEach(dropdown => {
            if (dropdown !== exception) {
                const button = Dropdown.getButtonForDropdown(dropdown);
                if (!button)
                    return;
                Dropdown.closeDropdown(dropdown, button);
            }
        });
    }
    static closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-body.show');
        dropdowns.forEach(dropdown => {
            const button = Dropdown.getButtonForDropdown(dropdown);
            if (!button)
                return;
            Dropdown.closeDropdown(dropdown, button);
        });
    }
    static getButtonForDropdown(dropdown) {
        const id = dropdown.id;
        if (!id)
            return null;
        return document.querySelector(`[data-js="dropdown"][data-target="#${id}"]`);
    }
}
