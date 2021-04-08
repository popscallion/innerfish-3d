import React, { useContext, useState, useEffect } from "react";
import { Box, Flex, Heading } from "rebass";
import { useWindowSize } from "@react-hook/window-size";
import { isMobileOnly } from "react-device-detect";
import Viewer from "./views/Viewer";
import Info from "./views/Info";
import Chapter from "./views/Chapter";
import Tree from "./views/Tree";

export const DataContext = React.createContext();
export const DarkContext = React.createContext();
export const SetDarkContext = React.createContext();
export const IdContext = React.createContext();
export const SetIdContext = React.createContext();
export const ChapterContext = React.createContext();
export const SetChapterContext = React.createContext();
export const BackerContext = React.createContext();
export const SetBackerContext = React.createContext();
export const SectionContext = React.createContext();
export const SetSectionContext = React.createContext();

const Universe = ({ children, dark }) => {
  return (
    <Flex
      sx={{
        bg: "transparent",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "absolute",
        zIndex: 10,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {children}
    </Flex>
  );
};

const Composer = ({ children }) => {
  return (
    <Flex
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        bg: "transparent",
        pointerEvents: "none",
        width: "100%",
        height: "75%",
        py: "2vh",
        overflow: "hidden",
      }}
    >
      {children}
    </Flex>
  );
};

const Context = ({ data, dark, setDark }) => {
  const [width, height] = useWindowSize();
  const availableChapters = [
    ...new Set(
      data
        .map(({ chapter }) => chapter)
        .flat()
        .sort()
    ),
  ];
  const [chapter, setChapter] = useState(availableChapters[0]);
  const [id, setId] = useState(
    data.find((datum) => datum.chapter.includes(chapter) && datum.default).uid
  );
  const [attribution, setAttribution] = useState(null);
  const [auto, setAuto] = useState(true);
  const [backer, setBacker] = useState(0);
  const [section, setSection] = useState(null);
  const [expand, setExpand] = useState(false);
  const [drawTree, setDrawTree] = useState(false);

  useEffect(() => {
    if (backer > 2) {
      setBacker(0);
    }
  }, [backer]);

  useEffect(() => {
    setId(
      data.find((datum) => datum.chapter.includes(chapter) && datum.default).uid
    );
  }, [chapter]);

  useEffect(() => {
    const timer = setTimeout(() => setDrawTree(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DataContext.Provider value={data}>
      <DarkContext.Provider value={dark}>
        <SetDarkContext.Provider value={setDark}>
          <IdContext.Provider value={id}>
            <SetIdContext.Provider value={setId}>
              <ChapterContext.Provider value={chapter}>
                <SetChapterContext.Provider value={setChapter}>
                  <BackerContext.Provider value={backer}>
                    <SetBackerContext.Provider value={setBacker}>
                      <SectionContext.Provider value={section}>
                        <SetSectionContext.Provider value={setSection}>
                          {isMobileOnly && height > width && (
                            <Flex
                              sx={{
                                flexFlow: "column nowrap",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              <Heading sx={{ fontSize: "medium" }}>
                                Please rotate your device to landscape mode.
                              </Heading>
                              <Heading sx={{ fontSize: "medium" }}>
                                This site is not optimized for smaller screens.
                              </Heading>
                            </Flex>
                          )}
                          {!(isMobileOnly && height > width) && (
                            <>
                              <Universe dark={dark}>
                                <Composer>
                                  <Chapter
                                    options={availableChapters}
                                    auto={auto}
                                    setAuto={setAuto}
                                  />
                                  <Info attribution={attribution} />
                                </Composer>
                                {drawTree && (
                                  <Tree expand={expand} setExpand={setExpand} />
                                )}
                              </Universe>
                              <Viewer
                                auto={auto}
                                setAttribution={setAttribution}
                                expand={expand}
                              />
                            </>
                          )}
                        </SetSectionContext.Provider>
                      </SectionContext.Provider>
                    </SetBackerContext.Provider>
                  </BackerContext.Provider>
                </SetChapterContext.Provider>
              </ChapterContext.Provider>
            </SetIdContext.Provider>
          </IdContext.Provider>
        </SetDarkContext.Provider>
      </DarkContext.Provider>
    </DataContext.Provider>
  );
};

export default Context;
