import EventManager from './event-manager';
export default class FormValidate {
    constructor() {
        FormValidate.init();
    }
    static init() {
        EventManager.addEventToDocument('submit', FormValidate.onSubmit);
    }
    static onSubmit(event) {
        const target = event.target;
        if (!target)
            return;
        const form = target.closest('form');
        if (!form)
            return;
        if (!form.matches('[data-js="validate"]'))
            return;
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('validated');
    }
}
