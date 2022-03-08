.PHONY: token login

login:
	aws codeartifact login --tool npm --domain artifactacts --domain-owner 061573364520 --repository volatility-npm-store

token:
	export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain artifacts --domain-owner 061573364520 --query authorizationToken --output text`

# Add to .npmrc
#registry=https://artifacts-061573364520.d.codeartifact.us-east-2.amazonaws.com/npm/volatility-npm-store/
#//artifacts-061573364520.d.codeartifact.us-east-2.amazonaws.com/npm/volatility-npm-store/:always-auth=true
#//artifacts-061573364520.d.codeartifact.us-east-2.amazonaws.com/npm/volatility-npm-store/:_authToken=${CODEARTIFACT_AUTH_TOKEN}