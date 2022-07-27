import { css } from '@emotion/react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ipadpro1 from '../public/ipadpro1.png';
import pen from '../public/pen.png';
import radiobox1 from '../public/radiobox1.png';

const mainDiv = css`
  background-color: #8a71b8;
  color: white;
  width: 100vw;
  padding: 0 10em;
  margin-bottom: 0;

  h1 {
    font-family: Montserrat;
  }

  @media screen and (max-width: 700px) {
    width: 800px;
    background-color: #8a71b8;
  }
  .landingPage {
    padding: 1rem;
    width: min(100%, 100vw);
    display: flex;
    flex-direction: row;
    justify-content: center;

    @media screen and (max-width: 700px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: auto;
      background-color: #8a71b8;
    }

    .headlineWrapper {
      display: flex;
      flex-direction: column;
      padding-right: 10rem;
      h1 {
        font-size: 50px;
        font-family: Montserrat;
        @media screen and (max-width: 700px) {
          font-size: 50px;
          background-color: #8a71b8;
        }
      }
    }
    .imageDiv {
      display: flex;
      justify-content: center;
    }

    .paragraphDiv {
      display: flex;
      max-width: 20vw;
      align-items: flex-end;
      letter-spacing: 1px;
      padding-bottom: 5rem;
      /* margin-left: 1rem; */
      @media screen and (max-width: 700px) {
        max-width: 60vw;
      }
      p {
        font-size: 23px;
        min-width: 25rem;
      }
    }
  }
`;

const buttonStyling = css`
  height: 50px;
  border-radius: 28px;
  border: none;
  max-width: 250px;
  background-color: #ffc80a;
  font-family: Montserrat;
  font-size: 15pt;
  font-weight: bold;
  color: white;

  &:hover,
  &:active {
    cursor: pointer;
    transition: 0.4 ease-in-out;
    color: #8a71b8;
    transform: translateX(2px) translateY(-2.5px);
  }
`;

const infoPage = css`
  width: 100vw;
  display: grid;
  padding: 10rem;
  gap: 10rem;
  background-color: white;
  grid-template-columns: 50% 50%;
  @media screen and (max-width: 700px) {
    display: grid;
    grid-template-columns: 100%;
    width: 800px;
    gap: 3rem;
  }
  .searchParkingSpace {
    padding-top: 5rem;

    @media screen and (max-width: 700px) {
      border-bottom: 1px solid #333;
      padding-bottom: 10px;
    }
  }

  p {
    color: #9fa3a7;
    @media screen and (max-width: 700px) {
      font-size: 25px;
    }
  }

  h1 {
    font-family: Arvo;
    font-weight: 100;
    font-size: 30px;
    @media screen and (max-width: 700px) {
      font-family: Montserrat;
      font-size: 35px;
    }
  }
  .numberOneTwo {
    border-radius: 50%;
    border: solid 1px;
    border-color: #ffc80a;
    max-width: 1.3rem;
    display: flex;
    justify-content: center;
    background-color: #ffc80a;
    color: white;
    align-items: center;
    font-family: Montserrat;

    @media screen and (max-width: 700px) {
      height: 2rem;
      max-width: 2rem;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  .descriptionHeadline {
    display: grid;

    grid-template-columns: 7% 93%;
    align-items: center;
    @media screen and (max-width: 700px) {
      display: grid;

      grid-template-columns: 12% 88%;
    }
  }
  .paragraph {
    font-family: Montserrat;
    font-weight: lighter;
  }
`;
const easyparking = css`
  display: flex;
  /* letter-spacing: 1px; */
  padding-left: 2rem;
  @media screen and (max-width: 750px) {
    margin-left: 2rem;
  }

  #park {
    font-size: 30px;
    color: black;
    font-weight: bold;
    padding-bottom: 5px;
    font-family: Montserrat;
  }
  #ing {
    font-family: Playfair Display;
    color: #ffc80a;
    font-size: 30px;
    font-style: italic;
    margin-top: 17px;
    @media screen and (max-width: 750px) {
      margin-top: 18px;
    }
  }
`;

const nextButton = css`
  background-color: white;
  border-radius: 50%;
  max-width: 2.4rem;
  min-height: 2rem;
  font-size: 20px;
  color: purple;
  border-color: #ffc80a;
  cursor: pointer;
  @media (max-width: 950px) {
    display: flex;
    width: 2rem;
    justify-content: center;
    align-items: center;
    border: none;
  }
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Easy Parking</title>
        <meta name="Easy Parking" content="Easy Parking Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={mainDiv}>
        <div className="landingPage">
          <div className="headlineWrapper">
            <h1>ACCESSIBLE </h1> <h1>PARKING SPACE </h1>{' '}
            <h1>FINDER IN VIENNA</h1>
            <Link href="/map">
              <button css={buttonStyling}>Start here &#8594;</button>
            </Link>
          </div>
          <div className="paragraphDiv">
            <p>
              If you are having a hard time finding a parking space for people
              with disabilities, this Website is the right place for you!
            </p>
          </div>
        </div>
        <div className="imageDiv">
          <Image src={radiobox1} />
        </div>
      </div>
      <div css={easyparking}>
        <h1 id="park">Easy &nbsp;Park</h1> <h1 id="ing">ing</h1>
      </div>
      <div css={infoPage}>
        <div>
          <Image src={ipadpro1} />
        </div>
        <div className="searchParkingSpace">
          <div className="descriptionHeadline">
            <div className="numberOneTwo">1</div>

            <p>SEARCH FOR A PARKING SPACE</p>
          </div>
          <h1>How does it work?</h1>
          <p className="paragraph">
            You can search by a district or filter by the streetname
          </p>
          <Link href="/map">
            <button css={nextButton}>
              {' '}
              <FontAwesomeIcon id="arrowRight" icon={faArrowRight} />
            </button>
          </Link>
        </div>
        <div>
          <div className="descriptionHeadline">
            <div className="numberOneTwo">2</div>

            <p>Write a comment, or add to favorites</p>
          </div>
          <h1>Tell us what you think of this parking space</h1>
          <p>
            {' '}
            If there was a parking space, you would like to leave a review for
            please comment below the parking spots. Or you can simply add some
            to your favorites and they will appear in your profile page.
          </p>
          <Link href="/map">
            <button css={nextButton}>
              {' '}
              <FontAwesomeIcon id="arrowRight" icon={faArrowRight} />
            </button>
          </Link>
        </div>
        <div>
          <Image src={pen} />
        </div>
      </div>
    </div>
  );
}
