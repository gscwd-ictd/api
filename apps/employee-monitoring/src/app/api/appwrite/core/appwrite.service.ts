import { Injectable } from '@nestjs/common';
import { InputFile } from 'node-appwrite';

@Injectable()
export class AppwriteService {
  constructor() {}

  getStorage() {
    const sdk = require('node-appwrite');
    const client = new sdk.Client()
      .setEndpoint(`http://${process.env.APPWRITE_HOST}:${process.env.APPWRITE_PORT}/v1`) // Your API Endpoint
      .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
      .setKey(process.env.APPWRITE_API_KEY);
    // Your secret API key
    const storage = new sdk.Storage(client);
    return storage;
  }

  async createFile(fileUrl: string, fileName: string, id: string) {
    const file = InputFile.fromPath(fileUrl, fileName);
    console.log(file);
    const result = await this.getStorage().createFile(process.env.APPWRITE_BUCKET_ID, id, file);
    return result;
  }

  async listFiles() {
    const result = await this.getStorage().listFiles(process.env.APPWRITE_BUCKET_ID);
    return result;
  }

  async getFileUrl(fileId: string) {
    return `http://${process.env.APPWRITE_HOST}:${process.env.APPWRITE_PORT}/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
  }
}
