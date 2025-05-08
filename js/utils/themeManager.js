/**
 * Applies CSS variables from configuration object
 * This function bridges config.js and the CSS variables used in styles.css
 */
function applyThemeFromConfig() {
    const root = document.documentElement; // :root element

    // Apply gender colors
    root.style.setProperty('--men-color', CONFIG.GENDERS.colors.men);
    root.style.setProperty('--women-color', CONFIG.GENDERS.colors.women);
    root.style.setProperty('--nonbinary-color', CONFIG.GENDERS.colors.nonbinary);

    // Apply theme colors
    root.style.setProperty('--primary-color', CONFIG.THEME.COLORS.PRIMARY);
    root.style.setProperty('--primary-hover-color', CONFIG.THEME.COLORS.PRIMARY_HOVER);
    root.style.setProperty('--header-bg-color', CONFIG.THEME.COLORS.HEADER_BG);
    root.style.setProperty('--border-color', CONFIG.THEME.COLORS.BORDER);
    root.style.setProperty('--popup-border-color', CONFIG.THEME.COLORS.POPUP_BORDER);
    root.style.setProperty('--popup-button-color', CONFIG.THEME.COLORS.POPUP_BUTTON);
    root.style.setProperty('--active-border-color', CONFIG.THEME.COLORS.ACTIVE_BORDER);

    // Apply sizing
    root.style.setProperty('--body-max-width', CONFIG.THEME.SIZING.BODY_MAX_WIDTH);
    root.style.setProperty('--container-padding', CONFIG.THEME.SIZING.CONTAINER_PADDING);
    root.style.setProperty('--element-gap', CONFIG.THEME.SIZING.ELEMENT_GAP);
    root.style.setProperty('--button-padding', CONFIG.THEME.SIZING.BUTTON_PADDING);
    root.style.setProperty('--popup-min-width', CONFIG.THEME.SIZING.POPUP_MIN_WIDTH);
    root.style.setProperty('--popup-min-height', CONFIG.THEME.SIZING.POPUP_MIN_HEIGHT);
    root.style.setProperty('--chart-max-width', CONFIG.THEME.SIZING.CHART_MAX_WIDTH);

    // Apply typography
    root.style.setProperty('--timer-font-size', CONFIG.THEME.TYPOGRAPHY.TIMER_FONT_SIZE);
    root.style.setProperty('--popup-timer-font-size', CONFIG.THEME.TYPOGRAPHY.POPOUT_TIMER_FONT_SIZE);
    root.style.setProperty('--button-font-size', CONFIG.THEME.TYPOGRAPHY.BUTTON_FONT_SIZE);
    root.style.setProperty('--speaker-button-font-size', CONFIG.THEME.TYPOGRAPHY.SPEAKER_BUTTON_FONT_SIZE);
    root.style.setProperty('--popup-font-size', CONFIG.THEME.TYPOGRAPHY.POPOUT_FONT_SIZE);

    // Apply borders
    root.style.setProperty('--border-radius', CONFIG.THEME.BORDERS.RADIUS);
    root.style.setProperty('--popup-border-radius', CONFIG.THEME.BORDERS.POPUP_RADIUS);
    root.style.setProperty('--active-border-width', CONFIG.THEME.BORDERS.ACTIVE_BORDER_WIDTH);

    // Apply breakpoints
    root.style.setProperty('--mobile-breakpoint', CONFIG.THEME.BREAKPOINTS.MOBILE);

    //POPOUT STYLING
    root.style.setProperty('--popup-bg-color', CONFIG.THEME.POPOUT.BG_COLOR);
    root.style.setProperty('--popup-text-color', CONFIG.THEME.POPOUT.TEXT_COLOR);
    root.style.setProperty('--popup-title-color', CONFIG.THEME.POPOUT.TITLE_COLOR);
    root.style.setProperty('--popup-padding', CONFIG.THEME.POPOUT.PADDING);
    root.style.setProperty('--popup-max-width', CONFIG.THEME.POPOUT.MAX_WIDTH);
    root.style.setProperty('--popup-title-font-size', CONFIG.THEME.POPOUT.TITLE_FONT_SIZE);
    root.style.setProperty('--popup-info-font-size', CONFIG.THEME.POPOUT.INFO_FONT_SIZE);

    // ALERT STYLING
    root.style.setProperty('--alert-bg-color', CONFIG.THEME.ALERTS.BG_COLOR);
    root.style.setProperty('--alert-text-color', CONFIG.THEME.ALERTS.TEXT_COLOR);
    root.style.setProperty('--alert-overlay-color', CONFIG.THEME.ALERTS.OVERLAY_COLOR);
    root.style.setProperty('--alert-shadow', CONFIG.THEME.ALERTS.SHADOW);
    root.style.setProperty('--alert-min-width', CONFIG.THEME.ALERTS.MIN_WIDTH);
    root.style.setProperty('--alert-max-width', CONFIG.THEME.ALERTS.MAX_WIDTH);
    root.style.setProperty('--alert-padding', CONFIG.THEME.ALERTS.PADDING);
    root.style.setProperty('--alert-font-size', CONFIG.THEME.ALERTS.FONT_SIZE);
    root.style.setProperty('--alert-margin-bottom', CONFIG.THEME.ALERTS.MARGIN_BOTTOM);
    root.style.setProperty('--alert-ok-bg-color', CONFIG.THEME.ALERTS.OK_BG_COLOR);
    root.style.setProperty('--alert-ok-hover-color', CONFIG.THEME.ALERTS.OK_HOVER_COLOR);
    root.style.setProperty('--alert-cancel-bg-color', CONFIG.THEME.ALERTS.CANCEL_BG_COLOR);
    root.style.setProperty('--alert-cancel-hover-color', CONFIG.THEME.ALERTS.CANCEL_HOVER_COLOR);
    root.style.setProperty('--alert-button-min-width', CONFIG.THEME.ALERTS.BUTTON_MIN_WIDTH);
    root.style.setProperty('--alert-button-gap', CONFIG.THEME.ALERTS.BUTTON_GAP);
    root.style.setProperty('--alert-z-index-overlay', CONFIG.THEME.ALERTS.Z_INDEX_OVERLAY);
    root.style.setProperty('--alert-z-index-alert', CONFIG.THEME.ALERTS.Z_INDEX_ALERT);
    root.style.setProperty('--alert-border-color', CONFIG.THEME.ALERTS.BORDER_COLOR);
    root.style.setProperty('--alert-border-width', CONFIG.THEME.ALERTS.BORDER_WIDTH);
    root.style.setProperty('--alert-border-style', CONFIG.THEME.ALERTS.BORDER_STYLE);


    //Buttons
    if (document.getElementById(CONFIG.DOM.BUTTONS.WOMEN)) {
        document.getElementById(CONFIG.DOM.BUTTONS.WOMEN).textContent = CONFIG.GENDERS.buttonLabels.women;
        document.getElementById(CONFIG.DOM.BUTTONS.NON_BINARY).textContent = CONFIG.GENDERS.buttonLabels.nonbinary;
        document.getElementById(CONFIG.DOM.BUTTONS.MEN).textContent = CONFIG.GENDERS.buttonLabels.men;
        document.getElementById(CONFIG.DOM.BUTTONS.PAUSE).textContent = CONFIG.LABELS.PAUSE_MEETING_BUTTON;
        document.getElementById(CONFIG.DOM.BUTTONS.END_MEETING).textContent = CONFIG.LABELS.END_MEETING_BUTTON;
        document.getElementById(CONFIG.DOM.BUTTONS.TIMER_POPOUT).textContent = CONFIG.LABELS.TIMER_POPOUT_BUTTON;

        document.getElementById(CONFIG.DOM.BUTTONS.NEW_MEETING).textContent = CONFIG.LABELS.NEW_MEETING_BUTTON;

        document.getElementById(CONFIG.DOM.BUTTONS.BACK_TO_START).textContent = CONFIG.LABELS.BACK_TO_START;

        document.getElementById(CONFIG.DOM.FORM.START_BUTTON).textContent = CONFIG.LABELS.START_BUTTON;

    }

    if (document.getElementById(CONFIG.TIMER_POPOUT_DOM.TITLE)) {
        document.getElementById(CONFIG.TIMER_POPOUT_DOM.TITLE).textContent = CONFIG.TIMER_POPOUT_DOM.TITLE_LABEL;

        document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.MEN).textContent = CONFIG.GENDERS.buttonLabels.men;
        document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.WOMEN).textContent = CONFIG.GENDERS.buttonLabels.women;
        document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.NON_BINARY).textContent = CONFIG.GENDERS.buttonLabels.nonbinary;
        document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.PAUSE).textContent = CONFIG.LABELS.PAUSE_MEETING_BUTTON;
        document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.END).textContent = CONFIG.LABELS.END_MEETING_BUTTON;
    }

    console.log('Theme applied from configuration');
}