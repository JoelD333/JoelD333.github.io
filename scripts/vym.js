
var hojaDatos = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkf5Mm5Lvr4LGWiaej9RAD7J1Jt1jfYz8XG1zLnIeFSsB04VZ0UxSGRfYONf57SpP6vt2GlKuRMiAY/pub?gid=1368245959&single=true&output=csv"
var datos = [];

var loader;
const fechas = [];
var semanaActual = 0;

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

function loadWeek(week) {

  loader.style.display = 'flex';

  var url = ('./files/weeks/' + week + ".html")

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        alert("Semana no disponible");
      } else {
        return response.text()
      }

    })
    .then((text) => {

      //Cargar HTML de la semana en una variable
      weekDoc = document.implementation.createHTMLDocument("Foo").documentElement;
      weekDoc.innerHTML = text;

      //Cargar elementos

      //Datos Semana

      document.querySelector("#semana").textContent = weekDoc.querySelector("#p1").textContent
      document.querySelector("#lecturaSemana").textContent = weekDoc.querySelector("#p2").textContent
      document.querySelector("#presidencia").textContent = weekDoc.querySelector("#p3").textContent

      //Tesoros de la biblia

      document.querySelector("#discursoTesoros").textContent = weekDoc.querySelector("#p5").textContent


      //Seamos Mejores Maestros

      const maestrosTable = document.querySelector("#maestrosTable");

      const maestrosParts = weekDoc.querySelectorAll(".du-fontSize--base.du-color--gold-700.du-margin-top--8.du-margin-bottom--0")
      var maestrosCount = 0

      maestrosTable.innerHTML = ""

      maestrosParts.forEach(part => {

        const partRow = maestrosTable.insertRow();
        const partRow2 = maestrosTable.insertRow();
        const cellAssignment = partRow.insertCell();
        const cellAssigned1 = partRow2.insertCell();
        const cellAssigned2 = partRow2.insertCell();


        const h3 = document.createElement("h3")
        h3.classList.add("maestros")
        const partTitle = document.createElement("strong")
        partTitle.textContent = part.textContent
        h3.appendChild(partTitle)
        cellAssignment.appendChild(h3)

        const assignedText1 = document.createElement("strong")
        const assignedText2 = document.createElement("strong")



        // Si la parte es 1era Conversasion, Revisita o Estudio
        if (partTitle.textContent.includes("Empiece conversaciones") || partTitle.textContent.includes("Haga revisitas") || partTitle.textContent.includes("Haga discípulos")) {



          //Asignado 1
          assignedText1.id = maestrosCount + "-0"
          assignedText1.textContent = "ASIGNAR"
          assignedText1.classList.add("strong-asignado")
          assignedText1.classList.add("staging-text")


          //Asignado 2
          assignedText2.id = maestrosCount + "-0"
          assignedText2.textContent = "ASIGNAR"
          assignedText2.classList.add("strong-asignado")
          assignedText2.classList.add("staging-text")


          //Append
          cellAssigned1.append(assignedText1)
          cellAssigned2.append(assignedText2)

        } else {
          assignedText1.id = maestrosCount + "-0"
          assignedText1.textContent = "ASIGNAR"
          assignedText1.classList.add("strong-asignado")
          assignedText1.classList.add("speech-text")

          cellAssigned1.append(assignedText1)
        }

        maestrosCount++;
      });

      //Nuestra Vida Cristiana

      document.querySelector("#cancionMedio").textContent = weekDoc.querySelectorAll(".du-fontSize--base.dc-icon--music.dc-icon-size--basePlus1.dc-icon-margin-horizontal--8")[1].textContent;

      const vidaTable = document.querySelector("#vidaTable");

      const vidaParts = weekDoc.querySelectorAll(".du-fontSize--base.du-color--maroon-600.du-margin-top--8.du-margin-bottom--0")
      var maestrosCount = 0

      vidaTable.innerHTML = ""



      vidaParts.forEach(part => {

        const partRow = vidaTable.insertRow()
        const partRow2 = vidaTable.insertRow()

        const cellAssignment = partRow.insertCell();
        const cellAssigned1 = partRow2.insertCell();
        const cellAssigned2 = partRow2.insertCell();

        const h3 = document.createElement("h3");
        h3.classList.add("vida");
        const partTitle = document.createElement("strong");
        partTitle.textContent = part.textContent;
        h3.appendChild(partTitle);
        cellAssignment.appendChild(h3);

        const assignedText1 = document.createElement("strong");

        assignedText1.textContent = "ASIGNAR";
        assignedText1.classList.add("strong-asignado");

        if (part.textContent.includes("Estudio bíblico")) {

          assignedText1.classList.add("estudio-text")
          assignedText1.id = "vidaSelectorEstudio";

          const assignedText2 = document.createElement("strong")



          assignedText2.id = "vidaSelectorEstudioLectura";
          assignedText2.classList.add("estudio-lectura-text")
          assignedText2.textContent = "ASIGNAR"
          assignedText2.classList.add("strong-asignado")


          cellAssigned1.append(assignedText1)

          cellAssigned2.append(assignedText2)


        } else {

          assignedText1.id = "vidaSelector" + maestrosCount + "_0"

          assignedText1.classList.add("vida-text")
          cellAssigned1.append(assignedText1)

        }

        maestrosCount++;
      });

      //CANCION FINAL
      document.querySelector("#cancionFinal").textContent = weekDoc.querySelector(".du-fontSize--base.du-borderStyle-top--solid.du-borderColor--borderDefault.du-borderWidth--2.du-margin-top--12.du-padding-top--4.du-padding-top-desktopOnly--5").textContent;

      loadData(week);
    });


}

function loadData(week) {

  const dateIndex = fechas.findIndex(e => e == week)

  if (dateIndex >= 0){
 
      const strongs = document.querySelectorAll(".strong-asignado")
      const cells = datos[dateIndex].split(",");

      console.log(cells);

      strongs.forEach(strong => {
        console.log("aa");
      });


      for (let idx = 0; idx < strongs.length; idx++) {
        
        console.log(idx)
        strongs[idx].textContent = cells[idx+1]; 
        console.log("Late" + idx)
      }
      loader.style.display = 'none';
    
   
  }else{
    alert("Error al cargar Semana")
    loader.style.display = 'none';
  }
}



function loadDates() {
 
  fetch(hojaDatos).then(response => response.text()).then(data => {
    datos = data.split("\r\n")

  
    datos.forEach(row => {
       fechas.push(row.split(",")[0])
     });

    loadWeek(weekInput.value);
  })


}



//Load Event
window.addEventListener("load", function () {

  weekInput.addEventListener("change", function () {
    loadWeek(weekInput.value)
  });

  loader = document.getElementById("loaderDiv");

  //Get current Week of Year
  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  let days = Math.floor((currentDate - startDate) /
    (24 * 60 * 60 * 1000));


   
  let weekNumber = Math.ceil(days / 7);

  //Si ya paso el Miercoles, pasar a la siguiente semana
  if(currentDate.getDay() > 3){
    weekNumber++;
  }
  //Add zero if one digit
  weekNumber = ("0" + weekNumber).slice(-2);


  let week = "2024-W" + weekNumber

  weekInput.value = week;

  loadDates();
});