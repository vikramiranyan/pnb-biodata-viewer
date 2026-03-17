let excelData = [];

const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQoD4Qaf0dFYHPHpgrxtAVwxhPH8rptiZJCYoNbrvSNxgbID63bJcrXALvtzkdDApDIXIklfL1Xvll6/pub?output=csv";

function decodeToken(token){
try{
const decoded = atob(token);
const parts = decoded.split("|");
return {
email: parts[0],
role: parts[1],
time: parseInt(parts[2])
};
}catch{
return null;
}
}

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
function getQueryParam(name){
const urlParams = new URLSearchParams(window.location.search);
return urlParams.get(name);
}

// ✅ ADD HERE
let token = getQueryParam("token");

if(!token){
token = localStorage.getItem("token");
}

const userEmail = getQueryParam("email");
const userRole = getQueryParam("role");


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

const token = getQueryParam("token");

if(!token){

document.body.innerHTML = `
<h2 style="text-align:center;margin-top:100px;color:red;">
🔐 Unauthorized Access<br>
Please login via secure portal
</h2>
`;
return;
}

const user = decodeToken(token);

if(!user){

document.body.innerHTML = `
<h2 style="text-align:center;margin-top:100px;color:red;">
❌ Invalid Session
</h2>
`;
return;
}

// OPTIONAL: Expiry check (30 mins)
const now = new Date().getTime();
if(now - user.time > 30 * 60 * 1000){

document.body.innerHTML = `
<h2 style="text-align:center;margin-top:100px;color:red;">
⏳ Session Expired<br>Please login again
</h2>
`;
return;
}

// Save session
localStorage.setItem("token", token);

// Show user
document.getElementById("userInfo").innerHTML =
`👤 Logged in as: <b>${user.email}</b> (${user.role})`;

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

function viewPDF(id){
const api="https://script.google.com/macros/s/AKfycbzg5862I6HU30-qyhIuIHOOQ2wIHwFR90I17OO0dn2KItWUAsAOP3xHNpMV_acaDmHsig/exec";
window.open(`${api}?pdf=${id}`,"_blank");
}
