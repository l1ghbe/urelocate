fetch("./config/config.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load config file.");
    return response.json();
  })
  .then(initFormSubmission)
  .catch((error) => console.error("Error loading config:", error));

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function getUtmParamsFromCookies() {
  const utmParams = [
    "utm_source",
    "utm_campaign",
    "AgId",
    "utm_term",
    "AdPos",
    "utm_content",
    "device",
    "GeoLoc",
    "utm_medium",
  ];
  const utmData = {};
  utmParams.forEach((param) => {
    const value = getCookie(param);
    if (value) {
      utmData[param] = value;
    }
  });
  return utmData;
}

function initFormSubmission(config) {
  const TOKEN = config.privateBotToken;
  const CHAT_ID = config.privateChatId;
  const GOOGLE_SHEET_URL = config.googleSheetWebAppUrl;
  const form = document.getElementById("telegramForm");

  if (!TOKEN || !CHAT_ID) {
    console.error("Токен либо чат айди недоступны.");
    return;
  }

  form.addEventListener("submit", (event) =>
    handleFormSubmit(event, TOKEN, CHAT_ID, GOOGLE_SHEET_URL)
  );
}

async function handleFormSubmit(event, token, chatId, googleSheetUrl) {
  event.preventDefault();

  const name = document.getElementById("form-name").value.trim();
  let telegram = document.getElementById("form-tg").value.trim();
  const email = document.getElementById("form-email").value.trim();
  const comment = document.getElementById("form-comment").value.trim();
  const webAppUrl = googleSheetUrl;

  if (!name || !telegram || !email) {
    alert("Пожалуйста, заполните все необходимые поля.");
    return;
  }

  if (!telegram.startsWith("@")) {
    telegram = `@${telegram}`;
  }

  const message = createTelegramMessage(name, telegram, email, comment);
  try {
    sendTelegramMessage(token, chatId, message);

    const utmData = getUtmParamsFromCookies();
    const { utm_source, utm_term, GeoLoc, AgId, utm_campaign } = utmData || {};
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}.${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}.${currentDate.getFullYear()}`;

    try {
      await appendToGoogleSheet({
        webAppUrl,
        name,
        telegram,
        source: utm_source || "",
        campaign: utm_campaign || "",
        keywords: utm_term || "",
        region: GeoLoc || "",
        date: formattedDate || "",
        hasPurchase: "нет",
        relevance: "нет",
      });
    } catch (e) {
      console.error("Ошибка при отправке данных в Google Sheets", e);
    } finally {
      sessionStorage.setItem("formSubmitted", "true");
      window.location.href = "/thank-you.html";
    }
  } catch (e) {
    console.error("Ошибка при отправке данных в Telegram", e);
  }
}

function createTelegramMessage(name, telegram, email, comment) {
  const utmData = getUtmParamsFromCookies();
  let utmText = "";
  for (const [key, value] of Object.entries(utmData)) {
    utmText += `${key}: ${value}\n`;
  }

  return `
    Новая заявка 📧:
Имя: ${name}
Telegram: ${telegram}
Почта: ${email}
Комментарий: ${comment}

UTM данные 🤖:
${utmText || "Отсутствуют"}
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

async function appendToGoogleSheet({
  webAppUrl,
  name,
  telegram,
  source,
  campaign,
  keywords,
  region,
  date,
  hasPurchase,
  relevance,
}) {
  const data = {
    name,
    telegram,
    source,
    campaign,
    keywords,
    region,
    date,
    hasPurchase,
    relevance,
  };

  try {
    const response = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to append data to Google Sheets.");
    }

    console.log("Data appended to Google Sheets successfully.");
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
  }
}

function resetForm() {
  const form = document.getElementById("telegramForm");
  form.reset();
}
