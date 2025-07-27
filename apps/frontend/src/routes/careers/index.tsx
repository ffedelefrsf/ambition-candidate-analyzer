import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Table } from '../../components/Table';
import type { Career } from './types';

export const Route = createFileRoute('/careers/')({
  component: () => <CareersEntrypoint />,
});

type State = {
  careers: Career[];
};

class CareersEntrypoint extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      careers: [
        {
          id: '1',
          position: 'Frontend Developer',
          description: 'Build UI components',
          requirements: 'React, JavaScript, HTML/CSS',
          niceToHave: 'Tailwind, Figma experience',
          rateRange: '$40 - $60/hr',
        },
      ],
    };
  }

  handleCreateCareer = () => {
    // Placeholder for future logic (e.g. open modal or navigate)
    alert('Create Career button clicked');
  };

  render() {
    return (
      <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Careers</h1>
          <Link
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            to="/careers/create"
            // TODO: extend this functionality. Out of scope
            disabled
          >
            + Add Career
          </Link>
        </header>

        <Table
          items={this.state.careers}
          additionalCustomRow={(index: number) => (
            <Link
              className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
              to={`/careers/$careerId/find-candidate`}
              params={{ careerId: this.state.careers[index].id }}
            >
              Find best match
            </Link>
          )}
        />
      </div>
    );
  }
}
