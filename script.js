let excelData = [];

const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQoD4Qaf0dFYHPHpgrxtAVwxhPH8rptiZJCYoNbrvSNxgbID63bJcrXALvtzkdDApDIXIklfL1Xvll6/pub?output=csv";

async function loadSheetData(){

const res = await fetch(sheetURL);
const text = await res.text();

const results = Papa.parse(text,{header:true,skipEmptyLines:true});

excelData = results.data.map(row => ({
Zone: row["ZONE"]?.trim() || "",
Circle: row["CIRCLE"]?.trim() || "",
DeptID: row["DEPTID"]?.trim() || "",
Dept_Name: row["DEPT_NAME"]?.trim() || "",
EmplID: row["EMPLID"]?.trim() || "",
Empl_Name: row["NAME"]?.trim() || "",
Grade: row["GRADE"]?.trim() || "",
Designation: row["DESIGNATION"]?.trim() || ""
}));

populateDropdown('zoneSelect',[...new Set(excelData.map(r=>r.Zone))]);

}

function populateDropdown(id,values){

const select=document.getElementById(id);

select.innerHTML='<option value="">--Select--</option>';

values.filter(Boolean).sort().forEach(v=>{

const opt=document.createElement("option");

opt.value=v;
opt.textContent=v;

select.appendChild(opt);

});

}

function displayTable(data){

const tbody=document.querySelector("#resultTable tbody");

tbody.innerHTML="";

data.sort((a,b)=>{

if(a.Grade>b.Grade) return -1;
if(a.Grade<b.Grade) return 1;

return a.Empl_Name.localeCompare(b.Empl_Name);

});

data.forEach(r=>{

const tr=document.createElement("tr");

tr.innerHTML=`
<td>${r.Zone}</td>
<td>${r.Circle}</td>
<td>${r.DeptID}</td>
<td>${r.Dept_Name}</td>
<td>${r.EmplID}</td>
<td>${r.Empl_Name}</td>
<td>${r.Grade}</td>
<td>${r.Designation}</td>
<td><button onclick="viewPDF('${r.EmplID}')">View</button></td>
`;

tbody.appendChild(tr);

});

}

function resetFilters(){

['zoneSelect','circleSelect','deptIdSelect','deptNameSelect','idSearch','nameSearch']
.forEach(id=>{

const el=document.getElementById(id);

if(el.tagName==="SELECT") el.value="";
else el.value="";

});

populateDropdown('zoneSelect',[...new Set(excelData.map(r=>r.Zone))]);

document.querySelector("#resultTable tbody").innerHTML="";

}

document.addEventListener("DOMContentLoaded",()=>{

loadSheetData();

document.getElementById("zoneSelect").addEventListener("change",()=>{

const zone=document.getElementById("zoneSelect").value;

const filtered=excelData.filter(r=>r.Zone===zone);

populateDropdown('circleSelect',[...new Set(filtered.map(r=>r.Circle))]);

document.querySelector("#resultTable tbody").innerHTML="";

});

document.getElementById("circleSelect").addEventListener("change",()=>{

const zone=document.getElementById("zoneSelect").value;
const circle=document.getElementById("circleSelect").value;

const filtered=excelData.filter(r=>r.Zone===zone && r.Circle===circle);

const depts=[...new Map(filtered.map(r=>[r.DeptID,r.Dept_Name])).entries()];

populateDropdown('deptIdSelect',depts.map(d=>d[0]));
populateDropdown('deptNameSelect',depts.map(d=>d[1]));

});

document.getElementById("deptIdSelect").addEventListener("change",filterAndShow);
document.getElementById("deptNameSelect").addEventListener("change",filterAndShow);
document.getElementById("idSearch").addEventListener("keyup",filterAndShow);
document.getElementById("nameSearch").addEventListener("keyup",filterAndShow);

});

function filterAndShow(){

const zone=document.getElementById("zoneSelect").value;
const circle=document.getElementById("circleSelect").value;
const deptID=document.getElementById("deptIdSelect").value;
const deptName=document.getElementById("deptNameSelect").value;
const idSearch=document.getElementById("idSearch").value.toLowerCase();
const nameSearch=document.getElementById("nameSearch").value.toLowerCase();

const filtered=excelData.filter(r=>

(!zone || r.Zone===zone) &&
(!circle || r.Circle===circle) &&
(!deptID || r.DeptID===deptID) &&
(!deptName || r.Dept_Name===deptName) &&
(!idSearch || r.EmplID.toLowerCase().includes(idSearch)) &&
(!nameSearch || r.Empl_Name.toLowerCase().includes(nameSearch))
);
displayTable(filtered);
}

async function viewPDF(id){
const api = "YOUR_APPS_SCRIPT_WEBAPP_URL";
const res = await fetch(`${api}?pdf=${id}`);
const pdfUrl = await res.text();
if(pdfUrl){
window.open(pdfUrl,"_blank");
}else{
alert("PDF not found");
}
}
