import { signInWithCredentials } from '@modules/auth/actions'
import { SignInForm } from '@modules/auth/components'

export default function SignInPage() {
  return <SignInForm signIn={signInWithCredentials} />
}
