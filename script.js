let data = []

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoD4Qaf0dFYHPHpgrxtAVwxhPH8rptiZJCYoNbrvSNxgbID63bJcrXALvtzkdDApDIXIklfL1Xvll6/pub?output=csv"

async function loadData(){

const res = await fetch(sheetURL)
const text = await res.text()

const parsed = Papa.parse(text,{
header:true,
skipEmptyLines:true
})

data = parsed.data
render(data)
populateFilters()
}

function applyFilters(){
let zone = document.getElementById("zoneFilter").value
let circle = document.getElementById("circleFilter").value
let location = document.getElementById("locationFilter").value

let filtered = data.filter(e=>{

return (!zone || e.ZONE===zone) &&
(!circle || e.CIRCLE===circle) &&
(!location || e.LOC_NAME===location)
})
render(filtered)
}

function populateFilters(){
const zones = [...new Set(data.map(d=>d.ZONE))]
const circles = [...new Set(data.map(d=>d.CIRCLE))]
const locations = [...new Set(data.map(d=>d.LOC_NAME))]

const zoneSelect = document.getElementById("zoneFilter")
const circleSelect = document.getElementById("circleFilter")
const locationSelect = document.getElementById("locationFilter")

zones.forEach(z=>{
zoneSelect.innerHTML += `<option value="${z}">${z}</option>`
})
circles.forEach(c=>{
circleSelect.innerHTML += `<option value="${c}">${c}</option>`
})
locations.forEach(l=>{
locationSelect.innerHTML += `<option value="${l}">${l}</option>`
})
}

function render(list){
let tbody = document.querySelector("#table tbody")
tbody.innerHTML=""
list.forEach(e=>{
let tr = document.createElement("tr")
tr.innerHTML=`
<td>${e.EMPLID}</td>
<td>${e.NAME}</td>
<td>${e.ZONE}</td>
<td>${e.CIRCLE}</td>
<td>${e.GRADE}</td>
<td>
<button onclick="viewPDF('${e.EMPLID}')">View</button>
</td>
tbody.appendChild(tr)
})
}

function search(){
let v = document.getElementById("search").value.toLowerCase()
let filtered = data.filter(e =>
e.EMPLID.includes(v) ||
e.NAME.toLowerCase().includes(v)
)
render(filtered)
}

function viewPDF(id){
const url = `https://drive.google.com/file/d/${id}/preview`
document.getElementById("pdfviewer").src = url
}
loadData()
