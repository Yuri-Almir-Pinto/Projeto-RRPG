const chatArea = document.querySelector("#chat-screen");
const textArea = document.querySelector("#textArea");
const userId = document.querySelector("#userId").value;

textArea.addEventListener("keypress", function (event) {
    handleTextArea(event);
});

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
    const messageP = document.createElement("p");
        messageP.innerText = content;

    containerDiv.appendChild(userImage);
    containerDiv.appendChild(usernameDiv);
    article.appendChild(containerDiv);
    article.appendChild(messageP);

    let scroll = false;
    if (chatArea.scrollHeight -1 <= chatArea.scrollTop + chatArea.clientHeight)
        scroll = true;

    chatArea.appendChild(article);

    if (scroll)
        chatArea.scrollTop = chatArea.scrollHeight;
};

async function initialMessageFetch() {
    const res = await fetch("/api/message");

    const text = await res.json();

    text.forEach(element => {
        buildMessage(element.content, "/images/dice.webp", element.name);
    });
};

async function sendMessage(content) {
    if (content.trim() != "" && content.trim() != null) {
        const res = await fetch(`/api/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": content
            })
        });

        if (res.status == 200) {
            const text = await res.json();

            buildMessage(text.content, "/images/dice.webp", text.name);
        }
    }
}

async function handleTextArea (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        await sendMessage(event.target.value);
        event.target.value = "";
    }
    else if (event.shiftKey) {
        return
    }
}

socket.on('message', function (message) {
    if (message.userId == userId)
        return
        
    else
        buildMessage(message.content, "/images/dice.webp", message.name);
        

})