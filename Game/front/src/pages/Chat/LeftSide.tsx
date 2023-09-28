import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Spacer, useDisclosure } from '@chakra-ui/react'
import '../../css/chat/left.css'
import '../../css/chat/tab.css';
import TabsTest from './Tabs';
import React from 'react';
import Search from '../../components/Search';
import MessageUser from './MessageUser';
import ModalUi from '../../components/ModalUi';
const LeftSide = (props: any) => {
    return (
        <div className='container'>
          <div className='tabs'>
              {props.tabs.map((tab: any, i: any) =>
                  <button key={i} id={tab.id.toString()} disabled={props.currentTab === `${tab.id}`} onClick={(props.handleTabClick)}>{tab.tabTitle}</button>
              )}
          </div>
          <div className='content'>
              {props.tabs.map((tab: any, i: any) =>
                  <div key={i}>
                      {props.currentTab === `${tab.id}` && <div>{tab.content}</div>}
                  </div>
              )}
          </div>
        </div>
    )
}

export default LeftSide;