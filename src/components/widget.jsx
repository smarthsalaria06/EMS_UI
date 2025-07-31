import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function createChartWidget(chartId) {
  const item = document.createElement('div');
  item.classList.add('grid-stack-item');
  item.style.overflowY = "auto";
  item.style.maxHeight = "805px";
  item.style.overflow = "hidden";
  item.dataset.gsX = 0;
  item.dataset.gsY = 0;
  item.dataset.gsWidth = 3;
  item.dataset.gsHeight = 2;

  const chartContainer = document.createElement('div');
  chartContainer.id = chartId;
  chartContainer.classList.add('grid-stack-item-content');
  chartContainer.style.overflow = "hidden";
  item.appendChild(chartContainer);

  const canvas = document.createElement('canvas');
  chartContainer.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Initialize with empty arrays but with fixed size
  const maxDataPoints = 10;
  const initialData = Array(maxDataPoints).fill(null);
  const initialLabels = Array(maxDataPoints).fill('');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: initialLabels,
      datasets: [{
        label: chartId,
        data: initialData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        tension: 0.4 // Add slight curve to line
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          display: true,
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      animation: {
        duration: 0
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });

  // Store the chart instance directly on the container
  chartContainer.chart = chart;
  
  return item;
}

export function updateChart(obj, chartId) {
  const chartContainer = document.getElementById(chartId);
  
  if (!chartContainer) {
    console.warn(`Chart container with ID "${chartId}" not found.`);
    return;
  }

  const chart = chartContainer.chart;
  
  if (!chart) {
    console.warn(`Chart instance not found for "${chartId}".`);
    return;
  }

  // Remove oldest data point and add new one
  chart.data.labels.shift();
  chart.data.labels.push(obj.timestamp);
  
  chart.data.datasets[0].data.shift();
  chart.data.datasets[0].data.push(obj.data);

  // Ensure we're not exceeding our fixed size
  const maxDataPoints = 10;
  while (chart.data.labels.length > maxDataPoints) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  // Force a complete redraw of the chart
  chart.update('none'); // Use 'none' mode for immediate update
}

// Rest of the code remains the same...
export function createTileWidget(title) {
  const item = document.createElement('div');
  item.classList.add('grid-stack-item');
  item.style.overflow = "hidden";
  item.style.maxHeight = "805px";
  item.dataset.gsX = 0; 
  item.dataset.gsY = 0;
  item.dataset.gsWidth = 2;
  item.dataset.gsHeight = 2;
  
  const tile = document.createElement('div');
  tile.className = "grid-stack-item-content";
  tile.style.display = "flex";
  tile.style.flexDirection = "column";
  tile.style.fontSize = "18px";
  tile.style.fontWeight = "700";
  tile.style.margin = "0";
  tile.style.alignItems = "center";
  tile.textContent = title;
  tile.style.backgroundColor = 'white';
    
  item.appendChild(tile);
  const tileName = document.createElement('div');
  tileName.className = "tileName";
  tileName.id = title;
  tileName.style.fontFamily = "DM Sans, sans-serif";
  tileName.style.paddingTop = "10px";
  tileName.textContent = "ABCD";
  
  tile.appendChild(tileName);
  return item;
}

export function updateTileWidget(title, newValue) {
  const tileName = document.getElementById(title);
  if (tileName) {
    tileName.textContent = newValue;
  } else {
    console.error(`Tile with title ${title} not found`);
  }
}

export default { createChartWidget, createTileWidget, updateTileWidget, updateChart };