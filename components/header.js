import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const headerStylingPurple = css`
  background-color: #8a71b8;
  display: flex;
  flex-direction: row-reverse;
  font-size: 18px;
  font-weight: lighter;
  min-height: 15vh;
  color: white;

  align-items: center;
  font-family: Montserrat;
  @media (max-width: 700px) {
    display: flex;
    width: 800px;
    height: 20vh;
    font-size: 20px;
  }

  .parking {
    display: flex;
    width: 68vw;
    padding-left: 20px;

    #park {
      font-size: 30px;
      color: white;
      font-weight: bold;
      padding-bottom: 5px;
      letter-spacing: 1px;
    }
    #ing {
      font-family: Playfair Display;
      color: #ffc80a;
      font-size: 30px;
      font-weight: bold;
      font-style: italic;
      margin-top: 25px;
    }
  }
  .headerdescription {
    padding: 1.7rem;
    color: white;
    &:hover {
      color: #ffc80a;
    }
  }
`;

const registerLoginHeader = css`
  width: 36vw;
  display: flex;
  gap: 3rem;
  justify-content: flex-end;
  padding-right: 50px;
  @media (max-width: 700px) {
    width: 120vw;
    padding: 60px;
  }
  .registerLogin {
    &:hover {
      color: #ffc80a;
    }
  }
`;

const headerstylingMapPage = css`
  display: flex;
  flex-direction: row-reverse;
  font-size: 18px;
  font-weight: lighter;

  color: white;

  align-items: center;
  font-family: Montserrat;
  @media (max-width: 700px) {
    display: flex;
    width: 800px;

    font-size: 20px;
  }

  .parking {
    display: flex;
    width: 68vw;

    #park {
      font-size: 30px;
      color: black;
      font-weight: bold;

      letter-spacing: 1px;
    }
    #ing {
      font-family: Playfair Display;
      color: #ffc80a;
      font-size: 30px;
      font-weight: bold;
      font-style: italic;
      margin-top: 25px;
    }
  }
  .goBack {
    color: black;
    &:hover {
      transition: 0.3s;
      color: #f29900;
    }
  }
  .headerdescription {
    padding: 2rem;
    color: black;
    &:hover {
      cursor: pointer;
      transition: 0.3s;
      color: #f29900;
    }
  }
`;

function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  const router = useRouter();
  const path = router.pathname;
  console.log('path', path);
  if (path === '/') {
    return (
      <header css={headerStylingPurple}>
        {props.user && (
          <div className="headerdescription">
            <Link href="/users/private-profile">{props.user.username}</Link>
          </div>
        )}

        {props.user && (
          <div className="headerdescription">
            <Link href="/map">Search for parking lots</Link>
          </div>
        )}
        {props.user ? (
          // using <a> instead of <Link> since we want to force a full refresh
          <div className="headerdescription">
            <Anchor href="/logout">Logout</Anchor>
          </div>
        ) : (
          <div css={registerLoginHeader}>
            <div className="registerLogin">
              <Link href="/register">Register</Link>
            </div>
            <div className="registerLogin">
              <Link className="login" href="/login">
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="parking">
          <p id="park"> Easy Park</p> <p id="ing">ing </p>
        </div>
      </header>
    );
  } else if (path === '/register') {
    return;
  } else if (path === '/login') {
    return;
  } else if (path === '/map') {
    return (
      <header css={headerstylingMapPage}>
        {props.user && (
          <div className="headerdescription">
            <Link href="/users/private-profile">{props.user.username}</Link>
          </div>
        )}

        {props.user && (
          <div className="goBack">
            <Link href="/">Go back to Homepage</Link>
          </div>
        )}
        {props.user ? (
          // using <a> instead of <Link> since we want to force a full refresh
          <div className="headerdescription">
            <Anchor href="/logout">Logout</Anchor>{' '}
          </div>
        ) : (
          <div css={registerLoginHeader}>
            <div className="registerLogin">
              <Link href="/register">Register</Link>
            </div>
            <div className="registerLogin">
              <Link className="login" href="/login">
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="parking">
          <p id="park"> Easy Park</p> <p id="ing">ing </p>
        </div>
      </header>
    );
  } else if (path === '/users/private-profile') {
    return (
      <header css={headerstylingMapPage}>
        {props.user && (
          <div className="goBack">
            <Link href="/">Go back to Homepage</Link>
          </div>
        )}
        {props.user ? (
          // using <a> instead of <Link> since we want to force a full refresh
          <div className="headerdescription">
            <Anchor href="/logout">Logout</Anchor>
          </div>
        ) : (
          <div css={registerLoginHeader}>
            <div className="registerLogin">
              <Link href="/register">Register</Link>
            </div>
            <div className="registerLogin">
              <Link className="login" href="/login">
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="parking">
          <p id="park"> Easy Park</p> <p id="ing">ing </p>
        </div>
      </header>
    );
  } else {
    return (
      <header>
        {props.user && (
          <Link href="/users/private-profile">{props.user.username}</Link>
        )}
        {props.user && <Link href="/">Home</Link>}
        {props.user ? (
          // using <a> instead of <Link> since we want to force a full refresh
          <Anchor href="/logout">Logout</Anchor>
        ) : (
          <>
            <Link href="/register">Register</Link>

            <Link href="/login">Login</Link>
          </>
        )}
      </header>
    );
  }
}
