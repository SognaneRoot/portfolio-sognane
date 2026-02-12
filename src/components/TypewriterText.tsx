import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  baseText: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypewriterText({
  words,
  baseText,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (isTyping && !isDeleting) {
        // Mode écriture
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Mot terminé, attendre puis commencer la suppression
          setIsTyping(false);
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else if (isDeleting) {
        // Mode suppression
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Suppression terminée, passer au mot suivant
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setIsTyping(true);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, isTyping, words, typingSpeed, deletingSpeed, pauseDuration]);

  // Animation du curseur clignotant
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {baseText}
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {currentText}
      </span>
      <span 
        className={`inline-block w-0.5 h-[1em] bg-gradient-to-b from-blue-600 to-purple-600 ml-1 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-100`}
        style={{ transform: 'translateY(0.1em)' }}
      />
    </span>
  );
}