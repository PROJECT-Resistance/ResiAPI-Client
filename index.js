const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');

const client = new Discord.Client();
const config = require('./config.json');
client.config = config;
require('./modules/functions.js')(client);

const version = require('./package.json').version;

console.log(
    `\n---- Welcome to ResiOS version ${version} ----\n\n` +
    'Copyright (c) 2021 Lord Vertice\n\n\n' +
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.\n' +
    'This project is licensed under the MIT License. Refer to the LICENSE file for more information.\n\n\n' +
    'Loading...\n\n' +
    'Initializing module loader...'
);

const init = async () => {
    fs.readdir('./events/', (err, files) => {
        if (err) return console.error(err);
        console.log('Loading event files...');
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const event = require(`./events/${file}`);
            const eventName = file.split('.')[0];
            console.log(`Attempting to load event "${eventName}"`);
            client.on(eventName, event.bind(null, client));
        });
        console.log('Done.');
    });

    client.commands = new Enmap();
    client.settings = new Enmap({ name: 'settings' });

    fs.readdir('./commands/', (err, files) => {
        if (err) return console.error(err);
        console.log('Loading command files...');
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const command = require(`./commands/${file}`);
            const commandName = file.split('.')[0];
            console.log(`Attempting to load command "${commandName}"`);
            client.commands.set(commandName, command);
        });
        console.log('Done.');
    });

    client.login(config.token);
};

init();
