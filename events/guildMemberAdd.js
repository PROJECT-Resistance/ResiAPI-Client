module.exports = async (client, member) => {
    const settings = client.getSettings(member.guild);
    if (member.bot || member.guild.id !== settings.home) return;

    const channel = member.guild.channels.cache.find(channel => channel.name === 'verification');
    channel.send(`Hey there, <@${member.user.id}>, welcome to the project! Please use the command \`${settings.prefix}verify\` to get access to the main server.`);
};
