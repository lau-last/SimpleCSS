export default class Alert {
    constructor() {
        Alert.init();
    }
    static init() {
        this.selectorAll('[data-js="alert"]').forEach((alert) => {
            this.isAlertKeep(alert) ? this.bindCloseButton(alert) : this.removeAlertAfterAnimation(alert);
        });
    }
    static selectorAll(selector) {
        return document.querySelectorAll(selector);
    }
    static isAlertKeep(alert) {
        return alert.classList.contains('alert-keep');
    }
    static emitEvent(element, event) {
        element.dispatchEvent(new CustomEvent(event, {
            detail: { element: element },
            bubbles: true,
        }));
    }
    static getCssVariable(element, variableName) {
        return getComputedStyle(element).getPropertyValue(variableName).trim();
    }
    static removeAlertAfterAnimation(alert) {
        alert.addEventListener('animationend', () => {
            this.emitEvent(alert, 'alert:beforeRemove');
            this.removeAlert(alert);
        }, { once: true });
    }
    static bindCloseButton(alert) {
        const closeButtons = alert.querySelectorAll('.close');
        if (!closeButtons.length)
            return;
        closeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.emitEvent(alert, 'alert:beforeRemove');
                this.handleKeepAnimation(alert);
            });
        });
    }
    static handleKeepAnimation(alert) {
        const animationName = this.getCssVariable(alert, '--alert-keep-animation-out');
        if (animationName) {
            alert.style.animation = animationName;
            alert.addEventListener('animationend', () => {
                this.removeAlert(alert);
            }, { once: true });
        }
        else {
            this.removeAlert(alert);
        }
    }
    static removeAlert(alert) {
        alert.remove();
        this.emitEvent(document.body, 'alert:afterRemove');
    }
}
