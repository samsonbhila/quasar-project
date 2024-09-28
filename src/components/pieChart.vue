<template>
  <q-page class="q-pa-md custom-page">
    <q-card class="custom-card">
      <q-card-section>
        <h2 class="custom-section">Dynamic Pie Chart </h2>
        <canvas ref="myPieChart" style="max-width: auto;"></canvas>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'PieChart',
  setup() {
    const pieChart = ref(null);
    const chartData = ref({
      labels: [], 
      datasets: [{
        label: 'Number of Installs',
        data: [], 
        backgroundColor: [
          '#0B192C', 
          '#028391', 
          '#F0DE36', 
          '#241468', 
          '#0B666A'  
        ],
      }]
    });

    const fetchData = async () => {
      try {
        const response = await fetch('/pieChart.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data) && data.length > 0) {
          chartData.value.labels = data.map(item => item.year); 
          chartData.value.datasets[0].data = data.map(item => item.numInstalls); 

          // Create or update the chart
          createChart();
        } else {
          console.error('Fetched data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    const createChart = () => {
      if (pieChart.value) {
        pieChart.value.destroy(); 
      }

      const ctx = document.querySelector('canvas').getContext('2d');
      pieChart.value = new Chart(ctx, {
        type: 'pie',
        data: chartData.value,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Number of Installs per Year'
            }
          }
        }
      });
    };

    onMounted(() => {
      fetchData();
    });

    return {
      pieChart,
      chartData,
    };
  }
};
</script>

<style scoped>
.custom-title {
  margin-bottom: 20px; 
  color: #333;
  font-weight: bold; 
  text-align: center; 
}
.custom-card {
  background-color: #ffffff; 
  border-radius: 12px; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
  padding: 20px; 
  max-width: auto; 
  width: 500px; 
}
.custom-section {
  font-size: 20px;
  font-weight: bold; 
  text-align: center;
}
canvas {
  max-width: 600px;
}
</style>
