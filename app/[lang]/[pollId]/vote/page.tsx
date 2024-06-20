"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import MotionButton from "@/component/motion-button";

const MajorityJudgmentVote = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="blue"
      color="white"
    >
      <Container maxW="3xl" px={{ base: 4, md: 6 }}>
        <Stack spacing={8}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" fontWeight="bold">
              Majority Judgment Vote
            </Heading>
            <Text mt={2} fontSize="lg" color="muted-foreground">
              Rate each answer option on a scale of 1-5 stars. Your vote will be
              counted towards the majority judgment for each option.
            </Text>
            <VStack spacing={3} mt={6}>
              <FormControl>
                <Flex
                  bg="input"
                  px={3}
                  py={2}
                  rounded="md"
                  _focusWithin={{
                    ring: 1,
                    ringColor: "primary",
                    ringOffset: 1,
                  }}
                >
                  <Box
                    as="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-muted-foreground"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </Box>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    h={10}
                    border="none"
                    flex={1}
                    bg="transparent"
                    _focus={{
                      outline: "none",
                      ring: 2,
                      ringColor: "ring",
                      ringOffset: 2,
                    }}
                    _disabled={{ cursor: "not-allowed", opacity: 0.5 }}
                  />
                </Flex>
              </FormControl>
            </VStack>
          </Box>

          <Box bg="card" borderWidth="1px" rounded="lg" shadow="lg" p={8}>
            <Stack spacing={8}>
              <Box>
                <Heading as="h2" size="lg" fontWeight="bold">
                  Which is the best pizza topping?
                </Heading>
              </Box>
              <form>
                <Grid
                  templateColumns={{
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {[
                    { name: "Pepperoni", stars: 3 },
                    { name: "Mushroom", stars: 2 },
                    { name: "Pineapple", stars: 4 },
                  ].map((item, index) => (
                    <VStack key={index} spacing={3}>
                      <Heading as="h3" size="md" fontWeight="medium">
                        {item.name}
                      </Heading>
                      <Image
                        src="/placeholder.svg"
                        width="100"
                        height="100"
                        alt={item.name}
                        borderRadius="md"
                        style={{ aspectRatio: "1/1", objectFit: "cover" }}
                      />
                      <Flex align="center" gap={2}>
                        {Array(5)
                          .fill("")
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              boxSize={6}
                              color={
                                i < item.stars ? "primary" : "muted-foreground"
                              }
                            />
                          ))}
                      </Flex>
                    </VStack>
                  ))}
                </Grid>
                <Center>
                  <MotionButton size="lg" mt={10} h={10} type="submit">
                    Submit Vote
                  </MotionButton>
                </Center>
              </form>
            </Stack>
          </Box>

          <Stack spacing={6}>
            <Heading as="h2" size="lg" fontWeight="bold">
              Current Majority Judgment
            </Heading>
            <Grid
              templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              {[
                { name: "Pepperoni", stars: 3 },
                { name: "Mushroom", stars: 2 },
                { name: "Pineapple", stars: 4 },
              ].map((item, index) => (
                <VStack key={index} spacing={3}>
                  <Heading as="h3" size="md" fontWeight="medium">
                    {item.name}
                  </Heading>
                  <Image
                    src="/placeholder.svg"
                    width="100"
                    height="100"
                    alt={item.name}
                    borderRadius="md"
                    style={{ aspectRatio: "1/1", objectFit: "cover" }}
                  />
                  <Flex align="center" gap={2}>
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          boxSize={6}
                          color={
                            i < item.stars ? "primary" : "muted-foreground"
                          }
                        />
                      ))}
                  </Flex>
                </VStack>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
};

export default MajorityJudgmentVote;
