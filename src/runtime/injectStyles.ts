const injectedTargets = new WeakMap<Node, Set<string>>()

export function injectStyles(
  target: ShadowRoot | Document,
  id: string,
  css: string,
) {
  let ids = injectedTargets.get(target)

  if (!ids) {
    ids = new Set<string>()
    injectedTargets.set(target, ids)
  }

  if (ids.has(id)) {
    return
  }

  const style = document.createElement('style')
  style.dataset.crossSellStyle = id
  style.textContent = css

  if (target instanceof ShadowRoot) {
    target.prepend(style)
  } else {
    target.head.appendChild(style)
  }

  ids.add(id)
}
