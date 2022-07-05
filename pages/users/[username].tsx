import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByUsername, User } from '../../util/database';

type Props = {
  user?: User;
};

export default function UserDetail(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
        There is no user with this username.
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="User profile" />
      </Head>

      <main>
        <h1>
          User #{props.user.id} (username: {props.user.username})
        </h1>
        <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // if you want to use username in the URL name this variable properly
  const usernameFromUrl = context.query.username;

  // make sure the query param is an string
  if (!usernameFromUrl || Array.isArray(usernameFromUrl)) {
    return { props: {} };
  }

  // if you want to use username in the URL call function getUserByUsername and don't use parse int
  const user = await getUserByUsername(usernameFromUrl);

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  return {
    props: {
      user: user,
    },
  };
}
