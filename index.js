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


function compareData(packList, newPackList){
  if(newPackList.length>packList.length){
    sendData(newPackList)
  }
  newPackList.forEach(pack => {
    if(pack.remaining != 0){
      sendData(newPackList)
    }
  });
}

function sendData(packList){
  let pack = packList[0]
  const embed = new Discord.MessageEmbed()
            .setThumbnail(pack.images[0]["url"])
            .setFooter(`@cardecline | @FootlockerRU`)
            .setTitle(pack.title)
            .setURL(`https://www.nbatopshot.com/listings/pack/${pack.id}`)
            .setTimestamp()
            .addField('SKU', pack.id, false)
            .addField('Price',`$${Math.floor(pack.price)}`, true)
            .addField('Total Stock', pack.totalPackCount, true)
            .addField('Remaining Stock', pack.remaining, true)
        const hook = new Discord.WebhookClient(webhookid, webhooktoken);
        hook.send(embed);                
}
function monitor(baseInfo){
  request(options, function (error, response) {
    if(response.statusCode == '200') console.log(`Request sent successfully at ${new Date()}`);
    if (error) throw new Error(error);
      let data = JSON.parse(response.body)
      let newPackList = data["data"]["searchPackListings"]["data"]["searchSummary"]["data"]["data"] //Parse response to isolate JSON data of all individual packs *array*
      compareData(baseInfo,newInfo);
  });
  
}
function initReq(){
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(`Successfully sent Request at ${new Date()}`)
      let data = JSON.parse(response.body)
      let packList = data["data"]["searchPackListings"]["data"]["searchSummary"]["data"]["data"] //Parse response to isolate JSON data of all individual packs *array*
      console.log(packList)
      let info = {
        "amountOfPacks": packList.length,
        "packInfo": packList
      }
    })
}
setInterval(function monitor(){
  let packList = request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(`Successfully sent Request at ${new Date()}`)
      let data = JSON.parse(response.body)
      let packList = data["data"]["searchPackListings"]["data"]["searchSummary"]["data"]["data"] //Parse response to isolate JSON data of all individual packs *array*
      console.log(packList)
      return packList
    })
  let newPackList = request(options, function (error, response) {
      if (error) throw new Error(error);
    console.log(`Successfully sent Request at ${new Date()}`)
        let data = JSON.parse(response.body)
        let newPackList = data["data"]["searchPackListings"]["data"]["searchSummary"]["data"]["data"] //Parse response to isolate JSON data of all individual packs *array*
        console.log(packList)
        return newPackList
      })
    compareData(packList, newPackList)
    
    }, 3000)