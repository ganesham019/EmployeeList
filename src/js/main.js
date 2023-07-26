
const addIcon = document.getElementById("add_mem_btn");
const closeBtn = document.getElementById("close_btn");
const overflow = document.getElementById("overflow");
const modal = document.getElementById("modal");
const heading = document.getElementById("op_heading");
const resetBtn = document.getElementById("reset_btn");
const submitBtn = document.getElementById("add_btn");
const updateBtn = document.getElementById("update_btn");

const userNameInput = document.getElementById("username");
const surNameInput = document.getElementById("userlastname");
const emailInput = document.getElementById("email");
const saleryInput = document.getElementById("salary");
const avatar = document.getElementById("selectAvatar");

const userNameErr = document.getElementById("usernameErr");
const surNameErr = document.getElementById("surnameErr");
const emailErr = document.getElementById("emailErr");
const saleryErr = document.getElementById("saleryErr");

let userNameStatus = false;
let userLastNameStatus = false;
let emailStatus = false;
let saleryStatus = false;

const openModal = (e) => {
    modal.classList.add("show");
    overflow.classList.add("show");
    submitBtn.classList.remove("hidden");
    updateBtn.classList.add("hidden");
    heading.innerText = "Add Employee";
}
const closeModal = (e) => {
    modal.classList.remove("show");
    overflow.classList.remove("show");
}

addIcon.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);


function validateForm() {
    let namePattern = /^[A-Za-z]{4,29}$/;
    let lastnamePattern = /^[A-Za-z]{1,29}$/;
    let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!userNameInput.value.match(namePattern)) {
        userNameStatus = false;
        userNameErr.innerText = "UserName is invalid!";
    } else {
        userNameStatus = true;
        userNameErr.innerText = "";
    };

    if (!surNameInput.value.match(lastnamePattern)) {
        userLastNameStatus = false;
        surNameErr.innerText = "LastName is invalid!";
    } else {
        userLastNameStatus = true;
        surNameErr.innerText = "";
    }

    if (!emailInput.value.match(emailPattern)) {
        emailStatus = false;
        emailErr.innerText = "Email is invalid!";
    } else {
        emailStatus = true;
        emailErr.innerText = "";
    }

    if (saleryInput.value.length < 2) {
        saleryStatus = false;
        saleryErr.innerText = "Salary is invalid!";
    } else {
        saleryStatus = true;
        saleryErr.innerText = "";
    }

}

// CRUD Operations
const form = document.getElementById("form");

let dataLists = [];

const convertBase64 = (file) => {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        // filereader method readAsDataURL - it is read the content and return the dara url
        fileReader.readAsDataURL(file);

        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
    });
};

let base64 = "";
let file;
const uploadImage = async (event) => {
    file = event.target.files[0];
    base64 = await convertBase64(file);
};

avatar.addEventListener('change', (e) => {
    uploadImage(e);
})

// Add Data in local storage
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const objectData = Object.fromEntries(formData);

    validateForm();
    if (userNameStatus && userLastNameStatus && emailStatus && saleryStatus) {
        if (localStorage.getItem("form") !== null) {
            dataLists = JSON.parse(localStorage.getItem("form"));
        } else {
            dataLists = [];
        }
        let file = avatar.files[0];

        if (file == null) {
            base64 = defaultBase64
        }

        dataLists.push({
            name: objectData.name,
            surname: objectData.surname,
            email: objectData.email,
            salery: objectData.salary,
            time: new Date().toLocaleString(),
            profile: base64,
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

    } else {
        userNameStatus = false;
        userLastNameStatus = false;
        emailStatus = false;
        saleryStatus = false;
        modal.classList.add("show");
        overflow.classList.add("show");
    }
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
            <div class="card_bg">
              <img src="${data.profile}" alt="" />
            </div>
                <div class="card_detail">
                <p class="e_name" >Name: <small>${data.name} </small></p>
                <p class="e_surname" >lastName: <small>${data.surname}</small> </p>
                <p class="e_salery" >Salary: <small>${data.salery}</small> </p>
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
// show data to modal
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
        updateBtn.setAttribute("data-id", index);
        modal.classList.add("show");
        overflow.classList.add("show");
        updateBtn.classList.remove("hidden");
        submitBtn.classList.add("hidden");
        heading.innerText = "Edit/Update Employee";

        // data set to the modal popup form input
        userNameInput.value = dataLists[index].name;
        surNameInput.value = dataLists[index].surname;
        emailInput.value = dataLists[index].email;
        saleryInput.value = dataLists[index].salery;
    }
})


// update function
updateBtn.addEventListener("click", (e) => {
    e.preventDefault();


    const index = e.target.dataset.id;
    validateForm();
    if (userNameStatus && userLastNameStatus && emailStatus && saleryStatus) {
        if (localStorage.getItem("form") !== null) {
            dataLists = JSON.parse(localStorage.getItem("form"));
            resetBtn.style.opacity = "1";
        } else {
            dataLists = [];
            resetBtn.style.opacity = "0.5";
        }
        if (file == null) {
            base64 = dataLists[index].profile;
        }
        dataLists[index].name = userNameInput.value;
        dataLists[index].surname = surNameInput.value;
        dataLists[index].email = emailInput.value;
        dataLists[index].salery = saleryInput.value;
        dataLists[index].time = new Date().toLocaleString();
        dataLists[index].profile = base64;

        localStorage.setItem("form", JSON.stringify(dataLists));
        showData();

        // clear fields
        const inputValues = document.querySelectorAll("input");
        inputValues.forEach((inputValue) => {
            inputValue.value = null;
        });

        modal.classList.remove("show");
        overflow.classList.remove("show");

    } else {
        userNameStatus = false;
        userLastNameStatus = false;
        emailStatus = false;
        saleryStatus = false;
        modal.classList.add("show");
        overflow.classList.add("show");
    }
}
);



//reset storage
resetBtn.addEventListener("click", () => {
    localStorage.clear();
    dataLists = JSON.parse(localStorage.getItem("form"));
    showData();
});


// delete data 
getContainerData.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete_item_btn")) {
        dataLists.splice(e.target.dataset.id, 1);
        localStorage.setItem("form", JSON.stringify(dataLists));
        showData();
    }
})

var defaultBase64 = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

