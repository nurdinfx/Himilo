import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needUpdate: [needUpdate, setNeedUpdate],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedUpdate(false)
  }

  if (!offlineReady && !needUpdate) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] p-5 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col gap-5 animate-in slide-in-from-bottom duration-500 max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-lg font-extrabold text-slate-900 leading-tight">
            {offlineReady ? 'Ready for offline use' : 'Upgrade Himilo Experience'}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            {offlineReady ? 'Enjoy Himilo Hotel even without a connection.' : 'A new refined version is available for your stay.'}
          </p>
        </div>
        <button onClick={close} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      {needUpdate && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95 text-base"
        >
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
          Update Now
        </button>
      )}
    </div>
  )
}

export default ReloadPrompt
