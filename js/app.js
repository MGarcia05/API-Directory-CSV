// Global variables
let employees = [];
// URL MUST be changed if using a different API/API is not hosted locally! 
const urlAPI = `http://localhost:3000/results`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const modalNext = document.querySelector(".modal-next");
const modalBack = document.querySelector(".modal-back");
let modalIndex = 0;



// Fetch data from API
fetch(urlAPI)
    .then((response) => response.json())
    //Initializing page with employee data already in API
    .then((data) => displayEmployees(data))
    .catch(err => console.log(err))
    

// Functions

  // displayEmployees function
  function displayEmployees(empolyeeData){
      employees = empolyeeData;
      console.log(employees)
      let employeeHTML = '';

      employees.forEach((employee, index) => {
        //let index = employee.id
        let name = employee.name;
        let location = employee.location;
        let email = employee.email;
        let dob = employee.dob;
        let phone = employee.phone;
        let picture = employee.picture;

          employeeHTML += `
      <div class="card" data-index="${index}">
          <img class="avatar" src="${picture}"/>
          <div class="text-container">
                  <h2 class="name">${name}</h2>
                  <p class="email">${email}</p>
                  <p class="address">${location}</p>
          </div>
      </div>
          `
      });
      gridContainer.innerHTML = employeeHTML;
      
  };

  // upload, convert, and POST .csv data

  function Upload() {    
    var fileUpload = document.getElementById("fileUpload");

    // Only accepting .csv files to allow for smooth uploading (splitting would look differently for other types)
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                e.preventDefault();
                var table = document.createElement("table");
                // Splitting cells with data endpoints of \r\n
                var rows = e.target.result.split("\r\n");
                
                // Looping through rows - index of [0] returns blank object, starting at 1
                for (var i = 1; i < rows.length; i++) {
                    var row = table.insertRow(-1);
                    var cells = rows[i].split(",");
                    // Looping through cells - index of [0] returns blank object, starting at 1
                    for (var j = 1; j < cells.length; j++) {
                        var cell = row.insertCell(-1);
                        var myData = cell.innerHTML = cells[j];
                        // Fetching data from locally hosted API                        
                        fetch(urlAPI, {          
                          // Adding POST method to fetch()
                          method: "POST",
                                                  
                          // Adding column/cell information to send to API
                          
                          body: JSON.stringify({
                            name: cells[0],
                            location: cells[1],
                            email: cells[2],
                            dob: cells[3],
                            phone: cells[4],
                            picture: cells[5],
                            id: cells[6]
                          }),
                          
                          // Adding headers to the request
                          headers: {
                              "Content-type": "application/json; charset=UTF-8"
                          }
                      })
                      // Converting to JSON
                      .then((response) => response.json())

                      // Displaying results to console
                      // .then(json => console.log(json));
                    }

                }
                // Added data to table for testing purposes;
                // currently table has display: hidden property
                var dvCSV = document.getElementById("dvCSV");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);

            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            //Alert for browsers not supporting HTML5 (File Reader method)
            alert("This browser does not support this method; please use a different browser.");
        }
    } else {
        //Alert for wrong file type
        alert("Please upload a valid CSV file.");
    }
} 

  // displayModal function

  function displayModal(index){
      let {name, dob, phone, email, location, picture} = employees[index];
      const modalHTML = `
      <img class="avatar" src = "${picture}"/>
      <div class="modal-text">
          <h2 class="name">${name}</h2>
          <p class="email">${email}</p>
           <hr/>
          <p>${phone}</p>
          <p class="address">${location}</p>
          <p>Birthday: ${dob}</p>
      </div>
      `
      overlay.classList.remove("hidden");
      modalContainer.innerHTML = modalHTML;
      modalIndex = index;
  }

// Event listeners

gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {

        const card = e.target.closest(".card");
        const index = card.getAttribute("data-index");
        indexCards = index;

        displayModal(index);
        }
     });

    modalClose.addEventListener('click', () => {
        overlay.classList.add("hidden");
    });


// Searchbar function

function searchFunction() {
    input = document.getElementById("searchbar").value.toLowerCase();
    let cardNames = document.querySelectorAll(".name");

    cardNames.forEach(name => {
        let card = name.parentNode.parentNode;
        if(name.textContent.toLocaleLowerCase().includes(input)){
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });

}

// Arrow functions

modalNext.addEventListener('click', () => {
    if (modalIndex < employees.length-1) {
     modalIndex++;
     displayModal(modalIndex);
    } else {
     index = 0;
    displayModal(modalIndex);
    }
});

modalBack.addEventListener('click', () => {
  if (modalIndex < employees.length-1) {
   modalIndex--;
   displayModal(modalIndex);
  } else {
   index = 0;
  displayModal(modalIndex);
  }

});