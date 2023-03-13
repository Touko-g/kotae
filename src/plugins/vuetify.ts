// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// icons
import {aliases, mdi} from 'vuetify/iconsets/mdi'

// i18n
// Translations provided by Vuetify
import {zhHans, en} from 'vuetify/locale'

// Vuetify
import {createVuetify} from 'vuetify'

export default createVuetify(
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
    {
        display: {
            mobileBreakpoint: 'md'
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            }
        },
        locale: {
            defaultLocale: 'en',
            messages: {zhHans, en}
        },
        theme: {
            defaultTheme: 'ZF',
            themes: {
                light: {
                    colors: {
                        background: '#f6f6f6',
                        surface: '#ffffff',
                        primary: '#2196F3',
                        secondary: '#03DAC6',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    }
                },
                dark: {
                    colors: {
                        background: '#000',
                        surface: '#101010',
                        primary: '#349d17',
                        secondary: '#03DAC6',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    }
                },
                ZF: {
                    colors: {
                        background: '#2f2d2d',
                        surface: '#383535',
                        primary: '#835656',
                        secondary: '#03DAC6',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    }
                },
                GY: {
                    colors: {
                        background: '#000',
                        surface: '#101010',
                        primary: '#00f3eb',
                        secondary: '#03DAC6',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    }
                },
                DC: {
                    colors: {
                        background: '#101010',
                        surface: '#ad878e',
                        primary: '#32b095',
                        secondary: '#03DAC6',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    }
                },
                custom: {
                    colors:{
                        background: '#f6f6f6',
                        surface: '#f6f6f6',
                        primary: '#2196F3',
                        secondary: '#03DAC6',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    }
                }
            }
        }
    },
    components,
    directives,
)
