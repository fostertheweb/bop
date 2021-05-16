use std::path::Path;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    if let Err(why) = tonic_build::configure()
        .out_dir(Path::new("service"))
        .compile(
            &[Path::new("proto/player.proto")],
            &[Path::new("proto/player.proto")],
        )
    {
        println!("Error: {}", why);
    }

    Ok(())
}
