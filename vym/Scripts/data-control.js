var data = []
var fileSaved = false
function loadData() {

    const csv = sessionStorage.getItem("db")
    data = parseToArray(csv)

    table = document.querySelector("#dataTable")
    table.innerHTML = ""

    for (let rowIdx = 1; rowIdx < data.length - 1; rowIdx++) {
        // console.log(row)
        const tableRow = table.insertRow();


        const row = data[rowIdx];
        for (let i = 1; i < row.length - 1; i++) {

            tableCell = document.createElement("td");


            switch (i) {
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
                    break;

                default:
                    tableCell.innerHTML = row[i];
                    break;

            }
            tableRow.appendChild(tableCell)



        }

    }
}

function saveButton() {

    //Agregar funcion al boton de guardar   
    download_txt(sessionStorage.getItem("db"));
    fileSaved = true;
}

//CSV a Array
function parseToArray(csvString) {
    //Split the array into rows, then split these rows into cells
    return csvString.split('\r\n').map(row => {
        return row.split(',')
    })
}

function addStudent() {
    const nombr = document.querySelector('input[name="nombr"]:checked')
    const sex = document.querySelector('input[name="sex"]:checked')
    const name = document.querySelector('#inputName')
    const lastName = document.querySelector('#inputLastName')

    if (nombr == null || sex == null) {
        alert("Rellenar todos los campos!");
    } else {


        const newStudent = [getNewId(), name.value, lastName.value, sex.value, nombr.value, "", ""]
        const csvEndLine = ["", "", "", "", "", "", ""]


        data.pop();
        data.push(newStudent);
        data.push(csvEndLine);

        createAndSaveCSV(data);
        fileSaved = false;
    }


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

