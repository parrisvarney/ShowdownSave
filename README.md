# Showdown Team Saver

Save your Showdown teams to the cloud!

## Overview

Saves your teams to the cloud using a Chrome browser extension, AWS Lambda, and S3.

## Code

### Chrome extension

Saved in the `/chrome-extension` folder.

#### To load

1. go to the chrome extensios page, 
1. check "developer mode"
1. click "Load unpacked extension"
1. select the `/chrome-extension` folder, then "select"

### The Lambda service

Saved in the `/lambda` folder.

1. Install the [serverless framework](https://serverless.com/)
1. Have an AWS account, with a credit card on file (sorry...)
1. From the CLI, in the `/lambda` folder: `../node_modules/.bin/serverless deploy --stage one --region us-east-1`
1. Update any paths in the `/chrome-extension` folder from `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/team` to your API endpoint.