import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Table } from '../../components/Table';

// TODO: Make env its own package that pre-validates required env vars using schema validation// TODO: Make env its own package that pre-validates required env vars using schema validation
const { VITE_API_BASE_URL } = import.meta.env;

export const Route = createFileRoute('/candidates/')({
  component: () => <CandidatesPage />,
});

type State = {
  candidates: (Omit<RawCandidate, 'expected_salary'> & {
    expected_salary_per_hour: string;
    resumeURL: string;
  })[];
  isLoading: boolean;
};

type RawCandidate = {
  id: string;
  name: string;
  expected_salary?: string;
  resume_id: string;
};

type TableCandidate = Omit<State['candidates'][number], 'resumeURL'>;

class CandidatesPage extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      candidates: [],
      isLoading: true,
    };
  }

  componentDidMount(): void {
    fetch(`${VITE_API_BASE_URL}/candidates/`)
      .then((response) => response.json())
      // TODO: Schema-validate the response
      .then((candidates) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
          candidates: candidates.map((candidate: RawCandidate) => ({
            ...candidate,
            expected_salary_per_hour: `$ ${candidate.expected_salary}`,
            resumeURL: `${VITE_API_BASE_URL}/candidates/${candidate.id}/download-resume`,
          })),
        }));
      });
  }

  handleRemoval = async (candidateId: string) => {
    const response = await fetch(`${VITE_API_BASE_URL}/candidates/${candidateId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      // TODO: Improve error handling
      alert("Couldn't remove candidate");
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      candidates: prevState.candidates.filter(
        (candidate) => candidate.id !== candidateId,
      ),
    }));
  };

  render() {
    // TODO: Improve loading state. Skeletons or loader
    if (this.state.isLoading) {
      return <span>Loading...</span>;
    }

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
          // TODO: Extend Edit as well here
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
