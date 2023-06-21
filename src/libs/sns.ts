const AWSSNS = require('aws-sdk');

export default new AWSSNS.SNS({ apiVersion: '2010-03-31' });
