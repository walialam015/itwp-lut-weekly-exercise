async function main() {
  const tableBody = document.getElementById("population-table-body");
  const populationURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";
  const employmentUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

  try {
    const populationQueryResponse = await fetch("population_query.json");
    const populationQuery = await populationQueryResponse.json();

    const employmentQueryResponse = await fetch("employment_query.json");
    const employmentQuery = await employmentQueryResponse.json();

    const populationResponse = await fetch(populationURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(populationQuery),
    });

    const populationData = await populationResponse.json();

    const employmentResponse = await fetch(employmentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employmentQuery),
    });

    const employmentData = await employmentResponse.json();


    const municipalitiesNames = Object.values(populationData.dimension.Alue.category.label);
    const populationNumbers = populationData.value;
    const employedNumbers = employmentData.value;

    
    for (var i = 0; i < municipalitiesNames.length; i++) {
      const row = document.createElement("tr");

      const municipalitiesCell = document.createElement("td");
      municipalitiesCell.textContent = municipalitiesNames[i];
      row.appendChild(municipalitiesCell);

      const populationsCell = document.createElement("td");
      populationsCell.textContent = populationNumbers[i];
      row.appendChild(populationsCell);

      const employedCell = document.createElement("td");
      employedCell.textContent = employedNumbers[i];
      row.appendChild(employedCell);

      const employmentPercentage = (employedNumbers[i] / populationNumbers[i]) * 100;
      const rounded2decPercentage = Math.round(employmentPercentage * 100) / 100;  
      const employmentPercentageCell = document.createElement("td");
      employmentPercentageCell.textContent = rounded2decPercentage + "%";
      row.appendChild(employmentPercentageCell);

        if (employmentPercentage > 45) {
            row.style.backgroundColor = "#abffbd"; // green
        } else if (employmentPercentage < 25) {
            row.style.backgroundColor = "#ff9e9e"; // red
        } else if ((i + 1) % 2 === 0) {
            row.style.backgroundColor = "#f2f2f2"; // even row
        } else {
            row.style.backgroundColor = "#ffffff"; // odd row
        }     
      
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.addEventListener("DOMContentLoaded", main);
