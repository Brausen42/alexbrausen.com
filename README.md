# AlexBrausen.com

This is a personal website, mainly used as a way to experiment with different technologies and make something hopefully interesting.

## Stack

The current stack consists of a Vue.js frontend built using Typescript and SCSS, which is then webpacked and put alongside the HTML. This has some links out to other websites I've made in the past using simple HTML, CSS, and pureJS. All these files are layered on an alpine NGINX Docker image so they can be served to requesters. 

## Depoloyment
I'm currently deploying this site through Digital Ocean and it's Kubernetes support. The Kubernetes cluster deploys the Stack above into pods and uses a LoadBalancer, Ingress control and the cert-manager project to securely run the site in a way that is easy to do continuous integration and deployment (CI/CD) by updating the docker image and deployment spec.

## Future
There's a lot that I would hope to do with this site. Here's a list of potential improvements in a roughly priority-based order:
* Transition the linked sites to be natively in the site
* Use the Spotify REST api to display the Spotify playlist in a more elegant fashion than an iframe
  * This would be done in such a way that could be extended to interact with the playlist in an interesting way (like specific songs, suggest songs, strip out songs by genre, etc.)
* Overall, include more content on the site so it's less of a tech demo
