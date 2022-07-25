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
    background-color: #8a71b8;
    width: 800px;
    height: 20vh;
    gap: 1.8rem;
    font-size: 20px;
  }

  .parking {
    display: flex;
    width: 68vw;
    background-color: #8a71b8;

    padding-left: 20px;
    /* @media (max-width: 950px) {
      width: width 60vw;
    } */

    #park {
      font-size: 30px;
      color: white;
      font-weight: bold;
      padding-bottom: 5px;
      letter-spacing: 1px;
      @media (max-width: 950px) {
        font-size: 30px;
      }
    }
    #ing {
      font-family: Playfair Display;
      color: #ffc80a;
      font-size: 30px;
      font-weight: bold;
      font-style: italic;
      margin-top: 27px;
      @media (max-width: 950px) {
        font-size: 30px;
        margin-top: 28px;
      }
    }
  }
  .headerdescription {
    padding: 1.5rem;
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
  padding-right: 7px;
  padding-left: 10px;
  color: white;
  gap: 2rem;

  align-items: center;
  font-family: Montserrat;
  @media (max-width: 700px) {
    display: flex;
    width: 700px;
    align-items: center;
    font-size: 12px;
  }

  .parking {
    display: flex;
    width: 70vw;

    #park {
      color: black;
      font-weight: bold;
      font-size: 28px;
      letter-spacing: 1px;
      @media (max-width: 950px) {
        font-size: 22px;
        align-self: center;
      }
    }
    #ing {
      font-family: Playfair Display;
      color: #ffc80a;
      font-size: 28px;
      font-weight: bold;
      text-justify: start;

      font-style: italic;

      margin-top: 25px;
      @media (max-width: 950px) {
        font-size: 22px;
        align-self: center;
        margin-bottom: 27px;
        font-weight: 1000;
      }
    }
  }
  .goBack {
    color: black;
    width: 16vw;
    @media (max-width: 950px) {
      width: 50vw;
      font-size: 12px;
    }
    &:hover {
      transition: 0.3s;
      color: #f29900;
    }
  }
  .headerdescription {
    padding: 2rem;
    color: black;
    @media (max-width: 700px) {
      width: 30vw;
    }
    &:hover {
      cursor: pointer;
      transition: 0.3s;
      color: #f29900;
    }
  }
`;

const headerstylingProfilePage = css`
  display: flex;
  flex-direction: row-reverse;
  font-size: 18px;
  font-weight: lighter;
  padding-right: 7px;
  padding-left: 10px;
  color: white;
  gap: 2rem;
  width: 100vw;
  align-items: center;
  font-family: Montserrat;
  @media (max-width: 700px) {
    display: flex;
    width: 600px;
    align-items: center;
    font-size: 12px;
  }

  .parking {
    display: flex;
    width: 70vw;

    #park {
      color: black;
      font-weight: bold;
      font-size: 28px;
      letter-spacing: 1px;
      @media (max-width: 950px) {
        font-size: 22px;
        align-self: center;
      }
    }
    #ing {
      font-family: Playfair Display;
      color: #ffc80a;
      font-size: 28px;
      font-weight: bold;
      text-justify: start;

      font-style: italic;

      margin-top: 25px;
      @media (max-width: 950px) {
        font-size: 22px;
        align-self: center;
        margin-bottom: 27px;
        font-weight: 1000;
      }
    }
  }
  .goBack {
    color: black;
    width: 16vw;
    @media (max-width: 950px) {
      width: 50vw;
      font-size: 12px;
    }
    &:hover {
      transition: 0.3s;
      color: #f29900;
    }
  }
  .headerdescriptionLogutRegister {
    padding: 2rem;
    color: black;
    @media (max-width: 700px) {
      width: 30vw;
    }
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
// using sever if / else if statements, since the header styling changes for almost every page

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
            <Link href="/map">Search for parking spots</Link>
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
          <div css={registerLoginHeader} style={{ color: 'black' }}>
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

        <div className="parking" style={{ paddingLeft: '50px' }}>
          <p id="park"> Easy Park</p> <p id="ing">ing </p>
        </div>
      </header>
    );
  } else if (path === '/users/private-profile') {
    return (
      <header css={headerstylingProfilePage}>
        {props.user && (
          <div className="goBack">
            <Link href="/">Go back to Homepage</Link>
          </div>
        )}
        {props.user ? (
          // using <a> instead of <Link> since we want to force a full refresh
          <div className="headerdescriptionLogutRegister">
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
