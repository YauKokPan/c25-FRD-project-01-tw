local machine

1. update nest-server code
2. run nest build command

```
nest build
```

3. build docker image for ubuntu/amd64 from mac/arm and push to docker registry

```
docker buildx build --platform linux/amd64 --push -t paninsula/sweethour-server:latest .
```

---

aws ec2 (ubuntu)

```
0. ssh c25-capstone
```

1. stop nest server

```
cd /home/ubuntu/sweethour
docker compose down
```

2. pull the update docker image

```
docker pull paninsula/sweethour-server:latest
```

2. start docker compose

```
docker compose up -d
```
