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
    <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom duration-500 max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">
            {offlineReady ? 'App is ready to work offline' : 'New version available!'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {offlineReady ? 'You can access the admin panel without internet.' : 'Click reload to update the app with the latest features.'}
          </p>
        </div>
        <button onClick={close} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>
      {needUpdate && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-admin-accent text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reload & Update
        </button>
      )}
    </div>
  )
}

export default ReloadPrompt
