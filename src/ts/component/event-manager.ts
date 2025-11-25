export default class EventManager {

    // Stores all listeners by event type
    public static listeners = new Map<string, Set<EventListener>>();

    // Adds an event listener to the document
    public static addEventToDocument(type: string, handler: (event: Event) => void): void {
        if (this.verifyListener(type, handler)) return;

        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
            document.addEventListener(type, (event) => this.dispatch(type, event));
        }

        this.pushListener(type, handler);
    }

    // Checks if a listener already exists for the given type
    private static verifyListener(type: string, handler: (event: Event) => void): boolean {
        const set = this.listeners.get(type);
        if (!set) return false;
        return set.has(handler);
    }

    // Adds a listener to the internal list
    private static pushListener(type: string, handler: (event: Event) => void): void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(handler);
    }

    // Dispatches the event to all registered handlers
    private static dispatch(type: string, event: Event): void {
        const set = this.listeners.get(type);
        if (!set) return;

        for (const handler of set) {
            try {
                handler(event);
            } catch (err) {
                console.error(`[EventManager] Error in handler "${type}":`, err);
            }
        }
    }
}