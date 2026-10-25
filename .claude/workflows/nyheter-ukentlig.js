export const meta = {
  name: 'nyheter-ukentlig',
  description: 'Finn, faktasjekk og skriv ukens viktigste AI-nyheter (én ISO-uke) for NHHS AIs nyhetsside',
  whenToUse: 'Hver fredag, for å lage en ny uke til nyheter-data.js. Args: { today, uke, aar, fra, til, forrigeTitler? }',
  phases: [
    { title: 'Sweep', detail: '7 researchere søker etter ukens AI-nyheter' },
    { title: 'Merge', detail: 'slår sammen duplikater' },
    { title: 'Verify', detail: 'adversarial faktasjekk av hver sak mot kildene' },
    { title: 'Gaps', detail: 'leter etter viktige saker som mangler, og sjekker dem' },
    { title: 'Edit', detail: 'rangerer og skriver norsk tekst' },
    { title: 'Proof', detail: 'faktakonsistens og språkvask' },
  ],
}

// args: { today: 'YYYY-MM-DD', uke: 42, aar: 2026, fra: 'YYYY-MM-DD' (mandag), til: 'YYYY-MM-DD' (siste dag som dekkes), forrigeTitler: ['...'] }
const A = args || {}
if (!A.today || !A.uke || !A.aar || !A.fra || !A.til) throw new Error('Mangler args: { today, uke, aar, fra, til }')
const PREV = Array.isArray(A.forrigeTitler) ? A.forrigeTitler : []

const CONTEXT = `Context: NHHS AI is a student AI interest group at NHH (Norwegian School of Economics, Bergen). It runs a weekly AI news page ("Nyheter") read by business students, professors and people in Norwegian business (finance, consulting, strategy, tech). Today is ${A.today}. Your training knowledge may end before this date, so you MUST rely on live web research for every claim — never report an event from memory, never guess a date, never invent or reconstruct a URL.`
const TOOLS = 'Load the web tools first with ToolSearch query "select:WebSearch,WebFetch". Use WebSearch in mode "standard" (cheap) and only switch to "extended" when standard results are thin or clearly outdated. Use WebFetch to open the articles that matter.'

// Bruk: de fleste agentene kjører på Sonnet. Bare redaktøren (Edit) kjører på Opus.
// MAX_KANDIDATER: bare de høyest rangerte sakene etter sammenslåingen faktasjekkes.
const MAX_KANDIDATER = 24
const PREV_NOTE = PREV.length ? `\nThese stories were already published in earlier weeks — do NOT return them again unless there is a genuinely new development this week:\n${PREV.map((t) => `- ${t}`).join('\n')}\n` : ''

const CATS = ['models', 'business', 'policy', 'norway', 'research', 'tools', 'work']
const CAT_NO = { models: 'Modeller', business: 'Næringsliv', policy: 'Regulering', norway: 'Norge', research: 'Forskning', tools: 'Verktøy', work: 'Arbeidsliv' }

const SOURCE = { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, published: { type: 'string' } }, required: ['name', 'url'] }
const RAW_ITEM = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    date: { type: 'string', description: 'YYYY-MM-DD date of the event/announcement' },
    summary: { type: 'string' },
    category: { type: 'string', enum: CATS },
    sources: { type: 'array', items: SOURCE },
    significance: { type: 'integer', minimum: 1, maximum: 10 },
    audience_relevance: { type: 'integer', minimum: 1, maximum: 10 },
    why_it_matters: { type: 'string' },
  },
  required: ['title', 'date', 'summary', 'category', 'sources', 'significance', 'audience_relevance', 'why_it_matters'],
}
const FINDINGS = { type: 'object', properties: { items: { type: 'array', items: RAW_ITEM } }, required: ['items'] }
const MERGED = {
  type: 'object',
  properties: {
    items: { type: 'array', items: RAW_ITEM },
    dropped: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, reason: { type: 'string' } }, required: ['title', 'reason'] } },
  },
  required: ['items', 'dropped'],
}
const VERDICTS = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          verified: { type: 'boolean' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          event_date: { type: 'string' },
          corrected_title: { type: 'string' },
          corrected_summary: { type: 'string' },
          key_facts: { type: 'array', items: { type: 'string' } },
          best_source: SOURCE,
          other_sources: { type: 'array', items: SOURCE },
          issues: { type: 'string' },
        },
        required: ['id', 'verified', 'confidence', 'event_date', 'corrected_title', 'corrected_summary', 'key_facts', 'best_source', 'issues'],
      },
    },
  },
  required: ['results'],
}
const STORY = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    nivaa: { type: 'string', enum: ['hovedsak', 'topp', 'kort'] },
    tittel: { type: 'string' },
    ingress: { type: 'string' },
    hvorfor: { type: 'string' },
    kategori: { type: 'string', enum: Object.values(CAT_NO) },
    viktighet: { type: 'integer', minimum: 1, maximum: 5 },
    dato: { type: 'string' },
    kilde: { type: 'object', properties: { navn: { type: 'string' }, url: { type: 'string' } }, required: ['navn', 'url'] },
    stikkord: { type: 'array', items: { type: 'string' } },
  },
  required: ['id', 'nivaa', 'tittel', 'ingress', 'hvorfor', 'kategori', 'viktighet', 'dato', 'kilde', 'stikkord'],
}
const WEEK = {
  type: 'object',
  properties: {
    uke: { type: 'integer' },
    fra: { type: 'string' },
    til: { type: 'string' },
    oppsummering: { type: 'string' },
    ukensTall: { type: 'object', properties: { tall: { type: 'string' }, tekst: { type: 'string' }, sakId: { type: 'string' } }, required: ['tall', 'tekst', 'sakId'] },
    saker: { type: 'array', items: STORY },
  },
  required: ['uke', 'fra', 'til', 'oppsummering', 'ukensTall', 'saker'],
}
const PROOFED = { type: 'object', properties: { week: WEEK, changes: { type: 'array', items: { type: 'string' } } }, required: ['week', 'changes'] }

const DOMAINS = [
  { key: 'models', focus: 'Frontier AI models and AI labs: new model releases, major product launches and capability milestones from OpenAI, Anthropic, Google/DeepMind, Meta, xAI, Microsoft, Mistral, DeepSeek, Alibaba/Qwen, Moonshot and others; leadership changes at labs; notable benchmark results.' },
  { key: 'business', focus: 'AI business and markets: funding rounds, valuations, IPOs, M&A, big-tech earnings/capex tied to AI, chips (Nvidia, AMD, TSMC, Broadcom), data-center and energy deals, AI-driven stock market moves, large enterprise AI deals.' },
  { key: 'policy', focus: 'AI policy, regulation and law: EU AI Act implementation and amendments, US federal and state AI policy, China, UK; copyright lawsuits and settlements; antitrust actions; AI safety institutes; international agreements.' },
  { key: 'norway', focus: 'Norway and the Nordics: Norwegian AI news — government (Digitaliseringsdepartementet, KI-Norge, Digdir, statsbudsjettet), Datatilsynet, Norwegian companies (DNB, Equinor, Telenor, Schibsted, Aker, Kongsberg, Cognite, Nscale/Aker "Stargate Norway" in Narvik, etc.), universities (NTNU, UiB, UiO, BI, NHH), Norwegian language models (NorwAI, NB-AiLab), Nordic AI startups (Lovable, Legora, etc.) and Nordic AI investments. Search in Norwegian too ("kunstig intelligens", "KI") and check NRK, E24, DN, Finansavisen, Digi.no, Shifter, Kode24, Khrono.' },
  { key: 'research', focus: 'AI research and science: notable papers and results (reasoning, agents, interpretability, safety, evaluations), AI for science (biology, medicine, materials, mathematics), robotics/embodied AI, and major reports or indices.' },
  { key: 'tools', focus: 'Practical AI tools and product features for students and knowledge workers: new features in ChatGPT, Claude, Gemini, Microsoft Copilot, Perplexity, Notion, Cursor and similar; AI agents and AI browsers; AI in education; enterprise productivity launches.' },
  { key: 'work', focus: 'AI, work, economy and society: labour-market studies, layoffs or hiring changes attributed to AI, AI adoption in finance, consulting, accounting and banking, economic research on AI productivity, major surveys, and notable controversies or incidents (deepfakes, security incidents, misuse, lawsuits against AI products).' },
]

const inWeek = (d) => typeof d === 'string' && d >= A.fra && d <= A.til

phase('Sweep')
const sweeps = await parallel(DOMAINS.map((d) => () => agent(
  `${CONTEXT}

Task: find the most important REAL AI news in this focus area with event dates between ${A.fra} and ${A.til} (inclusive; this is the edition for ISO week ${A.uke} of ${A.aar}).
Focus area: ${d.focus}
${PREV_NOTE}
${TOOLS}
Method: run about 6-10 focused searches (by company, by topic, with date terms). Open only the articles that matter to confirm date and facts. Prefer primary sources and reputable outlets.
Rules:
- Only include events whose announcement/occurrence date is inside the window.
- Every item needs at least one source URL you actually saw.
- Facts only: names, numbers, dates.
- Return 4-8 items, most significant first. Quality over quantity.
- Set category to "${d.key}" unless another category clearly fits better.`,
  { label: `sweep:${d.key}`, phase: 'Sweep', schema: FINDINGS, model: 'sonnet' },
)))
const raw = sweeps.filter(Boolean).flatMap((s) => s.items)
log(`Sweep: ${raw.length} kandidater fra ${sweeps.filter(Boolean).length}/${DOMAINS.length} researchere`)

phase('Merge')
const merged = await agent(
  `You are merging AI-news candidates gathered by several researchers for a weekly news page. Window ${A.fra} .. ${A.til}.
1. Merge items that describe the same event: keep the most precise facts, union the sources, keep the highest scores, keep the earliest credible date.
2. Drop items outside the window, opinion pieces without a news event, trivial items (significance <= 2 and audience_relevance <= 3), and repeats of these earlier stories unless there is a genuinely new development: ${PREV.join(' | ') || '(none)'}. List every dropped item with a reason.
3. Do not add new facts. Do not change URLs.
4. Return ALL remaining items. Do not truncate or keep only a "top N" — ranking happens later.

Candidates (JSON):
${JSON.stringify(raw)}`,
  { label: 'merge', phase: 'Merge', schema: MERGED, model: 'sonnet' },
)
if (!merged) throw new Error('Merge-agenten returnerte ingenting — kjør workflowen på nytt (resume)')
let mergedItems = merged.items
// Sikkerhetsnett: forklarer ikke merge-steget hvor sakene ble av, hentes de manglende tilbake.
if (mergedItems.length + merged.dropped.length < raw.length * 0.6) {
  log(`Merge ga ${mergedItems.length} saker og ${merged.dropped.length} begrunnede kutt av ${raw.length} — henter tilbake det som mangler`)
  const recovered = await agent(
    `You are auditing a merge step for a weekly AI-news page (window ${A.fra} .. ${A.til}). The merge kept list A but silently dropped raw items without a reason.
From the raw candidates in B, return EVERY distinct news event NOT already covered by A (merge duplicates within B; union sources). Exclude only out-of-window items and opinion pieces, listing them in dropped with a reason. Do not invent facts or change URLs. Do not truncate.

A (kept):
${mergedItems.map((c) => `[${c.date}] ${c.title}`).join('\n')}

B (raw, JSON):
${JSON.stringify(raw)}`,
    { label: 'merge-recover', phase: 'Merge', schema: MERGED, model: 'sonnet' },
  )
  if (recovered) mergedItems = mergedItems.concat(recovered.items)
}
// Bare de mest lovende sakene faktasjekkes (60 % global betydning, 40 % relevans for leserne).
const poeng = (c) => 0.6 * (c.significance || 0) + 0.4 * (c.audience_relevance || 0)
const rangert = mergedItems.slice().sort((a, b) => poeng(b) - poeng(a))
const candidates = rangert.slice(0, MAX_KANDIDATER).map((it, i) => ({ id: `c${String(i + 1).padStart(3, '0')}`, ...it }))
log(`Merge: ${mergedItems.length} unike, ${merged.dropped.length} droppet, ${candidates.length} går videre til faktasjekk`)

const verifyPrompt = (batch) => `${CONTEXT}

You are an adversarial fact-checker. The candidate news items below may contain wrong dates, wrong numbers, conflated events, stale news re-reported as new, or events that never happened. Try to REFUTE each one; only mark it verified if reliable sources confirm it.

${TOOLS}
For EACH item:
1. Open the source URL(s) with WebFetch. If a URL fails or is paywalled, search for the event independently.
2. Confirm the event happened as described, from at least one reliable source.
3. Determine the actual event date (YYYY-MM-DD). If first announced before ${A.fra}, it is stale: verified=false — unless there is a genuinely new development inside the window; then describe only that development and its date.
4. Check every number, name and claim. Write corrected_title and corrected_summary (English, 2-4 sentences) with only confirmed facts; 3-6 key_facts.
5. best_source: the most authoritative confirming URL you actually opened or saw; other confirming URLs in other_sources.
6. If you cannot confirm with reasonable confidence, set verified=false and explain in issues. When in doubt, refute.
Return exactly one result per item, with the same id.

Items:
${JSON.stringify(batch, null, 2)}`

const chunk = (arr, n) => { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out }
const runVerify = async (items, phaseName, labelPrefix) => {
  const batches = chunk(items, 4)
  const res = await parallel(batches.map((b, i) => () => agent(verifyPrompt(b), { label: `${labelPrefix}:${i + 1}/${batches.length}`, phase: phaseName, schema: VERDICTS, model: 'sonnet' })))
  const byId = new Map(items.map((it) => [it.id, it]))
  const out = []
  res.forEach((r, i) => {
    if (!r) { batches[i].forEach((it) => out.push({ ...it, verified: false, issues: 'verifier failed' })); return }
    for (const v of r.results) { const orig = byId.get(v.id); if (orig) out.push({ ...orig, ...v }) }
  })
  const seen = new Set(out.map((o) => o.id))
  const missing = items.filter((it) => !seen.has(it.id))
  if (missing.length) log(`${missing.length} saker ble ikke besvart av faktasjekkeren og regnes som ubekreftet`)
  missing.forEach((it) => out.push({ ...it, verified: false, issues: 'not returned by verifier' }))
  return out
}

phase('Verify')
const checked = await runVerify(candidates, 'Verify', 'verify')
let pool = checked.filter((c) => c.verified && inWeek(c.event_date))
const rejected = checked.filter((c) => !(c.verified && inWeek(c.event_date)))
log(`Verify: ${pool.length} bekreftet, ${rejected.length} avvist`)

phase('Gaps')
const gap = await agent(
  `${CONTEXT}

You are the completeness critic for the week ${A.uke} edition (${A.fra} .. ${A.til}) of the NHHS AI news page. Below are the verified stories already found. Find IMPORTANT AI news from this exact window that is MISSING (major launches, big funding/M&A, regulation milestones, Norwegian/Nordic AI news, major research results, incidents, big moves relevant to finance/consulting/business).
${TOOLS}
Weekly AI newsletters/roundups are a good way to spot gaps, but confirm each story at a primary or reputable source. Only return stories dated within ${A.fra} .. ${A.til} that are not duplicates. Return 0-4 items; an empty list is fine.
${PREV_NOTE}
Already covered:
${pool.map((c) => `- [${c.event_date}] ${c.corrected_title || c.title}`).join('\n') || '(nothing yet)'}`,
  { label: `gaps:uke${A.uke}`, phase: 'Gaps', schema: FINDINGS, model: 'sonnet' },
)
const fresh = (gap?.items || []).map((it, i) => ({ id: `g${String(i + 1).padStart(2, '0')}`, ...it }))
const freshChecked = fresh.length ? await runVerify(fresh, 'Gaps', 'verify-gaps') : []
const added = freshChecked.filter((c) => c.verified && inWeek(c.event_date))
pool = pool.concat(added)
log(`Gaps: ${added.length}/${fresh.length} nye saker bekreftet`)

if (pool.length < 5) throw new Error(`Bare ${pool.length} bekreftede saker — for lite til en utgave. Sjekk journal.jsonl og kjør på nytt.`)

const slim = (c) => ({ id: c.id, title: c.corrected_title || c.title, date: c.event_date, category: c.category, summary: c.corrected_summary, key_facts: c.key_facts, source: c.best_source, other_sources: c.other_sources || [], significance: c.significance, audience_relevance: c.audience_relevance, why_it_matters: c.why_it_matters })
const facts = pool.map(slim)

phase('Edit')
const draft = await agent(
  `Du er redaktør for NHHS AIs ukentlige nyhetsside «Nyheter». NHHS AI er en interessegruppe for kunstig intelligens ved NHH (Norges Handelshøyskole) i Bergen. Leserne er NHH-studenter, professorer og folk i norsk næringsliv. Målet er at de skal få med seg de viktigste AI-nyhetene på få minutter.

Lag uke ${A.uke} (${A.fra} – ${A.til}) basert KUN på de faktasjekkede sakene under. Ikke legg til fakta som ikke står i materialet.

Utvalg og rangering:
- Ranger etter samlet vurdering av global betydning (ca. 60 %) og relevans for leserne (ca. 40 %): forretning, finans, strategi, arbeidsliv, Norge.
- Nøyaktig 1 sak med nivaa "hovedsak", 4 med nivaa "topp", og 6-10 med nivaa "kort". Har du færre gode saker, kutt i "kort". Dropp trivielle eller overlappende saker.
- Rekkefølgen i saker-listen er rangeringen (viktigst først). viktighet: 5 = hovedsak, topp 4-5, korte 1-3.
- Sørg for bredde, og ta med norske/nordiske saker når de finnes.

Skriving (norsk bokmål, nøkternt og presist, egne formuleringer):
- tittel: informativ, maks ca. 80 tegn, setningsstil. Ingen klikkagn.
- ingress: 2-3 setninger (ca. 220-380 tegn) med konkrete fakta.
- hvorfor: 1-2 setninger om hvorfor dette betyr noe for næringsliv, studenter eller norske virksomheter.
- Bruk "AI" (ikke "KI"), men behold egennavn som "KI-Norge". Norsk tallformat: "1,5 milliarder dollar", "40 prosent".
- kategori: én av ${Object.values(CAT_NO).join(', ')}. Sikkerhetshendelser med AI-modeller og AI-agenter går under Modeller; Regulering er for lover, politikk, tilsyn og rettssaker.
- dato: hendelsesdato (YYYY-MM-DD). kilde: {navn, url} fra sakens source. id: behold sakens id.
- stikkord: 2-4 korte stikkord. Gjenbruk eksisterende stikkord med nøyaktig samme skrivemåte når de passer (de brukes til søk på tvers av uker), og ikke bruk kategorinavnene som stikkord. Eksisterende stikkord: ${(Array.isArray(A.stikkord) && A.stikkord.length) ? A.stikkord.join(', ') : '(ingen ennå)'}.
- oppsummering: 2-3 setninger «Uka i korte trekk».
- ukensTall: ett slående tall fra materialet (maks ca. 12 tegn), kort tekst (maks ca. 110 tegn) og sakId.
- uke=${A.uke}, fra="${A.fra}", til="${A.til}".

Faktasjekkede saker (JSON):
${JSON.stringify(facts, null, 2)}`,
  { label: `edit:uke${A.uke}`, phase: 'Edit', schema: WEEK, model: 'opus' },
)
if (!draft) throw new Error('Redaktør-agenten returnerte ingenting — kjør workflowen på nytt (resume)')

phase('Proof')
const proof = await agent(
  `Du er korrekturleser og faktasjekker for NHHS AIs nyhetsside. Under er redaktørens utkast for uke ${A.uke} og de faktasjekkede kildefaktaene (engelsk).

Sjekk hver sak:
1. Fakta: hver påstand, hvert tall og hver dato i tittel, ingress, hvorfor og ukensTall må støttes av kildefaktaene for saken med samme id. Rett eller fjern alt som ikke støttes. "hvorfor" kan inneholde vurderinger, men ikke nye faktapåstander.
2. Språk: naturlig, korrekt bokmål; konsekvent "AI"; norsk tallformat; titler i setningsstil.
3. Form: nøyaktig 1 hovedsak og 4 topp; titler maks ca. 80 tegn; kilde-URL identisk med en URL i kildefaktaene.
4. ukensTall.sakId må peke på en sak i lista, og tallet må stå i kildefaktaene.
Returner den korrigerte uka i week og endringene i changes.

Utkast (JSON):
${JSON.stringify(draft, null, 2)}

Kildefakta (JSON):
${JSON.stringify(facts, null, 2)}`,
  { label: `proof:uke${A.uke}`, phase: 'Proof', schema: PROOFED, model: 'sonnet' },
)

const week = proof && proof.week ? proof.week : draft

// Kodekontroll: hver sak må komme fra en bekreftet sak, og kildelenken må være en av de bekreftede kildene.
const factById = new Map(facts.map((f) => [f.id, f]))
const codeChanges = []
// Sammenlign URL-er uten støy: små bokstaver i vertsnavn, uten #, utm_-parametre og avsluttende skråstrek.
const normUrl = (u) => {
  const m = /^(https?:\/\/)([^/?#]+)([^?#]*)(\?[^#]*)?/i.exec(String(u || '').trim())
  if (!m) return String(u || '').trim()
  const query = (m[4] || '').replace(/^\?/, '').split('&').filter((p) => p && !/^utm_/i.test(p)).join('&')
  return `${m[2].toLowerCase().replace(/^www\./, '')}${m[3].replace(/\/+$/, '')}${query ? `?${query}` : ''}`
}
const saker = (week.saker || []).filter((s) => {
  const f = factById.get(s.id)
  if (!f) { codeChanges.push(`Fjernet «${s.tittel}»: id ${s.id} finnes ikke blant de bekreftede sakene`); return false }
  const verifiedSources = [f.source, ...(f.other_sources || [])].filter((x) => x && x.url)
  const byUrl = s.kilde && verifiedSources.find((x) => normUrl(x.url) === normUrl(s.kilde.url))
  if (byUrl) {
    s.kilde = { navn: s.kilde.navn || byUrl.name, url: byUrl.url }
  } else {
    // Aldri et navn fra agenten sammen med en URL den ikke valgte: bruk navn og URL fra samme bekreftede kilde.
    const wanted = String((s.kilde && s.kilde.navn) || '').toLowerCase()
    const byName = wanted && verifiedSources.find((x) => String(x.name || '').toLowerCase() === wanted)
    const pick = byName || f.source
    codeChanges.push(`Byttet kilde for «${s.tittel}» til ${pick.name} (${pick.url})${byName ? ' — samme navn, bekreftet URL' : ''}`)
    s.kilde = { navn: pick.name, url: pick.url }
  }
  if (!inWeek(s.dato)) { codeChanges.push(`Rettet dato for «${s.tittel}» til ${f.date}`); s.dato = f.date }
  return true
})
if (saker.length && !saker.some((s) => s.nivaa === 'hovedsak')) saker[0].nivaa = 'hovedsak'
const tall = week.ukensTall && saker.some((s) => s.id === week.ukensTall.sakId) ? week.ukensTall : undefined
if (week.ukensTall && !tall) codeChanges.push('Fjernet ukensTall: sakId peker ikke på en sak i utgaven')
if (codeChanges.length) log(`Kodekontroll: ${codeChanges.length} rettelser`)

return {
  week: { ...week, saker, ukensTall: tall, uke: A.uke, aar: A.aar, fra: A.fra, til: A.til, publisert: A.today },
  changes: (proof ? proof.changes : ['proof failed — draft used']).concat(codeChanges),
  rejected: rejected.concat(freshChecked.filter((c) => !(c.verified && inWeek(c.event_date)))).map((c) => ({ title: c.corrected_title || c.title, date: c.event_date || c.date, issues: c.issues })),
  counts: { raw: raw.length, candidates: candidates.length, verified: pool.length },
}
