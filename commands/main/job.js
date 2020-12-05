// const { MessageEmbed } = require('discord.js');
const axios = require('axios');
require('dotenv').config();
// const instance =
module.exports.help = {
  name: 'jobme',
  aliases: ['jm'],
  description: 'Returns a list of jobs',
  usage: 'jobme [number of response]',
  category: 'main',
};
function get_formatted_date(timestamp_val) {
  let d_obj = new Date(timestamp_val);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let year = d_obj.getFullYear();
  let month = months[d_obj.getMonth()];
  var date = d_obj.getDate();
  var hour = d_obj.getHours();
  var min = d_obj.getMinutes();
  var sec = d_obj.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

module.exports.execute = ({ message }) => {
  const req_url = `http://${process.env.BACKEND_HOST_IP}:${process.env.BACKEND_HOST_PORT}/get_data?limit=10`;
  axios
    .get(req_url)
    .then((res) => {
      const json_data = res.data;
      const job_fields = [];

      json_data.forEach((e) => {
        // console.log(e.Job_title);
        const scrapped_time = get_formatted_date(e.Timestamps);
        const current_field = {
          name: e.Job_title,
          value: `Company Name: ${e.Cmp_name} \n Location : ${e.Cmp_location} \n Scrapped Date : ${scrapped_time} [Apply](${e.Apply_link})`,
        };
        job_fields.push(current_field);
      });
      console.log(job_fields);
      const embed_val = {
        color: 0x0088ef,
        title: 'JOBS!!!!!!! APPLY!!!!!',
        author: {
          name: 'The Job Bot',
          icon_url: 'https://cdn.pixabay.com/photo/2016/03/31/19/54/computer-1295358_1280.png',
        },
        description: 'Here are the jobs you asked for',
        fields: job_fields,
      };
      return message.channel.send({ embed: embed_val }).catch((error) => console.error(error));
    })
    .catch((err) => {
      const embed_val = {
        color: 0x0088ef,
        title: 'My Daily Dose Of Failure',
        author: {
          name: 'The Job Bot',
          icon_url: 'https://cdn.pixabay.com/photo/2016/03/31/19/54/computer-1295358_1280.png',
        },
        description: 'There must be some error, well no sleep for the one who are fixing this.',
        image: {
          url: 'https://media.giphy.com/media/jOpLbiGmHR9S0/giphy.gif',
        },
      };
      console.log(err);
      return message.channel.send({ embed: embed_val }).catch((error) => console.error(error));
    });
};
