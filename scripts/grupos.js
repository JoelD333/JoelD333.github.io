// URL de la API de Google Sheets

const baseSheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid={sheetId}`

const sheet = [
  "284054636",
  "2036176846",
  "321154631",
  "0",
  "1184309177"
];

var hoja1Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=284054636&single=true&widget=false&headers=false&chrome=false";
var hoja2Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=2036176846&single=true&widget=false&headers=false&chrome=false";
var hoja3Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=321154631&single=true&widget=false&headers=false&chrome=false";
var hoja4Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=0&single=true&widget=false&headers=false&chrome=false";
var hoja5Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReGtBiAnM7etSVDdFHJ8kOxK27jQHFXTJnqLZm-tdVvl2Hii2fvdEtjdz2JKdYccE00sf2jz84VZO9/pubhtml?gid=1184309177&single=true&widget=false&headers=false&chrome=false";


console.log(hoja1Url);

var dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pub?gid=664760905&single=true&output=csv";

const hojas = [hoja1Url, hoja2Url, hoja3Url, hoja4Url, hoja5Url]
const fechas = [];

var hojaActual = 0;

//Número más cercano, retorna índice del array
const closestIndex = (num, arr) => {
  let index = arr.reduce((closestIndex, currentVal, currentIndex) => {
      const currentDiff = Math.abs(num - currentVal);
      const closestDiff = Math.abs(num - arr[closestIndex]);
      return (currentDiff < closestDiff) ? currentIndex : closestIndex;
  }, 0);
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
   iframe.src = hojas[0];
   iframe.scrolling = 'no';
 
 loader.style.display = 'none';
 };

 //Usar DOMContentLoader
window.addEventListener("load", dateManager);

function hojaPlus() {
  hojaActual < 4 ? hojaActual++ : hojaActual = 0;
  iframeManager();
};

function hojaMinus() {
  hojaActual > 0 ? hojaActual-- : hojaActual = 4;
  iframeManager();
};