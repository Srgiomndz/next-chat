import { CreateConversationData, CreateConversationInput, SearchedUser, SearchUsersData, SearchUsersInput } from "@/src/util/types"
import { useLazyQuery, useMutation } from "@apollo/client"
import { Text, Button, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal, Stack, Input, useQuery } from "@chakra-ui/react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import UserOperations from '../../../../graphql/operations/user'
import ConversationOperations from '../../../../graphql/operations/conversation'
import Participants from "./Participants"
import UserSearchList from "./UserSearchList"
import { Session } from "next-auth"


interface ModalProps {
    session: Session
    isOpen: boolean
    onClose: () => void

}

const ConversationModal: React.FC<ModalProps> = ({ session, isOpen, onClose }) => {


    const { user: { id: userId } } = session
    const [username, setUsername] = useState('')
    const [participants, setParticipants] = useState<Array<SearchedUser>>([])
    const [searchUsers, { data, error, loading }] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers)

    const [createConversation, { loading: createConversationLoading }] = useMutation<CreateConversationData, CreateConversationInput>(ConversationOperations.Mutations.createConversation)


    const onCreateConversation = async () => {

        const participantIds = [userId, ...participants.map(p => p.id)]

        try {
            const { data } = await createConversation({
                variables: {
                    participantIds,
                }
            })
            console.log('HERE IS DATA', data);
            
        } catch (error: any) {
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
                        <Button width='100%' bg='brand.100' mt={6} _hover={{ bg: 'brand.100' }} isLoading={createConversationLoading} onClick={onCreateConversation} >Create conversation</Button>
                    </ModalBody>


                </ModalContent>
            </Modal>
        </>
    )

}

export default ConversationModal