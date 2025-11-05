let chart;
let currentYears = Array.from({ length: 22 }, (_, i) => (2000 + i).toString());
let municipalityCode = localStorage.getItem("municipality") || "SSS";

window.addEventListener("DOMContentLoaded", async () => {
  
  let births = await fetchData("vm01"); 
  let deaths = await fetchData("vm11"); 

  
  births = births.map(v => Math.round(Number(v)));
  deaths = deaths.map(v => Math.round(Number(v)));

  
  chart = new frappe.Chart("#chart", {
    title: "Births and Deaths (2000–2021)",
    data: {
      labels: currentYears,
      datasets: [
        { name: "Births", values: births },
        { name: "Deaths", values: deaths }
      ]
    },
    type: "bar",
    colors: ["#63d0ff", "#363636"], 
    height: 450,
    axisOptions: { xIsSeries: true, yAxisMode: "span" }, 
    padding: { left: 60, right: 20, top: 20, bottom: 20 } 
  });

  
  document.getElementById("navigation-to-index").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

async function fetchData(tiedotCode) {
  const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const requestBody = {
    query: [
      { code: "Vuosi", selection: { filter: "item", values: currentYears } },
      { code: "Alue", selection: { filter: "item", values: [municipalityCode] } },
      { code: "Tiedot", selection: { filter: "item", values: [tiedotCode] } }
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

    
    let values = data.value.map(v => Math.round(Number(v)));
    while (values.length < currentYears.length) values.push(0); 
    if (values.length > currentYears.length) values = values.slice(0, currentYears.length); // slice extras

    return values;
  } catch (error) {
    console.error("Error fetching data:", error);
    return Array(currentYears.length).fill(0); 
  }
}
