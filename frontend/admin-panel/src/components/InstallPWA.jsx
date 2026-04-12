import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

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
      className="flex items-center gap-2 px-4 py-2 bg-admin-accent/10 text-admin-accent hover:bg-admin-accent hover:text-white rounded-full text-sm font-bold transition-all shadow-sm active:scale-95 border border-admin-accent/20"
      title="Install App"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};

export default InstallPWA;
