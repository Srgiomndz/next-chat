import { SearchedUser, SearchUsersData, SearchUsersInput } from "@/src/util/types"
import { useLazyQuery } from "@apollo/client"
import { Text, Button, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal, Stack, Input, useQuery } from "@chakra-ui/react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import UserOperations from '../../../../graphql/operations/user'
import Participants from "./Participants"
import UserSearchList from "./UserSearchList"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {

    const [username, setUsername] = useState('')
    const [participants, setParticipants] = useState<Array<SearchedUser>>([])
    const [searchUsers, { data, error, loading }] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers)


    const onCreateConversation = async () => {
        try {
            // CreateConversation mutation goes here
        } catch (error) {
            console.log('onCreateConversation error', error);
            toast.error(error?.message)
        }
    }

    console.log('HERE IS SEARCH DATA', data);


    const onSearch = async (event: React.FormEvent) => {
        event.preventDefault()

        searchUsers({ variables: { username } })

        console.log('INSIDE ONSUBMIT', username);

    }

    const addParticipant = (user: SearchedUser) => {
        setParticipants(prev => [...prev, user])
        setUsername('')

    }
    const removeParticipant = (userId: string) => {
        setParticipants(prev => prev.filter(p => p.id !== userId))
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
                        {data?.searchUsers && <UserSearchList users={data?.searchUsers} addParticipant={addParticipant} />}
                        {participants.length !== 0 && <Participants participants={participants} removeParticipant={removeParticipant} />}
                        <Button width='100%' bg='brand.100' mt={6} _hover={{bg: 'brand.100'}} onClick={() => {}} >Create conversation</Button>
                    </ModalBody>


                </ModalContent>
            </Modal>
        </>
    )

}

export default ConversationModal