import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import LogoutButton from '@/components/LogoutButton'

export default async function Home() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                📚 Smart Bookmarks
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome, {user.email}
              </p>
            </div>
            <LogoutButton />
          </div>
          
          <AddBookmarkForm userId={user.id} />
        </div>

        <BookmarkList userId={user.id} />
      </div>
    </main>
  )
}
