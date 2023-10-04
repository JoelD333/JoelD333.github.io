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

//Carga fecha actual, elije la fila más cercana al día 
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

loadCsvData();

    }).catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
     
    });

}


// Función para cargar los datos desde Google Sheets
function loadCsvData() {
  
  // Buscar Tabla y limpiarla
  var table = document.getElementById("csvTable");
  table.innerHTML = "";
  
  //Buscar Loader y mostrarlo
 var loader = document.getElementById("loader");
 loader.style.display = 'initial';
 
  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      
      // Separar el CSV
      var lines = data.split('\n');
      var cells = lines[0].split(',');
      
      //Agregar Encabezados
      var row = table.insertRow();
      row.style.fontWeight = 'bold';
      
      var header1 = document.createElement("TH");
      header1.colSpan = 2;
      header1.innerHTML = cells[0];
      row.appendChild(header1);
      
      var header2 = document.createElement("TH");
      header2.innerHTML = cells[1];
      header2.colSpan = 1;
      row.appendChild(header2);

      for (var i = 1; i < lines.length; i++) {
        var cells = lines[i].split(',');
      
       var tb =  document.createElement("tbody");
      
      
        var row = tb.insertRow();

        var cellFecha = row.insertCell(0);
        cellFecha.textContent = cells[0];
        cellFecha.rowSpan = 3;

        var cellGrupo = row.insertCell();
        cellGrupo.textContent = cells[1];
        cellGrupo.rowSpan = 3;

        var cell1 = row.insertCell();
        cell1.textContent = cells[2];

        var row2 = tb.insertRow();
        var cell2 = row2.insertCell();
        cell2.textContent = cells[3];

        var row3 = tb.insertRow();
        var cell3 = row3.insertCell();
        cell3.textContent = cells[4];

        if (i == fila) {
          tb.style.fontWeight = 'bold';
        }

table.appendChild(tb);
      };
      
      //Esconder loader
      loader.style.display ='none';
    })
    .catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });
}


// Carga los datos al cargar la página
window.addEventListener("load", loadDates);
