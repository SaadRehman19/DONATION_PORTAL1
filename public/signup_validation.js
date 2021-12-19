document.querySelector("#password").addEventListener("click", passValidate);

function passValidate() {
    const pass = document.querySelector('#password');
    if (pass.value.length < 5) {
        pass.classList.add('is-invalid');
    } else {
        pass.classList.remove('is-invalid');

    }

}