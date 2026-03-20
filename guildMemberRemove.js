const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {

    console.log("🔥 ÇIKIŞ EVENT:", member.user?.tag);

    const logKanal = member.guild.channels.cache.get("1484358413449302066");
    if (!logKanal) return;

    const user = member.user;

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("📤 Sunucudan Ayrıldı")
      .setDescription(`
👤 ${user?.tag || "Bilinmiyor"} sunucudan ayrıldı

🆔 ID: ${member.id}
      `)
      .setThumbnail(user?.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    logKanal.send({ embeds: [embed] }).catch(console.error);

  }
};