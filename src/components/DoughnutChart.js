import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  mounted() {
    this.renderChart(
      {
        labels: [
          'Tips',
          'My Split',
          'Salon Split'
        ],
        datasets: [
          {
            data: [60, 40, 30],
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
          }
        ],
      },
      { responsive: true, maintainAspectRatio: false, legend: false, }
    );
  }
};
