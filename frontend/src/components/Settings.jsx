import React, { useEffect, useState } from 'react'
import Layout from './layout/Layout'
import Card from './ui/Card'
import Button from './ui/Button'
import { usersAPI, authAPI } from '../services/api'

export default function Settings({ role }) {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pwd, setPwd] = useState({ oldPassword: '', newPassword: '', confirm: '' })

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user) setProfile({ name: user.name || '', email: user.email || '' })
    } catch (_) {}
  }, [])

  const save = async () => {
    try {
      setLoading(true)
      setMessage('')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const res = await usersAPI.update(user.userId, { name: profile.name, email: profile.email })
      localStorage.setItem('user', JSON.stringify(res.data))
      setMessage('Profile updated')
    } catch (e) {
      setMessage('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    try {
      if (!pwd.newPassword || pwd.newPassword.length < 6) { setMessage('Password must be at least 6 characters'); return }
      if (pwd.newPassword !== pwd.confirm) { setMessage('Passwords do not match'); return }
      setLoading(true)
      setMessage('')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await authAPI.changePassword(user.userId, { oldPassword: pwd.oldPassword, newPassword: pwd.newPassword })
      setMessage('Password changed successfully')
      setPwd({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Settings">
      <Card>
        <Card.Header title="Profile" />
        <Card.Content>
          {message && <div className="mb-3 text-sm text-green-700">{message}</div>}
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="form-label">Name</label>
              <input className="form-input" value={profile.name} onChange={(e)=>setProfile(p=>({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" value={profile.email} onChange={(e)=>setProfile(p=>({ ...p, email: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button onClick={save} loading={loading}>Save</Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header title="Change Password" />
        <Card.Content>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={pwd.oldPassword} onChange={(e)=>setPwd(p=>({ ...p, oldPassword: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={pwd.newPassword} onChange={(e)=>setPwd(p=>({ ...p, newPassword: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={pwd.confirm} onChange={(e)=>setPwd(p=>({ ...p, confirm: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button onClick={changePassword} loading={loading}>Update Password</Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </Layout>
  )
}

