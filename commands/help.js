const Discord = require("discord.js");

//displays list of commands. in future should scan commands directory and display info for each programmatically/dynamically
exports.run = (client, message, args) => {
  console.log(`**********Executing help on ${message.guild.name}**********`);

  const embed = new Discord.RichEmbed()
    .setTitle("DoseBot Help")
    .setAuthor("DoseBot", "https://kek.gg/i/JGVVV.png")
    .setColor("747474")
    .setFooter("Please use drugs responsibly", "https://kek.gg/i/JGVVV.png")
    .setThumbnail("https://kek.gg/i/svRNH.png")
    .setTimestamp()
    .setURL("http://www.dosebot.org")
    .addField("Available commands", buildCommandList());

  message.channel.send({ embed });
};

function buildCommandList() {
  var commands = [
    "--about",
    "--badtrip",
    "--bobross",
    "--combochart",
    "--combos [drug] (optional: [drug 2])",
    "--dxmcalc [weight in lbs]",
    "--effectinfo [effect]",
    "--effects [substance]",
    "--info [substance]",
    "--library [search string]",
    "--psytolerance [days]",
    "--randomeffect",
    "--randomtdc",
    "--sei",
    "--triptoy",
    "--video"
  ];

  return commands.join("\n");
}
