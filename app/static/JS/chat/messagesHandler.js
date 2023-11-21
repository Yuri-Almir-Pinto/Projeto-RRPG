const chatArea = document.querySelector("#chat-screen");

initialMessageFetch();

function buildMessage(content, image, name) {
    const article = document.createElement("article");
        article.classList.add("user-message-box");
        article.classList.add("bottom-divisor");
    const containerDiv = document.createElement("div");
    const userImage = document.createElement("img");
        userImage.src = image;
        userImage.style.height = "50px";
        userImage.style.width = "50px";
        userImage.classList.add("rounded-image");
    const usernameDiv = document.createElement("div");
        usernameDiv.classList.add("user-name");
        usernameDiv.innerText = name;
    const messageDiv = document.createElement("div");
        messageDiv.innerText = content;

    containerDiv.appendChild(userImage);
    containerDiv.appendChild(usernameDiv);
    article.appendChild(containerDiv);
    article.appendChild(messageDiv);

    chatArea.appendChild(article);
}

async function initialMessageFetch() {
    const res = await fetch("/api/message");

    const text = await res.json();

    text.forEach(element => {
        buildMessage(element.content, "/images/dice.webp", element.name);
    });
}