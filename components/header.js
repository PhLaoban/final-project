import { css } from '@emotion/react';
import Link from 'next/link';

export default function Header(props) {
  return (
    <header>
      {props.user && (
        <Link href="/users/private-profile">{props.user.username}</Link>
      )}
      {props.user ? (
        // using <a> instead of <Link> since we want to force a full refresh
        <a href="/logout">Logout</a>
      ) : (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </header>
  );
}
