//the big enchilada
//tested with --info lsd, --info dmt, --info salvia

exports.run = (client, message, args) => {
  const { request } = require("graphql-request");

  var str = message.content;
  var result = str.split(" ");
  var drug = str
  .toLowerCase()
  .replace("--info ", "", -1)
  .replace(/-/g, "", -1)
  .replace(/ /g, "", -1); //removes all symbols and puts everything in lower case so bot finds the images easier

  if (drug != undefined) {
    console.log(drug);

    // loads graphql query from separate file as "query" variable
    var query = require("../queries/info.js").info(drug);

    console.log(query);

    let substanceRequest = function(data) {
      return request("https://api.psychonautwiki.org", query).then(data => {
        return data;
      });
    };

    substanceRequest().then(function(data) {

      console.log(data) // SHOW ME WHAT YOU GOT

      var substance = data.substances[0];

      //now that we've grabbed the substance object, we can dissect further
      var roas = substance.roas;
      console.log(roas);

      //roa = "preferred roa"
      //right now we grab first roa as the roa to display
      //in future, maybe use a "preferred roas" json file with mapped substance names => roa
      //also future, needs to be workable via a subsection command (--dosage sublingual lsd, --dosage oral lsd)
      var roa = roas[0];

      //this block cobbles together the dosage information section
      //first check if there is dosage information for first (eventually preferred!!!) roa
      //required, some substances (salvia for example) return null for dose object
      if (roa.dose) {
        var dosageMessage = buildDosageMessage(substance);
      }

      //this block cobbles together the duration information section
      //first check if there is duration information for (eventually preferred!!!) roa
      //required, some substances (salvia for example) return null for duration object

      //fill out tolerance section if tolerance exists
      if (substance.tolerance) {
        var toleranceMessage = buildToleranceMessage(substance);
      } else {
        var toleranceMessage = "";
      }

      //HERE'S WHERE ALL THE MAGIC COMES TOGETHER
      if (dosageMessage != undefined) {
        var channelMessage =
        "**" +
        substance.name +
        " information**\n\n" +
        // // These are broken in the API
        // "**Psychoactive class: **" +
        // "insert psychoactive class\n" +
        // "**Chemical class: **\n\n" +
        dosageMessage +
        "**Addiction potential: **\n```\n" +
        substance.addictionPotential +
        "```" +
        toleranceMessage;
      } else {
        var channelMessage = "Error " + console.error;
      }

      message.channel.send(channelMessage).catch(console.error);

      if (!isNaN(drug.charAt(0))) {
        pwdrug = drug
        .toUpperCase()
        .replace(/ACO/g, "-AcO-")
        .replace(/MEO/g, "-MeO-");
      } else {
        pwdrug = drug.charAt(0).toUpperCase() + drug.slice(1);
      }

      if (pwdrug.length == 3) pwdrug = pwdrug.toUpperCase();

      if (pwdrug == "Dipt") pwdrug = "DiPT";
      if (pwdrug == "Moxy") pwdrug = "5-MeO-MiPT";
      if (pwdrug == "Molly") pwdrug = "MDMA";
      if (pwdrug == "Mdma") pwdrug = "MDMA";

      message.channel.send(`More information: <https://psychonautwiki.org/wiki/${pwdrug}>`)
      .catch(console.error); //oppositely, the pwdrug must come out to have symbols and proper casing which is done with the code above
    })
    .catch(function(error) {
      console.log("promise reected/errored out");
      console.log(error);
    });
  }
};

// Functions
function buildToleranceMessage(substance) {
  var toleranceMessage =
  "**Tolerance**```\n" +
  "Full: " +
  substance.tolerance.full +
  "\n" +
  "Half: " +
  substance.tolerance.half +
  "\n" +
  "Baseline: " +
  substance.tolerance.zero +
  "```";

  return toleranceMessage;
}
function buildDosageMessage(substance) {
  var dosageMessageArray = [];

  for (let i = 0; i < substance.roas.length; i++) {
    dosageMessageArray[i] = substance.roas[i];
  }
  // console.log(dosageMessageArray);

  var dosageMessage = "";
  console.log(dosageMessageArray);
  // if (dosageMessageArray[0].dose.heavy) {
  //   dosageMessage += dosageMessageArray[0].dose.heavy;
  // }

  for (let i = 0; i < dosageMessageArray.length; i++) {
    // Dosage variables
    var dosageUnit = dosageMessageArray[i].dose.units;
    var thresholdDosage = dosageMessageArray[i].dose.threshold;
    var lightDosage = dosageMessageArray[i].dose.light;
    var commonDosage = dosageMessageArray[i].dose.common;
    var strongDosage = dosageMessageArray[i].dose.strong;
    var heavyDosage = dosageMessageArray[i].dose.heavy;

    // Dosage message
    // Add dosage + name
    if (dosageMessageArray[i].name) {
      dosageMessage += "**Dosage** (" + dosageMessageArray[i].name + ")\n```";
    }
    if (!!thresholdDosage) {
      // has threshold dosage information
      if (typeof thresholdDosage == "number") {
        dosageMessage += `Threshold: ${thresholdDosage}${dosageUnit}\n`;
      } else {
        dosageMessage += `Threshold: ${thresholdDosage.min} - ${
          thresholdDosage.max
        }${dosageUnit}\n`;
      }
    } else {
      dosageMessage += "No threshold dose information\n";
    }
    // Light
    if (!!lightDosage) {
      // has light dosage information
      if (typeof lightDosage == "number") {
        dosageMessage += `Light: ${lightDosage}${dosageUnit}\n`;
      } else {
        dosageMessage += `Light: ${lightDosage.min} - ${
          lightDosage.max
        }${dosageUnit}\n`;
      }
    } else {
      dosageMessage += "No light dose information\n";
    }
    // Common
    if (!!commonDosage) {
      // has common dosage information
      if (typeof commonDosage == "number") {
        dosageMessage += `Common: ${commonDosage}${dosageUnit}\n`;
      } else {
        dosageMessage += `Common: ${commonDosage.min} - ${
          commonDosage.max
        }${dosageUnit}\n`;
      }
    } else {
      dosageMessage += "No common dose information\n";
    }
    // Strong
    if (!!strongDosage) {
      // has strong dosage information
      if (typeof strongDosage == "number") {
        dosageMessage += `Strong: ${strongDosage}${dosageUnit}\n`;
      } else {
        dosageMessage += `Strong: ${strongDosage.min} - ${
          strongDosage.max
        }${dosageUnit}\n`;
      }
    } else {
      dosageMessage += "No strong dose information\n";
    }
    // Heavy
    if (!!heavyDosage) {
      // has heavy dosage information
      if (typeof heavyDosage == "number") {
        dosageMessage += `Heavy: ${heavyDosage}${dosageUnit}\n\`\`\``;
      } else {
        dosageMessage += `Heavy: ${heavyDosage.min} - ${
          heavyDosage.max
        }${dosageUnit}\n\`\`\``;
      }
    } else {
      dosageMessage += "No heavy dose information\n```";
    }
    // Duration
    var duration = dosageMessageArray[i].duration;

    // Duration message
    // If duration isn't null
    if (!!duration) {
      dosageMessage +=
      "**Duration** (" + dosageMessageArray[i].name + ")" + "```";
      // Onset
      if (!!duration.onset) {
        dosageMessage += `Onset: ${duration.onset.min} - ${
          duration.onset.max
        } ${duration.onset.units}\n`;
      } else {
        dosageMessage += "No onset information.\n";
      }
      // Comeup
      if (!!duration.comeup) {
        dosageMessage += `Comeup: ${duration.comeup.min} - ${
          duration.comeup.max
        } ${duration.comeup.units}\n`;
      } else {
        dosageMessage += "No comeup information.\n";
      }
      // Peak
      if (!!duration.peak) {
        dosageMessage += `Peak: ${duration.peak.min} - ${duration.peak.max} ${
          duration.peak.units
        }\n`;
      } else {
        dosageMessage += "No peak information.\n";
      }
      // Offset
      if (!!duration.offset) {
        dosageMessage += `Offset: ${duration.offset.min} - ${
          duration.offset.max
        } ${duration.offset.units}\n`;
      } else {
        dosageMessage += "No offset information.\n";
      }
      // Afterglow
      if (!!duration.afterglow) {
        dosageMessage += `Afterglow: ${duration.afterglow.min} - ${
          duration.afterglow.max
        } ${duration.afterglow.units}\n`;
      } else {
        dosageMessage += "No afterglow information.\n";
      }
      // Total
      if (!!duration.total) {
        dosageMessage += `Total: ${duration.total.min} - ${
          duration.total.max
        } ${duration.total.units}\n\`\`\``;
      } else {
        dosageMessage += "No total information.\n````";
      }
    } else {
      dosageMessage += "No duration information.```";
    }
  }
  console.log(dosageMessage);
  return dosageMessage;
}
