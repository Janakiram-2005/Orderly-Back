import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2'

const DataChart = ({ type, data, options }) => {
  
  // --- THIS IS THE FIX ---
  // We add a "guard clause" at the top.
  // If the 'data' or 'data.datasets' prop is not ready,
  // we return a loader instead of trying to render the chart.
  if (!data || !data.datasets) {
    // You can also just return null
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading chart...</span>
        </div>
      </div>
    );
  }
  // --- END OF FIX ---

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    ...options,
  }

  switch (type) {
    case 'line':
      return <Line data={data} options={chartOptions} />
    case 'bar':
      return <Bar data={data} options={chartOptions} />
    case 'doughnut':
      return <Doughnut data={data} options={chartOptions} />
    case 'pie':
      return <Pie data={data} options={chartOptions} />
    default:
      return <Bar data={data} options={chartOptions} />
  }
}

export default DataChart