require("dotenv").config();

const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const express = require("express");

// 🛑 ENV KONTROL
if (!process.env.TOKEN) {
  console.error("❌ TOKEN bulunamadı!");
  process.exit(1);
}

if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL bulunamadı!");
  process.exit(1);
}

// 🌐 KEEP ALIVE (Railway için)
const app = express();
app.get("/", (req, res) => res.send("Bot aktif"));
app.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Web server aktif");
});

// 🤖 CLIENT
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

// 📦 KOLEKSİYONLAR
client.commands = new Collection();
client.cooldowns = new Collection();
client.kayitData = {};

// 🌐 MONGODB BAĞLANTI (ULTRA STABLE)
mongoose.set("strictQuery", true);

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🟢 MongoDB bağlandı");
  } catch (err) {
    console.error("🔴 MongoDB hatası:", err);
    setTimeout(connectMongo, 5000); // tekrar dene
  }
}

connectMongo();

mongoose.connection.on("disconnected", () => {
  console.log("🔴 MongoDB bağlantısı koptu! Yeniden bağlanılıyor...");
  connectMongo();
});

// 📂 COMMAND HANDLER
if (fs.existsSync("./commands")) {
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
} else {
  console.log("⚠️ commands klasörü yok!");
}

// 📂 EVENT HANDLER
if (fs.existsSync("./events")) {
  const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const event = require(`./events/${file}`);

      if (!event.name || !event.execute) {
        console.log(`⚠️ ${file} hatalı event!`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

    } catch (err) {
      console.error(`❌ Event yüklenemedi (${file}):`, err);
    }
  }

  console.log(`⚙️ ${eventFiles.length} event yüklendi`);
} else {
  console.log("⚠️ events klasörü yok!");
}

// 🟢 READY
client.once("ready", () => {
  console.log(`🤖 ${client.user.tag} aktif!`);

  client.user.setPresence({
    activities: [{ name: "Rigel Register", type: "PLAYING" }],
    status: "dnd"
  });
});

// 🔥 DEBUG
client.on("guildMemberAdd", member => {
  console.log("🔥 GİRİŞ:", member.user.tag);
});

client.on("guildMemberRemove", member => {
  console.log("🔥 ÇIKIŞ:", member.user?.tag);
});

// ⚠️ GLOBAL HATA YAKALAMA
process.on("unhandledRejection", err => {
  console.error("❌ Promise Hatası:", err);
});

process.on("uncaughtException", err => {
  console.error("❌ Sistem Hatası:", err);
});

// 🔐 BOT BAŞLAT
client.login(process.env.TOKEN)
  .then(() => console.log("🔐 Discord'a giriş yapıldı"))
  .catch(err => {
    console.error("❌ Discord Login Hatası:", err);
    process.exit(1);
  });