import { css } from '@emotion/react';
import {
  faArrowRightToBracket,
  faPaperPlane,
  faWheelchair,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

const errorStyles = css`
  background-color: #c24b4b;
  font-family: Montserrat;
  font-size: 16px;
  color: white;
  text-align: center;
  text-justify: center;
  text-justify: center;
  justify-items: center;
  height: 30px;
  width: 350px;
  gap: 2rem;
  animation: errorStyles 0.5s 1;
  animation-fill-mode: forwards;
  animation-delay: 2s;
  border-radius: 5px;
  @keyframes errorStyles {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const mainstyling = css`
  width: 100vw;
  height: 100vh;
  background-image: url('/loginbackground.jpg');
  background-size: cover;
  color: white;
  @media (max-width: 600px) {
    width: 480px;
    background-image: url('/loginbackground.jpg');
    background-size: cover;
    height: 900px;
    background-position: 20%;
  }
  /*
  @media (max-height: 670px) {
    height: 120vh;
  } */

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 80vh;
    .registerboxWrapper {
      display: flex;
      max-width: 100vw;
      min-height: 40vh;
      justify-content: center;

      .registerbox {
        display: flex;
        flex-direction: column;
        width: 70vw;
        min-height: 70vh;
        background-color: rgba(137, 172, 173, 0.3);
        color: #fbf7f7;
        border-radius: 10px;

        align-items: center;
        font-weight: lighter;
        justify-content: center;
        padding: 20px;

        @media (max-width: 600px) {
          width: 95vw;
          height: 87vh;
        }
        @media (max-height: 670px) {
          height: 97vh;
        }
      }
      #wheelchair {
        text-shadow: 1px 0.5px #ffba0a;
        color: #ffba0a;
      }
      h1 {
        font-family: Arvo;

        font-size: 35pt;
        @media (max-width: 600px) {
          font-size: 20pt;
          padding-top: 40px;
        }
      }

      p {
        font-family: Open Sans;
        font-size: 23px;
        font-weight: 600;
        font-style: inherit;
        @media (max-width: 600px) {
          font-size: 20pt;
        }
      }
    }

    .registrationForm {
      display: flex;
      gap: 2.2rem;
      font-family: Montserrat;

      @media (max-width: 600px) {
        display: flex;
        flex-direction: column;
      }

      .usernamePasswordDiv {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 1.3rem;
        font-weight: 600;
      }

      #inputfields {
        height: 5vh;
        color: white;
        background-color: rgba(70, 90, 96, 0.5);
        border: none;
        font-size: 1.2rem;
        max-width: 13vw;
        padding-left: 20px;
        @media (max-width: 600px) {
          max-width: 40vw;
        }
      }
    }
    .buttonWrapper {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      height: 10vh;
      @media (max-width: 700px) {
        height: 7vh;
        padding-top: 5px;
      }

      .button {
        border-radius: 50%;
        width: 2.7vw;
        height: 6vh;
        border: none;
        background-color: #ffc80a;
        align-items: center;
        justify-content: center;
        display: flex;
        padding-right: 12px;
        p {
          color: transparent;
        }

        @media (max-width: 700px) {
          display: flex;
          background-color: transparent;
          margin-left: 60px;
          margin-bottom: 60px;

          p {
            padding-left: 20px;
            color: white;
            font-weight: 600;
            font-size: 20px;
          }
        }

        &:hover {
          cursor: pointer;
          transition: 0.5s ease-in-out;
          background-color: #93b6b7;
        }
        &:active {
          transform: translateX(2px) translateY(-2.5px);
        }
        #paperplane {
          color: white;
          font-size: 22px;
          @media (max-width: 700px) {
            font-size: 30px;
            color: #ffba0a;
            padding-top: 50px;
          }
        }
      }
    }
  }
`;
const easyparking = css`
  display: flex;
  /* letter-spacing: 1px; */
  /* padding-left: 2rem; */
  width: 80vw;
  padding-left: 20px;
  height: 15vh;
  align-items: center;
  @media (max-width: 700px) {
    display: flex;
    width: 80vw;
  }
  .paragraph {
    width: 60vw;
    display: flex;
    justify-content: center;
    font-size: 25px;
    align-items: center;
    padding-left: 0px;

    p {
      &:hover {
        cursor: pointer;
        transition: 0.5s ease-in-out;
        color: #ffba0a;
      }
      &:active {
        transform: translateX(2px) translateY(-2.5px);
      }
    }
  }
  #park {
    font-size: 30px;
    color: white;
    font-weight: bold;

    font-family: Montserrat;

    @media (max-width: 700px) {
      font-size: 25px;
    }
  }
  #ing {
    font-family: Playfair Display;
    color: #ffc80a;
    font-size: 30px;
    font-style: italic;
    margin-top: 15px;
    @media (max-width: 700px) {
      font-size: 25px;
      padding-right: 45px;
    }
  }
`;

const registerFirst = css`
  display: flex;
  justify-content: center;
  padding-right: 80px;
  gap: 1rem;
  padding-top: 20px;
  align-items: center;
  padding-left: 70px;

  @media (max-width: 700px) {
    padding-top: 0;
    gap: 1rem;
    width: 30vw;
    padding-bottom: 15px;
  }
  #notRegistered {
    font-size: 22px;
    font-weight: bolder;
    @media (max-width: 700px) {
      font-size: 20px;
      width: 100px;
      margin-bottom: 65px;
    }
  }

  #createAccount {
    color: #ffe70a;
    font-size: 22px;
    cursor: pointer;
    &:hover,
    &:active {
      color: white;
      transform: translateX(2) translateY(2);
    }
    @media (max-width: 700px) {
      font-size: 19px;
      width: 100px;
      margin-bottom: 65px;
    }
  }

  #arrowright {
    color: #ffe70a;
    cursor: pointer;
    padding-top: 5px;
  }
`;

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
      return;
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
    <div>
      <Head>
        <title>Register</title>
        <meta name="registration" content="Register as a new user" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={mainstyling}>
        <div css={easyparking}>
          <h1 id="park">Easy&nbsp;Park</h1> <h1 id="ing">ing</h1>
          <div className="paragraph">
            <Link href="/">
              <p> Home</p>
            </Link>
          </div>
        </div>
        <div className="content">
          <div className="registerboxWrapper">
            <div className="registerbox">
              <h1>
                Hello! Please Login first! &nbsp; &nbsp;
                <FontAwesomeIcon id="wheelchair" icon={faWheelchair} />{' '}
              </h1>
              <p>
                Login with your Username and Password to use all of the features
              </p>
              <div className="registrationForm">
                <div className="usernamePasswordDiv">
                  Username:
                  <input
                    data-test-id="input-username"
                    id="inputfields"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.currentTarget.value);
                    }}
                  />
                </div>
                <div className="usernamePasswordDiv">
                  Password:{' '}
                  <input
                    data-test-id="input-password"
                    id="inputfields"
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                  />
                </div>
                <div className="buttonWrapper">
                  <button
                    className="button"
                    data-test-id="button-login"
                    onClick={() => loginHandler()}
                  >
                    <FontAwesomeIcon id="paperplane" icon={faPaperPlane} />
                  </button>
                </div>
              </div>
              <div css={registerFirst}>
                <p id="notRegistered">Not registered yet? </p>
                <Link href="/register">
                  <p id="createAccount"> Create an account</p>
                </Link>
                <FontAwesomeIcon id="arrowright" icon={faArrowRightToBracket} />{' '}
              </div>
              {errors.map((error) => (
                <div css={errorStyles} key={`error-${error.message}`}>
                  {error.message}
                </div>
              ))}
            </div>
          </div>
        </div>
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
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
