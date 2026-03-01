declare module 'crypto-js' {
  interface AES {
    encrypt(message: string, secret: string): any;
    decrypt(ciphertext: string, secret: string): any;
  }
  
  interface SHA256 {
    (message: string): any;
  }
  
  const AES: AES;
  const SHA256: SHA256;
  
  interface Enc {
    Utf8: any;
  }
  
  const enc: Enc;
}
