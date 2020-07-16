const form = document.querySelector("form");
const newPassword = document.querySelector("#new-password")
const confirmation = document.querySelector("#new-password-confirm")
const UImessage = document.querySelector("#validation");

function validation(message, add, remove){
    UImessage.textContent = message;
    UImessage.classList.add(add);
    UImessage.classList.remove(remove);
}

confirmation.addEventListener('keyup', event => {
    if(newPassword.value !== confirmation.value){
        validation('Passwords must match', 'matched', 'unmatched')
    } else {
        validation('Passwords match', 'unmatched', 'matched')
    }
    if (confirmation.value === ''){
        UImessage.textContent = "";
    }    
});

