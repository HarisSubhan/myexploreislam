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
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /var/www/myexploreislam
          ./deploy.sh

