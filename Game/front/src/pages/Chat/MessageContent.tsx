import React from "react";
import "../../css/chat/Right.css"
import { Image } from "@chakra-ui/react";

interface MessageContentProps {
    name: string;
    message: string;
    room: boolean;
  }

const MessageContent = ({name, message, room} : MessageContentProps) => {
    let parent = (name === "sender") ? "parentSender" : "parentReceiver";
    let recvRoom = (name === "receiver" && room) ? "recvRoom" : "";

    return (
        <div className={`${parent}`} key={message}>
            <div className={`${name} ${recvRoom}`}>{message}</div>
            <div>

            {room && <Image 
            objectFit='cover'
            width={"30px"}
            height={"30px"}
            marginTop={"18px"}
            marginLeft={2}
            src="/assets/het-tale.jpg"
            alt="profile"
            borderRadius={"30px"}/>
            }
            </div>
        </div>
    );
}

export default MessageContent;