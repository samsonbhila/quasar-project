// /src/services/databaseService.js

const dbName = "SecureDB";
const storeName = "SecureStore";
let db;
let encryptionKey;

// Open IndexedDB
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore(storeName, { keyPath: "id" });
      objectStore.createIndex("data", "data", { unique: false });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject("Database error: " + event.target.errorCode);
    };
  });
}

// Generate and store encryption key
async function generateKey() {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  // Export the key for storage
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  localStorage.setItem("encryptionKey", JSON.stringify(Array.from(new Uint8Array(exportedKey))));
  return key;
}

// Retrieve stored encryption key
async function retrieveKey() {
  if (encryptionKey) return encryptionKey;

  const storedKey = JSON.parse(localStorage.getItem("encryptionKey"));
  if (!storedKey) {
    encryptionKey = await generateKey();
  } else {
    const keyData = new Uint8Array(storedKey);
    encryptionKey = await crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
  }

  return encryptionKey;
}

// Encrypt data
async function encryptData(data) {
  const key = await retrieveKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); 
  const encoded = new TextEncoder().encode(data);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  return {
    iv: Array.from(iv), 
    data: Array.from(new Uint8Array(encryptedData)), 
  };
}

// Decrypt data
async function decryptData(encrypted) {
  const key = await retrieveKey();
  const { iv, data } = encrypted;
  try {
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      new Uint8Array(data)
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

// CRUD Operations

// Add a record
export async function addRecord(data) {
  const encrypted = await encryptData(JSON.stringify(data));

  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  objectStore.add({ id: data.id, ...encrypted });

  transaction.oncomplete = () => {
    console.log("Record added successfully!");
  };
  transaction.onerror = () => {
    console.error("Error adding record");
  };
}

// Read records
export async function readRecords() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = async () => {
      const records = request.result;

      console.log("Records retrieved:", records);

      try {
        const decryptedRecords = await Promise.all(
          records.map(async (record) => {
            console.log("Decrypting record:", record); 
            const decrypted = await decryptData(record);
            console.log("Decrypted record:", decrypted); 
            return decrypted;
          })
        );
        console.log("All decrypted records:", decryptedRecords); 
        resolve(decryptedRecords); 
      } catch (error) {
        console.error("Error decrypting records:", error);
        reject(error); 
      }
    };

    request.onerror = (event) => {
      console.error("Error reading records:", event.target.error);
      reject(event.target.error); 
    };
  });
}
// Clear all records from the object store
export async function clearRecords() {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.clear();

      request.onsuccess = () => {
          console.log("All records cleared successfully!");
          resolve();
      };

      request.onerror = (event) => {
          console.error("Error clearing records:", event.target.error);
          reject(event.target.error);
      };
  });
}


// Update a record
export async function updateRecord(id, newData) {
  const encrypted = await encryptData(JSON.stringify(newData));

  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.put({ id, ...encrypted });

  request.onsuccess = () => {
    console.log("Record updated successfully!");
  };
  request.onerror = () => {
    console.error("Error updating record");
  };
}

export async function deleteRecord(id) {
  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

