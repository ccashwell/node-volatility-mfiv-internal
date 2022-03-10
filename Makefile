.PHONY: token login

ecr-deploy: login bootstrap-npm

login:
	aws codeartifact login --tool npm --domain artifacts --domain-owner 994224827437 --repository volatility-npm-store

bootstrap-npm:
	export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain artifacts --domain-owner 994224827437 --query authorizationToken --output text`
