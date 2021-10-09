// Sends a random TDC video to the channel
exports.run = (client, message, args) => {
  let response = `<@${
    message.author.id
  }> - Enjoy a random episode of The Drug Classroom: <https://youtube-playlist-randomizer.bitbucket.io/?pid=PLxIaqHsY6XLdSwXhdK44mOB0EEdklvbdj&autostart>`;

  message.channel.send(response).catch(console.error);
};
