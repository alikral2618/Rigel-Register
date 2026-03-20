require("dotenv").config();

const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");

// 🛑 ENV KONTROL
if (!process.env.TOKEN) {
  console.error("❌ TOKEN bulunamadı!");
  process.exit(1);
}

if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL bulunamadı!");
  process.exit(1);
}

// 🤖 Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// 📦 Koleksiyonlar
client.commands = new Collection();
client.cooldowns = new Collection();
client.kayitData = {};

// 🌐 MongoDB (daha stabil bağlantı)
mongoose.connect(process.env.MONGO_URL, {
  autoIndex: true
})
.then(() => console.log("🟢 MongoDB bağlandı"))
.catch(err => console.error("🔴 MongoDB hatası:", err));

mongoose.connection.on("connected", () => {
  console.log("📡 MongoDB bağlantı kuruldu");
});

mongoose.connection.on("disconnected", () => {
  console.log("🔴 MongoDB bağlantısı koptu!");
});

// 📂 COMMAND HANDLER
if (!fs.existsSync("./commands")) {
  console.log("⚠️ commands klasörü yok!");
} else {
  const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    try {
      const command = require(`./commands/${file}`);

      if (!command.data || !command.execute) {
        console.log(`⚠️ ${file} hatalı komut!`);
        continue;
      }

      client.commands.set(command.data.name, command);
    } catch (err) {
      console.error(`❌ Komut yüklenemedi (${file}):`, err);
    }
  }

  console.log(`🧩 ${client.commands.size} komut yüklendi`);
}

// 📂 EVENT HANDLER (ULTRA STABLE)
if (!fs.existsSync("./events")) {
  console.log("⚠️ events klasörü yok!");
} else {
  const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const event = require(`./events/${file}`);

      if (!event.name || !event.execute) {
        console.log(`⚠️ ${file} hatalı event!`);
        continue;
      }

     if (event.once) {
  client.once(event.name, async (...args) => {
    try {
      await event.execute(...args, client);
    } catch (err) {
      console.error(`❌ Event Hatası (${event.name}):`, err);
    }
  });
} else {
  client.on(event.name, async (...args) => {
    try {
      await event.execute(...args, client);
    } catch (err) {
      console.error(`❌ Event Hatası (${event.name}):`, err);
    }
  });
}

    } catch (err) {
      console.error(`❌ Event yüklenemedi (${file}):`, err);
    }
  }

  console.log(`⚙️ ${eventFiles.length} event yüklendi`);
}

// 🟢 READY
client.once("clientReady", () => {
  console.log(`🤖 ${client.user.tag} aktif!`);

  client.user.setPresence({
    activities: [{ name: "Ultra Kayıt Sistemi 💎", type: 0 }],
    status: "online"
  });
});

// 🔥 DEBUG EVENT (SİLME - ÇOK ÖNEMLİ)
client.on("guildMemberAdd", (member) => {
  console.log("🔥 INDEX GİRİŞ ALGILADI:", member.user.tag);
});

// 🔥 ÇIKIŞ TEST
client.on("guildMemberRemove", (member) => {
  console.log("🔥 ÇIKIŞ INDEX ALGILADI:", member.user?.tag);
});

// ⚠️ EXTRA LOG SİSTEMİ
client.on("warn", console.warn);
client.on("error", console.error);

// 🛑 GLOBAL HATA YAKALAMA
process.on("unhandledRejection", err => {
  console.error("❌ Promise Hatası:", err);
});

process.on("uncaughtException", err => {
  console.error("❌ Sistem Hatası:", err);
});

process.on("uncaughtExceptionMonitor", err => {
  console.error("❌ Monitor Hatası:", err);
});

process.on("unhandledRejection", err => console.error(err));
process.on("uncaughtException", err => console.error(err));

// 🟢 Bot Başlat
client.login(process.env.TOKEN);