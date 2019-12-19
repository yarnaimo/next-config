// https://medium.com/@webmaxru/workbox-4-implementing-refresh-to-update-version-flow-using-the-workbox-window-module-41284967e79c

import { Workbox } from 'workbox-window'

const promptText = 'アップデートが利用できます。更新しますか?'

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const wb = new Workbox(__PWA_SW__, { scope: __PWA_SCOPE__ })

    wb.addEventListener('installed', event => {
        if (!event.isUpdate) {
            console.log('[PWA] service worker installed for first time!')
        } else {
            console.log('[PWA] service worker installed by an update!')

            if (confirm(promptText)) {
                window.location.reload(true)
            }
        }
    })

    wb.addEventListener('activated', event => {
        if (!event.isUpdate) {
            console.log('[PWA] service worker activated for first time!')
        } else {
            console.log('[PWA] service worker activated by an update!')
        }
    })

    wb.addEventListener('waiting', event => {
        console.log(
            '[PWA] a new service worker has installed',
            '[PWA] but it cannot activate until all tabs running the current version have fully unloaded',
        )
    })

    wb.register()
}
