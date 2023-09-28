import { BsController, BsPersonCircle, BsPersonFillSlash, BsThreeDots, BsTrash } from "react-icons/bs";
import MessageContent from "./MessageContent";
import TypingBar from "./TypingBar";
import { Box, Flex, Grid, GridItem, IconButton, Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Spacer, background, useDisclosure } from '@chakra-ui/react'
import MessageUser from "./MessageUser";

const DmsChat = () => {
    return (<div>
        <Flex>
                <Box width={"98%"}>

                <MessageUser profile='/assets/het-tale.jpg' name="Hasnaa" message="online" />
                </Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDots color='#a435f0' size={60} transform='rotate(90)' />}
                        variant='outline'
                        bg={"#F5F5F5"}
                        h={100}
                    />
                    <MenuList 
                    marginRight={0}
                    bg={"#c56af0"}
                    color={'white'}
                    w={250}
                    p={6}
                    fontFamily={"krona one"}
                    borderRadius={20}
                    marginTop={-25}
                    >
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsController />}>
                        Play with me
                        </MenuItem>
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsPersonCircle />}>
                        View Profile
                        </MenuItem>
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsTrash />}>
                        Delete Chat
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonFillSlash />}>
                        Block
                        </MenuItem>
                    </MenuList>
                    </Menu>
            </Flex>
            <MessageContent message='Hello' name='sender' room={false}/>
            <MessageContent message='Hello again' name='receiver' room={false}/>
            <MessageContent message='Hello again' name='receiver' room={false}/>
            <MessageContent message='Hello again' name='sender' room={false}/>
            <TypingBar />
    </div>);
}

export default DmsChat;