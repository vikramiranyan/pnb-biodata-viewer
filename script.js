let data = []
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoD4Qaf0dFYHPHpgrxtAVwxhPH8rptiZJCYoNbrvSNxgbID63bJcrXALvtzkdDApDIXIklfL1Xvll6/pub?output=csv"
async function loadData(){
const res = await fetch(sheetURL)
const text = await res.text()
const rows = text.trim().split("\n").map(r=>r.split(","))
const headers = rows[0]
data = rows.slice(1).map(r=>{
return{
Zone:r[0],
Circle:r[1],
Location:r[2],
Location_Name:r[3],
EMPLID:r[4],
NAME:r[5],
GRADE:r[6],
DESIGNATION_NAME:r[7]
}
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
`

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

const url = `https://drive.google.com/file/d/${id}/preview`

document.getElementById("pdfviewer").src = url

}

loadData()
