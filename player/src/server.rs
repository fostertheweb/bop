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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let player = Player::default();

    println!("Play Service listening on {}", addr);
    Server::builder()
        .add_service(PlayServiceServer::new(player))
        .serve(addr)
        .await?;

    Ok(())
}
