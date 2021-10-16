import { useState } from "react";
import style from "../../styles/components/tabs.module.scss";

export const Tabs = ({ tabs }) => {
  const [selectedPage, setSelectedPage] = useState(0);
  return (
    <>
      <div className={style.tabs}>
        {tabs.map((tab, i) => {
          return (
            <button
              className={selectedPage === i ? style.activeTab : style.tab}
              onClick={() => setSelectedPage(i)}
              key={i}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      {tabs[selectedPage].component}
    </>
  );
};
