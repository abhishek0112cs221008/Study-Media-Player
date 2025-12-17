// Red Theme Configuration
// Black Mode & White Mode with RED accents

export const themes = {
    black: {
        id: 'black',
        name: 'Black Mode',
        description: 'Sleek & Modern',

        // Red Theme Colors
        primary: '#E50914', // Netflix Red
        primaryDark: '#B20710',
        primaryLight: '#F40612',

        gradient: 'linear-gradient(135deg, #000000 0%, #1C1C1E 100%)',

        // Backgrounds
        background: '#000000',
        backgroundLight: '#1C1C1E',
        backgroundElevated: '#2C2C2E',

        // Text colors
        textPrimary: '#FFFFFF',
        textSecondary: '#98989D',
        textTertiary: '#48484A',

        // Glow effects
        glow: 'rgba(229, 9, 20, 0.3)',
        glowStrong: 'rgba(229, 9, 20, 0.5)',

        // Borders
        border: 'rgba(255, 255, 255, 0.1)',
        borderHover: 'rgba(255, 255, 255, 0.2)',

        preview: '#000000',
    },

    white: {
        id: 'white',
        name: 'White Mode',
        description: 'Clean & Bright',

        // Red Theme Colors for Light Mode
        primary: '#E50914', // Netflix Red
        primaryDark: '#B20710',
        primaryLight: '#F40612',

        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F2F2F7 100%)',

        // Backgrounds
        background: '#FFFFFF',
        backgroundLight: '#F2F2F7',
        backgroundElevated: '#E5E5EA',

        // Text colors
        textPrimary: '#000000',
        textSecondary: '#3C3C43',
        textTertiary: '#8E8E93',

        // Glow effects
        glow: 'rgba(229, 9, 20, 0.2)',
        glowStrong: 'rgba(229, 9, 20, 0.4)',

        // Borders
        border: 'rgba(0, 0, 0, 0.1)',
        borderHover: 'rgba(0, 0, 0, 0.2)',

        preview: '#FFFFFF',
    }
};

export const applyTheme = (themeId = 'black') => {
    const theme = themes[themeId] || themes.black;
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-dark', theme.primaryDark);
    root.style.setProperty('--theme-primary-light', theme.primaryLight);
    root.style.setProperty('--theme-gradient', theme.gradient);
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-glow-strong', theme.glowStrong);
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-background-light', theme.backgroundLight);
    root.style.setProperty('--theme-background-elevated', theme.backgroundElevated);
    root.style.setProperty('--theme-text-primary', theme.textPrimary);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-text-tertiary', theme.textTertiary);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-border-hover', theme.borderHover);

    // Apply background to body
    document.body.style.background = theme.background;
    document.body.style.color = theme.textPrimary;

    return theme;
};

export default themes;
