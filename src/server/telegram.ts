/**
 * JUTU Telegram Bot Dispatch Service
 * Handles instant real-time Telegram notifications for orders, stock alerts, and inquiries
 */

export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
}

export interface TelegramTestResult {
  success: boolean;
  error?: string;
  code?: number;
  bot?: TelegramBotInfo;
  message?: string;
}

/**
 * Validates the Telegram Bot Token using getMe API
 */
export async function getTelegramBotInfo(botToken: string): Promise<{ success: boolean; bot?: TelegramBotInfo; error?: string; code?: number }> {
  if (!botToken || !botToken.trim()) {
    return { success: false, error: 'Telegram Bot Token is empty.' };
  }

  const cleanToken = botToken.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data: any = await res.json();
    if (!data.ok) {
      if (data.error_code === 401) {
        return {
          success: false,
          code: 401,
          error: 'Invalid Bot Token (401 Unauthorized). Please ensure you copied the complete token from @BotFather on Telegram.',
        };
      }
      return {
        success: false,
        code: data.error_code,
        error: data.description || 'Telegram API returned an error verifying bot token.',
      };
    }

    return {
      success: true,
      bot: data.result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Network error reaching Telegram servers: ${err.message}`,
    };
  }
}

/**
 * Sends a test payload to the Telegram chat
 */
export async function testTelegramNotification(botToken: string, chatId: string): Promise<TelegramTestResult> {
  const cleanToken = (botToken || '').trim();
  const cleanChatId = (chatId || '').trim();

  if (!cleanToken) {
    return { success: false, error: 'Telegram Bot Token is required.' };
  }
  if (!cleanChatId) {
    return { success: false, error: 'Telegram Chat ID / Channel ID is required.' };
  }

  // 1. Verify bot token first
  const botRes = await getTelegramBotInfo(cleanToken);
  if (!botRes.success) {
    return {
      success: false,
      code: botRes.code,
      error: botRes.error,
    };
  }

  const bot = botRes.bot!;
  const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: true });

  const messageText = `🟢 <b>JUTU FOOTWEAR — Telegram Gateway Connected!</b>

✅ <b>Bot:</b> @${bot.username || bot.first_name}
💬 <b>Target Chat ID:</b> <code>${cleanChatId}</code>
🕒 <b>Connected At:</b> ${timeNow} (BST)

Your store is now successfully linked to Telegram! You will receive live instant notifications here whenever:
📦 A new customer places an order
⚠️ Product stock drops below the threshold
✉️ A customer sends an inquiry from the contact page

━━━━━━━━━━━━━━━━━━
<i>⚡ JUTU Logistics & Automation Hub</i>`;

  try {
    const sendRes = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const sendData: any = await sendRes.json();
    if (!sendData.ok) {
      const desc = sendData.description || 'Failed to dispatch Telegram message';
      let friendlyError = desc;

      if (sendData.error_code === 400 && (desc.includes('chat not found') || desc.includes('chat_id'))) {
        friendlyError = `Chat ID "${cleanChatId}" not found. If this is a personal chat, you must open your bot (@${bot.username || 'your bot'}) in Telegram and click START (/start) first. If this is a group or channel, make sure the bot has been added as a member.`;
      } else if (sendData.error_code === 403) {
        friendlyError = `Access denied (403). The bot was blocked by the user or lacks admin permission in this group/channel.`;
      }

      return {
        success: false,
        code: sendData.error_code,
        bot,
        error: friendlyError,
      };
    }

    return {
      success: true,
      bot,
      message: `Test alert successfully delivered to Telegram (@${bot.username || bot.first_name})!`,
    };
  } catch (err: any) {
    return {
      success: false,
      bot,
      error: `Failed to deliver test message: ${err.message}`,
    };
  }
}

/**
 * Dispatches an order alert to Telegram
 */
export async function sendTelegramOrderNotification(order: any, settings: any): Promise<boolean> {
  try {
    if (!settings?.telegramEnabled) return false;
    if (!settings?.telegramNotifyNewOrder) return false;
    const token = (settings?.telegramBotToken || '').trim();
    const chatId = (settings?.telegramChatId || '').trim();
    if (!token || !chatId) return false;

    const orderNumber = order.orderNumber || order.id || 'N/A';
    const customerName = order.customerName || order.customer?.name || order.shippingAddress?.name || 'Valued Customer';
    const phone = order.phone || order.customer?.phone || order.shippingAddress?.phone || 'N/A';
    const address = order.address || order.shippingAddress?.address || '';
    const city = order.city || order.shippingAddress?.city || '';
    const paymentMethod = order.paymentMethod || 'Cash on Delivery';
    const paymentStatus = order.paymentStatus || 'Pending';
    const total = Number(order.total || 0).toLocaleString('en-US');
    const subtotal = Number(order.subtotal || order.total || 0).toLocaleString('en-US');
    const deliveryFee = Number(order.deliveryFee || order.shippingCost || 0).toLocaleString('en-US');
    const deliveryArea = order.deliveryArea || order.shippingArea || 'Standard Delivery';

    // Format items list
    let itemsText = '';
    const items = order.items || [];
    if (Array.isArray(items) && items.length > 0) {
      itemsText = items
        .map((item: any) => {
          const name = item.name || item.title || 'Footwear Item';
          const size = item.size ? `Size: ${item.size}` : '';
          const color = item.color ? `Color: ${item.color}` : '';
          const qty = item.quantity || item.qty || 1;
          const price = (Number(item.price || 0) * qty).toLocaleString('en-US');
          const details = [size, color].filter(Boolean).join(', ');
          return `• <b>${name}</b> ${details ? `(${details})` : ''} × ${qty} — ৳${price}`;
        })
        .join('\n');
    } else {
      itemsText = '• 1 × Standard Item';
    }

    const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: true });

    const message = `🛍️ <b>NEW ORDER RECEIVED! — #${orderNumber}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Customer:</b> ${customerName}
📞 <b>Phone:</b> <code>${phone}</code>
📍 <b>Address:</b> ${address ? `${address}, ` : ''}${city}
🚚 <b>Delivery Area:</b> ${deliveryArea}
💳 <b>Payment:</b> ${paymentMethod} (${paymentStatus.toUpperCase()})

📦 <b>ITEMS:</b>
${itemsText}

💰 <b>Subtotal:</b> ৳${subtotal}
🚚 <b>Delivery Fee:</b> ৳${deliveryFee}
${order.discount ? `🏷️ <b>Discount:</b> -৳${Number(order.discount).toLocaleString('en-US')}\n` : ''}💵 <b>TOTAL AMOUNT:</b> <b>৳${total}</b>
━━━━━━━━━━━━━━━━━━
🕒 <b>Time:</b> ${timeNow} (BST)
⚡ <i>JUTU Logistics Dispatch</i>`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        disable_notification: Boolean(settings.telegramSilentNotification),
      }),
    });

    const data: any = await res.json();
    if (!data.ok) {
      console.warn('⚠️ [Telegram Order Dispatch Warning]', data.description);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('❌ [Telegram Order Dispatch Error]', err.message);
    return false;
  }
}

/**
 * Dispatches a customer contact inquiry alert to Telegram
 */
export async function sendTelegramContactNotification(contact: any, settings: any): Promise<boolean> {
  try {
    if (!settings?.telegramEnabled) return false;
    if (!settings?.telegramNotifyContactMessage) return false;
    const token = (settings?.telegramBotToken || '').trim();
    const chatId = (settings?.telegramChatId || '').trim();
    if (!token || !chatId) return false;

    const name = contact.name || 'Anonymous Visitor';
    const email = contact.email || 'N/A';
    const phone = contact.phone || 'N/A';
    const subject = contact.subject || 'General Inquiry';
    const message = contact.message || contact.body || 'No message text provided.';
    const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: true });

    const text = `✉️ <b>NEW CUSTOMER INQUIRY</b>
━━━━━━━━━━━━━━━━━━
👤 <b>From:</b> ${name}
📧 <b>Email:</b> <code>${email}</code>
📞 <b>Phone:</b> <code>${phone}</code>
📌 <b>Subject:</b> ${subject}

💬 <b>Message:</b>
<i>"${message}"</i>
━━━━━━━━━━━━━━━━━━
🕒 <b>Time:</b> ${timeNow} (BST)`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data: any = await res.json();
    return Boolean(data.ok);
  } catch (err: any) {
    console.error('❌ [Telegram Contact Alert Error]', err.message);
    return false;
  }
}

/**
 * Dispatches a low stock alert to Telegram
 */
export async function sendTelegramLowStockNotification(productName: string, remaining: number, settings: any): Promise<boolean> {
  try {
    if (!settings?.telegramEnabled) return false;
    if (!settings?.telegramNotifyLowStock) return false;
    const token = (settings?.telegramBotToken || '').trim();
    const chatId = (settings?.telegramChatId || '').trim();
    if (!token || !chatId) return false;

    const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: true });

    const text = `⚠️ <b>LOW STOCK WARNING!</b>
━━━━━━━━━━━━━━━━━━
👟 <b>Product:</b> ${productName}
📉 <b>Stock Remaining:</b> <b>${remaining} pairs</b>
⚠️ Urgent inventory restocking recommended.
━━━━━━━━━━━━━━━━━━
🕒 <b>Time:</b> ${timeNow} (BST)`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data: any = await res.json();
    return Boolean(data.ok);
  } catch (err: any) {
    console.error('❌ [Telegram Low Stock Alert Error]', err.message);
    return false;
  }
}
