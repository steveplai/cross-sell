const injectedTargets = new WeakMap<Node, Set<string>>()
const propertyRulePattern = /@property\s+--[-\w]+\s*\{[^{}]*\}/g

function extractPropertyRules(css: string) {
  return css.match(propertyRulePattern)?.join('\n') ?? ''
}

function injectDocumentPropertyRules(
  document: Document,
  id: string,
  css: string,
) {
  const propertyRules = extractPropertyRules(css)

  if (!propertyRules) {
    return
  }

  const propertyStyleId = `${id}:properties`
  let ids = injectedTargets.get(document)

  if (!ids) {
    ids = new Set<string>()
    injectedTargets.set(document, ids)
  }

  if (ids.has(propertyStyleId)) {
    return
  }

  const style = document.createElement('style')
  style.dataset.crossSellStyle = propertyStyleId
  style.textContent = propertyRules

  document.head.appendChild(style)
  ids.add(propertyStyleId)
}

export function injectStyles(
  target: ShadowRoot | Document,
  id: string,
  css: string,
) {
  if (target instanceof ShadowRoot) {
    injectDocumentPropertyRules(target.ownerDocument, id, css)
  }

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
