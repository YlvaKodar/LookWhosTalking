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
    root.style.setProperty('--popup-timer-font-size', CONFIG.THEME.TYPOGRAPHY.POPUP_TIMER_FONT_SIZE);
    root.style.setProperty('--button-font-size', CONFIG.THEME.TYPOGRAPHY.BUTTON_FONT_SIZE);
    root.style.setProperty('--speaker-button-font-size', CONFIG.THEME.TYPOGRAPHY.SPEAKER_BUTTON_FONT_SIZE);
    root.style.setProperty('--popup-font-size', CONFIG.THEME.TYPOGRAPHY.POPUP_FONT_SIZE);

    // Apply borders
    root.style.setProperty('--border-radius', CONFIG.THEME.BORDERS.RADIUS);
    root.style.setProperty('--popup-border-radius', CONFIG.THEME.BORDERS.POPUP_RADIUS);
    root.style.setProperty('--active-border-width', CONFIG.THEME.BORDERS.ACTIVE_BORDER_WIDTH);

    // Apply breakpoints
    root.style.setProperty('--mobile-breakpoint', CONFIG.THEME.BREAKPOINTS.MOBILE);

    //POPUP STYLING
    root.style.setProperty('--popup-bg-color', CONFIG.THEME.POPUP.BG_COLOR);
    root.style.setProperty('--popup-text-color', CONFIG.THEME.POPUP.TEXT_COLOR);
    root.style.setProperty('--popup-title-color', CONFIG.THEME.POPUP.TITLE_COLOR);
    root.style.setProperty('--popup-padding', CONFIG.THEME.POPUP.PADDING);
    root.style.setProperty('--popup-max-width', CONFIG.THEME.POPUP.MAX_WIDTH);
    root.style.setProperty('--popup-title-font-size', CONFIG.THEME.POPUP.TITLE_FONT_SIZE);
    root.style.setProperty('--popup-info-font-size', CONFIG.THEME.POPUP.INFO_FONT_SIZE);

    if (document.getElementById(CONFIG.TIMER_POPUP.DOM.TITLE)) {
        document.getElementById(CONFIG.TIMER_POPUP.DOM.TITLE).textContent = CONFIG.TIMER_POPUP.TITLE;
    }

    if (document.getElementById(CONFIG.DOM.BUTTONS.POPUP_MEN)) {
        document.getElementById(CONFIG.DOM.BUTTONS.POPUP_MEN).textContent = CONFIG.TIMER_POPUP.LABELS.MEN_BUTTON;
        document.getElementById(CONFIG.DOM.BUTTONS.POPUP_WOMEN).textContent = CONFIG.TIMER_POPUP.LABELS.WOMEN_BUTTON;
        document.getElementById(CONFIG.DOM.BUTTONS.POPUP_NON_BINARY).textContent = CONFIG.TIMER_POPUP.LABELS.NONBINARY_BUTTON;
        document.getElementById(CONFIG.DOM.BUTTONS.POPUP_PAUSE).textContent = CONFIG.TIMER_POPUP.LABELS.PAUSE_BUTTON;
        document.getElementById(CONFIG.DOM.BUTTONS.POPUP_END).textContent = CONFIG.TIMER_POPUP.LABELS.END_BUTTON;
    }

    console.log('Theme applied from configuration');
}