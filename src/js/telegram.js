document
  .getElementById("telegramForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const botToken = "";
    const chatId = "";

    const name = document.getElementById("form-name").value;
    const telegram = document.getElementById("form-tg").value;
    const email = document.getElementById("form-email").value;

    const message = `
        New Form Submission:
        - Name: ${name}s
        - Telegram: ${telegram}
        - Email: ${email}
    `;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
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
