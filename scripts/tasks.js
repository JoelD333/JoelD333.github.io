// URL de la API de Google Sheets
var csvUrl = "https://docs.google.com/spreadsheets/d/1kmwcFrbbZuHxIbjc8Ow13_ANCS1Vib85fgD_pgy6cUQ/export?format=csv";


var columna = 1;
var cantidadColumnas = 1;

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
      const fechas = [10000];
      for (var i = 1; i < lines.length; i++) {
        var cells = lines[i].split(',');

        fechas.push(cells[0].match(/\d+/)[0]);

      }

      //Set Cantidad de Fechas
      cantidadColumnas = fechas.length - 1;

      var actualDate = new Date().getDate();
      var ci = closestIndex(actualDate, fechas);

      //Chequear si ya pasó la fecha elegida, y si no es el último el índice de array, para evitar desborde 
      if (actualDate > fechas[ci] && ci < fechas.length - 1) {
        columna = ci + 1;
      } else {
        columna = ci;
      };



    }).catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });

}

// Función para cargar los datos desde Google Sheets
function loadCsvData() {

  //Buscar tabla y limpiarla
  var table = document.getElementById("csvTable");
  table.innerHTML = "";

  //Buscar Loader y Mostrarlo
  var loader = document.getElementById("loader");
  loader.style.display = 'initial';

  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      //Separar CSV
      var lines = data.split('\n');

      //Agregar Headers
      var header = table.insertRow();
      var headerCell = document.createElement("TH");
      headerCell.innerHTML = "Tarea";
      header.appendChild(headerCell);
      var headerCell2 = document.createElement("TH");
      headerCell2.innerHTML = "Encargado";
      header.appendChild(headerCell2);



      // Procesa las líneas del archivo CSV
      var headers = lines[0].split(',');
      var cells = lines[columna].split(',');

      //Cambiar fecha
      var fecha = document.getElementById("date");
      fecha.textContent = cells[0];

console.log(lines)
      for (var i = 1; i < cells.length + 1; i++) {
        console.log("test" + i)
        var row = table.insertRow();

        // Agrega columna de encabezado
        var headerCell = row.insertCell(0);
        headerCell.textContent = headers[i];

        // Agrega columna de valor
        var valueCell = row.insertCell(1);
        valueCell.textContent = cells[i];


      }
      // Limpiar loader
      loader.style.display = 'none';
    })
    .catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });
}

// Carga los datos al cargar la página
window.addEventListener("load", loadDates);
window.addEventListener("load", loadCsvData);


// Botones

var buttonPlus = document.getElementById("buttonPlus");
var buttonMinus = document.getElementById("buttonMinus");


function columnPlus() {
  if (columna < cantidadColumnas) {
    columna++;
    loadCsvData();
  }
};

function columnMinus() {
  if (columna > 1) {
    columna--;
    loadCsvData();
  }
};