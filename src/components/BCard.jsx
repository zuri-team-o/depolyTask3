import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  HStack,
  useColorModeValue,
  Image,
  IconButton,
  Link,
  Flex,
} from '@chakra-ui/react';
import { BiCloudDownload, BiShare, BiUpvote } from 'react-icons/bi';

export default function BCard() {
  return (
      <Center py={6} direction={{ base: 'column', md: 'row' }}>
        <Box
          maxW={'400px'}
          w={'100%'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
            <Image
              src={
                'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              }
              layout={'cover'}
            />
          <Box px={6} py={4}>
            <Stack>
              <Link href="#">
                <Heading
                  color={'orange.500'}
                  fontSize={'2xl'}
                  fontFamily={'body'}>
                  Boost your conversion rate
                </Heading>
              </Link>
              <Text color={'gray.500'}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam ...
              </Text>
            </Stack>
            <HStack
              mt={{ lg: 10, md: 10 }}
              spacing={5}
              px={5}
              alignItems="flex-start"
              justifyContent={'space-between'}
              >
              <Flex alignItems={'center'} direction={'row' } justifyContent={'center'} fontWeight='700'>
                <IconButton
                    aria-label="vote"
                    isRound={true}
                    _hover={{ bg: 'orange.700' }}
                    variant="ghost"
                    size="lg"
                    icon={<BiUpvote size="28px" />}
                  /> 1
              </Flex>
              <IconButton
                aria-label="download"
                variant="ghost"
                size="lg"
                isRound={true}
                _hover={{ bg: 'orange.700' }}
                icon={<BiCloudDownload size="28px" />}
              />
              <IconButton
                aria-label="share"
                variant="ghost"
                size="lg"
                isRound={true}
                _hover={{ bg: 'orange.700' }}
                icon={<BiShare size="28px" />}
              />
            </HStack>
          </Box>
        </Box>
      </Center>
  );
}