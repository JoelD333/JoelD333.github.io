var data = []
var fileSaved = false
function loadData() {

    const csv = sessionStorage.getItem("db")
    data = parseToArray(csv)

    table = document.querySelector("#dataTable")
    table.innerHTML = ""

    for (let rowIdx = 1; rowIdx < data.length - 1; rowIdx++) {
        const tableRow = table.insertRow();
        const row = data[rowIdx];


        //Agregar Datos
        for (let i = 0; i < row.length; i++) {


            tableCell = document.createElement("td");

            switch (i) {

                //Caso Columna id (3)
                //Agregar boton de eliminar!!
                case 0:
                    const button = document.createElement("button")
                    button.classList.add("delete-button")
                    button.textContent = '🗙'

                    button.addEventListener("click", function () { deleteStudent(row[i]) })

                    tableCell.appendChild(button)
                    tableRow.appendChild(tableCell)
                    break;




                //Caso Columna sexo (3)
                case 3:
                    switch (row[i]) {
                        case "H":
                            tableCell.innerHTML = "🚹";
                            break;

                        case "M":
                            tableCell.innerHTML = "🚺";
                            break;
                    }
                    tableRow.insertBefore(tableCell, tableRow.lastChild)
                    break;


                //Caso Columna nombramiento (4)
                case 4:

                    switch (row[i]) {
                        case "0":
                            tableCell.innerHTML = "No Bautizado";
                            break;

                        case "1":
                            tableCell.innerHTML = "Bautizado";
                            break;
                        case "2":
                            tableCell.innerHTML = "SM";
                            break;
                        case "3":
                            tableCell.innerHTML = "Anciano";
                            break;
                    }
                    tableRow.insertBefore(tableCell, tableRow.lastChild)
                    break;


                //Caso default
                default:
                    tableCell.innerHTML = row[i];
                    tableRow.insertBefore(tableCell, tableRow.lastChild)
                    break;


            }

        }

    }
}


//Funcion que elimina Student de la tabla con ID dado
function deleteStudent(id) {

    //Prompt an alert

    swal({
        buttons: ["No", "Si"],
        title: "¿Eliminar?",
        text: "Se eliminará por completo los datos de este Estudiante",
        icon: "warning",
        dangerMode: true,
    })
        .then(willDelete => {
            if (willDelete) {
                //Delete User
                const index = data.findIndex(e => e[0] == id)
                data = data.slice(0, index).concat(data.slice(index + 1));
                createAndSaveCSV(data);
                fileSaved = false;

                swal("Eliminado!", "Se ha eliminado este estudiante!", "success");
            }
        });



}


//Funcion para guardar los datos editados
function saveButton() {

    //Agregar funcion al boton de guardar   
    download_txt(sessionStorage.getItem("db"));
    fileSaved = true;
    swal("Guardado!", "Se guardo el archivo", "success");
}

//CSV a Array
function parseToArray(csvString) {
    //Split the array into rows, then split these rows into cells
    return csvString.split('\r\n').map(row => {
        return row.split(',')
    })
}


//Funcion para agregar estudiante
function addStudent() {
    const nombr = document.querySelector('input[name="nombr"]:checked')
    const sex = document.querySelector('input[name="sex"]:checked')
    const name = document.querySelector('#inputName')
    const lastName = document.querySelector('#inputLastName')

    const newStudent = [getNewId(), name.value, lastName.value, sex.value, nombr.value, ""]
    const csvEndline = ["", "", "", "", "", ""]

    data.pop();
    data.push(newStudent);
    data.push(csvEndline)
    createAndSaveCSV(data);
    fileSaved = false;



}


//Busca ultima Id del Array y Retorna LastID++
function getNewId() {

    const lastId = Number(data[data.length - 2][0])
    return (lastId + 1).toString();

}


//Habilitar y Deshabilitar las opciones del formulario
function formControl() {
    const radioSM = document.querySelector("#nombr3")
    const radioA = document.querySelector("#nombr4")

    document.querySelector("#sex2").addEventListener("change", function () {
        if (this.checked) {
            with (radioA) {
                disabled = true
                checked = false
            }

            with (radioSM) {
                disabled = true
                checked = false
            }

        }
    })
    document.querySelector("#sex1").addEventListener("change", function () {
        if (this.checked) {
            radioA.disabled = false
            radioSM.disabled = false
        }
    })

}

//Array a CSV
function createAndSaveCSV(csvArray, fileName, rowDelimiter = '\r\n') {

    const csvString = csvArray.join(rowDelimiter)
    sessionStorage.setItem("db", csvString)
    loadData()

}

//Guardar texto Como CSV
function download_txt(textToSave) {
    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'db.csv';
    hiddenElement.click();

}



window.addEventListener("load", function () { loadData(), formControl(); }, false);

//Alertar si no se guardaron los cambios!

window.addEventListener('beforeunload', function (event) {
    if (!fileSaved) {
        const mensaje = '¡Atención! Estás intentando cerrar la página sin guardar los cambios!.';
        event.returnValue = mensaje;
        return mensaje;
     }
});

