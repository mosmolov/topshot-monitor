var request = require('request');
const Discord = require('discord.js');
const { webhookid, webhooktoken } = require('./config.json');
const options = {
    'method': 'POST',
    'url': `https://api.nba.dapperlabs.com/marketplace/graphql?SearchPackListings`,
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
      },
      "referrer": "https://www.nbatopshot.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"operationName\":\"SearchPackListings\",\"variables\":{\"input\":{\"searchInput\":{\"pagination\":{\"cursor\":\"\",\"direction\":\"RIGHT\",\"limit\":100}}}},\"query\":\"query SearchPackListings($input: SearchPackListingsInput!) {\\n  searchPackListings(input: $input) {\\n    data {\\n      searchSummary {\\n        data {\\n          ... on PackListings {\\n            data {\\n              id\\n              price\\n              title\\n              remaining\\n              totalPackCount\\n              expiryDate\\n              images {\\n                type\\n                url\\n                __typename\\n              }\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
      "mode": "cors"
    
}

request(options, function (error, response) {
    if (error) throw new Error(error);
    else{
      let data = JSON.parse(response.body)
      let packList = data["data"]["searchPackListings"]["data"]["searchSummary"]["data"]["data"] //Parse response to isolate JSON data of all individual packs *array*
      packList.forEach(pack => {
        const embed = new Discord.MessageEmbed()
            .setThumbnail(pack.images[0]["url"])
            .setFooter(`Made with Love by mozzy#1000`)
            .setTitle(pack.title)
            .setTimestamp()
            .addField('SKU', pack.id, true)
            .addField('Price',Math.floor(pack.price), true)
            .addField('Important Links',`**[Product Link](https://www.nbatopshot.com/listings/pack/${pack.id})**`)
            .addField('Total Stock', pack.totalPackCount, false)
        const hook = new Discord.WebhookClient(webhookid, webhooktoken);
        hook.send(embed);                
      })
    }
  });
