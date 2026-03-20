const { EmbedBuilder } = require("discord.js");
const User = require("../models/userSchema");

module.exports = {
  data: {
    name: "kayıt",
    description: "Kullanıcıyı kayıt eder",
    options: [
      {
        name: "kullanıcı",
        type: 6,
        description: "Kullanıcı seç",
        required: true
      },
      {
        name: "isim",
        type: 3,
        description: "İsim",
        required: true
      },
      {
        name: "yaş",
        type: 3,
        description: "Yaş",
        required: true
      },
      {
        name: "cinsiyet",
        type: 3,
        description: "erkek / kadin",
        required: true,
        choices: [
          { name: "Erkek", value: "erkek" },
          { name: "Kadın", value: "kadin" }
        ]
      }
    ]
  },

  async execute(interaction) {

    const user = interaction.options.getUser("kullanıcı");
    const isim = interaction.options.getString("isim");
    const yas = interaction.options.getString("yaş");
    const cinsiyet = interaction.options.getString("cinsiyet");

    const member = await interaction.guild.members.fetch(user.id);

    const rolErkek = "1446183941420617738";
    const rolKadin = "1446175583502602422";
    const kayitsiz = "1446154870288547882";
    const logKanalID = "1484358413449302066";

    const rol = cinsiyet === "erkek" ? rolErkek : rolKadin;

    await member.roles.remove(kayitsiz).catch(() => {});
    await member.roles.add(rol).catch(() => {});
    await member.setNickname(`${isim} | ${yas}`).catch(() => {});

    // mongo
    await User.findOneAndUpdate(
      { userID: member.id, guildID: interaction.guild.id },
      {
        userID: member.id,
        guildID: interaction.guild.id,
        isim,
        yas,
        cinsiyet,
        registered: true,
        registerDate: new Date(),
        $inc: { totalRegisters: 1 }
      },
      { upsert: true }
    );

    // log
    const logKanal = await interaction.guild.channels.fetch(logKanalID).catch(() => null);

    if (logKanal) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📋 Kayıt Log")
        .addFields(
          { name: "👤 Kullanıcı", value: `${member}`, inline: true },
          { name: "📝 İsim", value: isim, inline: true },
          { name: "🎂 Yaş", value: yas, inline: true },
          { name: "🚻 Cinsiyet", value: cinsiyet, inline: true },
          { name: "👮 Yetkili", value: `${interaction.user}`, inline: true }
        )
        .setTimestamp();

      logKanal.send({ embeds: [embed] });
    }

    interaction.reply({
      content: "✅ Kayıt tamamlandı!",
      ephemeral: true
    });
  }
};