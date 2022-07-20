import { css } from '@emotion/react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
// import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getFavorites, getUserByValidSessionToken } from '../../util/database';

const mapContainerStyle = {
  maxWidth: '100vw',
  minHeight: '50vh',
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

const mainWrapper = css`
  background-color: white;
  width: 100vw;
`;

const profilePage = css`
  font-family: Arvo;

  /* background-image: url('/backgroundprofile.jpg'); */
  height: 70vh;

  p {
    font-family: Montserrat;
  }
  .containerWrapper {
    width: 100vw;

    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 80px;
    .container {
      padding-top: 20px;

      flex-direction: row;
      width: 60vw;
      height: 50vh;
      background-color: rgba(137, 172, 173, 0.3);

      .helloWrapper {
        display: flex;
        width: 100%;
        justify-content: center;
      }
      .streetsWrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        .streets {
          width: 100%;
          display: grid;
          grid-template-columns: 50% 50%;
          justify-items: center;
        }
      }
    }
  }
`;
const buttonstyle = css`
  background-color: #ffc80a;
  border: none;
  border-radius: 10px;
  width: 70px;
  color: white;
  height: 20px;
`;
export default function UserDetail(props) {
  const [deleting, setDeleting] = useState(false);

  console.log('favorites', props.favorites);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries: ['places'],
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const center = {
    lat: 48.252338370762885,
    lng: 16.369886035554927,
  };

  const deleteButton = async function deleteButton(favorite) {
    const response = await fetch(`/api/${favorite.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // const router = useRouter();

    const deletedFavorite = await response.json();
    console.log('deletedFavorite', deletedFavorite);
    setDeleting(true);
    // router.reload();
  };

  useEffect(() => {
    // deleteButton(props.favorites).catch(() => {});
    setDeleting(true);
  }, [deleting]);

  const mappingMarkers =
    props.favorites &&
    props.favorites.map((item) => {
      return (
        <div style={{ zIndex: 1 }} key={item.id}>
          <MarkerF
            key={item.id}
            position={{
              lat: Number(item.latitude),
              lng: Number(item.longitude),
            }}
          />
        </div>
      );
    });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';
  if (props.favorites.length === 0) {
    return (
      <div>
        <Head>
          <title>{props.user.username}</title>
          <meta
            name="description"
            content="Unfortunately, we have had trouble locating the product you are looking for."
          />
        </Head>
        {/* <div>
          <FontAwesomeIcon icon={faAnglesLeft} />
          Go back
        </div> */}

        <div>
          <h1>Hello {props.user.username}</h1>
          <div>id: {props.user.id}</div>
          <div>
            username: <p>{props.user.username}</p>
          </div>
          <p>
            Your favorites are currently empty. If you want to add streets to
            your favorites folder
          </p>
          <Link href="/map">
            <button>Click here</button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="About the app" />
      </Head>

      <main css={mainWrapper}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
          options={options}
          onLoad={onMapLoad}
        >
          {mappingMarkers}
        </GoogleMap>
        {/* <FontAwesomeIcon icon={faAnglesLeft} /> */}
        <div css={profilePage}>
          <div className="containerWrapper">
            <div className="container">
              <div className="helloWrapper">
                <h1>
                  Hello {props.user.username} &nbsp;
                  <FontAwesomeIcon icon={faUser} />
                </h1>
              </div>
              <div className="helloWrapper">
                This is your Profile Page. You can see your favorites listed
                below:
              </div>
              <div className="streetsWrapper">
                <div className="streets">
                  {props.favorites.map((favorite) => {
                    return (
                      <div key={favorite.id}>
                        <ul>
                          <li>
                            <p>
                              {' '}
                              {favorite.streetname} {favorite.number}
                            </p>
                          </li>
                        </ul>
                        <button
                          css={buttonstyle}
                          onClick={() => {
                            deleteButton(favorite).catch(() => {});
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/users/private-profile`,
        permanent: false,
      },
    };
  }

  console.log('user', user);

  const favorites = await getFavorites(user.id);

  console.log('longitude', favorites);

  return {
    props: {
      user: user,
      favorites: favorites,
      googleAPI: googleAPI,
    },
  };
}

// return {
//   redirect: {
//     destination: `/login?returnTo=/users/private-profile`,
//     permanent: false,
//   },
// };