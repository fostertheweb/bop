FROM rust:1.51.0-buster as builder
WORKDIR /usr/src/crowdq-player
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
RUN apt-get update && apt-get install -y libopus-dev ffmpeg youtube-dl protobuf-compiler && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/crowdq-player /usr/local/bin/crowdq-player
CMD ["crowdq-player"]
