import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Text, Image, Center, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { BsThreeDotsVertical, BsPencilFill, BsVolumeMuteFill, BsPersonDashFill, BsPersonXFill, BsGearFill, BsBoxArrowRight } from "react-icons/bs";
import "../../css/chat/channelSetting.css"
import MessageUser from "./MessageUser";

const ChannelInfo = () => (
    <div>
        <Card maxW='md' marginBottom={2}>
            <CardHeader>
                <Heading textAlign={"center"}>Channel Info</Heading>
                </CardHeader>
                <CardBody>
            <Center>
                
            <Image
                objectFit='cover'
                src='/assets/het-tale.jpg'
                alt='profile'
                borderRadius={"50%"}
                w={200}
                alignItems={"center"}
                />
            </Center>
            <Flex justifyContent={"space-between"} marginTop={2}>
            <Text
            textAlign={"center"}
            fontSize={16}
            fontFamily={"Krona One"}
            marginTop={2}
            >Channel Name</Text>
            <IconButton
            variant='ghost'
            colorScheme='gray'
            aria-label=""
            icon={<BsPencilFill />}
            />
            </Flex>

            </CardBody>
            <CardFooter
                justify='space-between'
                flexWrap='wrap'
                sx={{
                    '& > button': {
                        minW: '136px',
                    },
                }}
            >
            </CardFooter>
        </Card>

        <Card maxW='md'>
            <CardHeader>
              <Text>4 Participants</Text>
            </CardHeader>
                <CardBody>
                    <Flex>
                        <Box w={"98%"}>

                <MessageUser profile='/assets/het-tale.jpg' name="Hasnaa" message="" design="participants" />
                        </Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDotsVertical color='#a435f0' size={40} transform='rotate(90)' />}
                        variant='outline'
                        border={"none"}
                        marginTop={-1}
                    />
                    <MenuList 
                    marginRight={0}
                    bg={"#c56af0"}
                    color={'white'}
                    w={300}
                    p={6}
                    fontFamily={"krona one"}
                    borderRadius={20}
                    marginTop={-25}
                    >
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsGearFill />}>
                        Set Admin
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsVolumeMuteFill />}>
                        Mute
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonXFill />}>
                        Kick
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonDashFill />}>
                        Ban
                        </MenuItem>
                    </MenuList>
                    </Menu>
                    </Flex>
                    <Flex>
                        <Box w={"98%"}>

                        <MessageUser profile='/assets/slahrach.jpg' name="Hricha" message="" design="participants"/>
                        </Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDotsVertical color='#a435f0' size={40} transform='rotate(90)' />}
                        variant='outline'
                        border={"none"}
                        marginTop={-1}
                    />
                    <MenuList 
                    marginRight={0}
                    bg={"#c56af0"}
                    color={'white'}
                    w={300}
                    p={6}
                    fontFamily={"krona one"}
                    borderRadius={20}
                    marginTop={-25}
                    >
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsGearFill />}>
                        Set Admin
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsVolumeMuteFill />}>
                        Mute
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonXFill />}>
                        Kick
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonDashFill />}>
                        Ban
                        </MenuItem>
                    </MenuList>
                    </Menu>
                    </Flex>
                    <Flex>
                        <Box w={"98%"}>

                <MessageUser profile='/assets/het-tale.jpg' name="Hasnaa" message="" design="participants" />
                        </Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDotsVertical color='#a435f0' size={40} transform='rotate(90)' />}
                        variant='outline'
                        border={"none"}
                        marginTop={-1}
                    />
                    <MenuList 
                    marginRight={0}
                    bg={"#c56af0"}
                    color={'white'}
                    w={300}
                    p={6}
                    fontFamily={"krona one"}
                    borderRadius={20}
                    marginTop={-25}
                    >
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsGearFill />}>
                        Set Admin
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsVolumeMuteFill />}>
                        Mute
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonXFill />}>
                        Kick
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonDashFill />}>
                        Ban
                        </MenuItem>
                    </MenuList>
                    </Menu>
                    </Flex>
                    <Flex>
                        <Box w={"98%"}>

                        <MessageUser profile='/assets/slahrach.jpg' name="Hricha" message="" design="participants"/>
                        </Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDotsVertical color='#a435f0' size={40} transform='rotate(90)' />}
                        variant='outline'
                        border={"none"}
                        marginTop={-1}
                    />
                    <MenuList 
                    marginRight={0}
                    bg={"#c56af0"}
                    color={'white'}
                    w={300}
                    p={6}
                    fontFamily={"krona one"}
                    borderRadius={20}
                    marginTop={-25}
                    >
                        <MenuItem paddingBottom={2} bg={'none'} icon={<BsGearFill />}>
                        Set Admin
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsVolumeMuteFill />}>
                        Mute
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonXFill />}>
                        Kick
                        </MenuItem>
                        <MenuItem bg={'none'} icon={<BsPersonDashFill />}>
                        Ban
                        </MenuItem>
                    </MenuList>
                    </Menu>
                    </Flex>
                
            </CardBody>

        </Card>

        <Card maxW='md'>
            <CardHeader>
                <Flex gap='4' color={"red"}>

                    <IconButton
                        variant='ghost'
                        colorScheme='red'
                        aria-label='See menu'
                        size='lg'
                        icon={<BsBoxArrowRight />} />
                    <Text fontSize={18} marginTop={3}>Leave Channel</Text>
                </Flex>
                </CardHeader>
                
        </Card>
    </div>)

export default ChannelInfo;