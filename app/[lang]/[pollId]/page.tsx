"use client";

import MotionButton from "@/component/motion-button";
import { createShortLink } from "@/lib/constants";
import {
  ChatIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Box,
  Center,
  Container,
  Divider,
  Heading,
  Icon,
  Input,
  Stack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AiOutlineAppstore,
  AiOutlineMail,
  AiOutlineSend,
} from "react-icons/ai";
import Pride from "react-canvas-confetti/dist/presets/pride";
import useTranslation from "next-translate/useTranslation";
import LanguageSwitcher from "@/component/language-switcher";
import Answer from "@/component/answer";
import _ from "lodash";

export type PageProps = {
  params: { pollId: string };
};

const insertShortLink = async (pollId: string): Promise<void> => {
  await fetch(`/api/short-link?pollId=${pollId}`, {
    method: "POST",
  });
};

const fetchShortLink = async (pollId: string): Promise<string | null> => {
  const res = await fetch(`/api/short-link?pin=${createShortLink(pollId)}`);
  return res.json();
};

export default function Index({ params: { pollId } }: Readonly<PageProps>) {
  const { t, lang } = useTranslation("main");

  const toast = useToast();
  const { onCopy, hasCopied, setValue } = useClipboard("");
  const qrCodeRef = useRef(null);
  const [hasSavedLink, setHasSavedLink] = useState(false);

  const [sendingEmail, setSendingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [pollName, setPollName] = useState("");

  const onInitHandler = async ({ conductor }: any) => {
    setHasSavedLink(true);
    const shortLink = await fetchShortLink(pollId);
    if (!shortLink) {
      conductor.run({ speed: 30, duration: 2000 });
      return;
    }
    setHasSavedLink(true);
  };

  useEffect(() => {
    setValue(`${window.location.protocol}//${window.location.host}/${pollId}`);
  }, [setValue, pollId]);

  const copyURL = async () => {
    onCopy();
    setHasSavedLink(true);
    await insertShortLink(pollId);
  };

  const debouncedSavePollName = _.debounce(async (name: string) => {
    await fetch(`/api/poll`, {
      method: "POST",
      body: JSON.stringify({ id: pollId, name }),
    });
  }, 2000);

  const debouncedOnChange = (name: string) => {
    setPollName(name);
    debouncedSavePollName(name);
  };

  const sendEmail = async (pollId: string, email: string): Promise<void> => {
    const res = await fetch(
      `/api/send-email?pollId=${pollId}&email=${email}&lang=${lang}`,
      { method: "POST" }
    ).then((res) => res.json());

    if (res.error) {
      toast({
        title: t("dashboard.stepOne.emailButton.toastError"),
        description: res.error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: t("dashboard.stepOne.emailButton.toastSuccess"),
        description:
          t("dashboard.stepOne.emailButton.toastSuccessDescription") + email,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setHasSavedLink(true);
      setSendingEmail(false);
      await insertShortLink(pollId);
    }

    setIsSendingEmail(false);
  };

  return (
    <Box bgColor={"blue"} minH={"100vh"}>
      <Pride onInit={onInitHandler} />
      <Container maxW="3xl" textAlign={"center"} color={"white"}>
        <Box as="header" w="100%" pt={3} color="black" textAlign={"right"}>
          <LanguageSwitcher currentLang={lang} />
        </Box>
        <Heading size={"xl"}>{t("dashboard.title")}</Heading>
        <Box className="step" borderRadius={20} pb="10" boxShadow={"2xl"}>
          <Box position="relative" padding="10">
            <Divider />
            <AbsoluteCenter
              fontWeight={"500"}
              fontSize={30}
              borderRadius={30}
              color={"blue"}
              bg="white"
              px="4"
            >
              1
            </AbsoluteCenter>
          </Box>

          <Heading size={"md"} px={3} pb={7}>
            {t("dashboard.stepOne.title")}
          </Heading>

          <Box display={"flex"} justifyContent={"space-evenly"}>
            {sendingEmail && (
              <Box display={"flex"} alignItems={"center"}>
                <form
                  action={() => {
                    setIsSendingEmail(true);
                    sendEmail(pollId, email);
                  }}
                >
                  <Input
                    w={180}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outline"
                    placeholder={t("dashboard.stepOne.emailButton.placeholder")}
                    _placeholder={{ color: "white" }}
                  />
                  <MotionButton
                    isLoading={isSendingEmail}
                    rightIcon={<AiOutlineSend />}
                    cursor={"pointer"}
                    fontSize={30}
                    ml={4}
                    type="submit"
                  ></MotionButton>

                  <CloseIcon
                    ml={5}
                    cursor={"pointer"}
                    onClick={() => setSendingEmail(false)}
                  />
                </form>
              </Box>
            )}

            {!sendingEmail && (
              <Stack direction={["column", "row"]} spacing={4}>
                <MotionButton
                  rightIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                  colorScheme={hasCopied ? "blue" : "gray"}
                  size={"lg"}
                  onClick={copyURL}
                >
                  {!hasCopied
                    ? t("dashboard.stepOne.copyButton.label")
                    : t("dashboard.stepOne.copyButton.copied")}
                </MotionButton>

                <MotionButton
                  rightIcon={<AiOutlineMail />}
                  size={"lg"}
                  onClick={() => setSendingEmail(true)}
                >
                  {t("dashboard.stepOne.emailButton.label")}
                </MotionButton>
              </Stack>
            )}
          </Box>
        </Box>

        {hasSavedLink && (
          <>
            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"blue"}
                  bg="white"
                  px="4"
                >
                  2
                </AbsoluteCenter>
              </Box>

              <Heading size={"md"} pb={5}>
                {"Quel est l'intitulé de votre sondage ?"}
              </Heading>

              <Box>
                <Box ref={qrCodeRef}>
                  <Center>
                    <Input
                      w={"20vw"}
                      value={pollName}
                      onChange={(e) => {
                        debouncedOnChange(e.target.value);
                      }}
                      placeholder={"Quel film regarder ce soir ?"}
                    />
                  </Center>
                </Box>
              </Box>
            </Box>

            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"blue"}
                  bg="white"
                  px="4"
                >
                  3
                </AbsoluteCenter>
              </Box>

              <Heading size={"md"} pb={5}>
                Paramétrez les réponses possibles
              </Heading>

              <Answer pollId={pollId} />
            </Box>

            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"blue"}
                  bg="white"
                  px="4"
                >
                  3
                </AbsoluteCenter>
              </Box>

              <Heading size={"md"} pb={7}>
                {t("dashboard.stepThree.title")}
              </Heading>

              <Stack
                justifyContent={"center"}
                direction={["column", "row"]}
                spacing={4}
              >
                <Box>
                  <Link target="_blank" href={`${pollId}/message`}>
                    <MotionButton rightIcon={<ChatIcon />} size={"lg"}>
                      {t("dashboard.stepThree.buttonMessageLabel")}
                    </MotionButton>
                  </Link>
                </Box>
              </Stack>

              <>
                <Heading size={"md"} pt={10}>
                  {t("dashboard.stepThree.projectionCodeLabel")}
                </Heading>

                <Box fontSize={60} fontWeight={"600"}>
                  {createShortLink(pollId)}
                </Box>
              </>
            </Box>

            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"blue"}
                  bg="white"
                  px="4"
                >
                  4
                </AbsoluteCenter>
              </Box>

              <Heading size={"md"} pb={7}>
                {t("dashboard.stepFour.title")}
              </Heading>

              <Box pb={4}>
                <Link target="_blank" href={`${pollId}/gallery`}>
                  <MotionButton
                    rightIcon={<Icon as={AiOutlineAppstore} />}
                    size={"lg"}
                  >
                    {t("dashboard.stepFour.buttonLabel")}
                  </MotionButton>
                </Link>
              </Box>
            </Box>

            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"blue"}
                  bg="white"
                  px="4"
                >
                  5
                </AbsoluteCenter>
              </Box>

              <Heading size={"md"} pb={7}>
                {t("dashboard.stepFive.title")}
              </Heading>
              <Link href={`/${lang}`}>
                <MotionButton rightIcon={<RepeatIcon />} size={"lg"}>
                  {t("dashboard.stepFive.buttonLabel")}
                </MotionButton>
              </Link>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
