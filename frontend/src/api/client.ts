import axios from 'axios';
import { GenerateRequest, GenerateResponse, ExtractResponse } from '../types/index.js';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60000
});

export const extractAPI = {
  fromFile: async (file: File): Promise<ExtractResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post<ExtractResponse>('/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  fromText: async (text: string): Promise<ExtractResponse> => {
    const response = await client.post<ExtractResponse>('/extract', { text });
    return response.data;
  }
};

export const generateAPI = {
  emails: async (payload: GenerateRequest): Promise<GenerateResponse> => {
    const response = await client.post<GenerateResponse>('/generate', payload);
    return response.data;
  }
};
