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
<td>${e.EMPLID}</td>
<td>${e.NAME}</td>
<td>${e.Zone}</td>
<td>${e.Circle}</td>
<td>${e.GRADE}</td>
<td>
<button onclick="viewPDF('${e.EMPLID}')">
View
</button>
</td>
tbody.appendChild(tr)
})
}
function search(){
let v = document.getElementById("search").value.toLowerCase()
let filtered = data.filter(e=>
e.EMPLID.includes(v) ||
e.NAME.toLowerCase().includes(v)
)
render(filtered)
}

function viewPDF(id){
const folder = "YOUR_DRIVE_FOLDER_ID"
const url = `https://drive.google.com/file/d/${id}/preview`
document.getElementById("pdfviewer").src = url
}
loadData()
