const fetchData = async () => {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const res = await fetch(url);
    const geoData = await res.json();

    const query_res = await fetch("migration_data_query.json");
    const migrationQuery = await query_res.json();

    const migrationResult = await fetch('https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/muutl/statfin_muutl_pxt_11a2.px', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(migrationQuery)
    });
    const migrationJSON = await migrationResult.json();

    const migrationValues = migrationJSON.value;
    const codes = migrationQuery.query[0].selection.values;

    const migrationData = {};
    codes.forEach((code, i) => {
        migrationData[code] = {
            positive: migrationValues[i * 2] || 0,
            negative: migrationValues[i * 2 + 1] || 0
        };
    });

    geoData.features.forEach(feature => {
        const geoCode = feature.properties.kunta;
        const migrationCode = "KU" + geoCode.padStart(3, '0');
        
        if (migrationData[migrationCode]) {
            migrationData[geoCode] = migrationData[migrationCode];
        }
    });

    initMap(geoData, migrationData);
};

const initMap = (geoData, migrationData) => {
    var map = L.map('map', 
        { minZoom: -3 
        });

    var geojson = L.geoJSON(geoData, {
        style: feature => {
            var muncipality_code = feature.properties.kunta;
            var data = migrationData[muncipality_code] || { positive: 0, negative: 1 };
            var negativeSafe = data.negative > 0 ? data.negative : 1;
            var hue = Math.min(Math.pow(data.positive / negativeSafe, 3) * 60, 120);

            return {
                weight: 2,
                color: "black",
                fillColor: `hsl(${hue}, 75%, 50%)`,
                fillOpacity: 0.7
            };
        },
        onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.nimi){
                layer.bindTooltip(feature.properties.nimi, { sticky: true });
            }

            var muncipality_code = feature.properties.kunta;
            var data = migrationData[muncipality_code] || { positive: 0, negative: 0 };
            
            layer.on("click", () => {
                layer.bindPopup(
                    `<b>${feature.properties.nimi}</b><br>` +
                    `Positive migration: ${data.positive}<br>` +
                    `Negative migration: ${data.negative}`
                ).openPopup();
            });
        }
    }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);   

    map.fitBounds(geojson.getBounds());
};

fetchData();