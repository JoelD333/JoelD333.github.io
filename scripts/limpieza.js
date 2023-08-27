// URL de la API de Google Sheets
var csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQu6otjfmsQT2zalevW9CCzdma2hrnyx5zOTAYfCLqX1_rpnmb1-BoZeUdcbxWliXcFcYFRKB4aCW78/pub?gid=2117789823&single=true&output=csv";


// Función para cargar los datos desde Google Sheets
function loadCsvData() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            var table = document.getElementById("csvTable");
            var lines = data.split('\n');

            // Limpia cualquier dato existente en la tabla
            table.innerHTML = "";
            var cells = lines[0].split(',');
            var row = table.insertRow();

            var header1 = row.insertCell(0);
            header1.textContent = cells[0];
        
            var header2 = row.insertCell(1);
            header2.textContent = cells[1];
            header2.colSpan = 2;

            for (var i = 1; i < lines.length; i++) {
                var cells = lines[i].split(',');
                var row = table.insertRow();
            
                    var cell1 = row.insertCell(0);
                    cell1.textContent = cells[0];

                    var cell2 = row.insertCell(1);
                    cell2.textContent = cells[1];

                    var cell3 = row.insertCell(2);
                    cell3.textContent = cells[2];
                



            };
        })
        .catch(error => {
            console.error("Error al cargar el archivo CSV:", error);
        });
}


// Carga los datos al cargar la página
window.addEventListener("load", loadCsvData);


