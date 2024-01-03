var dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pub?gid=664760905&single=true&output=csv";

const gids = ["284054636", "2036176846", "321154631", "0", "1184309177"]
const fechas = [];

var gidActual = 0;

var loader;
var table;

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
  //Cargar loader y tabla en variable
  loader = document.querySelector("#loader");
  table = document.querySelector("#table");

  //Cargar las fechas desde el documento
  fetch(dataUrl)
    .then(response => response.text())
    .then(data => {
      var rows = data.split('\n');
      //Cargar fechas en el Array
      const fechas = [];

      for (var i = 1; i < 5; i++) {
        var cells = rows[i].split(',');
        fechas.push(cells[0]);
      }

      console.log(fechas);

      //Buscar la fecha mas cercana a la actual
      var date = new Date().getDate();
      ci = closestIndex(date, fechas);

      if (date < fechas[ci] && ci != 0) {
        gidActual = ci - 1;
      } else {
        gidActual = ci;
      };



      loadWeek();
    }).catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });

}

// Carga los datos al cargar la página
window.addEventListener("load", dateManager);


function hojaPlus() {
  loader.style.display = 'initial';

  if (gidActual >= 4) {
    gidActual = 0;
  } else {
    gidActual++;
  }
  loadWeek();
};

function hojaMinus() {
  loader.style.display = 'initial';

  if (gidActual <= 0) {
    gidActual = 4;
  } else {
    gidActual--;
  }
  loadWeek();
};


function loadWeek() {


  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pub?gid=" + gids[gidActual] + "&single=true&output=csv"

  fetch(csvUrl).then(response => response.text())
    .then(data => {

      table.innerHTML = "";

      var dataRows = data.split('\n');


      // Add Header

      const thead = document.createElement("thead");
      const th = document.createElement("th")
      const cellText = document.createTextNode(dataRows[0].split(',')[0])
      th.appendChild(cellText);
      th.colSpan = 6;
      thead.appendChild(th);
      table.appendChild(thead);


      [...dataRows].slice(2).forEach(dataRow => {

        const dataCells = dataRow.split(',');
        const tbody = document.createElement("tbody");



        for (let index = 0; index < dataCells.length; index++) {
          const dataCell = dataCells[index]

          let tableRow = document.createElement("tr");
          
          let rowCell2 = document.createElement("td");
          const rowCell1 = document.createElement("td");
          switch (index) {
            
            case 0: {              
              rowCell1.innerHTML = "Fecha"        
              break;      
            }
            case 1: {              
              rowCell1.innerHTML = "Hora"
              break;
            }
            case 2: {              
              rowCell1.innerHTML = "Lugar"
              break;
            }
            case 3: {              
              rowCell1.innerHTML = "Actividad"
              break;
            }
            case 4: {              
              rowCell1.innerHTML = "Conductores"
              break;
            }
          }

          rowCell2.textContent = dataCell

          tableRow.appendChild(rowCell1);
          tableRow.appendChild(rowCell2);
          tbody.appendChild(tableRow);

        }

        table.appendChild(tbody);

      });
    })


  table.style.display = 'table';
  loader.style.display = 'none';
}