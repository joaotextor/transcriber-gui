const fs = require("fs");
const path = require("path");

class LanguageService {
  constructor() {
    this.currentLanguage = "pt";
    this.translations = {};
    this.loadTranslations();
  }

  loadTranslations() {
    const languages = ["en", "pt"];
    languages.forEach((lang) => {
      const filePath = path.join(__dirname, `../locales/${lang}.json`);
      this.translations[lang] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    });
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      return this.translations[lang];
    }
    return null;
  }

  getCurrentTranslations() {
    return this.translations[this.currentLanguage];
  }
}

module.exports = new LanguageService();
