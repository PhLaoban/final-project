import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();
  async function loginHandler() {
    const loginRespones = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const loginResponeBody: LoginResponseBody = await loginRespones.json();
    if ('errors' in loginResponeBody) {
      setErrors(loginResponeBody.errors);
    }
    console.log(loginResponeBody);
    const returnTo = router.query.returnTo;
    console.log(returnTo);
    if (returnTo && !Array.isArray(returnTo)) {
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      await props.refreshUserProfile();
      await router.push(`/`);
    }
  }

  return (
    <main>
      <div>
        <Head>
          <title>Login</title>
          <meta name="login" content="Login a new user" />
        </Head>

        <main>
          <h1>Login</h1>

          <label>
            username:{' '}
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>

          <label>
            password:{' '}
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <button onClick={() => loginHandler()}>Login</button>
          {errors.map((error) => (
            <div key={`error-${error.message}`}>{error.message}</div>
          ))}
        </main>
      </div>
    </main>
  );
}

// export function getServerSideProps(context: GetServerSidePropsContext) {
//   // Redirect from HTTP to HTTPS on Heroku
//   if (
//     context.req.headers.host &&
//     context.req.headers['x-forwarded-proto'] &&
//     context.req.headers['x-forwarded-proto'] !== 'https'
//   ) {
//     return {
//       redirect: {
//         destination: `https://${context.req.headers.host}/login`,
//         permanent: true,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
