import React, { useState } from 'react';
import { Language } from './types';
import { ProfessionalPortfolio } from './components/ProfessionalPortfolio';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  return <ProfessionalPortfolio language={language} onLanguageChange={setLanguage} />;
}

export default App;
