const fs = require('fs');
let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const oldFunc = unction updateUILanguage() {
    const activeLangBtn = document.querySelector('.lang-option.active');
    if (activeLangBtn) {
        const activeLang = activeLangBtn.getAttribute('data-lang');
        if (activeLang === 'pt-BR' || activeLang === 'en') {
            currentLanguage = activeLang;
        }
    }

    const audioBtn = document.getElementById('audioReaderBtn');;

const newFunc = unction updateUILanguage() {
    const activeLangBtn = document.querySelector('.lang-option.active');
    if (activeLangBtn) {
        const activeLang = activeLangBtn.getAttribute('data-lang');
        if (activeLang === 'pt-BR' || activeLang === 'en') {
            currentLanguage = activeLang;
        }
    }

    // Auto translate via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = typeof t === 'function' ? t(key) : (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]);
        if (translated && translated !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = translated;
                } else if (el.type === 'button' || el.type === 'submit') {
                    el.value = translated;
                }
            } else {
                el.textContent = translated;
            }
        }
    });

    const audioBtn = document.getElementById('audioReaderBtn');;

js = js.replace(oldFunc, newFunc);
fs.writeFileSync('assets/js/model-app.js', js);
