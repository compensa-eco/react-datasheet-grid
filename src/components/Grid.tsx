import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual'
import React, { ReactNode, RefObject, useEffect } from 'react'
import {
  Cell,
  Column,
  ContextMenuItem,
  DataSheetGridProps,
  Selection,
} from '../types'
import cx from 'classnames'
import { Cell as CellComponent } from './Cell'
import { useMemoizedIndexCallback } from '../hooks/useMemoizedIndexCallback'

export const Grid = <T extends any>({
  data,
  columns,
  outerRef,
  innerRef,
  columnWidths,
  hasStickyRightColumn,
  displayHeight,
  headerRowHeight,
  rowHeight,
  rowKey,
  fullWidth,
  selection,
  activeCell,
  rowClassName,
  cellClassName,
  children,
  editing,
  getContextMenuItems,
  setRowData,
  deleteRows,
  duplicateRows,
  insertRowAfter,
  stopEditing,
  onScroll,
  fakeHeader,
}: {
  data: T[]
  columns: Column<T, any, any>[]
  outerRef: RefObject<HTMLDivElement>
  innerRef: RefObject<HTMLDivElement>
  columnWidths?: number[]
  hasStickyRightColumn: boolean
  displayHeight: number
  headerRowHeight: number
  rowHeight: (index: number) => { height: number }
  rowKey: DataSheetGridProps<T>['rowKey']
  rowClassName: DataSheetGridProps<T>['rowClassName']
  cellClassName: DataSheetGridProps<T>['cellClassName']
  fullWidth: boolean
  selection: Selection | null
  activeCell: Cell | null
  children: ReactNode
  editing: boolean
  getContextMenuItems: () => ContextMenuItem[]
  setRowData: (rowIndex: number, item: T) => void
  deleteRows: (rowMin: number, rowMax?: number) => void
  duplicateRows: (rowMin: number, rowMax?: number) => void
  insertRowAfter: (row: number, count?: number) => void
  stopEditing: (opts?: { nextRow?: boolean }) => void
  onScroll?: React.UIEventHandler<HTMLDivElement>
  fakeHeader?: ReactNode
}) => {
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => outerRef.current,
    paddingStart: headerRowHeight,
    estimateSize: (index) => rowHeight(index).height,
    getItemKey: (index: number): React.Key => {
      if (rowKey && index > 0) {
        const row = data[index - 1]
        if (typeof rowKey === 'function') {
          return rowKey({ rowData: row, rowIndex: index })
        } else if (
          typeof rowKey === 'string' &&
          row instanceof Object &&
          rowKey in row
        ) {
          const key = row[rowKey as keyof T]
          if (typeof key === 'string' || typeof key === 'number') {
            return key
          }
        }
      }
      return index
    },
    overscan: 5,
  })

  const colVirtualizer = useVirtualizer({
    count: columns.length,
    getScrollElement: () => outerRef.current,
    estimateSize: (index) => columnWidths?.[index] ?? 100,
    horizontal: true,
    getItemKey: (index: number): React.Key => columns[index].id ?? index,
    overscan: 1,
    rangeExtractor: (range) => {
      const result = defaultRangeExtractor(range)
      if (result[0] !== 0) {
        result.unshift(0)
      }
      if (
        hasStickyRightColumn &&
        result[result.length - 1] !== columns.length - 1
      ) {
        result.push(columns.length - 1)
      }
      return result
    },
  })

  useEffect(() => {
    colVirtualizer.measure()
  }, [colVirtualizer, columnWidths])

  const setGivenRowData = useMemoizedIndexCallback(setRowData, 1)
  const deleteGivenRow = useMemoizedIndexCallback(deleteRows, 0)
  const duplicateGivenRow = useMemoizedIndexCallback(duplicateRows, 0)
  const insertAfterGivenRow = useMemoizedIndexCallback(insertRowAfter, 0)

  const selectionColMin = selection?.min.col ?? activeCell?.col
  const selectionColMax = selection?.max.col ?? activeCell?.col
  const selectionMinRow = selection?.min.row ?? activeCell?.row
  const selectionMaxRow = selection?.max.row ?? activeCell?.row

  return (
    <div
      ref={outerRef}
      className="dsg-container"
      onScroll={onScroll}
      style={{ height: displayHeight }}
    >
      
      <div
        ref={innerRef}
        style={{
          width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
          height: rowVirtualizer.getTotalSize(),
        }}
      >
        {fakeHeader}
        {headerRowHeight > 0 && (
          <div
            className={cx('dsg-row', 'dsg-row-header')}
            style={{
              width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
              height: headerRowHeight,
            }}
          >
            {colVirtualizer.getVirtualItems().map((col) => (
              <CellComponent
                key={col.key}
                gutter={col.index === 0}
                stickyRight={
                  hasStickyRightColumn && col.index === columns.length - 1
                }
                width={col.size}
                left={col.start}
                className={cx(
                  'dsg-cell-header',
                  selectionColMin !== undefined &&
                    selectionColMax !== undefined &&
                    selectionColMin <= col.index - 1 &&
                    selectionColMax >= col.index - 1 &&
                    'dsg-cell-header-active',
                  columns[col.index].headerClassName
                )}
              >
                <div className="dsg-cell-header-container">
                  <span>{columns[col.index].title}</span>
                  {columns[col.index]?.tooltip && (
                    <div className="tooltip">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_5208_48884)">
                          <path
                            d="M7.9987 14.6668C4.3167 14.6668 1.33203 11.6822 1.33203 8.00016C1.33203 4.31816 4.3167 1.3335 7.9987 1.3335C11.6807 1.3335 14.6654 4.31816 14.6654 8.00016C14.6654 11.6822 11.6807 14.6668 7.9987 14.6668ZM7.33203 10.0002V11.3335H8.66536V10.0002H7.33203ZM8.66536 8.9035C9.20114 8.74201 9.6611 8.39346 9.96147 7.92132C10.2618 7.44918 10.3826 6.88487 10.3019 6.33114C10.2211 5.77742 9.9441 5.27112 9.52137 4.90447C9.09864 4.53781 8.55828 4.33519 7.9987 4.3335C7.45927 4.33345 6.93647 4.52027 6.51923 4.86216C6.10198 5.20405 5.81604 5.67992 5.71003 6.20883L7.01803 6.47083C7.05515 6.28512 7.14424 6.11376 7.27494 5.97671C7.40564 5.83965 7.57257 5.74252 7.75631 5.69663C7.94006 5.65074 8.13305 5.65797 8.31284 5.71748C8.49264 5.77698 8.65184 5.88632 8.77192 6.03277C8.892 6.17922 8.96803 6.35676 8.99115 6.54472C9.01428 6.73269 8.98355 6.92336 8.90254 7.09455C8.82154 7.26574 8.69359 7.4104 8.53358 7.51172C8.37357 7.61303 8.18808 7.66682 7.9987 7.66683C7.82189 7.66683 7.65232 7.73707 7.52729 7.86209C7.40227 7.98712 7.33203 8.15668 7.33203 8.3335V9.3335H8.66536V8.9035Z"
                            fill="#747678"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5208_48884">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span
                        className="tooltiptext"
                        dangerouslySetInnerHTML={{
                          __html: columns[col.index].tooltip ?? '',
                        }}
                      />
                    </div>
                  )}
                </div>
              </CellComponent>
            ))}
          </div>
        )}
        {rowVirtualizer.getVirtualItems().map((row) => {
          const rowActive = Boolean(
            row.index >= (selectionMinRow ?? Infinity) &&
              row.index <= (selectionMaxRow ?? -Infinity)
          )
          return (
            <div
              key={row.key}
              className={cx(
                'dsg-row',
                typeof rowClassName === 'string' ? rowClassName : null,
                typeof rowClassName === 'function'
                  ? rowClassName({
                      rowData: data[row.index],
                      rowIndex: row.index,
                    })
                  : null
              )}
              style={{
                height: row.size,
                top: row.start,
                width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
              }}
            >
              {colVirtualizer.getVirtualItems().map((col) => {
                const colCellClassName = columns[col.index].cellClassName
                const disabled = columns[col.index].disabled
                const Component = columns[col.index].component
                const cellDisabled =
                  disabled === true ||
                  (typeof disabled === 'function' &&
                    disabled({
                      rowData: data[row.index],
                      rowIndex: row.index,
                    }))
                const cellIsActive =
                  activeCell?.row === row.index &&
                  activeCell.col === col.index - 1

                return (
                  <CellComponent
                    key={col.key}
                    gutter={col.index === 0}
                    stickyRight={
                      hasStickyRightColumn && col.index === columns.length - 1
                    }
                    active={col.index === 0 && rowActive}
                    disabled={cellDisabled}
                    className={cx(
                      typeof colCellClassName === 'function'
                        ? colCellClassName({
                            rowData: data[row.index],
                            rowIndex: row.index,
                            columnId: columns[col.index].id,
                          })
                        : colCellClassName,
                      typeof cellClassName === 'function'
                        ? cellClassName({
                            rowData: data[row.index],
                            rowIndex: row.index,
                            columnId: columns[col.index].id,
                          })
                        : cellClassName
                    )}
                    width={col.size}
                    left={col.start}
                  >
                    <Component
                      rowData={data[row.index]}
                      getContextMenuItems={getContextMenuItems}
                      disabled={cellDisabled}
                      active={cellIsActive}
                      columnIndex={col.index - 1}
                      rowIndex={row.index}
                      focus={cellIsActive && editing}
                      deleteRow={deleteGivenRow(row.index)}
                      duplicateRow={duplicateGivenRow(row.index)}
                      stopEditing={stopEditing}
                      insertRowBelow={insertAfterGivenRow(row.index)}
                      setRowData={setGivenRowData(row.index)}
                      columnData={columns[col.index].columnData}
                    />
                  </CellComponent>
                )
              })}
            </div>
          )
        })}
        {children}
      </div>
    </div>
  )
}
