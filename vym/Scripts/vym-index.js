function indexControl(){
    const inputFile = document.querySelector("#bdFile")
  
    inputFile.value = null
    inputFile.addEventListener("change", function(){manejarArchivo(this)}  )

}

window.addEventListener("load", function(){ indexControl() })


function manejarArchivo(event) {
    const inputFile = document.querySelector("#bdFile");

    const file = inputFile.files[0]
    var reader = new FileReader();
    console.log(reader.readAsText(file))

    document.querySelector("#button1").disabled = false;
    document.querySelector("#button2").disabled = false;
  
      const lector = new FileReader();
  
      lector.onload = function(e) {
        const contenidoCSV = e.target.result;         
        
        sessionStorage.setItem("db", contenidoCSV)
      };
  
      lector.readAsText(file);
    
  }