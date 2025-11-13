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
        if (Dropdown.handleToggle(target))
            return;
        Dropdown.handleOutsideClick(target);
    }
    static handleToggle(target) {
        if (!target.matches('[data-js="dropdown"][data-target]')) {
            return false;
        }
        const selector = target.getAttribute('data-target');
        if (!selector)
            return true;
        const dropdown = document.querySelector(selector);
        if (!dropdown)
            return true;
        Dropdown.toggle(dropdown);
        return true;
    }
    static handleOutsideClick(target) {
        const insideOpen = target.closest('.dropdown.show, .dropdown-overlay.show');
        if (!insideOpen) {
            Dropdown.closeAllDropdownsOverlay();
        }
    }
    static toggle(dropdown) {
        if (Dropdown.isAnimating(dropdown))
            return;
        const isOpen = dropdown.classList.contains('show');
        Dropdown.closeAllDropdownsOverlay(dropdown);
        isOpen ? Dropdown.close(dropdown) : Dropdown.open(dropdown);
    }
    static isAnimating(dropdown) {
        return dropdown.dataset.animating === 'true';
    }
    static open(dropdown) {
        dropdown.dataset.animating = 'true';
        dropdown.classList.add('show');
        const height = dropdown.scrollHeight;
        Dropdown.prepareOpenStyles(dropdown);
        const animation = Dropdown.playOpenAnimation(dropdown, height);
        animation.onfinish = () => {
            dropdown.style.height = 'auto';
            dropdown.style.overflow = 'visible';
            delete dropdown.dataset.animating;
        };
    }
    static close(dropdown) {
        dropdown.dataset.animating = 'true';
        const height = dropdown.scrollHeight;
        Dropdown.prepareCloseStyles(dropdown, height);
        const animation = Dropdown.playCloseAnimation(dropdown, height);
        animation.onfinish = () => {
            dropdown.style.height = '0px';
            dropdown.classList.remove('show');
            delete dropdown.dataset.animating;
        };
    }
    static prepareOpenStyles(dropdown) {
        dropdown.style.overflow = 'hidden';
        dropdown.style.height = '0px';
    }
    static prepareCloseStyles(dropdown, height) {
        dropdown.style.overflow = 'hidden';
        dropdown.style.height = `${height}px`;
    }
    static playOpenAnimation(dropdown, height) {
        return dropdown.animate([{ height: '0px' }, { height: `${height}px` }], { duration: 300, easing: 'ease' });
    }
    static playCloseAnimation(dropdown, height) {
        return dropdown.animate([{ height: `${height}px` }, { height: '0px' }], { duration: 300, easing: 'ease' });
    }
    static closeAllDropdownsOverlay(except) {
        const dropdownsOverlay = document.querySelectorAll('.dropdown-overlay.show');
        if (!dropdownsOverlay.length)
            return;
        dropdownsOverlay.forEach((dropdown) => {
            if (dropdown === except)
                return;
            Dropdown.close(dropdown);
        });
    }
}
