let chart; 
let currentValues = [];
let currentYears = [];
let currentMunicipalityCode = "SSS"; 

window.addEventListener("DOMContentLoaded", async () => {
  await fetchPopulationData(currentMunicipalityCode);
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("submit-data").addEventListener("click", fetchMunicipalityData);
  document.getElementById("add-data").addEventListener("click", addPredictedData);

  document.getElementById("navigation").addEventListener("click", () => {
    localStorage.setItem("municipality", currentMunicipalityCode); 
    window.location.href = "newchart.html"; 
  });
}

async function fetchPopulationData(areaCode) {
  const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const requestBody = {
    query: [
      { code: "Vuosi", selection: { filter: "item", values: Array.from({length:22}, (_,i)=> (2000+i).toString()) } },
      { code: "Alue", selection: { filter: "item", values: [areaCode] } },
      { code: "Tiedot", selection: { filter: "item", values: ["vaesto"] } }
    ],
    response: { format: "json-stat2" }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    currentYears = Object.values(data.dimension.Vuosi.category.label);
    currentValues = data.value;
    currentMunicipalityCode = areaCode;

    // Create or update chart
    chart = new frappe.Chart("#chart", {
      title: "Population",
      data: { labels: currentYears, datasets: [{ name: "Population", values: currentValues }] },
      type: "line",
      height: 450,
      colors: ["#eb5146"],
      axisOptions: {yAxisMode: "span"},
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function fetchMunicipalityData() {
  const input = document.getElementById("input-area").value.trim().toLowerCase();
  if (!input) return;

  try {
    const response = await fetch("https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px");
    const data = await response.json();

    const codes = data.variables[1].values;
    const names = data.variables[1].valueTexts;

    const index = names.findIndex(name => name.toLowerCase() === input);
    if (index === -1) { 
      alert("Municipality not found!"); 
      return; 
    }

    const code = codes[index];
    await fetchPopulationData(code);

  } catch (error) {
    console.error("Error fetching area codes:", error);
  }
}

function addPredictedData() {
  if (currentValues.length < 2) return;

  
  let deltas = [];
  for (let i = 1; i < currentValues.length; i++) deltas.push(currentValues[i]-currentValues[i-1]);

  const meanDelta = deltas.reduce((a,b)=>a+b,0)/deltas.length;
  const newValue = currentValues[currentValues.length-1]+meanDelta;

  currentValues.push(Math.round(newValue));
  currentYears.push((parseInt(currentYears[currentYears.length-1])+1).toString());

  chart.update({ labels: currentYears, datasets: [{ name: "Population", values: currentValues }] });
}
