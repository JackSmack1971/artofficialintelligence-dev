/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { offlineFallback } from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

// Versioned cache names using package version
const CACHE_VERSION = '__APP_VERSION__'
const assetsCache = `assets-${CACHE_VERSION}`
const apiCache = `api-${CACHE_VERSION}`

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/'),
  new CacheFirst({ cacheName: assetsCache })
)

registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/api/') || url.pathname.endsWith('/articles.json'),
  new NetworkFirst({ cacheName: apiCache })
)

offlineFallback({ pageFallback: '/offline.html' })

export {}
