import { SearchUsersData, SearchUsersInput } from "@/src/util/types"
import { useLazyQuery } from "@apollo/client"
import { Text, Button, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal, Stack, Input, useQuery } from "@chakra-ui/react"
import { useState } from "react"
import UserOperations from '../../../../graphql/operations/user'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {

    const [username, setUsername] = useState('')
    const [searchUsers, { data, error, loading }] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers)


    console.log('HERE IS SEARCH DATA', data);
    

    const onSearch = async (event: React.FormEvent) => {
        event.preventDefault()

        searchUsers({variables: {username}})

        console.log('INSIDE ONSUBMIT', username);

    }

    return (
        <>


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg='#2d2d2d' pb={4}>
                    <ModalHeader>Create a Conversation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={onSearch}>
                            <Stack spacing={4}>
                                <Input placeholder="Enter a username" value={username} onChange={(event) => setUsername(event.target.value)} />
                                <Button type="submit" disabled={!username} isLoading={loading}>
                                    Search
                                </Button>
                            </Stack>
                        </form>
                    </ModalBody>


                </ModalContent>
            </Modal>
        </>
    )

}

export default ConversationModal