import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";
import { ViewMode  } from "../../types/public-types";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  viewMode: ViewMode;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  viewMode
}) => {
  let y = 0;
  if (viewMode === "Month") {
    y = 1;
  }

  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={y}
      x2={svgWidth}
      y2={y}
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
    if(y + rowHeight !== 430) {
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
    }
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    if(i > 0 && viewMode === "Month" && date.getMonth() === 0) {
      ticks.push(
        <line
          key={date.getTime()}
          x1={tickX}
          y1={0}
          x2={tickX}
          y2={y}
          className={styles.lastMonthgridTick}
        />
      );
    } else {
      ticks.push(
        <line
          key={date.getTime()}
          x1={tickX}
          y1={0}
          x2={tickX}
          y2={y}
          className={viewMode === "Year" ? "calendarGridTicks" : styles.gridTick}
        />
      );
    }
    let todayY = 0;
    if (viewMode === "Month") {
      todayY = 1;
    }
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={todayY}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={todayY}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="ticks">{ticks}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="today">{today}</g>
    </g>
  );
};
