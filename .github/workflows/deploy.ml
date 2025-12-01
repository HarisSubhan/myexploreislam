name: Auto Deploy to VPS
on:
  push:
    branches: [ "main" ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repo
      uses: actions/checkout@v3
    - name: Execute remote SSH command
      uses: appleboy/ssh-action@v1.0.0
      with:
        host:  184.168.31.204 
        username: exploreislam
        key: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIB15scMSswR2i03cnvAHZ8f5eiD6C2fGLyrdICmK1/U8 hp@DESKTOP-AV07TF6
        script: |
          cd /var/www/myexploreislam
          ./deploy.sh

