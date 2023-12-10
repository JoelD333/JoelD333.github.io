var weekDoc = "";


function savePDF() {

    //Remove dates

    document.querySelectorAll("select").forEach(e => {


        //  element.classList.add = "hide"
        const selectedOption = e.options[e.selectedIndex]
        const selectText = selectedOption.text;
        e.classList.add("hide-border")

        selectedOption.text = selectText.slice(0, -10)
    });





    // Choose the element that your content will be rendered to.
    const element = document.getElementById('mainDiv');
    const week = document.getElementById("semana").textContent
    // Choose the element and save the PDF for your user.
    var opt = {
        margin: 1,
        filename: week,
        image: { type: 'jpeg', quality: 1000 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).toImg().save();

   location.reload();
}



//Cargar datos de la semana
function loadWeek(week) {

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
            //Maestros

            const maestrosList = document.querySelector("#maestrosList");

            const maestrosParts = weekDoc.querySelectorAll(".du-fontSize--base.du-color--gold-700.du-margin-top--8.du-margin-bottom--0")
            var maestrosCount = 0

            maestrosList.innerHTML = ""

            maestrosParts.forEach(part => {

                const li = document.createElement("li")
                const h3 = document.createElement("h3")

                h3.textContent = part.textContent
                h3.classList.add("maestros")


                if (h3.textContent.includes("Empiece conversaciones") || h3.textContent.includes("Haga revisitas") || h3.textContent.includes("Haga discípulos")) {
                    const selector1 = document.createElement("select")
                    const selector2 = document.createElement("select")


                    selector1.id = maestrosCount + "-0"
                    selector1.classList.add("staging")



                    selector2.id = maestrosCount + "-1"
                    selector2.classList.add("staging")


                    h3.append(selector1)
                    h3.append(selector2)
                } else {
                    const selector1 = document.createElement("select")


                    selector1.id = maestrosCount
                    selector1.classList.add("speech")


                    h3.append(selector1)
                }




                li.append(h3)
                maestrosList.append(li)
                maestrosCount++;
            });

            //Vida

            const cancionMedio = document.querySelector("#cancionMedio").textContent = weekDoc.querySelectorAll(".du-fontSize--base.dc-icon--music.dc-icon-size--basePlus1.dc-icon-margin-horizontal--8")[1].textContent;
            const vidaList = document.querySelector("#vidaList");

            const vidaParts = weekDoc.querySelectorAll(".du-fontSize--base.du-color--maroon-600.du-margin-top--8.du-margin-bottom--0")
            var maestrosCount = 0

            vidaList.innerHTML = ""

            vidaParts.forEach(part => {

                const li = document.createElement("li")
                const h3 = document.createElement("h3")

                const selector1 = document.createElement("select")


                h3.textContent = part.textContent
                h3.classList.add("vida")



                if (part.textContent.includes("Estudio bíblico")) {
                    const selector2 = document.createElement("select")

                    selector1.id = "vidaSelectorEstudio";
                    selector2.id = "vidaSelectorEstudioLectura";

                    h3.append(selector1)
                    h3.append(selector2)
                } else {
                    selector1.id = "vidaSelector" + maestrosCount + "_0"
                    selector1.classList.add("vidaSelector")
                    h3.append(selector1)
                }




                li.append(h3)
                vidaList.append(li)
                maestrosCount++;
            });

            document.querySelector("#cancionFinal").textContent = weekDoc.querySelector(".du-fontSize--base.du-borderStyle-top--solid.du-borderColor--borderDefault.du-borderWidth--2.du-margin-top--12.du-padding-top--4.du-padding-top-desktopOnly--5").textContent;

            loadDB();
        });


}

//Cargar Lista de Asignables
function loadDB() {

    const csv = sessionStorage.getItem("db")


    data = parseToArray(csv, true)
    data = data.slice(1)

    //Select Selectors
    const selectPresidente = document.querySelector("#asignadoPresidencia");
    const selectTesoros = document.querySelector("#asignadoDiscursoTesoros");
    const selectPerlas = document.querySelector("#asignadoPerlas");
    const selectLectura = document.querySelector("#asignadoLectura");
    const oracionFinal = document.querySelector("#asignadoOracionFinal");



    //Llenar Presidentes

    selectPresidente.innerHTML = "<option>    </option>";

    data.forEach(fila => {

        if (fila[4] == "3") {
            const date = formatDate(fila[5])

            const option = document.createElement("option")
            option.textContent = fila[1] + " " + fila[2] + " (" + date + ")"
            selectPresidente.append(option)
        }
    });

    //Llenar Discurso Tesoros

    selectTesoros.innerHTML = "<option>    </option>";

    data.forEach(fila => {

        if (fila[4] == "3" || fila[4] == "2") {
            const date = formatDate(fila[5])

            const option = document.createElement("option")
            option.textContent = fila[1] + " " + fila[2] + " (" + date + ")"
            selectTesoros.append(option)
        }
    });

    //Llenar Perlas

    selectPerlas.innerHTML = "<option>    </option>";

    data.forEach(fila => {

        if (fila[4] == "3" || fila[4] == "2") {
            const date = formatDate(fila[5])

            const option = document.createElement("option")
            option.textContent = fila[1] + " " + fila[2] + " (" + date + ")"
            selectPerlas.append(option)
        }
    });

    //Llenar Lectura

    selectLectura.innerHTML = "<option>    </option>";

    data.filter(e => e[3] == "H").forEach(e => {

        const date = formatDate(e[5])
        const option = document.createElement("option")
        option.textContent = e[1] + " " + e[2] + " (" + date + ")"
        selectLectura.append(option)

    });



    //Llenar Maestros

    //Get Selects
    var maestrosStagingList = document.querySelectorAll("select.staging")
    var maestrosSpeechList = document.querySelectorAll("select.speech")


    maestrosSpeechList.forEach(select => {

        select.innerHTML = "<option>    </option>";
        data.filter(e => e[3] == "H").forEach(e => {

            const date = formatDate(e[5])
            const option = document.createElement("option")
            option.textContent = e[1] + " " + e[2] + " (" + date + ")"
            select.append(option)

        });

    });

    maestrosStagingList.forEach(select => {

        select.innerHTML = "<option>    </option>";

        data.filter(e => e[0] != "").forEach(e => {


            const option = document.createElement("option")
            const date = formatDate(e[5])
            const sex = sexIcon(e[3])
            option.textContent = sex + e[1] + " " + e[2] + " (" + date + ")"
            select.append(option)

        });

    });


    //Llenar Vida

    //Get Selects
    const vidaSelectors = document.querySelectorAll("select.vidaSelector")
    const selectEstudio = document.querySelector("#vidaSelectorEstudio");
    const selectEstudioLectura = document.querySelector("#vidaSelectorEstudioLectura");

    //Llenar partes de Vida excepto Estudio
    vidaSelectors.forEach(select => {

        select.innerHTML = "<option>    </option>";

        data.filter(e => Number(e[4]) > 1).forEach(e => {

            const option = document.createElement("option")
            const date = formatDate(e[5])
            option.textContent = e[1] + " " + e[2] + " (" + date + ")"
            select.append(option)

        });

    });

    //Llenar Estudio biblico

    //Llenar Conductor
    selectEstudio.innerHTML = "<option>    </option>";
    data.filter(e => e[4] == 3).forEach(e => {


        const option = document.createElement("option")
        const date = formatDate(e[5])
        option.textContent = e[1] + " " + e[2] + " (" + date + ")"
        selectEstudio.append(option)

    });

    //Llenar Lector
    selectEstudioLectura.innerHTML = "<option>    </option>";
    data.filter(e => e[4] > 1).forEach(e => {


        const option = document.createElement("option")
        const date = formatDate(e[5])
        option.textContent = e[1] + " " + e[2] + " (" + date + ")"
        selectEstudioLectura.append(option)

    });


    //Llenar Oracion Final

    data.filter(e => e[4] != "0" && e[3] == "H").forEach(e => {


        const option = document.createElement("option")
        const date = formatDate(e[5])
        option.textContent = e[1] + " " + e[2] + " (" + date + ")"
        asignadoOracionFinal.append(option)

    });


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


//Array a CSV
function createAndSaveCSV(csvArray, fileName, rowDelimiter = '\r\n') {
    const csvString = csvArray.join(rowDelimiter)
    fs.writeFileSync('filepathTo/ExampleCSV.csv', csvString)
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

}


//Cargar a la semana Seleccionada
function changeWeek() {
    const selector = document.querySelector("#weekSelector")
    const selection = selector.value
    loadWeek(selection);
}

window.addEventListener("load", function () { weekInputHandler(); }, false);


