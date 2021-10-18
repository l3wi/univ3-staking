import CountUp from "react-countup";
import Ribbon from "../ribbon";
import style from "../../styles/components/positions.module.scss";
import { commas } from "../../utils/helpers";
import { Link } from "@chakra-ui/react";

export const Positions = ({ pool, positions }) => {
  return (
    <div className={style.page}>
      <Statistics pool={pool} positions={positions} />
      <ActivePositions
        positions={positions.filter((pos) => pos.staked)}
        pool={pool}
      />
      <ExitedPositions
        positions={positions.filter((pos) => !pos.staked)}
        pool={pool}
      />
    </div>
  );
};

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

const ActivePositions = ({ positions = [], pool }) => {
  return (
    <div className={style.positionWrapper}>
      <div className={style.positionList}>
        <h2>
          POSITIONS - <span>ACTIVE</span> - {positions.length || 0}
        </h2>

        {/* <span>Show rewards in</span> */}
      </div>

      <div>
        {positions.map((position, i) => {
          return <PositionCard key={i} position={position} pool={pool} />;
        })}
        <div className={style.positionCreate}>
          {positions.length === 0 && <p>You have no active LP positions</p>}

          <span>+</span>
          <Link
            href={"https://app.uniswap.org/#/swap"}
            isExternal={true}
            rel="noopener noreferrer"
            target="_blank"
          >
            Create a position
          </Link>
          <div>Token address: 0x6123B0049F904d730dB3C36a31167D9d4121fA6B</div>
        </div>
      </div>
    </div>
  );
};

const ExitedPositions = ({ positions = [], pool }) => {
  return (
    <div className={style.exitedPositionWrapper}>
      <div className={style.positionList}>
        <h2>
          POSITIONS - <span>INACTIVE</span> - {positions.length || 0}
        </h2>
        {/* <span>Show rewards in</span> */}
      </div>

      <div>
        {positions
          .filter((pos) => !pos.staked)
          .map((position, i) => {
            console.log(position);
            return <PositionCard key={i} position={position} pool={pool} />;
          })}
      </div>
    </div>
  );
};

const PositionCard = ({ position, pool }) => {
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
            {true && (
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
          <h2>LP Rewards</h2>
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
          <h2>Uniswap Fees</h2>
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
              <img src={"/eth.svg"} width={15} height={15} />
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
      </div>
    </div>
  );
};
