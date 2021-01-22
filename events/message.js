module.exports = async (client, message) => {
    if (message.author.bot) return;

    const settings = message.settings = client.getSettings(message.guild);

    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    if (!cmd) return;

    console.log(`[${client.getTime()}] ${message.author.tag} used command "${settings.prefix}${command}" on server "${message.guild.name}" in channel "${message.channel.name}".`);

    cmd.run(client, message, args);
};
