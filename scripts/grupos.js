// URL de la API de Google Sheets
var hoja1Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pub?gid=0&single=true&output=csv";
var hoja2Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pub?gid=30113003&single=true&output=csv";
var hoja3Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pub?gid=950445821&single=true&output=csv";
var hoja4Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pub?gid=2036176846&single=true&output=csv";

var dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pub?gid=664760905&single=true&output=csv";

const urls = [hoja1Url, hoja2Url, hoja3Url, hoja4Url]
var semana = 0;


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

function dateManager() {
  fetch(dataUrl)
    .then(response => response.text())
    .then(data => {
      var rows = data.split('\n');
      //Cargar fechas en el Array
      const fechas = [];

      for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].split(',');
        fechas.push(cells[0]);
      }

      //Buscar la fecha mas cercana a la actual
      var date = new Date().getDate();
      ci = closestIndex(date, fechas);
      hojaActual = ci;

      if (date < fechas[ci] && ci != 0) {
        semana = ci - 1;
      } else {
        semana = ci;
      };

      loadCsvData();
    }).catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });

}

// Función para cargar los datos desde Google Sheets
function loadCsvData() {
  var table = document.getElementById("csvTable");
  table.innerHTML = "";
  
 var loader = document.getElementById("loader");
 loader.style.display = 'initial';
 
  fetch(urls[semana])
    .then(response => response.text())
    .then(data => {

      var lines = data.split('\n');

      // Limpia cualquier dato existente en la tabla


      // Procesa las líneas del archivo CSV

      var cells0 = lines[0].split(',');


      //Cambiar fecha
      var fecha = document.getElementById("date");
      fecha.textContent = cells0[1];


      var headersRow = table.insertRow();
      headersRow.style.fontWeight = 'bold';
      var headers = lines[1].split(',')

      headers.forEach(head => {
        var header = document.createElement("TH")
        header.innerHTML = head;
        headersRow.appendChild(header);
      });



      for (var i = 2; i < lines.length; i++) {
        var dataCells = lines[i].split(',')
        var newRow = table.insertRow();


        var cell1 = newRow.insertCell();
        cell1.textContent = dataCells[0];

        var cell2 = newRow.insertCell();
        cell2.textContent = dataCells[1];

        var cell3 = newRow.insertCell();
        cell3.textContent = dataCells[2];

        var cell4 = newRow.insertCell();
        cell4.textContent = dataCells[3];


      }
     
      loader.style.display = 'none';
    })
    .catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });
}

// Carga los datos al cargar la página
window.addEventListener("load", dateManager);



// Botones

var buttonPlus = document.getElementById("buttonPlus");
var buttonMinus = document.getElementById("buttonMinus");


function semanaPlus() {
  if (semana >= 3) {
    semana = 0;
  } else {
    semana++;
  }
  loadCsvData();
};

function semanaMinus() {
  if (semana <= 0) {
    semana = 3;
  } else {
    semana--;
  }
  loadCsvData();
};