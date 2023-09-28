import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Spacer, Box, Center, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react'
import '../../css/chat/left.css'
import MessageUser from './MessageUser';
import { BsThreeDots, BsPersonCircle, BsPersonFillSlash, BsTrash, BsController } from "react-icons/bs";
import MessageContent from './MessageContent';
import TypingBar from './TypingBar';
import { Image } from '@chakra-ui/react';
import ChannelInfo from './ChannelInfo';
const RightSide = (props: any) => {
    return (
    <Flex w="100%" h="100%" bg="#E9ECEF" justify="space-between">
        <div className='container'>
            {
            props.tabs.map((tab: any, i: any) =>
            props.firstLoad !== '' ?
            <div key={i}>{props.currentTab === `${tab.id}` && <div>{tab.rightSide}</div>}</div>
            : <div key={i}>{props.currentTab === `${tab.id}` && <div>
                <Image src="/assets/ul_chat.png" alt="collaboration"
                className='hero_img'
                width={400}
                height={350}
                bg={'transparent'}
                marginTop={"20%"}
                marginLeft={"25%"}
                style={{background: 'transparent'}}
                />
                </div>}</div>
            )
            }
        </div>
        {
            props.currentTab === "2" && props.renderActions && <div className='container'><ChannelInfo /></div>
        }
        </Flex>
    )
}

export default RightSide;