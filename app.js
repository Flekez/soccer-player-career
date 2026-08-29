// Enhanced browser-based soccer player career simulator with 3 slots
// - Three save slots stored in localStorage
// - Click a slot to open an editor: pick nation from a list, choose position by clicking cards (with icons/descriptions), pick team from major leagues, change name, then Apply
// - Download profile and career log per slot

const SLOTS_KEY = 'spc_slots_v1'
const ACTIVE_SLOT_KEY = 'spc_active_slot_v1'

const defaultProfile = {
  name: 'New Player',
  nation: 'Spain',
  starting_team: 'FC Barcelona',
  position: 'Midfielder',
  age: 18,
  attributes: { pace: 75, shooting: 70, passing: 72, dribbling: 74, defending: 60, physical: 68 }
}

const positions = [
  {id:'Striker', name:'Striker', icon:'⚽', desc:'Primary goal-scorer — focuses on finishing and movement.'},
  {id:'Midfielder', name:'Midfielder', icon:'🎯', desc:'Controls the tempo — passing, vision, and stamina.'},
  {id:'Defender', name:'Defender', icon:'🛡️', desc:'Stops attacks — tackling, marking, and positioning.'},
  {id:'Goalkeeper', name:'Goalkeeper', icon:'🧤', desc:'Saves shots — handling, reflexes, and distribution.'}
]

// Major leagues + some teams for the team picker. Expandable later.
const leagues = [
  {league:'Premier League', teams:['Manchester United','Manchester City','Liverpool','Chelsea','Arsenal','Tottenham Hotspur','Leicester City']},
  {league:'LaLiga', teams:['FC Barcelona','Real Madrid','Atletico Madrid','Sevilla','Real Sociedad']},
  {league:'Serie A', teams:['Juventus','Inter Milan','AC Milan','Napoli','AS Roma']},
  {league:'Bundesliga', teams:['Bayern Munich','Borussia Dortmund','RB Leipzig','Bayer Leverkusen']},
  {league:'Ligue 1', teams:['Paris Saint-Germain','Olympique Lyonnais','AS Monaco','Marseille']},
  {league:'MLS', teams:['LA Galaxy','Inter Miami','Seattle Sounders','Toronto FC']},
  {league:'Brasileirao', teams:['Flamengo','Palmeiras','Sao Paulo','Corinthians']}
]

// Comprehensive country list (ISO common names)
const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Côte d'Ivoire","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia",
  "Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Federated States of Micronesia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe"
]

// Utility: storage
function loadSlots(){
  try{const j=JSON.parse(localStorage.getItem(SLOTS_KEY)||'null');return Array.isArray(j)?j:[null,null,null]}catch(e){return [null,null,null]}
}
function saveSlots(slots){localStorage.setItem(SLOTS_KEY,JSON.stringify(slots))}

function loadActiveSlot(){const v = localStorage.getItem(ACTIVE_SLOT_KEY);return v===null?null:Number(v)}
function saveActiveSlot(n){localStorage.setItem(ACTIVE_SLOT_KEY,String(n))}

function initSlotsUI(){
  const slots = loadSlots()
  for(let i=0;i<3;i++){
    const meta = document.querySelector(`[data-slot-meta='${i}']`)
    const btn = document.querySelector(`.slot[data-slot='${i}']`)
    const p = slots[i]
    if(p){meta.textContent = `${p.name} — ${p.starting_team} (${p.position})`} else {meta.textContent = 'Empty'}
    btn.onclick = ()=>openEditor(i)
  }
}

function setActiveProfile(profile){
  const el = document.getElementById('profile-view')
  document.getElementById('career-log').textContent = localStorage.getItem(`career_slot_${loadActiveSlot()}`) || '# Career Log — ' + profile.name + '\n\n'
  el.textContent = JSON.stringify(profile,null,2)
}

function openEditor(slotIndex){
  const slots = loadSlots()
  const existing = slots[slotIndex] || structuredClone(defaultProfile)
  document.getElementById('editor-slot').textContent = slotIndex+1
  document.getElementById('edit-name').value = existing.name || ''
  buildNationList(existing.nation)
  buildPositionCards(existing.position)
  buildTeamSelect(existing.starting_team)
  // show modal
  const modal = document.getElementById('editor-modal')
  modal.setAttribute('aria-hidden','false')
  modal.dataset.slot = slotIndex
}

function closeEditor(){
  const modal = document.getElementById('editor-modal')
  modal.setAttribute('aria-hidden','true')
  delete modal.dataset.slot
}

function buildNationList(selected){
  const container = document.getElementById('nation-list')
  container.innerHTML = ''
  countries.forEach(c=>{
    const btn = document.createElement('button')
    btn.className = 'picker-item'
    btn.textContent = c
    if(c===selected) btn.style.borderColor = 'var(--accent)'
    btn.onclick = ()=>{
      // mark selection visually
      container.querySelectorAll('.picker-item').forEach(n=>n.style.borderColor='')
      btn.style.borderColor='var(--accent)'
      btn.dataset.selected = '1'
      document.getElementById('nation-search').value = c
    }
    container.appendChild(btn)
  })
}

function buildPositionCards(selected){
  const container = document.getElementById('position-list')
  container.innerHTML = ''
  positions.forEach(p=>{
    const tpl = document.getElementById('position-template').content.cloneNode(true)
    const card = tpl.querySelector('.pos-card')
    card.querySelector('.pos-icon').textContent = p.icon
    card.querySelector('.pos-name').textContent = p.name
    card.querySelector('.pos-desc').textContent = p.desc
    if(p.id===selected) card.style.borderColor='var(--accent)'
    card.onclick = ()=>{
      container.querySelectorAll('.pos-card').forEach(n=>n.style.borderColor='')
      card.style.borderColor='var(--accent)'
      card.dataset.selected = p.id
    }
    container.appendChild(card)
  })
}

function buildTeamSelect(selected){
  const sel = document.getElementById('team-select')
  sel.innerHTML = ''
  leagues.forEach(l=>{
    const optg = document.createElement('optgroup')
    optg.label = l.league
    l.teams.forEach(t=>{
      const o = document.createElement('option')
      o.value = t
      o.textContent = t
      if(t===selected) o.selected = true
      optg.appendChild(o)
    })
    sel.appendChild(optg)
  })
}

function applyEditor(){
  const modal = document.getElementById('editor-modal')
  const slotIndex = Number(modal.dataset.slot)
  const name = document.getElementById('edit-name').value || 'Unnamed'
  const nation = document.getElementById('nation-search').value || 'Unknown'
  // find selected position
  const posCard = document.querySelector('#position-list .pos-card[style*="--"]')
  // fallback: find selected via dataset or border
  let position = null
  document.querySelectorAll('#position-list .pos-card').forEach(c=>{ if(c.style.borderColor) position = c.querySelector('.pos-name').textContent })
  if(!position){ position = 'Midfielder' }
  const team = document.getElementById('team-select').value || 'Unknown'

  const slots = loadSlots()
  const profile = {
    name, nation, starting_team: team, position, age: 18,
    attributes: structuredClone(defaultProfile.attributes)
  }
  slots[slotIndex] = profile
  saveSlots(slots)
  saveActiveSlot(slotIndex)
  initSlotsUI()
  setActiveProfile(profile)
  closeEditor()
}

function download(filename, content){
  const blob = new Blob([content], {type:'application/octet-stream'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function wireEditorButtons(){
  document.getElementById('cancel-btn').onclick = closeEditor
  document.getElementById('apply-btn').onclick = applyEditor
  document.getElementById('download-profile').onclick = ()=>{
    const slot = loadActiveSlot()
    const slots = loadSlots()
    if(slot===null || !slots[slot]) return alert('No active profile to download')
    download('player_profile_slot_'+(slot+1)+'.json', JSON.stringify(slots[slot],null,2))
  }
  document.getElementById('download-log').onclick = ()=>{
    const slot = loadActiveSlot()
    const log = localStorage.getItem('career_slot_'+slot) || '# Career Log\n\n'
    download('career_log_slot_'+(slot+1)+'.md', log)
  }
  document.getElementById('nation-search').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase()
    document.querySelectorAll('#nation-list .picker-item').forEach(it=>{
      it.style.display = it.textContent.toLowerCase().includes(q)?'inline-block':'none'
    })
  })
}

// Simple simulator: updates selected slot
function simulateOneSeasonForSlot(slotIndex){
  const slots = loadSlots()
  const p = slots[slotIndex]
  if(!p) return null
  const appearances = Math.max(1, Math.floor(Math.random()*36)+5 + Math.floor((p.attributes.pace-50)/10))
  const goals = Math.max(0, Math.floor((p.attributes.shooting + p.attributes.dribbling)/40 * (appearances/10))) + Math.floor(Math.random()*6)
  const assists = Math.max(0, Math.floor(p.attributes.passing/50 * appearances/10)) + Math.floor(Math.random()*4)
  // growth
  const growth = p.age <=24 ? 1.0 : 0.4
  for(const k in p.attributes){ p.attributes[k] = Math.min(99, p.attributes[k] + Math.round(Math.random()*2*growth)) }
  p.age += 1
  slots[slotIndex] = p
  saveSlots(slots)
  // append career log
  const prev = localStorage.getItem('career_slot_'+slotIndex) || `# Career Log — ${p.name}\n\n` 
  const seasonNum = (prev.match(/Season/g)||[]).length + 1
  const line = `Season ${seasonNum}\n- Club: ${p.starting_team}\n- Appearances: ${appearances}\n- Goals: ${goals}\n- Assists: ${assists}\n- Notes: Simulated season.\n\n`
  localStorage.setItem('career_slot_'+slotIndex, prev + line)
  saveActiveSlot(slotIndex)
  setActiveProfile(p)
  return {appearances,goals,assists}
}

function wireSimulator(){
  document.getElementById('sim-btn').onclick = ()=>{
    const n = Number(document.getElementById('seasons').value||1)
    const slot = loadActiveSlot()
    if(slot===null) return alert('No active slot. Click a slot and Apply first.')
    document.getElementById('sim-result').textContent = 'Simulating...'
    let i = 0
    function runNext(){
      if(i>=n){ document.getElementById('sim-result').textContent = `Simulated ${n} season(s).`; return }
      simulateOneSeasonForSlot(slot)
      i++
      setTimeout(runNext, 300)
    }
    runNext()
  }
}

function init(){
  if(!localStorage.getItem(SLOTS_KEY)) saveSlots([null,null,null])
  initSlotsUI()
  const active = loadActiveSlot()
  if(active!==null){ const slots = loadSlots(); if(slots[active]) setActiveProfile(slots[active]) }
  wireEditorButtons()
  wireSimulator()
}

window.addEventListener('load', init)
