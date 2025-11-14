import EventManager from './event_manager.js';

export default class Dropdown {
    constructor() {
        Dropdown.init();
    }


    private static init(): void {
        EventManager.addEventToDocument('click', Dropdown.onClick);
    }


    private static onClick(event: Event): void {
        if (!(event instanceof MouseEvent)) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;

        if (target.matches('[data-js="dropdown"][data-target]')) {
            const selector = target.getAttribute('data-target');
            if (!selector) return;

            const dropdown = document.querySelector(selector) as HTMLElement;
            if (!dropdown) return;

            Dropdown.closeAllDropdownsExcept(dropdown);
            Dropdown.toggleDropdown(dropdown);
            return;
        }

        if (target.closest('.dropdown-menu.show')) {
            return;
        }

        Dropdown.closeAllDropdowns();
    }

    private static toggleDropdown(dropdown: HTMLElement): void {
        Dropdown.isOpen(dropdown) ? Dropdown.closeDropdown(dropdown) : Dropdown.openDropdown(dropdown);
    }

    private static isOpen(dropdown: HTMLElement): boolean {
        return dropdown.classList.contains('show');
    }

    private static openDropdown(dropdown: HTMLElement): void {
        if (Dropdown.isOpen(dropdown)) return;
        dropdown.style.display = 'block';
        dropdown.offsetHeight;
        dropdown.classList.add('show');
    }

    private static closeDropdown(dropdown: HTMLElement): void {
        if (!Dropdown.isOpen(dropdown)) return;
        dropdown.classList.remove('show');

        const onTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName !== 'opacity') return;
            dropdown.style.display = 'none';
            dropdown.removeEventListener('transitionend', onTransitionEnd);
        };

        dropdown.addEventListener('transitionend', onTransitionEnd, { once: true });
        dropdown.classList.remove('show');
    }

    private static closeAllDropdownsExcept(exception: HTMLElement): void {
        const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown-menu.show');

        dropdowns.forEach(dropdown => {
            if (dropdown !== exception) {
                Dropdown.closeDropdown(dropdown);
            }
        });
    }



    private static closeAllDropdowns(): void {
        const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown-menu.show');
        dropdowns.forEach(dropdown => Dropdown.closeDropdown(dropdown));
    }

}