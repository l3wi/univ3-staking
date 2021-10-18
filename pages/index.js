import React from "react";
import Page from "../components/new-page/page";
import { Positions } from "../components/new-page/positions";
import { Tabs } from "../components/new-page/tabs";
import FAQs from "./../components/faqs/index";
import { useState, useEffect } from "react";
import useWeb3 from "../contexts/useWeb3";
import { findNFTByPool, getPoolData } from "../utils/pools";
import { IncentiveKey } from "../utils/ethers";

export default function Home() {
  const programEmissions = 10000000;
  const secondsInAYear = 31540000;
  const [positions, setPositions] = useState([]);
  const [pool, setPool] = useState({});
  const { account, block } = useWeb3();

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
      component: (
        <Positions positions={positions} pool={pool} account={account} />
      ),
    },
    {
      name: "FAQ",
      component: <FAQs />,
    },
  ];

  return (
    <Page>
      <Tabs tabs={tabs} />
    </Page>
  );
}
