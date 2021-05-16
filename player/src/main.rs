use std::env;

use songbird::SerenityInit;

use serenity::client::Context;

use serenity::{
    async_trait,
    model::{channel::Message, gateway::Ready},
    prelude::*,
};

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

            if channel_id.is_some() {
                let manager = songbird::get(&ctx).await.expect("Songbird init.").clone();
                let _handler = manager.join(guild.id, channel_id.unwrap()).await;
            } else {
                if let Err(why) = msg.reply(&ctx, "You are not in a voice channel.").await {
                    println!("Unable to reply: {:?}", why);
                };
            }
        }
    }

    async fn ready(&self, _ctx: Context, ready: Ready) {
        println!("{} says hello!", ready.user.name);
    }
}

#[tokio::main]
async fn main() {
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
}
