export const config = {
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || '/tmp/uploads'
};

export function validateConfig() {
  if (!config.apiKey) {
    throw new Error('DASHSCOPE_API_KEY environment variable is required');
  }
}
