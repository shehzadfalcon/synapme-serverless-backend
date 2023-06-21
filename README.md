
# Synapme backend 

## Run Locally

Clone the project

```bash
  git clone https://github.com/SynapMeEmpire/synapme-gateway.git
```

Go to the project directory

```bash
  cd cloned directory
```

Install dependencies

```bash
  npm install
```

Dependencies

```bash
  Ensure to have this file in the directory
  1. .dynamodb
  2. .env
```

Update development mode env vairable to false

```bash
  file <<< serverless.ts>>>
```

Start the server

```bash
  npm run start
```
## Contribution

Checkout into a new branch

```bash
  git checkout -b [branch name]
```

Pull from origin staging

```bash
  git pull origin staging
```

Work on the task 

```bash
  contribute 
```

Pull from origin staging

```bash
  git pull origin staging
```

Commit changes

```bash
  git add . and git commit -m"[message]"
```

Push  changes

```bash
  git push
```

Create a pull request

```bash
  on github repo create a pull to staging
```

## Deployment

Update the offline mode to true

```bash
  file >>>> serverless.ts <<<<<
```

Deploy the server

```bash
  npm run deploy
```
