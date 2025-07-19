import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/utils/type-user';
import { changePassword } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';
import {toast } from 'sonner'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      await changePassword(form);
      toast.success('Password changed successfully.');
      setForm({ current_password: '', new_password: '', new_password_confirm: '' });
    } catch {
      toast.error('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  // Avatar fallback initials
  const getInitials = (user: User | null) => {
    if (!user) return '';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl h-full flex flex-col overflow-hidden">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage src="/avatar.jpg" alt="Profile image" />
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">User Profile</h1>
        {user && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-foreground text-base font-medium">{user.first_name} {user.last_name}</span>
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        )}
      </div>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                name="current_password"
                type="password"
                value={form.current_password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                value={form.new_password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new_password_confirm">Confirm New Password</Label>
              <Input
                id="new_password_confirm"
                name="new_password_confirm"
                type="password"
                value={form.new_password_confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
            <Button type="button" variant="destructive" className="w-full mt-2" onClick={logout}>
              Logout
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage; 