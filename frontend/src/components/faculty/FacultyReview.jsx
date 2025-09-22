import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../layout/Layout'
import Card from '../ui/Card'
import { feedbackAPI, facultyAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function FacultyReview() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const res = await feedbackAPI.getMineForFaculty()
      const mine = Array.isArray(res.data) ? res.data : []
      setList(mine.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(); const id = setInterval(load, 15000); return () => clearInterval(id) }, [])

  return (
    <Layout title="Feedback Review">
      <Card>
        <Card.Header title="All Feedback" subtitle="Auto-refreshes every 15s" />
        <Card.Content>
          {loading && !list.length ? (
            <div className="text-center py-6 text-gray-500">Loading…</div>
          ) : list.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No feedback yet.</div>
          ) : (
            <div className="space-y-3">
              {list.map((f) => (
                <div key={f.feedbackId || `${f.subjectId}-${f.createdAt}`} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{f.subjectName || f.subject?.subjectName || 'Unknown Subject'}</div>
                    <div className="text-sm text-gray-500">{new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">Rating: {f.rating}/5</div>
                  {f.comments && <div className="text-sm text-gray-600 mt-1">{f.comments}</div>}
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </Layout>
  )
}

