exports.run = async (client, message, args, fetch) => { /* eslint prefer-const: 0 */
    const verify = async (user) => {
        let data = {
            tag: `${user.tag}`,
            userid: `${user.id}`
        };

        const response = await client.awaitReply(message, 'Please enter your Minecraft username.');
        let uuid;
        fetch(`https://api.mojang.com/users/profiles/minecraft/${response}`)
            .then((res) => res.text())
            .then((text) => text.length ? JSON.parse(text) : {})
            .then((json) => {
                if (json.id) {
                    uuid = json.id;
                    uuid = uuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');
                    data.mc = json.name; data.uuid = uuid;
                    message.channel.send(`Your username is \`${json.name}\` with UUID \`${uuid}\``);
                    proceed(data);
                } else message.channel.send(`The username \`${response}\` does not exist.`);
            })
            .catch((error) => {
                throw error;
            })
        ;
    };
    const proceed = async (data) => {
        let headers = new fetch.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' + Buffer.from(client.config.username + ':' + client.config.password).toString('base64'));
        const rawResponse = await fetch('https://ncp.hopto.org:3000/api/v1/users', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        // const content = await rawResponse.json();
        if (rawResponse.status.toString().startsWith('2')) {
            let role = message.guild.roles.cache.find(role => role.name === 'Approved');
            message.member.roles.add(role);
            message.channel.send(`Success! (HTTP Status Code ${rawResponse.status})`);
            console.log(`Request returned HTTP Status Code ${rawResponse.status}`);
        } else {
            message.channel.send(`Something went wrong. Try again later or notify a staff member. (HTTP Status Code ${rawResponse.status})`);
            console.log(`Request returned HTTP Status Code ${rawResponse.status}`);
        }
    };

    let user = message.mentions.users.first();
    if (user === undefined) user = message.author;
    verify(user);
};
