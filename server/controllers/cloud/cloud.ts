import * as AWS from "aws-sdk";
import * as firebaseAdmin from "firebase-admin";
import fs from "fs";

import * as path from "path";
import Blowfish from 'blowfish-node';
import * as crypto from 'crypto';
// import CryptoJS from "crypto-js";
import axios from "axios"


import { AWSConfig, defaultConfig } from "../../config/config";
import { FirebaseConfig } from "../../config/config";
const filePath = path.resolve(__dirname, "../../uploads");

const firebaseJSON = path.resolve(
  __dirname,
  "../../access-shield-jagah-firebase.json"
);



async function encryptFile(filePath: string, password: string) {
  try {
    const data = fs.readFileSync(filePath);
    // console.log('d', data.toString("base64"))
    
    const iv = crypto.randomBytes(8);
    console.log(iv, "iv");
    const cipher = new Blowfish(password);
    cipher.setIv(iv)

    const encryptedData = cipher.encode(data.toString("base64"));
    // console.log('e', encryptedData)
    // const decryptedData= cipher.decode(encryptedData)
    // console.log('d', decryptedData)

     const encryptedString=Buffer.from(iv).toString("base64") + Buffer.from(encryptedData).toString("base64");
   

    const finalOutputPath =`${filePath}.encrypted`;
    console.log('path',finalOutputPath)
    fs.writeFileSync(finalOutputPath, encryptedString);
  
    return finalOutputPath;
    
  //   const readerBlowfish = new FileReader();

  //   readerBlowfish.onload = async () => {
  //     const fileContent: any = readerBlowfish.result;
  //     const encryptedContent = await CryptoJS.Blowfish.encrypt(
  //       fileContent,
  //       password
  //     ).toString();
  //     // resolve(encryptedContent);
  //   };

  //   readerBlowfish.onerror = async (error) => {
  //    throw error;
  //   };

  //   readerBlowfish.readAsBinaryString(acceptedFile);

  } catch (error) {
    console.error("Error encrypting file:", error);
  }
}

// Function to decrypt content with Blowfish
const decryptFile = (encryptedData: Uint8Array, iv: string | Buffer | Uint8Array,  key: string) => {
    try {
    const cipher = new Blowfish(key);
    cipher.setIv(iv);
    const decryptedData= cipher.decode(encryptedData)
    console.log('d', decryptedData);
    //@ts-ignore
    return Buffer.from(decryptedData, 'base64').toString() ;
  
    } catch (error) {
      throw error;
    }
  };


try {
  const serviceAccountRaw = fs.readFileSync(firebaseJSON, "utf8");
  // Parse the JSON string into the correct type
  const firebaseServiceAccount: firebaseAdmin.ServiceAccount =
    JSON.parse(serviceAccountRaw);

  // Initialize Firebase Admin SDK
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    storageBucket: FirebaseConfig.FIREBASE_STORAGE_BUCKET,
  });
} catch (error) {
  console.error("Error reading file:", error);
}



export const uploadToFirebase = async (
  filePath: string,
  fileName: string,
): Promise<string> => {
  const bucket = firebaseAdmin.storage().bucket();
  const file = bucket.file(fileName);

  try {
    const encryptedFilePath = await encryptFile(filePath, defaultConfig.ENCRYPTION_KEY);
    console.log(encryptedFilePath)
    await file.save(fs.createReadStream(String(encryptedFilePath)));
    return `gs://${bucket.name}/${file.name}`;
  } catch (error) {
    throw error;
  }
};

// Function to fetch file from Firebase Storage and decrypt it
export const fetchFileFromFirebase = async (fileName: string) => {
  try {
    const storage = firebaseAdmin.storage();
    const bucket = storage.bucket();
    const fileRef = bucket.file(fileName);
    

    // Get a signed URL for the file
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
    const [signedUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: expiryDate,
    });

     // Fetch the file content using Axios
    const response = await axios.get(signedUrl, { responseType: 'text' });

    const encryptedString=response.data
    // const decryptedBuffer = Buffer.from(encryptedString, 'base64');
    const iv = Buffer.from(encryptedString.slice(0, 12), 'base64');
    const encryptedData=  Buffer.from(encryptedString.slice(12), 'base64');

    console.log(defaultConfig.ENCRYPTION_KEY);
   
     const decryptedContent = decryptFile(encryptedData, iv,  defaultConfig.ENCRYPTION_KEY);
    

    // Define the final output path
    const finalOutputPath = path.resolve(filePath, fileName); // Adjust the file path as needed

   // Write the decrypted content to the file
    const writeStream = fs.createWriteStream(finalOutputPath, { flags: 'w' });
    writeStream.write(Buffer.from(decryptedContent));
    writeStream.end();
    // Handle events for errors and successful completion
    writeStream.on('error', (error) => {
      console.error('Error writing file:', error);
    });

    writeStream.on('finish', () => {
      console.log(`File "${finalOutputPath}" written successfully.`);
    });

    console.log(`File "${fileName}" decrypted and saved to "${finalOutputPath}" successfully.`);

    return finalOutputPath;
  } catch (error) {
    console.error('Error fetching and decrypting file from Firebase:', error);
    throw error;
  }
};



