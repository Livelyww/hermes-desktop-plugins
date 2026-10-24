/**
 * The CASi Room — Lively pilot.
 * A standing, independently-readable view of the current Diagnostic scores,
 * the Killer Insight reasoning in progress, and the human-challenge log.
 * Nothing here is a summary written by the agent for the operator to trust —
 * every figure traces to a real evidence line in the vault, and that source
 * is named next to it.
 *
 * $HERMES_HOME/desktop-plugins/casi-room/plugin.js (lively profile)
 */
import { atom, cn, host, useValue } from '@hermes/plugin-sdk'
import { ROUTES_AREA, SIDEBAR_NAV_AREA } from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'casi-room'
const activeTab = atom('diagnostic')

// --- Snapshot. Refresh this block after every live re-score / new evidence. ---
// Source: 6. Clients/Lively - Mike White/casi-state/casi-state.json (last_updated 2026-10-23)
//         and CASi_Decision_Package_2026-10-09.md (updated 14 Oct 2026)
const SNAPSHOT = {
  client: 'Lively Worldwide LLC',
  asOf: '2026-10-23',
  composites: [
    { name: 'Awareness & Clarity', score: 59, band: 'Amber', note: 'Buyers who find you generally understand you.' },
    { name: 'Proof & Trust', score: 60, band: 'Amber', note: 'The evidence you have earned is reasonably credible.' },
    { name: 'Marketing Cadence', score: 51, band: 'Amber', note: 'The weakest of the three, and the one driving the Insight.' }
  ],
  redRules: [
    { id: 'R10', name: 'Distribution & Demand Allocation', score: 38, evidence: 'Absent from generic buyer-intent search; 14 of 15 LinkedIn posts gave no next step.' },
    { id: 'R22', name: 'Engage Media & Physical Availability', score: 38, evidence: 'Same two-source evidence as R10 \u2014 the findability construct specifically.' },
    { id: 'R23a', name: 'Connect: Owned Audience', score: 35, evidence: 'The one fully-owned channel has never published Issue 1, open since May 2026.' }
  ],
  constraintClaim: 'The only channel built to reach anyone beyond two personal relationships has never shipped.',
  audienceClaim: 'Every real deal closed so far happened because a named person vouched for Lively directly \u2014 not because anyone found Lively on their own.',
  tension: 'The plan to fix distribution was "ship a newsletter." Nothing in the evidence says a generic newsletter reproduces what has actually worked \u2014 named-person trust.',
  gates: [
    { name: 'Tension test', result: 'PASS', detail: 'Confronts the "ship it and distribution is fixed" assumption directly.' },
    { name: 'Permission to play', result: 'PASS', detail: 'R7 = 66/Amber, Tier 3 \u2014 Lori McCreary + Deeps Ramanathan evidence the offer works once introduced.' },
    { name: 'Relevance', result: 'PASS', detail: '4 of 4 live deals originated the same way; named-person posts outperform generic ones roughly 10x.' }
  ],
  lockStatus: 'NOT LOCKED \u2014 Lock 2 (Killer Insight), open since 14 Oct 2026.',
  openQuestions: [
    'Is the iamcasi Circle newsletter the same initiative as the Mighty Networks community, or two separate things?',
    'Does the Lively website itself \u2014 reframed as a trust hub, not a brochure \u2014 satisfy Rule 23a (Connect) better than a third-party community platform?'
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
        children: `As of ${SNAPSHOT.asOf}. Same evidence Hermes reads live from the vault \u2014 nothing here is invented for this view.`
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
