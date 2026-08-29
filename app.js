// Full-page slots and editor, no simulator. Vibrant UI, large text, slide transitions.

const SLOTS_KEY = 'spc_slots_v2'
const ACTIVE_SLOT_KEY = 'spc_active_slot_v2'

const defaultProfile = { name: 'New Player', nation: 'Spain', starting_team: 'FC Barcelona', position: 'Midfielder', age: 18, attributes: { pace:75, shooting:70, passing:72, dribbling:74, defending:60, physical:68 } }

const positions = [
  {id:'Striker', name:'Striker', desc:'Primary goal-scorer — finishing and movement.'},
  {id:'Midfielder', name:'Midfielder', desc:'Controls the tempo — passing and vision.'},
  {id:'Defender', name:'Defender', desc:'Stops attacks — tackling and positioning.'},
  {id:'Goalkeeper', name:'Goalkeeper', desc:'Saves shots — reflexes and handling.'}
]

// Expanded team lists for major leagues (expandable later)
const leagues = [
  {league:'Premier League', teams:[
    'Arsenal','Aston Villa','Bournemouth','Brentford','Brighton & Hove Albion','Burnley','Chelsea','Crystal Palace','Everton','Fulham','Liverpool','Luton Town','Manchester City','Manchester United','Newcastle United','Nottingham Forest','Sheffield United','Tottenham Hotspur','West Ham United','Wolves'
  ]},
  {league:'LaLiga', teams:[
    'Alaves','Athletic Club','Atletico Madrid','Barcelona','Cadiz','Celta Vigo','Getafe','Girona','Granada','Las Palmas','Mallorca','Rayo Vallecano','Real Betis','Real Madrid','Real Sociedad','Sevilla','Valencia','Villarreal'
  ]},
  {league:'Serie A', teams:[
    'Atalanta','Bologna','Cagliari','Fiorentina','Genoa','Inter Milan','Juventus','Lazio','Lecce','Monza','Napoli','AC Milan','AS Roma','Salernitana','Sassuolo','Spezia','Torino','Udinese','Empoli','Frosinone'
  ]},
  {league:'Bundesliga', teams:[
    'Bayern Munich','Borussia Dortmund','Bayer Leverkusen','RB Leipzig','Eintracht Frankfurt','VfL Wolfsburg','VfB Stuttgart','Borussia Mönchengladbach','1. FC Köln','TSG Hoffenheim','FC Augsburg','Hertha BSC','Werder Bremen','Schalke 04','Hamburger SV'
  ]},
  {league:'Ligue 1', teams:[
    'Paris Saint-Germain','Marseille','Lyon','Monaco','Rennes','Nice','Lens','Lille','Bordeaux','Nantes','Saint-Etienne','Montpellier','Strasbourg','Toulouse','Angers','Brest'
  ]},
  {league:'MLS', teams:[
    'Atlanta United FC','Austin FC','CF Montreal','Charlotte FC','Chicago Fire','Colorado Rapids','Columbus Crew','FC Cincinnati','D.C. United','FC Dallas','Inter Miami CF','LA Galaxy','Los Angeles FC','Minnesota United','Nashville SC','New England Revolution','New York City FC','New York Red Bulls','Orlando City SC','Philadelphia Union','Portland Timbers','Real Salt Lake','San Jose Earthquakes','Seattle Sounders','Sporting Kansas City','St. Louis City SC','Toronto FC','Vancouver Whitecaps FC'
  ]},
  {league:'Brasileirao', teams:[
    'Atletico Mineiro','Atletico Paranaense','Bahia','Botafogo','Ceara','Corinthians','Flamengo','Fluminense','Fortaleza','Gremio','Internacional','Palmeiras','Santos','Sao Paulo','Vasco da Gama'
  ]},
  {league:'Argentina Primera', teams:[
    'Boca Juniors','River Plate','Independiente','Racing Club','San Lorenzo','Velez Sarsfield','Estudiantes','Newell\'s Old Boys','Argentinos Juniors'
  ]}
]

// Comprehensive country list
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

// Storage helpers
function loadSlots(){try{const j=JSON.parse(localStorage.getItem(SLOTS_KEY)||'null');return Array.isArray(j)?j:[null,null,null]}catch(e){return [null,null,null]}}
function saveSlots(slots){localStorage.setItem(SLOTS_KEY,JSON.stringify(slots))}
function loadActiveSlot(){const v=localStorage.getItem(ACTIVE_SLOT_KEY);return v===null?null:Number(v)}
function saveActiveSlot(n){localStorage.setItem(ACTIVE_SLOT_KEY,String(n))}

// Slide controls
function showEditorForSlot(slotIndex){
  document.getElementById('slides').style.height = '100%'
  // translate slides: move slots-screen left, editor-screen into view
  const slotsScreen = document.getElementById('slots-screen')
  const editorScreen = document.getElementById('editor-screen')
  slotsScreen.style.transform = 'translateX(-100%)'
  editorScreen.style.transform = 'translateX(0)'
  editorScreen.classList.add('active')
  document.getElementById('editor-slot-label').textContent = `Slot ${slotIndex+1}`
  document.getElementById('editor-slot-label').dataset.slot = slotIndex
  buildEditorForSlot(slotIndex)
}
function backToSlots(){
  const slotsScreen = document.getElementById('slots-screen')
  const editorScreen = document.getElementById('editor-screen')
  slotsScreen.style.transform = 'translateX(0)'
  editorScreen.style.transform = 'translateX(100%)'
  editorScreen.classList.remove('active')
}

// Build UI lists
function initSlotsUI(){
  if(!localStorage.getItem(SLOTS_KEY)) saveSlots([null,null,null])
  const slots = loadSlots()
  for(let i=0;i<3;i++){
    const meta = document.querySelector(`[data-slot-meta='${i}']`)
    const btn = document.querySelector(`.big-slot[data-slot='${i}']`)
    const p = slots[i]
    meta.textContent = p ? `${p.name} — ${p.starting_team} (${p.position})` : 'Empty'
    btn.onclick = ()=>showEditorForSlot(i)
  }
}

function buildEditorForSlot(slotIndex){
  const slots = loadSlots()
  const profile = slots[slotIndex] || structuredClone(defaultProfile)
  // fill name
  document.getElementById('edit-name').value = profile.name || ''
  // nations
  const nationList = document.getElementById('nation-list')
  nationList.innerHTML = ''
  countries.forEach(c=>{
    const el = document.createElement('div')
    el.className = 'picker-item'
    el.textContent = c
    if(c===profile.nation) el.classList.add('selected')
    el.onclick = ()=>{
      nationList.querySelectorAll('.picker-item').forEach(n=>n.classList.remove('selected'))
      el.classList.add('selected')
      document.getElementById('nation-search').value = c
    }
    nationList.appendChild(el)
  })

  // positions
  const posList = document.getElementById('position-list')
  posList.innerHTML = ''
  positions.forEach((p,i)=>{
    const d = document.createElement('div')
    d.className = 'pos-card' + (i%2? ' alt':'')
    d.textContent = p.name
    if(p.name===profile.position) d.classList.add('selected')
    d.onclick = ()=>{ posList.querySelectorAll('.pos-card').forEach(n=>n.classList.remove('selected')); d.classList.add('selected') }
    posList.appendChild(d)
  })

  // teams
  const teamList = document.getElementById('team-list')
  teamList.innerHTML = ''
  leagues.forEach(g=>{
    // optionally add league heading
    const heading = document.createElement('div')
    heading.className = 'picker-item'
    heading.style.fontWeight = '700'
    heading.style.background = 'transparent'
    heading.style.cursor = 'default'
    heading.textContent = g.league
    teamList.appendChild(heading)
    g.teams.forEach(t=>{
      const el = document.createElement('div')
      el.className = 'picker-item'
      el.textContent = t
      if(t===profile.starting_team) el.classList.add('selected')
      el.onclick = ()=>{
        teamList.querySelectorAll('.picker-item').forEach(n=>n.classList.remove('selected'))
        // re-add league headings selection removal
        teamList.querySelectorAll('.picker-item').forEach(h=>{ if(h.textContent===g.league) {/* leave */} })
        el.classList.add('selected')
        document.getElementById('team-search').value = t
      }
      teamList.appendChild(el)
    })
  })

  // wire searches
  document.getElementById('nation-search').oninput = (e)=>{
    const q = e.target.value.toLowerCase()
    document.querySelectorAll('#nation-list .picker-item').forEach(it=>{it.style.display = it.textContent.toLowerCase().includes(q)?'block':'none'})
  }
  document.getElementById('team-search').oninput = (e)=>{
    const q = e.target.value.toLowerCase()
    document.querySelectorAll('#team-list .picker-item').forEach(it=>{it.style.display = it.textContent.toLowerCase().includes(q)?'block':'none'})
  }
}

function applyEditor(){
  const slot = Number(document.getElementById('editor-slot-label').dataset.slot)
  const name = document.getElementById('edit-name').value || 'Unnamed'
  const nationEl = document.querySelector('#nation-list .picker-item.selected')
  const nation = nationEl ? nationEl.textContent : (document.getElementById('nation-search').value || 'Unknown')
  const posEl = document.querySelector('#position-list .pos-card.selected')
  const position = posEl ? posEl.textContent : 'Midfielder'
  const teamEl = document.querySelector('#team-list .picker-item.selected')
  const team = teamEl ? teamEl.textContent : (document.getElementById('team-search').value || 'Unknown')

  const slots = loadSlots()
  const profile = { name, nation, starting_team: team, position, age:18, attributes: structuredClone(defaultProfile.attributes) }
  slots[slot] = profile
  saveSlots(slots)
  saveActiveSlot(slot)
  initSlotsUI()
  backToSlots()
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

function wireButtons(){
  document.getElementById('back-button').onclick = backToSlots
  document.getElementById('apply-btn').onclick = applyEditor
  document.getElementById('download-profile').onclick = ()=>{
    const slot = Number(document.getElementById('editor-slot-label').dataset.slot)
    const slots = loadSlots()
    if(!slots[slot]) return alert('No profile in this slot')
    download(`player_profile_slot_${slot+1}.json`, JSON.stringify(slots[slot],null,2))
  }
  document.getElementById('download-log').onclick = ()=>{
    const slot = Number(document.getElementById('editor-slot-label').dataset.slot)
    const log = localStorage.getItem(`career_slot_${slot}`) || `# Career Log — ${ (loadSlots()[slot]||defaultProfile).name }\n\n`
    download(`career_log_slot_${slot+1}.md`, log)
  }
}

function init(){
  if(!localStorage.getItem(SLOTS_KEY)) saveSlots([null,null,null])
  initSlotsUI()
  wireButtons()
}

window.addEventListener('load', init)
