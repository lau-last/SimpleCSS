class EventManager {
    // Adds an event listener to the document
    static addEventToDocument(type, handler) {
        if (this.verifyListener(type, handler))
            return;
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
            document.addEventListener(type, (event) => this.dispatch(type, event));
        }
        this.pushListener(type, handler);
    }
    // Checks if a listener already exists for the given type
    static verifyListener(type, handler) {
        const set = this.listeners.get(type);
        if (!set)
            return false;
        return set.has(handler);
    }
    // Adds a listener to the internal list
    static pushListener(type, handler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(handler);
    }
    // Dispatches the event to all registered handlers
    static dispatch(type, event) {
        const set = this.listeners.get(type);
        if (!set)
            return;
        for (const handler of set) {
            try {
                handler(event);
            }
            catch (err) {
                console.error(`[EventManager] Error in handler "${type}":`, err);
            }
        }
    }
}
// Stores all listeners by event type
EventManager.listeners = new Map();
export default EventManager;
