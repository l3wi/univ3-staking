import CountUp from "react-countup";
import Ribbon from "../ribbon";
import style from "../../styles/components/positions.module.scss";
import { commas } from "../../utils/helpers";
import { Link } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  parseISO,
  differenceInDays,
  format,
  differenceInSeconds,
} from "date-fns";
import {
  depositStakeNFT,
  stakeNFT,
  claimReward,
  exitPool,
  withdrawNFT,
} from "../../utils/pools";
import useAlerts from "../../contexts/useAlerts";
import { IncentiveKey } from "../../utils/ethers";

export const Positions = ({ pool, positions = [], account }) => {
  return (
    <div className={style.page}>
      <Statistics pool={pool} positions={positions} />
      <ActivePositions
        positions={positions.filter((pos) => pos.staked)}
        pool={pool}
        account={account}
      />
      <InactivePositions
        positions={positions.filter((pos) => !pos.staked)}
        pool={pool}
        account={account}
      />
    </div>
  );
};

const Statistics = ({ pool, positions }) => {
  const endDate = parseISO("2021-12-08 12:00", "yyyy-MM-dd hh:mm");
  const startDate = parseISO("2021-10-08 12:00", "yyyy-MM-dd hh:mm");

  const daysFromStart = differenceInDays(new Date(), startDate);
  const daysToEnd = differenceInDays(endDate, new Date());
  const totalDays = differenceInDays(endDate, startDate);

  const secondsElapsed = differenceInSeconds(new Date(), startDate);
  const totalSeconds = differenceInSeconds(endDate, startDate);

  return (
    <div className={style.stats}>
      <NumberedStat
        bg={"#16ceb9"}
        label={"Liquidity Providing Program"}
        desc={
          "The LP staking program will run over a period of 2 months since the commencement of RGP-4."
        }
        footer={`${daysToEnd} days left`}
        startValue={daysFromStart}
        endValue={totalDays}
        startDesc={format(startDate, "MMM dd")}
        endDesc={format(endDate, "MMM dd")}
      ></NumberedStat>
      <NumberedStat
        bg={"#fc0a54"}
        label={"$RBN Distribution"}
        desc={
          "A total of 10 million $RBN (1% of the total supply) will be distributed over the course of the program."
        }
        footer={`Approx. ${commas(
          (secondsElapsed / totalSeconds) * 100
        )}% Distributed`}
        startValue={commas((secondsElapsed / totalSeconds) * 10000000)}
        endValue={commas(10000000)}
      ></NumberedStat>
      <Stat
        label={"Pool TVL"}
        prefix={"$"}
        value={pool.tvl ? pool.tvl : 0}
      ></Stat>
      <Stat
        label={"RBN Price"}
        prefix={"$"}
        value={pool.tvl ? pool.token : 0}
      ></Stat>
      {/* <Stat
        label={"Staking APR"}
        value={pool.apy ? pool.apy : 0}
        suffix={"%"}
      ></Stat> */}
      <Stat
        label={"Total Claimable Rewards"}
        prefix={<Ribbon w={15} h={15} />}
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

const NumberedStat = ({
  label,
  desc,
  footer,
  startDesc,
  startValue,
  endDesc,
  endValue,
  bg,
}) => {
  const completionRate = (startValue / endValue) * 100;
  return (
    <div className={style.numberedStat}>
      <h6>{label}</h6>
      <p className={style.progressDesc}>{desc}</p>
      <div className={style.progressHeader}>
        <p>{startDesc ?? startValue}</p>
        <p>{endDesc ?? endValue}</p>
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
        {prefix}
        <CountUp
          decimals={2}
          end={value}
          preserveValue={true}
          separator={","}
          duration={2}
          suffix={suffix ?? ""}
        />
      </p>
    </div>
  );
};

const ActivePositions = ({ positions = [], pool, account }) => {
  const [isExpanded, setExpand] = useState(true);

  const tokenAddress = "0x6123b0049f904d730db3c36a31167d9d4121fa6b";
  return (
    <div className={style.positionWrapper}>
      <div className={style.positionList}>
        <h2>
          Positions - <span>Active</span> - {positions.length || 0}
        </h2>

        {positions.length > 0 && (
          <a onClick={() => setExpand(!isExpanded)}>
            {isExpanded ? "- Hide all" : "+ Show all"}
          </a>
        )}
      </div>

      <div>
        {isExpanded &&
          positions.map((position, i) => {
            return (
              <PositionCard
                key={i}
                position={position}
                pool={pool}
                account={account}
              />
            );
          })}
        <div className={style.positionCreate}>
          {positions.length === 0 && <p>You have no active LP positions</p>}

          <span>+</span>
          <Link
            href={`https://app.uniswap.org/#/add/ETH/${tokenAddress}/10000`}
            isExternal={true}
            rel="noopener noreferrer"
            target="_blank"
          >
            Create a position
          </Link>
          <div>Token address: {tokenAddress}</div>
        </div>
      </div>
    </div>
  );
};

const InactivePositions = ({ positions = [], pool, account }) => {
  const [isExpanded, setExpand] = useState(true);

  return (
    <div className={style.exitedPositionWrapper}>
      <div className={style.positionList}>
        <h2>
          POSITIONS - <span>INACTIVE</span> - {positions.length || 0}
        </h2>
        {positions.length > 0 && (
          <a onClick={() => setExpand(!isExpanded)}>
            {isExpanded ? "- Hide all" : "+ Show all"}
          </a>
        )}
      </div>

      <div>
        {isExpanded &&
          positions
            .filter((pos) => !pos.staked)
            .map((position, i) => {
              return (
                <PositionCard
                  key={i}
                  position={position}
                  pool={pool}
                  account={account}
                />
              );
            })}
        <div className={style.positionCreate}>
          {positions.length === 0 && <p>You have no inactive LP positions</p>}
        </div>
      </div>
    </div>
  );
};

const PositionCard = ({ position, pool, account }) => {
  const { watchTx, addAlert } = useAlerts();

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

  const rangePercentage =
    (Math.abs(pool.tick - position.tickLower) /
      Math.abs(position.tickUpper - position.tickLower)) *
    100;
  const inRange = rangePercentage > 0 && rangePercentage < 100;

  return (
    <div
      className={
        position.staked ? style.activePosition : style.inactivePosition
      }
    >
      <div className={style.positionHeader}>
        <h2>
          <img src={"/RBN_ETH.svg"} />
          <span>TOKEN #{position.id}</span>
        </h2>
        <div className={style.positionCTA}>
          <Link
            href={`https://etherscan.io/token/0xc36442b4a4522e871399cd717abdd847ab11fe88?a=${position.id}`}
            isExternal={true}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img src={"/etherscan.svg"} />
          </Link>
          <Link
            href={`https://app.uniswap.org/#/pool/${position.id}`}
            isExternal={true}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img src={"/uni.svg"} />
          </Link>
          <Link
            href={`https://revert.finance/#/uniswap-position/${position.id}`}
            isExternal={true}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img src={"/revert.png"} />
          </Link>
        </div>
      </div>
      <div className={style.positionRange}>
        <div className={style.rangeLimitDesc}>
          <span>MIN</span>
          <h2
            style={{
              color: !position.staked
                ? "rgb(172, 172, 171)"
                : inRange
                ? "#16ceb9"
                : "#fc0a54",
            }}
          >
            {inRange ? "IN RANGE" : "OUT OF RANGE"}
          </h2>
          <span>MAX</span>
        </div>
        <div
          className={
            inRange ? style.activeRangeWrapper : style.inactiveRangeWrapper
          }
        >
          <span
            className={
              rangePercentage < 0
                ? style.activeNegativeRange
                : style.inactiveNegativeRange
            }
          ></span>
          <div className={style.rangeLimit}>
            {inRange && (
              <span
                className={style.range}
                style={{ marginLeft: `${rangePercentage}%` }}
              ></span>
            )}
          </div>
          <span
            className={
              rangePercentage > 100
                ? style.activePositiveRange
                : style.inactivePositiveRange
            }
          ></span>
        </div>
        <div className={style.rangeLimitDesc}>
          <span>{position.tickLower}</span>
          <span>{pool.tick}</span>
          <span>{position.tickUpper}</span>
        </div>
      </div>
      <div className={style.positionStats}>
        <div className={style.positionStat}>
          <h2>Liquidity (% of Pool)</h2>
          <div>
            <CountUp
              decimals={2}
              end={0}
              preserveValue={true}
              separator={","}
              duration={2}
              prefix={"$"}
              suffix={""}
            />
          </div>
          <div>
            <CountUp
              decimals={3}
              end={(position.liquidity / pool.liquidity) * 100}
              preserveValue={true}
              separator={","}
              duration={2}
              prefix={""}
              suffix={"%"}
            />
          </div>
        </div>
        <div className={style.positionStat}>
          <h2>Claimable Rewards</h2>
          <div>
            <div className={style.currency}>
              <Ribbon w={15} h={15} />
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
        <div className={style.positionStat}>
          <h2>Claimable Fees</h2>
          <div>
            <div className={style.currency}>
              <Ribbon w={15} h={15} />
              <CountUp
                decimals={2}
                end={position.fees0}
                preserveValue={true}
                separator={","}
                duration={2}
                prefix={""}
                suffix={" RBN"}
              />
            </div>
            <div className={style.currency}>
              <img src={"/eth.svg"} width={15} height={15} />
              <CountUp
                decimals={4}
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
      </div>
      <div className={style.positionFooters}>
        {!position.deposited && (
          <div
            className={style.positionStat}
            onClick={() => deposit(position.id)}
          >
            Deposit
          </div>
        )}
        {position.deposited && !position.staked ? (
          <>
            <div
              className={style.positionStat}
              onClick={() => stake(position.id)}
            >
              Stake
            </div>
            <div
              className={style.positionStat}
              onClick={() => withdraw(position.id)}
            >
              Withdraw
            </div>
          </>
        ) : null}
        {position.deposited && position.staked ? (
          <>
            <div
              className={style.positionStat}
              onClick={() => claim(position.id, position.reward)}
            >
              Claim
            </div>
            <div
              className={style.positionStat}
              onClick={() => exit(position.id, position.reward)}
            >
              Exit
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
