import EventManager from './event_manager.js';
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
            const selector = target.getAttribute('data-target');
            if (!selector)
                return;
            const dropdown = document.querySelector(selector);
            if (!dropdown)
                return;
            Dropdown.closeAllDropdownsExcept(dropdown);
            Dropdown.toggleDropdown(dropdown);
            return;
        }
        if (target.closest('.dropdown-menu.show')) {
            return;
        }
        Dropdown.closeAllDropdowns();
    }
    static toggleDropdown(dropdown) {
        Dropdown.isOpen(dropdown) ? Dropdown.closeDropdown(dropdown) : Dropdown.openDropdown(dropdown);
    }
    static isOpen(dropdown) {
        return dropdown.classList.contains('show');
    }
    static openDropdown(dropdown) {
        if (Dropdown.isOpen(dropdown))
            return;
        dropdown.style.display = 'block';
        dropdown.offsetHeight;
        dropdown.classList.add('show');
    }
    static closeDropdown(dropdown) {
        if (!Dropdown.isOpen(dropdown))
            return;
        dropdown.classList.remove('show');
        const onTransitionEnd = (event) => {
            if (event.propertyName !== 'opacity')
                return;
            dropdown.style.display = 'none';
            dropdown.removeEventListener('transitionend', onTransitionEnd);
        };
        dropdown.addEventListener('transitionend', onTransitionEnd, { once: true });
        dropdown.classList.remove('show');
    }
    static closeAllDropdownsExcept(exception) {
        const dropdowns = document.querySelectorAll('.dropdown-menu.show');
        dropdowns.forEach(dropdown => {
            if (dropdown !== exception) {
                Dropdown.closeDropdown(dropdown);
            }
        });
    }
    static closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu.show');
        dropdowns.forEach(dropdown => Dropdown.closeDropdown(dropdown));
    }
}
