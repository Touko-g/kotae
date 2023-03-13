import {createI18n} from 'vue-i18n'
import cn from "@/locales/cn";
import en from "@/locales/en";
const i18n = createI18n({
    locale: 'en',
    allowComposition: true, // you need to specify that!
    messages: {
        en,
        cn
    }
})

export default i18n