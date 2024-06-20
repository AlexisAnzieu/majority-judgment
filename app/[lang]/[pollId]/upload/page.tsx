"use client";

import {
  CLOUDINARY_FOLDER,
  InterfaceSections,
  cloudName,
  uploadPreset,
} from "@/lib/constants";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
  Textarea,
  useDisclosure,
  ToastPosition,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { PageProps } from "../page";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";

export default function Upload({ params: { pollId } }: Readonly<PageProps>) {
  const toast = useToast();
  const { t } = useTranslation("main");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const { data } = useSWR(
    `/api/settings/interfaceType?pollId=${pollId}`,
    fetcher
  );

  const initialRef = useRef(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultMessage = {
    loading: {
      title: t("upload.toast.loading.title"),
      description: t("upload.toast.loading.description"),
      position: "top" as ToastPosition,
    },
    success: {
      title: t("upload.toast.success.title"),
      description: t("upload.toast.success.description"),
      position: "top" as ToastPosition,
    },
    error: {
      title: t("upload.toast.error.title"),
      description: t("upload.toast.error.description"),
      position: "top" as ToastPosition,
    },
  };

  function createFormData(uploadPreset: string, file: File) {
    const fd = new FormData();
    fd.append("folder", `${CLOUDINARY_FOLDER}/${pollId}`);
    fd.append("upload_preset", uploadPreset);
    fd.append("file", file);
    return fd;
  }

  async function sendText() {
    const toastPromise = fetch("/api/texts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ author, text, pollId }),
    });

    toast.promise(toastPromise, defaultMessage);
    setAuthor("");
    setText("");
    onClose();
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = createFormData(uploadPreset as string, e.target.files![0]);

    const toastPromise = fetch(url, {
      method: "POST",
      body: fd,
    }).then(async (res) => {
      const response: any = await res.json();
      fetch(
        `/api/moderation?pictureUrl=${response.secure_url}&publicId=${response.public_id}`
      );
    });

    toast.promise(toastPromise, defaultMessage);
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={6}>
            <FormControl>
              <FormLabel fontSize={30}>
                {t("upload.message.modal.name")}
              </FormLabel>
              <Input
                value={author}
                focusBorderColor="purple.400"
                fontSize={25}
                ref={initialRef}
                placeholder={t("upload.message.modal.namePlaceholder")}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel fontSize={30}>
                {t("upload.message.modal.message")}
              </FormLabel>
              <Textarea
                value={text}
                height={"200px"}
                fontSize={25}
                focusBorderColor="purple.400"
                placeholder={t("upload.message.modal.messagePlaceholder")}
                onChange={(e) => setText(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => sendText()}
              size="lg"
              backgroundColor={"purple"}
              mr={3}
              color={"white"}
            >
              {t("upload.message.modal.button")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box display={"flex"} flexDirection={"column"}>
        {data !== InterfaceSections.messages && (
          <Box>
            <input
              aria-label="File browser example"
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              onChange={uploadFile}
              ref={fileInputRef}
            />
            <Box
              backgroundColor={"purple"}
              style={{
                width: "100vw",
                height: data === InterfaceSections.both ? "50vh" : "100vh",
              }}
              color={"white"}
              fontWeight={"900"}
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
              display={"flex"}
            >
              <Box
                cursor={"pointer"}
                onClick={() => fileInputRef.current?.click()}
                as={motion.div}
                whileTap={{ scale: 0.9 }}
                shadow={"dark-lg"}
                borderRadius={25}
                fontSize={40}
                p={10}
                m={10}
                bgColor="white"
                color="purple"
              >
                {t("upload.photo.buttonLabel")}
              </Box>
            </Box>
          </Box>
        )}
        {data !== InterfaceSections.photos && (
          <Box>
            <Box
              fontSize={50}
              style={{
                width: "100vw",
                height: data === InterfaceSections.both ? "50vh" : "100vh",
              }}
              color={"purple"}
              fontWeight={"900"}
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
              display={"flex"}
            >
              <Box
                cursor={"pointer"}
                onClick={onOpen}
                as={motion.div}
                whileTap={{ scale: 0.9 }}
                shadow={"dark-lg"}
                borderRadius={25}
                fontSize={40}
                p={10}
                m={10}
                bgColor="purple"
                color="white "
              >
                {t("upload.message.buttonLabel")}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
