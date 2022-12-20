# 3speak Frontend

## Installation

`./connect.sh` to make ssh tunnels to the mongo db and memcache (only for use in development).

`docker run --name some-redis -p 6379:6379 -d --restart always redis --appendonly yes --requirepass "threespeak"` only needs to be run once to create a redis server locally (both production and development).
