import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default async function Login() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            📚 Smart Bookmarks
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Save and organize your favorite links
          </p>
        </div>

        <div className="space-y-4">
          <GoogleSignInButton />
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Sign in with Google to get started</p>
          <p className="mt-2">Your bookmarks are private and secure</p>
        </div>
      </div>
    </div>
  )
}
