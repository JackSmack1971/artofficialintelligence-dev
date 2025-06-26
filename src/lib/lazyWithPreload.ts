import React from 'react'

export interface Preloadable<T extends React.ComponentType<unknown>>
  extends React.LazyExoticComponent<T> {
  preload: () => Promise<{ default: T }>
}

export function lazyWithPreload<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
): Preloadable<T> {
  const Component = React.lazy(factory) as Preloadable<T>
  Component.preload = factory
  return Component
}
