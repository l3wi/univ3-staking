import React, { useEffect, useState } from "react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { useWeb3 } from "../contexts/useWeb3";
import { useAlerts } from "../contexts/useAlerts";
import {
  findNFTByPool,
  depositNFT,
  depositStakeNFT,
  stakeNFT,
  claimReward,
  exitPool,
  withdrawNFT,
  getPoolData,
} from "../utils/pools";
import { commas } from "../utils/helpers";
import { comma } from "../utils/helpers";

import Page from "../components/new-page/page";
import FAQs from "../components/faqs";
import { Positions } from "../components/new-page/positions";
import style from "../styles/components/index.module.scss";
import { Tabs } from "../components/new-page/tabs";

// RBN PROGRAM
const IncentiveKey = [
  "0x6123B0049F904d730dB3C36a31167D9d4121fA6B",
  "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a",
  1633694400,
  1638878400,
  "0xDAEada3d210D2f45874724BeEa03C7d4BBD41674",
];

const programEmissions = 10000000;
const secondsInAYear = 31540000;

export default function Home() {
  const { account, block } = useWeb3();
  const { watchTx, addAlert } = useAlerts();
  const [positions, setPositions] = useState([]);
  const [pool, setPool] = useState({});
  const cardBgColor = useColorModeValue("white", "gray.700");

  const deposit = async (id) => {
    try {
      const tx = await depositStakeNFT(id, account, IncentiveKey);
      watchTx(tx.hash, "Depositing NFT");
    } catch (error) {
      addAlert("fail", "Program not active. Try later");
    }
  };

  const withdraw = async (id) => {
    const tx = await withdrawNFT(id, account);
    watchTx(tx.hash, "Withdrawing NFT");
  };

  const stake = async (id) => {
    try {
      const tx = await stakeNFT(id, IncentiveKey);
      watchTx(tx.hash, "Staking NFT");
    } catch (error) {
      addAlert("fail", "Program not active. Try later");
    }
  };

  const claim = async (id, reward) => {
    const tx = await claimReward(id, account, reward, IncentiveKey);
    watchTx(tx.hash, "Claiming rewards");
  };

  const exit = async (id, reward) => {
    const tx = await exitPool(id, account, reward, IncentiveKey);
    watchTx(tx.hash, "Exiting pool & claiming rewards");
  };

  const inRange = (tick, lower, upper) => {
    return upper > tick && tick > lower;
  };

  useEffect(async () => {
    if (account) {
      const lpPositions = await findNFTByPool(account, IncentiveKey);
      setPositions(lpPositions);
    }
    /// Calculate APY
    const data = await getPoolData(IncentiveKey[1], IncentiveKey[0]);
    const emissionsPerSecond =
      programEmissions / (IncentiveKey[3] - IncentiveKey[2]);
    const apy =
      ((emissionsPerSecond * data.token * secondsInAYear) / data.tvl) * 100;
    setPool({ ...data, apy });
  }, [account, block]);

  const tabs = [
    {
      name: "Positions",
      component: <Positions pool={pool} positions={positions} />,
    },
    {
      name: "FAQ",
      component: <p>hi</p>,
    },
  ];

  return (
    <Page>
      <Tabs tabs={tabs} />
    </Page>
  );
}
