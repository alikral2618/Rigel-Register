const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  // 👤 TEMEL BİLGİ
  userID: {
    type: String,
    required: true,
    unique: true
  },

  guildID: {
    type: String,
    required: true
  },

  // 🧾 KAYIT BİLGİLERİ
  isim: {
    type: String,
    default: null
  },

  yas: {
    type: String,
    default: null
  },

  cinsiyet: {
    type: String,
    enum: ["erkek", "kadin", null],
    default: null
  },

  // 🏷️ ROL TAKİP
  roles: {
    type: [String],
    default: []
  },

  // 🎯 KAYIT DURUMU
  registered: {
    type: Boolean,
    default: false
  },

  registerDate: {
    type: Date,
    default: null
  },

  // 👮 KİM KAYIT ETTİ
  registeredBy: {
    type: String,
    default: null
  },

  // 📊 İSTATİSTİK
  totalRegisters: {
    type: Number,
    default: 0
  },

  // 🔁 GEÇMİŞ İSİMLER
  nameHistory: [
    {
      isim: String,
      yas: String,
      tarih: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // 🧠 DAVET SİSTEMİ (FUTURE)
  invitedBy: {
    type: String,
    default: null
  },

  inviteCount: {
    type: Number,
    default: 0
  },

  // 🛡️ GÜVENLİK
  isFake: {
    type: Boolean,
    default: false
  },

  isBanned: {
    type: Boolean,
    default: false
  },

  // ⏱️ GENEL
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

// 🔄 AUTO UPDATE
userSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);