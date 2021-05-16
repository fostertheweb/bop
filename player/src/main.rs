use serenity::client::Context;
use serenity::{
    async_trait,
    model::{channel::Message, gateway::Ready},
    prelude::*,
};
use songbird::SerenityInit;
use std::env;

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

// async fn play(ctx: &Context, msg: &Message) {
//     let url = "";
//     let guild = msg.guild(&ctx.cache).await.unwrap();
//     let guild_id = guild.id;

//     let manager = songbird::get(ctx)
//         .await
//         .expect("Songbird Voice client placed in at initialisation.")
//         .clone();

//     if let Some(handler_lock) = manager.get(guild_id) {
//         let mut handler = handler_lock.lock().await;

//         let source = match songbird::ytdl(&url).await {
//             Ok(source) => source,
//             Err(why) => {
//                 println!("Err starting source: {:?}", why);

//                 // error playing

//                 return Ok(());
//             }
//         };

//         handler.play_source(source);

//         // song is playing
//     } else {
//         // not in voice channel
//     }

//     Ok(())
// }

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
