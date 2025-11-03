export default class Alert {
    constructor() {
        Alert.init();
    }

    // Initialize all alerts on the page
    private static init(): void {
        document.querySelectorAll('[data-js="alert"]').forEach((alert: Element) =>
            (alert as HTMLElement).classList.contains('alert-keep')
                ? Alert.bindCloseButton(alert as HTMLElement)
                : Alert.removeAfterAnimation(alert as HTMLElement)
        );
    }

    // Dispatch a custom event with the alert element as detail
    private static emitEvent(target: EventTarget, eventName: string, alert: HTMLElement): void {
        target.dispatchEvent(new CustomEvent(eventName, {detail: {element: alert}, bubbles: true}));
    }


    // Remove alert automatically after its animation ends
    private static removeAfterAnimation(alert: HTMLElement): void {
        alert.addEventListener('animationend', () => {
            Alert.emitEvent(alert, 'alert:beforeRemove', alert);
            Alert.finishRemove(alert);
        }, {once: true});
    }

    // Bind close button event for keep alerts
    private static bindCloseButton(alert: HTMLElement): void {
        const closeButtons = alert.querySelectorAll('.close') as NodeListOf<HTMLElement>;
        if (!closeButtons.length) return;
        closeButtons.forEach(button => button.addEventListener('click', () => {
            Alert.emitEvent(alert, 'alert:beforeRemove', alert);
            Alert.handleKeepAnimation(alert);
        }, {once: true}));
    }

    // Handle the animation when closing a keep alert
    private static handleKeepAnimation(alert: HTMLElement): void {
        const name = getComputedStyle(alert).getPropertyValue('--alert-keep-animation-out').trim();
        if (name) {
            alert.style.animation = name;
            alert.addEventListener('animationend', () => Alert.finishRemove(alert), {once: true});
        } else {
            Alert.finishRemove(alert);
        }
    }

    // Remove alert element from DOM and emit afterRemove event
    private static finishRemove(alert: HTMLElement): void {
        alert.remove();
        Alert.emitEvent(document.body, 'alert:afterRemove', alert);
    }
}