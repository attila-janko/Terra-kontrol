const config = window.TERRA_CONFIG || {};
const sheetId = config.sheetId;
const apiKey = config.apiKey;
const range = config.range || "t!L16:L17";

if (!sheetId || !apiKey) {
  throw new Error("Set window.TERRA_CONFIG with a restricted Google Sheets API key at deploy time.");
}

const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Google Sheets request failed: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const rows = Array.isArray(data.values) ? data.values : [];
    if (!rows.length) {
      throw new Error("Google Sheets returned no data.");
    }

    const labels = rows.map((row) => row[0]);
    const values = rows.map((row) => row[1]);

    const canvas = document.getElementById("chartContainer");
    if (canvas) {
      new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "My Dataset",
            data: values,
            backgroundColor: "rgba(0, 123, 255, 0.5)"
          }]
        },
        options: { responsive: true }
      });
    }

    const output = document.getElementById("sheet-data");
    if (output) {
      output.textContent = rows[0][0];
    }
  })
  .catch((error) => console.error("Unable to load sheet data:", error));
