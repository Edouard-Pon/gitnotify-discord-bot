require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { Client, GatewayIntentBits, Embed } = require('discord.js')

const app = express()
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

function getChannelID(repositoryFullName) {
    const repos = new Map()
    for (const repo of process.env.CHANNEL_MAPPING.split(',')) {
        const [repository, channelID] = repo.split('=')
        repos.set(repository, channelID)
    }
    if (repos.has(repositoryFullName)) return repos.get(repositoryFullName)
    return ''
}

app.use(bodyParser.json())

app.post('/webhook', async (req, res) => {
    const payload = req.body
    let embedDescription = ''
    let message = ''
    const channelId = getChannelID(payload.repository.full_name)

    try {
        const commits = payload.commits
        const fields = [];

        if (commits.length > 1) {
            embedDescription = `**${payload.pusher.name}** pushed **${payload.commits.length}** commits to ${payload.ref} in **${payload.repository.name}** repository!`
            message = `**${payload.pusher.name}** pushed **${payload.commits.length}** commits at <t:${payload.repository.pushed_at}:F> ||@here||`
        } else {
            embedDescription = `**${payload.pusher.name}** pushed **${payload.commits.length}** commit to ${payload.ref} in **${payload.repository.name}** repository!`
            message = `**${payload.pusher.name}** pushed **${payload.commits.length}** commit at <t:${payload.repository.pushed_at}:F> ||@here||`
        }

        for (const commit of commits) {
            const value = [
                commit.added.length > 0 ? `Added: ${commit.added.join(', ')}` : null,
                commit.removed.length > 0 ? `Removed: ${commit.removed.join(', ')}` : null,
                commit.modified.length > 0 ? `Modified: ${commit.modified.join(', ')}` : null
            ]
                .filter(field => field !== null)
                .join('\n');

            fields.push({
                name: `${commit.message}`,
                value: value
            })
        }

        const pushEmbed = new Embed({
            title: `New Push Event in ${payload.repository.name} Repository`,
            description: embedDescription,
            color: 0xFFC0CB,
            author: {
                name: `${payload.pusher.name}`,
                icon_url: `${payload.sender.avatar_url}`
            },
            fields: fields,
            timestamp: new Date(payload.repository.pushed_at * 1000).toISOString()
        })

        const channel = await client.channels.fetch(channelId)

        channel.send(message)
        channel.send({ embeds: [pushEmbed] })
    } catch (err) {
        console.log(err)
    }
    res.sendStatus(200)
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.login(process.env.TOKEN);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})
