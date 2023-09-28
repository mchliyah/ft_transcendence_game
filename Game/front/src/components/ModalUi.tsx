import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
    Flex,
    Avatar,
    Icon,
  } from '@chakra-ui/react'
import React from 'react';
import { Form } from 'react-bootstrap';
import "../css/chat/modal.css";
import { BsPerson, BsPersonFill } from 'react-icons/bs';

interface ModalUiProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  body: React.ReactNode;
}

function ModalUi({isOpen, onOpen, onClose, title, children, body}: ModalUiProps) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const formRef = React.useRef(null);
    const [selectedOption, setSelectedOption] = React.useState('');
    const [showField, setShowField] = React.useState(false);
    const handleRadioChange = (event : any) => {
      setSelectedOption(event.target.value);
      setShowField(event.target.value === 'protected');
      console.log(event.target.value);
    };

    const handleSubmit = () => {
      const data = new FormData(formRef.current ?? undefined);
      const formData = {
        name: data.get('name'),
        avatar: data.get('avatar'),
        type: data.get('group1'),
        password: data.get('password'),
      };
      console.log(formData);
    };
  
    return (
      <>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>{title}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
<Form ref={formRef}>
    <Form.Group className="mb-3 fileField">
        <Form.Label style={{'color': '#a435f0'}}>Channel Avatar</Form.Label>
        <Form.Control type="file" name='avatar'/>
      </Form.Group>
    <Form.Group className="mb-3">
        <Form.Label style={{'color': '#a435f0'}}>Channel Name</Form.Label>
        <Form.Control type="text" placeholder="Type the name here..." name='name' />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{'color': '#a435f0'}}>Channel Type</Form.Label>
        <div key={`inline-radio`} className="mb-3">
        <Form.Check
        className='radioInput'
          inline
            type='radio'
            id='public'
            label='Public'
            value='public'
            name='group1'
            checked={selectedOption === 'public'}
            onChange={handleRadioChange}
          />
          <Form.Check
          className='radioInput'
          inline
            type='radio'
            id='private'
            label='Private'
            value='private'
            name='group1'
            checked={selectedOption === 'private'}
            onChange={handleRadioChange}
          />
           <Form.Check
           className='radioInput'
          inline
            type='radio'
            id='protected'
            label='Protected'
            value='protected'
            name='group1'
            checked={selectedOption === 'protected'}
            onChange={handleRadioChange}
          />
          </div>
      </Form.Group>
      {showField && (
        <Form.Group className="mb-3">
        <Form.Label style={{'color': '#a435f0'}}>Password</Form.Label>
        <Form.Control type="password" placeholder="Type password" name='password'/>
      </Form.Group>
      )}
</Form>
    </ModalBody>

    <ModalFooter>
      <Button bg={"#E9ECEF"} color={"white"} mr={3} onClick={onClose}>
        Close
      </Button>
      <Button variant='ghost' bg={"#a435f0"} color={"white"} onClick={handleSubmit}>Create</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
      </>
    )
  }

export default ModalUi;