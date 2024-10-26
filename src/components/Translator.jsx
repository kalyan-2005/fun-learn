"use client";
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.querySelector("#google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    const initGoogleTranslate = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,te,ta",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    window.googleTranslateElementInit = initGoogleTranslate;
    addGoogleTranslateScript();

    return () => {
      delete window.googleTranslateElementInit;
      const script = document.querySelector("#google-translate-script");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ position: "absolute", top: "10px", right: "10px",display:"none"}}
      className="z-50"
    ></div>
  );
}