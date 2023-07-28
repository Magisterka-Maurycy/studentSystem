# nginx-ingress install
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s

#argocd install
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl apply -f ./argo-ingress.yaml


kubectl apply -f ./namespaces
kubectl apply -f ./accounts

# deploy configs
kubectl apply -f ./configs

# Repo added to argocd
# kubectl create secret generic private-repo-creds --from-literal=type=git --from-literal=url=git@github.com:Magisterka-Maurycy/GitOps.git --from-file=sshPrivateKey=./secrets/key --namespace=argocd
# kubectl label secret private-repo-creds --namespace=argocd argocd.argoproj.io/secret-type=repository

kubectl apply -f ./argo

