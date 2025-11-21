import EventManager from './event-manager.js';

export default class FormValidate {
    constructor() {
        FormValidate.init();
    }


    private static init(): void {
        EventManager.addEventToDocument('submit', FormValidate.onSubmit);
    }

    private static onSubmit(event: Event): void {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const form = target.closest('form') as HTMLFormElement | null;
        if (!form) return;

        if (!form.matches('[data-js="validate"]')) return;

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        form.classList.add('validated');
    }

}