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
import { RegisterResponseBody } from './api/register';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

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
  margin-top: 30px;
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
  background-color: #93b6b7;
  width: 100vw;
  height: 100vh;
  background-image: url('/background.jpg');
  background-size: cover;
  color: white;
  @media (max-width: 700px) {
    width: 480px;
    margin: auto;
    padding-left: 35px;
    background-image: url('/background.jpg');

    height: 900px;

    background-size: cover;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media (max-width: 700px) {
      width: 400px;
    }
    height: 80vh;
    .registerboxWrapper {
      display: flex;
      max-width: 100vw;
      min-height: 40vh;
      justify-content: center;
      @media (max-width: 700px) {
        margin: auto;
        margin-left: 10px;
        padding-top: 50px;
        display: flex;
        justify-content: center;
      }

      .registerbox {
        display: flex;
        flex-direction: column;
        width: 70vw;
        min-height: 50vh;
        background-color: rgba(137, 172, 173, 0.3);
        color: #fbf7f7;
        border-radius: 10px;

        align-items: center;
        font-weight: lighter;
        justify-content: center;
        padding: 20px;

        @media (max-width: 700px) {
          width: 400px;
          height: 80vh;
          padding-top: 50px;
          margin: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        p {
          text-shadow: 0.5px 0.5px 0.5px #ffba0a;
          font-family: Open Sans;
          font-size: 21px;
          font-weight: 600;
        }
      }
      #wheelchair {
        text-shadow: 1px 0.5px #ffba0a;
        color: #ffba0a;
      }
      h1 {
        font-family: Arvo;
        font-style: inherit;
        font-size: 35pt;

        @media (max-width: 700px) {
          font-size: 25pt;
          padding: 7px;
        }
      }
    }

    .registrationForm {
      display: flex;
      gap: 2.2rem;
      @media (max-width: 700px) {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .usernamePasswordDiv {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-size: 1.3rem;
        font-weight: 600;
        font-family: Montserrat;
      }

      #inputfields {
        /* border-radius: 10px; */
        height: 5vh;
        color: white;
        background-color: rgba(70, 90, 96, 0.5);
        border: none;
        font-size: 1.2rem;
        max-width: 13vw;
        padding-left: 20px;
        @media (max-width: 700px) {
          max-width: 50vw;
        }
      }
    }
    .buttonWrapper {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      height: 10vh;

      .button {
        border-radius: 50%;
        width: 2.7vw;
        height: 6vh;
        border: none;
        background-color: #ffc80a;
        align-items: center;
        display: flex;
        p {
          color: transparent;
        }

        @media (max-width: 700px) {
          display: flex;
          background-color: transparent;
          margin-left: 60px;
          margin-bottom: 60px;
          text-shadow: white;
          p {
            padding-left: 20px;
            color: white;
            font-size: 15px;
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

          @media (max-width: 670px) {
            margin-top: 80px;
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
    padding-left: 0;
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
      width: 210px;
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
      /* padding-right: 45px; */
      /* width: 300px; */
      margin-bottom: 18px;
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

  #notRegistered {
    font-size: 22px;
    font-weight: bolder;
    @media (max-width: 700px) {
      font-size: 20px;
      margin-bottom: 65px;
      gap: 1rem;
    }
  }

  #createAccount {
    color: #ffe70a;
    font-size: 22px;
    cursor: pointer;
    @media (max-width: 700px) {
      margin-bottom: 65px;
    }
  }

  #arrowright {
    color: #ffe70a;
    cursor: pointer;
    padding-top: 6px;
    @media (max-width: 700px) {
      margin-bottom: 45px;
    }
  }
`;

export default function Register(props: Props) {
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
      return;
    }
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
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
          <h1 id="park">Easy Park</h1> <h1 id="ing">ing</h1>
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
                Hello! Please Register first! &nbsp; &nbsp;
                <FontAwesomeIcon id="wheelchair" icon={faWheelchair} />{' '}
              </h1>
              <p>
                Register with your username and Password to use all of the
                features
              </p>
              <div className="registrationForm">
                <div className="usernamePasswordDiv">
                  Username:
                  <input
                    data-test-id="username"
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
                    data-test-id="password"
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
                    data-test-id="button-register"
                    className="button"
                    onClick={() => registerHandler()}
                  >
                    <FontAwesomeIcon id="paperplane" icon={faPaperPlane} />
                  </button>
                </div>
              </div>
              <div css={registerFirst}>
                <p id="notRegistered">Already registered? </p>
                <Link href="/login">
                  <p id="createAccount"> Login</p>
                </Link>
                <FontAwesomeIcon id="arrowright" icon={faArrowRightToBracket} />{' '}
              </div>
            </div>
          </div>
          {errors.map((error) => (
            <div css={errorStyles} key={`error-${error.message}`}>
              {error.message}
            </div>
          ))}
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
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
