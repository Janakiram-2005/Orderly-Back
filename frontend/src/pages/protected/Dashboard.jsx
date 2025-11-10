import StatCard from '../../components/common/StatCard'
import DataChart from '../../components/common/DataChart'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js'
import { formatCurrency } from '../../utils/helpers'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// --- THIS IS THE DATA ---
// We define it as constants. It CANNOT be null.
// If your charts are spinning, this data is not being passed correctly.
const growthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'New Users',
      data: [120, 150, 180, 220, 190, 250],
      borderColor: '#6C63FF',
      backgroundColor: 'rgba(108, 99, 255, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}

const paymentData = {
  labels: ['Completed', 'Pending', 'Failed'],
  datasets: [
    {
      label: 'Payments Status',
      data: [300, 50, 15],
      backgroundColor: ['#198754', '#ffc107', '#dc3545'],
      hoverOffset: 4,
    },
  ],
}

// --- COMPONENT ---
const Dashboard = () => {
  // TODO: Fetch this data from your API
  const mockRecentTransactions = [
    { id: 'T_12345', customer: 'John Doe', amount: 3500.50, status: 'Completed' },
    { id: 'T_12346', customer: 'Jane Smith', amount: 1200.00, status: 'Completed' },
    { id: 'T_12347', customer: 'Mike Johnson', amount: 8999.00, status: 'Pending' },
    { id: 'T_12348', customer: 'Sarah Lee', amount: 2310.00, status: 'Failed' },
  ]

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>

      {/* 1. Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Total Revenue"
            value="₹4,523,189"
            icon="bi-currency-rupee" // <-- ICON IS NOW FIXED
            color="success"
            change="+5.2%"
          />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Total Orders"
            value="12,560"
            icon="bi-box-seam-fill"
            color="primary"
            change="+2.1%"
          />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatCard
            title="New Customers"
            value="1,200"
            icon="bi-people-fill"
            color="info"
            change="+10%"
          />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Pending Restaurants"
            value="15"
            icon="bi-shop"
            color="warning"
            change="View"
          />
        </div>
      </div>

      {/* 2. Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Growth Overview (Users)</h5>
              {/* This prop `data={growthData}` should pass the constant */}
              <DataChart type="line" data={growthData} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Payments Overview</h5>
              {/* This prop `data={paymentData}` should pass the constant */}
              <DataChart type="doughnut" data={paymentData} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Payments Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Recent Transactions</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Transaction ID</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="fw-bold">{tx.id}</td>
                    <td>{tx.customer}</td>
                    <td>{formatCurrency(tx.amount)}</td>
                    <td>
                      <span className={`badge bg-${
                        tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard