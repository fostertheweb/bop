use serenity::client::Context;
use serenity::{
    async_trait,
    model::{channel::Message, gateway::Ready},
    prelude::*,
};
use songbird::SerenityInit;
use std::env;

use tonic::{transport::Server, Request, Response, Status};

use player::play_service_server::{PlayService, PlayServiceServer};
use player::{PlayRequest, PlayResponse};

pub mod player {
    tonic::include_proto!("player");
}

#[derive(Debug, Default)]
pub struct Player {}

#[tonic::async_trait]
impl PlayService for Player {
    async fn play_song(
        &self,
        request: Request<PlayRequest>,
    ) -> Result<Response<PlayResponse>, Status> {
        println!("Received request from: {:?}", request);

        let response = player::PlayResponse {
            guild_id: request.into_inner().guild_id,
        };

        Ok(Response::new(response))
    }
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        if msg.content == "📻" {
            let guild = msg.guild(&ctx.cache).await.unwrap();
            let channel_id = guild
                .voice_states
                .get(&msg.author.id)
                .and_then(|voice_state| voice_state.channel_id);
            let manager = songbird::get(&ctx).await.expect("Songbird init.").clone();

            match channel_id {
                Some(channel) => {
                    let _handler = manager.join(guild.id, channel).await;
                }
                None => {
                    if let Err(why) = msg.reply(&ctx, "You are not in a voice channel.").await {
                        println!("Unable to reply: {:?}", why);
                    };
                }
            }
        }
    }

    async fn ready(&self, _ctx: Context, ready: Ready) {
        println!("{} says hello!", ready.user.name);
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let token =
        env::var("DISCORD_BOT_TOKEN").expect("Add Discord Bot token to environment variables.");

    let mut client = Client::builder(&token)
        .event_handler(Handler)
        .register_songbird()
        .await
        .expect("Error creating client");

    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }

    let addr = "[::1]:50051".parse()?;
    let player = Player::default();

    println!("Play Service listening on {}", addr);
    Server::builder()
        .add_service(PlayServiceServer::new(player))
        .serve(addr)
        .await?;

    Ok(())
}
