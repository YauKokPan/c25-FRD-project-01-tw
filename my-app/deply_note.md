1. Ensure React .env is the domain name and ec2 domain name

```
yarn build
```

2. upload to s3 bucket

```
aws s3 sync . s3://<YOUR_BUCKET_NAME>

```

3. AWS cloudfront invalidate

```
/*
```
