# A-List

![A-List](https://assets.mattwyskiel.com/a-list/podcast-image.jpeg)

A home website for my DJ-style mixes.

## Background

I grew up with a love for music. My parents raised me on James Taylor, John Mayer, Donald Fagen, and Van Halen. For many years, at least since college, I've been building my skills on the side as a DJ and mixer, most prominently putting them to use as host of my college radio show King Matt's A-List.

Post-college, I started creating mixes again, and I began hosting them on my Asset server and sending links to my friends. As I did it more and more, I realized they would want an easier experience listening, and that I too would want an easier way to access my mixes when I want to listen to them.

See a need, fill a need!

## Features

- Centralized database of mixes I've made since 2021
- Web player for easy streaming of audio
- Hostable podcast feed for easy import into podcast apps
  - https://api.mattwyskiel.com/a-list/podcast-feed :grin:

## Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [AWS Lambda](https://aws.amazon.com/lambda/) (Node.js)
- **Database:** [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
- **File Hosting:** [Amazon S3](https://aws.amazon.com/s3/) (defined externally)
- **Infrastructure:** [SST v2](https://v2.sst.dev/) (based on [AWS CDK](https://aws.amazon.com/cdk/))
- **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions)
