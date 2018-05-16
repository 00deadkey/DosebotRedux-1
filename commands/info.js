const sanitizeSubstanceName = require("../include/sanitize-substance-name.js")
const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const { request } = require("graphql-request");
  
  var str = message.content;
  var result = str.split(" ");
  var drug = str
  .toLowerCase()
  .replace("--info ", "", -1)
  .replace(/-/g, "", -1)
  .replace(/ /g, "", -1); //removes all symbols and puts everything in lower case so bot finds the images easier
  drug = sanitizeSubstanceName(drug)
  console.log(`Requesting info for ${drug}`);
  
  // loads graphql query from separate file as "query" variable
  let query = require("../queries/info.js").info(drug);
  request("https://api.psychonautwiki.org", query).then(data => {
  
  console.log(data) // SHOW ME WHAT YOU GOT
  
  if (data.substances.length == 0) {
    message.channel.send(`There are no substances matching \`${drug}\` on PsychonautWiki.`).catch(console.error)
    return
  }
  
  if (data.substances.length > 1) {
    message.channel.send(`There are multiple substances matching \`${drug}\` on PsychonautWiki.`).catch(console.error)
    return
  }
  
  let substance = data.substances[0]
  
  const embed = new Discord.RichEmbed()
  .setTitle(`**${substance.name} drug information**`)
  .setAuthor("DoseBot", "https://kek.gg/i/JGVVV.png")
  .setColor("747474")
  .setFooter("Please use drugs responsibly", "https://kek.gg/i/JGVVV.png")
  .setThumbnail("https://kek.gg/i/svRNH.png")
  .setTimestamp()
  .setURL("http://www.dosebot.org")
  .addField(":telescope: __Class__", "**Chemical**: " + substance.class.chemical[0] + "\n" + "**Psychoactive**: " + substance.class.psychoactive[0])
  .addField(":scales: __Dosages__", `${buildDosageMessage(substance)}\n`)
  .addField(":clock2: __Duration__", `${buildDurationMessage(substance)}\n`)
  .addField(":warning: __Addiction potential__",
  `${capitalize(substance.addictionPotential)}\n`)
  .addField(":chart_with_upwards_trend: __Tolerance__", `${buildToleranceMessage(substance)}\n`)
  .addField(":globe_with_meridians: __Links__", `[PsychonautWiki](https://psychonautwiki.org/wiki/${substance.name}) \n[Drug combination chart](https://wiki.tripsit.me/images/3/3a/Combo_2.png)`)
  
  message.channel.send({embed});
})
.catch(function(error) {
  console.log("promise rejected/errored out");
  console.log(error);
});
};

// Functions
function capitalize(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function buildToleranceMessage(substance) {
  let tolerances = substance.tolerance
  // console.log(t)
  if (!!tolerances) {
    return `**Full**: ${tolerances.full}\n**Half**: ${tolerances.half}\n**Baseline**: ${tolerances.zero}`
  } else {
    return "No information"
  }
}

function buildDosageMessage(substance) {
  var messages = []
  
  var i
  for (i = 0; i < substance.roas.length; i++) {
    let roa = substance.roas[i];
    let dose = roa.dose;
    let name = capitalize(roa.name);
    
    let dosageObjectToString = function(x) {
      // console.log(x)
      let unit = dose.units
      if (!!x) {
        if (typeof x == "number") {
          return  `${x}${unit}`
        }
        return `${x.min} - ${x.max}${unit}`
      }
    }
    
    messages.push(`*(${name})*`)
    if (!!dose) {
      messages.push(`**Threshold**: ${dosageObjectToString(dose.threshold) || "no information"}`)
      messages.push(`**Light**: ${dosageObjectToString(dose.light) || "no information"}`)
      messages.push(`**Common**: ${dosageObjectToString(dose.common) || "no information"}`)
      messages.push(`**Strong**: ${dosageObjectToString(dose.strong) || "no information"}`)
      messages.push(`**Heavy**: ${dosageObjectToString(dose.heavy) || "no information"}`)
      messages.push("")
    } else {
      messages.push("No dosage information.")
    }
  }
  // console.log(messages)
  return messages.join("\n")
}

function buildDurationMessage(substance) {
  var messages = []
  
  var i
  for (i = 0; i < substance.roas.length; i++) {
    let roa = substance.roas[i];
    let dose = roa.dose;
    let name = capitalize(roa.name);
    
    let durationObjectToString = function(x) {
      // console.log(x)
      // { max: 48, min: 12, units: 'hours' }
      if (!!x) {
        return `${x.min} - ${x.max} ${x.units}`
      }
      return undefined
    }
    // Duration
    messages.push(`*(${name})*`)
    if (!!roa.duration) {
      messages.push(`**Onset**: ${durationObjectToString(roa.duration.onset) || "no information"}`)
      messages.push(`**Comeup**: ${durationObjectToString(roa.duration.comeup) || "no information"}`)
      messages.push(`**Peak**: ${durationObjectToString(roa.duration.peak) || "no information"}`)
      messages.push(`**Offset**: ${durationObjectToString(roa.duration.offset) || "no information"}`)
      messages.push(`**Afterglow**: ${durationObjectToString(roa.duration.afterglow) || "no information"}`)
      messages.push(`**Total**: ${durationObjectToString(roa.duration.total) || "no information"}`)
      messages.push("")
    } else {
      messages.push("No duration information.")
    }
  }
  // console.log(messages)
  return messages.join("\n")
}