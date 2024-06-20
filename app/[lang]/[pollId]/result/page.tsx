"use client";

import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const Result = () => {
  return (
    <Flex
      minH={"100vh"}
      direction="column"
      align="center"
      bg="blue"
      color={"white"}
    >
      <Container mt={"5%"} maxW="3xl" px={{ base: 4, md: 6 }}>
        <Stack spacing={8}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" fontWeight="bold">
              Majority Judgment Vote Result
            </Heading>
          </Box>

          <Stack spacing={6} mt={10}>
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

export default Result;
