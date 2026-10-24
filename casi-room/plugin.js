/**
 * The CASi Room — Lively pilot.
 * A standing, independently-readable view of the current Diagnostic scores,
 * the Killer Insight reasoning in progress, and the human-challenge log.
 *
 * SECURITY NOTE: this file ships through a git repo used by the app's
 * "Install from Git" installer and may end up readable beyond this one
 * machine. It therefore carries PLACEHOLDER data only — never hardcode
 * real client scores, quotes, or evidence into this file. The real numbers
 * live only in the vault / casi-state.json and should be wired in at
 * runtime via host.request, not baked into shipped source.
 *
 * $HERMES_HOME/desktop-plugins/casi-room/plugin.js (lively profile)
 */
import { atom, cn, host, useValue } from '@hermes/plugin-sdk'
import { ROUTES_AREA, SIDEBAR_NAV_AREA } from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'casi-room'
const activeTab = atom('diagnostic')

// --- Placeholder only. Real data is not shipped in this file — see the
// security note above. Wire this up to a live read of the vault/
// casi-state.json via host.request before relying on it for real work. ---
const SNAPSHOT = {
  client: 'Lively Worldwide LLC',
  asOf: 'placeholder — not live data',
  composites: [
    { name: 'Awareness & Clarity', score: 0, band: '—', note: 'Placeholder — connect to live scoring.' },
    { name: 'Proof & Trust', score: 0, band: '—', note: 'Placeholder — connect to live scoring.' },
    { name: 'Marketing Cadence', score: 0, band: '—', note: 'Placeholder — connect to live scoring.' }
  ],
  redRules: [
    { id: '—', name: 'Placeholder rule', score: 0, evidence: 'Connect this view to live data before use.' }
  ],
  constraintClaim: 'Placeholder — not wired to live reasoning yet.',
  audienceClaim: 'Placeholder — not wired to live reasoning yet.',
  tension: 'Placeholder — not wired to live reasoning yet.',
  gates: [
    { name: 'Tension test', result: '—', detail: 'Placeholder.' },
    { name: 'Permission to play', result: '—', detail: 'Placeholder.' },
    { name: 'Relevance', result: '—', detail: 'Placeholder.' }
  ],
  lockStatus: 'Placeholder page \u2014 connect to live casi-state.json before trusting this view.',
  openQuestions: [
    'This page ships generic placeholder content for repo-safety reasons; wire it to live data before relying on it.'
  ]
}

function Section({ title, children }) {
  return jsxs('div', {
    className: 'mb-5',
    children: [
      jsx('div', {
        className: 'mb-2 text-xs font-semibold uppercase tracking-wide',
        style: { color: 'var(--ui-text-quaternary)' },
        children: title
      }),
      children
    ]
  })
}

function Card({ children }) {
  return jsx('div', {
    className: 'rounded-lg px-3 py-2',
    style: { border: '1px solid var(--ui-stroke-secondary)' },
    children
  })
}

function TabButton({ id, label }) {
  const current = useValue(activeTab)
  const isActive = current === id
  return jsx('button', {
    type: 'button',
    onClick: () => activeTab.set(id),
    className: cn('rounded-md px-3 py-1.5 text-sm transition-colors', isActive && 'font-medium'),
    style: {
      color: isActive ? 'var(--foreground)' : 'var(--ui-text-tertiary)',
      background: isActive ? 'var(--ui-stroke-secondary)' : 'transparent'
    },
    children: label
  })
}

function DiagnosticTab() {
  return jsxs('div', {
    children: [
      jsx(Section, {
        title: 'Composite scores',
        children: jsx('div', {
          className: 'grid gap-2',
          children: SNAPSHOT.composites.map(c => jsx(Card, {
            key: c.name,
            children: jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                jsxs('div', {
                  children: [
                    jsx('div', { className: 'text-sm font-medium', children: c.name }),
                    jsx('div', { className: 'text-xs', style: { color: 'var(--ui-text-tertiary)' }, children: c.note })
                  ]
                }),
                jsxs('div', {
                  className: 'text-sm font-semibold',
                  style: { color: 'var(--ui-accent)' },
                  children: [c.score, '/100 \u2014 ', c.band]
                })
              ]
            })
          }))
        })
      }),
      jsx(Section, {
        title: 'What is actually broken right now',
        children: jsx('div', {
          className: 'grid gap-2',
          children: SNAPSHOT.redRules.map(r => jsx(Card, {
            key: r.id,
            children: jsxs('div', {
              children: [
                jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    jsx('div', { className: 'text-sm font-medium', children: `${r.id} \u2014 ${r.name}` }),
                    jsx('span', { className: 'text-sm font-semibold', style: { color: 'var(--ui-accent)' }, children: `${r.score}/100` })
                  ]
                }),
                jsx('div', { className: 'mt-1 text-xs', style: { color: 'var(--ui-text-tertiary)' }, children: r.evidence })
              ]
            })
          }))
        })
      })
    ]
  })
}

function KillerInsightTab() {
  return jsxs('div', {
    children: [
      jsx(Section, { title: 'Status', children: jsx('div', { className: 'text-sm font-medium', style: { color: 'var(--ui-accent)' }, children: SNAPSHOT.lockStatus }) }),
      jsx(Section, { title: "What's broken (Constraint Claim)", children: jsx('p', { className: 'text-sm', children: SNAPSHOT.constraintClaim }) }),
      jsx(Section, { title: 'Who actually converts, and why (Audience Claim)', children: jsx('p', { className: 'text-sm', children: SNAPSHOT.audienceClaim }) }),
      jsx(Section, { title: 'The tension', children: jsx('p', { className: 'text-sm', children: SNAPSHOT.tension }) }),
      jsx(Section, {
        title: 'Evidence checks',
        children: jsx('div', {
          className: 'grid gap-2',
          children: SNAPSHOT.gates.map(g => jsx(Card, {
            key: g.name,
            children: jsxs('div', {
              children: [
                jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    jsx('div', { className: 'text-sm font-medium', children: g.name }),
                    jsx('span', { className: 'text-xs font-semibold uppercase', style: { color: 'var(--ui-accent)' }, children: g.result })
                  ]
                }),
                jsx('div', { className: 'mt-1 text-xs', style: { color: 'var(--ui-text-tertiary)' }, children: g.detail })
              ]
            })
          }))
        })
      }),
      jsx(Section, {
        title: 'Open \u2014 needs Mike',
        children: jsx('div', {
          className: 'grid gap-1',
          children: SNAPSHOT.openQuestions.map((q, i) => jsx('p', { key: i, className: 'text-sm', style: { color: 'var(--ui-text-secondary)' }, children: `\u2022 ${q}` }))
        })
      })
    ]
  })
}

function ChallengeLogTab() {
  return jsx('div', {
    className: 'flex h-40 items-center justify-center px-6 text-center text-sm',
    style: { color: 'var(--ui-text-tertiary)' },
    children: 'No entries yet. Every time you add something the data alone did not show, it gets logged here: what was in the data, what you added, and what changed as a result.'
  })
}

function CasiRoomPage() {
  const tab = useValue(activeTab)
  return jsxs('div', {
    className: 'mx-auto max-w-2xl p-6',
    children: [
      jsxs('div', {
        className: 'mb-1 text-lg font-semibold',
        children: ['The CASi Room', jsx('span', { className: 'ml-2 text-sm font-normal', style: { color: 'var(--ui-text-tertiary)' }, children: ` \u2014 ${SNAPSHOT.client}` })]
      }),
      jsx('div', {
        className: 'mb-4 text-xs',
        style: { color: 'var(--ui-text-quaternary)' },
        children: 'Placeholder build \u2014 shipped without real client data for repo-safety. Wire to live vault data before use.'
      }),
      jsxs('div', {
        className: 'mb-4 flex gap-1',
        children: [
          jsx(TabButton, { id: 'diagnostic', label: 'Diagnostic' }),
          jsx(TabButton, { id: 'insight', label: 'Killer Insight' }),
          jsx(TabButton, { id: 'log', label: 'Challenge Log' })
        ]
      }),
      tab === 'diagnostic' && jsx(DiagnosticTab, {}),
      tab === 'insight' && jsx(KillerInsightTab, {}),
      tab === 'log' && jsx(ChallengeLogTab, {})
    ]
  })
}

export default {
  id: ID,
  name: 'The CASi Room',
  register(ctx) {
    ctx.register({
      id: 'page',
      area: ROUTES_AREA,
      data: { path: '/casi-room' },
      render: () => jsx(CasiRoomPage, {})
    })
    ctx.register({
      id: 'nav',
      area: SIDEBAR_NAV_AREA,
      data: { path: '/casi-room', label: 'CASi Room \u2014 Lively', codicon: 'project' }
    })
  }
}
