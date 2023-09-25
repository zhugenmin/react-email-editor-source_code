import zh from "./zh";
import en from "./en";
import { useContext } from "react";
import { GlobalContext } from "../reducers";

const useTranslation = () => {
  const { language, languageLibraries } = useContext(GlobalContext);
  let langLibraries = { zh, en };

  if (languageLibraries) {
    langLibraries = {
      ...langLibraries,
      ...languageLibraries,
      zh: {
        ...zh,
        ...(langLibraries["zh"] || {}),
      },
      en: {
        ...en,
        ...(langLibraries["en"] || {}),
      },
    };
  }

  const t = (key, metaTag) => {
    const langLibrary = langLibraries[language] || {};
    let translation = langLibrary[key];
    if (metaTag && metaTag instanceof Object) {
      Object.keys(metaTag).forEach((key) => {
        translation = translation.replace(`{{${key}}}`, metaTag[key]);
      });
    }
    return translation || key;
  };

  return { t };
};

export default useTranslation;
