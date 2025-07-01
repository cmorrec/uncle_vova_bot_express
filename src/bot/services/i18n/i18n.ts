import i18next from "i18next";
import ru_translation from "./ru/events.json";

i18next.init({
  resources: {
    ru: {
      translation: ru_translation,
    },
  },
  lng: "ru",
  supportedLngs: ["ru"],
  fallbackLng: "ru",
});

export default i18next;
