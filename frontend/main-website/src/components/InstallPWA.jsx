import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
  };

  if (!supportsPWA) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-light rounded-full text-sm font-bold transition-all shadow-lg active:scale-95 group"
      title="Install Himilo App"
    >
      <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Install App</span>
    </button>
  );
};

export default InstallPWA;
