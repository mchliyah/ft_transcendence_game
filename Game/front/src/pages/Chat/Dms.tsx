import { color } from "framer-motion";
import NavbarSearch from "../../components/NavbarSearch";
import Sidebar from "../../components/Sidebar";
import LeftSide from "./LeftSide";
import { Box, Flex, Grid, GridItem, IconButton, Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Spacer, background, useDisclosure } from '@chakra-ui/react'
import RightSide from "./RightSide";
import React from "react";
import Search from "../../components/Search";
import MessageUser from "./MessageUser";
import ModalUi from "../../components/ModalUi";
import { BsController, BsPersonCircle, BsPersonFillSlash, BsThreeDots, BsTrash } from "react-icons/bs";
import MessageContent from "./MessageContent";
import TypingBar from "./TypingBar";
import DmsChat from "./DmsChat";
import RoomsChat from "./RoomsChat";


const Dms = () => {
    const [currentTab, setCurrentTab] = React.useState('1');
    const [firstLoad, setFirstLoad] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renderActions, setRenderActions] = React.useState(false);
  const [name, setName] = React.useState("");
  const handleRenderActions = () => {
        setRenderActions(!renderActions);
  }
  const tabs = [
      {
          id: 1,
          tabTitle: 'Direct Messages',
          content: <>
          <Search name="tabDesign" setName={setName} filter={name}/>
          <MessageUser profile='/assets/het-tale.jpg' name="Hasnaa" message="hello" />
          </>,
          rightSide: <><DmsChat /></>
      },
      {
          id: 2,
          tabTitle: 'Channels',
          content: <>
          <Flex justify={'space-between'}>
          <Search name="tabDesign"/>
          
            <button className='newChannel' onClick={onOpen}>New</button>
            <ModalUi isOpen={isOpen} onOpen={onOpen} onClose={onClose} title={'Add new Channel'} body={undefined}/>
          </Flex>
          </>,
          rightSide: <><RoomsChat handleRenderActions={handleRenderActions}/></>
      }
  ];

  const handleTabClick = (e :any) => {
      setCurrentTab(e.target.id);
      setFirstLoad(e.target.tabTitle);
  }
    return (
        <div>
            <NavbarSearch />
            <Flex>
                <Sidebar />
                <Box w="100%" bg="#E9ECEF">
                    <Flex justify="space-between">
                        <LeftSide handleTabClick={handleTabClick} tabs={tabs} currentTab={currentTab}/>
                        <div className="delimiter"></div>
                        <RightSide handleTabClick={handleTabClick} tabs={tabs} currentTab={currentTab} firstLoad={firstLoad} renderActions={renderActions}/>
                    </Flex>
                </Box>
            </Flex>
        </div>
    )
}

export default Dms;