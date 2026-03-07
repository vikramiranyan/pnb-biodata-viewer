let data = []
const sheetURL = "PASTE_CSV_LINK_HERE"
async function loadData(){
const res = await fetch(sheetURL)
const text = await res.text()
const rows = text.split("\n").map(r=>r.split(","))
const headers = rows.shift()
data = rows.map(r=>{
let obj={}
headers.forEach((h,i)=>obj[h.trim()] = r[i])
return obj
})
render(data)
}
function render(list){
let tbody = document.querySelector("#table tbody")
tbody.innerHTML=""
list.forEach(e=>{
let tr = document.createElement("tr")
tr.innerHTML=`
<td>${e.EmplID}</td>
<td>${e.Empl_Name}</td>
<td>${e.Zone}</td>
<td>${e.Circle}</td>
<td>${e.Grade}</td>
<td>
<button onclick="viewPDF('${e.EmplID}')">
View
</button>
</td>
tbody.appendChild(tr)
})
}
function search(){
let v = document.getElementById("search").value.toLowerCase()
let filtered = data.filter(e=>
e.EmplID.includes(v) ||
e.Empl_Name.toLowerCase().includes(v)
)
render(filtered)
}

function viewPDF(id){
const folder = "YOUR_DRIVE_FOLDER_ID"
const url = `https://drive.google.com/file/d/${id}/preview`
document.getElementById("pdfviewer").src = url
}
loadData()
