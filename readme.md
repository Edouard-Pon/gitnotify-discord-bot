# GitNotify Discord Bot

### Description

A simple Discord bot that handles GitHub repository webhooks using ``Express`` and ``Discord.js``. 
This bot sends a message to your server when someone pushes new commits to your repository.

```bash
git clone https://github.com/Edouard-Pon/GitNotify-Discord-Bot
```
```bash
npm install package.json
```
``.env`` Configuration :
```bash
TOKEN='<DiscordBotToken>'
CHANNEL_MAPPING=<GitHubUsername>/<RepositoryName>=<DiscordChannelID>,
PORT=<PORT>
```
You can manage multiple repositories by adding them to ``CHANNEL_MAPPING`` and separating them with ``,`` as mentioned in the example above :  
``CHANNEL_MAPPING=<GitHubUsername>/<RepositoryName>=<DiscordChannelID>,<GitHubUsername>/<RepositoryName>=<DiscordChannelID>,``

When the bot is hosted, go to the repository's ``Settings`` -> ``Webhooks`` -> ``Add webhook`` :  
``Payload URL`` : URL of the hosted bot, such as ``https://example.com/webhook`` (Don't forget to include``/webhook``)  
``Content type`` : ``application/json``  
``SSL verification`` : Enable SSL Verification (Default)  
``Which events would you like to trigger this webhook?`` : Just the ``push`` event.
