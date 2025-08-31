import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  }

  async uploadLeadAttachment(userId: string, boardId: string, leadId: string, file: File): Promise<{ name: string, url: string }> {
    const timestamp = Date.now();
    const path = `users/${userId}/boards/${boardId}/leads/${leadId}/attachments/${timestamp}_${file.name}`;
    
    try {
      const url = await this.uploadFile(file, path);
      return {
        name: file.name,
        url: url
      };
    } catch (error) {
      console.error('Erro ao fazer upload do anexo:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }
}