import EventManager from './event_manager.js';
export default class Alert {
    constructor() {
        Alert.init();
    }
    static init() {
        EventManager.addEventToDocument('animationend', Alert.onAnimationEnd);
        EventManager.addEventToDocument('click', Alert.onClick);
    }
    static onAnimationEnd(event) {
        const target = event.target;
        if (!target)
            return;
        if (!target.matches('[data-js="alert"]'))
            return;
        target.remove();
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        if (!target.matches('.close'))
            return;
        const alert = target.closest('[data-js="alert"]');
        if (!alert)
            return;
        alert.remove();
    }
}
