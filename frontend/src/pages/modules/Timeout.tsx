import { useState, useEffect } from "react";
import './Gamestart.css'

const Timeout = () => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
      const countdown = setInterval(() => {
          console.log(seconds);
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdown);
        } else {
          setMinutes(minutes - 1);
          setSeconds(3);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (
    <div >
      {/* <h1>CountDown!</h1> */}
      <div className="dh3">
          {seconds}
          {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} */}
        
      </div>
    </div>
  );
}

export default Timeout;
