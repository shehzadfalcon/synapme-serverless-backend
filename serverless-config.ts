require('dotenv').config();

const config: { region: any; stage: string, profile:string } = {
  region: process.env.REGION || 'us-east-1',
  stage: process.env.STAGE || 'dev',
  profile: process.env.AWS_PROFILE || 'default'
};

export default config;
