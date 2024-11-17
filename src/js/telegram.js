fetch("./config/config.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load config file.");
    return response.json();
  })
  .then(initFormSubmission)
  .catch((error) => console.error("Error loading config:", error));

function initFormSubmission(config) {
  const TOKEN = config.privateBotToken;
  const CHAT_ID = config.privateChatId;

  if (!TOKEN || !CHAT_ID) {
    console.error("Токен либо чат айди недоступны.");
    return;
  }

  const form = document.getElementById("telegramForm");
  if (form) {
    form.addEventListener("submit", (event) =>
      handleFormSubmit(event, TOKEN, CHAT_ID)
    );
  } 
}

function handleFormSubmit(event, token, chatId) {
  event.preventDefault();

  const name = document.getElementById("form-name").value.trim();
  const telegram = document.getElementById("form-tg").value.trim();
  const email = document.getElementById("form-email").value.trim();
  const comment = document.getElementById("form-comment").value.trim();

  if (!name || !telegram || !email) {
    alert("Пожалуйста, заполните все необходимые поля.");
    return;
  }

  const message = createTelegramMessage(name, telegram, email, comment);
  sendTelegramMessage(token, chatId, message);
}

function createTelegramMessage(name, telegram, email, comment) {
  return `
    Новая заявка 📧:
Имя: ${name}
Telegram: @${telegram}
Почта: ${email}
Комментарий: ${comment}
  `;
}

function sendTelegramMessage(token, chatId, message) {
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        alert("Сообщение отправлено успешно!");
        resetForm();
      } else {
        console.error("Error response from Telegram API:", data);
        alert("Возникла ошибка при отправке формы.");
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
      alert("Возникла ошибка. Попробуйте снова.");
    });
}

function resetForm() {
  const form = document.getElementById("telegramForm");
  form.reset();
}
