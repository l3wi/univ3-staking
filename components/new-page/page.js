import { Box, Flex } from "@chakra-ui/layout";
import Header from "../../components/new-page/header";
import Footer from "../../components/new-page/footer";
import Alerts from "../page/alerts";
import React from "react";
import Head from "next/head";

import { useColorModeValue } from "@chakra-ui/color-mode";

const Layout = ({ children, title }) => {
  // const bgColor = useColorModeValue("#000", "gray.800");

  return (
    <Flex
      minHeight="100vh"
      flexDirection="column"
      backgroundColor={"#000"}
      px={[4, 4, 12]}
    >
      <Head>
        <title>{title ? title + ` - UniV3 Staker` : `UniV3 Staker`}</title>
        <link rel="icon" href="/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@lewifree" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://staker.projects.sh" />
        <meta property="og:title" content="Ribbon (RBN) staker" />
        <meta
          property="og:description"
          content="A staking UI for the Ribbon reward program."
        />
        <meta property="og:site_name" content="Uniswap V3 staker" />
        <meta
          property="og:image"
          content="https://staker.projects.sh/meta.png"
        />
      </Head>
      <Alerts />
      <Header />
      <Box flexGrow={1}>{children}</Box>
      <Footer />
    </Flex>
  );
};

// const Header = () => {};
export default Layout;
