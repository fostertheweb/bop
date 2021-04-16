#cloud-config

package_upgrade: true
packages:
  - git
  - libtool
  - gcc-c++

write_files:
  - path: /etc/environment
    content: |
      SPOTIFY_CLIENT_ID="${spotify_client_id}"
      SPOTIFY_CLIENT_SECRET="${spotify_client_secret}"
      DISCORD_BOT_TOKEN="${discord_bot_token}"
      REDIS_HOST="${redis_host}"
      REDIS_PORT="${redis_port}"
      REDIS_PASSWORD="${redis_password}"
      YOUTUBE_API_KEY="${youtube_api_key}"
      DIST_S3_URI="${dist_s3_uri}"
    append: true

run_cmd:
  - curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
  - source $HOME/.bashrc
  - nvm install --lts
