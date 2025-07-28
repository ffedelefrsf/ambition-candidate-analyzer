import React from 'react';

type Props<T> = {
  items: T[];
  additionalCustomRow?: React.ReactNode | ((idx: number) => React.ReactNode);
};

function snakeCaseToTitleCase(snakeCase: string) {
  if (!snakeCase) return '';

  return snakeCase.replace(/_/g, ' '); // Insert space before capitals
}

export class Table<T extends Record<string, string>> extends React.Component<Props<T>> {
  constructor(props: Props<T>) {
    super(props);
  }

  render() {
    const { items, additionalCustomRow } = this.props;

    if (items.length === 0) {
      return (
        <div>
          <p>No data.</p>
        </div>
      );
    }

    const itemWithAllHeaders = items.reduce((prevValue, item) => {
      if (Object.keys(item).length > Object.keys(prevValue).length) {
        prevValue = item;
      }
      return prevValue;
    }, {});

    const headers = Object.keys(itemWithAllHeaders);
    const formattedHeaders = headers.map((key) => snakeCaseToTitleCase(key));

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 text-left text-sm font-semibold dark:bg-gray-800">
            <tr>
              {formattedHeaders.map((header, idx) => (
                <th
                  key={`td-${idx}`}
                  className="border p-2 capitalize dark:border-gray-700"
                >
                  {header}
                </th>
              ))}
              {additionalCustomRow && (
                <th className="border p-2 capitalize dark:border-gray-700" />
              )}
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {headers.map((header, idx) => (
                  <td key={`td-${idx}`} className="border p-2 dark:border-gray-700">
                    {item[header]}
                  </td>
                ))}
                {additionalCustomRow && (
                  <td className="border p-2 dark:border-gray-700">
                    {typeof additionalCustomRow === 'function'
                      ? additionalCustomRow(index)
                      : additionalCustomRow}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
