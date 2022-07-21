import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { css, Global } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
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
            font-family: 'Arvo', serif;
            font-family: 'Open Sans', sans-serif;
            font-family: 'Playfair Display', serif;
            /* background-color: white; */
            color: black;
          }

          a {
            color: black, white;
            text-decoration: none;
          }
          p {
            font-family: 'Montserrat', sans-serif;
          }
          h1 {
            font-family: 'Montserrat', sans-serif;
          }
          h3 {
            font-family: 'Montserrat', sans-serif;
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
