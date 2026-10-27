/**
 * The CASi Room — Lively pilot.
 * A standing, independently-readable view of the current Diagnostic scores,
 * the Killer Insight reasoning in progress, and the human-challenge log.
 *
 * IMPORTANT: this file ships through a git repo used by the app's
 * "Install from Git" installer and may end up readable beyond this one
 * machine. The repo is currently public, so the data below is included
 * deliberately and knowingly, not by accident. Before adding anything more
 * sensitive than quarterly diagnostic scores/evidence already referenced
 * in client-facing materials, re-check the repo's visibility and privacy
 * posture first (see the CASi Core build task on proper private-repo auth).
 *
 * This is a MANUALLY REFRESHED SNAPSHOT, not a live feed — regenerated
 * from casi-state.json on 2026-10-27 and pushed by hand. It will not
 * auto-update; re-run this refresh (or build the proper runtime fetch via
 * a backend plugin + host.request) when the vault state changes again.
 *
 * $HERMES_HOME/desktop-plugins/casi-room/plugin.js (lively profile)
 */
import { atom, cn, host, useValue } from '@hermes/plugin-sdk'
import { ROUTES_AREA, SIDEBAR_NAV_AREA } from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'casi-room'
const activeTab = atom('diagnostic')

// --- Snapshot, manually refreshed from the real vault file. ---
// Source: 6. Clients/Lively - Mike White/casi-state/casi-state.json
// (schema_version 0.2, last_updated 2026-10-23, diagnostic date 2026-10-05,
// re-read and regenerated 2026-10-27 — unchanged since the 23rd).
const SNAPSHOT = {
  client: 'Lively Worldwide LLC',
  asOf: '2026-10-23 (Diagnostic dated 2026-10-05; refreshed into this view 2026-10-27)',
  composites: [
    { name: 'Awareness & Clarity', score: 59, band: 'Amber', note: 'Buyers who find you generally understand you. Flagged thin: more than a third of its scored rules rest on Tier 1 evidence.' },
    { name: 'Proof & Trust', score: 60, band: 'Amber', note: 'The evidence you have earned is reasonably credible.' },
    { name: 'Marketing Cadence', score: 51, band: 'Amber', note: 'The weakest of the three. Named bottleneck: R10/R22 (distribution/findability), both Red, both gate-bearing.' }
  ],
  redRules: [
    { id: 'R10', name: 'Distribution & Demand Allocation', score: 38, evidence: 'Absent from generic buyer-intent search (8 Jul Search Diagnostic); 14 of 15 LinkedIn posts carried no on-platform next step (8 Jul LinkedIn Adaptation Report).' },
    { id: 'R22', name: 'Engage Media & Physical Availability', score: 38, evidence: 'Same two-source evidence as R10 \u2014 the findability/physical-availability construct specifically. Gate-bearing; binds the Marketing Cadence composite.' },
    { id: 'R23a', name: 'Connect: Owned Audience', score: 35, evidence: 'The one 100%-owned channel (iamcasi Circle / newsletter) has never published Issue 1, open since May 2026 \u2014 flagged repeatedly as the single highest-leverage unlock still not shipped.' }
  ],
  constraintClaim: 'The business currently finds every real opportunity through two personal relationships (Tim Bradley, Tom Venable) and has never shipped the one channel it would fully own (the iamcasi Circle newsletter, Issue 1, open since May). Distribution/findability (R10, R22, both Red, both gate-bearing) is the structural constraint, independently corroborated \u2014 not the message.',
  audienceClaim: 'Every real deal closed so far happened because a named person vouched for Lively directly \u2014 Grain Miller 100% via Tim Bradley/Vistage, Revelations via personal/family network \u2014 not because anyone found Lively on their own.',
  tension: 'The plan to fix distribution was "ship a newsletter." Nothing in the evidence says a generic newsletter reproduces what has actually worked \u2014 named-person trust.',
  gates: [
    { name: 'Tension test', result: 'PASS', detail: 'Confronts the "ship it and distribution is fixed" assumption directly.' },
    { name: 'Permission to play', result: 'PASS', detail: 'R7 = 66/Amber, Tier 3 \u2014 Lori McCreary ("I need you to give me clarity and direction and keep me focussed") + Deeps Ramanathan evidence the offer works once introduced.' },
    { name: 'Relevance', result: 'PASS', detail: 'Pipeline evidence (Grain Miller, Revelations) and the 21 May Vistage session (9 CEOs, 100% recommendation, directly produced 4 of 8 live pipeline names) both originate the same way.' }
  ],
  lockStatus: 'NOT LOCKED \u2014 Lock 2 (Killer Insight). Trigger check: Priority 2 governs (Distribution Blocking Awareness: R22 Red AND Awareness&Clarity Amber); Priority 5 present but secondary (R10 Red AND Proof&Trust Amber).',
  openQuestions: [
    'Is the iamcasi Circle newsletter the same initiative as the Mighty Networks community, or two separate things?',
    'Does the Lively website itself \u2014 reframed as a trust hub, not a brochure \u2014 satisfy Rule 23a (Connect) better than a third-party community platform?',
    'From the live file\u2019s own open items: commission structure (15/10/5 step-down) \u2014 internal only or client-facing? (OI-003, open since 21 Sep)',
    'From the live file\u2019s own open items: does Revelations count toward the Q3/D44 target given its commercial-model exception? (OI-004, open since 18 Aug)'
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
        children: 'Manually refreshed snapshot, not a live feed \u2014 regenerated from casi-state.json on 2026-10-27.'
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
