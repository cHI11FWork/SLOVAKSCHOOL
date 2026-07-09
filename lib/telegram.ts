const SOURCE_LABEL: Record<string, string> = {
  hero_form: "Головна форма",
  consultation_form: "Консультація",
  feedback_form: "Форма зв'язку",
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendLeadTelegramNotification(lead: {
  name: string;
  phone: string;
  source: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("telegram_notify_skipped: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  const dateTime = new Date().toLocaleString("uk-UA", {
    timeZone: "Europe/Kyiv",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const text = [
    "🔔 <b>Нова заявка з сайту VipStudy</b>",
    `🕐 ${dateTime}`,
    `👤 ${escapeHtml(lead.name)}`,
    `📞 ${escapeHtml(lead.phone)}`,
    `📍 ${SOURCE_LABEL[lead.source] ?? lead.source}`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      console.error("telegram_notify_failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("telegram_notify_error", err);
  }
}
