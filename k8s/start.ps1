# k3d dns fix enabled to resolve dns hostnames in local network
# export K3D_FIX_DNS=1
$Env:K3D_FIX_DNS=1
k3d cluster delete newcluster
k3d cluster create newcluster --api-port 127.0.0.1:6443 -p 80:80@loadbalancer -p 443:443@loadbalancer --k3s-arg="--disable=traefik@server:0" --wait

& .\scripts\install.ps1
