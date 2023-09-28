import { Box, SimpleGrid, useDisclosure } from "@chakra-ui/react"
import ModalUi from "../components/ModalUi";

const Testt = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
    return (
    <div>
      <button className='newChannel' onClick={onOpen}>New</button>
            <ModalUi isOpen={isOpen} onOpen={onOpen} onClose={onClose} title={'Add new Channel'} body={undefined}/>
            {/* <ModalUi /> */}
    </div>
         // <div>
//             <SimpleGrid
//   bg='red.500'
//   columns={{ sm: 2, md: 4 }}
//   spacing='8'
//   p='10'
//   textAlign='center'
//   rounded='lg'
//   color='gray.400'
// >
//   <Box boxShadow='xs' p='6' rounded='md' bg='white'>
//     xs
//   </Box>
//   <Box boxShadow='sm' p='6' rounded='md' bg='white'>
//     sm
//   </Box>
//   <Box boxShadow='base' p='6' rounded='md' bg='white'>
//     Base
//   </Box>
//   <Box boxShadow='md' p='6' rounded='md' bg='white'>
//     md
//   </Box>
//   <Box boxShadow='lg' p='6' rounded='md' bg='white'>
//     lg
//   </Box>
//   <Box boxShadow='xl' p='6' rounded='md' bg='white'>
//     xl
//   </Box>
//   <Box boxShadow='2xl' p='6' rounded='md' bg='white'>
//     2xl
//   </Box>
//   <Box boxShadow='dark-lg' p='6' rounded='md' bg='white'>
//     Dark lg
//   </Box>
//   <Box boxShadow='outline' p='6' rounded='md' bg='white'>
//     Outline
//   </Box>
//   <Box boxShadow='inner' p='6' rounded='md' bg='white'>
//     Inner
//   </Box>
// </SimpleGrid>
        // </div>
    )
}

export default Testt