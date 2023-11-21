const button = document.querySelector("form")

button.addEventListener("submit", async function (event) {
    event.preventDefault();

    const register = document.querySelector('#register').value == "true" ? true : false;
    let login = document.querySelector('input[name=login]').value;
    let password = document.querySelector('input[name=password]').value;
    let email = register ? document.querySelector('input[name=email]').value : "";

    login = login == "" ? null : login.trim();
    password = password == "" ? null : password.trim();
    email = email == "" ? null : email.trim();
    
    const bodyInfo = {
        "login": login,
        "password": password,
        "email": email
    };

    const res = await fetch(register ? "/api/validateRegister" : "/api/validateLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyInfo)
    });

    switch (res.status) {
        case 200:
            window.location.href = "/chat";
            break;
        case 400:
            showError("Todos os campos precisam ser preenchidos.");
            break;
        case 409:
            showError("Login ou Email já cadastrados.");
            break;
        case 403:
            showError("Senha ou Login inválidos.");
        default:
            console.log("Erro desconhecido.")
    }
});

function showError(string) {
    const error = document.querySelector(".erro");

    error.removeAttribute("hidden");
    error.innerHTML = string;
}