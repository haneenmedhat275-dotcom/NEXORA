require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

module.exports = { client };