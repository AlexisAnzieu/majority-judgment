"use client";

import fetcher from "@/lib/fetcher";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import MotionButton from "./motion-button";
import { useState } from "react";
import { updateMutter, deleteMutter } from "@/lib/muter";

type Answer = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  picture: string;
  pollId: string;
};

export default function Answer({
  pollId,
}: Readonly<{
  pollId: string;
}>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isError, setIsError] = useState(false);

  const { data, isLoading, mutate } = useSWR<Answer[]>(
    `/api/poll?pollId=${pollId}`,
    fetcher
  );

  const { trigger: addToPoll } = useSWRMutation(
    "/api/poll",
    updateMutter<Partial<Answer>>
  );
  const { trigger: removeFromPoll } = useSWRMutation("/api/poll", deleteMutter);

  const insertAnswer = async (): Promise<void> => {
    if (!name || !description) {
      return setIsError(true);
    }
    setIsError(false);
    addToPoll({
      name: name,
      description,
      pollId,
    });
    mutate([{ name, id: "" } as any], ...(data as any));
    setName("");
    setDescription("");
    onClose();
  };

  const deleteAnswer = async (answerId: string): Promise<void> => {
    removeFromPoll({
      id: answerId,
    });
    mutate(data!.filter((item) => item.id !== answerId));
  };

  if (isLoading) {
    return (
      <Center p={100} color={"white"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="white"
          color="blue.500"
          size="md"
        />
      </Center>
    );
  }

  return (
    <Box>
      <MotionButton onClick={onOpen} leftIcon={<AddIcon />} size={"md"}>
        Ajouter une réponse
      </MotionButton>

      <Box borderRadius={"3xl"} color={"white"} px={10} overflow={"hidden"}>
        {data?.map((answer) => (
          <Box key={answer.id} py={15}>
            <Flex align="center" justify="space-around">
              <Heading py={2} size={"xl"}>
                {answer.name}
              </Heading>
              <CloseIcon
                ml={5}
                cursor={"pointer"}
                onClick={() => deleteAnswer(answer.id)}
              />
            </Flex>
          </Box>
        ))}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter une réponse</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={isError}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dune 2"
              />
            </FormControl>

            <FormControl isRequired mt={4} isInvalid={isError}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="un film de science-fiction américano-canadien coécrit et réalisé
                par Denis Villeneuve, sorti en 2024."
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={insertAnswer} colorScheme="blue" mr={3}>
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
