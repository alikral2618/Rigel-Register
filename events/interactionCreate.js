const { 
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require("discord.js");

const User = require("../models/userSchema");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {

    // =========================
    // 🔹 SLASH KOMUT SİSTEMİ
    // =========================
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        if (!interaction.replied) {
          interaction.reply({ content: "Hata oluştu!", ephemeral: true });
        }
      }
    }

    // =========================
    // 🔘 BUTON
    // =========================
    if (interaction.isButton()) {
      if (interaction.customId === "kayit_baslat") {

        const modal = new ModalBuilder()
          .setCustomId("kayit_modal")
          .setTitle("Kayıt Formu");

        const isim = new TextInputBuilder()
          .setCustomId("isim")
          .setLabel("İsim")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const yas = new TextInputBuilder()
          .setCustomId("yas")
          .setLabel("Yaş")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(isim),
          new ActionRowBuilder().addComponents(yas)
        );

        return interaction.showModal(modal);
      }
    }

    // =========================
    // 📝 MODAL SUBMIT
    // =========================
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "kayit_modal") {

        const isim = interaction.fields.getTextInputValue("isim");
        const yas = interaction.fields.getTextInputValue("yas");

        // cache
        client.kayitData[interaction.user.id] = { isim, yas };

        const menu = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("cinsiyet_sec")
            .setPlaceholder("Cinsiyet seç")
            .addOptions([
              { label: "Erkek", value: "erkek" },
              { label: "Kadın", value: "kadin" }
            ])
        );

        return interaction.reply({
          content: "📋 Cinsiyetini seç:",
          components: [menu],
          ephemeral: true
        });
      }
    }

    // =========================
    // 📋 DROPDOWN
    // =========================
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "cinsiyet_sec") {

        const data = client.kayitData[interaction.user.id];
        if (!data) {
          return interaction.reply({
            content: "❌ Veri bulunamadı!",
            ephemeral: true
          });
        }

        const rolErkek = "1446183941420617738";
        const rolKadin = "1446175583502602422";
        const kayitsiz = "1446154870288547882";
        const logKanalID = "1484358413449302066"; // 🔥 BURAYI DOLDUR

        // 🔥 daha sağlam fetch
        const member = await interaction.guild.members.fetch(interaction.user.id);

        let rol = interaction.values[0] === "erkek" ? rolErkek : rolKadin;

        // rol işlemleri
        await member.roles.remove(kayitsiz).catch(() => {});
        await member.roles.add(rol).catch(() => {});

        // isim ayarla
        await member.setNickname(`${data.isim} | ${data.yas}`).catch(() => {});

        // mongo kayıt
        await User.findOneAndUpdate(
          { userID: member.id, guildID: interaction.guild.id },
          {
            userID: member.id,
            guildID: interaction.guild.id,

            isim: data.isim,
            yas: data.yas,
            cinsiyet: interaction.values[0],

            registered: true,
            registerDate: new Date(),

            $inc: { totalRegisters: 1 },

            $push: {
              nameHistory: {
                isim: data.isim,
                yas: data.yas
              }
            }
          },
          { upsert: true, new: true }
        );

        // =========================
        // 📋 LOG SİSTEMİ (EMBED)
        // =========================
        const logKanal = interaction.guild.channels.cache.get(logKanalID);

        if (logKanal) {
          const logEmbed = new EmbedBuilder()
            .setColor("#00ff88")
            .setTitle("📋 Yeni Kayıt")
            .addFields(
              { name: "👤 Kullanıcı", value: `${member}`, inline: true },
              { name: "📝 İsim", value: data.isim, inline: true },
              { name: "🎂 Yaş", value: data.yas, inline: true },
              { name: "🚻 Cinsiyet", value: interaction.values[0], inline: true },
              { name: "👮 Kayıt Eden", value: `${interaction.user}`, inline: true }
            )
            .setFooter({ text: `ID: ${member.id}` })
            .setTimestamp();

          logKanal.send({ embeds: [logEmbed] }).catch(() => {});
        }

        delete client.kayitData[interaction.user.id];

        return interaction.reply({
          content: "✅ Kayıt başarıyla tamamlandı!",
          ephemeral: true
        });
      }
    }

  }
};