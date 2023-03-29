// Dependencies
import dotenv from "dotenv";
import sendinblueSDK from "sib-api-v3-sdk";

dotenv.config();

const sendinblueClient = sendinblueSDK.ApiClient.instance;

let apiKey = sendinblueClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const sendinblue = new sendinblueSDK.TransactionalEmailsApi();

export default sendinblue;
