import { Box, Flex, HStack, Link, Text, chakra } from "@chakra-ui/react";
import React from "react";
import useWeb3 from "../../contexts/useWeb3";
import style from "../../styles/components/footer.module.scss";

const links = [
  {
    label: "github",
    href: "https://github.com/l3wi/univ3-staking",
    isExternal: true,
  },
  {
    label: "@lewifree",
    href: "https://twitter.com/lewifree",
    isExternal: true,
  },
];

const Footer = () => {
  const { block } = useWeb3();
  return (
    <div className={style.footer}>
      <div></div>
      <div className={style.links}>
        {block > 0 && (
          <Link
            href="https://etherscan.io/blocks"
            isExternal
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className={style.node}></span>
            {block}
          </Link>
        )}
        {links.map((link) => {
          return (
            <Link
              key={link.label}
              href={link.href}
              isExternal={link.isExternal}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
