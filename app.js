// Simple browser-based soccer player career simulator
// Works in Microsoft Edge and other modern browsers

let profile = null
let careerLog = ''

const defaultProfile = {
  "name": "Alex Rivera",
  "nation": "Spain",
  "starting_team": "FC Barcelona",
  "position": "Midfielder",
  "age": 18,
  "attributes": {
    "pace": 78,
    "shooting": 70,
    "passing": 75,
    "dribbling": 76,
    "defending": 60,
    "physical": 68
  }
}

async function tryLoadProfileFile() {
  try {
    const res = await fetch('player_profile.json')
    if (!res.ok) throw new Error('no profile file')
    const j = await res.json()
    return j
  } catch (e) {
    return null
  }
}

async function init(){
  const loaded = await tryLoadProfileFile()
  profile = loaded || structuredClone(defaultProfile)
  careerLog = `# Career Log — ${profile.name}\n\n`
  renderProfile()
  renderCareer()
}

function renderProfile(){
  const el = document.getElementById('profile-view')
  el.textContent = JSON.stringify(profile, null, 2)
}

function renderCareer(){
  document.getElementById('career-log').textContent = careerLog
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

function randRange(a,b){return Math.floor(Math.random()*(b-a+1))+a}

function simulateOneSeason(seasonIndex){
  // Basic simulation: appearances depend on age and attributes
  const appearances = Math.max(1, randRange(5,40) + Math.floor((profile.attributes.pace-50)/10))
  const goals = Math.max(0, Math.floor((profile.attributes.shooting + profile.attributes.dribbling)/40 * appearances/10)) + randRange(0,5)
  const assists = Math.max(0, Math.floor(profile.attributes.passing/50 * appearances/10)) + randRange(0,3)

  // Attribute growth: small random increases based on age
  const growthFactor = profile.age <= 24 ? 1 : 0.4
  const attrNames = Object.keys(profile.attributes)
  attrNames.forEach(k => {
    const delta = Math.round((Math.random()*2 + Math.random()*1) * growthFactor)
    profile.attributes[k] = Math.min(99, profile.attributes[k] + delta)
  })

  // Age up
  profile.age += 1

  const seasonLine = `Season ${seasonIndex} (${new Date().getFullYear() + seasonIndex}/...)\n- Club: ${profile.starting_team}\n- Appearances: ${appearances}\n- Goals: ${goals}\n- Assists: ${assists}\n- Notes: Simulated season. Attribute growth: +${Math.max(0, growthFactor).toFixed(1)} potential\n\n`
  careerLog += seasonLine
  return {appearances,goals,assists}
}

async function simulateSeasons(n){
  const resEl = document.getElementById('sim-result')
  resEl.textContent = 'Simulating...'
  for(let i=1;i<=n;i++){
    const r = simulateOneSeason(i)
    await new Promise(r=>setTimeout(r, 300))
  }
  renderProfile()
  renderCareer()
  resEl.textContent = `Simulated ${n} season(s).` 
}

function wire(){
  document.getElementById('sim-btn').addEventListener('click', ()=>{
    const n = parseInt(document.getElementById('seasons').value||1,10)
    simulateSeasons(n)
  })
  document.getElementById('download-profile').addEventListener('click', ()=>{
    download('player_profile.json', JSON.stringify(profile, null, 2))
  })
  document.getElementById('download-log').addEventListener('click', ()=>{
    download('career_log.md', careerLog)
  })
  document.getElementById('edit-btn').addEventListener('click', ()=>{
    openEditor()
  })
  document.getElementById('load-btn').addEventListener('click', ()=>{
    document.getElementById('file-input').click()
  })
  document.getElementById('file-input').addEventListener('change', (e)=>{
    const f = e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = ()=>{
      try{
        const j = JSON.parse(r.result)
        profile = j
        careerLog = `# Career Log — ${profile.name}\n\n`
        renderProfile()
        renderCareer()
      }catch(err){alert('Invalid JSON file')}
    }
    r.readAsText(f)
  })
}

function openEditor(){
  const tpl = document.getElementById('edit-template')
  const node = tpl.content.cloneNode(true)
  const container = document.createElement('div')
  container.className = 'editor-box'
  container.appendChild(node)
  document.body.appendChild(container)

  const inputs = container.querySelectorAll('input')
  inputs.forEach(inp => {
    const name = inp.name
    if (name in profile) {
      inp.value = profile[name]
    } else if (name in profile.attributes) {
      inp.value = profile.attributes[name]
    }
  })

  container.querySelector('#save-edit').addEventListener('click', ()=>{
    inputs.forEach(inp=>{
      const name = inp.name
      if (name in profile) profile[name] = isNaN(inp.value) ? inp.value : Number(inp.value)
      else if (name in profile.attributes) profile.attributes[name] = Number(inp.value)
    })
    profile.age = Number(profile.age)
    document.body.removeChild(container)
    renderProfile()
  })
  container.querySelector('#cancel-edit').addEventListener('click', ()=>{
    document.body.removeChild(container)
  })
}

window.addEventListener('load', ()=>{init().then(wire)})
