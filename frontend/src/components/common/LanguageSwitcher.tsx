import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cm-border hover:bg-cm-cream transition-colors text-xs font-bold text-cm-text bg-white shadow-xs"
      >
        <Globe size={14} className="text-cm-gold" />
        <span>{currentLanguage.name}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-32 bg-white border border-cm-border rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => toggleLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-cm-cream transition-colors flex items-center justify-between ${i18n.language === lang.code ? 'text-cm-green bg-cm-green/5' : 'text-cm-text'}`}
            >
              <span>{lang.name}</span>
              <span>{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
