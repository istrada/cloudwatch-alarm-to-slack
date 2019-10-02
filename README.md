# CloudWatch Alarm to Slack Application

An Amazon SNS trigger that sends CloudWatch alarm notifications to Slack.

[aws example](https://github.com/awslabs/serverless-application-model/tree/master/examples/apps/cloudwatch-alarm-to-slack)

[another example](https://github.com/assertible/lambda-cloudwatch-slack)

## deploy the application
replace the liuhongbo with your own name
```bash
aws s3 mb s3://cloudwatchalarmtoslack-deploy-package
sam build -m package.json
sam package --output-template-file cloudwatchalarmtoslack-deploy-template.yaml --s3-bucket 'cloudwatchalarmtoslack-deploy-package'
sam deploy --template-file ./cloudwatchalarmtoslack-deploy-template.yaml --stack-name cloudwatchalarmtoslack-istrada --capabilities CAPABILITY_NAMED_IAM --parameter-overrides SlackChannelParameter=istrada-devops ProductNameParameter=istrada UsernameParameter=liuhongbo EnvironmentParameter=prod
sam deploy --template-file ./cloudwatchalarmtoslack-deploy-template.yaml --stack-name cloudwatchalarmtoslack-concretego --capabilities CAPABILITY_NAMED_IAM --parameter-overrides SlackChannelParameter=concretego-devops ProductNameParameter=concretego UsernameParameter=liuhongbo EnvironmentParameter=prod
```

If you want to delete the stack
```bash
aws cloudformation delete-stack --stack-name 'cloudwatchalarmtoslack-istrada'
aws cloudformation delete-stack --stack-name 'cloudwatchalarmtoslack-concretego'
```

## set the hookurl in the aws system managers parameter store 
for istrada
go to [parameter store](https://console.aws.amazon.com/systems-manager/parameters) and add a parameter with path set to 
/prod/cloudwatchalarmtoslack/istrada/hookurl
as secure string encrpted with the key cloudwatch-alarm-to-slack-encryptkey-istrada

## Test

[aws sns publish](https://docs.aws.amazon.com/cli/latest/reference/sns/publish.html)
[What is in the JSON payload Cloudwatch sends to SNS? How can I read that data?](https://stackoverflow.com/questions/52379697/what-is-in-the-json-payload-cloudwatch-sends-to-sns-how-can-i-read-that-data)

aws sns publish --topic arn:aws:sns:us-east-1:746295018053:concretego-cloudwatch-alarm --message file://message.txt