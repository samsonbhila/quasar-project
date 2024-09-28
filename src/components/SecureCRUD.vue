<template>
  <div>
    <h1 class="custom-section">Secure CRUD with IndexedDB</h1>
    <div class="table-container">
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Department</th>
              <th>Designation</th>
              <th>ID</th>
              <th>Token</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{ record.name }}</td>
              <td>{{ record.surname }}</td>
              <td>{{ record.department }}</td>
              <td>{{ record.designation }}</td>
              <td>{{ record.id }}</td>
              <td>{{ record.token }}</td>
              <td>
                <button @click="updateSampleRecord">Update Record</button>
                <button @click="deleteSampleRecord(record.id)">Delete</button>
              </td>
            </tr>
            <!-- New Row for Adding Record -->
            <tr>
              <td><input v-model="newRecord.name" placeholder="Enter Name" /></td>
              <td><input v-model="newRecord.surname" placeholder="Enter Surname" /></td>
              <td><input v-model="newRecord.department" placeholder="Enter Department" /></td>
              <td><input v-model="newRecord.designation" placeholder="Enter Designation" /></td>
              <td><input v-model="newRecord.id" placeholder="Enter ID" /></td>
              <td><input v-model="newRecord.token" placeholder="Enter Token" /></td>
              <td>
                <button @click="addRecord">Add Record</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { openDatabase, addRecord, readRecords, updateRecord, deleteRecord, clearRecords } from '../services/databaseService';

export default {
  data() {
    return {
      newRecord: {
        name: "",
        surname: "",
        department: "",
        designation: "",
        id: "",
        token: ""
      },
      records: [], 
    };
  },
  async mounted() {
    await this.initializeDatabase();
  },
  methods: {
    async initializeDatabase() {
      try {
        await openDatabase();
        console.log("Database opened successfully!");
        await this.readRecords(); 
      } catch (error) {
        console.error("Error opening database:", error);
      }
    },

    async addRecord() {
      if (Object.values(this.newRecord).some(field => field.trim() === "")) {
        alert("Please fill in all fields.");
        return;
      }

      await addRecord(this.newRecord);
      this.newRecord = { name: "", surname: "", department: "", designation: "", id: "", token: "" };
      await this.readRecords(); 
    },

    async readRecords() {
      try {
        const records = await readRecords(); 
        console.log('Fetched records:', records); 
        // Parse the JSON strings into objects
        this.records = records.map(record => JSON.parse(record));
        console.log('Parsed records:', this.records); 
      } catch (error) {
        console.error("Error reading records:", error);
      }
    },

    async clearDatabase() {
      try {
        await clearRecords(); 
        this.records = []; 
        console.log("Database cleared and records updated in the component.");
      } catch (error) {
        console.error("Error clearing the database:", error);
      }
    },

    async updateSampleRecord() {
      const idToUpdate = this.records.length ? this.records[0].id : "";
      const updatedData = { ...this.newRecord, id: idToUpdate };
      await updateRecord(idToUpdate, updatedData);
      await this.readRecords(); 
    },

    async deleteSampleRecord(idToDelete) {
      await deleteRecord(idToDelete);
      await this.readRecords(); 
    }
  }
};
</script>

<style scoped>
.custom-section {
  font-size: 20px;
  font-weight: bold; 
  text-align: center; 
  margin-top: 0 ; 
  margin-bottom: 0;
}

.table-container {
  margin-top: 0px;
}

.card {
  background-color: #ffffff; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  padding: 20px; 
  max-width: auto; 
  margin-top: 0;
  margin: 0 auto; 
  overflow: hidden; 
}

table {
  width: auto;
  border-collapse: collapse;
  table-layout: auto; 
  border-radius: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  word-wrap: break-word; 
  overflow: hidden; 
  max-width: auto; 
}

th {
  background-color: #dfdede;
}
@media (max-width: auto) {
  th, td {
    display: block; 
    width: auto; 
    box-sizing: border-box; 
  }

  th {
    position: relative;
  }

  td {
    text-align: right;
    position: relative;
    padding-left: 50%; 
  }

  td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    width: 45%;
    text-align: left;
    font-weight: bold;
  }
}
</style>
