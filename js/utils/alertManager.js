/**
* Alert Manager for the "Look Who's Talking" application.
* Provides custom alert dialogs that can be styled with CSS.
*/
class AlertManager {
    /**
     * Displays a custom alert dialog.
     * @static
     * @param {string} message - The message to display in the alert
     * @param {function} [callback] - Optional callback when alert is dismissed
     * @returns {void}
     */
    static showAlert(message, callback) {
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';

        const alertBox = document.createElement('div');
        alertBox.className = 'alert-box';

        const messageElement = document.createElement('p');
        messageElement.className = 'alert-message';
        messageElement.textContent = message;

        const okButton = document.createElement('button');
        okButton.className = 'alert-button';
        okButton.textContent = CONFIG.LABELS.ALERT_OK_BUTTON;

        alertBox.appendChild(messageElement);
        alertBox.appendChild(okButton);
        document.body.appendChild(overlay);
        document.body.appendChild(alertBox);

        const dismissAlert = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(alertBox);
            if (typeof callback === 'function') {
                callback();
            }
        };

        okButton.addEventListener('click', dismissAlert);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                dismissAlert();
            }
        });
    }

    /**
     * Displays a confirmation dialog with OK and Cancel buttons.
     * @static
     * @param {string} message - The message to display in the confirmation dialog
     * @param {function} callback - Callback that receives true (OK) or false (Cancel)
     * @returns {void}
     */
    static showConfirm(message, callback) {
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';

        const confirmBox = document.createElement('div');
        confirmBox.className = 'alert-box confirm-box';

        const messageElement = document.createElement('p');
        messageElement.className = 'alert-message';
        messageElement.textContent = message;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';

        const okButton = document.createElement('button');
        okButton.className = 'alert-button';
        okButton.textContent = CONFIG.LABELS.ALERT_OK_BUTTON_CONFIRM;

        const cancelButton = document.createElement('button');
        cancelButton.className = 'alert-button cancel-button';
        cancelButton.textContent = CONFIG.LABELS.ALERT_CANCEL_BUTTON;

        buttonContainer.appendChild(okButton);
        buttonContainer.appendChild(cancelButton);
        confirmBox.appendChild(messageElement);
        confirmBox.appendChild(buttonContainer);
        document.body.appendChild(overlay);
        document.body.appendChild(confirmBox);

        const handleResponse = (result) => {
            document.body.removeChild(overlay);
            document.body.removeChild(confirmBox);
            if (typeof callback === 'function') {
                callback(result);
            }
        };

        okButton.addEventListener('click', () => handleResponse(true));
        cancelButton.addEventListener('click', () => handleResponse(false));

    }
}