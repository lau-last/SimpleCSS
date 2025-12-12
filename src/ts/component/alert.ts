import EventManager from './event-manager.js';

export default class Alert {
    constructor() {
        Alert.init();
    }


    private static init(): void {
        EventManager.addEventToDocument('animationend', Alert.onAnimationEnd);
        EventManager.addEventToDocument('click', Alert.onClick);
    }


    private static onAnimationEnd(event: Event): void {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        const alert = target.closest('[data-js="alert"]') as HTMLElement | null;
        if (!alert) return;

        alert.remove();
    }


    private static onClick(event: Event): void {
        if (!(event instanceof MouseEvent)) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;


        const closeBtn = target.closest('.close') as HTMLElement | null;
        if (!closeBtn) return;


        const alert = closeBtn.closest('[data-js="alert"]') as HTMLElement | null;
        if (!alert) return;
        alert.remove();

    }

}