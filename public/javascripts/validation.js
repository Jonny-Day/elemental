const submitBtn = document.querySelector("#submit-btn");
const newPassword = document.querySelector("#new-password")
const confirmation = document.querySelector("#new-password-confirm")
const UImessagePass = document.querySelector("#pass-validation");
const UImessageEmail = document.querySelector("#email-validation")
const email = document.querySelector("#email")

function validatePassword(message, add, remove){
    UImessagePass.textContent = message;
    UImessagePass.classList.add(add);
    UImessagePass.classList.remove(remove);
}

function validateEmail(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
       return true
     } else {
       return false
     }
}

confirmation.addEventListener('keyup', event => {
    if(newPassword.value !== confirmation.value){
        validatePassword('Passwords must match', 'matched', 'unmatched');
        submitBtn.setAttribute('disabled', true);
    } else {
        validatePassword('Passwords match', 'unmatched', 'matched');
        submitBtn.removeAttribute('disabled');
    }
    if (confirmation.value === ''){
        UImessagePass.textContent = "";
        submitBtn.removeAttribute('disabled');
    }    
});

email.addEventListener('keyup', event => {
    if(!validateEmail(email.value)){
        UImessageEmail.textContent = 'Please enter a valid email address';
    } else {
        UImessageEmail.textContent = '';
    }
})

