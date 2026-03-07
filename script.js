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
