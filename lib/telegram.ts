const SOURCE_LABEL: Record<string, string> = {
  hero_form: "Головна форма",
  consultation_form: "Консультація",
  feedback_form: "Форма зв'язку",
};

const GRADE_LABEL: Record<string, string> = {
  "8": "8 клас",
  "9": "9 клас",
  "10": "10 клас",
  "11": "11 клас",
  college: "Коледж",
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendLeadTelegramNotification(lead: {
  leadNumber: number;
  name: string;
  phone: string;
  grade: string;
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
    `🆔 Заявка №${lead.leadNumber}`,
    `🕐 ${dateTime}`,
    `👤 ${escapeHtml(lead.name)}`,
    `📞 ${escapeHtml(lead.phone)}`,
    `🎓 ${GRADE_LABEL[lead.grade] ?? lead.grade}`,
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
