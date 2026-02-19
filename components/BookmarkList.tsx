'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import BookmarkItem from './BookmarkItem'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
}

interface BookmarkListProps {
  userId: string
}

export default function BookmarkList({ userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBookmarks()
    subscribeToBookmarks()
  }, [userId])

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToBookmarks = () => {
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12 text-center">
        <div className="text-6xl mb-4">🔖</div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          No bookmarks yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your first bookmark using the form above
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
