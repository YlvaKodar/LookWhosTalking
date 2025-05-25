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
    root.style.setProperty('--secondary-color', CONFIG.THEME.COLORS.SECONDARY);
    root.style.setProperty('--secondary-hover-color', CONFIG.THEME.COLORS.SECONDARY_HOVER);
    root.style.setProperty('--tertiary-color', CONFIG.THEME.COLORS.TERTIARY);
    root.style.setProperty('--tertiary-hover-color', CONFIG.THEME.COLORS.TERTIARY_HOVER);
    root.style.setProperty('--header-bg-color', CONFIG.THEME.COLORS.HEADER_BG);
    root.style.setProperty('--border-color', CONFIG.THEME.COLORS.BORDER);
    root.style.setProperty('--popup-border-color', CONFIG.THEME.COLORS.POPUP_BORDER);
    root.style.setProperty('--popup-button-color', CONFIG.THEME.COLORS.POPUP_BUTTON);
    root.style.setProperty('--active-border-color', CONFIG.THEME.COLORS.ACTIVE_BORDER);
    root.style.setProperty('--header-first-color', CONFIG.THEME.COLORS.HEADER_FIRST);
    root.style.setProperty('--header-second-color', CONFIG.THEME.COLORS.HEADER_SEC);
    root.style.setProperty('--header-third-color', CONFIG.THEME.COLORS.HEADER_THIRD);

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
    root.style.setProperty('--popup-padding', CONFIG.THEME.POPOUT.PADDING);
    root.style.setProperty('--popup-max-width', CONFIG.THEME.POPOUT.MAX_WIDTH);
    root.style.setProperty('--popup-heading-scale', CONFIG.THEME.POPOUT.HEADING_SCALE);

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

    // Apply text content efficiently with loops instead of many if-checks
    applyTextContent();

    // Generate color theme selector from CONFIG
    generateColorThemeSelector();

    console.log('Theme applied from configuration');
}

/**
 * Helper function to apply text content to elements
 * More efficient than multiple if-checks
 */
function applyTextContent() {
    // Headings mapping
    const headings = {
        [CONFIG.DOM.SCREENS.START_HEAD_FIRST]: CONFIG.LABELS.HEADINGS.START_HEAD_FIRST,
        [CONFIG.DOM.SCREENS.START_HEAD_SEC]: CONFIG.LABELS.HEADINGS.START_HEAD_SEC,
        [CONFIG.DOM.SCREENS.SETUP_HEAD]: CONFIG.LABELS.HEADINGS.SETUP_HEAD,
        [CONFIG.DOM.SCREENS.SETUP_FORM_HEAD_FIRST]: CONFIG.LABELS.HEADINGS.SETUP_FORM_HEAD_FIRST,
        [CONFIG.DOM.SCREENS.SETUP_FORM_HEAD_SEC]: CONFIG.LABELS.HEADINGS.SETUP_FORM_HEAD_SEC,
        [CONFIG.DOM.SCREENS.STATS_HEAD]: CONFIG.LABELS.HEADINGS.STATS_HEAD
    };

    // Main window buttons mapping
    const mainButtons = {
        [CONFIG.DOM.BUTTONS.WOMEN]: CONFIG.GENDERS.buttonLabels.women,
        [CONFIG.DOM.BUTTONS.NON_BINARY]: CONFIG.GENDERS.buttonLabels.nonbinary,
        [CONFIG.DOM.BUTTONS.MEN]: CONFIG.GENDERS.buttonLabels.men,
        [CONFIG.DOM.BUTTONS.PAUSE]: CONFIG.LABELS.PAUSE_MEETING_BUTTON,
        [CONFIG.DOM.BUTTONS.END_MEETING]: CONFIG.LABELS.END_MEETING_BUTTON,
        [CONFIG.DOM.BUTTONS.TIMER_POPOUT]: CONFIG.LABELS.TIMER_POPOUT_BUTTON,
        [CONFIG.DOM.BUTTONS.NEW_MEETING]: CONFIG.LABELS.NEW_MEETING_BUTTON,
        [CONFIG.DOM.BUTTONS.BACK_TO_START]: CONFIG.LABELS.BACK_TO_START,
        [CONFIG.DOM.FORM.START_BUTTON]: CONFIG.LABELS.START_BUTTON
    };

    // Timer popup buttons mapping
    const popupButtons = {
        [CONFIG.TIMER_POPOUT_DOM.TITLE]: CONFIG.TIMER_POPOUT_DOM.TITLE_LABEL,
        [CONFIG.TIMER_POPOUT_DOM.BUTTONS.MEN]: CONFIG.GENDERS.buttonLabels.men,
        [CONFIG.TIMER_POPOUT_DOM.BUTTONS.WOMEN]: CONFIG.GENDERS.buttonLabels.women,
        [CONFIG.TIMER_POPOUT_DOM.BUTTONS.NON_BINARY]: CONFIG.GENDERS.buttonLabels.nonbinary,
        [CONFIG.TIMER_POPOUT_DOM.BUTTONS.PAUSE]: CONFIG.LABELS.PAUSE_MEETING_BUTTON,
        [CONFIG.TIMER_POPOUT_DOM.BUTTONS.END]: CONFIG.LABELS.END_MEETING_BUTTON
    };

    // Chart titles mapping
    const chartTitles = {
        'participants-chart-title': CONFIG.LABELS.CHART_TITLES.PARTICIPANTS,
        'speaking-time-chart-title': CONFIG.LABELS.CHART_TITLES.SPEAKING_TIME,
        'interventions-chart-title': CONFIG.LABELS.CHART_TITLES.INTERVENTIONS
    };

    // Apply all text content using the mappings
    [headings, mainButtons, popupButtons, chartTitles].forEach(mapping => {
        setTextContent(mapping);
    });
}

/**
 * Helper function to set text content for element mappings
 * @param {Object} mapping - Object with elementId: textContent pairs
 */
function setTextContent(mapping) {
    Object.entries(mapping).forEach(([elementId, textContent]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = textContent;
        }
    });
}

/**
 * Apply selected gender color theme
 * @param {string} themeName - Name of the theme to apply
 */
function applyGenderColorTheme(themeName) {
    if (!CONFIG.GENDER_COLOR_THEMES || !CONFIG.GENDER_COLOR_THEMES[themeName]) {
        console.warn(`Theme '${themeName}' not found, using default colors`);
        return;
    }

    const theme = CONFIG.GENDER_COLOR_THEMES[themeName];
    const root = document.documentElement;

    // Apply gender colors from selected theme
    root.style.setProperty('--men-color', theme.men);
    root.style.setProperty('--women-color', theme.women);
    root.style.setProperty('--nonbinary-color', theme.nonbinary);

    // Also update the CONFIG object so charts use the new colors
    CONFIG.GENDERS.colors.men = theme.men;
    CONFIG.GENDERS.colors.women = theme.women;
    CONFIG.GENDERS.colors.nonbinary = theme.nonbinary;

    // Update preview buttons if they exist (for live preview on setup page)
    updatePreviewButtons();

    console.log(`Applied gender color theme: ${themeName}`);
}

/**
 * Updates preview buttons with current theme colors
 * Shows live preview of how gender buttons will look
 */
function updatePreviewButtons() {
    const womenPreview = document.querySelector('.women-preview');
    const nonbinaryPreview = document.querySelector('.nonbinary-preview');
    const menPreview = document.querySelector('.men-preview');

    if (womenPreview) womenPreview.style.backgroundColor = CONFIG.GENDERS.colors.women;
    if (nonbinaryPreview) nonbinaryPreview.style.backgroundColor = CONFIG.GENDERS.colors.nonbinary;
    if (menPreview) menPreview.style.backgroundColor = CONFIG.GENDERS.colors.men;
}

/**
 * Generates the color theme selector HTML from CONFIG
 * This ensures all colors come from configuration, not hardcoded HTML
 */
function generateColorThemeSelector() {
    const container = document.getElementById('color-theme-selector');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Get saved theme preference or default to first theme
    const savedTheme = StorageManager.getColorThemePreference() || Object.keys(CONFIG.GENDER_COLOR_THEMES)[0] || 'original';

    // Generate HTML for each theme from CONFIG
    Object.entries(CONFIG.GENDER_COLOR_THEMES).forEach(([themeKey, theme], index) => {
        const themeOption = document.createElement('div');
        themeOption.className = 'theme-option';

        const isChecked = (themeKey === savedTheme) ? 'checked' : '';

        themeOption.innerHTML = `
            <input type="radio" id="theme-${themeKey}" name="colorTheme" value="${themeKey}" ${isChecked}>
            <label for="theme-${themeKey}" class="theme-label">
                <span class="theme-name">${theme.name}</span>
                <div class="color-preview">
                    <div class="color-box" style="background-color: ${theme.women};" title="Women"></div>
                    <div class="color-box" style="background-color: ${theme.nonbinary};" title="Non-binary"></div>
                    <div class="color-box" style="background-color: ${theme.men};" title="Men"></div>
                </div>
            </label>
        `;

        container.appendChild(themeOption);
    });

    // Apply the saved/default theme
    applyGenderColorTheme(savedTheme);
}