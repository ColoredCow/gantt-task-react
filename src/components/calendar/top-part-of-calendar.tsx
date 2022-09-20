import React, { ReactChild } from "react";
import styles from "./calendar.module.css";
import { Task, ViewMode  } from "../../types/public-types";

type TopPartOfCalendarProps = {
  value: string;
  x1Line: number;
  y1Line: number;
  y2Line: number;
  xText: number;
  yText: number;
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  tasks: Task[];
  columnWidth: number;
  viewMode: ViewMode;
};

export const TopPartOfCalendar: React.FC<TopPartOfCalendarProps> = ({
  value,
  x1Line,
  y1Line,
  // y2Line,
  xText,
  yText,
  dates,
  svgWidth,
  rowHeight,
  columnWidth,
  tasks,
  viewMode
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  let tickX = 0;
  const ticks: ReactChild[] = [];
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    if(i > 0 && viewMode === "Month" && date.getMonth() === 0) {
    ticks.push(
        <line
          key={date.getTime()}
          x1={tickX}
          y1={46}
          x2={tickX}
          y2={91}
          className={styles.lastMonthgridTick}
        />
      );
    } else {
      ticks.push(
        <line
        key={date.getTime()}
        x1={tickX}
        y1={46}
        x2={tickX}
        y2={91}
        className={styles.gridTick}
        />
        );
      }
    tickX += columnWidth;
  }

  return (
    <g className="gridBody">
      <g className="ticks">{ticks}</g>
      <g className="calendarTop">
        {x1Line === 360 && <line
          x1={x1Line}
          y1={y1Line}
          x2={x1Line}
          y2={45.5}
          className={styles.calendarTopTick}
          key={value + "line"}
        />}
        <text
          key={value + "text"}
          y={yText}
          x={xText}
          className={styles.calendarTopText}
        >
          {value}
        </text>
      </g>
    </g>
  );
};
