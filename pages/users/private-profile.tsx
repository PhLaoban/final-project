import { Loader } from '@googlemaps/js-api-loader';
import {
  GoogleMap,
  Marker,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useRef } from 'react';
import {
  Favorites,
  getFavorites,
  getUserByValidSessionToken,
  User,
} from '../../util/database';

const mapContainerStyle = {
  maxWidth: '40vw',
  minHeight: '40vh',
};

type Props = {
  user: User;
  favorites: Favorites;
  googleAPI: string;
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

export default function UserDetail(props: Props) {
  console.log('favorites', props.favorites);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries: ['places'],
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const center = {
    lat: 48.252338370762885,
    lng: 16.369886035554927,
  };
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

        <h1>Hello {props.user.username}</h1>
        <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div>
        <p>
          Your favorites are currently empty. If you want to add streets to your
          favorites folder
        </p>
        <Link href="/map">
          <button>Click here</button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <h1>Hello {props.user.username}</h1>
        <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div>
        <div>
          Your favorites:
          {props.favorites.map((favorite) => {
            return (
              <div key={favorite.id}>
                {favorite.streetname} | {favorite.number}
                <button
                  onClick={async () => {
                    await fetch(`/api/${favorite.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                  }}
                >
                  Delete from favorites
                </button>
              </div>
            );
          })}
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
          options={options}
          onLoad={onMapLoad}
        >
          <Marker
            position={{
              lat: 48.252338370762885,
              lng: 16.369886035554927,
            }}
          />
        </GoogleMap>
        <br />
        <br />
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!user) {
    return 'error';
  }

  console.log('user', user);

  const favorites = await getFavorites(user.id);

  console.log('favorites', favorites);

  if (user) {
    return {
      props: {
        user: user,
        favorites: favorites,
        googleAPI: googleAPI,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTo=/users/private-profile`,
      permanent: false,
    },
  };
}
