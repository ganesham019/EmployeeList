
// functions for modal
const addIcon = document.getElementById("add_mem_btn");
const closeBtn = document.getElementById("close_btn");
const overflow = document.getElementById("overflow");
const modal = document.getElementById("modal");
const heading = document.getElementById("op_heading");
const resetBtn = document.getElementById("reset_btn");
const submitBtn = document.getElementById("add_btn");
const updateBtn = document.getElementById("update_btn");

const openModal = (e) => {
    modal.classList.add("show");
    overflow.classList.add("show");
    submitBtn.style.display = "block";
    updateBtn.style.display = "none";
    heading.innerText = "Add Employee";
}
const closeModal = (e) => {
    modal.classList.remove("show");
    overflow.classList.remove("show");
    const inputValues = document.querySelectorAll("input");
    inputValues.forEach((inputValue) => {
        inputValue.value = null;
    });
}

addIcon.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);


// CRUD Operations
const userNameInput = document.getElementById("username");
const surNameInput = document.getElementById("userlastname");
const emailInput = document.getElementById("email");
const saleryInput = document.getElementById("salery");

// update default is none
submitBtn.style.display = "none";
updateBtn.style.display = "none";

const form = document.getElementById("form");

let dataLists = [];

// Add Data in local storage
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const objectData = Object.fromEntries(formData);

    // const dataLists = JSON.parse(localStorage.getItem("form")) || [];
    if (localStorage.getItem("form") !== null) {
        dataLists = JSON.parse(localStorage.getItem("form"));
    } else {
        dataLists = [];
    }

    dataLists.push({
        name: objectData.name,
        surname: objectData.surname,
        email: objectData.email,
        salery: objectData.salery,
        time: new Date().toLocaleString(),
    })

    localStorage.setItem("form", JSON.stringify(dataLists));

    // clear fields
    const inputValues = document.querySelectorAll("input");
    inputValues.forEach((inputValue) => {
        inputValue.value = null;
    });

    // showData calling
    showData();

    modal.classList.remove("show");
    overflow.classList.remove("show");
});

//reset storage
resetBtn.addEventListener("click", () => {
    localStorage.clear();
    dataLists = JSON.parse(localStorage.getItem("form"));
    showData();
});

// show Data
const showData = () => {
    let markupElement = "";
    if (localStorage.getItem("form") !== null) {
        dataLists = JSON.parse(localStorage.getItem("form"));
        resetBtn.style.opacity = "1";
    } else {
        dataLists = [];
        resetBtn.style.opacity = "0.5";
    }

    // optional chaining its ignorre the null values ? we can use instead of(else) code
    if (dataLists.length) {
        resetBtn.style.opacity = "1";
        dataLists.map((data, index) => {
            markupElement += `<li class="main__section_card">
                <div class="card_detail">
                <p class="e_id" >ID: <small>${index} </small></p>
                <p class="e_name" >Name: <small>${data.name} </small></p>
                <p class="e_surname" >lastName: <small>${data.surname}</small> </p>
                <p class="e_salery" >Salery: <small>${data.salery}</small> </p>
                <p class="e_email" >Email: <small> ${data.email}</small></p>
                <p class="e_time" >UpdatedAt: <small>${data.time}</small> </p>
                </div>
                <div class="card_process">
                  <button class="edit_item_btn" data-id="${index}">Edit</button>
                  <button class="delete_item_btn" data-id="${index}">Delete</button>
                </div>
              </li>`
        });
    } else {
        resetBtn.style.opacity = "0.5";
        markupElement += `<li class="no_data">
               <h1>No Data Found</h1>
               <p>Please add a data</p>
                </li>`
    }

    document.getElementById("main__section_container").innerHTML = markupElement;
}

document.onload = showData();

// update data in local
// Event delegations method  to target the card button
const getContainerData = document.getElementById("main__section_container");

// update function
updateBtn.addEventListener("click", (e) => {
    const index = e.target.dataset.id;

    if (localStorage.getItem("form") !== null) {
        dataLists = JSON.parse(localStorage.getItem("form"));
        resetBtn.style.opacity = "1";
    } else {
        dataLists = [];
        resetBtn.style.opacity = "0.5";
    }

    dataLists[index].name = userNameInput.value;
    dataLists[index].surname = surNameInput.value;
    dataLists[index].email = emailInput.value;
    dataLists[index].salery = saleryInput.value;

    localStorage.setItem("form", JSON.stringify(dataLists));
    showData();
});


getContainerData.addEventListener("click", (e) => {
    if (localStorage.getItem("form") !== null) {
        dataLists = JSON.parse(localStorage.getItem("form"));
        resetBtn.style.opacity = "1";
    } else {
        dataLists = [];
        resetBtn.style.opacity = "0.5";
    }

    if (e.target.classList.contains("edit_item_btn")) {

        const index = e.target.dataset.id;

        updateBtn.style.display = "block";
        updateBtn.setAttribute("data-id", index)
        submitBtn.style.display = "none";
        heading.innerText = "Edit/Update Employee";
        modal.classList.add("show");
        overflow.classList.add("show");


        // data set to the modal popup form input
        userNameInput.value = dataLists[index].name;
        surNameInput.value = dataLists[index].surname;
        emailInput.value = dataLists[index].email;
        saleryInput.value = dataLists[index].salery;
    }
})


// delete data 
getContainerData.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete_item_btn")) {
        dataLists.splice(e.target.dataset.id, 1);
        localStorage.setItem("form", JSON.stringify(dataLists));
        showData();
    }
})
