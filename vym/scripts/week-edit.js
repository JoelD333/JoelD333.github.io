var weekDoc = "";
var arrayAssignements = [];

function highlightDuplicated() {

  const texts = document.querySelectorAll(".strong-asignado")

  texts.forEach(text => {

    text.classList.remove('duplicated');


    texts.forEach(text2 => {

      if (text != text2 && text.textContent != "ASIGNAR") {
        if (text.textContent == text2.textContent) {
          text.classList.add("duplicated");
        }
      }

    })





  })
}

// Guarada la fecha de la semana en el DataArray y lo guarda
function saveDates() {

  const csv = sessionStorage.getItem("db")

  var data = parseToArray(csv, true)

  const week = document.querySelector("#weekSelector")
 

  fetch("./Files/AssigmentsDB.csv")
  .then(response => response.text())
  .then(assCsv => {
    const assignementsData = parseToArray(assCsv)

    arrayAssignements.forEach(assignment => {    
      student = data.find(row => row[0] == assignment[0])
      //Guardar Fecha
      student[5] = getDateOfWeek(week.value)
      // Guardar Parte
      student[6] = assignementsData.find(e => e[0] == assignment[1])[1]
    })
  
    createAndSaveCSV(data);  
  
  })
  

}

function getDateOfWeek(week) {

  const w = week.slice(-2)
  const y = week.slice(0, 4)


  var d = (1 + (w - 1) * 7) + 2;

  const date = new Date(y, 0, d)

  const newDate = date.toISOString().slice(2, 10);
  return newDate;
}

//Transform Data Array to CSV
function createAndSaveCSV(csvArray, fileName, rowDelimiter = '\r\n') {

  const csvString = csvArray.join(rowDelimiter);
  sessionStorage.setItem("db", csvString)
  download_txt(csvString);
}

//Guardar texto Como CSV
function download_txt(textToSave) {
  var hiddenElement = document.createElement('a');

  hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'db.csv';
  hiddenElement.click();

}

function savePDF() {

  document.querySelectorAll(".select-button").forEach(e => {
    e.style.display = "none"
  });


  // Elemento que se va a renderizar
  const element = document.querySelector("#mainDiv");
  const week = document.getElementById("semana").textContent

  // Guardar PDF
  var opt = {
    margin: 0,
    filename: week,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 10 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  //Crear y Guardar Imagen!
  window.html2pdf().set(opt).from(element).toImg().outputImg().then(img=>{
    var hiddenElement = document.createElement('a');

     hiddenElement.href = img.src;
     hiddenElement.target = '_blank';
     hiddenElement.download = 'myFile.jpeg';
     hiddenElement.click();
  })

  
}

//Cargar datos de la semana
function loadWeek(week) {

  document.querySelectorAll(".select-button").forEach(e => {
    e.style.display = "inline-block"
  });


  const url = "./Files/Weeks/" + week + ".html"
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        alert("Semana no disponible");
        location.reload();
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
        const cellAssignment = partRow.insertCell();
        const cellAssigned1 = partRow.insertCell();
        const cellAssigned2 = partRow.insertCell();


        const h3 = document.createElement("h3")
        h3.classList.add("maestros")
        const partTitle = document.createElement("strong")
        partTitle.textContent = part.textContent
        h3.appendChild(partTitle)
        cellAssignment.appendChild(h3)


        const assignedButton1 = document.createElement("button")
        const assignedButton2 = document.createElement("button")
        const assignedText1 = document.createElement("strong")
        const assignedText2 = document.createElement("strong")

        

        // Si la parte es 1era Conversasion, Revisita o Estudio
        if (partTitle.textContent.includes("Empiece conversaciones") || partTitle.textContent.includes("Haga revisitas") || partTitle.textContent.includes("Haga discípulos")) {
       


          //Asignado 1
          assignedText1.id = maestrosCount + "-0"
          assignedText1.textContent = "ASIGNAR"
          assignedText1.classList.add("strong-asignado")
          assignedText1.classList.add("staging-text")

        
          assignedButton1.textContent = "✎"
          assignedButton1.type = "button"
          assignedButton1.classList.add("staging-button")
          assignedButton1.classList.add("select-button")
          //Asignado 2
          assignedText2.id = maestrosCount + "-0"
          assignedText2.textContent = "ASIGNAR"
          assignedText2.classList.add("strong-asignado")
          assignedText2.classList.add("staging-text")

          
          assignedButton2.textContent = "✎"
          assignedButton2.type = "button"
          assignedButton2.classList.add("staging-button")
          assignedButton2.classList.add("select-button")



          if(partTitle.textContent.includes("Empiece conversaciones")){
            assignedButton1.id = "4"
            assignedButton2.id = "4"
          }
          if(partTitle.textContent.includes("Haga revisitas")){
            assignedButton1.id = "5"
            assignedButton2.id = "5"
          }
          if(partTitle.textContent.includes("Haga discípulos")){
            assignedButton1.id = "6"
            assignedButton2.id = "6"
          }
          

          //Append
          cellAssigned1.append(assignedText1)
          cellAssigned1.append(assignedButton1)

          cellAssigned2.append(assignedText2)
          cellAssigned2.append(assignedButton2)

        } else {        
          assignedText1.id = maestrosCount + "-0"
          assignedText1.textContent = "ASIGNAR"
          assignedText1.classList.add("strong-asignado")
          assignedText1.classList.add("speech-text")

          assignedButton1.id = maestrosCount + "-0"
          assignedButton1.textContent = "✎"
          assignedButton1.type = "button"
          assignedButton1.classList.add("speech-button")
          assignedButton1.classList.add("select-button")

          cellAssigned1.append(assignedText1)
          cellAssigned1.append(assignedButton1)
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

        const cellAssignment = partRow.insertCell();
        const cellAssigned1 = partRow.insertCell();
        const cellAssigned2 = partRow.insertCell();


        const h3 = document.createElement("h3")
        h3.classList.add("vida")
        const partTitle = document.createElement("strong")
        partTitle.textContent = part.textContent
        h3.appendChild(partTitle)
        cellAssignment.appendChild(h3)



        const assignedButton1 = document.createElement("button")
        const assignedText1 = document.createElement("strong")

        assignedButton1.textContent = "✎"
        assignedButton1.type = "button"
        assignedButton1.classList.add("select-button")

        assignedText1.textContent = "ASIGNAR"
        assignedText1.classList.add("strong-asignado")

        if (part.textContent.includes("Estudio bíblico")) {

          assignedText1.classList.add("estudio-text")
          assignedButton1.classList.add("estudio-button")
          assignedButton1.id = "vidaSelectorEstudio";
          assignedText1.id = "vidaSelectorEstudio";


          const assignedButton2 = document.createElement("button")
          const assignedText2 = document.createElement("strong")



          assignedText2.id = "vidaSelectorEstudioLectura";
          assignedText2.classList.add("estudio-lectura-text")
          assignedText2.textContent = "ASIGNAR"
          assignedText2.classList.add("strong-asignado")

          assignedButton2.id = "vidaSelectorEstudioLectura";
          assignedButton2.textContent = "✎"
          assignedButton2.type = "button"
          assignedButton2.classList.add("select-button")
          assignedButton2.classList.add("estudio-lectura-button")




          cellAssigned1.append(assignedText1)
          cellAssigned1.append(assignedButton1)
          cellAssigned2.append(assignedText2)
          cellAssigned2.append(assignedButton2)

        } else {

          assignedButton1.id = "vidaSelector" + maestrosCount + "_0"
          assignedText1.id = "vidaSelector" + maestrosCount + "_0"

          assignedButton1.classList.add("vida-button")
          assignedText1.classList.add("vida-text")
          cellAssigned1.append(assignedText1)
          cellAssigned1.append(assignedButton1)

        }

        maestrosCount++;
      });


      //CANCION FINAL
      document.querySelector("#cancionFinal").textContent = weekDoc.querySelector(".du-fontSize--base.du-borderStyle-top--solid.du-borderColor--borderDefault.du-borderWidth--2.du-margin-top--12.du-padding-top--4.du-padding-top-desktopOnly--5").textContent;

      loadDB();
    });


}

//Cargar Lista de Asignables
function loadDB() {

  const csv = sessionStorage.getItem("db")

  var data = parseToArray(csv, true)
  data = sort(data);
  data = data.slice(1);


  //Select Selectors
  const textPresidente = document.querySelector("#asignadoPresidencia");
  const buttonPresidente = document.querySelector("#asignadoPresidenciaButton");

  const buttonTesoros = document.querySelector("#asignadoDiscursoTesorosButton");
  const textTesoros = document.querySelector("#asignadoDiscursoTesoros");


  const buttonPerlas = document.querySelector("#asignadoPerlasButton");
  const textPerlas = document.querySelector("#asignadoPerlas");

  const buttonLectura = document.querySelector("#asignadoLecturaButton");
  const textLectura = document.querySelector("#asignadoLectura");


  const oracionFinal = document.querySelector("#asignadoOracionFinal");



  //Llenar Presidentes

  buttonPresidente.addEventListener("click", function () { showTable(data, textPresidente, 3, 0) })

  //Llenar Discurso Tesoros

  buttonTesoros.addEventListener("click", function () { showTable(data, textTesoros, 2, 1) })

  //Llenar Perlas

  buttonPerlas.addEventListener("click", function () { showTable(data, textPerlas, 2, 2) })

  //Llenar Lectura

  buttonLectura.addEventListener("click", function () { showTable(data, textLectura, 0, 3, "M") })



  //Llenar Maestros

  //Get Selects
  var maestrosStagingButtonList = document.querySelectorAll(".staging-button")
  var maestrosStagingTextList = document.querySelectorAll(".staging-text")
  var maestrosSpeechButtonList = document.querySelectorAll(".speech-button")
  var maestrosSpeechTextList = document.querySelectorAll(".speech-text")



  for (let index = 0; index < maestrosStagingButtonList.length; index++) {

    let button = maestrosStagingButtonList[index];
    let stagingPart = button.id;
    button.addEventListener("click", function () { showTable(data, maestrosStagingTextList[index], 0, stagingPart) })

  }

  for (let index = 0; index < maestrosSpeechButtonList.length; index++) {

    maestrosSpeechButtonList[index].addEventListener("click", function () { showTable(data, maestrosSpeechTextList[index], 1, 7, "M") })

  }

  //Llenar Vida

  //Get Selects
  const vidaButtons = document.querySelectorAll(".vida-button")
  const vidaTexts = document.querySelectorAll(".vida-text")

  const estudioButton = document.querySelector(".estudio-button");
  const estudioText = document.querySelector(".estudio-text");

  const estudioLecturaButton = document.querySelector(".estudio-lectura-button");
  const estudioLecturaText = document.querySelector(".estudio-lectura-text");

  const oracionFinalButton = document.querySelector("#asignadoOracionFinalButton");
  const oracionFinalText = document.querySelector("#asignadoOracionFinalText");

  //Llenar partes de Vida excepto Estudio
  for (let index = 0; index < vidaButtons.length; index++) {
    vidaButtons[index].addEventListener("click", function () { showTable(data, vidaTexts[index], 2, 9) })
  }

  //Llenar Estudio biblico

  //Llenar Conductor
  estudioButton.addEventListener("click", function () { showTable(data, estudioText, 3, 10) })

  //Llenar Lector
  estudioLecturaButton.addEventListener("click", function () { showTable(data, estudioLecturaText, 2, 11) })


  //Llenar Oracion Final

  oracionFinalButton.addEventListener("click", function () { showTable(data, oracionFinalText, 1, 12, "M") })


}

//Return Ico matching gender
function sexIcon(sex) {

  sexIco = "";

  if (sex == "H") { sexIco = "🚹" };
  if (sex == "M") { sexIco = "🚺" };

  return sexIco

}


//Cambiar formato de Fecha yyyy-mm-dd to dd/mm/yyyy
function formatDate(date) {

  const d = date.split("-")
  const orderedDate = d[2] + "/" + d[1] + "/" + d[0]

  return orderedDate;
}

//Ordernar el Array por Fecha
function sort(csvArray, ascending = true) {
  const idxToSort = 5;

  //iterate over the whole table except row [0] as this is the headers
  const sortedRows = csvArray.slice(1, csvArray.length).sort(function (a, b) {
    if (ascending) return a[idxToSort] > b[idxToSort] ? 1 : -1
    return a[idxToSort] < b[idxToSort] ? 1 : -1
  })
  //Put the headers back on
  return [csvArray[0]].concat(sortedRows)
}

//CSV TO ARRAY
function parseToArray(csvString) {
  //Split the array into rows, then split these rows into cells
  return csvString.split('\r\n').map(row => {
    return row.split(',')
  })
}


//Agregar EventListener al Selector de semanas
function weekInputHandler() {

  const selector = document.querySelector("#weekSelector")
  selector.addEventListener("change", function () { changeWeek() })

  const submit = document.querySelector("#mainForm")

  submit.addEventListener("submit", (e) => {
    e.preventDefault();
    saveDates();
    savePDF();
  })


}



//Muestra la tabla y la llena con los hermanos disponibles para la asignacion
function showTable(data, textAsignacion, nombr, part, sex) {

  //Fetch AssigmentsDB
  fetch("./Files/AssigmentsDB.csv")
    .then(response => response.text())
    .then(assCsv => {

      const assignementsData = parseToArray(assCsv)

      //Buscar Tabla
      const table = document.querySelector("#dataTable")
      table.innerHTML = ""

      const titulo = document.querySelector("#strongAsignacion")
      titulo.textContent = assignementsData.find(e => e[0] == part)[1];

      //Mostrar el Dialog
      showHideSelector();

      //Llenar Tabla
      data.filter(e => Number(e[4]) >= nombr && e[3] != sex).forEach(row => {

        const newRow = table.insertRow();
        newRow.id = row[0]
        newRow.style.cursor = "pointer"
        newRow.addEventListener("click", function () { selectRow(newRow) })

        //Llenar tabla con los asignados posibles
        for (i = 1; i < row.length; i++) {


          switch (i) {

            //Omitir columna 4 Nombramiento
            case 4:
              continue;
              break;


            //Caso Columna sexo (3)
            case 3: {

              const newCell = newRow.insertCell();
              newCell.textContent = sexIcon(row[i])
              break;
            }

            //Caso Columna Fecha Ultima Parte
            case 5:{
              const newCell = newRow.insertCell();
              const date = formatDate(row[i]);
              date ==  "undefined/undefined/" ? newCell.textContent = "Sin Datos" : newCell.textContent = date                            
              break;
            }

            //Caso default
            default: {
              const newCell = newRow.insertCell();
              newCell.textContent = row[i];

              break;
            }

          }
        }

      })

      //Click Listener y funcion para elegir  

      //Remplazar boton por el mismo, lo que quita los listeners
      const assignButton = document.querySelector("#assignButton");
      assignButton.replaceWith(assignButton.cloneNode(true));

      //Agregar lsitener al boton
      document.querySelector("#assignButton").addEventListener("click", function () {

        const selectedRow = document.querySelector(".row-selected")
        const selectedRowCells = selectedRow.children

        textAsignacion.textContent = selectedRowCells[0].textContent + ' ' + selectedRowCells[1].textContent        

        arrayAssignements.push([selectedRow.id, part])

        showHideSelector();
        highlightDuplicated();
      })
    })

}

function sortTable(column, th, data) {

  const csv = sessionStorage.getItem("db")

  const actual = parseToArray(csv)



  //Ordenar segun columna
  var sortedData = actual.sort(function (a, b) {


    if (a[column] < b[column]) {
      return -1;
    }
    if (a[column] < b[column]) {
      return 1;
    }
    return 0;
  });

  //Reiniciar Headers

  const headers = document.querySelectorAll("th")

  headers.forEach(header => {
    header.innerText = header.dataset.ot;
  });

  //Chequear si ya estaba ordenado asi e invertir el orden si es asi 
  //Agregar flechita que indica direccion
  if (sortedData.toString() === data.toString()) {
    sortedData.reverse()
    th.innerText = th.dataset.ot.slice(0, -1) + "▾"
  } else {
    th.innerText = th.dataset.ot.slice(0, -1) + "▴"
  }



  createAndSaveCSV(sortedData);
}

//Cargar a la semana Seleccionada
function changeWeek() {
  const selector = document.querySelector("#weekSelector")
  const selection = selector.value
  loadWeek(selection);
}

function showHideSelector() {
  const div = document.querySelector("#selectFormDiv")

  if (div.style.display == "flex") {
    div.style.display = "none"
  } else {
    div.style.display = "flex"
  }

}

//Funcion para resaltar Fila en una tabla
function selectRow(clickedRow) {

  document.querySelectorAll("tr").forEach(tr => {
    tr.classList.remove("row-selected")
  })

  clickedRow.classList.add("row-selected");
}

window.addEventListener("load", function () { weekInputHandler(); }, false);