fetch("./config/config.json")
  .then((response) => response.json())
  .then((config) => {
    const TOKEN = config.privateBotToken;
    const CHAT_ID = config.privateChatId;

    document
      .getElementById("telegramForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("form-name").value;
        const telegram = document.getElementById("form-tg").value;
        const email = document.getElementById("form-email").value;

        const message = `
        Новая заявка 📧:
Имя: ${name}
Telegram: @${telegram}
Почта: ${email}
    `;

        fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "HTML",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.ok) {
              alert("Message sent successfully!");
            } else {
              alert("Error sending message.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("There was an error sending the message.");
          });
      });
  })
  .catch((err) => console.log("Error occured -", err));
