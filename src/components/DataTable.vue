<template>
    <q-page class="q-pa-md custom-page">
      <q-card class="q-ma-md custom-card">
        <q-card-section>
          <h2 class="custom-section">Dynamic Data Table with Advanced Filtering</h2>
  
          <!-- Dropdown for filtering by designation -->
          <q-select
            v-model="selectedDesignation"
            :options="designationOptions"
            label="Filter by Designation"
            emit-value
            clearable
            @change="onSearch"
          />
  
          <!-- Search Input -->
          <q-input
            v-model="searchTerm"
            placeholder="Search..."
            debounce="300"
            filled
            @input="onSearch"
            clearable
            class="search-input"
            round
            outlined
            dense
            clear-icon="clear"
          />
  
          <!-- Data Table -->
          <q-table
            :rows="paginatedRows"
            :columns="columns"
            row-key="id"
            :pagination="pagination"
            :rows-per-page-options="[5, 10, 20, 50, 100]"
            @request="onRequest"
          >
            <!-- Custom footer for pagination info -->
            <template v-slot:bottom>
              <div class="q-mt-md q-table-footer">
                <div class="pagination-info">
                  <span>Records per page: {{ pagination.rowsPerPage }}</span>
                  <q-card class="pagination-card q-mx-sm" flat>
                    <q-btn @click="goToPreviousPage" label="<" flat />
                    <q-btn @click="goToNextPage" label=">" flat />
                  </q-card>
                  <span class="q-mx-md">{{ startRecord }} - {{ endRecord }} of {{ totalRows }}</span>
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  
  export default {
    name: 'DataTable',
    setup() {
      const rows = ref([]); 
      const pagination = ref({
        page: 1,
        rowsPerPage: 5,
      });
      const searchTerm = ref('');
      const selectedDesignation = ref(null);
      const designationOptions = ref([]);
  
      const columns = ref([
        { name: 'name', label: 'Name', align: 'left', field: 'name' },
        { name: 'designation', label: 'Designation', align: 'left', field: 'designation' },
        { name: 'department', label: 'Department', align: 'left', field: 'department' },
      ]);
  
      // Fetch data from users.json file
      const fetchData = async () => {
        try {
          const response = await fetch('/users.json'); 
          const data = await response.json();
          rows.value = data;
  
          // Extract unique designations for the dropdown filter
          const uniqueDesignations = [...new Set(data.map(user => user.designation))];
          designationOptions.value = uniqueDesignations.map(d => ({ label: d, value: d }));
  
          console.log('Fetched rows:', rows.value); 
        } catch (error) {
          console.error('Error fetching users data:', error);
        }
      };
  
      // Filtered rows based on search term and selected designation
      const filteredRows = computed(() => {
        return rows.value.filter(row => {
          const matchesSearchTerm = row.name.toLowerCase().includes(searchTerm.value.toLowerCase());
          const matchesDesignation = !selectedDesignation.value || row.designation === selectedDesignation.value;
          return matchesSearchTerm && matchesDesignation;
        });
      });
  
      // Handle pagination and sorting requests
      const onRequest = (paginationRequest) => {
        pagination.value = paginationRequest;
      };
  
      // Computed property to handle paginated rows
      const paginatedRows = computed(() => {
        const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
        const end = start + pagination.value.rowsPerPage;
        return filteredRows.value.slice(start, end); 
      });
  
      // Computed property to handle total rows for pagination
      const totalRows = computed(() => {
        return filteredRows.value.length;
      });
  
      // Computed properties for record range display
      const startRecord = computed(() => {
        return (pagination.value.page - 1) * pagination.value.rowsPerPage + 1;
      });
  
      const endRecord = computed(() => {
        return Math.min(startRecord.value + pagination.value.rowsPerPage - 1, totalRows.value);
      });
  
      // Handle page change
      const goToPreviousPage = () => {
        if (pagination.value.page > 1) {
          pagination.value.page--;
        }
      };
  
      // Navigate to the next page
      const goToNextPage = () => {
        if (pagination.value.page < Math.ceil(totalRows.value / pagination.value.rowsPerPage)) {
          pagination.value.page++;
        }
      };
  
      onMounted(() => {
        fetchData(); 
      });
  
      return {
        rows,
        columns,
        searchTerm,
        selectedDesignation,
        designationOptions,
        pagination,
        onRequest,
        paginatedRows,
        totalRows,
        goToPreviousPage,
        goToNextPage,
        startRecord,
        endRecord,
      };
    }
  };
  </script>
  
  <style scoped>
  .q-select,
  .q-input {
    margin-bottom: 16px;
  }
  
.custom-card {
    background-color: #ffffff; 
    border-radius: 12px; 
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
    padding: 20px; 
    max-width: auto;
    width: auto; 
  }
  .custom-section {
    font-size: 20px;
    font-weight: bold; 
    text-align: center; 
    margin-top: 0;
    margin-bottom: 0;
  }
  .search-input {
    max-width: auto; 
    margin-bottom: 2px; 
    border-radius: 15px;
  }
  
  .search-input input {
    padding: 10px; 
  }
  
  .search-input .q-field__control {
    background-color: #f5f5f5; 
    border-radius: 20px !important; 
  }
  
  .search-input .q-field__control:hover {
    background-color: #e0e0e0; 
  }
  
  .search-input .q-icon {
    color: #757575; 
  }
  
  .search-input .q-field--filled {
    border: 1px solid #ccc; 
  }
  .q-table-footer {
    display: flex;
    justify-content: right; 
    align-items: right; 
  }
  
  .pagination-info {
    display: flex;
    align-items: center; 
  }
  
  .pagination-card {
    display: flex;
    align-items: center; 
    border-radius: 8px;
    padding: 4px 8px; 
    background-color: #f5f5f5; 
  }
  </style>
  