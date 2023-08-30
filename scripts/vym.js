var dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pub?gid=664760905&single=true&output=csv";

var hoja1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pubhtml?gid=921986835&single=true&widget=false&headers=false&chrome=false";
var hoja2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pubhtml?gid=1998428620&single=true&widget=false&headers=false&chrome=false";
var hoja3 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pubhtml?gid=1633400355&single=true&widget=false&headers=false&chrome=false";
var hoja4 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pubhtml?gid=1147903656&single=true&widget=false&headers=false&chrome=false";

const hojas = [hoja1, hoja2, hoja3, hoja4];
const fechas = [];
var hojaActual = 0;

const closestIndex = (num, arr) => {
    let curr = arr[0], diff = Math.abs(num - curr);
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
            for (var i = 1; i < rows.length; i++) {
                var cells = rows[i].split(',');
                fechas.push(cells[0]);
            }

            //Buscar la fecha mas cercana a la actual
            var date = new Date().getDate();
            ci = closestIndex(date, fechas);
            hojaActual = ci;

            if (date > fechas[ci] && ci < fechas.length - 1) {
                hojaActual = ci + 1;
            } else {
                hojaActual = ci;
            };

            iframeManager();
        }).catch(error => {
            console.error("Error al cargar el archivo CSV:", error);
        });

}

function iframeManager() {
    iframe = document.getElementById("iframe")
    iframe.src = hojas[hojaActual]

};

function hojaPlus() {
    if (hojaActual >= 3) {
        hojaActual=0;
    }else{
      hojaActual++;
    }
    iframeManager();
};
function hojaMinus() {
    if (hojaActual <= 0) {
        hojaActual=3;
    }else{
      hojaActual--;
    }
    iframeManager();
};

window.addEventListener("load", dateManager);