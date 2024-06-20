"use client";

import MotionButton from "@/component/motion-button";
import QrCode, { PAGES } from "@/component/qr-code";
import { InterfaceSections, createShortLink } from "@/lib/constants";
import {
  ArrowForwardIcon,
  ChatIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AiOutlinePicture,
  AiOutlineAppstore,
  AiFillPrinter,
  AiOutlineMail,
  AiOutlineSend,
} from "react-icons/ai";
import Pride from "react-canvas-confetti/dist/presets/pride";
import useTranslation from "next-translate/useTranslation";
import LanguageSwitcher from "@/component/language-switcher";

export type PageProps = {
  params: { pollId: string };
};

const insertShortLink = async (pollId: string): Promise<void> => {
  await fetch(`/api/short-link?pollId=${pollId}`, { method: "POST" });
};

const fetchShortLink = async (pollId: string): Promise<string | null> => {
  const res = await fetch(`/api/short-link?pin=${createShortLink(pollId)}`);
  return res.json();
};

const fetchInterfaceType = async (
  pollId: string
): Promise<InterfaceSections | null> => {
  const res = await fetch(`/api/settings/interfaceType?pollId=${pollId}`);
  return res.json();
};

const updateInterfaceType = async (
  pollId: string,
  interfaceType: InterfaceSections
): Promise<void> => {
  await fetch(
    `/api/settings/interfaceType?pollId=${pollId}&value=${interfaceType}`,
    { method: "POST" }
  );
};

export default function Index({ params: { pollId } }: Readonly<PageProps>) {
  const [interfaceType, setInterfaceType] = useState<InterfaceSections>(
    InterfaceSections.both
  );

  const { t, lang } = useTranslation("main");

  const toast = useToast();
  const { onCopy, hasCopied, setValue } = useClipboard("");
  const qrCodeRef = useRef(null);
  const [hasSavedLink, setHasSavedLink] = useState(false);

  const [sendingEmail, setSendingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [email, setEmail] = useState("");

  const onInitHandler = async ({ conductor }: any) => {
    const shortLink = await fetchShortLink(pollId);
    if (!shortLink) {
      conductor.run({ speed: 30, duration: 2000 });
      return;
    }
    setHasSavedLink(true);
    const interfaceType = await fetchInterfaceType(pollId);
    if (interfaceType) {
      setInterfaceType(interfaceType);
    }
  };

  useEffect(() => {
    setValue(`${window.location.protocol}//${window.location.host}/${pollId}`);
  }, [setValue, pollId]);

  const printQRCode = () => {
    const qrCodeElement = qrCodeRef.current;
    if (qrCodeElement) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write((qrCodeElement as HTMLElement).outerHTML);
      printWindow?.document.close();
      printWindow?.print();
    } else {
      console.error("QR Code element not found");
    }
  };

  const copyURL = async () => {
    onCopy();
    setHasSavedLink(true);
    await insertShortLink(pollId);
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

  const handleInterfaceTypeChange = async (
    interfaceType: keyof typeof InterfaceSections
  ) => {
    setInterfaceType(interfaceType);
    await updateInterfaceType(pollId, interfaceType);
  };

  return (
    <Box bgColor={"purple"} minH={"100vh"}>
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
              color={"purple"}
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
                  colorScheme={hasCopied ? "purple" : "gray"}
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
                  color={"purple"}
                  bg="white"
                  px="3"
                >
                  2
                </AbsoluteCenter>
              </Box>

              <Heading size={"md"} pb={5}>
                {`${t("dashboard.stepTwo.title")}`}

                <Menu>
                  <MenuButton
                    m={3}
                    as={Button}
                    size={"md"}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {t(`dashboard.stepTwo.options.${interfaceType}`)}
                  </MenuButton>
                  <MenuList color={"black"}>
                    {Object.values(InterfaceSections).map((section) => (
                      <MenuItem
                        key={section}
                        onClick={() => handleInterfaceTypeChange(section)}
                      >
                        {t(`dashboard.stepTwo.options.${section}`)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Heading>

              <Link target="_blank" href={`${pollId}/upload`}>
                <MotionButton rightIcon={<ArrowForwardIcon />} size={"lg"}>
                  {t("dashboard.stepTwo.buttonLabel")}
                </MotionButton>
              </Link>

              <Heading size={"md"} py={10}>
                {t("dashboard.stepTwo.subtitle")}
              </Heading>

              <Box>
                <Box ref={qrCodeRef}>
                  <Center>
                    <QrCode redirectTo={PAGES.upload} pollId={pollId} />
                  </Center>
                </Box>
                <MotionButton
                  rightIcon={<Icon as={AiFillPrinter} />}
                  mt={5}
                  onClick={() => printQRCode()}
                  size={"lg"}
                >
                  {t("dashboard.stepTwo.printButtonLabel")}
                </MotionButton>
              </Box>
            </Box>

            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"purple"}
                  bg="white"
                  px="3"
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
                {interfaceType !== InterfaceSections.messages && (
                  <Box pb={4}>
                    <Link target="_blank" href={`${pollId}/coverflow`}>
                      <MotionButton
                        rightIcon={<Icon as={AiOutlinePicture} />}
                        size={"lg"}
                      >
                        {t("dashboard.stepThree.buttonPhotoLabel")}
                      </MotionButton>
                    </Link>
                  </Box>
                )}

                {interfaceType !== InterfaceSections.photos && (
                  <Box>
                    <Link target="_blank" href={`${pollId}/message`}>
                      <MotionButton rightIcon={<ChatIcon />} size={"lg"}>
                        {t("dashboard.stepThree.buttonMessageLabel")}
                      </MotionButton>
                    </Link>
                  </Box>
                )}
              </Stack>

              {interfaceType !== InterfaceSections.messages && (
                <>
                  <Heading size={"md"} pt={10}>
                    {t("dashboard.stepThree.projectionCodeLabel")}
                  </Heading>

                  <Box fontSize={60} fontWeight={"600"}>
                    {createShortLink(pollId)}
                  </Box>
                </>
              )}
            </Box>

            <Box pb="10">
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter
                  fontWeight={"500"}
                  fontSize={30}
                  borderRadius={30}
                  color={"purple"}
                  bg="white"
                  px="3"
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
                  color={"purple"}
                  bg="white"
                  px="3"
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
