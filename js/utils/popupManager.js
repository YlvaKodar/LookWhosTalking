/**
 * Handles drag functionality for popup modul
 */
class PopupManager {
    /**
     * Initialize popup functionality
     * @param {string} popupId - ID for popup element
     * @param {string} headerSelector - CSS selector for popup header (drag area)
     */
    static setupPopup(popupId, headerSelector) {
        const popup = document.getElementById(popupId);
        const header = popup.querySelector(headerSelector);

        if (!popup || !header) return;

        let isDragging = false;
        let offsetX, offsetY;

        //Initializes position (middle of screen)
        this.positionPopupCenter(popupId);

        //Drag functionality
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.getBoundingClientRect().left;
            offsetY = e.clientY - popup.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            //Stay on visible screen
            const maxX = window.innerWidth - popup.offsetWidth;
            const maxY = window.innerHeight - popup.offsetHeight;

            popup.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            popup.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        //Minimizes / closes buttons
        const minimizeBtn = popup.querySelector('#minimize-popup');
        const closeBtn = popup.querySelector('#close-popup');

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                popup.classList.toggle('minimized');
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hidePopup(popupId);
            });
        }
    }

    /**
     *Shows popup modul
     * @param {string} popupId - ID for popup element.
     */
    static showPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
    }

    /**
     * Hides popup module.
     * @param {string} popupId - ID for popup element.
     */
    static hidePopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'none';
        }
    }

    /**
     * Places popup in middle of screen.
     * @param {string} popupId - ID for popup element.
     */
    static positionPopupCenter(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            const x = (window.innerWidth - popup.offsetWidth) / 2;
            const y = (window.innerHeight - popup.offsetHeight) / 2;

            popup.style.left = `${x}px`;
            popup.style.top = `${y}px`;
        }
    }
}