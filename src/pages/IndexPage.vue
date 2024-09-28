<template>
  <q-page class="q-pa-md">
    <div class="flex flex-column items-center">
      <div class="flex flex-center">
        <SecureCRUD />
      </div>
      <q-row class="q-gutter-md" justify="center">
        <q-col cols="12" sm="6" class="flex flex-center">
          <div class="pie-chart">
            <pie-chart />
          </div>
          <div class="data-table">
            <data-table />
          </div>
        </q-col>
      </q-row>
    </div>
  </q-page>
</template>

<script>
import pieChart from 'src/components/pieChart.vue';
import DataTable from 'src/components/DataTable.vue';
import SecureCRUD from '../components/SecureCRUD.vue';

export default {
  components: {
    SecureCRUD,
    pieChart,
    DataTable
  }
};
</script>

<style scoped>
.pie-chart,
.data-table {
  max-width: 100%;
  height: auto; 
}

.q-page {
  padding: 0; 
}

.flex-column {
  margin-bottom: 0; 
}

.table {
  margin-bottom: 0; 
}
</style>
