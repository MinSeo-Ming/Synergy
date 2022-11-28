import { useEffect, useState } from 'react';
import AlertPage from './AlertPage'
import Timeout from './Timeout'
import './Gamestart.css'

function Main() {
  let [open,Setopen] = useState(true)
  useEffect(()=>{
    setTimeout(() => {console.log("세 번째 메시지")
    Setopen(false)
  
  }, 3000);

  },[open])


  return (
    
      <div className="zoom-in-out-box">
      {open === true
          ? <Timeout />
          : <AlertPage text={"게임 시작"} />
      }
      </div>
    
  );
}

export default Main;
