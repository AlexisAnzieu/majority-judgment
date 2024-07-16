"use client";

import fetcher from "@/lib/fetcher";
import {
  Box,
  Button,
  Center,
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

import { AddIcon } from "@chakra-ui/icons";
import MotionButton from "./motion-button";
import { useState } from "react";
import muter from "@/lib/muter";

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

  const { data, isLoading, mutate } = useSWR<Answer[]>(
    `/api/poll?pollId=${pollId}`,
    fetcher
  );

  const { trigger } = useSWRMutation("/api/poll", muter<Partial<Answer>>);

  const insertAnswer = async (): Promise<void> => {
    trigger({
      name: name,
      description,
      pollId,
    });
    mutate([...data!, { name, id: "" } as any]);
    setName("");
    setDescription("");
    onClose();
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
            <Heading py={2} size={"2xl"}>
              {answer.name}
            </Heading>
          </Box>
        ))}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter une réponse</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dune 2"
              />
            </FormControl>

            <FormControl mt={4}>
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
