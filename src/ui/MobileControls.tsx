export function MobileControls() {
  return (
    <div className="mobile-controls">
      <div className="controls-container left-controls">
        <button className="left-turn" value="left">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 43" fill="none">
            <path d="m1 22 37-21v42l-37-21z" fill="#fff" />
          </svg>
        </button>
        <button className="right-turn" value="right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 43" fill="none">
            <path d="m38 22-37 21v-42l37 21z" fill="#fff" />
          </svg>
        </button>
      </div>
      <div className="controls-container right-controls" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className="controls-container">
          <button className="boost" value="boost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 66" fill="none">
              <path
                d="M1 42C1 52 11 65 21 65 21 65 21 65 21 65 16 65 10 58 10 52 10 48 14 42 14 42 14 42 16 48 18 46 20 44 16 39 18 34 19 31 24 28 24 28 24 28 23 31 23 33 23 36 24 37 26 39 30 43 33 46 33 51 32 57 28 63 23 65 33 63 41 51 42 43 42 35 35 25 35 25 35 25 34 35 31 34 27 33 33 21 28 13 25 8 18 2 18 2 18 2 19 7 19 11 18 15 16 17 13 21 6 27 1 32 1 42Z"
                fill="white"
              />
              <path
                d="M21 65C21 65 21 65 21 65 11 65 1 52 1 42 1 32 6 27 13 21 16 17 18 15 19 11 19 7 18 2 18 2 18 2 25 8 28 13 33 21 27 33 31 34 34 35 35 25 35 25 35 25 42 35 42 43 41 51 33 63 23 65M21 65C16 65 10 58 10 52 10 48 14 42 14 42 14 42 16 48 18 46 20 44 16 39 18 34 19 31 24 28 24 28 24 28 23 31 23 33 23 36 24 37 26 39 30 43 33 46 33 51 32 57 28 63 23 65M21 65C21 65 22 65 22 65 22 65 23 65 23 65M21 65C22 65 23 65 23 65"
                stroke="white"
              />
            </svg>
          </button>
        </div>
        <div className="controls-container">
          <button className="backward" value="backward">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 36" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 5C0 2 2 0 5 0H46C49 0 51 2 51 5V31C51 34 49 36 46 36H5C2 36 0 34 0 31V5ZM13 7C13 9 11 11 9 11 7 11 5 9 5 7 5 5 7 3 9 3 11 3 13 5 13 7ZM9 22C11 22 13 20 13 18 13 16 11 14 9 14 7 14 5 16 5 18 5 20 7 22 9 22ZM13 29C13 31 11 33 9 33 7 33 5 31 5 29 5 27 7 25 9 25 11 25 13 27 13 29ZM20 22C22 22 24 20 24 18 24 16 22 14 20 14 18 14 16 16 16 18 16 20 18 22 20 22ZM24 7C24 9 22 11 20 11 18 11 16 9 16 7 16 5 18 3 20 3 22 3 24 5 24 7ZM31 11C33 11 35 9 35 7 35 5 33 3 31 3 29 3 27 5 27 7 27 9 29 11 31 11ZM35 18C35 20 33 22 31 22 29 22 27 20 27 18 27 16 29 14 31 14 33 14 35 16 35 18ZM42 11C44 11 46 9 46 7 46 5 44 3 42 3 40 3 38 5 38 7 38 9 40 11 42 11ZM46 18C46 20 44 22 42 22 40 22 38 20 38 18 38 16 40 14 42 14 44 14 46 16 46 18ZM42 33C44 33 46 31 46 29 46 27 44 25 42 25 40 25 38 27 38 29 38 31 40 33 42 33Z"
                fill="white"
              />
            </svg>
          </button>
          <button className="forward" value="forward">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 72" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 5C0 2 2 0 5 0H27C30 0 32 2 32 5V67C32 70 30 72 27 72H5C2 72 0 70 0 67V5ZM12 10C12 12 10 14 8 14 6 14 4 12 4 10 4 8 6 6 8 6 10 6 12 8 12 10ZM24 14C26 14 28 12 28 10 28 8 26 6 24 6 22 6 20 8 20 10 20 12 22 14 24 14ZM20 20C20 22 18 24 16 24 14 24 12 22 12 20 12 18 14 16 16 16 18 16 20 18 20 20ZM16 36C18 36 20 34 20 32 20 30 18 28 16 28 14 28 12 30 12 32 12 34 14 36 16 36ZM20 44C20 46 18 48 16 48 14 48 12 46 12 44 12 42 14 40 16 40 18 40 20 42 20 44ZM8 58C10 58 12 56 12 54 12 52 10 50 8 50 6 50 4 52 4 54 4 56 6 58 8 58ZM20 64C20 66 18 68 16 68 14 68 12 66 12 64 12 62 14 60 16 60 18 60 20 62 20 64ZM24 58C26 58 28 56 28 54 28 52 26 50 24 50 22 50 20 52 20 54 20 56 22 58 24 58Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
