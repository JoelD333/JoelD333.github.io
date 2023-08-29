// URL de la API de Google Sheets
var csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQu6otjfmsQT2zalevW9CCzdma2hrnyx5zOTAYfCLqX1_rpnmb1-BoZeUdcbxWliXcFcYFRKB4aCW78/pub?gid=2117789823&single=true&output=csv";

var fila = 1;


//Número más cercano, retorna índice del array
const closestIndex = (num, arr) => {
  let curr = arr[0],
    diff = Math.abs(num - curr);
  let index = 0;
  for (let val = 0; val < arr.length; val++) {
    let newdiff = Math.abs(num - arr[val]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[val];
      index = val;
    };
  };
  return index;
};

//Carga fecha actual, elije la columna más cercana al día 
function loadDates() {
  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      var lines = data.split('\n');
      const fechas = [1000];
      for (var i = 1; i < lines.length; i++) {
        var cells = lines[i].split(',');

        fechas.push(cells[0].match(/\d+/)[0]);

      }

      var actualDate = new Date().getDate();
      var ci = closestIndex(actualDate, fechas);


      //Chequear si la semana aun no pasó
      if (actualDate < fechas[ci] && ci > 1) {
        fila = ci - 1;

      } else {
        fila = ci;
      }


    }).catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });

}


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
      row.style.fontWeight = 'bold';
      var header1 = row.insertCell(0);
      header1.textContent = cells[0];

      var header2 = row.insertCell(1);
      header2.textContent = cells[1];
      header2.colSpan = 2;

      for (var i = 1; i < lines.length; i++) {
        var cells = lines[i].split(',');
        var row = table.insertRow();

        var cellFecha = row.insertCell(0);
        cellFecha.textContent = cells[0];
        cellFecha.rowSpan = 3;

        var cellGrupo = row.insertCell();
        cellGrupo.textContent = cells[1];
        cellGrupo.rowSpan = 3;

        var cell1 = row.insertCell();
        cell1.textContent = cells[2];

        var row2 = table.insertRow();
        var cell2 = row2.insertCell();
        cell2.textContent = cells[3];

        var row3 = table.insertRow();
        var cell3 = row3.insertCell();
        cell3.textContent = cells[4];

        if (i == fila) {
          row.style.fontWeight = 'bold';
          cell2.style.fontWeight = 'bold';
          cell3.style.fontWeight = 'bold';
        }

      };
    })
    .catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });
}


// Carga los datos al cargar la página
window.addEventListener("load", loadDates);
window.addEventListener("load", loadCsvData);