#[tarpc::service]
pub trait Player {
    async fn play_song(guild_id: String, url: String) -> String;
}
