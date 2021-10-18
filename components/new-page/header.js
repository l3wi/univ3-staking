import React from "react";
import { Image } from "@chakra-ui/image";
import { IconButton } from "@chakra-ui/button";
import { FiSun, FiMoon } from "react-icons/fi";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout";
import { Heading, Text, Center, Link } from "@chakra-ui/react";
import Ribbon from "../ribbon";
import { useWeb3 } from "../../contexts/useWeb3";

import UserAddress from "./wallet";
import style from "../../styles/components/header.module.scss";

const Header = () => {
  const { account, balance } = useWeb3();
  return (
    <div className={style.header}>
      <Logo />
      <Wallet />
    </div>
  );
};

const Logo = () => {
  return (
    <div className={style.logo}>
      <Ribbon /> <h1>Ribbon LP Program</h1>
    </div>
  );
};

const Directory = () => {
  return (
    <div className={style.directory}>
      {links.map((link) => {
        return (
          <Link
            key={link.label}
            href={link.href}
            isExternal={link.isExternal}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

const Wallet = () => {
  return <UserAddress />;
};

export default Header;
