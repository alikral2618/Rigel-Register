const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {

    const kanal = member.guild.channels.cache.get("1447675287134408847");
    const logKanal = member.guild.channels.cache.get("1484358413449302066"); // 🔥 log kanalını gir

    if (!kanal) return;

    const createdAt = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`;
    const createdAgo = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`;

    const cizgi = "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯";

    // 🔥 HOŞ GELDİN EMBED (seninki aynen duruyor)
    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("<a:crown:1483204573148745759> Rigel Sunucusuna Hoş Geldin!")
      .setDescription(`
<a:85732confetti:1484363483465252925> Seni aramızda görmek çok güzel ${member}!

Seninle beraber artık çok daha büyük bir aile olduk ve şu an tam **${member.guild.memberCount}** kişiyiz
${cizgi}
<a:3936_Info:1484363497943863517> **Hesap Bilgileri**
<a:averified:1483207764179157177> Oluşturulma: ${createdAt}
<a:averified:1483207764179157177> Hesap yaşı: ${createdAgo}
${cizgi}
<a:83918animatedarrowgreen:1484363481691197511> **Kayıt olmak için yapman gerekenler**
<a:ok:1483207904743129188> Rigel Registery kategorisidnen bir odaya katıl   
<a:ok:1483207904743129188> Herhangi bir yetkiliyi etiketle
<a:ok:1483207904743129188> Kayıt olmayı bekle
${cizgi}
<a:80808arrow:1484363478264184972> Kayıt olduğunuz esnada kuralları kabul etmiş sayılırsınız 
<a:80808arrow:1484363478264184972> Boost atarak destek olabilirsin
      `)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

    kanal.send({
      content: `${member}`,
      embeds: [embed],
    });

    // 🔥 LOG EMBED
    if (logKanal) {
      const logEmbed = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("📥 Sunucuya Giriş")
        .addFields(
          { name: "👤 Kullanıcı", value: `${member}`, inline: true },
          { name: "🆔 ID", value: member.id, inline: true },
          { name: "📅 Hesap Oluşturma", value: createdAt, inline: false },
          { name: "⏳ Hesap Yaşı", value: createdAgo, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
        .setTimestamp();

      logKanal.send({ embeds: [logEmbed] });
    }

  }
};