# AlexBrausen.com

This is a personal website, mainly used as a way to experiment with different technologies and make something hopefully interesting.

## Stack

### Frontend

A Vue.js client is built using Node.js, Typescript and SCSS which is then webpacked into a single .js file to be put alongside the HTML. This has some links out to other websites I've made in the past using simple HTML, CSS, and pureJS. 

A Node.js server is used to serve these static files, and also allows a path for the client to gain dynamic data through REST calls.

## Depoloyment
I'm currently deploying this site through Digital Ocean and it's Kubernetes support. The Kubernetes cluster deploys the Stack above into pods and uses a LoadBalancer, Ingress control and the cert-manager project to securely run the site in a way that is easy to do continuous integration and deployment (CI/CD) by updating the docker image and deployment spec.

## Future
There's a lot that I would hope to do with this site. Here's a list of potential improvements:
* Transition the linked sites to be natively in the site
* Improve the Snake game by using a JS graphics library
* Add the ability to interact with the Spotify playlist in intuitive or meaningful ways (sorting, voting on the songs that are in the playlist, etc.)
* Overall, include more content on the site so it's less of a tech demo

## K8s

Followed a guide for configuring k8s cluster: https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes#step-2-%E2%80%94-setting-up-the-kubernetes-nginx-ingress-controller

### External Configs Used
* `kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.0.3/cert-manager.yaml`
* `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/do/deploy.yaml`


