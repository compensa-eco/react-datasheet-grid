import React, { useState } from 'react'
import {
  checkboxColumn,
  Column,
  DataSheetGrid,
  DynamicDataSheetGrid,
  floatColumn,
  keyColumn,
  percentColumn,
  textColumn,
} from '../../src'
import '../../src/style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
  percentage?: any
  float?: any
}

function App() {
  const [data, setData] = useState<Row[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'active'>('active', checkboxColumn),
      title: 'Active',
      grow: 0.5,
    },
    {
      ...keyColumn<Row, 'firstName'>('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
    },
    {
      ...keyColumn<Row, 'percentage'>('percentage', percentColumn),
      title: 'Percentage',
    },
    {
      ...keyColumn<Row, 'float'>('float', floatColumn),
      title: 'Float',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
    },
    {
      ...keyColumn<Row, 'percentage'>('percentage', percentColumn),
      title: 'Percentage',
    },
    {
      ...keyColumn<Row, 'float'>('float', floatColumn),
      title: 'Float',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
    },
    {
      ...keyColumn<Row, 'percentage'>('percentage', percentColumn),
      title: 'Percentage',
    },
    {
      ...keyColumn<Row, 'float'>('float', floatColumn),
      title: 'Float',
    },
  ]

  const tableColumn = [
    { title: 'Local de residência e trabalho', width: 920 },
    { title: 'Dias trabalhados presencialmente', width: 296 },
    { title: 'Dias trabalhados em home-office', width: 300 },
    { title: 'Local de residência e trabalho', width: 1920 },
    { title: 'Dias trabalhados presencialmente', width: 1296 },
    { title: 'Dias trabalhados em home-office', width: 300 },
  ];

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      {/* <DataSheetGrid value={data} onChange={setData} columns={columns} >
        <p>Some content</p>
       </DataSheetGrid> */}

       <DynamicDataSheetGrid value={data} onChange={setData} columns={columns}>
        
        <div className="overflow-x-hidden " >
          <table className="w-full min-w-full">
            <thead>
              <tr>
                {tableColumn.map((item, index) => (
                  <th
                    key={index}
                    style={{
                      minWidth: `${item.width}px`,
                      width: `${item.width}px`,
                    }}
                    className={`bg-gray-50 border-b border-l border-gray-200 px-4 py-2 font-semibold text-sm text-gray-600
                
                `}
                  >
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
          </DynamicDataSheetGrid>
    </div>
  )
}

export default App
