export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getFileName = (filepath: string): string => {
  return filepath.split('/').pop() || '';
};

export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};


export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

export const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const extension = getFileExtension(filename);
  return videoExtensions.includes(extension);
};

export const isAudioFile = (filename: string): boolean => {
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
  const extension = getFileExtension(filename);
  return audioExtensions.includes(extension);
};

export const isDocumentFile = (filename: string): boolean => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const extension = getFileExtension(filename);
  return documentExtensions.includes(extension);
};

export const getMimeType = (filename: string): string => {
  const extension = getFileExtension(filename);
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Default
    txt: 'text/plain',
  };

  return mimeTypes[extension] || 'application/octet-stream';
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = getFileNameWithoutExtension(originalName);

  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};