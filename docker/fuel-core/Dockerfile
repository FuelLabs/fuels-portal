FROM ghcr.io/fuellabs/fuel-core:v0.19.0

ARG FUEL_IP=0.0.0.0
ARG FUEL_PORT=4000

# dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y curl jq && rm -rf /var/lib/apt/lists/*

# copy chain config
WORKDIR /fuel
COPY chainConfig.json .

# expose fuel node port
ENV FUEL_IP="${FUEL_IP}"
ENV FUEL_PORT="${FUEL_PORT}"
ENV CONSENSUS_KEY="${CONSENSUS_KEY}"
ENV MIN_GAS_PRICE="${MIN_GAS_PRICE}"

# copy over script and run
COPY ./scripts/fuel_core.sh .
CMD ["sh", "./fuel_core.sh"]

EXPOSE ${FUEL_PORT}
