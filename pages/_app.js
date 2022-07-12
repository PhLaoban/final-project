import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import Header from '../components/header';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();
  // Refresh the user profile everytime we call it
  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');

    const profileResponseBody = await profileResponse.json();

    if (!('errors' in profileResponseBody)) {
      setUser(profileResponseBody.user);
    } else {
      profileResponseBody.errors.forEach((error) => console.log(error.message));
      setUser(undefined);
    }
  }, []);
  useEffect(() => {
    refreshUserProfile().catch(() => console.log('Fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            /* background-color: white; */
            color: black;
          }

          a {
            color: black;
            text-decoration: none;
          }

          * {
            box-sizing: border-box;
          }
        `}
        const
        divStyle={css``}
      />
      <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout>
    </>
  );
}

export default MyApp;
