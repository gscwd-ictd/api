import { Injectable } from '@nestjs/common';
import { InputFile } from 'node-appwrite';
import sdk = require('node-appwrite');

@Injectable()
export class AppwriteService {
  constructor() {}

  getStorage() {
    const client = new sdk.Client()
      .setEndpoint(`http://${process.env.APPWRITE_HOST}:${process.env.APPWRITE_PORT}/v1`)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new sdk.Storage(client);
    return storage;
  }

  async createFile(fileUrl: string, fileName: string, id: string) {
    const file = InputFile.fromPath(fileUrl, fileName);
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

  async deleteFile(fileId: string) {
    const result = await this.getStorage().deleteFile(process.env.APPWRITE_BUCKET_ID, fileId);
    console.log(result);
    return result;
  }
}
