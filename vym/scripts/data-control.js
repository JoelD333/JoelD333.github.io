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

                //Caso Columna id (0)
                //Agregar boton de eliminar y modificar!!
                case 0:
                    const deleteButton = document.createElement("button")
                    deleteButton.classList.add("edit-button")
                    deleteButton.textContent = '🗙'
                    deleteButton.addEventListener("click", function () { deleteStudent(row[i]) })

                    const editButton = document.createElement("button")
                    editButton.classList.add("edit-button")
                    editButton.textContent = '✎'
                    editButton.addEventListener("click", function () { editStudent(row[i]) })


                    tableCell.appendChild(editButton);
                    tableCell.appendChild(deleteButton);
                    tableRow.appendChild(tableCell);
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

    const form = document.querySelector("#addForm");
    const nombr = form.querySelector('input[name="nombr"]:checked');
    const sex = form.querySelector('input[name="sex"]:checked');
    const name = form.querySelector('#inputName');
    const lastName = form.querySelector('#inputLastName');

    const newStudent = [getNewId(), name.value, lastName.value, sex.value, nombr.value, ""];
    const csvEndline = ["", "", "", "", "", ""];

    data.pop();
    data.push(newStudent);
    data.push(csvEndline)
    createAndSaveCSV(data);
    fileSaved = false;
}

//Funcion para editar estudiante
//Toma los datos del forulario y los agrega al dataFile, luego los guarda y recarga la tabla.
function saveStudent() {

    const form = document.querySelector("#editForm");
    const nombr = form.querySelector('input[name="nombr"]:checked');
    const sex = form.querySelector('input[name="sex"]:checked');
    const name = form.querySelector('#inputName');
    const lastName = form.querySelector('#inputLastName');
    const id = form.querySelector('#textId').textContent.slice(22);

    data[id][1] = name.value;
    data[id][2] = lastName.value;
    data[id][3] = sex.value;
    data[id][4] = nombr.value;
   
    
    document.querySelector("#editDialog").style.display = 'none';
    
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

//Funcion para filtrar en la tabla

function tableFilter(inputValue) {
    const tabla = document.querySelector("#dataTable")


    for (let index = 0; index < tabla.rows.length; index++) {
        const row = tabla.rows[index];
        var rowValue = ""

        for (let cellIdx = 0; cellIdx < row.cells.length; cellIdx++) {
            const cell = row.cells[cellIdx];
            rowValue += cell.textContent;
        }


        rowValue = rowValue.toLowerCase();
        inputValue = inputValue.toLowerCase();
        if (!rowValue.includes(inputValue)) {
            row.style.display = 'none'
        } else {
            row.style.display = ''
        }

    }

    sortTable(2);
}

//Ordenar tabla
function sortTable(column, th) {

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


//Muestra el formulario para editar el Estudiante y carga los datos con el index elegido
function editStudent(id) {


    const editedIndex = data.findIndex(e => e[0] == id);
    const student = data[editedIndex];

    const editDialog = document.querySelector("#editDialog");
    editDialog.style.display = 'grid'

    editDialog.querySelector("#formCloseButton").addEventListener("click", function () {
        editDialog.style.display = 'none';
    })

    const name = editDialog.querySelector("#inputName");
    const lastName = editDialog.querySelector("#inputLastName");
    const nombr = editDialog.querySelectorAll('input[name="nombr"]');
    const sex = editDialog.querySelectorAll('input[name="sex"]');
    const idText = editDialog.querySelector('#textId');


    idText.textContent = "Editar Estudiante ID: " + id
    name.value = student[1];
    lastName.value = student[2];

    switch (student[3]) {

        case "H":
            sex[0].checked = true;
            break;
        case "M":
            sex[1].checked = true;
            break;
    }

    switch (student[4]) {

        case "0":
            nombr[0].checked = true;
            break;
        case "1":
            nombr[1].checked = true;
            break;
        case "2":
            nombr[2].checked = true;
            break;
        case "3":
            nombr[3].checked = true;
            break;
    }


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