// require the discord.js module
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { emojis } = require('./pollBotConfig.json')

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('PollBot is Woke!');
});

// Discord message handler
client.on('message', message => {

  if(message.content.includes(`${prefix}poll`) && message.author.discriminator !=  '3698') {

    let message_array = message.content.split(' ');
    let poll_time_string;
    let has_custom_title = false;
    let poll_custom_title;
    let reactions_array = [];
    let emojis_array = emojis
    
    if(message_array[0] === `${prefix}poll` && message_array[1] !== '-help') {
      //initialize embed if correct command
      const embed_poll = new Discord.RichEmbed()
      let poll_options = message_array.slice(1);

      //check for time and remove it from options array
      if(poll_options[poll_options.length - 1].includes(':')) {
        poll_time_string = 'for ' + poll_options[poll_options.length - 1];
        poll_options.pop();
      } else {
        poll_time_string = "";
      }

      //check for custom message flag and remove it
      if(poll_options[0] == '-t') {
        poll_options = poll_options.slice(1)
        has_custom_title = true
      }

      console.log(poll_options + ' post flag removal')

      // convert the poll options back to string and separate by commas
      poll_options = poll_options.join(' ').split(',')

      // if custom flag, set title variable and remove from options
      if(has_custom_title) {
        console.log(poll_options + ' before removing message')
        poll_custom_title = poll_options[0]
        poll_options = poll_options.slice(1)
      }
     
      embed_poll.setColor(0x00FF99)
      if(has_custom_title){
        embed_poll.setTitle(message.author.username + ' has started a poll to ' + poll_custom_title + ' ' + poll_time_string)
      } else {
        embed_poll.setTitle(message.author.username + ' has started a poll ' + poll_time_string)
      }
      embed_poll.setAuthor(message.author.username, message.author.avatarURL)
      embed_poll.setDescription('Add reactions to vote for an option')
      embed_poll.addBlankField()
      poll_options.forEach((option) => {
        let rand_num = Math.floor(Math.random() * Math.floor(emojis_array.length - 1));
        embed_poll.addField(option, emojis_array[rand_num], false)
        //add emoji to reactions array
        reactions_array.push(emojis_array[rand_num])
        //remove index from array to prevent repeats
        emojis_array.splice(rand_num, 1);
      })
      embed_poll.addBlankField()
      embed_poll.setTimestamp()

      message.channel.send(embed_poll).then((message) => {
        reactions_array.forEach((reaction) => {
          message.react(reaction)
        })
      });

    } else if(message_array[0] === `${prefix}poll` && message_array[1] == '-help') {
      const embed_help = new Discord.RichEmbed()
      embed_help.setTitle('Poll Buddy Help Page')
      embed_help.setAuthor('Poll Buddy', 'https://cdn.discordapp.com/avatars/669017160206778410/67ff9d88606cbdd9ba0c6d8be0be680b.webp')
      embed_help.setDescription('Poll Buddy is a tool to help create an interactive poll. When a poll is created, Poll Buddy will randomly generate a corresponding emoji for that option and provide the choices below via reaction. Follow the commands below to create a poll, any text in between these characters "[text]" should be taken as example text, your commands will not need square brackets!\n\nExample:\n!poll option 1, option 2, option 3, 12:00am')
      embed_help.addBlankField()
      embed_help.addField('Create a simple poll without custom title or time', '!poll [option1], [option2], [option3]')
      embed_help.addField('Create a poll for a specific time. Your time will not need to be separated by a comma as long as its last. Make sure to not include any spaces in your time', '!poll [option1], [option2], [option3] [time:timepm]')
      embed_help.addField('Create a poll with a custom title. Make sure to separate your title message from your first option with a comma', '!poll -t [custom title message], [option1], [option 2]\][option3]')
      embed_help.addField('Create a poll with custom title and time', '!poll -t [custom title message] [option1], [option2], [option3] [time:timeam]')
      embed_help.setTimestamp()

      message.channel.send(embed_help)
    } else { 
      message.channel.send('Your command seems a little off, try using the following pattern for a simple poll (commas included!):\n!poll option 1, option 2, option 3, 12:00am\n\nType "!poll -help" to view help options')
    }
  }
})

// login to Discord with your app's token
client.login(process.env.POLL_TOKEN);
