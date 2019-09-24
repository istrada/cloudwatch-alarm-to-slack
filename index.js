'use strict';

var AWS = require('aws-sdk');
var ssm = new AWS.SSM();
const url = require('url');
const https = require('https');
var axios = require('axios');
const querystring = require('querystring');


const slackChannel = process.env.slackChannel;
const productName =  process.env.productName;
const environmentName = process.env.environmentName;

let hookUrl;


async function http_post(url, data, params){
    return await http_request({
      method:'post',
      url:url,
      data:data,
      params: params
    }); 
 };

async function http_request(config){        
    config.headers = {
      'content-type': 'application/json',        
      'cache-control': 'no-cache' ,
      'accept': 'application/json',      
    };
    
    try{
      const res = await axios(config);
      console.log(res);
      if (res && res.data){
        return res.data;
      }
      else {
        return null;
      }
    }
    catch(error){
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      return null;
    }
};

async function processEvent(event) {
    var timestamp = (new Date(event.Records[0].Sns.Timestamp)).getTime()/1000;
  var message = JSON.parse(event.Records[0].Sns.Message);
  var region = event.Records[0].EventSubscriptionArn.split(":")[3];
  var subject = "AWS CloudWatch Notification";
  var alarmName = message.AlarmName;
  var metricName = message.Trigger.MetricName;
  var oldState = message.OldStateValue;
  var newState = message.NewStateValue;
  var alarmDescription = message.AlarmDescription;
  var alarmReason = message.NewStateReason;
  var trigger = message.Trigger;
  var color = "warning";

  if (message.NewStateValue === "ALARM") {
      color = "danger";
  } else if (message.NewStateValue === "OK") {
      color = "good";
  }

  var slackMessage = {
    text: "*" + subject + "*",
    attachments: [
      {
        "color": color,
        "fields": [
          { "title": "Alarm Name", "value": alarmName, "short": true },
          { "title": "Alarm Description", "value": alarmDescription, "short": false},
          {
            "title": "Trigger",
            "value": trigger.Statistic + " "
              + metricName + " "
              + trigger.ComparisonOperator + " "
              + trigger.Threshold + " for "
              + trigger.EvaluationPeriods + " period(s) of "
              + trigger.Period + " seconds.",
              "short": false
          },
          { "title": "Old State", "value": oldState, "short": true },
          { "title": "Current State", "value": newState, "short": true },
          {
            "title": "Link to Alarm",
            "value": "https://console.aws.amazon.com/cloudwatch/home?region=" + region + "#alarm:alarmFilter=ANY;name=" + encodeURIComponent(alarmName),
            "short": false
          }
        ],
        "ts":  timestamp
      }
    ]
  };   
    await http_post(hookUrl, slackMessage);      
};


async function handler(event, context, callback) 
 {
    if (!hookUrl){
        hookUrl = await getSSMParameter(`/${environmentName}/cloudwatchalarmtoslack/hookurl`);
    }

    if (hookUrl) {
        await processEvent(event, callback);
    }
    else {
        console.log('Hook URL has not been set.');
    }
};

async function getSSMParameter(path) {      
    var params = {
        Name: path,      
        WithDecryption: true
    };
      
    var ret = await ssm.getParameter(params).promise();  
    return ret.Parameter.Value;
  };
  
  module.exports.handler = handler