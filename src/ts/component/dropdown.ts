import EventManager from './event-manager.js';

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

        const button = target.closest<HTMLElement>('[data-js="dropdown"][data-target]');
        if (button) {
            const selector = button.getAttribute('data-target');
            if (!selector) return;

            const dropdown = document.querySelector(selector) as HTMLElement;
            if (!dropdown) return;

            Dropdown.closeAllDropdownsExcept(dropdown);
            Dropdown.toggleDropdown(dropdown, button);
            return;
        }

        if (target.closest('.dropdown-body.show')) {
            return;
        }

        Dropdown.closeAllDropdowns();
    }

    private static toggleDropdown(dropdown: HTMLElement, button: HTMLElement): void {
        Dropdown.isOpen(dropdown) ? Dropdown.closeDropdown(dropdown, button) : Dropdown.openDropdown(dropdown, button);
    }

    private static isOpen(dropdown: HTMLElement): boolean {
        return dropdown.classList.contains('show');
    }

    private static openDropdown(dropdown: HTMLElement, button: HTMLElement): void {
        if (Dropdown.isOpen(dropdown)) return;
        dropdown.style.display = 'block';
        dropdown.offsetHeight;
        dropdown.classList.add('show');
        button.setAttribute('aria-expanded', 'true');
    }

    private static closeDropdown(dropdown: HTMLElement, button: HTMLElement): void {
        if (!Dropdown.isOpen(dropdown)) return;
        dropdown.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');

        const onTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName !== 'opacity') return;
            dropdown.style.display = 'none';
            dropdown.removeEventListener('transitionend', onTransitionEnd);
        };

        dropdown.addEventListener('transitionend', onTransitionEnd, { once: true });
    }

    private static closeAllDropdownsExcept(exception: HTMLElement): void {
        const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown-body.show');

        dropdowns.forEach(dropdown => {
            if (dropdown !== exception) {
                const button = Dropdown.getButtonForDropdown(dropdown);
                if (!button) return;
                Dropdown.closeDropdown(dropdown, button);
            }
        });
    }

    private static closeAllDropdowns(): void {
        const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown-body.show');
        dropdowns.forEach(dropdown => {
            const button = Dropdown.getButtonForDropdown(dropdown);
            if (!button) return;
            Dropdown.closeDropdown(dropdown, button);
        });
    }

    private static getButtonForDropdown(dropdown: HTMLElement): HTMLElement | null {
        const id = dropdown.id;
        if (!id) return null;

        return document.querySelector<HTMLElement>(
            `[data-js="dropdown"][data-target="#${id}"]`
        );
    }

}