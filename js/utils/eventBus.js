/**
 * EventBus - Pub/Sub implementation for component communication
 * Enables decoupled communication between components through events
 * @class
 */
class EventBus {
    /**
     * Creates a new EventBus instance
     * @constructor
     */
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - The event name to subscribe to
     * @param {Function} callback - The callback function to execute when the event is published
     * @returns {Function} Unsubscribe function that can be called to remove the subscription
     */
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);

        //Return a function to unsubscribe
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
            if (this.events[event].length === 0) {
                delete this.events[event];
            }
        };
    }

    /**
     * Publish an event with data
     * @param {string} event - The event name to publish
     * @param {*} data - The data to pass to subscribers
     * @returns {void}
     */
    publish(event, data) {
        if (!this.events[event]) {
            return;
        }

        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_EVENT_SUBSCRIBER + event  + ', ' +  error);
            }
        });
    }

    /**
     * Clear all subscriptions for a specific event
     * @param {string} event - The event to clear
     * @returns {void}
     */
    clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

const eventBus = new EventBus();