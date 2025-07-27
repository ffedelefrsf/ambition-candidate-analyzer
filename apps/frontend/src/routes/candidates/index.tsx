import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Table } from '../../components/Table';

export const Route = createFileRoute('/candidates/')({
  component: () => <CandidatesPage />,
});

type State = {
  candidates: {
    id: string;
    name: string;
    profileShortSummary: string;
    salaryExpectation?: string;
    resumeURL: string;
  }[];
};

type TableCandidate = Omit<State['candidates'][number], 'resumeURL'>;

class CandidatesPage extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      candidates: [
        {
          id: '1',
          name: 'Jane Doe',
          profileShortSummary: 'Frontend specialist with 5 years of experience.',
          salaryExpectation: '$30/hr',
          resumeURL: '/resumes/jane_doe.pdf',
        },
        {
          id: '2',
          name: 'John Smith',
          profileShortSummary: 'Frontend specialist with 5 years of experience.',
          resumeURL: '/resumes/john_smith.pdf',
        },
      ],
    };
  }

  handleRemoval = (candidateId: string) => {
    console.log('removing', candidateId);
    this.setState((prevState) => ({
      ...prevState,
      candidates: prevState.candidates.filter(
        (candidate) => candidate.id !== candidateId,
      ),
    }));
  };

  render() {
    return (
      <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Candidates</h1>
          <Link
            to="/candidates/create"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Add Candidate
          </Link>
        </header>

        <Table
          items={this.state.candidates.map((candidate) => {
            const copy: TableCandidate & {
              resumeURL?: string;
            } = {
              ...candidate,
            };
            delete copy.resumeURL;
            return copy;
          })}
          additionalCustomRow={(index: number) => (
            <div className="flex gap-4">
              <a
                href={this.state.candidates[index].resumeURL}
                download
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Download resume
              </a>
              <button
                className="cursor-pointer text-red-500 hover:underline"
                onClick={() => this.handleRemoval(this.state.candidates[index].id)}
              >
                Remove
              </button>
            </div>
          )}
        />
      </div>
    );
  }
}
