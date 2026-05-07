# AGENTS.md

This file gives future Codex sessions the project context needed to work on `cross-sell-components` without rediscovering the architecture from scratch.

## Project Purpose

`cross-sell-components` is an engineer-maintained React component packaging project.

It is not an admin platform. The intended workflow is:

```txt
engineer develops widget/email components
-> engineer runs build/test commands
-> project outputs deliverable files
-> deliver dist files plus examples/docs
```

Primary outputs:

```txt
dist/
  widgets/
    demo-product-banner.wc.js
    demo-product-banner.mount.js
  emails/
    demo-product-offer.html
```

The first version intentionally includes one complete example widget and one complete email template.

## Core Stack

- React + TypeScript
- Vite for widget bundling
- Tailwind CSS for widget styling
- Web Components + Shadow DOM for cross-framework embedding
- Mount API for JS-driven embedding
- React Email for static HTML email output
- Storybook as the component playground
- Vitest + Testing Library for app-level component tests and internal contract tests
- Playwright for browser-only widget behavior tests and built-artifact handoff tests
- pnpm for package management

## Important Architecture

### Source Layers

```txt
src/widgets/
  Pure React widget components.
  These should not know about Web Components, globals, or dist output.

src/runtime/
  Shared runtime helpers for wrapping React components.
  This is where common Web Component and Mount API logic belongs.

src/entries/
  Public output entrypoints.
  These convert a React widget into a specific external integration mode.

src/emails/
  React Email templates and sample data.

examples/
  Plain HTML usage examples that reference dist output.
  These simulate real handoff usage.

stories/
  Storybook playground stories for source React components.
```

### Entries

Each interactive widget currently gets two entries:

```txt
src/entries/<widget>.wc.tsx
src/entries/<widget>.mount.ts
```

They produce:

```txt
dist/widgets/<widget>.wc.js
dist/widgets/<widget>.mount.js
```

The entries are intentionally explicit. Runtime logic is shared in `src/runtime`, but each widget still declares its own external contract:

- custom element tag name
- global Mount API name
- observed attributes
- attribute-to-props mapping
- event names
- event `detail` shape
- fallback/default behavior

Do not prematurely replace this with a registry/codegen system until there are enough widgets to prove the repeated pattern.

Recommended evolution:

```txt
1-2 widgets:
  explicit entries

3+ widgets:
  consider a widget contract registry

5+ widgets:
  consider codegen or registry-driven entry/build generation
```

## Widget Split Guidelines

Use one widget when the external integration contract is the same and only visual state changes.

Examples that should stay as variants of one widget:

- `demo-product-banner` with `layout="compact"`
- `demo-product-banner` with `layout="grid"`
- `demo-product-banner` with `layout="carousel"`

Split into a new widget when consumers need a different public contract.

Examples that should be separate widgets:

- `demo-product-banner`: horizontal promotion/recommendation block
- `product-carousel`: browsable product rail with carousel controls
- `bundle-offer`: bundle purchase card with bundled pricing behavior

Practical split rule:

```txt
If consumers need a different tag name, global API, event name, or payload shape,
make it a separate widget.
```

## Styling and Shadow DOM

Widget CSS lives in:

```txt
src/styles/widget.css
```

Current host rule:

```css
:host {
  display: block;
  font-family: inherit;
}
```

This intentionally allows widgets to inherit the host page font while keeping the rest of the widget style isolated in Shadow DOM.

Tailwind is imported through `@import "tailwindcss";` and then bundled as inline CSS by Vite through `?inline`. Web Component entries inject that CSS into the shadow root. Mount API entries inject it into the document.

Avoid heavy use of Tailwind font-family utilities such as `font-sans` if the goal is to inherit host page fonts. Font weight utilities such as `font-semibold` are fine.

## Web Component Runtime Notes

Web Components are created through:

```txt
src/runtime/createReactWebComponent.tsx
```

The runtime model is:

```txt
custom element connected
-> attachShadow()
-> inject CSS
-> create mount node
-> React createRoot(mountNode)
-> render React component
```

Key implications:

- HTML attributes are strings.
- Complex props should eventually use DOM properties.
- React callbacks must become CustomEvents.
- Events dispatched from Shadow DOM should use `bubbles: true` and `composed: true`.
- React context does not cross the custom element boundary.
- Each custom element instance is its own React root.
- SSR hydration is not part of this runtime and should be a separate entry if needed later.
- Overlay/portal UI needs explicit strategy because many libraries portal to `document.body`.
- Error Boundaries are not yet built in.

More detail:

```txt
docs/react-web-component-considerations.md
```

## Email Compatibility

Email components under `src/emails/` must be designed with Windows Outlook 2108
desktop compatibility as a baseline requirement.

Windows Outlook 2108 is a classic desktop Outlook client and renders HTML email
through Microsoft Word's rendering engine rather than a browser engine. This
means an email can look correct in Outlook Web while breaking badly in Windows
Outlook desktop.

React Email and Tailwind are allowed for email templates, but they do not make
modern CSS automatically Outlook-safe. React Email's Tailwind support primarily
turns supported class names into inline styles. If the resulting CSS property or
HTML structure is unsupported by Outlook desktop, it can still fail.

When changing or adding email components:

- Prefer conservative table-based layout using React Email primitives such as
  `Section`, `Row`, and `Column`.
- Put critical spacing, borders, and backgrounds on table cells or table-backed
  structures instead of relying on modern block/inline layout behavior.
- Set `width` and `height` attributes on email images, not only CSS classes.
- Keep critical CTA/button layout table-based. React Email `Button` renders as an
  `<a>` tag, and Windows Outlook desktop is unreliable with padding, width,
  `inline-block`, and rounded corners on links.
- Treat rounded corners as progressive enhancement. Windows Outlook desktop does
  not reliably support `border-radius`.
- Avoid depending on `flex`, `grid`, `position`, `max-width`, `overflow`,
  `text-overflow`, `truncate`, `line-clamp`, complex selectors, hover styles,
  or modern responsive CSS for core email layout.
- Avoid assuming Tailwind utility output is safe just because it is inline. Check
  the final HTML/CSS against Outlook desktop constraints.
- Prefer data-level text shortening or simpler fixed-column layouts over CSS
  truncation when long text must be constrained.
- If exact Outlook desktop rendering is required for backgrounds, rounded
  buttons, or similar effects, consider Outlook-specific conditional comments or
  VML. Keep these hacks isolated and documented near the component using them.

Recommended email validation after email template changes:

```bash
pnpm build:emails
pnpm typecheck
```

For visual compatibility, also manually inspect the generated HTML in Windows
Outlook 2108 desktop when the change affects layout, buttons, images, or spacing.

## Testing Taxonomy

Tests are split into two high-level responsibilities: app tests and internal tests.

### App Tests

App tests protect the behavior of developed widgets, email components, and shared
UI logic so future changes do not break the intended component behavior.

Use app tests for:

- component render output
- callback payloads and public component props
- deterministic logic such as countdowns, formatting, and expired/active states
- browser-only widget behavior such as real layout, overflow, keyboard operation,
  responsive exposure, and carousel movement

App test locations:

```txt
src/**/*.test.tsx
src/**/*.test.ts
tests/playwright/app/
```

Prefer Vitest under `src/` when jsdom is enough. Use Testing Library and user-event
for component behavior such as visible text, ARIA labels, buttons, callbacks, and
state transitions.

Use Playwright under `tests/playwright/app/` only when the behavior depends on a
real browser. Examples include `getBoundingClientRect()`, flex/grid layout, real
CSS overflow, responsive viewport behavior, keyboard focus behavior, or a library
such as Embla that relies on browser layout.

Do not put app-level widget behavior tests under internal handoff tests.

### Internal Tests

Internal tests protect project mechanics and delivery contracts rather than a
specific widget's product behavior.

Use internal tests for:

- runtime markers and shared runtime contracts
- email renderer or build helper contracts
- built `dist/` artifacts loading from `examples/`
- Web Component and Mount API handoff behavior
- external integration contracts such as tag names, globals, custom events, and
  example pages

Internal test locations:

```txt
tests/vitest/internal/contracts/
tests/playwright/internal/handoff/
```

Internal test folders are organized by runner first, then responsibility. Vitest
contract tests should stay in `tests/vitest/internal/contracts/`. Playwright
handoff tests should stay in `tests/playwright/internal/handoff/`.

Do not add detailed widget layout, carousel, or visual interaction assertions to
handoff tests. Handoff tests should verify that the built example can be consumed
as delivered.

### Vitest Setup

Vitest runs in jsdom and uses:

```txt
tests/setup.ts
```

This setup may provide missing browser APIs required by component tests. For
example, Embla/shadcn Carousel needs `ResizeObserver` and `IntersectionObserver`
mocks when rendered in jsdom. Keep these mocks minimal and only add APIs needed by
source-level tests.

## Internal Handoff Testing Design

Playwright internal handoff tests intentionally do not use Vite dev server.

Reason: Vite dev server transforms served JS and may inject React Refresh/HMR code. That broke the original attempt to serve already-built `dist/*.js` files, causing errors like:

```txt
$RefreshSig$ is not defined
```

This project instead uses a very small static server:

```txt
scripts/serve-static.mjs
```

Playwright serves plain files exactly like a real handoff page:

```txt
examples/{web-component,mount-api}/*.html
-> script src="../../dist/widgets/*.js"
```

This is intentional. Do not switch Playwright back to Vite dev server unless the test target changes away from built `dist` artifacts.

## Storybook Role

Storybook is currently a playground only.

It is used to inspect source React component states:

```txt
stories/demos/DemoProductBanner.stories.tsx
```

Storybook tests are intentionally deferred to phase two. Do not add Storybook Vitest addon unless asked or unless the project has enough stories to justify making stories executable tests.

Future role:

```txt
Storybook = visual/component playground
Storybook tests = protect playground states
App Vitest = component logic and deterministic behavior tests
App Playwright = browser-only widget behavior tests
Internal Vitest = project contract tests
Internal Playwright = dist/examples handoff tests
```

## Commands

Install:

```bash
pnpm install
```

Develop Storybook:

```bash
pnpm dev
```

Build deliverables:

```bash
pnpm build
```

Build Storybook static site:

```bash
pnpm build:storybook
```

Serve examples and dist through the static server:

```bash
pnpm serve:examples
```

Run app unit/component tests:

```bash
pnpm test:app:unit
```

Run app browser widget tests:

```bash
pnpm test:app:widgets
```

Run all app tests:

```bash
pnpm test:app
```

Run internal project contract tests:

```bash
pnpm test:internal:contracts
```

Run internal handoff tests:

```bash
pnpm test:internal:handoff
```

Run all internal tests:

```bash
pnpm test:internal
```

Run all tests:

```bash
pnpm test:all
```

## Verification Status

At initial scaffold completion, these passed:

```txt
pnpm build
pnpm test:app:unit
pnpm test:internal:handoff
pnpm test:all
pnpm build:storybook
```

## Validation Policy

By default, Codex should not proactively run validation, build, test, or
formatter commands after making changes. Instead, Codex should tell the user
which validation commands are recommended for the change and what each command
checks.

Only run validation/build/test commands when the user explicitly asks Codex to
run them, for example "run tests", "run build", "verify it", or names a
specific command.

Recommended validation guidance:

- For email template or email build changes, suggest:

```bash
pnpm build:emails
pnpm typecheck
```

- For widget source, runtime, entrypoint, build, or test configuration changes,
  suggest:

```bash
pnpm test:all
```

- For Storybook config or story changes, suggest:

```bash
pnpm build:storybook
```

## Git Ignore Expectations

Source/config/docs/examples should be committed.

Do commit:

```txt
README.md
AGENTS.md
package.json
pnpm-lock.yaml
tsconfig.json
vite.config.ts
vitest.config.ts
playwright.config.ts
src/
scripts/
stories/
examples/
docs/
.storybook/
tests/
```

Do not commit generated artifacts:

```txt
node_modules/
dist/
storybook-static/
coverage/
test-results/
playwright-report/
```

The project may not yet be initialized as a git repo. Check before using git commands.

## Known Environment Notes

In the Codex sandbox, commands using `tsx` or starting local servers may require escalation because they create IPC pipes or listen on localhost. This is an environment constraint, not a project constraint.

On a normal local terminal, these should work without special handling:

```bash
pnpm build
pnpm test:all
```

Storybook may create or use user-level settings under:

```txt
~/.storybook/settings.json
```

That is a user-level Storybook CLI setting and should not be committed.

## Future Roadmap

Recommended next runtime improvements:

1. Add DOM property support for complex props.
2. Add a widget-level Error Boundary.
3. Add CSS variable theming for primary color, radius, spacing, and font.
4. Define an overlay/portal strategy before adding modal-like UI.
5. Add focus/form integration tests when widgets become more interactive.
6. Add Storybook tests with the Storybook Vitest addon in phase two.

Recommended next project improvements:

1. Add a second widget after the architecture is stable.
2. Revisit entry duplication after at least three widgets exist.
3. Consider a widget registry once repeated contract metadata becomes obvious.
4. Consider codegen only after registry shape stabilizes.
