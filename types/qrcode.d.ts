declare module 'qrcode' {
  type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

  type QrDataUrlOptions = {
    errorCorrectionLevel?: QrErrorCorrectionLevel;
    margin?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  };

  const QRCode: {
    toDataURL(text: string, options?: QrDataUrlOptions): Promise<string>;
  };

  export default QRCode;
}
