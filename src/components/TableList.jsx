import { useEffect, useState } from 'react'
import { selectAll } from '../services/db'
import AdminLogin from './AdminLogin'
import { LogOut, Shield } from 'lucide-react'

export default function TableList() {
  const [table, setTable] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState('')

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth')
    const user = sessionStorage.getItem('adminUser')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      setAdminUser(user || 'admin')
    }
  }, [])

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true)
      const user = sessionStorage.getItem('adminUser')
      setAdminUser(user || 'admin')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    sessionStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    setAdminUser('')
    setTable('')
    setRows([])
  }

  const fetchRows = async (t) => {
    if (!t) return
    setLoading(true)
    setError(null)
    try {
      const data = await selectAll(t)
      setRows(data || [])
    } catch (e) {
      setError(e)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // no auto-fetch until user sets a table
  }, [])

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <div className="card bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent/10 rounded-full p-2">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Admin Database Viewer</h2>
              <p className="text-sm text-text-muted">Logged in as: <span className="font-medium">{adminUser}</span></p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Table Viewer */}
      <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-soft-lg">
        <div className="flex items-end gap-2 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Supabase table name</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g., notes, topics, materials"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          />
        </div>
        <button
          onClick={() => fetchRows(table)}
          className="px-4 py-2 rounded-lg bg-accent text-white hover:opacity-90"
        >
          Load
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}

      {!loading && !error && rows.length === 0 && (
        <div className="text-gray-600">No rows. Enter a table name and click Load.</div>
      )}

      {!loading && rows.length > 0 && (
        <div className="overflow-auto border rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(rows[0] || {}).map((key) => (
                  <th key={key} className="text-left px-3 py-2 border-b">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  {Object.keys(rows[0] || {}).map((key) => (
                    <td key={key} className="px-3 py-2 border-b align-top">
                      {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  )
}
