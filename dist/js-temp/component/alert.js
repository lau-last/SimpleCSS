import EventManager from './event-manager.js';
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
        const alert = target.closest('[data-js="alert"]');
        if (!alert)
            return;
        alert.remove();
    }
    static onClick(event) {
        if (!(event instanceof MouseEvent))
            return;
        const target = event.target;
        if (!target)
            return;
        const closeBtn = target.closest('.close');
        if (!closeBtn)
            return;
        const alert = closeBtn.closest('[data-js="alert"]');
        if (!alert)
            return;
        alert.remove();
    }
}
