import { useState, useRef, useCallback, useEffect } from "react";

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const speechSynth = useRef(null);
  const utteranceRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        speechSynth.current = window.speechSynthesis;
        const availableVoices = speechSynth.current.getVoices();
        setVoices(availableVoices);
      }
    };

    loadVoices();

    // Some browsers load voices asynchronously
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynth.current) {
        speechSynth.current.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text) => {
      if (!text) {
        console.warn("No text provided for speech");
        return;
      }

      if (!("speechSynthesis" in window)) {
        alert(
          "Text-to-speech is not supported in your browser. Please try Chrome, Safari, or Edge."
        );
        return;
      }

      // Stop any ongoing speech
      if (isSpeaking) {
        stop();
        return;
      }

      speechSynth.current = window.speechSynthesis;
      speechSynth.current.cancel();

      utteranceRef.current = new SpeechSynthesisUtterance(text);

      // Configure voice options for better clarity
      utteranceRef.current.rate = 0.9; // Slower speed for comprehension
      utteranceRef.current.pitch = 1;
      utteranceRef.current.volume = 1;

      // Try to find a pleasant voice
      const availableVoices = speechSynth.current.getVoices();
      const preferredVoice =
        availableVoices.find(
          (voice) =>
            voice.lang.includes("en") &&
            (voice.name.includes("Female") ||
              voice.name.includes("Samantha") ||
              voice.name.includes("Karen"))
        ) || availableVoices[0];

      if (preferredVoice) {
        utteranceRef.current.voice = preferredVoice;
      }

      // Event handlers
      utteranceRef.current.onstart = () => setIsSpeaking(true);
      utteranceRef.current.onend = () => setIsSpeaking(false);
      utteranceRef.current.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      speechSynth.current.speak(utteranceRef.current);
    },
    [isSpeaking]
  );

  const stop = useCallback(() => {
    if (speechSynth.current) {
      speechSynth.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, voices };
};
