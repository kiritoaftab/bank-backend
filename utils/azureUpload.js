import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

const SAS_URL = process.env.AZURE_SAS_URL; // Your SAS URL
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME; // e.g. "receipts"

export async function uploadPdfToAzureWithSAS(buffer, fileName) {
  if (!SAS_URL) throw new Error("Missing SAS URL");

  // Same as frontend
  const blobServiceClient = new BlobServiceClient(SAS_URL);

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const blobClient = containerClient.getBlockBlobClient(fileName);

  await blobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: "application/pdf" },
  });
  console.log("File uploaded to azure", blobClient.url);
  return blobClient.url;
}
