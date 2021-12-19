document.querySelector('#name').addEventListener('blur', validateName);
document.querySelector('#cnic').addEventListener('blur', validateCnic);
// document.querySelector('#bldgrp').addEventListener('blur', validateBloodGroup);
document.querySelector('#age').addEventListener('blur', validateAge);
document.querySelector('#contact').addEventListener('blur', validateContact);
// document.querySelector('#zip').addEventListener('blur', validateZip);







function validateName() {
    const name = document.querySelector('#name');
    const re = /^[a-zA-Z]{3,10}$/;

    if (!re.test(name.value)) {
        name.classList.add('is-invalid');
    } else {
        name.classList.remove('is-invalid');

    }
}

function validateCnic() {
    const cnic = document.querySelector('#cnic');
    const re = /^[0-9]{5}(-[0-9]{7}(-[0-9]{1}))$/;

    if (!re.test(cnic.value)) {
        cnic.classList.add('is-invalid');
    } else {
        cnic.classList.remove('is-invalid');

    }
}
// function validateBloodGroup() {
//     const bldgrp = document.querySelector('#bldgrp');
//     const re = /^[/

//     if (!re.test(bldgrp.value)) {
//         bldgrp.classList.add('is-invalid');
//     } else {
//         bldgrp.classList.remove('is-invalid');

//     }
// }

function validateAge() {
    const age = document.querySelector('#age');
    if (age.value < 17 || age.value > 50) {
        // document.style.backgroundColor = yellow;
        age.classList.add('is-invalid');
    } else {
        age.classList.remove('is-invalid');

    }
}


function validateContact() {
    const contact = document.querySelector('#contact');
    const re = /^[0-9]{4}(-[0-9]{7})$/

    if (!re.test(contact.value)) {
        contact.classList.add('is-invalid');
    } else {
        contact.classList.remove('is-invalid');

    }
}

// function validateZip() {
//     const zip = document.querySelector('#zip');
//     const re = /^[0-9]{5}$/

//     if (!re.test(zip.value)) {
//         zip.classList.add('is-invalid');
//     } else {
//         zip.classList.remove('is-invalid');

//     }
// }