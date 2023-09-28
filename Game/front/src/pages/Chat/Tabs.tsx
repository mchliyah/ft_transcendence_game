import * as React from 'react';
import '../../css/chat/tab.css';
import Search from '../../components/Search';
import Main from '../../components/Main';
import MessageUser from './MessageUser';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ModalUi from '../../components/ModalUi';

const TabsTest = () => {

  const [currentTab, setCurrentTab] = React.useState('1');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tabs = [
      {
          id: 1,
          tabTitle: 'Direct Messages',
          content: <>
          <Search name="tabDesign"/>
          <MessageUser profile='/assets/het-tale.jpg' name="Hasnaa" message="hello" />
          </>
      },
      {
          id: 2,
          tabTitle: 'Channels',
          content: <>
          <Flex justify={'space-between'}>
          {/* <Search name="channelDesign"/>   */}
          <Search name="tabDesign"/>
          
            <button className='newChannel' onClick={onOpen}>New</button>
            <ModalUi isOpen={isOpen} onOpen={onOpen} onClose={onClose} title={'Add new Channel'} body={undefined}/>
          </Flex>
          </>
      }
  ];

  const handleTabClick = (e :any) => {
      setCurrentTab(e.target.id);
  }

  return (
      <div className='container'>
          <div className='tabs'>
              {tabs.map((tab, i) =>
                  <button key={i} id={tab.id.toString()} disabled={currentTab === `${tab.id}`} onClick={(handleTabClick)}>{tab.tabTitle}</button>
              )}
          </div>
          <div className='content'>
              {tabs.map((tab, i) =>
                  <div key={i}>
                      {currentTab === `${tab.id}` && <div>{tab.content}</div>}
                  </div>
              )}
          </div>
      </div>
  );
}

export default TabsTest;