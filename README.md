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


## set the hookurl in the aws system managers parameter store 
/prod/cloudwatchalarmtoslack/hookurl
as secure string encrpted with the key declared in the template


## Test


