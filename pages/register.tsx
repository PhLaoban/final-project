import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();
  async function registerHandler() {
    const registerRespones = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const registerResponeBody: RegisterResponseBody =
      await registerRespones.json();
    console.log(registerResponeBody);
    if ('errors' in registerResponeBody) {
      setErrors(registerResponeBody.errors);
    }
    const returnTo = router.query.returnTo;
    console.log(returnTo);
    if (returnTo && !Array.isArray(returnTo)) {
      await router.push(returnTo);
    } else {
      await router.push(`/`);
    }
  }

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="registration" content="Register as a new user" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Register</h1>
        Username:
        <input
          value={username}
          onChange={(event) => {
            setUsername(event.currentTarget.value);
          }}
        />
        Password:
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
        />
        <button onClick={() => registerHandler()}>Register</button>
        {errors.map((error) => (
          <div key={`error-${error.message}`}>{error.message}</div>
        ))}
      </main>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
