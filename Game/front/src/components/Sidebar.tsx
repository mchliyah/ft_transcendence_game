import React from 'react';
import { Link } from 'react-router-dom';
import { BsBoxArrowLeft, BsBellFill, BsHouseFill, BsController, BsChatRightFill, BsChatFill, BsPersonFill } from "react-icons/bs";
const Sidebar = () => {
    return (
        <aside>
        <a href="">
           <BsHouseFill className='fa'/>
          Home
        </a>
        <Link to="/chat/dms">
        {/* <a href=""> */}
          <BsChatRightFill className='fa'/>
          Chat
        {/* </a> */}
        </Link>
        <a href="">
          <BsBellFill className='fa'/>
          Notifications
        </a>
        <Link to={"/game"}>
          <BsController className='fa'/>
          Play
        </Link>
        <a href="">
            <BsPersonFill className='fa'/>
          Profile
        </a>
        <a href="" id="more">
          {/* <i className="fa fa-gear fa-lg" aria-hidden="true"></i> */}
          <BsBoxArrowLeft className='fa'/>
          Log Out
          
        </a>
      </aside>
    );
}
export default Sidebar;