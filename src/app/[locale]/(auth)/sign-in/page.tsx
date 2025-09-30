import { signInWithCredentials } from '@/app/[locale]/(auth)/_actions'
import { SignInForm } from '@/app/[locale]/(auth)/_components'

export default function SignInPage() {
  return <SignInForm signIn={signInWithCredentials} />
}
