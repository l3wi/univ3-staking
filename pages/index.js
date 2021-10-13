import React, { useEffect, useState } from "react";
import { useColorModeValue } from "@chakra-ui/color-mode";

import Page from "../components/new-page/page";
import FAQs from "../components/faqs";
import { useWeb3 } from "../contexts/useWeb3";
import { useAlerts } from "../contexts/useAlerts";

import { commas } from "../utils/helpers";

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

import { comma } from "../utils/helpers";
import style from "../styles/components/index.module.scss";
import Ribbon from "../components/ribbon";
import CountUp from "react-countup";

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

  console.log(positions);
  return (
    <Page>
      <div className={style.page}>
        <Statistics pool={pool} positions={positions} />
        <Positions positions={positions} pool={pool} />
        <ExitedPositions />
      </div>
    </Page>
  );
}

const Statistics = ({ pool, positions }) => {
  return (
    <div className={style.stats}>
      <NumberedStat
        bg={"#16ceb9"}
        label={"Liquidity Providing Program"}
        desc={
          "The LP staking program will run over a period of 2 months since the commencement of RGP-4."
        }
        footer={"55 days left"}
        startValue={"8th Oct"}
        endValue={"8th Dec"}
      ></NumberedStat>
      <NumberedStat
        bg={"#fc0a54"}
        label={"$RBN Distribution"}
        desc={
          "A total of 10 million $RBN (1% of the total supply) will be distributed over the course of the program."
        }
        footer={`${commas(125030 / 1000000) * 100}% Distributed`}
        startValue={commas(100000)}
        endValue={commas(1000000)}
      ></NumberedStat>
      <Stat
        label={"RBN Price"}
        prefix={"$"}
        value={pool.tvl ? pool.token : 0}
      ></Stat>
      <Stat
        label={"Pool TVL"}
        prefix={"$"}
        value={pool.tvl ? pool.tvl : 0}
      ></Stat>
      <Stat
        label={"Staking APR"}
        value={pool.apy ? pool.apy : 0}
        suffix={"%"}
      ></Stat>
      <Stat
        label={"Total Rewards"}
        suffix={pool.symbol ? ` ${pool.symbol}` : ""}
        value={
          positions[0]
            ? `${commas(
                positions
                  .map((i) => (i.reward ? i.reward / 1e18 : 0))
                  .reduce((a, b) => a + b)
              )}`
            : 0
        }
      ></Stat>
    </div>
  );
};

const NumberedStat = ({ label, desc, footer, startValue, endValue, bg }) => {
  const completionRate = (startValue / endValue) * 100;
  return (
    <div className={style.numberedStat}>
      <h6>{label}</h6>
      <p className={style.progressDesc}>{desc}</p>
      <div className={style.progressHeader}>
        <p>{startValue}</p>
        <p>{endValue}</p>
      </div>
      <div className={style.progressBar}>
        <span
          style={{ width: `${completionRate}%`, backgroundColor: bg }}
          className={style.progress}
        ></span>
      </div>
      <p className={style.progressFooter}>{footer}</p>
    </div>
  );
};

const Stat = ({ label, value, prefix = null, suffix = null }) => {
  return (
    <div className={style.stat}>
      <h6>{label}</h6>
      <p>
        <CountUp
          decimals={2}
          end={value}
          preserveValue={true}
          separator={","}
          duration={2}
          prefix={prefix ?? ""}
          suffix={suffix ?? ""}
        />
      </p>
    </div>
  );
};

const Positions = ({ positions = [], pool }) => {
  const stakedPositions = positions.filter((pos) => pos.staked);
  const unstakedPositions = positions.filter((pos) => !pos.staked);

  return (
    <div className={style.positionWrapper}>
      <div className={style.positionList}>
        <h2>
          POSITIONS - <span>ACTIVE</span> - {stakedPositions.length || 0}
        </h2>
      </div>

      <div>
        {stakedPositions.map((position) => {
          return (
            <div className={style.position}>
              <div className={style.positionHeader}>
                <h2>
                  <Ribbon w={40} h={40} />
                  <span>TOKEN #137755</span>
                </h2>
                <div className={style.positionCTA}>
                  <img src={"/etherscan.svg"} />
                  <img src={"/uni.svg"} />
                </div>
              </div>
              <div className={style.positionRange}>
                <h2>Price Range</h2>
                <div className={style.rangeWrapper}>
                  <span className={style.negativeRange}></span>
                  <span className={style.positiveRange}></span>
                  <div className={style.rangeLimit}>
                    <span className={style.range}></span>
                  </div>
                </div>
                <div className={style.rangeLimitDesc}>
                  <span>520</span>
                  <span>1400</span>
                </div>
              </div>
              <div className={style.positionStats}>
                <div className={style.positionStat}>
                  <h2>Liquidity</h2>
                  <span>{"--"}</span>
                </div>

                <div className={style.positionStat}>
                  <h2>Fees</h2>
                  <div>
                    <div className={style.currency}>
                      <CountUp
                        decimals={2}
                        end={position.fees0}
                        preserveValue={true}
                        separator={","}
                        duration={2}
                        prefix={""}
                        suffix={" RBN"}
                      />
                      {/* <CountUp
                        decimals={2}
                        end={position.fees0 * pool.token}
                        preserveValue={true}
                        separator={","}
                        duration={2}
                        prefix={"~$"}
                        suffix={"USD"}
                      /> */}
                    </div>
                    <div className={style.currency}>
                      <CountUp
                        decimals={2}
                        end={position.fees1}
                        preserveValue={true}
                        separator={","}
                        duration={2}
                        prefix={""}
                        suffix={" ETH"}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.positionStat}>
                  <h2>Rewards</h2>
                  <div>
                    <div className={style.currency}>
                      <CountUp
                        decimals={2}
                        end={position.reward / 1e18}
                        preserveValue={true}
                        separator={","}
                        duration={2}
                        prefix={""}
                        suffix={" RBN"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExitedPositions = () => {
  return (
    <div className={style.exitedPositionWrapper}>
      <h2>
        POSITIONS - <span>EXITED</span> - 0
      </h2>
    </div>
  );
};
