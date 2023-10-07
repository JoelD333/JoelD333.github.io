// URL de la API de Google Sheets

var hoja1Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=284054636&single=true&widget=false&headers=false&chrome=false";
var hoja2Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=2036176846&single=true&widget=false&headers=false&chrome=false";
var hoja3Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=321154631&single=true&widget=false&headers=false&chrome=false";
var hoja4Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=0&single=true&widget=false&headers=false&chrome=false";
var hoja5Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=1184309177&single=true&widget=false&headers=false&chrome=false";

var dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pub?gid=664760905&single=true&output=csv";

const hojas = [hoja1Url, hoja2Url, hoja3Url, hoja4Url, hoja5Url]
const fechas = [];

var hojaActual = 0;

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

      for (var i = 1; i < 5; i++) {
        var cells = rows[i].split(',');
        fechas.push(cells[0]);
      }

      console.log(fechas);
      
      //Buscar la fecha mas cercana a la actual
      var date = new Date().getDate();
      ci = closestIndex(date, fechas);

      if (date < fechas[ci] && ci != 0) {
        hojaActual = ci - 1;
      } else {
        hojaActual = ci;
      };
      
     

      iframeManager();
    }).catch(error => {
      console.error("Error al cargar el archivo CSV:", error);
    });

}

function iframeManager() {
  
  var loader = document.getElementById("loader");
  loader.style.display = 'initial';
  
   iframe = document.getElementById("iframe");
   iframe.src = hojas[hojaActual];
   iframe.scrolling = 'no';
 
 loader.style.display = 'none';
 
 };

// Carga los datos al cargar la página
window.addEventListener("load", dateManager);


function hojaPlus() {
  if (hojaActual >= 4) {
    hojaActual = 0;
  } else {
    hojaActual++;
  }
  iframeManager();
};

function hojaMinus() {
  if (hojaActual <= 0) {
    hojaActual = 4;
  } else {
    hojaActual--;
  }
  iframeManager();
};
